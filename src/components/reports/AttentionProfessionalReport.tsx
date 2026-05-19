import { motion } from 'framer-motion'
import { 
  Brain, 
  Target, 
  Eye, 
  TrendingUp, 
  AlertTriangle,
  Award,
  Zap,
  Shield,
  Focus,
  Clock,
  Layers,
  Switch
} from 'lucide-react'
import { ComprehensiveChartSystem, AdvancedBarChart, CircularProgressChart, AdvancedRadarChart } from '../charts'
import type { AssessmentResult } from '../../types'

interface AttentionReportProps {
  result: AssessmentResult
  mode?: 'normal' | 'advanced' | 'professional'
}

// 注意力维度定义
const ATTENTION_DIMENSIONS = {
  'sustained': { 
    name: '持续性注意', 
    icon: Clock, 
    color: 'from-violet-500 to-purple-500', 
    description: '在较长时间内保持对任务注意力的能力',
    abilities: ['长时间专注', '抗干扰能力', '坚持完成任务']
  },
  'selective': { 
    name: '选择性注意', 
    icon: Target, 
    color: 'from-blue-500 to-cyan-500', 
    description: '在众多刺激中选择性关注目标信息的能力',
    abilities: ['筛选关键信息', '忽略干扰', '专注目标']
  },
  'divided': { 
    name: '分配性注意', 
    icon: Layers, 
    color: 'from-emerald-500 to-teal-500', 
    description: '同时关注和执行多个任务的能力',
    abilities: ['多任务处理', '快速切换', '协调并行']
  },
  'shifting': { 
    name: '转移性注意', 
    icon: Switch, 
    color: 'from-amber-500 to-orange-500', 
    description: '根据需要将注意力从一个对象灵活转移到另一个的能力',
    abilities: ['灵活转换', '适应变化', '情境切换']
  },
}

// 中文维度名称映射
const ATTENTION_NAME_MAP: Record<string, string> = {
  '持续': 'sustained',
  '持续性': 'sustained',
  '持续性注意': 'sustained',
  '选择性': 'selective',
  '选择性注意': 'selective',
  '分配': 'divided',
  '分配性': 'divided',
  '分配性注意': 'divided',
  '转移': 'shifting',
  '转移性': 'shifting',
  '转移性注意': 'shifting',
}

// 注意力等级定义
const ATTENTION_LEVELS = [
  { min: 90, level: '优秀', title: '注意力超群', description: '注意力水平处于顶尖，能够在各种环境中保持高度专注', color: 'from-violet-600 to-purple-500' },
  { min: 80, level: '良好', title: '注意力优秀', description: '具备出色的注意力控制能力，专注力和抗干扰能力都较强', color: 'from-blue-500 to-violet-500' },
  { min: 70, level: '中等偏上', title: '注意力良好', description: '注意力水平高于平均，能够较好地完成需要专注的任务', color: 'from-cyan-500 to-blue-500' },
  { min: 60, level: '中等', title: '注意力中等', description: '注意力水平处于人群平均水平，基本能够满足日常需求', color: 'from-teal-500 to-cyan-500' },
  { min: 50, level: '中等偏下', title: '注意力待提升', description: '注意力水平略低于平均，在复杂任务中可能容易分心', color: 'from-emerald-500 to-teal-500' },
  { min: 0, level: '待发展', title: '注意力待培养', description: '需要通过系统训练来提升注意力水平和控制能力', color: 'from-amber-500 to-orange-500' },
]

const getAttentionLevel = (score: number) => ATTENTION_LEVELS.find(l => score >= l.min) || ATTENTION_LEVELS[ATTENTION_LEVELS.length - 1]

