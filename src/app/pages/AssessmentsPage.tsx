import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Brain, Heart, Leaf, Briefcase, Target, Smile, Flame, Sparkles, Clock, Search, X } from 'lucide-react'
import { ANIMATION } from '../utils/animation-config'

type CategoryType = 'personality' | 'relationship' | 'mental' | 'career' | 'values' | 'fun'

const CATEGORIES: { id: CategoryType; label: string; icon: typeof Brain; color: string }[] = [
  { id: 'personality', label: '人格性格', icon: Brain, color: 'from-violet-500 to-purple-500' },
  { id: 'relationship', label: '情感关系', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'mental', label: '心理健康', icon: Leaf, color: 'from-emerald-500 to-teal-500' },
  { id: 'career', label: '职业发展', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
  { id: 'values', label: '价值观', icon: Target, color: 'from-amber-500 to-orange-500' },
  { id: 'fun', label: '趣味测试', icon: Smile, color: 'from-slate-500 to-slate-600' },
]

const ASSESSMENTS: Record<CategoryType, { id: string; title: string; desc: string; questions: number; duration: number; badge?: string }[]> = {
  personality: [
    { id: 'sbti-personality', title: 'MBTI 16型人格', desc: '探索你的人格类型', questions: 24, duration: 5, badge: '热门' },
    { id: 'ocean-bigfive', title: '大五人格测试', desc: '科学的人格特质模型', questions: 28, duration: 6 },
    { id: 'dark-triad', title: '黑暗三人格', desc: '了解你的阴暗面', questions: 28, duration: 6 },
    { id: 'hardiness-standard', title: '心理韧性', desc: '评估你的抗压能力', questions: 28, duration: 6 },
    { id: 'mental-age', title: '心理年龄测试', desc: '测测你的心理年龄', questions: 20, duration: 4 },
    { id: 'mindset-standard', title: '成长型思维', desc: '了解你的思维模式', questions: 28, duration: 6 },
  ],
  relationship: [
    { id: 'ecr-attachment', title: '成人依恋类型', desc: '了解你的亲密关系模式', questions: 28, duration: 6, badge: '推荐' },
    { id: 'eq-goleman', title: '戈尔曼情商', desc: '全面评估你的情商', questions: 28, duration: 6 },
    { id: 'abm-love-animal', title: '爱情动物测试', desc: '探索你的爱情风格', questions: 20, duration: 4 },
    { id: 'gma-maturity', title: '情感成熟度', desc: '评估你的情感成熟度', questions: 28, duration: 6 },
    { id: 'cast-parenting', title: '养育风格测试', desc: '了解你的育儿方式', questions: 28, duration: 6 },
  ],
  mental: [
    { id: 'sas-standard', title: '焦虑自评量表', desc: '专业评估焦虑水平', questions: 28, duration: 5, badge: '专业' },
    { id: 'sds-standard', title: '抑郁自评量表', desc: '评估你的抑郁程度', questions: 20, duration: 4 },
    { id: 'pss-standard', title: '压力知觉量表', desc: '了解你的压力水平', questions: 20, duration: 4 },
    { id: 'burnout-mbi', title: '职业倦怠测试', desc: '评估职业倦怠程度', questions: 28, duration: 6 },
    { id: 'internet-addiction', title: '网络成瘾测试', desc: '评估网络使用情况', questions: 20, duration: 4 },
  ],
  career: [
    { id: 'holland-sds', title: '霍兰德职业兴趣', desc: '探索适合的职业方向', questions: 28, duration: 6, badge: '热门' },
    { id: 'kolb-standard', title: '学习风格测试', desc: '了解你的学习方式', questions: 28, duration: 6 },
    { id: 'mlq-standard', title: '领导力风格', desc: '评估你的领导能力', questions: 28, duration: 6 },
    { id: 'iq-ravens', title: '瑞文智力测验', desc: '测试你的逻辑推理', questions: 28, duration: 8 },
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
  { id: 'ecr-attachment', title: '依恋类型', desc: '了解你的亲密关系', color: 'from-pink-500 to-rose-500', icon: Sparkles },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: ANIMATION.STAGGER_DELAY, delayChildren: 0.05 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: ANIMATION.SLIDE_DURATION, ease: 'easeOut' } }
}

export default function AssessmentsPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<CategoryType>('personality')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAssessments = ASSESSMENTS[activeCategory].filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (id: string) => {
    navigate(`/legacy/mode-select/${id}`)
  }

  return (
    <motion.div 
      className="px-4 py-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
          测评中心
        </h1>
        <p className="text-white/50 text-sm">发现适合你的心理测评</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
          <Search size={18} className="text-white/40" />
          <input
            type="text"
            placeholder="搜索测评..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white text-sm placeholder-white/40 outline-none"
          />
          {searchQuery && (
            <motion.button
              onClick={() => setSearchQuery('')}
              whileTap={{ scale: 0.9 }}
              className="p-1"
            >
              <X size={16} className="text-white/40" />
            </motion.button>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <Flame size={16} className="text-orange-400" />
          <h3 className="font-semibold text-white">热门推荐</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOT_ASSESSMENTS.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-5 border border-white/5 hover:border-violet-500/30 transition-all h-full text-left">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon size={22} className="text-white" />
                </div>
                <h4 className="font-semibold text-white text-base mb-1">{item.title}</h4>
                <p className="text-xs text-white/50">{item.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="font-semibold text-white mb-4">分类浏览</h3>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? `bg-gradient-to-r ${cat.color} text-white shadow-lg` : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
                whileTap={{ scale: 0.96 }}
              >
                <Icon size={16} />
                {cat.label}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: ANIMATION.FADE_DURATION }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredAssessments.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/25 transition-all h-full text-left">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/20 text-violet-300 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/50 mb-4 line-clamp-2">{item.desc}</p>
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {item.questions}题
                  </span>
                  <span>{item.duration}分钟</span>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
      
      <div className="h-4" />
    </motion.div>
  )
}
