import type { AchievementState } from './types'

export const selectAchievements = (state: AchievementState) => state.achievements
export const selectUnlockedAchievements = (state: AchievementState) =>
  state.achievements.filter((a) => a.unlockedAt)
export const selectLockedAchievements = (state: AchievementState) =>
  state.achievements.filter((a) => !a.unlockedAt)
export const selectAchievementById = (id: string) => (state: AchievementState) =>
  state.achievements.find((a) => a.id === id)
export const selectAchievementCount = (state: AchievementState) => state.achievements.length
export const selectUnlockedCount = (state: AchievementState) =>
  state.achievements.filter((a) => a.unlockedAt).length
export const selectAchievementProgress = (id: string) => (state: AchievementState) => {
  const achievement = state.achievements.find((a) => a.id === id)
  if (!achievement) return 0
  if (!achievement.target) return achievement.unlockedAt ? 100 : 0
  return Math.min(100, ((achievement.progress || 0) / achievement.target) * 100)
}
