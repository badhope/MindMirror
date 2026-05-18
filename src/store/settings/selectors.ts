import type { SettingsState } from './types'

export const selectTheme = (state: SettingsState) => state.theme
export const selectIsDarkTheme = (state: SettingsState) => state.theme === 'dark'
export const selectLanguage = (state: SettingsState) => state.language
export const selectNotifications = (state: SettingsState) => state.notifications
export const selectIsSettingsLoading = (state: SettingsState) => state.isLoading
