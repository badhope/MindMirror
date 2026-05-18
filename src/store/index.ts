// ============ 新模块化导出 ============
export * from './user'
export * from './assessment'
export * from './achievement'
export * from './training'
export * from './mood'
export * from './settings'

// ============ 类型导出 ============
export type { UserState, UserActions, UserStore } from './user/types'
export type { AssessmentState, AssessmentActions, AssessmentStore, AssessmentRecord } from './assessment/types'
export type { AchievementState, AchievementActions, AchievementStore, Achievement } from './achievement/types'
export type { TrainingState, TrainingActions, TrainingStore } from './training/types'
export type { MoodState, MoodActions, MoodStore } from './mood/types'
export type { SettingsState, SettingsActions, SettingsStore } from './settings/types'

// ============ 兼容层（向后兼容） ============
import { useUserStore } from './user/userStore'
import { useAssessmentStore } from './assessment/assessmentStore'
import { useAchievementStore } from './achievement/achievementStore'
import { useTrainingStore } from './training/trainingStore'
import { useMoodStore } from './mood/moodStore'
import { useSettingsStore } from './settings/settingsStore'
import type { UserProfile, CompletedAssessment, Answer } from '@/types'

// 组合所有 store 状态
export const useAppStore = {
  // User Profile
  getUser: () => useUserStore.getState().user,
  setUser: (user: UserProfile) => useUserStore.getState().setUser(user),

  // Assessment
  getCurrentAssessment: () => useAssessmentStore.getState().currentAssessmentId,
  setCurrentAssessment: (id: string) => useAssessmentStore.getState().setCurrentAssessment(id),
  getCompletedAssessments: () => useAssessmentStore.getState().completedAssessments,
  getRecords: () => useAssessmentStore.getState().records,

  // Achievements
  getAchievements: () => useAchievementStore.getState().achievements,
  unlockAchievement: (id: string) => useAchievementStore.getState().unlockAchievement(id),

  // Training
  getTrainingRecords: () => useTrainingStore.getState().trainingRecords,
  addTrainingRecord: (record: any) => useTrainingStore.getState().addTrainingRecord(record),

  // Mood
  getMoodHistory: () => useMoodStore.getState().moodHistory,
  recordMood: (mood: number, note?: string) => useMoodStore.getState().recordMood(mood, note),

  // Settings
  getTheme: () => useSettingsStore.getState().theme,
  setTheme: (theme: 'dark' | 'light') => useSettingsStore.getState().setTheme(theme),
  toggleTheme: () => useSettingsStore.getState().toggleTheme(),
}

// 兼容旧的 useStore
export const useStore = {
  getState: () => {
    const userState = useUserStore.getState()
    const assessmentState = useAssessmentStore.getState()
    const settingsState = useSettingsStore.getState()

    return {
      user: userState.user,
      setUser: userState.setUser,
      updateUserName: (name: string) => {
        const user = useUserStore.getState().user
        if (user) {
          useUserStore.getState().updateUser({ ...user, name })
        }
      },
      currentAssessmentId: assessmentState.currentAssessmentId,
      currentAnswers: assessmentState.currentAnswers,
      setCurrentAssessment: assessmentState.setCurrentAssessment,
      addAnswer: assessmentState.addAnswer,
      updateAnswer: assessmentState.updateAnswer,
      clearCurrentAssessment: assessmentState.clearCurrentAssessment,
      completedAssessments: assessmentState.completedAssessments,
      addCompletedAssessment: assessmentState.addCompletedAssessment,
      deleteAssessment: assessmentState.deleteAssessment,
      isLoading: userState.isLoading || assessmentState.isLoading,
      setIsLoading: (loading: boolean) => {
        userState.setLoading(loading)
        assessmentState.setLoading(loading)
      },
      theme: settingsState.theme,
      toggleTheme: settingsState.toggleTheme,
    }
  },
  subscribe: (listener: (state: any) => void) => useUserStore.subscribe(listener),
}

// 兼容旧的 useUserStore
export const useUserStoreCompat = {
  getState: () => {
    const userState = useUserStore.getState()
    const assessmentState = useAssessmentStore.getState()
    const achievementState = useAchievementStore.getState()

    return {
      profile: userState.user,
      records: assessmentState.records,
      achievements: achievementState.achievements,
      setProfile: userState.setUser,
      updateProfile: userState.updateUser,
      addRecord: assessmentState.addRecord,
      getRecords: () => assessmentState.records,
      getRecordById: (id: string) => assessmentState.records.find(r => r.assessmentId === id),
      unlockAchievement: achievementState.unlockAchievement,
      updateAchievementProgress: achievementState.updateAchievementProgress,
      getAchievements: () => achievementState.achievements,
    }
  },
  subscribe: (listener: (state: any) => void) => useUserStore.subscribe(listener),
}

export const createDefaultProfile = (): UserProfile => ({
  id: crypto.randomUUID(),
  name: '新用户',
  avatar: '',
  bio: '这个人很懒，什么都没写',
  createdAt: Date.now(),
  assessments: [],
})

export default useAppStore
