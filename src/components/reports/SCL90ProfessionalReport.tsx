import { motion } from 'framer-motion'
import { Heart, Brain, Users, AlertTriangle, Coffee, Frown, Zap, Shield, Eye, Activity, Award } from 'lucide-react'
import { AdvancedBarChart, AdvancedRadarChart } from '../charts'
import type { AssessmentResult } from '../../types'
import { safeDimensions } from './utils'

// SCL-90组件属性接口
interface SCL90ProfessionalReportProps {
  result: AssessmentResult
  mode?: 'normal' | 'advanced' | 'professional'
}

// SCL-90九大症状维度定义
const SCL90_DIMENSIONS = [
  { name: '躯体化', key: 'somatization', icon: Activity, color: 'from-blue-500 to-cyan-500', desc: '身体不适感' },
  { name: '强迫症状', key: 'obsessive', icon: Coffee, color: 'from-purple-500 to-pink-500', desc: '重复行为和思维' },
  { name: '人际关系敏感', key: 'interpersonal', icon: Users, color: 'from-rose-500 to-red-500', desc: '社交困扰' },
  { name: '抑郁', key: 'depression', icon: Frown, color: 'from-orange-500 to-amber-500', desc: '情绪低落' },
  { name: '焦虑', key: 'anxiety', icon: AlertTriangle, color: 'from-yellow-500 to-orange-500', desc: '紧张不安' },
  { name: '敌对', key: 'hostility', icon: Zap, color: 'from-red-500 to-rose-500', desc: '愤怒和敌意' },
  { name: '恐怖', key: 'phobic', icon: Eye, color: 'from-violet-500 to-purple-500', desc: '恐惧和回避' },
  { name: '偏执', key: 'paranoid', icon: Brain, color: 'from-indigo-500 to-violet-500', desc: '多疑和戒备' },
  { name: '精神病性', key: 'psychoticism', icon: Shield, color: 'from-teal-500 to-cyan-500', desc: '思维异常' },
]

// 心理状态等级分类
const PSYCHOLOGICAL_LEVELS = [
  { 
    min: 250, 
    title: '严重心理问题', 
    level: '重度', 
    color: 'from-red-600 to-rose-600',
    desc: '建议立即寻求专业心理帮助',
    icon: AlertTriangle
  },
  { 
    min: 200, 
    title: '中等心理问题', 
    level: '中度', 
    color: 'from-orange-600 to-amber-600',
    desc: '建议咨询专业心理咨询师',
    icon: AlertTriangle
  },
  { 
    min: 160, 
    title: '轻度心理问题', 
    level: '轻度', 
    color: 'from-yellow-600 to-amber-500',
    desc: '建议关注心理健康，适度调节',
    icon: Heart
  },
  { 
    min: 0, 
    title: '心理健康状态良好', 
    level: '正常', 
    color: 'from-emerald-500 to-teal-500',
    desc: '继续保持积极健康的生活方式',
    icon: Heart
  },
]

// 心理健康建议数据
const MENTAL_HEALTH_ADVICE = [
  { dimension: '躯体化', advice: '保持规律作息，适当运动放松身体' },
  { dimension: '强迫症状', advice: '尝试正念冥想，减少完美主义倾向' },
  { dimension: '人际关系', advice: '主动与朋友家人沟通，建立支持系统' },
  { dimension: '抑郁', advice: '保持阳光心态，增加户外活动和社交' },
  { dimension: '焦虑', advice: '学习放松技巧，必要时寻求专业帮助' },
  { dimension: '敌对', advice: '培养同理心，学会换位思考' },
  { dimension: '恐怖', advice: '循序渐进面对恐惧，寻求认知行为治疗' },
  { dimension: '偏执', advice: '客观理性看待问题，增强安全感' },
  { dimension: '精神病性', advice: '建议专业评估和干预' },
]

