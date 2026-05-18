import type { UserProfile } from '@/types'

export interface UserState {
  user: UserProfile | null
  isLoading: boolean
  error: string | null
}

export interface UserActions {
  setUser: (user: UserProfile) => void
  updateUser: (updates: Partial<UserProfile>) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export type UserStore = UserState & UserActions
