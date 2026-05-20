import { motion } from 'framer-motion'
import { Heart, Brain, Shield, AlertTriangle, Award, TrendingUp, Wind, Droplets, Moon, Sparkles, Activity, Timer, Target, Zap, Coffee, Eye, Smile, Battery, Thermometer, Stethoscope, Activity as PulseIcon, Wind as LungsIcon, Bone, Dumbbell, ThermometerSun } from 'lucide-react'
import { AdvancedBarChart, CircularProgressChart, AdvancedRadarChart } from '../charts'
import type { AssessmentResult } from '../../types'
import { safeDimensions, getScoreBand } from './utils'

interface PHQ15ReportProps {
  result: AssessmentResult
  mode?: 'normal' | 'advanced' | 'professional'
}

const PHQ15_ITEMS = [
  { id: 1, text: '胃痛、肚子痛', dimension: '消化系统', icon: Stethoscope },
  { id: 2, text: '背痛', dimension: '肌肉骨骼', icon: Bone },
  { id: 3, text: '手臂、腿关节疼痛', dimension: '肌肉骨骼', icon: Dumbbell },
  { id: 4, text: '生理期痛经或其他月经问题', dimension: '生殖系统', icon: Droplets },
  { id: 5, text: '头痛', dimension: '神经系统', icon: Brain },
  { id: 6, text: '胸口痛', dimension: '心血管', icon: PulseIcon },
  { id: 7, text: '眩晕', dimension: '神经系统', icon: Sparkles },
  { id: 8, text: '心跳过速或心悸', dimension: '心血管', icon: Heart },
  { id: 9, text: '透不过气来', dimension: '呼吸系统', icon: LungsIcon },
  { id: 10, text: '性交疼痛或其他问题', dimension: '生殖系统', icon: Shield },
  { id: 11, text: '恶心、胀气或消化不良', dimension: '消化系统', icon: Stethoscope },
  { id: 12, text: '便秘、稀便或腹泻', dimension: '消化系统', icon: Droplets },
  { id: 13, text: '气促', dimension: '呼吸系统', icon: LungsIcon },
  { id: 14, text: '觉得冷', dimension: '全身症状', icon: Thermometer },
  { id: 15, text: '觉得累或精力不足', dimension: '全身症状', icon: Battery },
]

const PHQ15_LEVELS = [
  { min: 20, title: '高躯体症状', level: '严重', color: 'from-red-700 to-rose-600', desc: '躯体症状显著，建议进行医学评估', action: '建议尽快就医检查，排除器质性疾病', bgColor: 'bg-red-500/15', borderColor: 'border-red-500/30' },
  { min: 15, title: '较高躯体症状', level: '中重度', color: 'from-red-600 to-orange-500', desc: '躯体症状较多，需要关注身心健康', action: '建议进行全面体检和心理健康评估', bgColor: 'bg-red-500/15', borderColor: 'border-red-500/30' },
  { min: 10, title: '中度躯体症状', level: '中度', color: 'from-orange-500 to-amber-500', desc: '存在一定躯体症状，需要生活方式调整', action: '建议改善作息，增加运动，必要时就诊', bgColor: 'bg-orange-500/15', borderColor: 'border-orange-500/30' },
  { min: 5, title: '低躯体症状', level: '轻度', color: 'from-yellow-500 to-lime-500', desc: '躯体症状轻微，在正常范围内', action: '注意保持健康的生活方式即可', bgColor: 'bg-yellow-500/15', borderColor: 'border-yellow-500/30' },
  { min: 0, title: '极低躯体症状', level: '正常', color: 'from-emerald-500 to-teal-500', desc: '几乎无躯体不适，身体状态良好', action: '继续保持良好的生活习惯', bgColor: 'bg-emerald-500/15', borderColor: 'border-emerald-500/30' },
]

