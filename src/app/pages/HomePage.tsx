import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Brain, TrendingUp, Heart, Compass, Zap, Shield, Award, Clock, CheckCircle, Flame } from 'lucide-react'
import { useAppStore } from '../../store'

const MOOD_EMOJIS = ['😢', '😔', '😐', '😊', '🎉']
const MOOD_LABELS = ['很糟糕', '不太好', '一般般', '还不错', '超棒！']

const FEATURED_ASSESSMENTS = [
  {
    id: 'sbti-personality',
    icon: Brain,
    title: 'SBTI人格测试',
    description: '有趣又准的人格测评',
    questions: 24,
    duration: 5,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30'
  },
  {
    id: 'sas-standard',
    icon: TrendingUp,
    title: '焦虑自评量表',
    description: '了解你的焦虑水平',
    questions: 28,
    duration: 5,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'ocean-bigfive',
    icon: Heart,
    title: '大五人格',
    description: '科学的人格模型',
    questions: 28,
    duration: 6,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30'
  },
  {
    id: 'ecr-attachment',
    icon: Sparkles,
    title: '依恋类型',
    description: '探索你的依恋风格',
    questions: 28,
    duration: 6,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30'
  },
]

const TOPICS = [
  { id: 'career', label: '职场发展', emoji: '💼', color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'emotion', label: '情绪管理', emoji: '🌊', color: 'from-violet-500/20 to-purple-500/20' },
  { id: 'relation', label: '人际关系', emoji: '🤝', color: 'from-pink-500/20 to-rose-500/20' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { completedAssessments, moodHistory, recordMood, getMoodForDate } = useAppStore()
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [isMoodConfirmed, setIsMoodConfirmed] = useState(false)

  const hasRecords = completedAssessments.length > 0

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayMood = getMoodForDate(today)
    if (todayMood) {
      setSelectedMood(todayMood.mood)
      setIsMoodConfirmed(true)
    }
  }, [getMoodForDate])

  const handleMoodSelect = (mood: number) => {
    if (isMoodConfirmed) return
    setSelectedMood(mood)
  }

  const confirmMood = () => {
    if (selectedMood !== null) {
      recordMood(selectedMood, MOOD_LABELS[selectedMood])
      setIsMoodConfirmed(true)
    }
  }

  const handleStartAssessment = () => {
    navigate('/app/discover')
  }

  const handleSelectAssessment = (id: string) => {
    navigate(`/legacy/mode-select/${id}`)
  }

  return (
    <div className="min-h-screen">
      <div className="px-3 sm:px-4 md:px-6 py-4 md:py-8 space-y-6 md:space-y-8 max-w-4xl mx-auto">
        <div className="text-center pt-2 pb-4 sm:pt-4 sm:pb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-3 sm:mb-4">
            <Sparkles size={10} className="text-violet-400 sm:size-3" />
            <span className="text-[10px] sm:text-xs text-violet-300">轻松探索，遇见真实的自己</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1.5 sm:mb-2 px-2">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              3分钟
            </span>
            <span className="text-white">，了解真实的自己</span>
          </h1>

          <p className="text-white/50 text-[10px] sm:text-xs md:text-sm px-4">
            {hasRecords
              ? `你已经完成了 ${completedAssessments.length} 项测评，继续探索吧！`
              : '专业的心理测评，帮你更好地了解自己'}
          </p>
        </div>

        <div className="relative mx-3 sm:mx-0">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-2xl sm:rounded-3xl" />
          <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-4 sm:p-6 border border-violet-500/20 backdrop-blur-xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-3 sm:mb-4 shadow-lg shadow-violet-500/30">
                <Zap size={22} className="sm:text-[28px] text-white" />
              </div>

              <h2 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">
                {hasRecords ? '继续你的探索之旅' : '开启你的第一次测评'}
              </h2>
              <p className="text-white/50 text-xs sm:text-sm mb-4 sm:mb-5">
                {hasRecords ? '发现更多关于自己的秘密' : '只需几分钟，收获对自己更深的了解'}
              </p>

              <button
                onClick={handleStartAssessment}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all text-sm sm:text-base"
              >
                <Compass size={16} className="sm:text-[18px]" />
                立即开始测评
              </button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mx-3 sm:mx-0"
        >
          <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-4 sm:p-6 border border-violet-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  🌅
                </span>
                今日心情打卡
              </h3>
              <div className="flex items-center gap-1 text-xs text-white/40">
                <Flame size={12} className="text-orange-400" />
                已连续 {moodHistory.length} 天
              </div>
            </div>

            {isMoodConfirmed && selectedMood !== null ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl sm:text-4xl">{MOOD_EMOJIS[selectedMood]}</span>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <CheckCircle size={20} className="text-emerald-400" />
                  </motion.div>
                </div>
                <span className="text-white/80 text-sm font-medium">
                  今日心情：{MOOD_LABELS[selectedMood]}
                </span>
                <p className="text-white/40 text-xs mt-1">已完成打卡，明天见！</p>
              </motion.div>
            ) : (
              <>
                {selectedMood !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-3 p-2 rounded-xl bg-violet-500/10 border border-violet-500/20"
                  >
                    <span className="text-white/70 text-sm">
                      已选择：{MOOD_EMOJIS[selectedMood]} {MOOD_LABELS[selectedMood]}
                    </span>
                  </motion.div>
                )}

                <div className="flex justify-between gap-2 mb-4">
                  {MOOD_EMOJIS.map((emoji, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleMoodSelect(i)}
                      className={`flex-1 h-16 sm:h-20 rounded-xl flex flex-col items-center justify-center transition-all relative overflow-hidden ${selectedMood === i
                        ? 'bg-gradient-to-br from-violet-500/30 to-purple-500/30 border-2 border-violet-500/50'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10'}
                      `}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      {selectedMood === i && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                      <span className="relative text-xl sm:text-2xl">{emoji}</span>
                      <span className="relative text-[10px] sm:text-xs text-white/60 mt-0.5">{MOOD_LABELS[i]}</span>
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={confirmMood}
                  disabled={selectedMood === null}
                  className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                    selectedMood !== null
                      ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 shadow-lg shadow-violet-500/30'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                  whileHover={selectedMood !== null ? { scale: 1.02 } : {}}
                  whileTap={selectedMood !== null ? { scale: 0.98 } : {}}
                >
                  确认打卡
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        <div className="px-3 sm:px-0">
          <h3 className="text-sm sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Sparkles size={14} className="sm:text-[18px] text-amber-400" />
            你可能感兴趣的
          </h3>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {FEATURED_ASSESSMENTS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectAssessment(item.id)}
                  className={`relative overflow-hidden rounded-xl p-3 sm:p-4 ${item.bgColor} border ${item.borderColor} text-left group`}
                >
                  <div className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${item.color} opacity-10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/3`} />

                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-2 sm:mb-3 shadow-lg`}>
                    <Icon size={14} className="sm:text-[18px] text-white" />
                  </div>

                  <h4 className="font-semibold text-white text-xs sm:text-sm mb-0.5 sm:mb-1 group-hover:text-violet-300 transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-white/40 truncate">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-white/40 mt-1 sm:mt-2">
                    <span className="flex items-center gap-1">
                      <span>{item.questions}题</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      <span>{item.duration}分钟</span>
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="px-3 sm:px-0">
          <h3 className="text-sm sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Brain size={14} className="sm:text-[18px] text-violet-400" />
            精选专题
          </h3>

          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => navigate('/app/discover')}
                className={`flex-shrink-0 px-4 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${topic.color} border border-white/10 backdrop-blur-sm flex items-center gap-1.5 sm:gap-2 hover:border-white/20 transition-colors`}
              >
                <span className="text-sm sm:text-base">{topic.emoji}</span>
                <span className="text-white font-medium text-xs sm:text-sm whitespace-nowrap">{topic.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-3 sm:px-0 pt-2">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-xl p-3 sm:p-4 border border-white/5">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Award size={14} className="sm:text-[18px] text-violet-400" />
                </div>
                <span className="text-white font-semibold text-sm sm:text-base">40+</span>
                <span className="text-white/40 text-[10px] sm:text-xs">专业测评</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Shield size={14} className="sm:text-[18px] text-emerald-400" />
                </div>
                <span className="text-white font-semibold text-sm sm:text-base">100%</span>
                <span className="text-white/40 text-[10px] sm:text-xs">隐私保护</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Sparkles size={14} className="sm:text-[18px] text-amber-400" />
                </div>
                <span className="text-white font-semibold text-sm sm:text-base">免费</span>
                <span className="text-white/40 text-[10px] sm:text-xs">永久使用</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
