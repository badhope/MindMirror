import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';

// 导航项配置
const navItems = [
  {
    id: 'home',
    label: '首页',
    href: '/',
    icon: '🏠'
  },
  {
    id: 'assessments',
    label: '测评中心',
    href: '/assessments',
    icon: '📝'
  },
  {
    id: 'history',
    label: '历史记录',
    href: '/history',
    icon: '📚'
  },
  {
    id: 'settings',
    label: '设置',
    href: '/settings',
    icon: '⚙️'
  },
  {
    id: 'about',
    label: '关于我们',
    href: '/about',
    icon: 'ℹ️'
  }
];

export function Sidebar() {
  const location = useLocation();
  const { isSidebarOpen, setSidebarOpen } = useAppStore();

  // 点击外部区域关闭侧边栏
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  // 路由变化时关闭侧边栏
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  // ESC键关闭侧边栏
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSidebarOpen]);

  return (
    <>
      {/* 遮罩层 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* 侧边栏头部 */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">
                  🧠
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">心测助手</h2>
                  <p className="text-sm text-slate-500">让每一次探索都有意义</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 用户区域 */}
          <div className="p-6 border-b border-slate-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">游客模式</p>
                  <p className="text-xs text-slate-500">登录后体验更多功能</p>
                </div>
              </div>
              <button className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors text-sm font-medium">
                立即登录
              </button>
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all group',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                    )}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* 底部信息 */}
          <div className="p-6 border-t border-slate-200">
            <div className="text-center text-sm text-slate-500">
              <p>© 2024 心测助手</p>
              <p className="mt-1 text-xs">让每一次探索都有意义</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// 汉堡菜单按钮组件
export function MenuButton() {
  const { toggleSidebar } = useAppStore();

  return (
    <button
      onClick={toggleSidebar}
      className="p-2.5 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all"
      aria-label="打开菜单"
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        <span className="w-full h-0.5 bg-current rounded-full transition-all"></span>
        <span className="w-full h-0.5 bg-current rounded-full transition-all"></span>
        <span className="w-full h-0.5 bg-current rounded-full transition-all"></span>
      </div>
    </button>
  );
}
