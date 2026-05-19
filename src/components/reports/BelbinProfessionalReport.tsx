import { motion } from 'framer-motion'
import { 
  Brain, 
  Target, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Award,
  Zap,
  Shield,
  Eye,
  Lightbulb,
  Heart,
  Star,
  Crown,
  Wrench,
  Search
} from 'lucide-react'
import { ComprehensiveChartSystem, AdvancedBarChart, CircularProgressChart, AdvancedRadarChart } from '../charts'
import type { AssessmentResult } from '../../types'

interface BelbinReportProps {
  result: AssessmentResult
  mode?: 'normal' | 'advanced' | 'professional'
}

// 贝尔宾九种团队角色定义
const BELBIN_ROLES = {
  'shaper': { 
    name: '鞭策者 (SH)', 
    icon: Zap, 
    color: 'from-red-500 to-orange-500', 
    description: '推动团队行动，挑战现状，追求目标实现',
    strengths: ['充满活力，积极主动', '敢于面对困难和压力', '推动决策和行动'],
    weaknesses: ['容易急躁，可能激怒他人', '有时过于争强好胜']
  },
  'implementer': { 
    name: '执行者 (IMP)', 
    icon: Shield, 
    color: 'from-blue-500 to-cyan-500', 
    description: '将想法转化为实际行动，可靠、高效、务实',
    strengths: ['做事有条理、有纪律', '勤奋可靠，值得信赖', '将计划付诸实践'],
    weaknesses: ['可能对变化反应迟钝', '有时过于保守']
  },
  'completer': { 
    name: '完美主义者 (CF)', 
    icon: Eye, 
    color: 'from-purple-500 to-violet-500', 
    description: '追求卓越，关注细节，确保高质量成果',
    strengths: ['注重细节，追求完美', '工作认真负责', '发现并纠正错误'],
    weaknesses: ['过度关注细节可能拖延进度', '有时难以放手'],
    color: 'from-purple-500 to-violet-500'
  },
  'coordinator': { 
    name: '协调者 (CO)', 
    icon: Crown, 
    color: 'from-emerald-500 to-teal-500', 
    description: '明确目标，促进决策，协调团队资源',
    strengths: ['成熟、自信、有领导力', '善于分配任务', '促进团队合作'],
    weaknesses: ['可能被认为过于授权', '有时会被聪明人利用']
  },
  'resource-investigator': { 
    name: '资源调查者 (RI)', 
    icon: Search, 
    color: 'from-yellow-500 to-amber-500', 
    description: '探索机会，建立联系，发掘外部资源',
    strengths: ['外向、热情、善于交际', '能够发现新机会', '谈判和建立关系能力强'],
    weaknesses: ['兴趣转移快', '对新想法的热情可能很快消退']
  },
  'monitor-evaluator': { 
    name: '监控评估者 (ME)', 
    icon: Brain, 
    color: 'from-slate-500 to-gray-600', 
    description: '分析选项，客观评估，提供战略视角',
    strengths: ['冷静、理性、策略性强', '能够看到所有选项', '做出明智决策'],
    weaknesses: ['缺乏推动行动的主动性', '有时过于挑剔']
  },
  'teamworker': { 
    name: '团队成员 (TW)', 
    icon: Heart, 
    color: 'from-pink-500 to-rose-500', 
    description: '支持他人，建立和谐，促进团队凝聚力',
    strengths: ['善于倾听、协调', '适应性强、支持他人', '维护团队和谐'],
    weaknesses: ['在冲突面前犹豫不决', '有时难以做出艰难决定']
  },
  'plant': { 
    name: '塑造者 (PL)', 
    icon: Lightbulb, 
    color: 'from-indigo-500 to-blue-500', 
    description: '提供创意和解决方案，擅长创新和复杂问题',
    strengths: ['创造力强，智商高', '能够解决复杂问题', '提供新视角'],
    weaknesses: ['实践能力可能较弱', '与现实脱节的可能性']
  },
  'specialist': { 
    name: '专业者 (SP)', 
    icon: Wrench, 
    color: 'from-cyan-500 to-teal-500', 
    description: '专注专业领域，提供深度知识和技能',
    strengths: ['专业知识深厚', '专注、敬业', '能够提供技术见解'],
    weaknesses: ['视野可能过于狭窄', '对非专业领域兴趣有限']
  },
}

