import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar, Flame, Target, ChevronRight, Brain, Clock, Activity } from 'lucide-react'
import { useAppStore, type MoodRecord, type TrainingRecord } from '../../store'
import AdvancedRadarChart from '../../components/charts/AdvancedRadarChart'
import AchievementsPanel from '../components/AchievementsPanel'
import { ANIMATION } from '../utils/animation-config'

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  orange: { bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.2)', text: '#fb923c' },
  pink: { bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.2)', text: '#ec4899' },
  violet: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)', text: '#8b5cf6' },
  emerald: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)', text: '#10b981' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION.STAGGER_DELAY,
      delayChildren: ANIMATION.INITIAL_DELAY
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION.FADE_DURATION, ease: 'easeOut' }
  }
}

export default function Progress() {
  const { moodHistory, completedAssessments, trainingRecords: storeTrainingRecords } = useAppStore()
  const navigate = useNavigate()
  const trainingRecords: TrainingRecord[] = (() => {
    try {
      const localStorageRecords = JSON.parse(localStorage.getItem('training-records') || '[]') as TrainingRecord[]
      return storeTrainingRecords.length > 0 ? storeTrainingRecords : localStorageRecords
    } catch {
      return storeTrainingRecords
    }
  })()

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const moodByDay = last7Days.map(date => {
    const record = moodHistory.find((m: MoodRecord) => m.date === date)
    return {
      date,
      shortDate: date.slice(5),
      mood: record ? record.mood : null,
      emoji: record ? ['😢', '😔', '😐', '😊', '🎉'][record.mood] : '❔'
    }
  })

  const hasMoodData = moodHistory.length > 0
  const hasTrainingData = trainingRecords.length > 0
  const hasAssessmentData = completedAssessments.length > 0

  const streakDays = (() => {
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const hasActivity = moodHistory.some((m: MoodRecord) => m.date === dateStr) || 
        trainingRecords.some((r: TrainingRecord) => new Date(r.completedAt).toISOString().split('T')[0] === dateStr)
      if (hasActivity) streak++
      else if (i > 0) break
    }
    return streak
  })()

  const moodTrend30 = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const dateStr = date.toISOString().split('T')[0]
    const record = moodHistory.find((m: MoodRecord) => m.date === dateStr)
    return {
      date: dateStr,
      day: date.getDate(),
      mood: record?.mood ?? null,
    }
  })

  const trainingByCategory: Record<string, number> = {}
  trainingRecords.forEach((r: TrainingRecord) => {
    trainingByCategory[r.category] = (trainingByCategory[r.category] || 0) + 1
  })

  const radarData = [
    { name: '情绪', score: hasMoodData ? Math.min(100, 30 + moodHistory.length * 8) : 0, maxScore: 100 },
    { name: '认知', score: hasAssessmentData ? Math.min(100, 20 + completedAssessments.length * 10) : 0, maxScore: 100 },
    { name: '社交', score: Math.min(100, (trainingByCategory['social'] || 0) * 15), maxScore: 100 },
    { name: '行动', score: Math.min(100, (trainingByCategory['behavior'] || 0) * 15), maxScore: 100 },
    { name: '趣味', score: Math.min(100, (trainingByCategory['fun'] || 0) * 20), maxScore: 100 },
  ]

  const totalMinutes = Math.floor(trainingRecords.reduce((s: number, r: TrainingRecord) => s + r.duration, 0) / 60)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 space-y-6"
    >
      <motion.div variants={itemVariants} className="md:hidden">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          📈 我的进度
        </h2>
        <p className="text-white/40">数据概览</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-3">
        {[
          { label: '连续打卡', value: streakDays, unit: '天', icon: Flame, color: 'orange' as const },
          { label: '心情记录', value: moodHistory.length, unit: '次', icon: Activity, color: 'pink' as const },
          { label: '完成测评', value: completedAssessments.length, unit: '个', icon: Target, color: 'violet' as const },
          { label: '训练时长', value: totalMinutes, unit: '分', icon: Clock, color: 'emerald' as const },
        ].map((stat, i) => {
          const Icon = stat.icon
          const colors = COLOR_MAP[stat.color]
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ANIMATION.INITIAL_DELAY + i * ANIMATION.STAGGER_DELAY }}
              className="rounded-2xl p-4 border text-center backdrop-blur-sm"
              style={{ backgroundColor: colors.bg, borderColor: colors.border }}
            >
              <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${colors.text}20` }}>
                <Icon size={18} style={{ color: colors.text }} />
              </div>
              <div className="text-2xl font-bold">{stat.value}<span className="text-xs font-normal text-white/40">{stat.unit}</span></div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/8 to-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-lg">
            😊
          </span>
          本周心情变化
        </h3>
        
        {!hasMoodData ? (
          <div className="text-center py-8 text-white/40">
            还没有心情记录，去今日页面打卡吧！
          </div>
        ) : (
          <>
            <div className="flex justify-between items-end h-24 mb-4">
              {moodByDay.map((day, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ANIMATION.INITIAL_DELAY + i * ANIMATION.STAGGER_DELAY }}
                  className="flex-1 flex flex-col items-center"
                >
                  <div className="text-xl mb-2">{day.emoji}</div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: day.mood !== null ? `${(day.mood + 1) * 15}px` : '6px' }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: ANIMATION.INITIAL_DELAY + i * ANIMATION.STAGGER_DELAY }}
                    className="w-10 rounded-t-xl transition-all"
                    style={{ 
                      background: day.mood !== null 
                        ? 'linear-gradient(to top, #8b5cf6, #ec4899)' 
                        : 'rgba(255,255,255,0.1)'
                    }}
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between">
              {moodByDay.map((day, i) => (
                <div key={i} className="flex-1 text-center text-xs text-white/40">
                  {day.shortDate}
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/8 to-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Brain size={16} />
            </span>
            能力均衡度
          </h3>
          <button
            onClick={() => navigate('/app/growth')}
            className="text-sm text-violet-400 flex items-center gap-1 hover:text-violet-300 transition-colors"
          >
            详细分析 <ChevronRight size={14} />
          </button>
        </div>

        {!hasTrainingData && !hasAssessmentData && !hasMoodData ? (
          <div className="text-center py-8 text-white/40">
            开始测评和训练后，这里会显示你的能力雷达图
          </div>
        ) : (
          <AdvancedRadarChart
            dimensions={radarData}
            colorScheme="violet"
            height={240}
            showDataLabels={false}
            animated
          />
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/8 to-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/30 to-blue-500/30 flex items-center justify-center">
            <Calendar size={18} className="text-violet-400" />
          </div>
          30天训练热力图
        </h3>

        {!hasTrainingData ? (
          <div className="text-center py-6 text-white/40 text-sm">
            完成训练后这里会点亮你的训练日历
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1.5">
            {moodTrend30.map((day, i) => {
              const trainingsThisDay = trainingRecords.filter((r: TrainingRecord) => 
                new Date(r.completedAt).toISOString().split('T')[0] === day.date
              ).length
              
              const intensity = trainingsThisDay === 0 ? 0 : Math.min(trainingsThisDay, 3)
              const colors = [
                'bg-white/5',
                'bg-violet-500/30',
                'bg-violet-500/50',
                'bg-violet-500',
              ]
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: ANIMATION.INITIAL_DELAY + i * 0.01 }}
                  className={`aspect-square rounded-lg ${colors[intensity]} ${intensity > 0 ? 'ring-1 ring-violet-500/30 shadow-lg' : ''}`}
                  title={`${day.date}: ${trainingsThisDay} 个训练`}
                />
              )
            })}
          </div>
        )}
        <div className="flex items-center justify-end gap-2 mt-3 text-xs text-white/40">
          <span>无</span>
          <div className="w-4 h-4 rounded-lg bg-white/5" />
          <div className="w-4 h-4 rounded-lg bg-violet-500/30" />
          <div className="w-4 h-4 rounded-lg bg-violet-500/50" />
          <div className="w-4 h-4 rounded-lg bg-violet-500" />
          <span>多</span>
        </div>
      </motion.div>

      <AchievementsPanel />

      <motion.div variants={itemVariants}>
        <div 
          onClick={() => navigate('/app/growth')}
          className="bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl p-5 border border-violet-500/20 cursor-pointer hover:scale-[1.01] transition-all hover:shadow-lg hover:shadow-violet-500/10 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 flex items-center justify-center">
                <Target size={24} className="text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">查看完整成长分析报告</h3>
                <p className="text-sm text-white/50 mt-1">
                  6大核心能力维度 · AI 智能洞察
                </p>
              </div>
            </div>
            <ChevronRight size={24} className="text-violet-400" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
