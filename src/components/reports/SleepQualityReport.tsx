import { motion } from 'framer-motion'
import { Moon, Star, Coffee, Clock, Target, Zap, Heart, Sun } from 'lucide-react'
import { AdvancedBarChart, CircularProgressChart, AdvancedRadarChart } from '../charts'
import type { AssessmentResult } from '../../types'
import { safeDimensions, getScoreBand } from './utils'

interface SleepQualityProps {
  result: AssessmentResult
  mode?: 'normal' | 'advanced' | 'professional'
}

const SLEEP_LEVELS = [
  { min: 0, max: 5, title: '睡眠质量优秀', level: 'S级', color: 'from-indigo-500 to-purple-600', desc: '睡眠良好，继续保持' },
  { min: 5, max: 10, title: '睡眠质量良好', level: 'A级', color: 'from-blue-500 to-indigo-500', desc: '整体不错，仍可提升' },
  { min: 10, max: 15, title: '睡眠质量一般', level: 'B级', color: 'from-cyan-500 to-blue-500', desc: '需要关注睡眠习惯' },
  { min: 15, max: 21, title: '睡眠质量较差', level: 'C级', color: 'from-amber-500 to-orange-500', desc: '建议采取改善措施' },
]

const PSQI_DIMENSIONS = [
  { name: '主观睡眠质量', key: 'sleepQuality', icon: Moon },
  { name: '入睡时间', key: 'sleepLatency', icon: Clock },
  { name: '睡眠时间', key: 'sleepDuration', icon: Coffee },
  { name: '睡眠效率', key: 'sleepEfficiency', icon: Target },
  { name: '睡眠障碍', key: 'sleepDisturbance', icon: Zap },
  { name: '催眠药物', key: 'hypnoticDrugs', icon: Heart },
  { name: '日间功能障碍', key: 'daytimeDysfunction', icon: Sun },
]

const SLEEP_CYCLES = [
  { stage: '浅睡', duration: '5-10分钟', color: 'bg-blue-400' },
  { stage: '深睡', duration: '20-40分钟', color: 'bg-indigo-500' },
  { stage: 'REM', duration: '10-60分钟', color: 'bg-purple-600' },
]

const SLEEP_IMPROVEMENTS = [
  { dimension: 'sleepQuality', tips: ['睡前放松训练', '避免睡前焦虑', '建立睡前仪式'] },
  { dimension: 'sleepLatency', tips: ['固定入睡时间', '睡前减少刺激', '创造黑暗环境'] },
  { dimension: 'sleepDuration', tips: ['保证7-8小时睡眠', '避免白天睡太久', '规律作息'] },
  { dimension: 'sleepEfficiency', tips: ['避免睡前使用手机', '营造舒适睡眠环境', '适度运动'] },
  { dimension: 'sleepDisturbance', tips: ['改善睡眠环境', '睡前少喝水', '调整室温'] },
  { dimension: 'hypnoticDrugs', tips: ['优先非药物方法', '咨询医生', '避免自行用药'] },
  { dimension: 'daytimeDysfunction', tips: ['规律作息', '白天适当运动', '避免午睡过长'] },
]

export default function SleepQualityReport({ result, mode = 'normal' }: SleepQualityProps) {
  const dimensions = safeDimensions(result?.dimensions, PSQI_DIMENSIONS.map(d => d.key))
  const totalScore = result?.score ?? 0
  const levelInfo = SLEEP_LEVELS.find(l => totalScore >= l.min && totalScore < l.max) || SLEEP_LEVELS[SLEEP_LEVELS.length - 1]
  
  const avgSleepHours = 7.5 - (totalScore / 21) * 2.5
  const avgSleepTime = 22 + (totalScore / 21) * 2
  const sleepEfficiency = Math.max(60, 100 - (totalScore / 21) * 30)

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${levelInfo.color} opacity-90`} />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-[10%] right-[5%] text-white/20 text-8xl">🌙</div>
        <div className="absolute bottom-[5%] left-[15%] text-white/15 text-5xl">⭐</div>
        <div className="absolute top-[25%] right-[20%] text-white/10 text-4xl">✨</div>
        
        <div className="relative p-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Moon className="w-8 h-8 text-white/80" />
              <span className="text-white/80 font-medium">睡眠质量 · 专业报告</span>
            </div>
            {mode === 'professional' && (
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center gap-2">
                <Star className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">专业版</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Moon className="w-12 h-12 text-white" />
                <h1 className="text-5xl font-black text-white">
                  {levelInfo.title}
                </h1>
              </div>
              <p className="text-white/70 text-xl mb-2">睡眠等级: {levelInfo.level}</p>
              <p className="text-white/80 text-lg">{levelInfo.desc}</p>
            </div>
            <div className="text-center">
              <CircularProgressChart
                score={Math.max(0, 100 - (totalScore / 21) * 100)}
                title="睡眠质量指数"
                size="large"
                colorScheme={totalScore <= 5 ? 'violet' : totalScore <= 10 ? 'blue' : totalScore <= 15 ? 'cyan' : 'amber'}
                showScore
                animated
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-indigo-400" />
          睡眠统计数据
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: '平均睡眠时间', value: `${avgSleepHours.toFixed(1)}小时`, icon: Coffee, color: 'text-blue-400' },
            { label: '平均入睡时间', value: `${Math.floor(avgSleepTime)}:${((avgSleepTime % 1) * 60).toFixed(0).padStart(2, '0')}`, icon: Moon, color: 'text-indigo-400' },
            { label: '睡眠效率', value: `${sleepEfficiency.toFixed(0)}%`, icon: Target, color: 'text-purple-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white/5 rounded-2xl p-6 text-center border border-white/10"
            >
              <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-white/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-400" />
          PSQI 七维分析
        </h3>
        {dimensions.length > 0 ? (
          <>
            <AdvancedRadarChart
              dimensions={dimensions.map((d, i) => ({
                name: PSQI_DIMENSIONS[i]?.name || d.name || '未知',
                score: Math.max(0, 100 - (d.score ?? 0)),
                maxScore: 100,
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Moon className="w-6 h-6 text-purple-400" />
          睡眠周期可视化
        </h3>
        <div className="space-y-4">
          {SLEEP_CYCLES.map((cycle, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className={`w-3 h-3 rounded-full ${cycle.color}`} />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white font-medium">{cycle.stage}</span>
                  <span className="text-white/60 text-sm">{cycle.duration}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${30 + i * 20}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className={`h-full ${cycle.color}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
          <p className="text-white/80 text-sm">💡 提示：完整睡眠周期约90分钟，每晚经历4-6个周期，包含浅睡、深睡和REM睡眠阶段</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-cyan-400" />
          睡眠改善建议
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {dimensions.map((dim, i) => {
            const dimInfo = PSQI_DIMENSIONS.find(d => d.key === dim.name || d.name === dim.name)
            const improvement = SLEEP_IMPROVEMENTS.find(s => s.dimension === dim.name)
            if (!improvement || (dim.score ?? 0) < 50) return null
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-blue-500/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  {dimInfo?.icon && <dimInfo.icon className="w-4 h-4 text-blue-400" />}
                  <h4 className="text-white font-medium">{dimInfo?.name || dim.name}</h4>
                </div>
                <ul className="space-y-1">
                  {improvement.tips.slice(0, 2).map((tip, j) => (
                    <li key={j} className="text-white/70 text-sm flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
