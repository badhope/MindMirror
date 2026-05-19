import { motion } from 'framer-motion'
import { Cpu, Puzzle, GitBranch, Search, Zap, ArrowRight, Lightbulb, Target, BookOpen, Sparkles } from 'lucide-react'
import { AdvancedRadarChart, CircularProgressChart, AdvancedBarChart } from '../charts'
import type { AssessmentResult } from '../../types'
import { safeDimensions } from './utils'

interface CriticalThinkingProfessionalReportProps {
  result: AssessmentResult
  mode?: 'normal' | 'advanced' | 'professional'
}

const CRITICAL_DIMENSIONS = [
  { key: 'analysis', name: '分析能力', icon: Search, color: '#3B82F6', description: '分解问题、识别关键信息的能力' },
  { key: 'evaluation', name: '评估能力', icon: Target, color: '#8B5CF6', description: '判断信息质量和可靠性的能力' },
  { key: 'inference', name: '推理能力', icon: GitBranch, color: '#10B981', description: '从证据得出结论的能力' },
  { key: 'logic', name: '逻辑思维', icon: Puzzle, color: '#F59E0B', description: '识别和避免逻辑谬误的能力' },
  { key: 'argument', name: '论证能力', icon: ArrowRight, color: '#EC4899', description: '构建有说服力的论证的能力' },
  { key: 'openness', name: '开放思维', icon: Lightbulb, color: '#06B6D4', description: '接受不同观点和新证据的能力' }
]

const THINKING_LEVELS = [
  { level: '思维大师', score: 90, color: 'from-purple-500 to-pink-500', description: '你的批判性思维能力已达到顶尖水平' },
  { level: '深度思考者', score: 80, color: 'from-blue-500 to-cyan-500', description: '你具有优秀的批判性思维能力' },
  { level: '明智分析者', score: 70, color: 'from-emerald-500 to-teal-500', description: '你有良好的批判性思维基础' },
  { level: '学习中探索', score: 60, color: 'from-yellow-500 to-orange-500', description: '你的批判性思维有提升空间' },
  { level: '思维起步', score: 0, color: 'from-gray-500 to-slate-500', description: '这是提升批判性思维的好起点' }
]

