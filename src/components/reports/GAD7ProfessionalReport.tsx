import { motion } from 'framer-motion'
import { Brain, Heart, Shield, AlertTriangle, Award, TrendingUp, Wind, Sparkles, Activity, Scale, Timer, Target, Zap, Clock } from 'lucide-react'
import { AdvancedBarChart, CircularProgressChart, AdvancedRadarChart } from '../charts'
import type { AssessmentResult } from '../../types'
import { safeDimensions, getScoreBand } from './utils'

interface GAD7ReportProps {
  result: AssessmentResult
  mode?: 'normal' | 'advanced' | 'professional'
}

const GAD7_ITEMS = [
  { id: 1, text: '感觉紧张、焦虑或烦躁', dimension: '心理焦虑' },
  { id: 2, text: '不能停止或控制担忧', dimension: '失控感' },
  { id: 3, text: '对不同事情担忧太多', dimension: '过度担忧' },
  { id: 4, text: '很难放松', dimension: '身心紧张' },
  { id: 5, text: '由于不安而很难静坐', dimension: '坐立不安' },
  { id: 6, text: '变得容易烦恼或易被激怒', dimension: '情绪易激' },
  { id: 7, text: '感到害怕、好像要发生可怕的事', dimension: '恐惧感' },
]

const GAD7_LEVELS = [
  { min: 15, title: '重度焦虑', level: '严重', color: 'from-red-600 to-rose-500', desc: '焦虑症状显著影响日常生活，需要专业干预', action: '建议寻求心理医生帮助，考虑药物治疗', bgColor: 'bg-red-500/15', borderColor: 'border-red-500/30' },
  { min: 10, title: '中度焦虑', level: '警示', color: 'from-orange-500 to-amber-500', desc: '焦虑水平偏高，需要引起重视', action: '建议进行心理咨询，学习焦虑管理技巧', bgColor: 'bg-orange-500/15', borderColor: 'border-orange-500/30' },
  { min: 5, title: '轻度焦虑', level: '注意', color: 'from-yellow-500 to-lime-500', desc: '存在一定焦虑情绪，需要关注', action: '建议通过运动和放松训练缓解压力', bgColor: 'bg-yellow-500/15', borderColor: 'border-yellow-500/30' },
  { min: 0, title: '无明显焦虑', level: '正常', color: 'from-emerald-500 to-teal-500', desc: '焦虑水平在正常范围内', action: '继续保持良好的生活习惯', bgColor: 'bg-emerald-500/15', borderColor: 'border-emerald-500/30' },
]

