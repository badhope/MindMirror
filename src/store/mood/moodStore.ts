import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MoodStore, MoodState, MoodRecord } from './types'

const initialState: MoodState = {
  moodHistory: [],
  isLoading: false,
}

export const useMoodStore = create<MoodStore>()(
  persist(
    (set) => ({
      ...initialState,

      recordMood: (mood: number, note?: string) =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0]
          const timestamp = Date.now()
          const newRecord: MoodRecord = { date: today, mood, timestamp, note }

          const existingIndex = state.moodHistory.findIndex((m) => m.date === today)
          if (existingIndex >= 0) {
            const newHistory = [...state.moodHistory]
            newHistory[existingIndex] = newRecord
            return { moodHistory: newHistory }
          }

          return { moodHistory: [newRecord, ...state.moodHistory] }
        }),

      deleteMoodRecord: (date: string) =>
        set((state) => ({
          moodHistory: state.moodHistory.filter((m) => m.date !== date),
        })),

      clearMoodHistory: () => set({ moodHistory: [] }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'mindmirror-mood',
      partialize: (state) => ({ moodHistory: state.moodHistory }),
    }
  )
)