export default function CriticalThinkingProfessionalReport({ result, mode = 'normal' }: CriticalThinkingProfessionalReportProps) {
  const dimensions = safeDimensions(result?.dimensions, CRITICAL_DIMENSIONS.map(d => d.key))
  
  const avgScore = dimensions.reduce((sum, d) => sum + (d.score || 0), 0) / dimensions.length
  
  const level = THINKING_LEVELS.find(l => avgScore >= l.score) || THINKING_LEVELS[THINKING_LEVELS.length - 1]
  
  const strongest = [...dimensions].sort((a, b) => (b.score || 0) - (a.score || 0))[0]
  const weakest = [...dimensions].sort((a, b) => (a.score || 0) - (b.score || 0))[0]

  const strongestInfo = CRITICAL_DIMENSIONS.find(d => d.key === strongest?.name || d.key === strongest?.name?.toLowerCase())
  const weakestInfo = CRITICAL_DIMENSIONS.find(d => d.key === weakest?.name || d.key === weakest?.name?.toLowerCase())

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 头部 - 科技感风格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${level.color}`} />
        
        {/* 科技感背景 */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 400 400">
            <defs>
              <pattern id="circuit" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" opacity="0.5"/>
                <path d="M 20 0 L 20 10 M 20 30 L 20 40 M 0 20 L 10 20 M 30 20 L 40 20" 
                      stroke="white" strokeWidth="1" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>
        
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white/80 text-sm uppercase tracking-wider font-semibold">批判性思维评估</h2>
                <p className="text-white/60 text-xs">逻辑分析 · 推理判断 · 决策能力</p>
              </div>
            </div>
            {mode === 'professional' && (
              <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">专业分析</span>
              </div>
            )}
          </div>

          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-white font-bold text-lg">{level.level}</span>
                </div>
                <h1 className="text-4xl font-black text-white">
                  思维能力指数
                </h1>
              </div>
              
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                {level.description}
              </p>
            </div>
            
            <div className="w-48">
              <CircularProgressChart
                score={avgScore}
                title="综合得分"
                size="large"
                colorScheme="custom"
                customColors={['#6C5CE7', '#A29BFE', '#DFE6E9']}
                showScore
                animated
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 优势与劣势对比 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid md:grid-cols-2 gap-4"
      >
        {/* 优势维度 */}
        <div className="glass rounded-3xl p-8 border border-emerald-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">核心优势</h3>
          </div>
          
          {strongestInfo && (
            <div className="bg-emerald-500/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <strongestInfo.icon className="w-8 h-8" style={{ color: strongestInfo.color }} />
                <h4 className="text-2xl font-bold text-emerald-400">
                  {strongestInfo.name}
                </h4>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                {strongestInfo.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">得分</span>
                <span className="text-2xl font-bold text-emerald-400">
                  {(strongest.score || 0).toFixed(0)}
                </span>
              </div>
              <div className="h-3 bg-black/30 rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${strongest.score || 0}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 待提升维度 */}
        <div className="glass rounded-3xl p-8 border border-amber-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">提升空间</h3>
          </div>
          
          {weakestInfo && (
            <div className="bg-amber-500/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <weakestInfo.icon className="w-8 h-8" style={{ color: weakestInfo.color }} />
                <h4 className="text-2xl font-bold text-amber-400">
                  {weakestInfo.name}
                </h4>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                {weakestInfo.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">得分</span>
                <span className="text-2xl font-bold text-amber-400">
                  {(weakest.score || 0).toFixed(0)}
                </span>
              </div>
              <div className="h-3 bg-black/30 rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${weakest.score || 0}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* 6维度雷达图 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Puzzle className="w-6 h-6 text-purple-400" />
          思维能力六维图谱
        </h3>
        <AdvancedRadarChart
          dimensions={CRITICAL_DIMENSIONS.map(info => {
            const dim = dimensions.find(d => d.name === info.key || d.name?.toLowerCase() === info.key)
            return {
              name: info.name,
              score: dim?.score || 0,
              maxScore: 100
            }
          })}
          animated
          color="#8B5CF6"
        />
      </motion.div>

      {/* 各维度分析 - 逻辑风格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-cyan-400" />
          思维能力详细分析
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {CRITICAL_DIMENSIONS.map((info, index) => {
            const dim = dimensions.find(d => d.name === info.key || d.name?.toLowerCase() === info.key)
            const score = dim?.score || 0
            const Icon = info.icon
            
            return (
              <motion.div
                key={info.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.08 }}
                className="bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ backgroundColor: `${info.color}20` }}>
                    <Icon className="w-6 h-6" style={{ color: info.color }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">{info.name}</h4>
                      <span className="text-xl font-bold" style={{ color: info.color }}>
                        {score.toFixed(0)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {info.description}
                    </p>
                    
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: info.color,
                          boxShadow: `0 0 10px ${info.color}40`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.08 }}
                      />
                    </div>
                    
                    {/* 评价标签 */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        score >= 80 ? 'bg-green-500/20 text-green-400' :
                        score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {score >= 80 ? '优秀' : score >= 60 ? '良好' : '需提升'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* 提升建议 - 分维度 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          思维能力提升指南
        </h3>
        
        <div className="space-y-4">
          {avgScore < 60 && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
              <h4 className="text-lg font-semibold text-blue-400 mb-3">🌱 基础训练</h4>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• 每天花10分钟分析一个简单问题的多个角度</li>
                <li>• 练习质疑信息来源，问"为什么"和"证据是什么"</li>
                <li>• 用思维导图整理你的思路</li>
              </ul>
            </div>
          )}
          
          {avgScore >= 60 && avgScore < 80 && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">
              <h4 className="text-lg font-semibold text-purple-400 mb-3">🚀 进阶训练</h4>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• 参与有建设性的辩论，练习构建和反驳论点</li>
                <li>• 阅读批判性思维相关书籍</li>
                <li>• 定期复盘你的决策过程</li>
              </ul>
            </div>
          )}
          
          {avgScore >= 80 && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">✨ 深化精进</h4>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• 尝试教授他人批判性思维方法</li>
                <li>• 参与复杂问题的分析和解决</li>
                <li>• 持续保持开放心态，接纳不同观点</li>
              </ul>
            </div>
          )}
          
          {/* 针对最弱项的建议 */}
          {weakestInfo && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
              <h4 className="text-lg font-semibold text-amber-400 mb-3">
                🎯 重点提升：{weakestInfo.name}
              </h4>
              <p className="text-gray-300 text-sm mb-3">{weakestInfo.description}</p>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• 每天针对该维度进行15分钟的刻意练习</li>
                <li>• 寻找相关的在线课程或资源</li>
                <li>• 在实践中有意识地运用这个能力</li>
              </ul>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* 底部标语 */}
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">
          💡 批判性思维不是天生的，而是通过不断练习培养的技能
        </p>
      </div>
    </div>
  )
}