// 中文角色名称映射
const BELBIN_NAME_MAP: Record<string, string> = {
  '鞭策者': 'shaper',
  '鞭策': 'shaper',
  'SH': 'shaper',
  '执行者': 'implementer',
  '执行': 'implementer',
  'IMP': 'implementer',
  '完美主义者': 'completer',
  '完美': 'completer',
  'CF': 'completer',
  '协调者': 'coordinator',
  '协调': 'coordinator',
  'CO': 'coordinator',
  '资源调查者': 'resource-investigator',
  '资源': 'resource-investigator',
  'RI': 'resource-investigator',
  '监控评估者': 'monitor-evaluator',
  '监控': 'monitor-evaluator',
  'ME': 'monitor-evaluator',
  '团队成员': 'teamworker',
  '团队': 'teamworker',
  'TW': 'teamworker',
  '塑造者': 'plant',
  '塑造': 'plant',
  'PL': 'plant',
  '专业者': 'specialist',
  '专业': 'specialist',
  'SP': 'specialist',
}

// 获取角色等级描述
const getRoleLevel = (score: number) => {
  if (score >= 85) return { level: '核心角色', color: 'bg-violet-500/20 text-violet-300', barColor: 'bg-violet-500' }
  if (score >= 70) return { level: '主要角色', color: 'bg-blue-500/20 text-blue-300', barColor: 'bg-blue-500' }
  if (score >= 55) return { level: '辅助角色', color: 'bg-emerald-500/20 text-emerald-300', barColor: 'bg-emerald-500' }
  if (score >= 40) return { level: '一般角色', color: 'bg-amber-500/20 text-amber-300', barColor: 'bg-amber-500' }
  return { level: '弱项角色', color: 'bg-red-500/20 text-red-300', barColor: 'bg-red-500' }
}

