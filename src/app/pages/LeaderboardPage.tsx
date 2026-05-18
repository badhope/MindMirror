import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Trophy, Crown, ArrowLeft, TrendingUp, TrendingDown, Clock, Award, Target, User } from 'lucide-react'
import { GlowCard } from '@components/animations'
import { Card } from '@components/ui/Card'
import { Button } from '@components/ui/Button'

export default function LeaderboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'ranking' | 'history'>('ranking')

  const leaderboard = Array.from({ length: 100 }, (_, i) => ({
    id: `player-${i}`,
    rank: i + 1,
    nickname: ['暗夜行者', '面具人', '局外人', '孤独者', '沉默者', '观察者', '思考者', '探索者', '漫游者', '迷失者'][i % 10] + (i > 9 ? `#${i + 1}` : ''),
    title: ['暗黑领主', '暗影使者', '深渊行者', '黑暗骑士', '暗夜精灵'][i % 5],
    totalScore: Math.floor(85 + Math.random() * 15),
    assessmentsCount: Math.floor(5 + Math.random() * 20),
    avatar: ['👤', '👻', '🧛', '🦇', '🌙'][i % 5],
    isYou: i === 15,
  }))

  const userRanking = {
    rank: 16,
    title: '暗夜探索者',
    defeatPercent: 78.5,
  }

  const historicalRecords = [
    { completedAt: new Date('2024-01-15'), darkTriadScore: 72, machiavellianism: 75, narcissism: 68, psychopathy: 73, change: 2.3 },
    { completedAt: new Date('2024-02-20'), darkTriadScore: 69, machiavellianism: 72, narcissism: 65, psychopathy: 70, change: -3 },
    { completedAt: new Date('2024-03-10'), darkTriadScore: 71, machiavellianism: 73, narcissism: 67, psychopathy: 72, change: 2.9 },
    { completedAt: new Date('2024-04-05'), darkTriadScore: 74, machiavellianism: 76, narcissism: 69, psychopathy: 75, change: 4.2 },
  ]

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3, 100)

  const medalColors = [
    'from-yellow-400 to-amber-500',
    'from-slate-300 to-slate-400',
    'from-amber-600 to-amber-700',
  ]

  const medalIcons = ['🥇', '🥈', '🥉']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={() => navigate('/app/community')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            className="inline-block"
          >
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            全球暗黑排行榜
          </h1>
          <p className="text-white/60 text-lg">
            谁是这个世界上最黑暗的灵魂？
          </p>
        </motion.div>

        {userRanking.rank && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card variant="elevated" className="overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600/30 via-fuchsia-600/30 to-pink-600/30 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-3xl shadow-lg">
                      👤
                    </div>
                    <div>
                      <div className="text-white font-bold text-xl">你的排名</div>
                      <div className="text-white/60">{userRanking.title}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">
                      #{userRanking.rank}
                    </div>
                    <div className="text-emerald-400 font-semibold">
                      击败了全国 {userRanking.defeatPercent}% 的用户
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'ranking' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('ranking')}
            size="md"
          >
            <Target className="w-4 h-4 mr-2" />
            实时排行榜
          </Button>
          <Button
            variant={activeTab === 'history' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('history')}
            size="md"
          >
            <Clock className="w-4 h-4 mr-2" />
            我的时光机
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'ranking' && (
            <motion.div
              key="ranking"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[1, 0, 2].map((position, index) => (
                  <motion.div
                    key={top3[position].id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`text-center ${position === 0 ? 'order-2 -mt-8' : position === 1 ? 'order-1' : 'order-3'}`}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${medalColors[position]} flex items-center justify-center text-4xl mb-3 shadow-2xl`}
                    >
                      {medalIcons[position]}
                    </motion.div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {top3[position].nickname}
                    </div>
                    <div className="text-white/60 text-sm mb-2">
                      {top3[position].title}
                    </div>
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                      {top3[position].totalScore}
                    </div>
                  </motion.div>
                ))}
              </div>

              <Card variant="bordered">
                <div className="p-2 space-y-1">
                  {rest.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.02 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                        player.isYou
                          ? 'bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 border border-violet-500/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                        player.isYou
                          ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white'
                          : 'bg-white/5 text-white/60'
                      }`}>
                        {player.rank}
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl">
                        {player.avatar}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${player.isYou ? 'text-violet-300' : 'text-white'}`}>
                          {player.nickname} {player.isYou && '(你)'}
                        </div>
                        <div className="text-white/40 text-sm">
                          完成 {player.assessmentsCount} 个测评
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-white">
                          {player.totalScore}
                        </div>
                        <div className="text-white/40 text-sm">
                          {player.title}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="bordered">
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Award className="w-6 h-6 text-amber-400" />
                        你的暗黑人格进化史
                      </h3>
                      <div className="text-white/60">
                        共 {historicalRecords.length} 次记录
                      </div>
                    </div>

                    {historicalRecords.map((record, index) => (
                      <motion.div
                        key={record.completedAt.getTime()}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                              <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-white">
                                {new Date(record.completedAt).toLocaleDateString('zh-CN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </div>
                              <div className="text-white/40 text-sm">
                                第 {index + 1} 次测评
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {index > 0 && (
                              <span className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold ${
                                record.change && record.change > 0
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {record.change && record.change > 0 ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                                {record.change && record.change > 0 ? '+' : ''}{record.change?.toFixed(1)}%
                              </span>
                            )}
                            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                              {record.darkTriadScore}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 rounded-lg bg-white/5">
                            <div className="text-white/60 text-sm mb-1">马基雅维利</div>
                            <div className="font-bold text-lg text-amber-400">
                              {record.machiavellianism}
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-white/5">
                            <div className="text-white/60 text-sm mb-1">自恋</div>
                            <div className="font-bold text-lg text-violet-400">
                              {record.narcissism}
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-white/5">
                            <div className="text-white/60 text-sm mb-1">精神病态</div>
                            <div className="font-bold text-lg text-rose-400">
                              {record.psychopathy}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-white/40 text-sm"
        >
          💡 排行榜数据基于全球模拟用户，仅供娱乐
        </motion.div>
      </div>
    </div>
  )
}
