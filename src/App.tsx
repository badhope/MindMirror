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
  const [animClass, setAnimClass] = useState('jx-page-enter');
  const [currentPhase, setCurrentPhase] = useState(phase);

  // 页面切换时执行翻页动画
  useEffect(() => {
    if (phase !== currentPhase) {
      setAnimClass('jx-page-exit');
      const timer = setTimeout(() => {
        setCurrentPhase(phase);
        setAnimClass('jx-page-enter');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [phase, currentPhase]);

  // 页面切换时滚动到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPhase]);

  return (
    <>
      <a className="jx-skip-link" href="#main-content">
        跳至正文
      </a>
      <TopBar />
      <main
        id="main-content"
        tabIndex={-1}
        className={animClass}
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