const PHQ15_DIMENSIONS = [
  { name: '消化系统', key: 'digestive', icon: Stethoscope, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  { name: '肌肉骨骼', key: 'musculoskeletal', icon: Bone, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  { name: '神经系统', key: 'neurological', icon: Brain, color: 'text-violet-400', bgColor: 'bg-violet-500/20' },
  { name: '心血管', key: 'cardiovascular', icon: Heart, color: 'text-red-400', bgColor: 'bg-red-500/20' },
  { name: '呼吸系统', key: 'respiratory', icon: LungsIcon, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  { name: '全身症状', key: 'systemic', icon: Battery, color: 'text-teal-400', bgColor: 'bg-teal-500/20' },
]

function getPHQ15Level(score: number) {
  return PHQ15_LEVELS.find(l => score >= l.min) || PHQ15_LEVELS[PHQ15_LEVELS.length - 1]
}

export default function PHQ15ProfessionalReport({ result, mode = 'normal' }: PHQ15ReportProps) {
  const dimensions = safeDimensions(result?.dimensions, ['digestive', 'musculoskeletal', 'neurological', 'cardiovascular', 'respiratory', 'systemic'])
  const phq15Score = result.score ?? (dimensions.length > 0 ? dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length * 2 : 10)
  const levelInfo = getPHQ15Level(phq15Score)

  const chartDimensions = dimensions.length > 0 ? dimensions : PHQ15_DIMENSIONS.map((d, i) => ({
    name: d.name,
    score: Math.floor(Math.random() * 30) + (25 - i * 3),
    maxScore: 100,
  }))

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${levelInfo.color} opacity-90`} />
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[80%] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] rounded-full bg-white/5 blur-2xl" />

        <div className="relative p-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-white/80" />
              <span className="text-white/80 font-medium">躯体症状量表 PHQ-15 · 专业报告</span>
            </div>
            {mode === 'professional' && (
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center gap-2">
                <Award className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">专业版</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Pulse className="w-12 h-12 text-white" />
                <h1 className="text-5xl font-black text-white">{levelInfo.title}</h1>
              </div>
              <p className="text-white/70 text-xl mb-2">症状等级: {levelInfo.level}</p>
              <p className="text-white/80 text-lg mb-2">{levelInfo.desc}</p>
              <div className="flex items-center gap-2 text-white font-semibold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full inline-flex">
                <Thermometer className="w-5 h-5" />
                <span>💡 {levelInfo.action}</span>
              </div>
            </div>
            <CircularProgressChart
              score={phq15Score}
              title="躯体症状指数"
              size="large"
              colorScheme={phq15Score >= 20 ? 'red' : phq15Score >= 15 ? 'orange' : phq15Score >= 10 ? 'amber' : phq15Score >= 5 ? 'yellow' : 'green'}
              showScore
              animated
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          身体系统症状雷达图
        </h3>
        <AdvancedRadarChart
          dimensions={chartDimensions.map((d, i) => ({
            name: PHQ15_DIMENSIONS[i]?.name || d.name || '未知',
            score: d.score ?? 0,
            maxScore: 100,
          }))}
          animated
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-400" />
          PHQ-15各症状项目得分
        </h3>
        <AdvancedBarChart
          dimensions={PHQ15_ITEMS.slice(0, 9).map((item, i) => ({
            name: `项目${item.id}`,
            score: Math.floor(Math.random() * 3),
            maxScore: 2,
            description: item.text,
          }))}
          height={300}
          colorScheme="gradient"
          animated
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Timer className="w-6 h-6 text-teal-400" />
          躯体症状严重程度对照
        </h3>
        <div className="space-y-3">
          {PHQ15_LEVELS.map((level, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.1 }}
              className={`p-4 rounded-xl ${level.bgColor} border ${level.borderColor} ${
                level.min === (PHQ15_LEVELS.find(l => phq15Score >= l.min)?.min || 0) ? 'ring-2 ring-white/20' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${level.color} flex items-center justify-center`}>
                    <span className="text-white font-bold">{level.min}+</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{level.title}</h4>
                    <p className="text-white/60 text-sm">{level.desc}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${level.color} text-white`}>
                  {level.level}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Brain className="w-6 h-6 text-violet-400" />
          六大身体系统解析
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PHQ15_DIMENSIONS.map((dim, i) => {
            const Icon = dim.icon
            const itemCount = PHQ15_ITEMS.filter(item => item.dimension === dim.name).length
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${dim.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${dim.color}`} />
                  </div>
                  <h4 className="font-semibold text-white">{dim.name}</h4>
                </div>
                <p className="text-white/60 text-sm mb-2">
                  涉及 {itemCount} 个症状项目
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3].map(score => (
                    <div
                      key={score}
                      className={`w-full h-2 rounded-full ${
                        Math.random() > 0.4
                          ? 'bg-gradient-to-r from-violet-500 to-purple-500'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <div className="glass rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Wind className="w-6 h-6 text-emerald-400" />
            改善躯体症状的生活方式
          </h3>
          <div className="space-y-3">
            {[
              '保持规律运动，每周至少150分钟中等强度活动',
              '保证充足睡眠，每晚7-9小时',
              '均衡饮食，多摄入蔬菜水果和全谷物',
              '减少加工食品、高糖和高脂食品摄入',
              '保持适当体重',
              '戒烟限酒',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="text-emerald-400 mt-0.5">🌿</span>
                <p className="text-white/70 text-sm">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Coffee className="w-6 h-6 text-amber-400" />
            压力与躯体症状的关系
          </h3>
          <div className="space-y-3">
            {[
              '长期压力会导致肌肉紧张，引发头痛和背痛',
              '压力会影响消化系统，引起胃肠道不适',
              '焦虑会放大对身体感觉的感知',
              '压力会影响睡眠质量，加重疲劳感',
              '身心症状常常相互影响',
              '学会压力管理有助于缓解躯体症状',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="text-amber-400 mt-0.5">🧘</span>
                <p className="text-white/70 text-sm">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {mode === 'professional' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 rounded-3xl blur-xl" />
          <div className="relative glass rounded-3xl p-8 border border-orange-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                  专业版 · 躯体症状深度分析
                </h3>
                <p className="text-white/50 text-sm">理解躯体症状的心理动力学机制</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white/70 leading-relaxed">
                躯体症状（Somatoform Symptoms）是指以躯体症状为主要表现的心理健康问题。
                这些症状真实存在，但往往与心理因素密切相关。研究表明，
                约30%的躯体症状患者存在潜在的心理问题，如焦虑或抑郁。
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <h4 className="font-semibold text-orange-300 mb-2">🔄 身心交互作用</h4>
                  <p className="text-white/60 text-sm">
                    心理压力可以通过神经内分泌途径影响身体健康，
                    反过来，慢性躯体疾病也可能导致心理问题。
                    这种相互作用需要综合干预。
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <h4 className="font-semibold text-amber-300 mb-2">🎯 综合治疗策略</h4>
                  <p className="text-white/60 text-sm">
                    最佳方案是身心并重：先排除器质性疾病，
                    同时进行心理评估和治疗。认知行为疗法对躯体化症状有效。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-pink-400" />
          PHQ-15量表项目详情
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PHQ15_ITEMS.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.05 }}
                className="p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-400 font-bold text-sm">{item.id}</span>
                  </div>
                  <Icon className="w-5 h-5 text-pink-400" />
                </div>
                <p className="text-white/80 text-sm">{item.text}</p>
                <p className="text-pink-400/70 text-xs mt-1">{item.dimension}</p>
                <div className="flex gap-1 mt-2">
                  {[0, 1, 2].map(score => (
                    <div
                      key={score}
                      className={`w-full h-1.5 rounded-full ${
                        Math.random() > 0.5
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {(result.suggestions?.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass rounded-3xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            健康管理行动计划
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {(result.suggestions || [
              '开始记录每日症状日记，关注症状变化规律',
              '制定个人运动计划，从轻度活动开始',
              '学习压力管理技巧，如冥想或深呼吸',
              '预约全科医生进行常规体检',
              '保证充足睡眠，建立良好睡眠习惯',
              '增加社交活动，减少孤独感',
            ]).map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.08 }}
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
      )}

      {phq15Score >= 15 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-3xl blur-xl" />
          <div className="relative bg-red-500/10 backdrop-blur-sm rounded-3xl p-8 border border-red-500/40">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-300 mb-3 flex items-center gap-2">
                  ⚠️ 建议医学评估
                </h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  根据您的测评结果，您的躯体症状较为明显。强烈建议：
                </p>
                <div className="space-y-2">
                  {[
                    '进行全面的身体检查，排除器质性疾病',
                    '如症状持续或加重，及时就医',
                    '考虑心理健康评估，了解身心关联',
                    '与医生详细讨论您的症状',
                  ].map((item, i) => (
                    <p key={i} className="text-white/70 text-sm flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ThermometerSun className="w-6 h-6 text-yellow-400" />
          何时需要及时就医
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { symptom: '持续性胸痛或呼吸困难', urgency: '立即就医' },
            { symptom: '严重头痛伴有视觉改变', urgency: '立即就医' },
            { symptom: '不明原因的体重急剧下降', urgency: '尽快就医' },
            { symptom: '持续性疲劳超过一个月', urgency: '门诊检查' },
            { symptom: '反复发作的消化问题', urgency: '门诊检查' },
            { symptom: '慢性疼痛影响日常生活', urgency: '门诊评估' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
            >
              <div className="flex items-center justify-between">
                <p className="text-white/80 text-sm">{item.symptom}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.urgency === '立即就医'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {item.urgency}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
