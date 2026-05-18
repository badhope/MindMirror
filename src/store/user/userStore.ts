import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserStore, UserState } from './types'
import type { UserProfile } from '@/types'

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user: UserProfile) => set({ user, error: null }),

      updateUser: (updates: Partial<UserProfile>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearUser: () => set({ user: null, error: null }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'mindmirror-user',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
