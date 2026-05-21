# 用户 API 接口规范

> **模块**: users
> **版本**: v1.0.0
> **基础路径**: `/api/v1/users`

---

## 1. 接口列表

| 方法 | 端点 | 说明 | 优先级 |
|:-----|:-----|:-----|:-------|
| GET | /users/me | 获取当前用户信息 | 高 |
| PUT | /users/me | 更新当前用户信息 | 高 |
| GET | /users/{id} | 根据ID获取用户 | 中 |
| POST | /users | 创建新用户 | 高 |
| DELETE | /users/{id} | 删除用户 | 中 |
| POST | /users/auth/register | 用户注册 | 高 |
| POST | /users/auth/login | 用户登录 | 高 |
| POST | /users/auth/logout | 用户登出 | 中 |
| POST | /users/auth/refresh | 刷新Token | 中 |

---

## 2. 认证接口

### 2.1 用户注册

**端点**: `POST /api/v1/users/auth/register`

**请求示例**:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 | 验证规则 |
|:-------|:-----|:-----|:-----|:---------|
| username | string | 是 | 用户名 | 3-20字符，字母数字下划线 |
| email | string | 是 | 邮箱 | 有效邮箱格式 |
| password | string | 是 | 密码 | 至少8位，包含字母和数字 |

**成功响应** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "usr_abc123def456",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": null,
    "createdAt": "2026-05-21T10:30:00Z",
    "updatedAt": "2026-05-21T10:30:00Z"
  },
  "message": "用户注册成功"
}
```

**错误响应** (400 Bad Request):

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "邮箱已被注册",
    "details": {
      "field": "email",
      "constraint": "unique"
    }
  }
}
```

### 2.2 用户登录

**端点**: `POST /api/v1/users/auth/login`

**请求示例**:

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|:-------|:-----|:-----|:-----|
| email | string | 是 | 邮箱 |
| password | string | 是 | 密码 |

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123def456",
      "username": "john_doe",
      "email": "john@example.com",
      "avatar": null,
      "createdAt": "2026-05-21T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  },
  "message": "登录成功"
}
```

**错误响应** (401 Unauthorized):

```json
{
  "success": false,
  "error": {
    "code": 401,
    "message": "邮箱或密码错误"
  }
}
```

### 2.3 Token 刷新

**端点**: `POST /api/v1/users/auth/refresh`

**请求头**:

```
Authorization: Bearer <refresh_token>
```

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  },
  "message": "Token刷新成功"
}
```

---

## 3. 用户管理接口

### 3.1 获取当前用户

**端点**: `GET /api/v1/users/me`

**请求头**:

```
Authorization: Bearer <access_token>
```

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "usr_abc123def456",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatars/john.jpg",
    "bio": "心理学爱好者",
    "settings": {
      "theme": "dark",
      "notifications": true,
      "language": "zh-CN"
    },
    "stats": {
      "totalAssessments": 15,
      "totalTime": 180,
      "favoriteCategory": "心理测评",
      "level": 3,
      "points": 450
    },
    "createdAt": "2026-05-21T10:30:00Z",
    "updatedAt": "2026-05-21T12:00:00Z"
  }
}
```

### 3.2 更新当前用户

**端点**: `PUT /api/v1/users/me`

**请求头**:

```
Authorization: Bearer <access_token>
```

**请求示例**:

```json
{
  "username": "john_updated",
  "avatar": "https://example.com/avatars/new.jpg",
  "bio": "探索自我，了解更多"
}
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 | 验证规则 |
|:-------|:-----|:-----|:-----|:---------|
| username | string | 否 | 用户名 | 3-20字符，唯一 |
| avatar | string | 否 | 头像URL | 有效URL |
| bio | string | 否 | 个人简介 | 最多500字符 |
| settings | object | 否 | 设置 | 见下方 |

**settings 对象**:

