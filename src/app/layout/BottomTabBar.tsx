import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Brain, Dumbbell, User, Sparkles, BookOpen, Heart } from 'lucide-react'
import { clsx } from 'clsx'
import { ANIMATION } from '../utils/animation-config'

const tabs = [
  { path: '/app/home', label: '首页', icon: Home, color: 'from-violet-500 to-purple-500' },
  { path: '/app/assessments', label: '测评', icon: Brain, color: 'from-blue-500 to-cyan-500' },
  { path: '/app/training', label: '训练', icon: Dumbbell, color: 'from-emerald-500 to-teal-500' },
  { path: '/app/profile', label: '我的', icon: User, color: 'from-amber-500 to-orange-500' },
]

export default function BottomTabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-2xl border-t border-white/5 pb-safe"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
    >
      <div className="flex items-center justify-around h-20 max-w-2xl mx-auto">
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          const isActive = location.pathname === tab.path || 
            (tab.path === '/app/home' && location.pathname === '/app') ||
            (tab.path !== '/app/home' && location.pathname.startsWith(tab.path))
          
          return (
            <motion.button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={clsx(
                'relative flex flex-col items-center justify-center w-full h-full transition-all duration-300',
                'hover:opacity-80 active:opacity-70'
              )}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: ANIMATION.FADE_DURATION }}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-1 w-10 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              <motion.div
                animate={{ 
                  scale: isActive ? [1, 1.15, 1.08] : 1,
                  y: isActive ? -3 : 0
                }}
                transition={{ 
                  duration: 0.4, 
                  type: 'spring',
                  bounce: 0.3
                }}
                className="relative"
              >
                {isActive && (
                  <motion.div
                    animate={{ 
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className={clsx('absolute -inset-2 rounded-full bg-gradient-to-br', tab.color, 'opacity-20 blur-md')}
                  />
                )}
                <Icon
                  size={26}
                  className={clsx(
                    'transition-all duration-300 relative z-10',
                    isActive 
                      ? `text-white drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]`
                      : 'text-white/40'
                  )}
                />
              </motion.div>
              
              <span className={clsx(
                'text-xs mt-1 font-medium transition-all duration-300',
                isActive 
                  ? 'text-white font-semibold'
                  : 'text-white/50'
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
