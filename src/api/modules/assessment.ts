import api from '../base/client'
import type { ApiResponse, PaginatedResponse } from '../types'

export interface Assessment {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number
  createdAt: string
}

export interface Answer {
  questionId: string
  selectedOption: string
  value: number
  trait?: string
}

export interface Submission {
  id: string
  assessmentId: string
  answers: Answer[]
  result?: any
  submittedAt: string
}

export const assessmentApi = {
  list: () => api.get<PaginatedResponse<Assessment>>('/assessments'),
  
  getById: (id: string) => api.get<Assessment>(`/assessment/${id}`),
  
  submit: (id: string, answers: Answer[]) => 
    api.post<Submission>(`/assessment/${id}/submit`, { answers }),
    
  getResult: (id: string) => api.get<any>(`/assessment/${id}/result`),
}

export default assessmentApi
