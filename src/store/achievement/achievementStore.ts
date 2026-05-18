import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AchievementStore, AchievementState } from './types'
import { defaultAchievements } from './types'

const initialState: AchievementState = {
  achievements: [...defaultAchievements],
  isLoading: false,
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set) => ({
      ...initialState,

      unlockAchievement: (id: string) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, unlockedAt: Date.now(), progress: a.target || 1 } : a
          ),
        })),

      updateAchievementProgress: (id: string, progress: number) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, progress } : a
          ),
        })),

      setAchievements: (achievements) => set({ achievements }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'mindmirror-achievement',
      partialize: (state) => ({ achievements: state.achievements }),
    }
  )
)
