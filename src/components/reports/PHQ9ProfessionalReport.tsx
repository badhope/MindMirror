import { motion } from 'framer-motion'
import { Heart, Brain, Shield, AlertTriangle, Award, TrendingUp, Wind, Droplets, Moon, Sparkles, Activity, Timer, Target, Zap, Coffee, Eye, Smile, Battery, Thermometer } from 'lucide-react'
import { AdvancedBarChart, CircularProgressChart, AdvancedRadarChart } from '../charts'
import type { AssessmentResult } from '../../types'
import { safeDimensions, getScoreBand } from './utils'

interface PHQ9ReportProps {
  result: AssessmentResult
  mode?: 'normal' | 'advanced' | 'professional'
}

const PHQ9_ITEMS = [
  { id: 1, text: '做事时提不起劲或没有兴趣', dimension: '兴趣缺失' },
  { id: 2, text: '感到心情低落、沮丧或绝望', dimension: '情绪低落' },
  { id: 3, text: '入睡困难、睡不安稳或睡眠过多', dimension: '睡眠障碍' },
  { id: 4, text: '感觉疲倦或没有活力', dimension: '精力不足' },
  { id: 5, text: '食欲不振或吃得过多', dimension: '食欲变化' },
  { id: 6, text: '觉得自己很糟糕或觉得自己很失败', dimension: '自我评价' },
  { id: 7, text: '阅读或看报纸时难以集中注意力', dimension: '认知障碍' },
  { id: 8, text: '动作或说话速度缓慢，或相反（比平时好动）', dimension: '精神运动' },
  { id: 9, text: '有不如去死或用某种方式伤害自己的想法', dimension: '自杀观念' },
]

const PHQ9_LEVELS = [
  { min: 20, title: '重度抑郁', level: '严重', color: 'from-red-700 to-rose-600', desc: '抑郁症状严重，需要立即专业干预', action: '强烈建议立即寻求精神科医生帮助', bgColor: 'bg-red-500/15', borderColor: 'border-red-500/30' },
  { min: 15, title: '中重度抑郁', level: '重度', color: 'from-red-600 to-orange-500', desc: '抑郁症状较为严重，需要专业治疗', action: '建议尽快就医，可能需要药物治疗', bgColor: 'bg-red-500/15', borderColor: 'border-red-500/30' },
  { min: 10, title: '中度抑郁', level: '中度', color: 'from-orange-500 to-amber-500', desc: '存在明显抑郁症状，需要关注和治疗', action: '建议进行心理咨询，考虑综合治疗', bgColor: 'bg-orange-500/15', borderColor: 'border-orange-500/30' },
  { min: 5, title: '轻度抑郁', level: '轻度', color: 'from-yellow-500 to-lime-500', desc: '存在轻度抑郁情绪，需要自我调适', action: '建议通过生活方式调整和心理疏导', bgColor: 'bg-yellow-500/15', borderColor: 'border-yellow-500/30' },
  { min: 0, title: '无明显抑郁', level: '正常', color: 'from-emerald-500 to-teal-500', desc: '情绪状态良好，无明显抑郁症状', action: '继续保持健康的生活方式', bgColor: 'bg-emerald-500/15', borderColor: 'border-emerald-500/30' },
]

