import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Assessments } from './pages/Assessments';
import AssessmentDetail from './pages/AssessmentDetail';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { About } from './pages/About';
import { Sidebar, MenuButton } from './components/Sidebar';
import './index.css';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* 导航栏 */}
        <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
                  🧠
                </div>
                <span className="hidden sm:inline">心测助手</span>
                <span className="sm:hidden">心测</span>
              </Link>
              
              {/* 桌面端导航链接 - 隐藏，都放在侧边栏 */}
              <div className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                  首页
                </Link>
                <Link to="/assessments" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                  测评
                </Link>
                {/* 登录占位 */}
                <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium">
                  登录
                </button>
              </div>
              
              {/* 侧边栏菜单按钮 - 始终显示在最右边 */}
              <MenuButton />
            </div>
          </div>
        </nav>

        {/* 侧边栏 */}
        <Sidebar />

        {/* 主内容区 */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/assessments/:id" element={<AssessmentDetail />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/* 页脚 */}
        <footer className="mt-auto border-t border-slate-200 py-6 sm:py-10 bg-white/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-slate-500">
            <p className="text-sm sm:text-lg">© 2024 心测助手 - 让每一次探索都有意义</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
