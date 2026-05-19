import api from '../base/client'
import type { PaginatedResponse } from '../types'

export interface Achievement {
  id: string
  name: string
  description: string
  icon?: string
  unlocked: boolean
  unlockedAt?: string
  category?: string
  points?: number
}

export const achievementApi = {
  list: () => api.get<PaginatedResponse<Achievement>>('/achievements'),
  
  getById: (id: string) => api.get<Achievement>(`/achievement/${id}`),
  
  unlock: (id: string) => api.post<Achievement>(`/achievement/${id}/unlock`),
  
  getUserAchievements: () => api.get<PaginatedResponse<Achievement>>('/user/achievements'),
}

export default achievementApi
