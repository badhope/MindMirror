import { useLocation, useNavigate } from 'react-router-dom'
import { Home, TestTube, Dumbbell, TrendingUp, BookOpen, Users, Sparkles, User, Settings } from 'lucide-react'
import { clsx } from 'clsx'

const mainMenuItems = [
  { path: '/app/home', label: '首页', icon: Home },
  { path: '/app/assessments', label: '测评中心', icon: TestTube },
  { path: '/app/training', label: '训练中心', icon: Dumbbell },
  { path: '/app/progress', label: '我的进度', icon: TrendingUp },
]

const learningMenuItems = [
  { path: '/app/library', label: '知识库', icon: BookOpen },
  { path: '/app/community', label: '社区', icon: Users },
]

const personalMenuItems = [
  { path: '/app/profile', label: '个人中心', icon: User },
  { path: '/app/settings', label: '设置', icon: Settings },
]

export default function SideNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <nav className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">心镜</h1>
            <p className="text-xs text-slate-400">MindMirror</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">主要功能</h3>
            <div className="space-y-1">
              {mainMenuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left',
                      active
                        ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">学习</h3>
            <div className="space-y-1">
              {learningMenuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left',
                      active
                        ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">个人</h3>
            <div className="space-y-1">
              {personalMenuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left',
                      active
                        ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 text-center">
          <p>心镜 v3.0.0</p>
          <p className="mt-1">© 2024 MindMirror</p>
        </div>
      </div>
    </nav>
  )
}
