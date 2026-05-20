import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Brain, Heart, Users, Briefcase, Target, Leaf, Smile, BookOpen, FileText, Shield, Zap, Coffee, CloudRain, CloudSun, Lightbulb, Flame, Calendar, Droplets, ChevronRight, Clock, List, MessageCircle, SmilePlus, Frown, BrainCircuit, TrendingUp, Gauge, Layers, Puzzle, Cpu, BookMarked, MessageSquare, HeartHandshake, Eye, Scale, Compass, LeafIcon, SunMedium, Moon, Star, Sparkle, Wind, Waves, Mountain, MountainSnow, CircleDot } from 'lucide-react'

interface Assessment {
  id: string
  title: string
  description: string
  icon: any
  path: string
  badge?: string
  questionCount?: number
  duration?: number
  category: string
}

const ALL_ASSESSMENTS: Assessment[] = [
  // 人格类
  { id: 'sbti-personality', title: 'MBTI 16型人格测试', description: '了解你的人格类型', icon: Brain, path: '/app/assessment/sbti-personality/mode-select', badge: '热门', questionCount: 24, duration: 5, category: '人格' },
  { id: 'sbti-60', title: 'MBTI 进阶人格测试', description: '深入了解人格特质', icon: BrainCircuit, path: '/app/assessment/sbti-60/mode-select', badge: '进阶', questionCount: 60, duration: 12, category: '人格' },
  { id: 'sbti-professional', title: 'MBTI 专业完整版', description: '最全面的人格分析', icon: Layers, path: '/app/assessment/sbti-professional/mode-select', badge: '专业', questionCount: 120, duration: 20, category: '人格' },
  { id: 'ocean-bigfive', title: '大五人格测试', description: '全面了解你的人格特质', icon: TrendingUp, path: '/app/assessment/ocean-bigfive/mode-select', badge: '热门', questionCount: 28, duration: 6, category: '人格' },
  { id: 'bigfive-advanced', title: '大五人格进阶版', description: '深入分析五大特质', icon: Gauge, path: '/app/assessment/bigfive-advanced/mode-select', questionCount: 60, duration: 10, category: '人格' },
  { id: 'dark-triad', title: '黑暗三人格测试', description: '探索你的阴暗面', icon: Flame, path: '/app/assessment/dark-triad/mode-select', questionCount: 28, duration: 6, category: '人格' },
  { id: 'darktriad-professional', title: '黑暗三角人格深度版', description: '全面评估黑暗人格', icon: Frown, path: '/app/assessment/darktriad-professional/mode-select', questionCount: 36, duration: 8, category: '人格' },
  { id: 'hardiness-standard', title: '心理韧性测试', description: '评估你的抗压能力', icon: Shield, path: '/app/assessment/hardiness-standard/mode-select', questionCount: 28, duration: 6, category: '人格' },
  { id: 'hardiness-professional', title: '心理韧性完整版', description: '专业级心理韧性评估', icon: Star, path: '/app/assessment/hardiness-professional/mode-select', questionCount: 45, duration: 10, category: '人格' },
  { id: 'mental-age', title: '心理年龄测试', description: '测测你的心理年龄', icon: Calendar, path: '/app/assessment/mental-age/mode-select', questionCount: 20, duration: 4, category: '人格' },
  { id: 'mindset-standard', title: '成长型思维测试', description: '了解你的思维模式', icon: Lightbulb, path: '/app/assessment/mindset-standard/mode-select', questionCount: 28, duration: 6, category: '人格' },
  { id: 'mindset-professional', title: '成长型思维深度版', description: '深度分析思维模式', icon: Sparkle, path: '/app/assessment/mindset-professional/mode-select', questionCount: 36, duration: 8, category: '人格' },
  { id: 'metacognition-standard', title: '元认知能力测试', description: '评估你的自我反思能力', icon: Eye, path: '/app/assessment/metacognition-standard/mode-select', questionCount: 28, duration: 6, category: '人格' },
  { id: 'metacognition-professional', title: '元认知专业版', description: '专业级元认知评估', icon: BrainCircuit, path: '/app/assessment/metacognition-professional/mode-select', questionCount: 45, duration: 10, category: '人格' },
  { id: 'disc-standard', title: 'DISC行为风格测试', description: '了解你的行为倾向', icon: Zap, path: '/app/assessment/disc-standard/mode-select', questionCount: 28, duration: 5, category: '人格' },
  { id: 'disc-professional', title: 'DISC完整版', description: '深度分析行为风格', icon: Layers, path: '/app/assessment/disc-professional/mode-select', questionCount: 60, duration: 10, category: '人格' },

  // 关系类
  { id: 'ecr-attachment', title: '成人依恋类型测试', description: '了解你的依恋模式', icon: Heart, path: '/app/assessment/ecr-attachment/mode-select', badge: '推荐', questionCount: 28, duration: 6, category: '关系' },
  { id: 'ecr-professional', title: '依恋风格深度版', description: '全面分析依恋模式', icon: HeartHandshake, path: '/app/assessment/ecr-professional/mode-select', questionCount: 36, duration: 8, category: '关系' },
  { id: 'eq-goleman', title: '戈尔曼情商测试', description: '全面评估你的情商', icon: CircleDot, path: '/app/assessment/eq-goleman/mode-select', questionCount: 28, duration: 6, category: '关系' },
  { id: 'eq-professional', title: '情商深度分析版', description: '多维度情商评估', icon: Gauge, path: '/app/assessment/eq-professional/mode-select', questionCount: 60, duration: 12, category: '关系' },
  { id: 'abm-love-animal', title: '爱情动物测试', description: '探索你的爱情风格', icon: Heart, path: '/app/assessment/abm-love-animal/mode-select', questionCount: 20, duration: 4, category: '关系' },
  { id: 'gma-maturity', title: '情感成熟度测试', description: '评估你的情感成熟度', icon: Sparkles, path: '/app/assessment/gma-maturity/mode-select', questionCount: 28, duration: 6, category: '关系' },
  { id: 'cast-parenting', title: '养育风格测试', description: '了解你的育儿方式', icon: Users, path: '/app/assessment/cast-parenting/mode-select', questionCount: 28, duration: 6, category: '关系' },
  { id: 'tki-normal', title: 'TKI冲突管理模式测试', description: '了解你处理冲突的方式', icon: MessageSquare, path: '/app/assessment/tki-normal/mode-select', questionCount: 30, duration: 6, category: '关系' },
  { id: 'els-normal', title: '情绪劳动量表', description: '评估情绪管理能力', icon: Smile, path: '/app/assessment/els-normal/mode-select', questionCount: 28, duration: 5, category: '关系' },
  { id: 'scid5-screening', title: 'SCID-5人格筛查', description: '专业人格障碍筛查', icon: FileText, path: '/app/assessment/scid5-screening/mode-select', badge: '专业', questionCount: 80, duration: 15, category: '关系' },

  // 心理类
  { id: 'sas-standard', title: '焦虑自评量表', description: '评估你的焦虑水平', icon: CloudRain, path: '/app/assessment/sas-standard/mode-select', badge: '专业', questionCount: 28, duration: 5, category: '心理' },
  { id: 'sas-professional', title: '焦虑深度评估版', description: '全面焦虑评估', icon: Frown, path: '/app/assessment/sas-professional/mode-select', questionCount: 40, duration: 8, category: '心理' },
  { id: 'sds-standard', title: '抑郁自评量表', description: '评估你的抑郁程度', icon: CloudSun, path: '/app/assessment/sds-standard/mode-select', questionCount: 20, duration: 4, category: '心理' },
  { id: 'sds-professional', title: '抑郁深度评估版', description: '全面抑郁评估', icon: Frown, path: '/app/assessment/sds-professional/mode-select', questionCount: 40, duration: 8, category: '心理' },
  { id: 'pss-standard', title: '压力知觉量表', description: '了解你的压力水平', icon: Droplets, path: '/app/assessment/pss-standard/mode-select', questionCount: 20, duration: 4, category: '心理' },
  { id: 'pss-professional', title: '压力知觉完整版', description: '深度压力评估', icon: Gauge, path: '/app/assessment/pss-professional/mode-select', questionCount: 40, duration: 8, category: '心理' },
  { id: 'burnout-mbi', title: '职业倦怠测试', description: '评估职业倦怠程度', icon: Coffee, path: '/app/assessment/burnout-mbi/mode-select', questionCount: 28, duration: 6, category: '心理' },
  { id: 'internet-addiction', title: '网络成瘾测试', description: '评估网络使用情况', icon: Zap, path: '/app/assessment/internet-addiction/mode-select', questionCount: 20, duration: 4, category: '心理' },
  { id: 'scl90-standard', title: '症状自评量表SCL-90', description: '全面心理健康评估', icon: Brain, path: '/app/assessment/scl90-standard/mode-select', badge: '专业', questionCount: 90, duration: 15, category: '心理' },
  { id: 'psqi-standard', title: '匹兹堡睡眠质量指数', description: '评估你的睡眠质量', icon: Moon, path: '/app/assessment/psqi-standard/mode-select', questionCount: 24, duration: 5, category: '心理' },
  { id: 'phq15-standard', title: '躯体症状量表PHQ-15', description: '评估身体症状严重程度', icon: Waves, path: '/app/assessment/phq15-standard/mode-select', questionCount: 15, duration: 3, category: '心理' },
  { id: 'gad7-standard', title: '广泛性焦虑量表GAD-7', description: '筛查焦虑障碍', icon: CloudRain, path: '/app/assessment/gad7-standard/mode-select', questionCount: 7, duration: 2, category: '心理' },
  { id: 'phq9-standard', title: '患者健康问卷PHQ-9', description: '筛查抑郁症状', icon: CloudSun, path: '/app/assessment/phq9-standard/mode-select', questionCount: 9, duration: 2, category: '心理' },
  { id: 'ocb-standard', title: '组织公民行为量表', description: '评估工作表现行为', icon: Star, path: '/app/assessment/ocb-standard/mode-select', questionCount: 24, duration: 5, category: '心理' },

  // 职业类
  { id: 'holland-sds', title: '霍兰德职业兴趣测试', description: '探索适合的职业方向', icon: Briefcase, path: '/app/assessment/holland-sds/mode-select', badge: '热门', questionCount: 28, duration: 6, category: '职业' },
  { id: 'holland-professional', title: '霍兰德职业兴趣完整版', description: '深度职业兴趣分析', icon: Compass, path: '/app/assessment/holland-professional/mode-select', questionCount: 60, duration: 12, category: '职业' },
  { id: 'kolb-standard', title: '学习风格测试', description: '了解你的学习方式', icon: BookOpen, path: '/app/assessment/kolb-standard/mode-select', questionCount: 28, duration: 6, category: '职业' },
  { id: 'kolb-professional', title: '学习风格深度版', description: '全面分析学习偏好', icon: BookMarked, path: '/app/assessment/kolb-professional/mode-select', questionCount: 40, duration: 8, category: '职业' },
  { id: 'mlq-standard', title: '领导力风格测试', description: '评估你的领导能力', icon: Users, path: '/app/assessment/mlq-standard/mode-select', questionCount: 28, duration: 6, category: '职业' },
  { id: 'mlq-professional', title: '领导力完整评估版', description: '多维度领导力分析', icon: TrendingUp, path: '/app/assessment/mlq-professional/mode-select', questionCount: 45, duration: 10, category: '职业' },
  { id: 'iq-ravens', title: '瑞文智力测验', description: '测试你的逻辑推理能力', icon: Lightbulb, path: '/app/assessment/iq-ravens/mode-select', questionCount: 28, duration: 8, category: '职业' },
  { id: 'iq-professional', title: '瑞文智力完整版', description: '更全面的智力评估', icon: BrainCircuit, path: '/app/assessment/iq-professional/mode-select', badge: '专业', questionCount: 60, duration: 15, category: '职业' },
  { id: 'ct-standard', title: '批判性思维测试', description: '评估逻辑思维能力', icon: Puzzle, path: '/app/assessment/ct-standard/mode-select', questionCount: 28, duration: 6, category: '职业' },
  { id: 'ct-professional', title: '批判性思维深度版', description: '深度分析思维能力', icon: Cpu, path: '/app/assessment/ct-professional/mode-select', questionCount: 60, duration: 12, category: '职业' },
  { id: 'belbin-standard', title: '贝尔宾团队角色测试', description: '了解你的团队角色', icon: Users, path: '/app/assessment/belbin-standard/mode-select', questionCount: 56, duration: 10, category: '职业' },
  { id: 'cse-standard', title: '核心自我评价量表', description: '评估职业自我效能', icon: Star, path: '/app/assessment/cse-standard/mode-select', questionCount: 24, duration: 5, category: '职业' },
  { id: 'pes-standard', title: '心理授权量表', description: '评估工作自主感', icon: TrendingUp, path: '/app/assessment/pes-standard/mode-select', questionCount: 24, duration: 5, category: '职业' },

  // 价值观类
  { id: 'ideology-9square', title: '政治坐标九维测试', description: '了解你的政治倾向', icon: Target, path: '/app/assessment/ideology-9square/mode-select', questionCount: 28, duration: 6, category: '价值观' },
  { id: 'ideology-professional', title: '政治坐标完整版', description: '深度政治立场分析', icon: Scale, path: '/app/assessment/ideology-professional/mode-select', questionCount: 60, duration: 12, category: '价值观' },
  { id: 'schwartz-standard', title: '施瓦茨价值观测试', description: '探索你的价值取向', icon: Sparkles, path: '/app/assessment/schwartz-standard/mode-select', questionCount: 28, duration: 6, category: '价值观' },
  { id: 'schwartz-professional', title: '施瓦茨价值观完整版', description: '全面价值观分析', icon: Compass, path: '/app/assessment/schwartz-professional/mode-select', questionCount: 57, duration: 12, category: '价值观' },
  { id: 'mft-standard', title: '道德基础量表', description: '了解你的道德观念', icon: Shield, path: '/app/assessment/mft-standard/mode-select', questionCount: 28, duration: 6, category: '价值观' },
  { id: 'moral-professional', title: '道德基础完整版', description: '深度道德分析', icon: Scale, path: '/app/assessment/moral-professional/mode-select', questionCount: 30, duration: 6, category: '价值观' },
  { id: 'pcq-standard', title: '心理资本问卷', description: '评估你的心理资本', icon: SunMedium, path: '/app/assessment/pcq-standard/mode-select', questionCount: 28, duration: 6, category: '价值观' },
  { id: 'pcq-professional', title: '心理资本完整版', description: '全面心理资本评估', icon: TrendingUp, path: '/app/assessment/pcq-professional/mode-select', questionCount: 44, duration: 10, category: '价值观' },
  { id: 'life-meaning-standard', title: '生命意义感量表', description: '探索生命的意义', icon: Star, path: '/app/assessment/life-meaning-standard/mode-select', questionCount: 28, duration: 6, category: '价值观' },
  { id: 'patriotism-standard', title: '爱国情怀量表', description: '评估国家认同感', icon: Mountain, path: '/app/assessment/patriotism-standard/mode-select', questionCount: 24, duration: 5, category: '价值观' },
  { id: 'officialdom-standard', title: '仕途发展量表', description: '评估职业发展潜力', icon: TrendingUp, path: '/app/assessment/officialdom-standard/mode-select', questionCount: 30, duration: 6, category: '价值观' },

  // 趣味类
  { id: 'fubao-index', title: '福报指数测试', description: '测测你的福报值', icon: Sparkles, path: '/app/assessment/fubao-index/mode-select', badge: '趣味', questionCount: 28, duration: 5, category: '趣味' },
  { id: 'color-subconscious', title: '颜色潜意识测试', description: '色彩揭示你的内心', icon: LeafIcon, path: '/app/assessment/color-subconscious/mode-select', questionCount: 20, duration: 4, category: '趣味' },
  { id: 'foodie-level', title: '吃货等级鉴定', description: '看看你的吃货级别', icon: Coffee, path: '/app/assessment/foodie-level/mode-select', questionCount: 20, duration: 4, category: '趣味' },
  { id: 'onepiece-bounty', title: '海贼王悬赏金测试', description: '你值多少赏金？', icon: Flame, path: '/app/assessment/onepiece-bounty/mode-select', questionCount: 20, duration: 4, category: '趣味' },
  { id: 'pua-resistance', title: 'PUA抵抗力测试', description: '测试你的防坑能力', icon: Shield, path: '/app/assessment/pua-resistance/mode-select', questionCount: 28, duration: 6, category: '趣味' },
  { id: 'berry-standard', title: '贝瑞测试', description: '测测你的性格色彩', icon: MountainSnow, path: '/app/assessment/berry-standard/mode-select', questionCount: 28, duration: 5, category: '趣味' },
  { id: 'love-style-test', title: '爱情风格测试', description: '了解你的爱情观', icon: Heart, path: '/app/assessment/love-style-test/mode-select', badge: '趣味', questionCount: 20, duration: 4, category: '趣味' },
]

