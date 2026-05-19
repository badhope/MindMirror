import { motion } from 'framer-motion'
import { 
  Brain, 
  Target, 
  Trophy, 
  Star, 
  TrendingUp, 
  AlertTriangle,
  Award,
  Zap,
  Eye,
  Puzzle,
  Layers,
  Crown
} from 'lucide-react'
import { ComprehensiveChartSystem, AdvancedBarChart, CircularProgressChart, AdvancedRadarChart } from '../charts'
import type { AssessmentResult } from '../../types'

interface RavenReportProps {
  result: AssessmentResult
  mode?: 'normal' | 'advanced' | 'professional'
}

// 瑞文智力测验维度定义
const RAVEN_DIMENSIONS = {
  'pattern': { 
    name: '图形推理', 
    icon: Puzzle, 
    color: 'from-violet-500 to-purple-500', 
    description: '识别图形模式和规律的能力' 
  },
  'spatial': { 
    name: '空间能力', 
    icon: Layers, 
    color: 'from-blue-500 to-cyan-500', 
    description: '在心理上操作和转换视觉图像的能力' 
  },
  'series': { 
    name: '系列推理', 
    icon: TrendingUp, 
    color: 'from-emerald-500 to-teal-500', 
    description: '识别序列和系列中逻辑关系的能力' 
  },
  'classification': { 
    name: '分类能力', 
    icon: Target, 
    color: 'from-amber-500 to-orange-500', 
    description: '根据共同特征对元素进行分类的能力' 
  },
  'matrix': { 
    name: '矩阵补全', 
    icon: Grid, 
    color: 'from-pink-500 to-rose-500', 
    description: '在矩阵结构中找出缺失部分的能力' 
  },
}

// 中文维度名称映射
const RAVEN_NAME_MAP: Record<string, string> = {
  '图形': 'pattern',
  '图形推理': 'pattern',
  '空间': 'spatial',
  '空间能力': 'spatial',
  '系列': 'series',
  '系列推理': 'series',
  '分类': 'classification',
  '分类能力': 'classification',
  '矩阵': 'matrix',
  '矩阵补全': 'matrix',
}

// 瑞文智力等级定义
const RAVEN_LEVELS = [
  { min: 130, level: '极高', title: '智力超群', description: '智力水平处于人群顶尖位置，具有非凡的抽象推理和问题解决能力', iqRange: '130+', percentile: '98+', color: 'from-violet-600 to-purple-500' },
  { min: 120, level: '优秀', title: '智力优秀', description: '智力水平显著高于平均，具有出色的分析思维和创新能力', iqRange: '120-129', percentile: '90-97', color: 'from-blue-500 to-violet-500' },
  { min: 110, level: '中上', title: '智力良好', description: '智力水平高于平均，学习能力和理解力都较为出色', iqRange: '110-119', percentile: '75-89', color: 'from-cyan-500 to-blue-500' },
  { min: 90, level: '中等', title: '智力中等', description: '智力水平处于人群平均水平，具有良好的实用智力', iqRange: '90-109', percentile: '25-74', color: 'from-teal-500 to-cyan-500' },
  { min: 80, level: '中下', title: '智力偏低', description: '智力水平略低于平均，在抽象推理方面可能需要更多练习', iqRange: '80-89', percentile: '10-24', color: 'from-emerald-500 to-teal-500' },
  { min: 0, level: '待评估', title: '智力待发展', description: '需要更多的支持和适当的教学方法来发挥潜能', iqRange: '<80', percentile: '<10', color: 'from-amber-500 to-orange-500' },
]

// 补充 Grid 组件
const Grid = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
)

const getRavenLevel = (score: number) => RAVEN_LEVELS.find(l => score >= l.min) || RAVEN_LEVELS[RAVEN_LEVELS.length - 1]

// 获取IQ等级描述
const getIQLevel = (score: number) => {
  if (score >= 130) return { level: '超常', color: 'bg-violet-500/20 text-violet-300', barColor: 'bg-violet-500' }
  if (score >= 110) return { level: '优秀', color: 'bg-blue-500/20 text-blue-300', barColor: 'bg-blue-500' }
  if (score >= 90) return { level: '良好', color: 'bg-emerald-500/20 text-emerald-300', barColor: 'bg-emerald-500' }
  if (score >= 80) return { level: '一般', color: 'bg-amber-500/20 text-amber-300', barColor: 'bg-amber-500' }
  return { level: '待提升', color: 'bg-red-500/20 text-red-300', barColor: 'bg-red-500' }
}

