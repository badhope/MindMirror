import { motion } from 'framer-motion'
import { Brain, TrendingUp, Target, Award, Crown, Zap, Shield, Users } from 'lucide-react'
import { AdvancedBarChart, CircularProgressChart, AdvancedRadarChart } from '../charts'
import type { AssessmentResult } from '../../types'
import { safeDimensions } from './utils'

interface CriticalThinkingReportProps {
  result: AssessmentResult
  mode?: 'normal' | 'advanced' | 'professional'
}

const THINKING_DIMENSIONS = [
  { key: 'analysis', name: '分析能力', description: '分解复杂问题的能力' },
  { key: 'evaluation', name: '评估能力', description: '判断信息价值的能力' },
  { key: 'inference', name: '推理能力', description: '从已知推未知的能力' },
  { key: 'logic', name: '逻辑思维', description: '运用逻辑规则的能力' },
  { key: 'argument', name: '论证能力', description: '构建和评价论证的能力' },
  { key: 'openness', name: '开放思维', description: '接受多元观点的能力' },
]

export default function CriticalThinkingReport({ result, mode = 'normal' }: CriticalThinkingReportProps) {
  const dimensions = safeDimensions(result?.dimensions, THINKING_DIMENSIONS.map(d => d.key))
  
  const avgScore = dimensions.reduce((sum, d) => sum + (d.score || 0), 0) / dimensions.length
  
  const getLevel = (score: number) => {
    if (score >= 90) return { level: '卓越', color: 'from-violet-600 to-purple-600', desc: '您的批判性思维能力非常突出！' }
    if (score >= 80) return { level: '优秀', color: 'from-blue-600 to-cyan-600', desc: '您的批判性思维能力很强！' }
    if (score >= 70) return { level: '良好', color: 'from-emerald-600 to-teal-600', desc: '您的批判性思维能力良好！' }
    if (score >= 60) return { level: '中等', color: 'from-amber-600 to-orange-600', desc: '您的批判性思维能力有待提升！' }
    return { level: '待发展', color: 'from-red-600 to-pink-600', desc: '建议系统学习批判性思维！' }
  }
  
  const levelInfo = getLevel(avgScore)
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${levelInfo.color}`} />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative p-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-white/80" />
              <span className="text-white/80 font-medium">批判性思维 · 专业评估</span>
            </div>
            {mode === 'professional' && (
              <div className="px-4 py-2 rounded-full bg-white/20 flex items-center gap-2">
                <Award className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">专业版 · 60题</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-12 h-12 text-white" />
                <div>
                  <h1 className="text-5xl font-black text-white">{levelInfo.level}</h1>
                  <p className="text-white/70 text-xl mt-1">批判性思维能力评估</p>
                </div>
              </div>
              <p className="text-white/90 text-lg mt-4">{levelInfo.desc}</p>
            </div>
            <div className="text-center">
              <CircularProgressChart
                score={avgScore}
                title="综合得分"
                size="large"
                colorScheme="violet"
                showScore
                animated
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-violet-400" />
          六维批判性思维模型
        </h3>
        <AdvancedRadarChart
          dimensions={dimensions.map((d, i) => ({
            name: THINKING_DIMENSIONS[i]?.name || d.name || '未知',
            score: d.score ?? 0,
            maxScore: 100,
          }))}
          animated
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6">各维度详细分析</h3>
        <div className="space-y-4">
          {dimensions.map((dim, index) => {
            const dimInfo = THINKING_DIMENSIONS.find(d => d.key === dim.name || d.name === dim.name)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/5 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-violet-400" />
                    <h4 className="text-lg font-semibold text-white">
                      {dimInfo?.name || dim.name}
                    </h4>
                  </div>
                  <span className="text-2xl font-bold text-violet-400">
                    {dim.score?.toFixed(1)}分
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-3">
                  {dimInfo?.description}
                </p>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score || 0}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-400" />
          批判性思维提升建议
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-5">
            <h4 className="text-lg font-semibold text-white mb-2">📚 持续学习</h4>
            <p className="text-white/70 text-sm">
              每天花30分钟阅读不同观点的文章，练习从多个角度分析问题。
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-5">
            <h4 className="text-lg font-semibold text-white mb-2">💭 日常练习</h4>
            <p className="text-white/70 text-sm">
              在日常生活中养成质疑习惯，对常见观点追问"为什么"。
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-5">
            <h4 className="text-lg font-semibold text-white mb-2">🤝 讨论交流</h4>
            <p className="text-white/70 text-sm">
              参与辩论或讨论小组，锻炼逻辑论证和反驳能力。
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-5">
            <h4 className="text-lg font-semibold text-white mb-2">🎯 刻意练习</h4>
            <p className="text-white/70 text-sm">
              每天选择一个复杂问题，用批判性思维框架系统分析。
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
