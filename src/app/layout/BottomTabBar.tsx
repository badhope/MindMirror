import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Brain, Dumbbell, User } from 'lucide-react'
import { clsx } from 'clsx'
import { ANIMATION } from '../utils/animation-config'

const tabs = [
  { path: '/app/home', label: '首页', icon: Home },
  { path: '/app/assessments', label: '测评', icon: Brain },
  { path: '/app/training', label: '训练', icon: Dumbbell },
  { path: '/app/profile', label: '我的', icon: User },
]

export default function BottomTabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-violet-500/20 pb-safe"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30, 
        delay: 0.1 
      }}
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = location.pathname === tab.path || 
            (tab.path === '/app/home' && location.pathname === '/app') ||
            (tab.path !== '/app/home' && location.pathname.startsWith(tab.path))
          
          return (
            <motion.button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={clsx(
                'relative flex flex-col items-center justify-center w-full h-full transition-colors duration-200',
                isActive ? 'text-violet-400' : 'text-white/40'
              )}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: ANIMATION.FADE_DURATION }}
            >
              {isActive && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute top-0 w-12 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              <motion.div
                animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.3, type: 'spring' }}
              >
                <Icon
                  size={24}
                  className={clsx(
                    'transition-all duration-200',
                    isActive && 'drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]'
                  )}
                />
              </motion.div>
              
              <span className={clsx(
                'text-xs mt-1 font-medium transition-all duration-200',
                isActive && 'font-semibold'
              )}>
                {tab.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
