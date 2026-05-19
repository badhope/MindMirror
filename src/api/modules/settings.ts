import api from '../base/client'
import type { ApiResponse } from '../types'

export interface UserSettings {
  id: string
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  language: string
  timezone: string
  privacyLevel: 'public' | 'private' | 'friends'
  autoSave: boolean
}

export interface UpdateSettingsRequest {
  theme?: 'light' | 'dark' | 'system'
  notifications?: boolean
  language?: string
  timezone?: string
  privacyLevel?: 'public' | 'private' | 'friends'
  autoSave?: boolean
}

export const settingsApi = {
  get: () => api.get<UserSettings>('/settings'),
  
  update: (data: UpdateSettingsRequest) => api.put<UserSettings>('/settings', data),
  
  reset: () => api.post<UserSettings>('/settings/reset'),
}

export default settingsApi