export default function RavenProfessionalReport({ result, mode = 'normal' }: RavenReportProps) {
  const dimensions = result.dimensions || []
  const totalScore = result.score || 0
  const ravenLevel = getRavenLevel(totalScore)
  const iqScore = result.iqScore || totalScore

  return (
    <div className="space-y-8">
      {/* 顶部标题区域 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${ravenLevel.color}`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-24 -translate-x-24 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-2 flex-wrap"
              >
                <span className="px-4 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
                  {mode === 'professional' ? '专业版·瑞文高级' : mode === 'advanced' ? '高级版·瑞文标准' : '标准版·瑞文测验'}
                </span>
                <span className="px-4 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
                  瑞文推理测验
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white mb-2"
              >
                {ravenLevel.title}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 mb-3"
              >
                <span className="text-4xl font-black text-white">IQ {iqScore}</span>
                <span className="px-3 py-1 bg-white/30 rounded-full text-white font-bold">
                  {ravenLevel.level}
                </span>
                <span className="text-white/80">人群百分位 {Math.round((1 - iqScore / 145) * 100)}%+</span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/90 text-lg"
              >
                {ravenLevel.description}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <CircularProgressChart
                  score={iqScore / 1.45}
                  size="large"
                  colorScheme="violet"
                  showPercentage
                  animated
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white/60" />
                </div>
              </div>
              <span className="text-white/70 text-sm mt-2">IQ值</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* IQ分布对比图 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          智力水平分布对比
        </h3>
        <div className="relative">
          {/* IQ分布条形图可视化 */}
          <div className="flex items-end justify-center gap-2 h-48 mb-4">
            {[
              { range: '70-', width: 8, color: 'bg-amber-500', label: '2%' },
              { range: '70-89', width: 16, color: 'bg-amber-400', label: '14%' },
              { range: '90-109', width: 32, color: 'bg-emerald-500', label: '50%' },
              { range: '110-119', width: 20, color: 'bg-blue-500', label: '18%' },
              { range: '120-129', width: 12, color: 'bg-violet-500', label: '12%' },
              { range: '130+', width: 12, color: 'bg-pink-500', label: '4%' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${item.width * 3}%` }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className={`w-12 ${item.color} rounded-t-lg flex items-end justify-center pb-2`}
              >
                <span className="text-white/80 text-xs font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-2 text-xs text-white/50 mb-2">
            <span>70-</span>
            <span>70-89</span>
            <span>90-109</span>
            <span>110-119</span>
            <span>120-129</span>
            <span>130+</span>
          </div>
          {/* 标记您的位置 */}
          <div className="flex justify-center mt-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full"
            >
              <span className="text-white font-bold">您的IQ: {iqScore}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 维度雷达图 */}
      {dimensions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ComprehensiveChartSystem
            dimensions={dimensions.map(d => {
              const key = RAVEN_NAME_MAP[d.name] || d.name
              const dimInfo = RAVEN_DIMENSIONS[key as keyof typeof RAVEN_DIMENSIONS]
              return {
                name: dimInfo?.name || d.name,
                score: d.score,
                maxScore: 100,
                description: dimInfo?.description || d.description,
              }
            })}
            overallScore={totalScore}
            assessmentType="raven"
            title="五维图形推理能力模型"
          />
        </motion.div>
      ) : null}

      {/* 维度深度解析 */}
      {dimensions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-3xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Eye className="w-6 h-6 text-violet-400" />
            图形推理能力深度分析
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dimensions.map((dim, index) => {
              const key = RAVEN_NAME_MAP[dim.name] || dim.name
              const dimInfo = RAVEN_DIMENSIONS[key as keyof typeof RAVEN_DIMENSIONS]
              const Icon = dimInfo?.icon || Puzzle
              const score = dim.score ?? 0
              const levelInfo = getIQLevel(score)
              return (
                <motion.div
                  key={dim.name || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + index * 0.1 }}
                  className={`bg-gradient-to-br ${dimInfo?.color || 'from-slate-500 to-gray-500'}/15 rounded-xl p-6 border border-white/10`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">{dimInfo?.name || dim.name || '未知维度'}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${levelInfo.color}`}>
                        {levelInfo.level}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 text-sm">得分</span>
                      <span className="text-2xl font-bold text-white">{score}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ delay: 0.55 + index * 0.1, duration: 0.8 }}
                        className={`h-full ${levelInfo.barColor} rounded-full`}
                      />
                    </div>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{dimInfo?.description || '暂无描述'}</p>
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

      {/* 优势与不足对比 */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-3xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-green-400" />
            认知优势
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
            发展领域
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

      {/* 瑞文测验说明 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Brain className="w-6 h-6 text-cyan-400" />
          瑞文推理测验简介
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-5 border border-cyan-500/20">
            <div className="text-cyan-300 font-bold mb-3">关于瑞文测验</div>
            <p className="text-white/70 text-sm leading-relaxed">
              瑞文推理测验（Raven's Progressive Matrices）由英国心理学家约翰·卡文纳德·瑞文于1938年创制，
              是一种非文字的图形推理测验，主要测量人的抽象思维和解决问题的能力。
            </p>
          </div>
          <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl p-5 border border-violet-500/20">
            <div className="text-violet-300 font-bold mb-3">测验特点</div>
            <ul className="text-white/70 text-sm space-y-2">
              <li>• 无需语言文字能力，适合跨文化使用</li>
              <li>• 测量流体智力而非晶体智力</li>
              <li>• 能够有效评估抽象推理能力</li>
              <li>• 是最广泛使用的智力测验之一</li>
            </ul>
          </div>
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
          智力发展建议
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
              专业版专属 · 职业发展与学习指导
            </span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">适合的学术方向</span>
              </div>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  STEM领域（科学、技术、工程、数学）
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  计算机科学与人工智能
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  法律、医学等需要强推理能力的专业
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  金融分析与管理咨询
                </li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-pink-400" />
                <span className="text-white font-semibold">认知能力训练</span>
              </div>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  每日进行数独或逻辑谜题练习
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  练习模式识别和序列推断题目
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  参与需要策略思考的游戏如象棋
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  学习编程培养系统性思维能力
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
