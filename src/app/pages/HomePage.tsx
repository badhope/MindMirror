import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Brain, TrendingUp, Heart, Compass, Zap, Shield, Award, Clock, CheckCircle, Flame, ChevronRight, Dumbbell, BookOpen, Target } from 'lucide-react'
import { useAppStore } from '../../store'

const MOOD_EMOJIS = ['😢', '😔', '😐', '😊', '🎉']
const MOOD_LABELS = ['很糟糕', '不太好', '一般般', '还不错', '超棒！']

const FEATURED_ASSESSMENTS = [
  { id: 'sbti-personality', icon: Brain, title: 'MBTI人格测试', desc: '了解你的人格类型', color: 'from-violet-500 to-purple-500', questions: 24, duration: 5 },
  { id: 'ocean-bigfive', icon: Heart, title: '大五人格', desc: '科学的人格模型', color: 'from-emerald-500 to-teal-500', questions: 28, duration: 6 },
  { id: 'ecr-attachment', icon: Sparkles, title: '依恋类型', desc: '探索你的依恋风格', color: 'from-pink-500 to-rose-500', questions: 28, duration: 6 },
  { id: 'sas-standard', icon: TrendingUp, title: '焦虑自评', desc: '了解你的焦虑水平', color: 'from-amber-500 to-orange-500', questions: 28, duration: 5 },
]

const QUICK_ENTRIES = [
  { id: 'training', icon: Dumbbell, label: '开始训练', path: '/app/training', color: 'from-blue-500 to-cyan-500' },
  { id: 'discover', icon: Compass, label: '探索测评', path: '/app/assessments', color: 'from-violet-500 to-purple-500' },
  { id: 'progress', icon: TrendingUp, label: '我的进度', path: '/app/profile', color: 'from-emerald-500 to-teal-500' },
  { id: 'library', icon: BookOpen, label: '心理文章', path: '/app/library/articles', color: 'from-amber-500 to-orange-500' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { completedAssessments, moodHistory, recordMood, getMoodForDate, trainingRecords } = useAppStore()
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

  const handleSelectAssessment = (id: string) => {
    navigate(`/legacy/mode-select/${id}`)
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 py-4 space-y-5 max-w-lg mx-auto">
        
        <div className="text-center pt-2 pb-2">
          <h1 className="text-xl font-bold mb-1">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              心镜
            </span>
          </h1>
          <p className="text-white/50 text-xs">照见自己，成为更好的自己</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-4 border border-violet-500/20"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="text-lg">🌅</span>
              今日心情打卡
            </h3>
            <div className="flex items-center gap-1 text-xs text-white/40">
              <Flame size={12} className="text-orange-400" />
              {moodHistory.length}天
            </div>
          </div>

          {isMoodConfirmed && selectedMood !== null ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl">{MOOD_EMOJIS[selectedMood]}</span>
                <CheckCircle size={16} className="text-emerald-400" />
              </div>
              <span className="text-white/80 text-sm">{MOOD_LABELS[selectedMood]}</span>
              <p className="text-white/40 text-xs mt-1">已完成打卡</p>
            </motion.div>
          ) : (
            <>
              <div className="flex justify-between gap-2 mb-3">
                {MOOD_EMOJIS.map((emoji, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleMoodSelect(i)}
                    className={`flex-1 h-14 rounded-xl flex flex-col items-center justify-center transition-all ${
                      selectedMood === i
                        ? 'bg-gradient-to-br from-violet-500/30 to-purple-500/30 border-2 border-violet-500/50'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="text-[9px] text-white/50">{MOOD_LABELS[i]}</span>
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={confirmMood}
                disabled={selectedMood === null}
                className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
                  selectedMood !== null
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                确认打卡
              </motion.button>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              推荐测评
            </h3>
            <button 
              onClick={() => navigate('/app/assessments')}
              className="text-xs text-violet-400 flex items-center gap-0.5"
            >
              查看全部 <ChevronRight size={12} />
            </button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {FEATURED_ASSESSMENTS.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                onClick={() => handleSelectAssessment(item.id)}
                className="flex-shrink-0 w-36 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all text-left"
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-2`}>
                  <item.icon size={16} className="text-white" />
                </div>
                <h4 className="font-medium text-white text-xs mb-0.5 truncate">{item.title}</h4>
                <p className="text-[10px] text-white/40 truncate">{item.desc}</p>
                <div className="flex items-center gap-2 text-[9px] text-white/30 mt-1.5">
                  <span>{item.questions}题</span>
                  <span>{item.duration}分钟</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
            <Target size={14} className="text-emerald-400" />
            快捷入口
          </h3>
          
          <div className="grid grid-cols-4 gap-2">
            {QUICK_ENTRIES.map((entry, i) => (
              <motion.button
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                onClick={() => navigate(entry.path)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/20 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${entry.color} flex items-center justify-center`}>
                  <entry.icon size={18} className="text-white" />
                </div>
                <span className="text-[10px] text-white/70">{entry.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: '专业测评', value: '40+', icon: Award, color: 'violet' },
            { label: '隐私保护', value: '100%', icon: Shield, color: 'emerald' },
            { label: '永久免费', value: '✓', icon: Sparkles, color: 'amber' },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-xl p-3 border text-center bg-white/5 border-white/5"
            >
              <stat.icon size={14} className={`mx-auto mb-1 text-${stat.color}-400`} />
              <div className="text-base font-bold text-white">{stat.value}</div>
              <div className="text-[9px] text-white/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {hasRecords && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate('/app/profile')}
            className="bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-xl p-4 border border-violet-500/20 cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm flex items-center gap-2">
                  📊 我的成长数据
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  已完成 {completedAssessments.length} 个测评 · {trainingRecords.length} 次训练
                </p>
              </div>
              <ChevronRight size={16} className="text-violet-400" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
