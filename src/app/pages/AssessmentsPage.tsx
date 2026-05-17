import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Brain, Heart, Leaf, Briefcase, Target, Smile, Flame, Sparkles, Clock, ChevronRight } from 'lucide-react'

type CategoryType = 'personality' | 'relationship' | 'mental' | 'career' | 'values' | 'fun'

const CATEGORIES: { id: CategoryType; label: string; icon: typeof Brain; color: string }[] = [
  { id: 'personality', label: '人格性格', icon: Brain, color: 'from-violet-500 to-purple-500' },
  { id: 'relationship', label: '情感关系', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'mental', label: '心理健康', icon: Leaf, color: 'from-emerald-500 to-teal-500' },
  { id: 'career', label: '职业发展', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
  { id: 'values', label: '价值观', icon: Target, color: 'from-amber-500 to-orange-500' },
  { id: 'fun', label: '趣味测试', icon: Smile, color: 'from-rose-500 to-pink-500' },
]

const ASSESSMENTS: Record<CategoryType, { id: string; title: string; desc: string; questions: number; duration: number; badge?: string }[]> = {
  personality: [
    { id: 'sbti-personality', title: 'MBTI 16型人格', desc: '了解你的人格类型', questions: 24, duration: 5, badge: '热门' },
    { id: 'ocean-bigfive', title: '大五人格测试', desc: '全面了解你的人格特质', questions: 28, duration: 6 },
    { id: 'dark-triad', title: '黑暗三人格', desc: '探索你的阴暗面', questions: 28, duration: 6 },
    { id: 'hardiness-standard', title: '心理韧性测试', desc: '评估你的抗压能力', questions: 28, duration: 6 },
    { id: 'mental-age', title: '心理年龄测试', desc: '测测你的心理年龄', questions: 20, duration: 4 },
    { id: 'mindset-standard', title: '成长型思维', desc: '了解你的思维模式', questions: 28, duration: 6 },
  ],
  relationship: [
    { id: 'ecr-attachment', title: '成人依恋类型', desc: '了解你的依恋模式', questions: 28, duration: 6, badge: '推荐' },
    { id: 'eq-goleman', title: '戈尔曼情商测试', desc: '全面评估你的情商', questions: 28, duration: 6 },
    { id: 'abm-love-animal', title: '爱情动物测试', desc: '探索你的爱情风格', questions: 20, duration: 4 },
    { id: 'gma-maturity', title: '情感成熟度', desc: '评估你的情感成熟度', questions: 28, duration: 6 },
    { id: 'cast-parenting', title: '养育风格测试', desc: '了解你的育儿方式', questions: 28, duration: 6 },
  ],
  mental: [
    { id: 'sas-standard', title: '焦虑自评量表', desc: '评估你的焦虑水平', questions: 28, duration: 5, badge: '专业' },
    { id: 'sds-standard', title: '抑郁自评量表', desc: '评估你的抑郁程度', questions: 20, duration: 4 },
    { id: 'pss-standard', title: '压力知觉量表', desc: '了解你的压力水平', questions: 20, duration: 4 },
    { id: 'burnout-mbi', title: '职业倦怠测试', desc: '评估职业倦怠程度', questions: 28, duration: 6 },
    { id: 'internet-addiction', title: '网络成瘾测试', desc: '评估网络使用情况', questions: 20, duration: 4 },
  ],
  career: [
    { id: 'holland-sds', title: '霍兰德职业兴趣', desc: '探索适合的职业方向', questions: 28, duration: 6, badge: '热门' },
    { id: 'kolb-standard', title: '学习风格测试', desc: '了解你的学习方式', questions: 28, duration: 6 },
    { id: 'mlq-standard', title: '领导力风格', desc: '评估你的领导能力', questions: 28, duration: 6 },
    { id: 'iq-ravens', title: '瑞文智力测验', desc: '测试你的逻辑推理能力', questions: 28, duration: 8 },
  ],
  values: [
    { id: 'ideology-9square', title: '政治坐标九维', desc: '了解你的政治倾向', questions: 28, duration: 6 },
    { id: 'schwartz-standard', title: '施瓦茨价值观', desc: '探索你的价值取向', questions: 28, duration: 6 },
    { id: 'mft-standard', title: '道德基础量表', desc: '了解你的道德观念', questions: 28, duration: 6 },
    { id: 'pcq-standard', title: '心理资本问卷', desc: '评估你的心理资本', questions: 28, duration: 6 },
  ],
  fun: [
    { id: 'fubao-index', title: '福报指数测试', desc: '测测你的福报值', questions: 28, duration: 5, badge: '趣味' },
    { id: 'color-subconscious', title: '颜色潜意识', desc: '色彩揭示你的内心', questions: 20, duration: 4 },
    { id: 'foodie-level', title: '吃货等级鉴定', desc: '看看你的吃货级别', questions: 20, duration: 4 },
    { id: 'onepiece-bounty', title: '海贼王悬赏金', desc: '你值多少赏金？', questions: 20, duration: 4 },
    { id: 'pua-resistance', title: 'PUA抵抗力', desc: '测试你的防坑能力', questions: 28, duration: 6 },
  ],
}

const HOT_ASSESSMENTS = [
  { id: 'sbti-personality', title: 'MBTI人格测试', desc: '最受欢迎的人格测评', color: 'from-violet-500 to-purple-500', icon: Brain },
  { id: 'ocean-bigfive', title: '大五人格', desc: '心理学界黄金标准', color: 'from-emerald-500 to-teal-500', icon: Heart },
  { id: 'ecr-attachment', title: '依恋类型', desc: '了解你的亲密关系模式', color: 'from-pink-500 to-rose-500', icon: Sparkles },
  { id: 'sas-standard', title: '焦虑自评', desc: '专业焦虑水平评估', color: 'from-amber-500 to-orange-500', icon: Flame },
]

export default function AssessmentsPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<CategoryType>('personality')

  const handleSelect = (id: string) => {
    navigate(`/legacy/mode-select/${id}`)
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        
        <div className="pt-2">
          <h1 className="text-xl font-bold mb-1">🧠 测评中心</h1>
          <p className="text-white/50 text-xs">发现适合你的心理测评</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
            <Flame size={14} className="text-orange-400" />
            热门推荐
          </h3>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {HOT_ASSESSMENTS.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                onClick={() => handleSelect(item.id)}
                className="flex-shrink-0 w-40 p-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 hover:border-violet-500/30 transition-all text-left"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-2`}>
                  <item.icon size={18} className="text-white" />
                </div>
                <h4 className="font-medium text-white text-sm mb-0.5">{item.title}</h4>
                <p className="text-[10px] text-white/40">{item.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${cat.color} text-white`
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            )
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            {ASSESSMENTS[activeCategory].map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => handleSelect(item.id)}
                className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-all text-left"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <h4 className="font-medium text-white text-xs">{item.title}</h4>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-violet-500/20 text-violet-300">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-white/40 mb-2 line-clamp-2">{item.desc}</p>
                <div className="flex items-center gap-2 text-[9px] text-white/30">
                  <span className="flex items-center gap-0.5">
                    <Clock size={10} />
                    {item.questions}题
                  </span>
                  <span>{item.duration}分钟</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
