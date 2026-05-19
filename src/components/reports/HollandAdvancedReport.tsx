import { motion } from 'framer-motion'
import { Briefcase, Target, TrendingUp, Users, BookOpen, Hammer, Palette, Microscope, Cog, Crown } from 'lucide-react'
import { AdvancedBarChart, CircularProgressChart, AdvancedRadarChart } from '../charts'
import type { AssessmentResult } from '../../types'
import { safeDimensions } from './utils'

interface HollandAdvancedReportProps {
  result: AssessmentResult
  mode?: 'normal' | 'advanced' | 'professional'
}

const HOLLAND_TYPES = [
  { code: 'R', name: '实际型', icon: Hammer, color: 'from-amber-500 to-orange-500', description: '喜欢具体、实用的工作，动手能力强', careers: ['工程师', '机械师', '运动员', '厨师'] },
  { code: 'I', name: '研究型', icon: Microscope, color: 'from-blue-500 to-cyan-500', description: '喜欢探索、分析和研究，逻辑思维强', careers: ['科学家', '研究员', '医生', '程序员'] },
  { code: 'A', name: '艺术型', icon: Palette, color: 'from-purple-500 to-pink-500', description: '喜欢创造性的工作，追求自我表达', careers: ['艺术家', '设计师', '作家', '音乐家'] },
  { code: 'S', name: '社会型', icon: Users, color: 'from-pink-500 to-rose-500', description: '喜欢帮助他人，善于社交和沟通', careers: ['教师', '心理咨询师', '护士', '社工'] },
  { code: 'E', name: '企业型', icon: Crown, color: 'from-violet-500 to-purple-500', description: '喜欢领导和管理，有领导力', careers: ['企业家', '管理者', '律师', '销售经理'] },
  { code: 'C', name: '常规型', icon: Cog, color: 'from-teal-500 to-emerald-500', description: '喜欢有条理、数据驱动的工作', careers: ['会计', '银行职员', '管理员', '图书馆员'] },
]

export default function HollandAdvancedReport({ result, mode = 'normal' }: HollandAdvancedReportProps) {
  const dimensions = safeDimensions(result?.dimensions, ['R', 'I', 'A', 'S', 'E', 'C'])
  
  const topTypes = [...dimensions]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 3)
  
  const mainType = topTypes[0]
  const secondaryType = topTypes[1]
  const thirdType = topTypes[2]
  
  const hexCode = mainType ? 
    HOLLAND_TYPES.find(t => t.code === mainType.name || t.name.includes(mainType.name || ''))?.code || 'R' :
    'R'
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative p-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-white/80" />
              <span className="text-white/80 font-medium">霍兰德职业兴趣 · 完整分析</span>
            </div>
            {mode === 'professional' && (
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center gap-2">
                <Crown className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">专业版 · 60题</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-12 h-12 text-white" />
                <div>
                  <h1 className="text-5xl font-black text-white">
                    {topTypes.map(t => HOLLAND_TYPES.find(h => h.code === t.name)?.code || t.name?.[0] || '?').join('-')}
                  </h1>
                  <p className="text-white/70 text-xl mt-1">
                    {topTypes.map(t => HOLLAND_TYPES.find(h => h.code === t.name)?.name || t.name).join(' + ')}
                  </p>
                </div>
              </div>
              <p className="text-white/80 text-lg mt-4">
                您的职业兴趣类型代码：{hexCode}
              </p>
            </div>
            <div className="text-center">
              <CircularProgressChart
                score={mainType?.score || 0}
                title="主导类型"
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
          <Target className="w-6 h-6 text-violet-400" />
          六种职业兴趣类型分布
        </h3>
        <AdvancedRadarChart
          dimensions={dimensions.map((d, i) => ({
            name: HOLLAND_TYPES[i]?.name || d.name || '未知',
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
        <h3 className="text-xl font-bold text-white mb-6">TOP 3 职业兴趣类型详解</h3>
        <div className="space-y-6">
          {topTypes.map((type, index) => {
            const hollandType = HOLLAND_TYPES.find(h => 
              h.code === type.name || h.name.includes(type.name || '')
            )
            const Icon = hollandType?.icon || Target
            const color = hollandType?.color || 'from-violet-500 to-purple-500'
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-2xl font-bold text-white">
                          {hollandType?.name || type.name}
                        </h4>
                        <span className="text-white/60">#{index + 1}</span>
                      </div>
                      <div className="text-2xl font-bold text-violet-400">
                        {type.score?.toFixed(1)}分
                      </div>
                    </div>
                    <p className="text-white/70 mb-3">{hollandType?.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {hollandType?.careers?.map((career, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm">
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
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
          <BookOpen className="w-6 h-6 text-blue-400" />
          职业发展建议
        </h3>
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-5">
            <h4 className="text-lg font-semibold text-white mb-2">🎯 职业方向建议</h4>
            <p className="text-white/70">
              根据您的职业兴趣类型组合，建议优先考虑融合{topTypes[0]?.name}和{topTypes[1]?.name}的工作环境。
              这类工作能够充分发挥您的优势，同时满足您的职业兴趣。
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-5">
            <h4 className="text-lg font-semibold text-white mb-2">📚 能力提升方向</h4>
            <p className="text-white/70">
              建议重点培养与您的职业兴趣相关的核心技能，包括{topTypes[0]?.name}相关的专业能力，
              以及{topTypes[1]?.name}所需的可迁移技能。
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-5">
            <h4 className="text-lg font-semibold text-white mb-2">💼 工作环境偏好</h4>
            <p className="text-white/70">
              建议选择能够发挥您{topTypes[0]?.name}特质的 工作环境，包括：
              {hollandType => hollandType?.description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
