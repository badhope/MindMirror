import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, BookOpen, Trophy, Settings, ChevronRight, Flame, Calendar, Brain, Clock, FileText, Wrench, Headphones, Award, Heart, User } from 'lucide-react'
import { useAppStore } from '../../store'

const MENU_SECTIONS = [
  {
    title: '我的数据',
    items: [
      { id: 'progress', icon: TrendingUp, label: '我的进度', desc: '查看成长数据和统计', path: '/app/profile' },
      { id: 'achievements', icon: Trophy, label: '成就徽章', desc: '已解锁的成就', path: '/app/profile' },
    ]
  },
  {
    title: '心理图书馆',
    items: [
      { id: 'articles', icon: FileText, label: '精选文章', desc: '心理学知识科普', path: '/app/library/articles' },
      { id: 'tools', icon: Wrench, label: '心理工具', desc: '实用心理工具', path: '/app/library/tools' },
      { id: 'resources', icon: Headphones, label: '放松资源', desc: '冥想音乐和白噪音', path: '/app/library/resources' },
    ]
  },
  {
    title: '设置',
    items: [
      { id: 'settings', icon: Settings, label: '系统设置', desc: '主题、通知等', path: '/app/settings' },
    ]
  }
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const { completedAssessments, moodHistory, trainingRecords } = useAppStore()

  const totalMinutes = Math.floor(trainingRecords.reduce((s, r) => s + r.duration, 0) / 60)
  const streakDays = moodHistory.length

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 py-4 space-y-5 max-w-lg mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-pink-500/20 rounded-2xl p-5 border border-violet-500/20"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <User size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">访客用户</h2>
              <p className="text-xs text-white/50">点击登录，同步数据</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: '连续打卡', value: streakDays, unit: '天', icon: Flame, color: 'text-orange-400' },
              { label: '心情记录', value: moodHistory.length, unit: '次', icon: Heart, color: 'text-pink-400' },
              { label: '完成测评', value: completedAssessments.length, unit: '个', icon: Brain, color: 'text-violet-400' },
              { label: '训练时长', value: totalMinutes, unit: '分', icon: Clock, color: 'text-emerald-400' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="text-center"
              >
                <stat.icon size={14} className={`mx-auto mb-1 ${stat.color}`} />
                <div className="text-base font-bold text-white">
                  {stat.value}<span className="text-xs font-normal text-white/40">{stat.unit}</span>
                </div>
                <div className="text-[9px] text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {MENU_SECTIONS.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIndex * 0.1 }}
          >
            <h3 className="text-xs font-medium text-white/40 mb-2 px-1">{section.title}</h3>
            
            <div className="bg-white/5 rounded-xl border border-white/5 divide-y divide-white/5">
              {section.items.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + sectionIndex * 0.1 + i * 0.05 }}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                      <Icon size={18} className="text-violet-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-[10px] text-white/40">{item.desc}</div>
                    </div>
                    <ChevronRight size={16} className="text-white/30" />
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-4"
        >
          <p className="text-[10px] text-white/30">心镜 MindMirror v3.0.0</p>
          <p className="text-[10px] text-white/20 mt-1">照见自己，成为更好的自己</p>
        </motion.div>
      </div>
    </div>
  )
}
