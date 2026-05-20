import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { AssessmentResult } from '../../types'

interface SDSAdvancedResult extends AssessmentResult {
  score: number
  severity: 'none' | 'mild' | 'moderate' | 'severe'
  severityText: string
  dimensions: Array<{
    name: string
    score: number
    maxScore: number
    description: string
    level: string
  }>
  coreSymptoms: string[]
  biological: string[]
  psychological: string[]
  social: string[]
  suggestions: string[]
  crisisWarning: boolean
}

export default function SDSAdvancedReport({ result, mode }: { result: SDSAdvancedResult; mode: string }) {
  const severityData = [
    { name: '已缓解', value: result.severity === 'none' ? 100 : 0, color: '#10B981' },
    { name: '轻度', value: result.severity === 'mild' ? 100 : 0, color: '#F59E0B' },
    { name: '中度', value: result.severity === 'moderate' ? 100 : 0, color: '#F97316' },
    { name: '重度', value: result.severity === 'severe' ? 100 : 0, color: '#EF4444' },
  ]

  const pieData = result.dimensions?.map(d => ({
    name: d.name,
    value: d.score,
    maxValue: d.maxScore,
  })) || []

  const severityColors = {
    none: { bg: 'from-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: '心理状态良好' },
    mild: { bg: 'from-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', label: '存在轻微抑郁' },
    moderate: { bg: 'from-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', label: '中度抑郁状态' },
    severe: { bg: 'from-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: '重度抑郁需关注' },
  }

  const colors = severityColors[result.severity] || severityColors.none

  return (
    <div className="space-y-8">
      {/* 抑郁等级评估 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass rounded-3xl p-8 border ${colors.border}`}
      >
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-6xl font-bold text-white mb-2">{result.score}</div>
              <div className="text-white/60">抑郁指数</div>
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${colors.text} mb-2`}>{colors.label}</span>
              <span className="text-white/60">需要关注程度</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">抑郁深度评估报告</h2>
          <p className="text-white/60 text-lg">综合生物-心理-社会模型分析</p>
        </div>
      </motion.div>

      {/* 三维度分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl p-8 border border-violet-500/30"
      >
        <h3 className="text-xl font-bold text-white mb-6 text-center">抑郁三维度分析</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" tick={{ fill: '#ffffff', fontSize: 12 }} />
              <YAxis tick={{ fill: '#ffffff', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value}/${props.payload.maxValue}`,
                  '得分'
                ]}
              />
              <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 生物维度 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-3xl p-8 border border-pink-500/30"
      >
        <h3 className="text-xl font-bold text-pink-400 mb-4">🧬 生物维度分析</h3>
        <p className="text-white/80 mb-4">抑郁的生理基础和身体症状</p>
        <div className="space-y-3">
          {result.biological?.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <span className="text-pink-400 text-xl mt-1">•</span>
              <p className="text-white/80">{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 心理维度 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-3xl p-8 border border-blue-500/30"
      >
        <h3 className="text-xl font-bold text-blue-400 mb-4">🧠 心理维度分析</h3>
        <p className="text-white/80 mb-4">认知、情感和行为模式</p>
        <div className="space-y-3">
          {result.psychological?.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <span className="text-blue-400 text-xl mt-1">•</span>
              <p className="text-white/80">{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 社会维度 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-3xl p-8 border border-emerald-500/30"
      >
        <h3 className="text-xl font-bold text-emerald-400 mb-4">🤝 社会维度分析</h3>
        <p className="text-white/80 mb-4">人际关系和社会支持系统</p>
        <div className="space-y-3">
          {result.social?.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <span className="text-emerald-400 text-xl mt-1">•</span>
              <p className="text-white/80">{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 危机预警 */}
      {result.crisisWarning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-3xl p-8 border border-red-500/30 bg-red-500/10"
        >
          <h3 className="text-xl font-bold text-red-400 mb-4">🚨 危机预警</h3>
          <p className="text-white/80 mb-4">
            您的抑郁程度处于较高水平，请立即寻求专业帮助：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
              <h4 className="text-white font-medium mb-2">24小时热线</h4>
              <p className="text-red-300 text-sm">全国心理援助热线：400-161-9995</p>
            </div>
            <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
              <h4 className="text-white font-medium mb-2">紧急求助</h4>
              <p className="text-red-300 text-sm">如需紧急帮助，请拨打120或前往最近的医院急诊</p>
            </div>
            <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
              <h4 className="text-white font-medium mb-2">专业咨询</h4>
              <p className="text-red-300 text-sm">尽快预约精神科医生或心理咨询师</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 改善建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass rounded-3xl p-8 border border-cyan-500/30"
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-4">💡 综合改善建议</h3>
        <div className="space-y-4">
          {result.suggestions?.map((suggestion, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + idx * 0.15 }}
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
