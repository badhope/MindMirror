import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, BookOpen, Award, Settings, ChevronRight, Flame, Brain, Clock, Heart, Share2 } from 'lucide-react'
import { useAppStore } from '../../store'
import { ANIMATION } from '../utils/animation-config'

const MENU_ITEMS = [
  {
    title: '成长数据',
    icon: TrendingUp,
    path: '/app/progress',
    description: '查看你的成长记录',
    color: 'from-violet-500 to-purple-500'
  },
  {
    title: '心理图书馆',
    icon: BookOpen,
    path: '/app/library/articles',
    description: '探索心理学知识',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: '成就徽章',
    icon: Award,
    path: '/app/progress',
    description: '查看已获得的成就',
    color: 'from-amber-500 to-orange-500'
  },
  {
    title: '系统设置',
    icon: Settings,
    path: '/app/settings',
    description: '个性化你的体验',
    color: 'from-slate-500 to-slate-600'
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: ANIMATION.STAGGER_DELAY, delayChildren: 0.05 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: ANIMATION.SLIDE_DURATION, ease: 'easeOut' } }
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { completedAssessments, moodHistory, trainingRecords, user } = useAppStore()

  const totalMinutes = Math.floor(trainingRecords.reduce((s, r) => s + r.duration, 0) / 60)
  const streakDays = moodHistory.length

  const stats = [
    { label: '连续打卡', value: streakDays, unit: '天', icon: Flame, color: 'text-orange-400' },
    { label: '心情记录', value: moodHistory.length, unit: '次', icon: Heart, color: 'text-pink-400' },
    { label: '完成测评', value: completedAssessments.length, unit: '个', icon: Brain, color: 'text-violet-400' },
    { label: '训练时长', value: totalMinutes, unit: '分', icon: Clock, color: 'text-emerald-400' },
  ]

  return (
    <motion.div 
      className="px-4 py-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
          个人中心
        </h1>
        <p className="text-white/50 text-sm">管理你的个人信息</p>
      </motion.div>

      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/15 to-purple-500/10 border border-violet-500/20 p-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-500/20 to-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white">
            {user?.name ? user.name.charAt(0) : '访'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{user?.name || '访客用户'}</h2>
            <p className="text-sm text-white/50">{user?.bio || '开始探索自我'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.03 }}
                className="text-center p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-center mb-2">
                  <Icon size={18} className={stat.color} />
                </div>
                <div className="text-2xl font-bold text-white">
                  {stat.value}<span className="text-xs font-normal text-white/40">{stat.unit}</span>
                </div>
                <div className="text-[11px] text-white/50">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold text-white mb-4">功能菜单</h3>
        
        <div className="space-y-3">
          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.title}
                onClick={() => navigate(item.path)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ x: 3, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold">{item.title}</div>
                  <div className="text-xs text-white/50 mt-1">{item.description}</div>
                </div>
                <ChevronRight size={18} className="text-white/40" />
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <motion.button
          onClick={() => {
            const shareData = {
              title: '心镜 MindMirror',
              text: `我在心镜完成了 ${completedAssessments.length} 个测评，探索自我，成为更好的自己！`,
              url: 'https://github.com/badhope/MindMirror',
            }
            
            if (navigator.share) {
              navigator.share(shareData).catch(() => {
                navigator.clipboard.writeText(shareData.text + '\n' + shareData.url)
              })
            } else {
              navigator.clipboard.writeText(shareData.text + '\n' + shareData.url)
            }
          }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-500/20 text-left"
        >
          <Share2 size={20} className="text-emerald-400 mb-3" />
          <div className="text-white font-semibold">分享应用</div>
          <div className="text-xs text-white/50 mt-1">推荐给朋友</div>
        </motion.button>

        <motion.button
          onClick={() => navigate('/app/settings')}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/15 to-cyan-500/10 border border-blue-500/20 text-left"
        >
          <Settings size={20} className="text-blue-400 mb-3" />
          <div className="text-white font-semibold">系统设置</div>
          <div className="text-xs text-white/50 mt-1">个性化体验</div>
        </motion.button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="text-center pt-4 pb-6"
      >
        <p className="text-xs text-white/20">心镜 MindMirror v3.0</p>
        <p className="text-[11px] text-white/15 mt-1">✨ 照见自己，成为更好的自己</p>
      </motion.div>
      
      <div className="h-4" />
    </motion.div>
  )
}
