export type Theme = 'dark' | 'light'

export interface SettingsState {
  theme: Theme
  language: string
  notifications: boolean
  isLoading: boolean
}

export interface SettingsActions {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setLanguage: (language: string) => void
  setNotifications: (enabled: boolean) => void
  setLoading: (loading: boolean) => void
}

export type SettingsStore = SettingsState & SettingsActions
