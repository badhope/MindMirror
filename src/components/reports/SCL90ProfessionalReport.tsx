import { motion } from 'framer-motion'
import { HeartPulse, AlertTriangle, Activity, ShieldCheck, HeartCrack, Stethoscope, Smile, BrainCircuit } from 'lucide-react'
import { AdvancedRadarChart, CircularProgressChart, AdvancedBarChart } from '../charts'
import type { AssessmentResult } from '../../types'
import { safeDimensions } from './utils'

interface SCL90ProfessionalReportProps {
  result: AssessmentResult
  mode?: 'normal' | 'advanced' | 'professional'
}

const SCL90_DIMENSIONS = [
  { key: 'somatization', name: '躯体化', icon: HeartPulse, color: '#FF6B6B', description: '身体不适感、头痛、背痛等躯体症状' },
  { key: 'obsessiveCompulsive', name: '强迫症状', icon: Activity, color: '#4ECDC4', description: '反复出现的想法、行为、冲动' },
  { key: 'interpersonalSensitivity', name: '人际关系敏感', icon: HeartCrack, color: '#FFE66D', description: '人际关系中的自卑感、不自在感' },
  { key: 'depression', name: '抑郁', icon: Smile, color: '#6C5CE7', description: '情绪低落、无望感、活动减退' },
  { key: 'anxiety', name: '焦虑', icon: AlertTriangle, color: '#FD79A8', description: '紧张、神经过敏、惊恐发作' },
  { key: 'hostility', name: '敌对', icon: ShieldCheck, color: '#FDCB6E', description: '愤怒、攻击、敌意情绪' },
  { key: 'phobicAnxiety', name: '恐怖', icon: Stethoscope, color: '#00B894', description: '特殊情境下的恐惧反应' },
  { key: 'paranoidIdeation', name: '偏执', icon: BrainCircuit, color: '#A29BFE', description: '猜疑、关系妄想、被害妄想' },
  { key: 'psychoticism', name: '精神病性', icon: Activity, color: '#E17055', description: '思维障碍、幻觉、怪异行为' }
]

const getSeverityLevel = (score: number) => {
  if (score >= 3) return { level: '严重', color: 'from-red-600 to-red-700', textColor: 'text-red-400' }
  if (score >= 2.5) return { level: '偏重', color: 'from-orange-600 to-orange-700', textColor: 'text-orange-400' }
  if (score >= 2) return { level: '中度', color: 'from-yellow-600 to-yellow-700', textColor: 'text-yellow-400' }
  if (score >= 1.5) return { level: '轻度', color: 'from-blue-600 to-blue-700', textColor: 'text-blue-400' }
  return { level: '正常', color: 'from-emerald-600 to-emerald-700', textColor: 'text-emerald-400' }
}

