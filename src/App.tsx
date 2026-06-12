// 镜心 · 入口
import { useStore } from './store';
import { TopBar } from './components/TopBar';
import { Prologue } from './pages/Prologue';
import { Path } from './pages/Path';
import { Way } from './pages/Way';
import { Reflection } from './pages/Reflection';

export function App() {
  const { phase } = useStore();
  return (
    <>
      <a className="jx-skip-link" href="#main-content">
        跳至正文
      </a>
      <TopBar />
      <main id="main-content" tabIndex={-1}>
        {phase === 'prologue' && <Prologue />}
        {phase === 'path' && <Path />}
        {phase === 'way' && <Way />}
        {phase === 'reflection' && <Reflection />}
      </main>
    </>
  );
}
