export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  code?: number
}

export interface ApiError {
  code: number
  message: string
  details?: any
}

export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  withCredentials?: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