export default function SCL90ProfessionalReport({ result, mode = 'normal' }: SCL90ProfessionalReportProps) {
  const dimensions = safeDimensions(result?.dimensions, SCL90_DIMENSIONS.map(d => d.key))
  
  const avgScore = dimensions.reduce((sum, d) => sum + (d.score || 0), 0) / dimensions.length
  const globalSeverity = getSeverityLevel(avgScore)
  
  const sortedDimensions = [...dimensions]
    .map(d => ({
      ...d,
      info: SCL90_DIMENSIONS.find(info => info.key === d.name || info.key === d.name?.toLowerCase())
    }))
    .sort((a, b) => (b.score || 0) - (a.score || 0))

  const mostSevere = sortedDimensions[0]

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 头部 - 严肃的心理健康风格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-gray-700/50"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${globalSeverity.color}`} />
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 400">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white/80 text-sm uppercase tracking-wider font-semibold">SCL-90-R 心理健康筛查</h2>
                <p className="text-white/60 text-xs">症状自评量表</p>
              </div>
            </div>
            {mode === 'professional' && (
              <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <span className="text-white font-bold text-sm">专业版</span>
              </div>
            )}
          </div>

          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`px-4 py-2 rounded-full ${globalSeverity.textColor} bg-white/20 backdrop-blur-sm`}>
                  <span className="font-bold text-lg">{globalSeverity.level}</span>
                </div>
                <h1 className="text-4xl font-black text-white">
                  总体心理健康指数
                </h1>
              </div>
              
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                {avgScore >= 2.5 ? 
                  '检测到明显的心理困扰症状，建议寻求专业心理咨询帮助。' : 
                  avgScore >= 1.5 ? 
                    '存在一些轻微的心理不适，可关注并适当调整。' : 
                    '心理健康状况良好，继续保持健康的生活方式。'}
              </p>
            </div>
            
            <div className="w-48">
              <CircularProgressChart
                score={avgScore * 25}
                title="严重度"
                size="large"
                colorScheme="custom"
                customColors={['#22c55e', '#eab308', '#f97316', '#ef4444']}
                showScore
                animated
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 最显著症状 */}
      {mostSevere && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-3xl p-8 border border-red-500/20 bg-red-500/5"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">主要关注症状</h3>
              <p className="text-gray-400">根据测评结果，以下是需要重点关注的方面</p>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-2xl font-bold text-red-400 mb-1">
                  {mostSevere.info?.name || mostSevere.name}
                </h4>
                <p className="text-gray-400 text-sm">
                  {mostSevere.info?.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-white">
                  {(mostSevere.score || 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">
                  / 5.00
                </div>
              </div>
            </div>
            
            <div className="h-4 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((mostSevere.score || 0) / 5) * 100}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* 9维度雷达图 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          9项症状因子图谱
        </h3>
        <AdvancedRadarChart
          dimensions={SCL90_DIMENSIONS.map(info => {
            const dim = dimensions.find(d => d.name === info.key || d.name?.toLowerCase() === info.key)
            return {
              name: info.name,
              score: dim?.score || 0,
              maxScore: 5
            }
          })}
          animated
          color="#4ECDC4"
        />
      </motion.div>

      {/* 各维度详细分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-purple-400" />
          症状维度详细分析
        </h3>
        
        <div className="space-y-4">
          {sortedDimensions.map((dim, index) => {
            const severity = getSeverityLevel(dim.score || 0)
            const Icon = dim.info?.icon || Activity
            
            return (
              <motion.div
                key={dim.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                       style={{ backgroundColor: `${dim.info?.color}20` }}>
                    <Icon className="w-6 h-6" style={{ color: dim.info?.color }} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">{dim.info?.name || dim.name}</h4>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severity.textColor} bg-white/10`}>
                          {severity.level}
                        </span>
                        <span className="text-lg font-bold text-white">
                          {(dim.score || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-3">
                      {dim.info?.description}
                    </p>
                    
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: dim.info?.color,
                          boxShadow: `0 0 10px ${dim.info?.color}40`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${((dim.score || 0) / 5) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.05 }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>无症状</span>
                      <span>轻度</span>
                      <span>中度</span>
                      <span>偏重</span>
                      <span>严重</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* 干预建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          专业建议
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {avgScore >= 2.5 ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
              <h4 className="text-lg font-semibold text-red-400 mb-3">⚠️ 建议寻求专业帮助</h4>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• 建议尽快预约心理咨询师或精神科医生</li>
                <li>• 不要独自承受这些症状的困扰</li>
                <li>• 专业干预是最有效的改善方式</li>
                <li>• 可以先从与信任的人倾诉开始</li>
              </ul>
            </div>
          ) : avgScore >= 1.5 ? (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5">
              <h4 className="text-lg font-semibold text-yellow-400 mb-3">💡 建议自我调整</h4>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• 关注自己的情绪变化</li>
                <li>• 保持规律的作息和运动</li>
                <li>• 尝试放松训练和冥想</li>
                <li>• 如果症状持续加重，考虑专业咨询</li>
              </ul>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">✅ 保持良好状态</h4>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• 继续保持健康的生活方式</li>
                <li>• 定期关注自己的心理状态</li>
                <li>• 维持良好的社交关系</li>
                <li>• 适时放松，避免过度压力</li>
              </ul>
            </div>
          )}
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
            <h4 className="text-lg font-semibold text-blue-400 mb-3">📊 后续建议</h4>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• 2-4周后可再次测评，观察变化</li>
              <li>• 记录情绪日记，了解模式</li>
              <li>• 针对高分数维度特别关注</li>
              <li>• 有需要时不要犹豫寻求支持</li>
            </ul>
          </div>
        </div>
      </motion.div>
      
      {/* 免责声明 */}
      <div className="text-center">
        <p className="text-gray-500 text-xs">
          ⚠️ 本测评仅作为自我了解使用，不代表专业诊断。如有困扰，请咨询专业医疗机构。
        </p>
      </div>
    </div>
  )
}