```json
{
  "theme": "dark",
  "notifications": true,
  "language": "zh-CN",
  "timezone": "Asia/Shanghai"
}
```

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "usr_abc123def456",
    "username": "john_updated",
    "email": "john@example.com",
    "avatar": "https://example.com/avatars/new.jpg",
    "bio": "探索自我，了解更多",
    "settings": {
      "theme": "dark",
      "notifications": true,
      "language": "zh-CN"
    },
    "updatedAt": "2026-05-21T12:00:00Z"
  },
  "message": "用户信息更新成功"
}
```

### 3.3 获取指定用户

**端点**: `GET /api/v1/users/{id}`

**路径参数**:

| 参数名 | 类型 | 说明 |
|:-------|:-----|:-----|
| id | string | 用户ID |

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "usr_abc123def456",
    "username": "john_doe",
    "avatar": "https://example.com/avatars/john.jpg",
    "bio": "心理学爱好者",
    "createdAt": "2026-05-21T10:30:00Z"
  }
}
```

**注意**: 返回的是公开信息，不包含邮箱等敏感数据。

### 3.4 删除用户

**端点**: `DELETE /api/v1/users/{id}`

**请求头**:

```
Authorization: Bearer <access_token>
```

**权限要求**: 仅管理员或用户本人可删除

**成功响应** (200 OK):

```json
{
  "success": true,
  "message": "用户删除成功"
}
```

**错误响应** (403 Forbidden):

```json
{
  "success": false,
  "error": {
    "code": 403,
    "message": "无权删除此用户"
  }
}
```

---

## 4. 数据类型定义

### 4.1 User 类型

```typescript
interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  settings: UserSettings
  stats?: UserStats
  createdAt: string
  updatedAt: string
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  language: string
  timezone?: string
}

interface UserStats {
  totalAssessments: number
  totalTime: number
  favoriteCategory: string
  level: number
  points: number
}
```

### 4.2 Auth 类型

```typescript
interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  username: string
  email: string
  password: string
}
```

---

## 5. 错误码说明

| 错误码 | 说明 | HTTP状态码 | 处理建议 |
|:-------|:-----|:-----------|:---------|
| 1001 | 参数验证失败 | 400 | 检查请求参数格式 |
| 1002 | 邮箱格式错误 | 400 | 使用有效邮箱地址 |
| 1003 | 密码强度不足 | 400 | 密码需包含字母和数字 |
| 2001 | 用户不存在 | 404 | 检查用户ID |
| 2002 | 邮箱已被注册 | 400 | 使用其他邮箱 |
| 2003 | 用户名已被占用 | 400 | 使用其他用户名 |
| 3001 | 认证失败 | 401 | 检查登录凭证 |
| 3002 | Token已过期 | 401 | 刷新Token |
| 3003 | 无权访问资源 | 403 | 检查权限 |
| 5001 | 服务器内部错误 | 500 | 联系技术支持 |

---

## 6. 使用示例

### 6.1 注册并登录流程

```typescript
import api from '@/api/base/client'

async function registerAndLogin() {
  // 1. 注册
  const registerResponse = await api.post('/users/auth/register', {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'SecurePassword123!'
  })
  
  if (registerResponse.success) {
    // 2. 登录获取Token
    const loginResponse = await api.post('/users/auth/login', {
      email: 'john@example.com',
      password: 'SecurePassword123!'
    })
    
    if (loginResponse.success) {
      // 3. 保存Token
      const { accessToken } = loginResponse.data
      api.setAuthToken(accessToken)
      
      return loginResponse.data.user
    }
  }
}
```

### 6.2 获取并更新用户信息

```typescript
async function updateUserProfile() {
  // 1. 获取当前用户
  const userResponse = await api.get('/users/me')
  
  if (userResponse.success) {
    const currentUser = userResponse.data
    
    // 2. 更新用户信息
    const updateResponse = await api.put('/users/me', {
      username: 'john_updated',
      bio: '探索自我，了解更多'
    })
    
    return updateResponse.data
  }
}
```

---

## 7. 安全注意事项

1. **密码安全**: 密码在前端不传输明文，后端使用bcrypt加密
2. **Token管理**: Access Token有效期7天，Refresh Token有效期30天
3. **敏感信息**: 邮箱等敏感信息仅在用户详情接口返回本人
4. **权限控制**: 所有修改操作需验证Token

---

**文档版本**: v1.0.0
**最后更新**: 2026-05-21
