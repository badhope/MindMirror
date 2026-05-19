# MindMirror API 文档

> **最后更新**: 2026-05-19
> **版本**: v1.0.0
> **状态**: 开发中

---

## 目录

- [快速开始](#快速开始)
- [基础配置](#基础配置)
- [API模块](#api模块)
  - [用户API](#用户api)
  - [测评API](#测评api)
  - [成就API](#成就api)
  - [训练API](#训练api)
  - [心情API](#心情api)
  - [设置API](#设置api)
- [错误处理](#错误处理)
- [类型定义](#类型定义)

---

## 快速开始

### 安装

```typescript
// 已集成到项目中，无需额外安装
```

### 使用示例

```typescript
import { userApi, assessmentApi, ApiResponse } from '@api'

// 获取当前用户
const userResponse: ApiResponse = await userApi.getCurrent()
if (userResponse.success) {
  const user = userResponse.data
}

// 获取测评列表
const assessments = await assessmentApi.list()
```

---

## 基础配置

### ApiClient 类

`ApiClient` 是所有API调用的基础客户端。

#### 初始化

```typescript
import { api } from '@api'

// 使用默认配置
api.setAuthToken('your-auth-token')
```

#### 方法

| 方法 | 说明 | 参数 | 返回 |
|:-----|:-----|:-----|:-----|
| `get<T>(endpoint, config)` | GET请求 | endpoint: string<br>config?: RequestConfig | Promise<ApiResponse<T>> |
| `post<T>(endpoint, data, config)` | POST请求 | endpoint: string<br>data?: any<br>config?: RequestConfig | Promise<ApiResponse<T>> |
| `put<T>(endpoint, data, config)` | PUT请求 | endpoint: string<br>data?: any<br>config?: RequestConfig | Promise<ApiResponse<T>> |
| `patch<T>(endpoint, data, config)` | PATCH请求 | endpoint: string<br>data?: any<br>config?: RequestConfig | Promise<ApiResponse<T>> |
| `delete<T>(endpoint, config)` | DELETE请求 | endpoint: string<br>config?: RequestConfig | Promise<ApiResponse<T>> |
| `setAuthToken(token)` | 设置认证Token | token: string | void |
| `removeAuthToken()` | 移除认证Token | - | void |

---

## API模块

### 用户API

#### 类型定义

```typescript
interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

interface CreateUserRequest {
  username: string
  email: string
  password: string
}

interface UpdateUserRequest {
  username?: string
  email?: string
  avatar?: string
}
```

#### API方法

| 方法 | 说明 | 参数 | 返回 |
|:-----|:-----|:-----|:-----|
| `getCurrent()` | 获取当前用户信息 | - | Promise<ApiResponse<User>> |
| `getById(id)` | 根据ID获取用户 | id: string | Promise<ApiResponse<User>> |
| `create(data)` | 创建用户 | data: CreateUserRequest | Promise<ApiResponse<User>> |
| `update(id, data)` | 更新用户信息 | id: string<br>data: UpdateUserRequest | Promise<ApiResponse<User>> |
| `delete(id)` | 删除用户 | id: string | Promise<ApiResponse<void>> |

#### 使用示例

```typescript
import { userApi } from '@api'

// 获取当前用户
const currentUser = await userApi.getCurrent()

// 更新用户信息
await userApi.update('user-123', {
  username: 'newname',
  email: 'new@email.com'
})
```

---

### 测评API

#### 类型定义

```typescript
interface Assessment {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number
  createdAt: string
}

interface Answer {
  questionId: string
  selectedOption: string
  value: number
  trait?: string
}

interface Submission {
  id: string
  assessmentId: string
  answers: Answer[]
  result?: any
  submittedAt: string
}
```

#### API方法

| 方法 | 说明 | 参数 | 返回 |
|:-----|:-----|:-----|:-----|
| `list()` | 获取测评列表 | - | Promise<ApiResponse<PaginatedResponse<Assessment>>> |
| `getById(id)` | 获取单个测评 | id: string | Promise<ApiResponse<Assessment>> |
| `submit(id, answers)` | 提交测评答案 | id: string<br>answers: Answer[] | Promise<ApiResponse<Submission>> |
| `getResult(id)` | 获取测评结果 | id: string | Promise<ApiResponse<any>> |

#### 使用示例

```typescript
import { assessmentApi } from '@api'

// 获取测评列表
const assessments = await assessmentApi.list()

// 提交测评
const submission = await assessmentApi.submit('assessment-123', [
  {
    questionId: 'q1',
    selectedOption: 'option-a',
    value: 5
  }
])
```

---

### 成就API

#### 类型定义

```typescript
interface Achievement {
  id: string
  name: string
  description: string
  icon?: string
  unlocked: boolean
  unlockedAt?: string
}
```

#### API方法

| 方法 | 说明 | 参数 | 返回 |
|:-----|:-----|:-----|:-----|
| `list()` | 获取成就列表 | - | Promise<ApiResponse<PaginatedResponse<Achievement>>> |
| `unlock(id)` | 解锁成就 | id: string | Promise<ApiResponse<Achievement>> |

---

### 训练API

#### 类型定义

```typescript
interface TrainingRecord {
  id: string
  type: string
  duration: number
  completedAt: string
  notes?: string
}
```

#### API方法

| 方法 | 说明 | 参数 | 返回 |
|:-----|:-----|:-----|:-----|
| `list()` | 获取训练记录 | - | Promise<ApiResponse<PaginatedResponse<TrainingRecord>>> |
| `create(data)` | 添加训练记录 | data: Partial<TrainingRecord> | Promise<ApiResponse<TrainingRecord>> |
| `getStats()` | 获取训练统计 | - | Promise<ApiResponse<any>> |

---

### 心情API

#### 类型定义

```typescript
interface MoodRecord {
  id: string
  mood: string
  intensity: number
  recordedAt: string
  notes?: string
}
```

#### API方法

| 方法 | 说明 | 参数 | 返回 |
|:-----|:-----|:-----|:-----|
| `list()` | 获取心情记录 | - | Promise<ApiResponse<PaginatedResponse<MoodRecord>>> |
| `create(data)` | 添加心情记录 | data: Partial<MoodRecord> | Promise<ApiResponse<MoodRecord>> |
| `getHistory()` | 获取历史数据 | - | Promise<ApiResponse<any>> |

---

### 设置API

#### 类型定义

```typescript
interface UserSettings {
  id: string
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  language: string
  timezone: string
}
```

#### API方法

| 方法 | 说明 | 参数 | 返回 |
|:-----|:-----|:-----|:-----|
| `get()` | 获取用户设置 | - | Promise<ApiResponse<UserSettings>> |
| `update(data)` | 更新设置 | data: Partial<UserSettings> | Promise<ApiResponse<UserSettings>> |

---

## 错误处理

### 错误类型

```typescript
interface ApiError {
  code: number
  message: string
  details?: any
}
```

### 错误处理示例

```typescript
import { userApi } from '@api'

try {
  const response = await userApi.getCurrent()
  if (response.success) {
    // 处理成功响应
  } else {
    // 处理业务错误
  }
} catch (error: ApiError) {
  // 处理网络或服务端错误
  console.error(`Error ${error.code}: ${error.message}`)
  
  if (error.code === 401) {
    // 未授权，重定向到登录
  }
}
```

### 常见错误码

| 错误码 | 说明 | 处理建议 |
|:-------|:-----|:---------|
| 400 | 请求参数错误 | 检查请求参数 |
| 401 | 未授权 | 需要登录 |
| 403 | 权限不足 | 检查用户权限 |
| 404 | 资源不存在 | 检查资源ID |
| 429 | 请求过于频繁 | 添加重试延迟 |
| 500 | 服务器错误 | 稍后重试 |

---

## 类型定义

### 基础类型

```typescript
interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  code?: number
}

interface ApiError {
  code: number
  message: string
  details?: any
}

interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  withCredentials?: boolean
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

---

## 开发指南

### 添加新API模块

1. 在 `src/api/modules/` 创建新文件
2. 定义类型接口
3. 实现API方法
4. 在 `src/api/index.ts` 中导出

示例：
```typescript
// src/api/modules/newfeature.ts
import api from '../base/client'
import type { ApiResponse } from '../types'

export interface NewFeature {
  id: string
  // ...其他字段
}

export const newFeatureApi = {
  list: () => api.get<NewFeature[]>('/newfeature'),
  getById: (id: string) => api.get<NewFeature>(`/newfeature/${id}`),
}
```

### 最佳实践

1. **类型安全**: 始终使用TypeScript类型定义
2. **错误处理**: 统一在调用处处理错误
3. **Token管理**: 使用 `setAuthToken` 和 `removeAuthToken`
4. **重试机制**: 对可重试的错误添加重试逻辑
5. **请求缓存**: 对频繁查询的数据考虑缓存

---

## 更新日志

### v1.0.0 (2026-05-19)
- ✅ 基础ApiClient实现
- ✅ 用户API模块
- ✅ 测评API模块
- ✅ 类型系统建立
- 📝 完整API文档
