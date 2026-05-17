import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Lock, Play, Brain, Heart, Users, Briefcase, Sun, Sparkles, Gamepad2, Zap, Compass, Target, TrendingUp, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore, type TrainingRecord } from '../../store'
import { useResponsive } from '../../hooks/useResponsive'
import {
  FOUNDATION_TRAININGS,
  COGNITION_TRAININGS_FULL,
  EMOTION_TRAININGS_FULL,
  ATTACHMENT_TRAININGS_FULL,
  SOCIAL_TRAININGS_FULL,
  FUN_TRAININGS_FULL,
  getRecommendedTrainings,
} from '../data/training-library'
import {
  ALL_TRAINING_TRACKS,
  checkLevelUnlocked,
  type UserProgress
} from '../data/training-levels'
import TrainingGuide from '../components/training/TrainingGuide'
import { ANIMATION } from '../utils/animation-config'

type TabType = 'guide' | 'recommended' | 'emotion' | 'cognition' | 'attachment' | 'social' | 'career' | 'fun'

const TRACK_CONFIG = {
  guide: { label: '智能推荐', icon: Compass, gradient: 'from-violet-500 to-purple-500' },
  recommended: { label: '精选训练', icon: Sparkles, gradient: 'from-pink-500 to-rose-500' },
  emotion: { label: '情绪管理', icon: Sun, gradient: 'from-amber-500 to-rose-500' },
  cognition: { label: '思维认知', icon: Brain, gradient: 'from-blue-500 to-cyan-500' },
  attachment: { label: '亲密关系', icon: Heart, gradient: 'from-pink-500 to-rose-500' },
  social: { label: '人际社交', icon: Users, gradient: 'from-emerald-500 to-teal-500' },
  career: { label: '职业发展', icon: Briefcase, gradient: 'from-blue-500 to-violet-500' },
  fun: { label: '趣味娱乐', icon: Gamepad2, gradient: 'from-orange-500 to-amber-500' },
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

export default function Training() {
  const { completedAssessments: assessmentHistory, getMoodForDate, results, trainingRecords: storeTrainingRecords } = useAppStore()
  const { isDesktop } = useResponsive()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('guide')

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const todayMood = getMoodForDate(today)

  const trainingRecords = useMemo(() => {
    try {
      const localStorageRecords = JSON.parse(localStorage.getItem('training-records') || '[]') as TrainingRecord[]
      return storeTrainingRecords.length > 0 ? storeTrainingRecords : localStorageRecords
    } catch {
      return storeTrainingRecords
    }
  }, [storeTrainingRecords])

  const lastTraining = trainingRecords[trainingRecords.length - 1]

  const bigfiveResult = useMemo(() => {
    try {
      return results?.['bigfive']?.data?.dimensions
    } catch {
      return undefined
    }
  }, [results])

  const userProgress: UserProgress = useMemo(() => ({
    completedLevels: {},
    completedTrainings: trainingRecords.map(r => r.programId),
    completedAssessments: assessmentHistory.map(a => a.id)
  }), [trainingRecords, assessmentHistory])
  
  const recommendedTrainings = getRecommendedTrainings(todayMood?.mood, bigfiveResult)

  const displayTrainings = 
    activeTab === 'guide' ? [] :
    activeTab === 'recommended' ? recommendedTrainings :
    activeTab === 'emotion' ? EMOTION_TRAININGS_FULL :
    activeTab === 'cognition' ? COGNITION_TRAININGS_FULL :
    activeTab === 'attachment' ? ATTACHMENT_TRAININGS_FULL :
    activeTab === 'social' ? SOCIAL_TRAININGS_FULL :
    activeTab === 'career' ? FOUNDATION_TRAININGS.filter(t => t.category === 'career') :
    FUN_TRAININGS_FULL

  const isTrainingUnlocked = (trainingId: string): boolean => {
    for (const track of ALL_TRAINING_TRACKS) {
      for (const level of track.levels) {
        if (checkLevelUnlocked(track.id, level.level, userProgress)) {
          if (level.trainings.some(t => t.id === trainingId)) {
            return true
          }
        }
      }
    }
    return true
  }

  if (activeTab === 'guide') {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-4 md:p-6"
      >
        <TrainingGuide />
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 space-y-6"
    >
      <motion.div variants={itemVariants} className="md:hidden">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          💪 我的训练
        </h2>
        <p className="text-white/40">心灵健身房</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        {lastTraining ? (
          <div className="bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl p-5 border border-violet-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                🔥
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">继续你的训练</h3>
                <p className="text-sm text-white/50">已完成 {trainingRecords.length} 个训练</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-violet-400">{trainingRecords.length}</div>
                <div className="text-xs text-white/40">已完成</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">进度</span>
                <span className="text-white/80 font-medium">{Math.min(trainingRecords.length * 10, 100)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(trainingRecords.length * 10, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 h-full rounded-full"
                />
              </div>
            </div>

            <button 
              onClick={() => navigate('/app/training/emotion-anchoring')}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-500/25"
            >
              <Play size={20} fill="currentColor" />
              开始今日训练
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-violet-500/20 text-center backdrop-blur-sm">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg">
              🎯
            </div>
            <h3 className="font-semibold text-lg mb-2">开始你的第一个训练</h3>
            <p className="text-sm text-white/50 mb-5">每天5分钟，看见更好的自己</p>
            <button 
              onClick={() => navigate('/app/training/emotion-anchoring')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-500/25"
            >
              <Play size={20} fill="currentColor" />
              开始体验
            </button>
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 rounded-2xl">
          {(Object.keys(TRACK_CONFIG) as TabType[]).map((tabId) => {
            const config = TRACK_CONFIG[tabId]
            const Icon = config.icon
            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`flex-1 min-w-[70px] py-2.5 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${activeTab === tabId
                  ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg shadow-violet-500/20`
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{config.label}</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className={`grid gap-4 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {displayTrainings.map((plan, i) => {
            const unlocked = isTrainingUnlocked(plan.id)
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: ANIMATION.FADE_DURATION, delay: ANIMATION.INITIAL_DELAY + i * ANIMATION.STAGGER_DELAY }}
                onClick={() => unlocked && navigate(`/app/training/${plan.id}`)}
                className={`rounded-2xl p-5 border transition-all ${
                  unlocked 
                    ? `cursor-pointer hover:scale-[1.02] group ${
                        plan.category === 'fun'
                          ? 'bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-500/10 border-amber-500/20 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10'
                          : 'bg-gradient-to-br from-white/8 to-white/5 border-white/10 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10'
                      }`
                    : 'bg-white/5 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-2xl ${!unlocked ? 'grayscale' : ''}`}>{plan.icon}</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          plan.category === 'fun'
                            ? 'bg-amber-500/20 text-amber-300'
                            : plan.level === 1 ? 'bg-emerald-500/20 text-emerald-300'
                            : plan.level === 2 ? 'bg-blue-500/20 text-blue-300'
                            : plan.level === 3 ? 'bg-amber-500/20 text-amber-300'
                            : plan.level === 4 ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          <Zap size={10} className={unlocked ? '' : 'opacity-0'} />
                          L{plan.level} {plan.levelLabel || ''}
                        </span>
                        <span className="text-xs text-white/40 flex items-center gap-1">
                          <Clock size={10} />
                          {plan.duration}
                        </span>
                      </div>
                    </div>
                    <h4 className={`font-semibold text-lg mb-2 ${!unlocked ? 'text-white/50' : ''}`}>{plan.title}</h4>
                    <p className="text-sm text-white/50 mb-3 line-clamp-2">
                      {unlocked ? plan.benefits[0] : '完成前置训练后解锁'}
                    </p>
                    {unlocked && (
                      <div className="flex gap-1.5 flex-wrap">
                        {plan.exercises.slice(0, 3).map((e, j) => (
                          <span key={j} className="inline-block px-2 py-1 rounded-lg text-xs bg-white/8 text-white/50">
                            {e.title}
                          </span>
                        ))}
                        {plan.exercises.length > 3 && (
                          <span className="inline-block px-2 py-1 rounded-lg text-xs bg-white/8 text-white/50">
                            +{plan.exercises.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    {unlocked ? (
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-violet-500 group-hover:to-purple-500 transition-all group-hover:scale-110">
                        <ChevronRight size={20} className="text-white/40 group-hover:text-white transition-all" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Lock size={18} className="text-white/30" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div 
          onClick={() => navigate('/app/growth')}
          className="bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl p-5 border border-violet-500/20 cursor-pointer hover:scale-[1.01] transition-all hover:shadow-lg hover:shadow-violet-500/10 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 flex items-center justify-center">
                <TrendingUp size={24} className="text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">查看我的完整成长报告</h3>
                <p className="text-sm text-white/50 mt-1">
                  6大核心能力维度 · 全面数据追踪
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

function Clock({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
