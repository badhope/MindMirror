import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Brain, Dumbbell, User, Settings, X } from 'lucide-react'
import { clsx } from 'clsx'
import { ANIMATION } from '../utils/animation-config'

const menuItems = [
  { path: '/app/home', label: '首页', icon: Home },
  { path: '/app/assessments', label: '测评', icon: Brain },
  { path: '/app/training', label: '训练', icon: Dumbbell },
  { path: '/app/profile', label: '我的', icon: User },
]

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: ANIMATION.FADE_DURATION,
      ease: 'easeOut'
    }
  }
}

export default function SideDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION.FADE_DURATION }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30 
            }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-slate-950 border-r border-violet-500/20 z-50 shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => {
                    navigate('/app/home')
                    onClose()
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-7 h-7">
                      <path
                        d="M25 80 Q25 30 50 30 L55 20 L60 30 Q75 30 75 80 L60 80 Q60 50 55 50 L50 55 L45 50 Q40 50 40 80 Z"
                        fill="none"
                        stroke="url(#drawerGold)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="drawerGold" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#d4af37" />
                          <stop offset="50%" stopColor="#f5e6c8" />
                          <stop offset="100%" stopColor="#d4af37" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">心镜</h1>
                    <p className="text-xs text-white/40">MindMirror</p>
                  </div>
                </button>
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </button>
              </div>

              <nav className="space-y-3">
                {menuItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path || 
                    (item.path === '/app/home' && location.pathname === '/app') ||
                    (item.path !== '/app/home' && location.pathname.startsWith(item.path))
                  
                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path)
                        onClose()
                      }}
                      className={clsx(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                        isActive 
                          ? 'bg-gradient-to-r from-violet-500/20 to-blue-500/20 text-violet-400 border border-violet-500/20'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      )}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  )
                })}
              </nav>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-violet-500/10">
              <motion.button
                onClick={() => {
                  navigate('/app/settings')
                  onClose()
                }}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  location.pathname === '/app/settings'
                    ? 'bg-gradient-to-r from-violet-500/20 to-blue-500/20 text-violet-400 border border-violet-500/20'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                )}
                whileTap={{ scale: 0.98 }}
              >
                <Settings size={20} />
                <span className="font-medium">设置</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
