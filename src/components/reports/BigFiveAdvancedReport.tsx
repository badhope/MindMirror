import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { AssessmentResult } from '../../types'

interface BigFiveAdvancedResult extends AssessmentResult {
  score: number
  typeName: string
  typeDescription: string
  dimensions: Array<{
    name: string
    score: number
    maxScore: number
    description: string
    level: string
  }>
  strengths: string[]
  weaknesses: string[]
  careerSuggestions: string[]
  relationshipTips: string[]
  growthAreas: string[]
}

export default function BigFiveAdvancedReport({ result, mode }: { result: BigFiveAdvancedResult; mode: string }) {
  const dimensionColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']

  const radarData = result.dimensions?.map(d => ({
    dimension: d.name,
    score: d.score,
    fullMark: d.maxScore,
  })) || []

  const barData = result.dimensions?.map(d => ({
    name: d.name,
    score: d.score,
    maxScore: d.maxScore,
    percentage: Math.round((d.score / d.maxScore) * 100),
  })) || []

  return (
    <div className="space-y-8">
      {/* 大五人格等级评估 */}
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
            <span className="text-5xl">🧠</span>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-2">{result.typeName || '大五人格深度分析'}</h2>
          <p className="text-white/60 text-lg mb-4">大五人格完整版评估报告</p>
          <p className="text-white/80 max-w-2xl mx-auto">{result.typeDescription}</p>
        </div>
      </motion.div>

      {/* 雷达图分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl p-8 border border-purple-500/30"
      >
        <h3 className="text-xl font-bold text-white mb-6 text-center">五大人格维度雷达图</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#ffffff', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#ffffff60', fontSize: 10 }} />
              <Radar
                name="你的得分"
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

      {/* 条形图分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-3xl p-8 border border-blue-500/30"
      >
        <h3 className="text-xl font-bold text-white mb-6 text-center">五维度得分详情</h3>
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
                  <motion.rect
                    key={`cell-${index}`}
                    fill={dimensionColors[index % dimensionColors.length]}
                    initial={{ height: 0 }}
                    animate={{ height: (entry.score / entry.maxScore) * 100 + '%' }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
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
        <h3 className="text-xl font-bold text-white mb-6">五维度深度解读</h3>
        <div className="grid grid-cols-1 gap-6">
          {result.dimensions?.map((dim, idx) => (
            <motion.div
              key={dim.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dimensionColors[idx % dimensionColors.length] }}
                  />
                  <span className="text-white font-medium text-lg">{dim.name}</span>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                  dim.level === '极高' ? 'bg-emerald-500/20 text-emerald-400' :
                  dim.level === '高' ? 'bg-blue-500/20 text-blue-400' :
                  dim.level === '中等' ? 'bg-yellow-500/20 text-yellow-400' :
                  dim.level === '低' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {dim.level}
                </span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: dimensionColors[idx % dimensionColors.length] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(dim.score / dim.maxScore) * 100}%` }}
                  transition={{ delay: 0.7 + idx * 0.1, duration: 0.8 }}
                />
              </div>
              <p className="text-white/80">{dim.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 优势和弱点 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="glass rounded-3xl p-6 border border-emerald-500/30"
        >
          <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
            ✨ 核心优势
          </h3>
          <ul className="space-y-3">
            {result.strengths?.map((strength, idx) => (
              <li key={idx} className="text-white/80 flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="glass rounded-3xl p-6 border border-amber-500/30"
        >
          <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
            ⚠️ 成长空间
          </h3>
          <ul className="space-y-3">
            {result.weaknesses?.map((weakness, idx) => (
              <li key={idx} className="text-white/80 flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
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
        transition={{ delay: 1.0 }}
        className="glass rounded-3xl p-8 border border-pink-500/30"
      >
        <h3 className="text-xl font-bold text-pink-400 mb-4">💼 职业发展建议</h3>
        <div className="flex flex-wrap gap-3">
          {result.careerSuggestions?.map((career, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + idx * 0.1 }}
              className="px-4 py-2 rounded-full bg-pink-500/20 text-pink-300 text-sm border border-pink-500/30"
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
        transition={{ delay: 1.1 }}
        className="glass rounded-3xl p-8 border border-violet-500/30"
      >
        <h3 className="text-xl font-bold text-violet-400 mb-4">🤝 人际关系建议</h3>
        <div className="space-y-3">
          {result.relationshipTips?.map((tip, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + idx * 0.1 }}
              className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <span className="text-violet-400 text-xl mt-1">💡</span>
              <p className="text-white/80">{tip}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 成长领域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="glass rounded-3xl p-8 border border-cyan-500/30"
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-4">🚀 个人成长路径</h3>
        <div className="space-y-4">
          {result.growthAreas?.map((area, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 + idx * 0.15 }}
              className="flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-bold">{idx + 1}</span>
              </div>
              <p className="text-white/80 pt-1">{area}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
