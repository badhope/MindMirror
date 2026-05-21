import api from './base/client'
import { localCache } from '../../utils/cache/local-cache'
import type { ApiResponse } from './types'
import type { Assessment, AssessmentConfig } from '@/data/assessments/types'

class AssessmentService {
  async getAssessmentList(): Promise<ApiResponse<AssessmentConfig[]>> {
    const response = await api.get<AssessmentConfig[]>('/assessments/')
    return response
  }

  async getAssessment(id: string): Promise<ApiResponse<Assessment>> {
    const response = await api.get<Assessment>(`/assessments/${id}`)
    return response
  }

  async submitAssessment(
    assessmentId: string,
    answers: Array<{ questionId: string; selectedOption: string; value: number; trait?: string }>,
    mode: string = 'normal'
  ): Promise<ApiResponse<any>> {
    const response = await api.post<any>(`/assessments/${assessmentId}/submit`, {
      assessmentId,
      answers,
      mode,
    })
    return response
  }

  async getHistory(userId: string = 'demo-user'): Promise<ApiResponse<any[]>> {
    const response = await api.get<any[]>(`/assessments/history`, {
      params: { user_id: userId },
    })
    return response
  }

  async cacheAssessment(id: string, data: Assessment): Promise<void> {
    await localCache.set('assessments', id, data, 30 * 60 * 1000)
  }

  async getCachedAssessment(id: string): Promise<Assessment | null> {
    return await localCache.get('assessments', id)
  }
}

export const assessmentService = new AssessmentService()
