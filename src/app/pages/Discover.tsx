import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { CategoryCard } from '../../components/DiscoverCard'
import { TabSlider } from '../../components/TabSlider'
import { discoverCategories } from '../../data/discoverData'
import { ANIMATION } from '../utils/animation-config'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION.STAGGER_DELAY,
      delayChildren: ANIMATION.INITIAL_DELAY
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION.FADE_DURATION, ease: 'easeOut' }
  }
}

export default function Discover() {
  const [activeCategory, setActiveCategory] = useState<string>(discoverCategories[0].id)

  const tabs = discoverCategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    color: cat.color
  }))

  const activeCategoryData = discoverCategories.find(cat => cat.id === activeCategory)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 sm:px-4 pb-6 pt-4"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🔮 探索
        </h1>
        <p className="text-sm text-white/40">发现适合你的心理测评</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <TabSlider 
          tabs={tabs}
          activeTab={activeCategory}
          onTabChange={setActiveCategory}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <AnimatePresence mode="wait">
          {activeCategoryData && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: ANIMATION.FADE_DURATION, ease: 'easeOut' }}
            >
              <CategoryCard
                name={activeCategoryData.name}
                icon={activeCategoryData.icon}
                color={activeCategoryData.color}
                bgGradient={activeCategoryData.bgGradient}
                borderColor={activeCategoryData.borderColor}
                subcategories={activeCategoryData.subcategories}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-pink-500/10 border border-violet-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-2xl">🎯</span>
          </div>
          <div className="min-w-0">
            <div className="text-lg font-semibold">探索更多</div>
            <div className="text-sm text-white/40">持续更新中</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 text-xs rounded-full bg-white/8 text-white/60">📊 专业测评</span>
          <span className="px-3 py-1.5 text-xs rounded-full bg-white/8 text-white/60">📚 精选文章</span>
          <span className="px-3 py-1.5 text-xs rounded-full bg-white/8 text-white/60">👥 社区互动</span>
          <span className="px-3 py-1.5 text-xs rounded-full bg-white/8 text-white/60">🌱 个人成长</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
