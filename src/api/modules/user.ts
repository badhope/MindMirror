import api from '../base/client'
import type { ApiResponse, PaginatedResponse } from '../types'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  avatar?: string
}

export const userApi = {
  getCurrent: () => api.get<User>('/user/me'),
  
  getById: (id: string) => api.get<User>(`/user/${id}`),
  
  create: (data: CreateUserRequest) => api.post<User>('/user', data),
  
  update: (id: string, data: UpdateUserRequest) => api.put<User>(`/user/${id}`, data),
  
  delete: (id: string) => api.delete(`/user/${id}`),
}

export default userApi
