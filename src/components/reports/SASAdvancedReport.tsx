import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import type { AssessmentResult } from '../../types'

interface SASAdvancedResult extends AssessmentResult {
  score: number
  severity: 'normal' | 'mild' | 'moderate' | 'severe'
  severityText: string
  dimensions: Array<{
    name: string
    score: number
    maxScore: number
    description: string
    level: string
  }>
  symptoms: string[]
  causes: string[]
  suggestions: string[]
  warningSigns: string[]
  professionalHelp: boolean
}

export default function SASAdvancedReport({ result, mode }: { result: SASAdvancedResult; mode: string }) {
  const severityColors = {
    normal: { bg: 'from-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    mild: { bg: 'from-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    moderate: { bg: 'from-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    severe: { bg: 'from-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  }

  const colors = severityColors[result.severity] || severityColors.normal

  const trendData = result.dimensions?.map((d, idx) => ({
    name: d.name,
    score: d.score,
    max: d.maxScore,
    percentage: Math.round((d.score / d.maxScore) * 100),
  })) || []

  return (
    <div className="space-y-8">
      {/* 焦虑等级评估 */}
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
              <div className="text-white/60 text-sm mt-1">总分</div>
            </div>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-2">{result.severityText}</h2>
          <p className="text-white/60 text-lg">焦虑水平深度评估报告</p>
          
          <div className={`mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${colors.bg} border ${colors.border}`}>
            {result.professionalHelp && (
              <span className="text-2xl">⚠️</span>
            )}
            <span className={colors.text}>
              {result.professionalHelp ? '建议寻求专业帮助' : '处于可控范围'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 焦虑维度分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl p-8 border border-orange-500/30"
      >
        <h3 className="text-xl font-bold text-white mb-6 text-center">焦虑症状维度分析</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#ffffff', fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#ffffff', fontSize: 12 }} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                formatter={(value: number) => [`${value}%`, '得分']}
              />
              <Bar dataKey="percentage" fill="#F97316" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 详细症状分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-3xl p-8 border border-yellow-500/30"
      >
        <h3 className="text-xl font-bold text-yellow-400 mb-6">🔍 详细症状解读</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.dimensions?.map((dim, idx) => (
            <motion.div
              key={dim.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">{dim.name}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  dim.level === '正常' ? 'bg-emerald-500/20 text-emerald-400' :
                  dim.level === '轻度' ? 'bg-yellow-500/20 text-yellow-400' :
                  dim.level === '中度' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {dim.level}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
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

      {/* 焦虑诱因 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-3xl p-8 border border-rose-500/30"
      >
        <h3 className="text-xl font-bold text-rose-400 mb-4">⚡ 可能的焦虑诱因</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.causes?.map((cause, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <span className="text-rose-400 text-xl">⚠️</span>
              <p className="text-white/80">{cause}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 预警信号 */}
      {result.warningSigns && result.warningSigns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-3xl p-8 border border-red-500/30"
        >
          <h3 className="text-xl font-bold text-red-400 mb-4">🚨 需要关注的预警信号</h3>
          <div className="space-y-3">
            {result.warningSigns.map((sign, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className="flex items-start gap-3 p-4 bg-red-500/10 rounded-lg border border-red-500/20"
              >
                <span className="text-red-400 text-xl">⚠️</span>
                <p className="text-white/80">{sign}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 改善建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass rounded-3xl p-8 border border-emerald-500/30"
      >
        <h3 className="text-xl font-bold text-emerald-400 mb-4">💡 专业改善建议</h3>
        <div className="space-y-4">
          {result.suggestions?.map((suggestion, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + idx * 0.15 }}
              className="flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 font-bold">{idx + 1}</span>
              </div>
              <p className="text-white/80 pt-1">{suggestion}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 专业帮助提示 */}
      {result.professionalHelp && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass rounded-3xl p-8 border border-violet-500/30"
        >
          <h3 className="text-xl font-bold text-violet-400 mb-4">🏥 寻求专业帮助</h3>
          <p className="text-white/80 mb-4">
            您的焦虑程度处于较高水平，建议及时寻求专业帮助：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-medium mb-2">心理咨询师</h4>
              <p className="text-white/60 text-sm">认知行为疗法(CBT)是治疗焦虑的有效方法</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-medium mb-2">精神科医生</h4>
              <p className="text-white/60 text-sm">必要时可考虑药物治疗</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-medium mb-2">支持团体</h4>
              <p className="text-white/60 text-sm">与有相似经历的人交流可以获得支持</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
