export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: number
  progress?: number
  target?: number
}

export interface AchievementState {
  achievements: Achievement[]
  isLoading: boolean
}

export interface AchievementActions {
  unlockAchievement: (id: string) => void
  updateAchievementProgress: (id: string, progress: number) => void
  setAchievements: (achievements: Achievement[]) => void
  setLoading: (loading: boolean) => void
}

export type AchievementStore = AchievementState & AchievementActions

export const defaultAchievements: Achievement[] = [
  { id: 'first-assessment', title: '初次测评', description: '完成你的第一个测评', icon: '🌟', progress: 0, target: 1 },
  { id: 'explorer', title: '探索者', description: '尝试5个不同的测评', icon: '🔍', progress: 0, target: 5 },
  { id: 'psychologist', title: '心理学爱好者', description: '完成10个心理测评', icon: '🧠', progress: 0, target: 10 },
  { id: 'knowledge-seeker', title: '知识追寻者', description: '完成所有认知能力测评', icon: '📚', progress: 0, target: 5 },
  { id: 'social-butterfly', title: '社交达人', description: '分享3次测评结果', icon: '🦋', progress: 0, target: 3 },
  { id: 'streak-7', title: '连续7天', description: '连续7天完成测评', icon: '🔥', progress: 0, target: 7 },
  { id: 'streak-30', title: '月度坚持', description: '连续30天完成测评', icon: '💎', progress: 0, target: 30 },
  { id: 'completionist', title: '完美主义', description: '完成50个测评', icon: '🏆', progress: 0, target: 50 },
  { id: 'night-owl', title: '夜猫子', description: '在凌晨完成测评', icon: '🦉' },
  { id: 'early-bird', title: '早起鸟', description: '在早晨6点前完成测评', icon: '🐦' },
]
