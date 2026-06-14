// 镜心 · 入口
import { useEffect, useState } from 'react';
import { useStore } from './store';
import { TopBar } from './components/TopBar';
import { Prologue } from './pages/Prologue';
import { Path } from './pages/Path';
import { Way } from './pages/Way';
import { Reflection } from './pages/Reflection';

export function App() {
  const { phase } = useStore();
  const [currentPhase, setCurrentPhase] = useState(phase);

  // 阶段变化：先 600ms 翻页退出，再切换到新页面（带入场动画）
  useEffect(() => {
    if (phase === currentPhase) return;
    // 立即回到顶部（在退出动画期间就完成，新页面出现时已在顶端）
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => setCurrentPhase(phase), 600);
    return () => clearTimeout(timer);
  }, [phase, currentPhase]);

  return (
    <>
      <a className="jx-skip-link" href="#main-content">
        跳至正文
      </a>
      <TopBar />
      <main
        id="main-content"
        tabIndex={-1}
        className="jx-page-enter"
        key={currentPhase}
      >
        {currentPhase === 'prologue' && <Prologue key="prologue" />}
        {currentPhase === 'path' && <Path key="path" />}
        {currentPhase === 'way' && <Way key="way" />}
        {currentPhase === 'reflection' && <Reflection key="reflection" />}
      </main>
    </>
  );
}
