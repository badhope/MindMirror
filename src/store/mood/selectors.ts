import type { MoodState } from './types'

export const selectMoodHistory = (state: MoodState) => state.moodHistory
export const selectIsMoodLoading = (state: MoodState) => state.isLoading
export const selectMoodCount = (state: MoodState) => state.moodHistory.length
export const selectTodayMood = (state: MoodState) => {
  const today = new Date().toISOString().split('T')[0]
  return state.moodHistory.find((m) => m.date === today)
}
export const selectMoodTrend = (days: number) => (state: MoodState) =>
  state.moodHistory.slice(0, days).reverse()
export const selectAverageMood = (state: MoodState) => {
  if (state.moodHistory.length === 0) return 0
  const sum = state.moodHistory.reduce((acc, m) => acc + m.mood, 0)
  return sum / state.moodHistory.length
}