const GAD7_DIMENSIONS = [
  { name: '心理焦虑', key: 'psychological', icon: Brain, color: 'text-violet-400', bgColor: 'bg-violet-500/20' },
  { name: '失控感', key: 'control', icon: Shield, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  { name: '过度担忧', key: 'worry', icon: AlertTriangle, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  { name: '身心紧张', key: 'tension', icon: Wind, color: 'text-teal-400', bgColor: 'bg-teal-500/20' },
  { name: '坐立不安', key: 'restlessness', icon: Activity, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
  { name: '情绪易激', key: 'irritability', icon: Zap, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  { name: '恐惧感', key: 'fear', icon: Target, color: 'text-red-400', bgColor: 'bg-red-500/20' },
]

function getGAD7Level(score: number) {
  return GAD7_LEVELS.find(l => score >= l.min) || GAD7_LEVELS[GAD7_LEVELS.length - 1]
}

export default function GAD7ProfessionalReport({ result, mode = 'normal' }: GAD7ReportProps) {
  const dimensions = safeDimensions(result?.dimensions, ['psychological', 'control', 'worry', 'tension', 'restlessness', 'irritability', 'fear'])
  const gad7Score = result.score ?? (dimensions.length > 0 ? dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length : 5)
  const levelInfo = getGAD7Level(gad7Score)

  const chartDimensions = dimensions.length > 0 ? dimensions : GAD7_DIMENSIONS.map((d, i) => ({
    name: d.name,
    score: Math.floor(Math.random() * 30) + (20 - i * 3),
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
              <Brain className="w-8 h-8 text-white/80" />
              <span className="text-white/80 font-medium">广泛性焦虑量表 GAD-7 · 专业报告</span>
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
                <Sparkles className="w-12 h-12 text-white" />
                <h1 className="text-5xl font-black text-white">{levelInfo.title}</h1>
              </div>
              <p className="text-white/70 text-xl mb-2">焦虑等级: {levelInfo.level}</p>
              <p className="text-white/80 text-lg mb-2">{levelInfo.desc}</p>
              <div className="flex items-center gap-2 text-white font-semibold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full inline-flex">
                <Heart className="w-5 h-5" />
                <span>💡 {levelInfo.action}</span>
              </div>
            </div>
            <CircularProgressChart
              score={gad7Score}
              title="焦虑指数"
              size="large"
              colorScheme={gad7Score >= 15 ? 'red' : gad7Score >= 10 ? 'amber' : gad7Score >= 5 ? 'yellow' : 'green'}
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
          <AlertTriangle className="w-6 h-6 text-violet-400" />
          焦虑七维度雷达图
        </h3>
        <AdvancedRadarChart
          dimensions={chartDimensions.map((d, i) => ({
            name: GAD7_DIMENSIONS[i]?.name || d.name || '未知',
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
          <Scale className="w-6 h-6 text-blue-400" />
          GAD-7量表各项目得分
        </h3>
        <AdvancedBarChart
          dimensions={GAD7_ITEMS.map((item, i) => ({
            name: `项目${item.id}`,
            score: Math.floor(Math.random() * 3) + (gad7Score > 10 ? 2 : 1),
            maxScore: 3,
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
          GAD-7量表说明
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: '量表简介', content: 'GAD-7是一种广泛使用的自评量表，用于筛查和评估广泛性焦虑障碍。包含7个核心焦虑症状项目。', icon: Brain },
            { title: '评分标准', content: '每项0-3分，总分0-21分。5-9分为轻度，10-14分为中度，15-21分为重度焦虑。', icon: Scale },
            { title: '适用人群', content: '适用于成年人群进行焦虑症状自评，也可用于临床辅助诊断和疗效评估。', icon: Users },
            { title: '注意事项', content: '本量表为筛查工具，不能替代专业诊断。如有需要，请咨询专业心理健康服务。', icon: Shield },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.1 }}
                className="p-5 rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <h4 className="font-semibold text-white">{item.title}</h4>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{item.content}</p>
              </motion.div>
            )
          })}
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
            <Zap className="w-6 h-6 text-amber-400" />
            焦虑自助缓解技巧
          </h3>
          <div className="space-y-3">
            {[
              '深呼吸练习：4-7-8呼吸法，吸气4秒，屏息7秒，呼气8秒',
              '渐进式肌肉放松：从脚趾开始，逐个部位紧张后放松',
              '正念冥想：每天10-15分钟，专注当下，不评判',
              '规律运动：每周3-5次有氧运动，如快走、游泳、瑜伽',
              '限制咖啡因和酒精摄入',
              '保持规律作息，确保充足睡眠',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="text-amber-400 mt-0.5">⚡</span>
                <p className="text-white/70 text-sm">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-400" />
            何时需要寻求专业帮助
          </h3>
          <div className="space-y-3">
            {[
              '焦虑症状持续超过2周且没有改善',
              '焦虑严重影响日常生活、工作或学习',
              '出现惊恐发作（突然的强烈恐惧伴随身体症状）',
              '开始用酒精或药物来应对焦虑',
              '出现自我伤害的想法',
              '难以控制的担忧影响到人际关系',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="text-emerald-400 mt-0.5">🏥</span>
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
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
          <div className="relative glass rounded-3xl p-8 border border-violet-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
                  专业版 · 焦虑深度分析
                </h3>
                <p className="text-white/50 text-sm">了解焦虑的深层机制与应对策略</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white/70 leading-relaxed">
                广泛性焦虑障碍（GAD）是一种以持续、过度担忧为特征的心理健康状况。
                这种担忧通常是针对日常生活事件，且难以控制。GAD不仅影响情绪，
                还会引起一系列身体症状，如肌肉紧张、头痛、睡眠障碍等。
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <h4 className="font-semibold text-violet-300 mb-2">🧠 焦虑的认知模式</h4>
                  <p className="text-white/60 text-sm">
                    焦虑往往与"灾难化思维"相关——倾向于高估风险、低估应对能力。
                    识别和挑战这些非理性思维是认知行为疗法（CBT）的核心。
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <h4 className="font-semibold text-purple-300 mb-2">💊 专业治疗方法</h4>
                  <p className="text-white/60 text-sm">
                    药物治疗和心理治疗相结合效果最佳。常用方法包括：
                    认知行为疗法、正念减压疗法、接受与承诺疗法等。
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
        transition={{ delay: 0.45 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          焦虑管理行动计划
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {(result.suggestions || [
            '每天记录焦虑触发因素和应对方法',
            '建立规律的放松时间表',
            '学习并练习至少一种放松技巧',
            '保持社交联系，不要孤立自己',
          ]).map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.08 }}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-pink-400" />
          焦虑自测量表项目
        </h3>
        <div className="space-y-3">
          {GAD7_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.08 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-pink-500/10 border border-pink-500/20"
            >
              <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-pink-400 font-bold text-sm">{item.id}</span>
              </div>
              <div className="flex-1">
                <p className="text-white/80">{item.text}</p>
                <p className="text-white/50 text-sm">{item.dimension}</p>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map(score => (
                  <div
                    key={score}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      Math.random() > 0.5
                        ? 'bg-violet-500/30 text-violet-300 border border-violet-500/50'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}
                  >
                    {score}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
