import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import type { AssessmentResult } from '../../types'

interface MBTIAdvancedResult extends AssessmentResult {
  typeCode: string
  typeName: string
  typeDescription: string
  dimensions: Array<{
    name: string
    score: number
    percentage: number
    preference: string
    description: string
  }>
  strengths: string[]
  blindSpots: string[]
  careerSuggestions: string[]
  compatibility: string
  famousPeople: string[]
  detailedAnalysis: string
  growthPath: string[]
  workStyle: string
  relationshipTips: string
}

export default function MBTIAdvancedReport({ result, mode }: { result: MBTIAdvancedResult; mode: string }) {
  const radarData = result.dimensions?.map(d => ({
    dimension: d.name,
    score: d.score,
    fullMark: 100,
  })) || []

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      INTJ: '#8B5CF6', INTP: '#6366F1', ENTJ: '#EC4899', ENTP: '#F43F5E',
      INFJ: '#06B6D4', INFP: '#14B8A6', ENFJ: '#10B981', ENFP: '#22C55E',
      ISTJ: '#F59E0B', ISFJ: '#D97706', ESTJ: '#F97316', ESFJ: '#FB923C',
      ISTP: '#A855F7', ISFP: '#C084FC', ESTP: '#E879F9', ESFP: '#F472B6',
    }
    return colors[type] || '#8B5CF6'
  }

  return (
    <div className="space-y-8">
      {/* 人格类型卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 border border-violet-500/30"
      >
        <div className="text-center">
          <motion.div
            className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6"
            style={{ background: `linear-gradient(135deg, ${getTypeColor(result.typeCode)}33, ${getTypeColor(result.typeCode)}11)` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <span className="text-4xl font-bold" style={{ color: getTypeColor(result.typeCode) }}>
              {result.typeCode}
            </span>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-2">{result.typeName}</h2>
          <p className="text-white/60 text-lg mb-4">完整人格类型分析</p>
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
        <h3 className="text-xl font-bold text-white mb-6 text-center">人格维度雷达图</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#ffffff', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#ffffff60', fontSize: 10 }} />
              <Radar
                name="你的得分"
                dataKey="score"
                stroke={getTypeColor(result.typeCode)}
                fill={getTypeColor(result.typeCode)}
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
        <h3 className="text-xl font-bold text-white mb-6">维度深度分析</h3>
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
                <span className="text-2xl font-bold" style={{ color: getTypeColor(result.typeCode) }}>
                  {dim.preference}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getTypeColor(result.typeCode) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.score}%` }}
                  transition={{ delay: 0.6 + idx * 0.1, duration: 0.8 }}
                />
              </div>
              <p className="text-white/60 text-sm">{dim.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 优势和盲点 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
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
          transition={{ delay: 0.7 }}
          className="glass rounded-3xl p-6 border border-amber-500/30"
        >
          <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
            ⚠️ 成长盲点
          </h3>
          <ul className="space-y-3">
            {result.blindSpots?.map((blindspot, idx) => (
              <li key={idx} className="text-white/80 flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                {blindspot}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* 工作风格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass rounded-3xl p-8 border border-cyan-500/30"
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-4">💼 工作风格分析</h3>
        <p className="text-white/80 mb-4">{result.workStyle || '你是高效的问题解决者，喜欢独立工作，在处理复杂问题时表现出色。'}</p>
        <h4 className="text-lg font-medium text-white mb-3">推荐职业方向</h4>
        <div className="flex flex-wrap gap-2">
          {result.careerSuggestions?.map((career, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 text-sm border border-cyan-500/30"
            >
              {career}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* 名人案例 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass rounded-3xl p-8 border border-pink-500/30"
      >
        <h3 className="text-xl font-bold text-pink-400 mb-4">🌟 与你同类型的名人</h3>
        <div className="flex flex-wrap gap-3">
          {result.famousPeople?.map((person, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + idx * 0.1 }}
              className="px-4 py-2 rounded-lg bg-pink-500/10 text-pink-300 text-sm border border-pink-500/20"
            >
              {person}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* 成长路径 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="glass rounded-3xl p-8 border border-violet-500/30"
      >
        <h3 className="text-xl font-bold text-violet-400 mb-4">🚀 个人成长路径</h3>
        <div className="space-y-4">
          {result.growthPath?.map((path, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + idx * 0.15 }}
              className="flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-violet-400 font-bold">{idx + 1}</span>
              </div>
              <p className="text-white/80">{path}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