// 获取注意力等级描述
const getAttentionLevelInfo = (score: number) => {
  if (score >= 85) return { level: '卓越', color: 'bg-violet-500/20 text-violet-300', barColor: 'bg-violet-500' }
  if (score >= 70) return { level: '优秀', color: 'bg-blue-500/20 text-blue-300', barColor: 'bg-blue-500' }
  if (score >= 55) return { level: '良好', color: 'bg-emerald-500/20 text-emerald-300', barColor: 'bg-emerald-500' }
  if (score >= 40) return { level: '一般', color: 'bg-amber-500/20 text-amber-300', barColor: 'bg-amber-500' }
  return { level: '待提升', color: 'bg-red-500/20 text-red-300', barColor: 'bg-red-500' }
}

export default function AttentionProfessionalReport({ result, mode = 'normal' }: AttentionReportProps) {
  const dimensions = result.dimensions || []
  const totalScore = result.score || 0
  const attentionLevel = getAttentionLevel(totalScore)

  // 找出表现最好和最需提升的维度
  const sortedDims = [...dimensions].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  const strongestDim = sortedDims[0]
  const weakestDim = sortedDims[sortedDims.length - 1]

  return (
    <div className="space-y-8">
      {/* 顶部标题区域 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${attentionLevel.color}`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-24 -translate-x-24 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Focus className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-2 flex-wrap"
              >
                <span className="px-4 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
                  {mode === 'professional' ? '专业版·深度分析' : mode === 'advanced' ? '高级版·多维评估' : '标准版·核心测评'}
                </span>
                <span className="px-4 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
                  注意力能力测评
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white mb-2"
              >
                {attentionLevel.title}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 mb-3"
              >
                <span className="text-4xl font-black text-white">{totalScore}</span>
                <span className="px-3 py-1 bg-white/30 rounded-full text-white font-bold">
                  {attentionLevel.level} 水平
                </span>
                <span className="text-white/80">超越 {Math.round((1 - totalScore / 100) * 100)}% 的参与者</span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/90 text-lg"
              >
                {attentionLevel.description}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CircularProgressChart
                score={totalScore}
                size="large"
                colorScheme="violet"
                showPercentage
                animated
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 注意力四维雷达图 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Eye className="w-6 h-6 text-violet-400" />
          注意力四维能力模型
        </h3>
        <AdvancedRadarChart
          dimensions={dimensions.map(d => {
            const key = ATTENTION_NAME_MAP[d.name] || d.name
            const dimInfo = ATTENTION_DIMENSIONS[key as keyof typeof ATTENTION_DIMENSIONS]
            return {
              name: dimInfo?.name || d.name,
              score: d.score ?? 0,
              maxScore: 100,
            }
          })}
          animated
        />
      </motion.div>

      {/* 维度柱状图对比 */}
      {dimensions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-400" />
            四维注意力能力对比
          </h3>
          <div className="space-y-4">
            {dimensions.map((dim, index) => {
              const key = ATTENTION_NAME_MAP[dim.name] || dim.name
              const dimInfo = ATTENTION_DIMENSIONS[key as keyof typeof ATTENTION_DIMENSIONS]
              const Icon = dimInfo?.icon || Eye
              const score = dim.score ?? 0
              const levelInfo = getAttentionLevelInfo(score)
              return (
                <motion.div
                  key={dim.name || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.1 }}
                  className={`bg-gradient-to-br ${dimInfo?.color || 'from-slate-500 to-gray-500'}/10 rounded-xl p-4 border border-white/10`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-white/70" />
                      <span className="text-white font-semibold">{dimInfo?.name || dim.name || '未知维度'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${levelInfo.color}`}>
                        {levelInfo.level}
                      </span>
                      <span className="text-2xl font-bold text-white">{score}</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                      className={`h-full ${levelInfo.barColor} rounded-full`}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-8 text-center"
        >
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-white mb-2">暂无维度数据</h3>
          <p className="text-white/60">该测评暂未提供详细的维度分析数据</p>
        </motion.div>
      )}

      {/* 最强与最弱维度对比 */}
      {dimensions.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* 最强维度 */}
          {strongestDim && (() => {
            const key = ATTENTION_NAME_MAP[strongestDim.name] || strongestDim.name
            const dimInfo = ATTENTION_DIMENSIONS[key as keyof typeof ATTENTION_DIMENSIONS]
            const Icon = dimInfo?.icon || Shield
            return (
              <div className="glass rounded-3xl p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-emerald-300 text-sm font-medium">最强维度</div>
                    <div className="text-white font-bold text-lg">{dimInfo?.name || strongestDim.name}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-black text-emerald-400">{strongestDim.score ?? 0}</span>
                  <span className="text-emerald-300/70 text-sm ml-2">分</span>
                </div>
                <p className="text-white/70 text-sm mb-4">{dimInfo?.description}</p>
                <div className="space-y-2">
                  <div className="text-emerald-300 text-xs font-semibold mb-2">核心能力</div>
                  {dimInfo?.abilities?.map((ability, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {ability}
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* 最需提升维度 */}
          {weakestDim && (() => {
            const key = ATTENTION_NAME_MAP[weakestDim.name] || weakestDim.name
            const dimInfo = ATTENTION_DIMENSIONS[key as keyof typeof ATTENTION_DIMENSIONS]
            const Icon = dimInfo?.icon || AlertTriangle
            return (
              <div className="glass rounded-3xl p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-amber-300 text-sm font-medium">最需提升</div>
                    <div className="text-white font-bold text-lg">{dimInfo?.name || weakestDim.name}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-black text-amber-400">{weakestDim.score ?? 0}</span>
                  <span className="text-amber-300/70 text-sm ml-2">分</span>
                </div>
                <p className="text-white/70 text-sm mb-4">{dimInfo?.description}</p>
                <div className="space-y-2">
                  <div className="text-amber-300 text-xs font-semibold mb-2">可通过训练改善</div>
                  {dimInfo?.abilities?.map((ability, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {ability}
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </motion.div>
      )}

      {/* 优势与建议对比 */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-3xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-green-400" />
            注意力优势
          </h3>
          <ul className="space-y-4">
            {result.strengths?.map((strength, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 mt-2 flex-shrink-0" />
                <span className="text-white/80 leading-relaxed">{strength}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-3xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            注意力挑战
          </h3>
          <ul className="space-y-4">
            {result.weaknesses?.map((weakness, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 mt-2 flex-shrink-0" />
                <span className="text-white/80 leading-relaxed">{weakness}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* 注意力类型诊断 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Brain className="w-6 h-6 text-cyan-400" />
          您的注意力特征
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { type: '专注型', desc: '擅长长时间深度专注', icon: '🎯' },
            { type: '灵活型', desc: '擅长快速切换和多任务', icon: '🔄' },
            { type: '敏锐型', desc: '擅长细节观察和筛选', icon: '🔍' },
            { type: '均衡型', desc: '各维度发展较为平衡', icon: '⚖️' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 + index * 0.08 }}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20 text-center"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-white font-bold mb-1">{item.type}</div>
              <p className="text-white/60 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 提升建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          注意力提升行动计划
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {result.suggestions?.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.75 + index * 0.08 }}
              className="flex items-start gap-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-5 border border-emerald-500/20"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 font-bold">{index + 1}</span>
              </div>
              <p className="text-white/80 leading-relaxed pt-1">{suggestion}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 专业版专属内容 */}
      {mode === 'professional' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass rounded-3xl p-8 border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              专业版专属 · 注意力训练与日常应用
            </span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">日常工作应用</span>
              </div>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  使用番茄工作法，每25分钟专注后休息5分钟
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  减少多任务处理，专注于单一重要任务
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  创造低干扰的工作环境，减少外界干扰
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  使用待办事项清单，减少大脑记忆负担
                </li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-pink-400" />
                <span className="text-white font-semibold">认知训练建议</span>
              </div>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  每日进行5-10分钟的正念冥想练习
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  玩专注力训练游戏如舒尔特方格
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  练习快速阅读提升信息筛选能力
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  保证充足睡眠，睡眠不足会严重影响注意力
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
