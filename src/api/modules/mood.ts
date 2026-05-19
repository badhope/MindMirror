import api from '../base/client'
import type { PaginatedResponse } from '../types'

export interface MoodRecord {
  id: string
  mood: string
  intensity: number
  recordedAt: string
  notes?: string
  tags?: string[]
}

export interface CreateMoodRequest {
  mood: string
  intensity: number
  notes?: string
  tags?: string[]
}

export interface MoodStats {
  averageIntensity: number
  totalRecords: number
  dominantMood?: string
}

export const moodApi = {
  list: () => api.get<PaginatedResponse<MoodRecord>>('/mood/records'),
  
  create: (data: CreateMoodRequest) => api.post<MoodRecord>('/mood/records', data),
  
  update: (id: string, data: Partial<MoodRecord>) => api.put<MoodRecord>(`/mood/records/${id}`, data),
  
  delete: (id: string) => api.delete(`/mood/records/${id}`),
  
  getHistory: (days: number = 30) => api.get<MoodRecord[]>(`/mood/history?days=${days}`),
  
  getStats: () => api.get<MoodStats>('/mood/stats'),
}

export default moodApi
