// 镜心 · 入口
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { useStore } from './store';
import { decodeResume } from './share';
import './index.css';

// C7 主题：首屏前应用 data-theme，避免白闪
(() => {
  try {
    const saved = localStorage.getItem('mindmirror-v1.theme');
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
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// React 挂载完成后清除启动加载页
queueMicrotask(() => {
  const boot = document.getElementById('jx-boot');
  if (boot) {
    boot.style.transition = 'opacity 300ms ease';
    boot.style.opacity = '0';
    setTimeout(() => boot.remove(), 350);
  }
});
