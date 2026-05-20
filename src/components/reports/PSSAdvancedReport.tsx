import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { AssessmentResult } from '../../types'

interface PSSAdvancedResult extends AssessmentResult {
  score: number
  level: 'low' | 'moderate' | 'high' | 'very_high'
  levelText: string
  dimensions: Array<{
    name: string
    score: number
    maxScore: number
    description: string
    level: string
  }>
  stressors: string[]
  copingStrategies: string[]
  suggestions: string[]
  longTermEffects: string[]
  resilienceScore: number
}

export default function PSSAdvancedReport({ result, mode }: { result: PSSAdvancedResult; mode: string }) {
  const levelColors = {
    low: { bg: 'from-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    moderate: { bg: 'from-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    high: { bg: 'from-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    very_high: { bg: 'from-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  }

  const colors = levelColors[result.level] || levelColors.moderate

  const radarData = result.dimensions?.map(d => ({
    dimension: d.name,
    score: d.score,
    fullMark: d.maxScore,
  })) || []

  return (
    <div className="space-y-8">
      {/* 压力等级评估 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass rounded-3xl p-8 border ${colors.border}`}
      >
        <div className="text-center">
          <motion.div
            className={`inline-flex items-center justify-center w-40 h-40 rounded-full mb-6 bg-gradient-to-br ${colors.bg} to-transparent`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <div>
              <div className={`text-5xl font-bold ${colors.text}`}>{result.score}</div>
              <div className="text-white/60 text-sm mt-1">压力指数</div>
            </div>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-2">{result.levelText}</h2>
          <p className="text-white/60 text-lg">压力知觉深度评估报告</p>
          
          <div className={`mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${colors.bg} border ${colors.border}`}>
            <span className={colors.text}>
              心理韧性得分: {result.resilienceScore || 0}/100
            </span>
          </div>
        </div>
      </motion.div>

      {/* 压力雷达图 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl p-8 border border-purple-500/30"
      >
        <h3 className="text-xl font-bold text-white mb-6 text-center">压力维度分析</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#ffffff', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#ffffff60', fontSize: 10 }} />
              <Radar
                name="压力得分"
                dataKey="score"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.4}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 详细维度分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-3xl p-8 border border-blue-500/30"
      >
        <h3 className="text-xl font-bold text-white mb-6">压力来源详细分析</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.dimensions?.map((dim, idx) => (
            <motion.div
              key={dim.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">{dim.name}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  dim.level === '低' ? 'bg-emerald-500/20 text-emerald-400' :
                  dim.level === '中等' ? 'bg-yellow-500/20 text-yellow-400' :
                  dim.level === '高' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {dim.level}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(dim.score / dim.maxScore) * 100}%` }}
                  transition={{ delay: 0.6 + idx * 0.1, duration: 0.8 }}
                />
              </div>
              <p className="text-white/60 text-sm">{dim.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 主要压力源 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-3xl p-8 border border-rose-500/30"
      >
        <h3 className="text-xl font-bold text-rose-400 mb-4">⚡ 主要压力源</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.stressors?.map((stressor, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <span className="text-rose-400 text-xl">⚠️</span>
              <p className="text-white/80">{stressor}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 应对策略 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-3xl p-8 border border-emerald-500/30"
      >
        <h3 className="text-xl font-bold text-emerald-400 mb-4">💡 应对策略建议</h3>
        <div className="space-y-4">
          {result.copingStrategies?.map((strategy, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + idx * 0.15 }}
              className="flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 font-bold">{idx + 1}</span>
              </div>
              <p className="text-white/80 pt-1">{strategy}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 长期影响 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass rounded-3xl p-8 border border-amber-500/30"
      >
        <h3 className="text-xl font-bold text-amber-400 mb-4">⚠️ 长期影响预警</h3>
        <div className="space-y-3">
          {result.longTermEffects?.map((effect, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20"
            >
              <span className="text-amber-400 text-xl mt-1">⚠️</span>
              <p className="text-white/80">{effect}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 改善建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass rounded-3xl p-8 border border-cyan-500/30"
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-4">🎯 综合改善建议</h3>
        <div className="space-y-4">
          {result.suggestions?.map((suggestion, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + idx * 0.15 }}
              className="flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-bold">{idx + 1}</span>
              </div>
              <p className="text-white/80 pt-1">{suggestion}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
