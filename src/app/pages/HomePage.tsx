import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Brain, TrendingUp, Heart, Compass, Zap, Shield, Clock, Award } from 'lucide-react'
import { useAppStore } from '../../store'
import { assessments } from '@data/assessments'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut'
    }
  })
}

const FEATURED_ASSESSMENTS = [
  {
    id: 'sbti-personality',
    icon: Brain,
    title: 'SBTI人格测试',
    description: '有趣又准的人格测评',
    questions: 16,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30'
  },
  {
    id: 'sas-standard',
    icon: TrendingUp,
    title: '焦虑自评量表',
    description: '了解你的焦虑水平',
    questions: 20,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'ocean-bigfive',
    icon: Heart,
    title: '大五人格',
    description: '科学的人格模型',
    questions: 50,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30'
  },
  {
    id: 'ecr-attachment',
    icon: Sparkles,
    title: '依恋类型',
    description: '探索你的依恋风格',
    questions: 36,
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
  const { completedAssessments } = useAppStore()

  const hasRecords = completedAssessments.length > 0

  const handleStartAssessment = () => {
    navigate('/app/discover')
  }

  const handleSelectAssessment = (id: string) => {
    navigate(`/legacy/mode-select/${id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <div className="p-4 md:p-6 space-y-8">
        <motion.div 
          className="text-center pt-4 pb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-sm text-violet-300">轻松探索，遇见真实的自己</span>
          </motion.div>
          
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              3分钟
            </span>
            <span className="text-white">，了解真实的自己</span>
          </motion.h1>
          
          <motion.p
            className="text-white/50 text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {hasRecords 
              ? `你已经完成了 ${completedAssessments.length} 项测评，继续探索吧！` 
              : '专业的心理测评，帮你更好地了解自己'}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl" />
          <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-6 border border-violet-500/20 backdrop-blur-xl">
            <div className="text-center">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4 shadow-lg shadow-violet-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap size={28} className="text-white" />
              </motion.div>
              
              <h2 className="text-xl font-bold text-white mb-2">
                {hasRecords ? '继续你的探索之旅' : '开启你的第一次测评'}
              </h2>
              <p className="text-white/50 text-sm mb-5">
                {hasRecords ? '发现更多关于自己的秘密' : '只需几分钟，收获对自己更深的了解'}
              </p>
              
              <motion.button
                onClick={handleStartAssessment}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Compass size={18} />
                立即开始测评
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400" />
            你可能感兴趣的
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {FEATURED_ASSESSMENTS.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleSelectAssessment(item.id)}
                  className={`relative overflow-hidden rounded-xl p-4 ${item.bgColor} border ${item.borderColor} text-left group`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.color} opacity-10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/3`} />
                  
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  
                  <h4 className="font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/50 mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <Clock size={10} />
                    <span>{item.questions}题</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain size={18} className="text-violet-400" />
            精选专题
          </h3>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {TOPICS.map((topic, index) => (
              <motion.button
                key={topic.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                onClick={() => navigate('/app/discover')}
                className={`flex-shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r ${topic.color} border border-white/10 backdrop-blur-sm flex items-center gap-2 hover:border-white/20 transition-colors`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{topic.emoji}</span>
                <span className="text-white font-medium text-sm">{topic.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pt-4"
        >
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-white/5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Award size={18} className="text-violet-400" />
                </div>
                <span className="text-white font-semibold text-sm">40+</span>
                <span className="text-white/40 text-xs">专业测评</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Shield size={18} className="text-emerald-400" />
                </div>
                <span className="text-white font-semibold text-sm">100%</span>
                <span className="text-white/40 text-xs">隐私保护</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Sparkles size={18} className="text-amber-400" />
                </div>
                <span className="text-white font-semibold text-sm">免费</span>
                <span className="text-white/40 text-xs">永久使用</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