export default function AssessmentsPage() {
  const navigate = useNavigate()

  const handleStartAssessment = (path: string) => {
    navigate(path)
  }

  const categories = ['全部', '人格', '关系', '心理', '职业', '价值观', '趣味']
  const [activeCategory, setActiveCategory] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAssessments = ALL_ASSESSMENTS.filter(a => {
    const matchesCategory = activeCategory === '全部' || a.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-3">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-sm text-violet-300">专业测评</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          心理测评中心
        </h1>
        <p className="text-white/50 text-sm">
          通过科学测评，深入了解真实的自己
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-white/50">
          共 {ALL_ASSESSMENTS.length} 个测评
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-violet-500 text-white'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssessments.map((assessment) => {
          const Icon = assessment.icon
          return (
            <button
              key={assessment.id}
              onClick={() => handleStartAssessment(assessment.path)}
              className="group relative overflow-hidden rounded-xl p-4 bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm group-hover:text-violet-300 transition-colors mb-0.5">
                      {assessment.title}
                    </h4>
                    <p className="text-xs text-white/40 line-clamp-1">
                      {assessment.description}
                    </p>
                  </div>
                  {assessment.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-amber-500/20 text-amber-400 shrink-0">
                      {assessment.badge}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    {assessment.questionCount && (
                      <span className="flex items-center gap-1">
                        <List size={12} />
                        {assessment.questionCount}题
                      </span>
                    )}
                    {assessment.duration && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {assessment.duration}分钟
                      </span>
                    )}
                  </div>
                  <ChevronRight size={14} className="text-white/30 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50">没有找到匹配的测评</p>
        </div>
      )}

      <div className="pt-4">
        <div className="rounded-xl p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Sparkles size={18} className="text-violet-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-0.5">更多测评即将上线</h4>
              <p className="text-xs text-white/40">我们正在开发更多专业的心理测评，敬请期待</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}