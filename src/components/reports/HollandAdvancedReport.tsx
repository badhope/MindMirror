import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { AssessmentResult } from '../../types'

interface HollandAdvancedResult extends AssessmentResult {
  primaryType: string
  typeDescription: string
  dimensions: Array<{
    name: string
    score: number
    maxScore: number
    percentage: number
    description: string
  }>
  careerSuggestions: string[]
  workStyle: string[]
  strengths: string[]
  growthAreas: string[]
  compatibleTypes: string[]
}

export default function HollandAdvancedReport({ result, mode }: { result: HollandAdvancedResult; mode: string }) {
  const hollandColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899']

  const pieData = result.dimensions?.map(d => ({
    name: d.name,
    value: d.score,
    maxValue: d.maxScore,
  })) || []

  const barData = result.dimensions?.map(d => ({
    name: d.name,
    score: d.score,
    maxScore: d.maxScore,
    percentage: d.percentage,
  })) || []

  return (
    <div className="space-y-8">
      {/* 霍兰德类型评估 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 border border-emerald-500/30"
      >
        <div className="text-center">
          <motion.div
            className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 bg-gradient-to-br from-emerald-500/20 to-green-500/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <span className="text-4xl font-bold text-emerald-400">{result.primaryType}</span>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-2">{result.typeDescription || '霍兰德职业兴趣深度分析'}</h2>
          <p className="text-white/60 text-lg">霍兰德职业兴趣完整版评估报告</p>
        </div>
      </motion.div>

      {/* 饼图分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl p-8 border border-purple-500/30"
      >
        <h3 className="text-xl font-bold text-white mb-6 text-center">霍兰德六维度分布</h3>
        <div className="h-80 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={hollandColors[index % hollandColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value}/${props.payload.maxValue}`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 条形图分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-3xl p-8 border border-blue-500/30"
      >
        <h3 className="text-xl font-bold text-white mb-6 text-center">六维度得分详情</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" tick={{ fill: '#ffffff', fontSize: 12 }} />
              <YAxis tick={{ fill: '#ffffff', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value}/${props.payload.maxScore}`,
                  '得分'
                ]}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={hollandColors[index % hollandColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 详细维度分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-3xl p-8 border border-cyan-500/30"
      >
        <h3 className="text-xl font-bold text-white mb-6">六维度深度解读</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.dimensions?.map((dim, idx) => (
            <motion.div
              key={dim.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: hollandColors[idx % hollandColors.length] }}
                  />
                  <span className="text-white font-medium">{dim.name}</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white">
                  {dim.percentage}%
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: hollandColors[idx % hollandColors.length] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.percentage}%` }}
                  transition={{ delay: 0.7 + idx * 0.1, duration: 0.8 }}
                />
              </div>
              <p className="text-white/60 text-sm">{dim.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 职业建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass rounded-3xl p-8 border border-pink-500/30"
      >
        <h3 className="text-xl font-bold text-pink-400 mb-4">💼 推荐职业方向</h3>
        <div className="flex flex-wrap gap-3">
          {result.careerSuggestions?.map((career, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              className="px-4 py-2 rounded-full bg-pink-500/20 text-pink-300 text-sm border border-pink-500/30"
            >
              {career}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* 工作风格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass rounded-3xl p-8 border border-emerald-500/30"
      >
        <h3 className="text-xl font-bold text-emerald-400 mb-4">✨ 工作风格</h3>
        <div className="space-y-3">
          {result.workStyle?.map((style, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + idx * 0.1 }}
              className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <span className="text-emerald-400 text-xl mt-1">💡</span>
              <p className="text-white/80">{style}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 优势和成长 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
          className="glass rounded-3xl p-6 border border-amber-500/30"
        >
          <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
            ✨ 核心优势
          </h3>
          <ul className="space-y-3">
            {result.strengths?.map((strength, idx) => (
              <li key={idx} className="text-white/80 flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
          className="glass rounded-3xl p-6 border border-violet-500/30"
        >
          <h3 className="text-lg font-bold text-violet-400 mb-4 flex items-center gap-2">
            🚀 成长领域
          </h3>
          <ul className="space-y-3">
            {result.growthAreas?.map((area, idx) => (
              <li key={idx} className="text-white/80 flex items-start gap-2">
                <span className="text-violet-400 mt-1">•</span>
                {area}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* 兼容类型 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="glass rounded-3xl p-8 border border-cyan-500/30"
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-4">🤝 职业兼容类型</h3>
        <div className="flex flex-wrap gap-3">
          {result.compatibleTypes?.map((type, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + idx * 0.1 }}
              className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 text-sm border border-cyan-500/30"
            >
              {type}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