export default function BelbinProfessionalReport({ result, mode = 'normal' }: BelbinReportProps) {
  const dimensions = result.dimensions || []
  const totalScore = result.score || 0
  const primaryRole = result.primaryRole || dimensions[0]?.name || 'monitor-evaluator'
  const roleInfo = BELBIN_ROLES[primaryRole as keyof typeof BELBIN_ROLES] || BELBIN_ROLES['monitor-evaluator']

  // 获取前三个角色
  const topRoles = dimensions
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 3)
    .map(d => ({
      key: BELBIN_NAME_MAP[d.name] || d.name,
      info: BELBIN_ROLES[BELBIN_NAME_MAP[d.name] as keyof typeof BELBIN_ROLES] || BELBIN_ROLES['monitor-evaluator'],
      score: d.score ?? 0
    }))

  return (
    <div className="space-y-8">
      {/* 顶部标题区域 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${roleInfo.color}`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-24 -translate-x-24 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Users className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-2 flex-wrap"
              >
                <span className="px-4 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
                  {mode === 'professional' ? '专业版·贝尔宾团队' : mode === 'advanced' ? '高级版·角色分析' : '标准版·团队测评'}
                </span>
                <span className="px-4 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
                  贝尔宾团队角色
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white mb-2"
              >
                您的团队角色定位
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 mb-3"
              >
                <span className="text-2xl font-bold text-white">主导角色：</span>
                <span className="text-2xl font-black text-white">{topRoles[0]?.info?.name || roleInfo.name}</span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/90 text-lg"
              >
                {roleInfo.description}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CircularProgressChart
                score={topRoles[0]?.score || totalScore}
                size="large"
                colorScheme="emerald"
                showPercentage
                animated
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 前三角色展示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-400" />
          您的核心团队角色 TOP 3
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {topRoles.map((role, index) => {
            const Icon = role.info.icon
            return (
              <motion.div
                key={role.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`bg-gradient-to-br ${role.info.color}/20 rounded-xl p-6 border border-white/10 relative`}
              >
                {index === 0 && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold">{role.info.name.split(' (')[0]}</div>
                    <div className="text-white/50 text-xs">{role.info.name.match(/\((.*?)\)/)?.[1]}</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm">角色得分</span>
                    <span className="text-2xl font-bold text-white">{role.score}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${role.score}%` }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                      className={`h-full ${index === 0 ? 'bg-violet-500' : index === 1 ? 'bg-blue-500' : 'bg-emerald-500'} rounded-full`}
                    />
                  </div>
                </div>
                <p className="text-white/60 text-sm">{role.info.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* 九角色雷达图 */}
      {dimensions.length >= 5 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-violet-400" />
            贝尔宾九角色完整图谱
          </h3>
          <AdvancedRadarChart
            dimensions={dimensions.map(d => {
              const key = BELBIN_NAME_MAP[d.name] || d.name
              const dimInfo = BELBIN_ROLES[key as keyof typeof BELBIN_ROLES]
              return {
                name: dimInfo?.name.split(' (')[0] || d.name,
                score: d.score ?? 0,
                maxScore: 100,
              }
            })}
            animated
          />
        </motion.div>
      ) : null}

      {/* 所有角色详细分析 */}
      {dimensions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-3xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-400" />
            九种团队角色详细分析
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dimensions.map((dim, index) => {
              const key = BELBIN_NAME_MAP[dim.name] || dim.name
              const dimInfo = BELBIN_ROLES[key as keyof typeof BELBIN_ROLES]
              const Icon = dimInfo?.icon || Users
              const score = dim.score ?? 0
              const levelInfo = getRoleLevel(score)
              return (
                <motion.div
                  key={dim.name || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + index * 0.08 }}
                  className={`bg-gradient-to-br ${dimInfo?.color || 'from-slate-500 to-gray-500'}/15 rounded-xl p-5 border border-white/10`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm">{dimInfo?.name || dim.name || '未知角色'}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${levelInfo.color}`}>
                        {levelInfo.level}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-white">{score}</span>
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
          <h3 className="text-xl font-bold text-white mb-2">暂无角色数据</h3>
          <p className="text-white/60">该测评暂未提供详细的角色分析数据</p>
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
            <Award className="w-6 h-6 text-green-400" />
            角色优势
          </h3>
          <ul className="space-y-4">
            {topRoles[0]?.info?.strengths?.map((strength, index) => (
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
            需要注意的方面
          </h3>
          <ul className="space-y-4">
            {topRoles[0]?.info?.weaknesses?.map((weakness, index) => (
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

      {/* 团队组合建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-cyan-400" />
          理想团队角色组合
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { role: '协调者', desc: '明确目标，分配任务' },
            { role: '塑造者', desc: '推动进程，驱动变革' },
            { role: '监控评估者', desc: '分析方案，客观评估' },
            { role: '执行者', desc: '落实计划，高效执行' },
            { role: '完美主义者', desc: '检查质量，控制细节' },
            { role: '团队成员', desc: '维护和谐，促进合作' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 + index * 0.08 }}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20"
            >
              <div className="text-cyan-300 font-bold mb-1">{item.role}</div>
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
          团队角色发展建议
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
            <Lightbulb className="w-6 h-6 text-amber-400" />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              专业版专属 · 职场发展与团队协作指南
            </span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">角色发挥策略</span>
              </div>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  在项目中主动承担与角色优势匹配的任务
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  与互补角色建立合作关系，弥补不足
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  在团队会议中发挥角色的独特视角
                </li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-pink-400" />
                <span className="text-white font-semibold">团队建设建议</span>
              </div>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  了解团队成员的角色分布，优化分工
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  避免团队角色过度重叠导致资源浪费
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  鼓励成员发展第二、第三角色能力
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
