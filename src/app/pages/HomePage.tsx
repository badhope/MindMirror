import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Brain, Heart, Zap, BookOpen, ChevronRight, TrendingUp, Flame, Calendar, Clock, RefreshCw, Coffee, ArrowRight, Target } from 'lucide-react'
import { useAppStore } from '../../store'
import { getDailyPsychology } from '../data/psychology-knowledge'
import { getDailyQuote } from '../utils/daily-quote'
import { ANIMATION } from '../utils/animation-config'

const MOOD_EMOJIS = ['😢', '😔', '😐', '😊', '🎉']
const MOOD_LABELS = ['很糟糕', '不太好', '一般般', '还不错', '超棒！']

const FEATURED_ASSESSMENTS = [
  { id: 'sbti-personality', icon: Brain, title: 'MBTI人格测试', desc: '了解你的人格类型', color: 'from-violet-500 to-purple-500', questions: 24, duration: 5 },
  { id: 'ocean-bigfive', icon: Heart, title: '大五人格', desc: '科学的人格模型', color: 'from-emerald-500 to-teal-500', questions: 28, duration: 6 },
  { id: 'ecr-attachment', icon: Heart, title: '依恋类型', desc: '探索你的亲密关系', color: 'from-pink-500 to-rose-500', questions: 28, duration: 6 },
]

const QUICK_ENTRIES = [
  { id: 'training', icon: Zap, label: '开始训练', path: '/app/training', color: 'from-blue-500 to-cyan-500', desc: '心理能力训练' },
  { id: 'library', icon: BookOpen, label: '心理图书馆', path: '/app/library/articles', color: 'from-amber-500 to-orange-500', desc: '心理学知识' },
  { id: 'progress', icon: TrendingUp, label: '查看进度', path: '/app/progress', color: 'from-violet-500 to-purple-500', desc: '成长数据分析' },
  { id: 'settings', icon: Target, label: '系统设置', path: '/app/settings', color: 'from-slate-500 to-slate-600', desc: '个性化你的体验' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: ANIMATION.STAGGER_DELAY, delayChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION.SLIDE_DURATION, ease: 'easeOut' }
  }
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

