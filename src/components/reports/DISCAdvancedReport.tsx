import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { AssessmentResult } from '../../types'

interface DISCAdvancedResult extends AssessmentResult {
  primaryType: string
  secondaryType: string
  typeDescription: string
  dimensions: Array<{
    name: string
    score: number
    maxScore: number
    percentage: number
    description: string
    level: string
  }>
  strengths: string[]
  weaknesses: string[]
  communicationStyle: string[]
  workStyle: string[]
  careerSuggestions: string[]
  relationshipTips: string[]
}

export default function DISCAdvancedReport({ result, mode }: { result: DISCAdvancedResult; mode: string }) {
  const typeColors = {
    D: { color: '#EF4444', bg: 'from-red-500/20', text: 'text-red-400' },
    I: { color: '#F59E0B', bg: 'from-yellow-500/20', text: 'text-yellow-400' },
    S: { color: '#10B981', bg: 'from-emerald-500/20', text: 'text-emerald-400' },
    C: { color: '#3B82F6', bg: 'from-blue-500/20', text: 'text-blue-400' },
  }

  const pieData = result.dimensions?.map(d => ({
    name: d.name,
    value: d.score,
    maxValue: d.maxScore,
  })) || []

  const primaryColor = typeColors[result.primaryType as keyof typeof typeColors]?.color || '#8B5CF6'

  return (
    <div className="space-y-8">
      {/* DISC类型评估 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 border border-violet-500/30"
      >
        <div className="text-center">
          <motion.div
            className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 bg-gradient-to-br from-violet-500/20 to-purple-500/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">{result.primaryType}{result.secondaryType}</div>
              <div className="text-white/60 text-xs">行为风格</div>
            </div>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-2">{result.typeDescription || 'DISC行为风格深度分析'}</h2>
          <p className="text-white/60 text-lg">DISC完整版评估报告</p>
          
          <div className="mt-6 flex justify-center gap-4">
            <div className="px-6 py-3 rounded-full bg-gradient-to-r from-red-500/20 to-red-500/10 border border-red-500/30">
              <span className="text-red-400 font-bold">主导型: {result.primaryType}</span>
            </div>
            <div className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 border border-yellow-500/30">
              <span className="text-yellow-400 font-bold">辅助型: {result.secondaryType}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 饼图分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl p-8 border border-purple-500/30"
      >
        <h3 className="text-xl font-bold text-white mb-6 text-center">DISC四维度分布</h3>
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
                  <Cell
                    key={`cell-${index}`}
                    fill={typeColors[entry.name as keyof typeof typeColors]?.color}
                  />
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
        <div className="flex justify-center gap-6 mt-4">
          {result.dimensions?.map((dim, idx) => (
            <div key={dim.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: typeColors[dim.name as keyof typeof typeColors]?.color }}
              />
              <span className="text-white/80 text-sm">{dim.name}: {dim.score}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 条形图分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-3xl p-8 border border-blue-500/30"
      >
        <h3 className="text-xl font-bold text-white mb-6 text-center">四维度得分详情</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.dimensions}>
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
                {result.dimensions?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={typeColors[entry.name as keyof typeof typeColors]?.color}
                  />
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
        <h3 className="text-xl font-bold text-white mb-6">四维度深度解读</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.dimensions?.map((dim, idx) => {
            const color = typeColors[dim.name as keyof typeof typeColors]
            return (
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
                      style={{ backgroundColor: color?.color }}
                    />
                    <span className="text-white font-medium">{dim.name}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    color?.bg
                  } ${color?.text}`}>
                    {dim.level}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color?.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.percentage}%` }}
                    transition={{ delay: 0.7 + idx * 0.1, duration: 0.8 }}
                  />
                </div>
                <p className="text-white/60 text-sm">{dim.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* 沟通风格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass rounded-3xl p-8 border border-pink-500/30"
      >
        <h3 className="text-xl font-bold text-pink-400 mb-4">💬 沟通风格建议</h3>
        <div className="space-y-3">
          {result.communicationStyle?.map((style, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <span className="text-pink-400 text-xl mt-1">💡</span>
              <p className="text-white/80">{style}</p>
            </motion.div>
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
        <h3 className="text-xl font-bold text-emerald-400 mb-4">💼 工作风格</h3>
        <div className="space-y-3">
          {result.workStyle?.map((style, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + idx * 0.1 }}
              className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <span className="text-emerald-400 text-xl mt-1">✨</span>
              <p className="text-white/80">{style}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 优势和弱点 */}
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
          className="glass rounded-3xl p-6 border border-rose-500/30"
        >
          <h3 className="text-lg font-bold text-rose-400 mb-4 flex items-center gap-2">
            ⚠️ 成长空间
          </h3>
          <ul className="space-y-3">
            {result.weaknesses?.map((weakness, idx) => (
              <li key={idx} className="text-white/80 flex items-start gap-2">
                <span className="text-rose-400 mt-1">•</span>
                {weakness}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* 职业建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="glass rounded-3xl p-8 border border-violet-500/30"
      >
        <h3 className="text-xl font-bold text-violet-400 mb-4">🎯 推荐职业方向</h3>
        <div className="flex flex-wrap gap-3">
          {result.careerSuggestions?.map((career, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + idx * 0.1 }}
              className="px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm border border-violet-500/30"
            >
              {career}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* 人际关系建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="glass rounded-3xl p-8 border border-cyan-500/30"
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-4">🤝 人际关系建议</h3>
        <div className="space-y-3">
          {result.relationshipTips?.map((tip, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + idx * 0.1 }}
              className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <span className="text-cyan-400 text-xl mt-1">💡</span>
              <p className="text-white/80">{tip}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
