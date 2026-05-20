import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Target, Sparkles, Play, AlertCircle, ChevronDown, ChevronUp, Home, Zap, TrendingUp, Crown } from 'lucide-react'
import { getAssessmentById } from '@data/assessments'
import { getVersionConfig } from '@utils/questionPool'
import ProfessionalCredibility from '@components/professional-credibility/ProfessionalCredibility'
import { useState } from 'react'

export default function AssessmentConfirmPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const assessment = id ? getAssessmentById(id) : undefined
  const modeFromUrl = searchParams.get('mode') as 'standard' | 'advanced' | 'professional'
  const selectedMode = modeFromUrl || 'standard'
  const [showCredibility, setShowCredibility] = useState(false)

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">测评不存在</h2>
          <button
            onClick={() => navigate('/app/assessments')}
            className="px-6 py-3 rounded-xl bg-violet-500 text-white"
            type="button"
          >
            返回测评列表
          </button>
        </div>
      </div>
    )
  }

  const handleStart = () => {
    navigate(`/app/assessment/${id}/take?mode=${selectedMode}`)
  }

  // 获取所有可用的题目数量
  const allQuestions = assessment.questions || []
  const hasProfessionalQuestions = !!(assessment as any).professionalQuestions
  
  let totalPoolSize = allQuestions.length
  if (hasProfessionalQuestions) {
    const pq = (assessment as any).professionalQuestions
    totalPoolSize = (pq.normal?.length || 0) + (pq.advanced?.length || 0) + (pq.professional?.length || 0)
    if (totalPoolSize === 0) totalPoolSize = allQuestions.length
  }

  // 获取版本配置
  const versionConfig = getVersionConfig(selectedMode)
  const displayQuestionCount = versionConfig.questionCount
  const durationMinutes = Math.max(3, Math.ceil(displayQuestionCount * 10 / 60))

  const modeConfigs = {
    standard: {
      label: '标准版',
      sublabel: '推荐选择',
      accuracy: '高准确率',
      color: 'from-violet-500 to-pink-500',
      icon: Zap,
      description: `从${totalPoolSize}+题库中智能抽取${displayQuestionCount}题，包含简单题型，快速获得准确结果`
    },
    advanced: {
      label: '进阶版',
      sublabel: '深度分析',
      accuracy: '超高精度',
      color: 'from-blue-500 to-cyan-500',
      icon: TrendingUp,
      description: `从${totalPoolSize}+题库中智能抽取${displayQuestionCount}题，包含中等难度题型，获得更全面精准的结果`
    },
    professional: {
      label: '专业版',
      sublabel: '专家级',
      accuracy: '学术级精度',
      color: 'from-amber-500 to-orange-500',
      icon: Crown,
      description: `从${totalPoolSize}+题库中智能抽取${displayQuestionCount}题，包含高难度题型，获得最全面精准的专业级分析`
    },
  }
  const qualityLabel = {
    lite: '科学',
    standard: '专业',
    expert: '学术',
  }[assessment.difficulty] || '专业'

  const currentConfig = modeConfigs[selectedMode]
  const Icon = currentConfig.icon

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-2xl mx-auto px-4 pt-8 w-full">
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            type="button"
          >
            <Home className="w-5 h-5" />
            返回主页
          </motion.button>
          <span className="text-white/30">|</span>
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            type="button"
          >
            <ArrowLeft className="w-5 h-5" />
            返回上一页
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 text-center mb-8 border border-white/10"
        >
          <motion.div
            className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${currentConfig.color} flex items-center justify-center`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Play className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            准备开始测评
          </motion.h1>

          <motion.div
            className="inline-block px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm font-medium mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {assessment.title}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-8"
          >
            <div className={`relative p-6 rounded-2xl border-2 border-violet-500/40 bg-gradient-to-br ${currentConfig.color}/20`}>
              <div className="absolute inset-0 bg-black/35 rounded-2xl"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentConfig.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-white">
                      {currentConfig.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${currentConfig.color}/20 text-violet-300`}>
                      {currentConfig.sublabel}
                    </span>
                  </div>
                  <p className="text-white/90 text-sm">{currentConfig.description}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <Clock className="w-6 h-6 text-violet-400 mx-auto mb-2" />
              <p className="text-white font-semibold">{durationMinutes} 分钟</p>
              <p className="text-white/50 text-sm">预计时长</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <Target className="w-6 h-6 text-pink-400 mx-auto mb-2" />
              <p className="text-white font-semibold">{displayQuestionCount} 题</p>
              <p className="text-white/50 text-sm">题目数量</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-white font-semibold">{qualityLabel}</p>
              <p className="text-white/50 text-sm">测评质量</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-8 text-left border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-white/70 text-sm space-y-2">
                <p>• 每题限时 <span className="text-white font-semibold">30秒</span>，超时将自动跳过</p>
                <p>• 请在安静环境下完成测评，确保答案准确</p>
                <p>• 测评过程中请保持专注，中途退出将不计入结果</p>
                <p>• 完成所有题目后即可查看专业分析报告</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={() => navigate(-1)}
              className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 border border-white/20 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
            >
              再想想
            </motion.button>

            <motion.button
              onClick={handleStart}
              className={`px-10 py-4 rounded-xl bg-gradient-to-r ${currentConfig.color} text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
            >
              <Play className="w-5 h-5" />
              开始测评
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowCredibility(!showCredibility)}
            className="w-full flex items-center justify-center gap-2 py-4 text-white/60 hover:text-white transition-colors bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
            type="button"
          >
            <span className="font-medium">查看专业可信度详情</span>
            {showCredibility ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </motion.div>

        {showCredibility && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          >
            <ProfessionalCredibility />
          </motion.div>
        )}
      </div>
    </div>
  )
}