export default function HomePage() {
  const navigate = useNavigate()
  const { completedAssessments, moodHistory, recordMood, getMoodForDate, trainingRecords } = useAppStore()
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [isMoodConfirmed, setIsMoodConfirmed] = useState(false)
  const [dailyQuote, setDailyQuote] = useState<any>(null)
  const [psychologyCards, setPsychologyCards] = useState<any[]>([])
  const [quoteLoading, setQuoteLoading] = useState(true)

  const hasRecords = completedAssessments.length > 0

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayMood = getMoodForDate(today)
    if (todayMood) {
      setSelectedMood(todayMood.mood)
      setIsMoodConfirmed(true)
    }
    setPsychologyCards(getDailyPsychology(2))
    loadQuote()
  }, [getMoodForDate])

  const loadQuote = async () => {
    setQuoteLoading(true)
    const quote = await getDailyQuote()
    setDailyQuote(quote)
    setQuoteLoading(false)
  }

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
    <motion.div 
      className="px-4 py-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {getGreeting()}
          </span>
        </h1>
        <p className="text-white/50 text-sm md:text-base">
          {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 border border-violet-500/20 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coffee size={18} className="text-amber-400" />
              <h3 className="font-semibold text-white">每日一句</h3>
            </div>
            <motion.button
              onClick={loadQuote}
              className="p-2 rounded-xl hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={16} className={`text-white/40 ${quoteLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
          
          {quoteLoading ? (
            <div className="py-8 text-center">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-white/40 text-sm"
              >
                正在加载...
              </motion.div>
            </div>
          ) : dailyQuote && (
            <motion.div
              key={dailyQuote.content}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-4">
                "{dailyQuote.content}"
              </p>
              <p className="text-right text-sm text-white/40">
                —— {dailyQuote.author}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-3xl p-6 md:p-7 border border-white/5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-2xl">🌅</span>
              今日心情打卡
            </h3>
            <p className="text-xs text-white/40 mt-1">记录今天的情绪状态</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Flame size={14} className="text-orange-400" />
            <span>{moodHistory.length}天</span>
          </div>
        </div>

        {isMoodConfirmed && selectedMood !== null ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-5xl">{MOOD_EMOJIS[selectedMood]}</span>
              <span className="text-emerald-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <span className="text-white/80 text-lg">{MOOD_LABELS[selectedMood]}</span>
            <p className="text-white/40 text-sm mt-2">已完成打卡</p>
          </motion.div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-5 gap-2 md:gap-3">
              {MOOD_EMOJIS.map((emoji, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleMoodSelect(i)}
                  className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl transition-all ${
                    selectedMood === i
                      ? 'bg-gradient-to-br from-violet-500/25 to-purple-500/25 border-2 border-violet-500/50'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <span className="text-2xl md:text-3xl mb-1">{emoji}</span>
                  <span className="text-[10px] md:text-xs text-white/50">{MOOD_LABELS[i]}</span>
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={confirmMood}
              disabled={selectedMood === null}
              className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${
                selectedMood !== null
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
              whileHover={selectedMood !== null ? { scale: 1.02 } : {}}
              whileTap={selectedMood !== null ? { scale: 0.98 } : {}}
            >
              确认打卡
            </motion.button>
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400" />
            <h3 className="font-semibold text-white text-lg">推荐测评</h3>
          </div>
          <motion.button
            onClick={() => navigate('/app/assessments')}
            className="text-sm text-violet-400 flex items-center gap-1 hover:text-violet-300 transition-colors"
            whileHover={{ x: 3 }}
          >
            查看全部 <ChevronRight size={14} />
          </motion.button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x">
          {FEATURED_ASSESSMENTS.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => handleSelectAssessment(item.id)}
              className="flex-shrink-0 w-52 md:w-60 snap-start"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:border-violet-500/30 transition-all h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon size={22} className="text-white" />
                </div>
                <h4 className="font-semibold text-white text-base mb-1">{item.title}</h4>
                <p className="text-xs text-white/50 mb-4">{item.desc}</p>
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {item.questions}题
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {item.duration}分钟
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-emerald-400" />
          <h3 className="font-semibold text-white text-lg">快捷入口</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {QUICK_ENTRIES.map((entry, index) => (
            <motion.button
              key={entry.id}
              onClick={() => navigate(entry.path)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:border-violet-500/20 transition-all h-full text-left">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${entry.color} flex items-center justify-center mb-3`}>
                  <entry.icon size={20} className="text-white" />
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">{entry.label}</h4>
                <p className="text-[10px] text-white/50">{entry.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-pink-400" />
            <h3 className="font-semibold text-white text-lg">每日心理学</h3>
          </div>
          <motion.button
            onClick={() => navigate('/app/library/articles')}
            className="text-xs text-violet-400 flex items-center gap-1 hover:text-violet-300 transition-colors"
            whileHover={{ x: 2 }}
          >
            更多文章 <ArrowRight size={12} />
          </motion.button>
        </div>
        
        <div className="space-y-3">
          {psychologyCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -2 }}
              className="group cursor-pointer"
            >
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/20 transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{card.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white text-sm">{card.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-500/20 text-pink-300">
                        {card.type === 'effect' ? '心理学效应' : card.type === 'fact' ? '冷知识' : card.type === 'tip' ? '实用技巧' : '名言'}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{card.content}</p>
                    {card.source && (
                      <p className="text-[10px] text-white/30 mt-2 text-right">—— {card.source}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { label: '专业测评', value: '43+', icon: Sparkles, color: 'violet' },
          { label: '隐私保护', value: '100%', icon: Heart, color: 'pink' },
          { label: '永久免费', value: '✓', icon: Flame, color: 'amber' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className="rounded-2xl p-5 border bg-white/5 border-white/5 text-center"
          >
            <stat.icon size={16} className={`mx-auto mb-2 text-${stat.color}-400`} />
            <div className="text-xl md:text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-[10px] md:text-xs text-white/40">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {hasRecords && (
        <motion.div
          variants={itemVariants}
          onClick={() => navigate('/app/profile')}
          className="bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-2xl p-6 border border-violet-500/20 cursor-pointer hover:scale-[1.01] transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white text-lg flex items-center gap-2 mb-2">
                <span>📊</span>
                我的成长数据
              </h3>
              <p className="text-sm text-white/50">
                已完成 {completedAssessments.length} 个测评 · {trainingRecords.length} 次训练
              </p>
            </div>
            <ChevronRight size={20} className="text-violet-400" />
          </div>
        </motion.div>
      )}
      
      <div className="h-4" />
    </motion.div>
  )
}