export default function SCL90ProfessionalReport({ result, mode = 'normal' }: SCL90ProfessionalReportProps) {
  // 安全获取维度数据
  const dimensions = safeDimensions(result?.dimensions, SCL90_DIMENSIONS.map(d => d.key))
  
  // 计算总症状指数（T似然计分）
  const totalScore = dimensions.reduce((sum, d) => sum + (d.score ?? 0), 0)
  const averageScore = dimensions.length > 0 ? totalScore / dimensions.length : 0
  
  // 获取心理状态等级
  const levelInfo = PSYCHOLOGICAL_LEVELS.find(level => totalScore >= level.min) || PSYCHOLOGICAL_LEVELS[PSYCHOLOGICAL_LEVELS.length - 1]
  const LevelIcon = levelInfo.icon

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 顶部标题区域 - 渐变背景 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* 渐变背景层 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${levelInfo.color} opacity-90`} />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative p-10">
          {/* 顶部标签区域 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-white/80" />
              <span className="text-white/80 font-medium">SCL-90 · 症状自评量表</span>
            </div>
            {mode === 'professional' && (
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center gap-2">
                <Award className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">专业版</span>
              </div>
            )}
          </div>
          
          {/* 主标题和评分区域 */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <LevelIcon className="w-12 h-12 text-white" />
                <h1 className="text-5xl font-black text-white">
                  {levelInfo.title}
                </h1>
              </div>
              <p className="text-white/70 text-xl mb-2">心理状态: {levelInfo.level}</p>
              <p className="text-white/80 text-lg">{levelInfo.desc}</p>
            </div>
            
            {/* 总分和均分显示 */}
            <div className="text-center space-y-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-white/80 text-sm mb-1">总分</p>
                <p className="text-white text-4xl font-bold">{totalScore.toFixed(0)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-white/70 text-xs mb-1">均分</p>
                <p className="text-white text-2xl font-bold">{averageScore.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 症状维度雷达图 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-3xl p-8"
      >
        {dimensions.length > 0 ? (
          <>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-400" />
              九大症状维度雷达图
            </h3>
            <AdvancedRadarChart
              dimensions={dimensions.map((d, i) => ({
                name: SCL90_DIMENSIONS[i]?.name || d.name || '未知',
                score: d.score ?? 0,
                maxScore: 50,
              }))}
              animated
            />
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">暂无维度数据</h3>
            <p className="text-white/60">该测评暂未提供详细的维度分析数据</p>
          </div>
        )}
      </motion.div>

      {/* 症状维度柱状图分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          症状维度详细分析
        </h3>
        <AdvancedBarChart
          dimensions={dimensions.map((d, i) => ({
            name: SCL90_DIMENSIONS[i]?.name || d.name || '未知',
            score: d.score ?? 0,
            maxScore: 50,
          }))}
          animated
        />
      </motion.div>

      {/* 各维度详细解读 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-400" />
          各维度详细解读
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {SCL90_DIMENSIONS.map((dim, i) => {
            const dimData = dimensions[i]
            const score = dimData?.score ?? 0
            const DimensionIcon = dim.icon
            
            return (
              <motion.div
                key={dim.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DimensionIcon className={`w-5 h-5 bg-gradient-to-br ${dim.color} bg-clip-text text-transparent`} />
                    <h4 className="text-white font-semibold">{dim.name}</h4>
                  </div>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${
                    score > 35 ? 'bg-red-500/20 text-red-300' :
                    score > 25 ? 'bg-amber-500/20 text-amber-300' :
                    score > 15 ? 'bg-blue-500/20 text-blue-300' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {score > 35 ? '偏高' : score > 25 ? '中等' : score > 15 ? '轻度' : '正常'}
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-2">{dim.desc}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${dim.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${(score / 50) * 100}%` }}
                    />
                  </div>
                  <span className="text-white/80 text-sm font-mono w-12 text-right">{score.toFixed(1)}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* 心理健康建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-emerald-400" />
          心理健康建议
        </h3>
        <div className="space-y-3">
          {MENTAL_HEALTH_ADVICE.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 mt-2" />
              <div>
                <p className="text-white font-medium mb-1">{item.dimension}</p>
                <p className="text-white/60 text-sm">{item.advice}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 温馨提示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-white font-semibold mb-2">温馨提示</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              SCL-90量表是一项自我评估工具，结果仅供参考。如果您或身边的人在生活中遇到心理困扰，
              建议及时寻求专业心理咨询师或精神科医生的帮助。心理健康是整体健康的重要组成部分，
              关注心理状态，关爱自我，是走向幸福生活的重要一步。
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
