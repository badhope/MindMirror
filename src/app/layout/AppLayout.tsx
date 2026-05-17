import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useResponsive } from '@components/layout/useResponsive'
import SideNav from './SideNav'
import BottomTabBar from './BottomTabBar'
import TopNavBar from './TopNavBar'
import SideDrawer from './SideDrawer'
import { ANIMATION } from '../utils/animation-config'

const getTitle = (pathname: string) => {
  if (pathname === '/app' || pathname === '/app/home') return '心镜'
  if (pathname.startsWith('/app/assessments')) return '测评中心'
  if (pathname.startsWith('/app/training')) return '心理训练'
  if (pathname.startsWith('/app/profile')) return '个人中心'
  if (pathname.startsWith('/app/settings')) return '设置'
  if (pathname.startsWith('/app/progress')) return '成长进度'
  if (pathname.startsWith('/app/library')) return '心理图书馆'
  if (pathname.startsWith('/app/community')) return '社区'
  return '心镜'
}

export default function AppLayout() {
  const { isDesktop } = useResponsive()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const pageTitle = getTitle(location.pathname)

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="fixed top-0 left-0 bottom-0 w-80 z-50">
          <SideNav />
        </div>
        
        <div className="pl-80">
          <header className="sticky top-0 z-40 bg-slate-950/50 backdrop-blur-3xl border-b border-white/5">
            <div className="max-w-5xl mx-auto px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {pageTitle}
                  </h1>
                  <p className="text-white/40 text-sm mt-1">
                    {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          <main className="max-w-5xl mx-auto px-8 py-6 pb-8">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: ANIMATION.FADE_DURATION, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <TopNavBar 
        title={pageTitle} 
        onMenuClick={() => setDrawerOpen(true)} 
      />
      
      <SideDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />
      
      <main className="max-w-2xl mx-auto pb-24">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: ANIMATION.FADE_DURATION, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      
      <BottomTabBar />
    </div>
  )
}
