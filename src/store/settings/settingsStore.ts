import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SettingsStore, SettingsState } from './types'

const initialState: SettingsState = {
  theme: 'dark',
  language: 'zh-CN',
  notifications: true,
  isLoading: false,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme) => set({ theme }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      setLanguage: (language) => set({ language }),

      setNotifications: (enabled) => set({ notifications: enabled }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'mindmirror-settings',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        notifications: state.notifications,
      }),
    }
  )
)
