import type { ApiResponse, ApiError, RequestConfig } from '../types'
import { localCache } from '../../utils/cache/local-cache'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private isApiAvailable: boolean = true
  private apiCheckInProgress: boolean = false

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
    this.checkApiAvailability()
  }

  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  removeAuthToken() {
    delete this.defaultHeaders['Authorization']
  }

  private async checkApiAvailability(): Promise<void> {
    if (this.apiCheckInProgress) return
    this.apiCheckInProgress = true

    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      })
      this.isApiAvailable = response.ok
    } catch {
      this.isApiAvailable = false
    } finally {
      this.apiCheckInProgress = false
    }
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    if (!this.isApiAvailable) {
      return this.getFallbackData<T>(method, endpoint, data)
    }

    const url = `${this.baseUrl}${endpoint}`
    const headers = { ...this.defaultHeaders, ...config?.headers }

    const options: RequestInit = {
      method,
      headers,
    }

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw { code: response.status, message: response.statusText }
      }

      const result = await response.json()
      
      if (method === 'GET') {
        this.cacheData(endpoint, result)
      }

      return result
    } catch (error) {
      this.isApiAvailable = false
      
      const fallbackResult = await this.getFallbackData<T>(method, endpoint, data)
      return fallbackResult
    }
  }

  private async cacheData(endpoint: string, data: any): Promise<void> {
    try {
      const cacheKey = endpoint.replace(/\//g, '_')
      const storeName = this.getStoreName(endpoint)
      if (storeName) {
        await localCache.set(storeName, cacheKey, data, CACHE_TTL)
      }
    } catch {
    }
  }

  private async getFallbackData<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    if (method === 'GET') {
      const storeName = this.getStoreName(endpoint)
      if (storeName) {
        const cacheKey = endpoint.replace(/\//g, '_')
        const cached = await localCache.get(storeName, cacheKey)
        if (cached) {
          return { success: true, data: cached } as ApiResponse<T>
        }
      }
    }

    return {
      success: false,
      error: {
        code: 503,
        message: '服务暂时不可用，已使用离线数据',
      },
    } as ApiResponse<T>
  }

  private getStoreName(endpoint: string): string | null {
    if (endpoint.includes('assessments')) return 'assessments'
    if (endpoint.includes('results')) return 'results'
    if (endpoint.includes('achievements')) return 'achievements'
    if (endpoint.includes('moods')) return 'moods'
    return null
  }

  async get<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>('GET', endpoint, undefined, config)
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig) {
    return this.request<T>('POST', endpoint, data, config)
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig) {
    return this.request<T>('PUT', endpoint, data, config)
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig) {
    return this.request<T>('PATCH', endpoint, data, config)
  }

  async delete<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>('DELETE', endpoint, undefined, config)
  }

  async checkStatus(): Promise<boolean> {
    await this.checkApiAvailability()
    return this.isApiAvailable
  }
}

export const api = new ApiClient()

export default api
