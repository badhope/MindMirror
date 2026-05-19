import api from '../base/client'
import type { PaginatedResponse } from '../types'

export interface TrainingRecord {
  id: string
  type: string
  duration: number
  completedAt: string
  notes?: string
  programId?: string
  progress?: number
}

export interface CreateTrainingRequest {
  type: string
  duration: number
  notes?: string
  programId?: string
}

export interface TrainingStats {
  totalSessions: number
  totalDuration: number
  currentStreak: number
  longestStreak: number
}

export const trainingApi = {
  list: () => api.get<PaginatedResponse<TrainingRecord>>('/training/records'),
  
  create: (data: CreateTrainingRequest) => api.post<TrainingRecord>('/training/records', data),
  
  update: (id: string, data: Partial<TrainingRecord>) => api.put<TrainingRecord>(`/training/records/${id}`, data),
  
  delete: (id: string) => api.delete(`/training/records/${id}`),
  
  getStats: () => api.get<TrainingStats>('/training/stats'),
  
  getPrograms: () => api.get<TrainingRecord[]>('/training/programs'),
}

export default trainingApi
