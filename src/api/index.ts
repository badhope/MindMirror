export { api, default } from './base/client'

export { userApi } from './modules/user'
export { assessmentApi } from './modules/assessment'

export type { ApiResponse, ApiError, RequestConfig, PaginatedResponse } from './types'
export type { User, CreateUserRequest, UpdateUserRequest } from './modules/user'
export type { Assessment, Answer, Submission } from './modules/assessment'
