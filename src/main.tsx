// 镜心 · 入口
import { Component, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { useStore } from './store';
import { decodeResume } from './share';
import './index.css';

// C7 主题：首屏前应用 data-theme，避免白闪
(() => {
  try {
    const saved = localStorage.getItem('mindmirror-v2.theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const theme = saved === 'light' || saved === 'dark' ? saved : prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch {
    /* noop */
  }
})();

// C13 URL 续答：?resume=BASE64
(() => {
  try {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('resume');
    if (r) {
      const s = decodeResume(r);
      if (s) {
        // 等 store mount 后再灌入
        queueMicrotask(() => useStore.getState().importState(s));
        // 清掉 URL 参数，避免泄露
        params.delete('resume');
        const newQ = params.toString();
        const newUrl = window.location.pathname + (newQ ? '?' + newQ : '');
        window.history.replaceState({}, '', newUrl);
      }
    }
  } catch {
    /* noop */
  }
})();

const root = document.getElementById('root');
if (!root) throw new Error('root not found');

// 全局错误边界：捕获 React 渲染异常，避免白屏
class GlobalErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: unknown) {
    // 输出详细错误信息到控制台
    console.error('[GlobalErrorBoundary] 渲染异常:', error);
    console.error('[GlobalErrorBoundary] 组件信息:', info);
    // 尝试输出错误堆栈
    if (error.stack) {
      console.error('[GlobalErrorBoundary] 堆栈:', error.stack);
    }
  }
  render() {
    if (this.state.error) {
      // 移除启动页
      const boot = document.getElementById('jx-boot');
      if (boot) boot.remove();

      return (
        <div
          style={{
            maxWidth: '32rem',
            margin: '4rem auto',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
          }}
        >
          <h2
            style={{
              color: 'var(--cinnabar)',
              fontFamily: 'var(--font-display)',
              marginBottom: '1rem',
            }}
          >
            镜中现影异常
          </h2>
          <p style={{ color: 'var(--ink-faint)', marginBottom: '1rem' }}>
            {this.state.error.message}
          </p>
          <p style={{ color: 'var(--ink-faint)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            请尝试重新加载，或返回首页。
          </p>
          <button
            onClick={() => location.reload()}
            style={{
              padding: '0.6rem 1.5rem',
              background: 'var(--ink)',
              color: 'var(--rice)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
            }}
          >
            重新加载
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

try {
  // 注意：生产环境不开启 React.StrictMode
  // - StrictMode 在 dev 下双渲染有助于发现问题，但生产中会浪费 CPU/内存
  // - 微信内置浏览器等内存受限环境下，双渲染可能导致崩溃白屏
  // - 我们已在 ErrorBoundary 中做了其他鲁棒性保障
  ReactDOM.createRoot(root).render(
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  );
} catch (e) {
  // 如果连 ErrorBoundary 都渲染失败，显示纯 HTML 降级页
  const boot = document.getElementById('jx-boot');
  if (boot) boot.remove();
  root.innerHTML = `
    <div style="max-width:560px;margin:80px auto;padding:24px;text-align:center;font-family:serif;color:#a8322e">
      <h2 style="margin:0 0 12px">加载失败</h2>
      <p style="margin:0 0 16px;color:#5a5a5a">${(e as Error)?.message || String(e)}</p>
      <button onclick="location.reload()" style="padding:8px 16px;background:#a8322e;color:#f5efe0;border:none;cursor:pointer;font-family:serif">重新加载</button>
    </div>
  `;
  throw e;
}

// React 挂载完成后清除启动加载页
// 使用双重 rAF 保证 React 至少完成一帧渲染
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const boot = document.getElementById('jx-boot');
    if (boot && boot.parentNode) {
      boot.style.transition = 'opacity 400ms ease';
      boot.style.opacity = '0';
      setTimeout(() => boot.remove(), 450);
    }
  });
});
