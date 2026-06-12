// 镜心 · 入口
import { lazy, Suspense } from 'react';
import { useStore } from './store';
import { TopBar } from './components/TopBar';

// 路由懒加载
const Prologue = lazy(() => import('./pages/Prologue').then(m => ({ default: m.Prologue })));
const Path = lazy(() => import('./pages/Path').then(m => ({ default: m.Path })));
const Way = lazy(() => import('./pages/Way').then(m => ({ default: m.Way })));
const Reflection = lazy(() => import('./pages/Reflection').then(m => ({ default: m.Reflection })));

// 加载占位符
function LoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <div style={{ fontSize: '1.5rem', color: 'var(--jade)', opacity: 0.6 }}>载入中…</div>
    </div>
  );
}

export function App() {
  const { phase } = useStore();
  return (
    <>
      <a className="jx-skip-link" href="#main-content">
        跳至正文
      </a>
      <TopBar />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<LoadingFallback />}>
          {phase === 'prologue' && <Prologue />}
          {phase === 'path' && <Path />}
          {phase === 'way' && <Way />}
          {phase === 'reflection' && <Reflection />}
        </Suspense>
      </main>
    </>
  );
}