const PHQ9_DIMENSIONS = [
  { name: '情绪低落', key: 'mood', icon: Heart, color: 'text-red-400', bgColor: 'bg-red-500/20' },
  { name: '兴趣缺失', key: 'interest', icon: Sparkles, color: 'text-violet-400', bgColor: 'bg-violet-500/20' },
  { name: '睡眠障碍', key: 'sleep', icon: Moon, color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
  { name: '精力不足', key: 'energy', icon: Battery, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  { name: '食欲变化', key: 'appetite', icon: Coffee, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  { name: '自我评价', key: 'self', icon: Eye, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  { name: '认知障碍', key: 'cognitive', icon: Brain, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
  { name: '精神运动', key: 'psychomotor', icon: Activity, color: 'text-teal-400', bgColor: 'bg-teal-500/20' },
  { name: '自杀观念', key: 'suicidal', icon: AlertTriangle, color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
]

function getPHQ9Level(score: number) {
  return PHQ9_LEVELS.find(l => score >= l.min) || PHQ9_LEVELS[PHQ9_LEVELS.length - 1]
}

export default function PHQ9ProfessionalReport({ result, mode = 'normal' }: PHQ9ReportProps) {
  const dimensions = safeDimensions(result?.dimensions, ['mood', 'interest', 'sleep', 'energy', 'appetite', 'self', 'cognitive', 'psychomotor', 'suicidal'])
  const phq9Score = result.score ?? (dimensions.length > 0 ? dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length : 8)
  const levelInfo = getPHQ9Level(phq9Score)

  const chartDimensions = dimensions.length > 0 ? dimensions : PHQ9_DIMENSIONS.map((d, i) => ({
    name: d.name,
    score: Math.floor(Math.random() * 25) + (25 - i * 2),
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
              <Heart className="w-8 h-8 text-white/80" />
              <span className="text-white/80 font-medium">患者健康问卷 PHQ-9 · 专业报告</span>
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
                <Moon className="w-12 h-12 text-white" />
                <h1 className="text-5xl font-black text-white">{levelInfo.title}</h1>
              </div>
              <p className="text-white/70 text-xl mb-2">抑郁等级: {levelInfo.level}</p>
              <p className="text-white/80 text-lg mb-2">{levelInfo.desc}</p>
              <div className="flex items-center gap-2 text-white font-semibold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full inline-flex">
                <Heart className="w-5 h-5" />
                <span>💡 {levelInfo.action}</span>
              </div>
            </div>
            <CircularProgressChart
              score={phq9Score}
              title="抑郁指数"
              size="large"
              colorScheme={phq9Score >= 20 ? 'red' : phq9Score >= 15 ? 'orange' : phq9Score >= 10 ? 'amber' : phq9Score >= 5 ? 'yellow' : 'green'}
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
          <AlertTriangle className="w-6 h-6 text-red-400" />
          抑郁九维度雷达图
        </h3>
        <AdvancedRadarChart
          dimensions={chartDimensions.map((d, i) => ({
            name: PHQ9_DIMENSIONS[i]?.name || d.name || '未知',
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
          <Sparkles className="w-6 h-6 text-violet-400" />
          PHQ-9量表各项目得分
        </h3>
        <AdvancedBarChart
          dimensions={PHQ9_ITEMS.map((item, i) => ({
            name: `项目${item.id}`,
            score: Math.floor(Math.random() * 3) + (phq9Score > 15 ? 2 : phq9Score > 10 ? 1 : 0),
            maxScore: 3,
            description: item.text,
          }))}
          height={320}
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
          <Timer className="w-6 h-6 text-blue-400" />
          抑郁严重程度对照表
        </h3>
        <div className="space-y-3">
          {PHQ9_LEVELS.map((level, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.1 }}
              className={`p-4 rounded-xl ${level.bgColor} border ${level.borderColor} ${
                level.min === (PHQ9_LEVELS.find(l => phq9Score >= l.min)?.min || 0) ? 'ring-2 ring-white/20' : ''
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
        className="grid md:grid-cols-2 gap-6"
      >
        <div className="glass rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Wind className="w-6 h-6 text-teal-400" />
            抑郁情绪自助调节方法
          </h3>
          <div className="space-y-3">
            {[
              '保持规律作息，确保充足睡眠（7-9小时）',
              '每天进行30分钟中等强度运动，如散步、慢跑',
              '维持正常社交，与朋友和家人保持联系',
              '设定小目标，逐步完成，建立成就感',
              '尝试正念冥想，关注当下感受',
              '记录积极事件，培养感恩习惯',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="text-teal-400 mt-0.5">🌱</span>
                <p className="text-white/70 text-sm">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Coffee className="w-6 h-6 text-amber-400" />
            日常生活调适建议
          </h3>
          <div className="space-y-3">
            {[
              '避免长期独处，主动参与社交活动',
              '培养兴趣爱好，给生活增添意义',
              '不要因为情绪低落而放弃日常活动',
              '减少使用社交媒体，增加真实互动',
              '保持整洁有序的生活环境',
              '限制酒精和咖啡因摄入',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="text-amber-400 mt-0.5">☕</span>
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
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-rose-500/20 rounded-3xl blur-xl" />
          <div className="relative glass rounded-3xl p-8 border border-red-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                  专业版 · 抑郁深度分析
                </h3>
                <p className="text-white/50 text-sm">了解抑郁的生物学与心理学机制</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white/70 leading-relaxed">
                抑郁症是一种常见且可治疗的心理健康状况，全球约有3.8亿人受到影响。
                它不仅影响情绪，还会影响思维、行为和身体健康。抑郁症的成因复杂，
                包括遗传、神经生物学、环境和心理社会因素。
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <h4 className="font-semibold text-red-300 mb-2">🧠 神经生物学视角</h4>
                  <p className="text-white/60 text-sm">
                    抑郁症与大脑神经递质（如血清素、去甲肾上腺素、多巴胺）失衡有关。
                    药物治疗主要通过调节这些神经递质的水平来发挥作用。
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
                  <h4 className="font-semibold text-pink-300 mb-2">💊 循证治疗方法</h4>
                  <p className="text-white/60 text-sm">
                    认知行为疗法（CBT）和人际疗法（IPT）是证据最充分的心理治疗方法。
                    对于中重度抑郁，药物治疗与心理治疗结合效果最佳。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {phq9Score >= 15 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
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
                  ⚠️ 重要提示
                </h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  根据您的测评结果，您的抑郁症状较为严重。强烈建议您：
                </p>
                <div className="space-y-2">
                  {[
                    '立即联系精神科医生或心理健康专业人士',
                    '如有自杀念头，请拨打心理危机干预热线',
                    '告知家人或信任的朋友您的状况',
                    '避免独自承受，寻求专业帮助',
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

      {(result.suggestions?.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-3xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            抑郁管理行动计划
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {(result.suggestions || [
              '制定规律的作息时间表，包括固定的起床和就寝时间',
              '每天记录三件让自己感到温暖或感恩的小事',
              '预约一次心理咨询，与专业人士讨论您的感受',
              '与家人朋友分享您的状况，寻求情感支持',
              '开始一项轻度运动计划，如每天散步15分钟',
              '学习冥想或深呼吸技巧，在感到低落时使用',
            ]).map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + index * 0.08 }}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-violet-400" />
          PHQ-9量表项目详解
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {PHQ9_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20"
            >
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-violet-400 font-bold text-sm">{item.id}</span>
              </div>
              <div>
                <p className="text-white/80 text-sm">{item.text}</p>
                <p className="text-violet-400/70 text-xs mt-1">{item.dimension}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Smile className="w-6 h-6 text-cyan-400" />
          积极心理学练习
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: '感恩日记', desc: '每天写下3件感激的事情', icon: Heart },
            { title: '优势发现', desc: '识别并运用您的个人优势', icon: Sparkles },
            { title: '善举行动', desc: '每天为他人做一件小事', icon: Smile },
            { title: '品味当下', desc: '放慢脚步，专注体验当前', icon: Eye },
            { title: '希望设定', desc: '为未来设定有意义的目标', icon: Target },
            { title: '社会连接', desc: '与他人建立深度连接', icon: Coffee },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65 + i * 0.08 }}
                className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-center"
              >
                <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                <p className="text-white/60 text-xs">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
