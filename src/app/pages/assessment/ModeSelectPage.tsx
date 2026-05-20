import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, Crown, Sparkles } from 'lucide-react'
import { getAssessmentById } from '@data/assessments'
import { getVersionConfig } from '@utils/questionPool'

export default function ModeSelectPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const assessment = id ? getAssessmentById(id) : undefined

  if (!assessment) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">测评不存在</h2>
          <button
            onClick={() => navigate('/app/assessments')}
            className="px-6 py-3 rounded-xl bg-violet-500 text-white"
            type="button"
          >
            返回列表
          </button>
        </div>
      </div>
    )
  }

  // 获取所有可用的题目
  const allQuestions = assessment.questions || []
  const hasProfessionalQuestions = !!(assessment as any).professionalQuestions
  
  // 合并所有题库以获取最大题目数量
  let totalPoolSize = allQuestions.length
  if (hasProfessionalQuestions) {
    const pq = (assessment as any).professionalQuestions
    totalPoolSize = (pq.normal?.length || 0) + (pq.advanced?.length || 0) + (pq.professional?.length || 0)
    if (totalPoolSize === 0) totalPoolSize = allQuestions.length
  }

  // 获取三个版本的配置
  const standardConfig = getVersionConfig('standard')
  const advancedConfig = getVersionConfig('advanced')
  const professionalConfig = getVersionConfig('professional')

  // 计算题目数量和预估时间
  const standardCount = standardConfig.questionCount
  const advancedCount = advancedConfig.questionCount
  const professionalCount = professionalConfig.questionCount

  const standardDuration = Math.max(3, Math.ceil(standardCount * 10 / 60))
  const advancedDuration = Math.max(5, Math.ceil(advancedCount * 10 / 60))
  const professionalDuration = Math.max(10, Math.ceil(professionalCount * 10 / 60))

  const modes = [
    {
      id: 'standard',
      icon: Zap,
      label: '⚡ 标准版',
      tag: '推荐选择',
      questionCount: `${standardCount} 题`,
      duration: `约 ${standardDuration} 分钟`,
      accuracy: '高准确率',
      color: 'from-violet-400 to-pink-400',
      borderColor: 'border-violet-400/50 bg-white/5',
      bgHover: 'hover:bg-violet-500/10',
      description: `从${totalPoolSize}+题库中智能抽取${standardCount}题，包含简单题型，快速获得准确结果`
    },
    {
      id: 'advanced',
      icon: TrendingUp,
      label: '🚀 进阶版',
      tag: '深度分析',
      questionCount: `${advancedCount} 题`,
      duration: `约 ${advancedDuration} 分钟`,
      accuracy: '超高精度',
      color: 'from-blue-400 to-cyan-400',
      borderColor: 'border-blue-400/50 bg-white/5',
      bgHover: 'hover:bg-blue-500/10',
      description: `从${totalPoolSize}+题库中智能抽取${advancedCount}题，包含中等难度题型，获得更全面精准的结果`
    },
    {
      id: 'professional',
      icon: Crown,
      label: '👑 专业版',
      tag: '专家级',
      questionCount: `${professionalCount} 题`,
      duration: `约 ${professionalDuration} 分钟`,
      accuracy: '学术级精度',
      color: 'from-amber-400 to-orange-400',
      borderColor: 'border-amber-400/50 bg-white/5',
      bgHover: 'hover:bg-amber-500/10',
      description: `从${totalPoolSize}+题库中智能抽取${professionalCount}题，包含高难度题型，获得最全面精准的专业级分析`
    },
  ]

  const handleSelect = (mode: string) => {
    navigate(`/app/assessment/${id}/confirm?mode=${mode}`)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="pt-12 pb-20 max-w-lg mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">选择测评版本</h1>
          <p className="text-white/60">{assessment.title}</p>
        </motion.div>

        <div className="space-y-4">
          {modes.map((mode, index) => {
            const Icon = mode.icon
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                onClick={() => handleSelect(mode.id)}
                className={`relative overflow-hidden rounded-2xl border-2 ${mode.borderColor} ${mode.bgHover} transition-all p-6 group cursor-pointer`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${mode.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center shrink-0 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-white text-lg">{mode.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${mode.color} text-white font-medium`}>
                        {mode.tag}
                      </span>
                    </div>
                    
                    <p className="text-white/60 text-sm mb-3">{mode.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-white/70">
                        <span className="text-violet-400">📝</span>
                        <span className="text-white/90">{mode.questionCount}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/70">
                        <span className="text-violet-400">⏱️</span>
                        <span className="text-white/90">{mode.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/70">
                        <span className="text-violet-400">🎯</span>
                        <span className="text-white/90">{mode.accuracy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-white/40 text-sm">
            💡 不确定选哪个？选择「标准版」就好，大多数人都用这个
          </p>
        </motion.div>
      </div>
    </div>
  )
}
