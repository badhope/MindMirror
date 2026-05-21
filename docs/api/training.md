# 训练 API 接口规范

> **模块**: training
> **版本**: v1.0.0
> **基础路径**: `/api/v1/training`

---

## 1. 接口列表

| 方法 | 端点 | 说明 | 优先级 |
|:-----|:-----|:-----|:-------|
| GET | /training | 获取训练记录列表 | 中 |
| POST | /training | 添加训练记录 | 中 |
| GET | /training/{id} | 获取训练详情 | 低 |
| DELETE | /training/{id} | 删除训练记录 | 低 |
| GET | /training/stats | 获取训练统计 | 中 |
| GET | /training/programs | 获取训练计划列表 | 中 |
| GET | /training/programs/{id} | 获取训练计划详情 | 中 |
| POST | /training/programs/{id}/start | 开始训练 | 中 |
| POST | /training/{id}/complete | 完成训练 | 中 |

---

## 2. 训练记录接口

### 2.1 获取训练记录列表

**端点**: `GET /api/v1/training`

**请求头**:

```
Authorization: Bearer <access_token>
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|:-------|:-----|:-----|:-----|:-------|
| page | integer | 否 | 页码 | 1 |
| pageSize | integer | 否 | 每页数量 | 20 |
| category | string | 否 | 分类筛选 | - |
| startDate | string | 否 | 开始日期 | - |
| endDate | string | 否 | 结束日期 | - |

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "trn_abc123",
        "programId": "mindfulness-basic",
        "programName": "正念冥想基础",
        "category": "meditation",
        "duration": 600,
        "completedDuration": 600,
        "status": "completed",
        "startedAt": "2026-05-21T10:00:00Z",
        "completedAt": "2026-05-21T10:10:00Z",
        "notes": "感觉放松了很多",
        "mood": {
          "before": 3,
          "after": 5
        }
      },
      {
        "id": "trn_abc124",
        "programId": "breathing-advanced",
        "programName": "呼吸训练进阶",
        "category": "breathing",
        "duration": 300,
        "completedDuration": 180,
        "status": "partial",
        "startedAt": "2026-05-20T15:00:00Z",
        "completedAt": null,
        "notes": "中断了，下次继续"
      }
    ],
    "total": 45,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}
```

---

## 3. 添加训练记录

### 3.1 创建训练记录

**端点**: `POST /api/v1/training`

**请求头**:

```
Authorization: Bearer <access_token>
```

**请求示例**:

```json
{
  "programId": "meditation-beginner",
  "category": "meditation",
  "duration": 600,
  "completedDuration": 600,
  "status": "completed",
  "startedAt": "2026-05-21T10:00:00Z",
  "completedAt": "2026-05-21T10:10:00Z",
  "notes": "完成了第一次正念冥想",
  "mood": {
    "before": 3,
    "after": 5
  }
}
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|:-------|:-----|:-----|:-----|
| programId | string | 是 | 训练计划ID |
| category | string | 是 | 训练类别 |
| duration | integer | 是 | 计划时长(秒) |
| completedDuration | integer | 是 | 完成时长(秒) |
| status | string | 是 | 完成状态 |
| startedAt | string | 否 | 开始时间 |
| completedAt | string | 否 | 完成时间 |
| notes | string | 否 | 训练笔记 |
| mood | object | 否 | 心情记录 |

**status 选项**:

| 值 | 说明 |
|:---|:-----|
| completed | 完全完成 |
| partial | 部分完成 |
| abandoned | 中途放弃 |

**成功响应** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "trn_abc125",
    "programId": "meditation-beginner",
    "programName": "正念冥想入门",
    "category": "meditation",
    "duration": 600,
    "completedDuration": 600,
    "status": "completed",
    "startedAt": "2026-05-21T10:00:00Z",
    "completedAt": "2026-05-21T10:10:00Z",
    "notes": "完成了第一次正念冥想",
    "pointsEarned": 10
  },
  "message": "训练记录添加成功，获得10积分"
}
```

---

## 4. 训练统计接口

### 4.1 获取训练统计

**端点**: `GET /api/v1/training/stats`

**请求头**:

```
Authorization: Bearer <access_token>
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|:-------|:-----|:-----|:-----|:-------|
| period | string | 否 | 统计周期 | week |

**period 选项**:

| 值 | 说明 |
|:---|:-----|
| week | 本周 |
| month | 本月 |
| year | 本年 |
| all | 全部 |

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalSessions": 45,
      "totalDuration": 27000,
      "totalDurationFormatted": "7小时30分钟",
      "completedSessions": 40,
      "partialSessions": 5,
      "averageDuration": 600,
      "completionRate": 88.9
    },
    "byCategory": [
      {
        "category": "meditation",
        "name": "正念冥想",
        "sessions": 25,
        "duration": 15000,
        "completionRate": 92
      },
      {
        "category": "breathing",
        "name": "呼吸训练",
        "sessions": 12,
        "duration": 7200,
        "completionRate": 83
      },
      {
        "category": "relaxation",
        "name": "放松训练",
        "sessions": 8,
        "duration": 4800,
        "completionRate": 87.5
      }
    ],
    "weeklyData": [
      {
        "date": "2026-05-21",
        "sessions": 2,
        "duration": 1200
      },
      {
        "date": "2026-05-20",
        "sessions": 3,
        "duration": 1800
      }
    ],
    "streaks": {
      "current": 7,
      "longest": 14,
      "lastTrainingDate": "2026-05-21"
    }
  }
}
```

---

## 5. 训练计划接口

### 5.1 获取训练计划列表

**端点**: `GET /api/v1/training/programs`

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|:-------|:-----|:-----|:-----|:-------|
| category | string | 否 | 分类筛选 | - |
| difficulty | string | 否 | 难度筛选 | - |
| page | integer | 否 | 页码 | 1 |

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "meditation-beginner",
        "name": "正念冥想入门",
        "description": "适合初学者的基础冥想训练",
        "category": "meditation",
        "difficulty": "easy",
        "duration": 300,
        "sessions": 10,
        "completedSessions": 3,
        "thumbnail": "https://example.com/programs/meditation.jpg",
        "benefits": ["减轻压力", "提高专注力", "改善睡眠"]
      },
      {
        "id": "breathing-advanced",
        "name": "呼吸训练进阶",
        "description": "适合有基础的呼吸调节训练",
        "category": "breathing",
        "difficulty": "medium",
        "duration": 600,
        "sessions": 15,
        "completedSessions": 0,
        "thumbnail": "https://example.com/programs/breathing.jpg",
        "benefits": ["调节情绪", "增强肺活量", "放松身心"]
      }
    ],
    "total": 8,
    "page": 1
  }
}
```

### 5.2 获取训练计划详情

**端点**: `GET /api/v1/training/programs/{id}`

**路径参数**:

| 参数名 | 类型 | 说明 |
|:-------|:-----|:-----|
| id | string | 训练计划ID |

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "meditation-beginner",
    "name": "正念冥想入门",
    "description": "适合初学者的基础冥想训练，帮助你学会基本的冥想技巧。",
    "category": "meditation",
    "difficulty": "easy",
    "duration": 300,
    "sessions": 10,
    "completedSessions": 3,
    "thumbnail": "https://example.com/programs/meditation.jpg",
    "benefits": ["减轻压力", "提高专注力", "改善睡眠"],
    "requirements": ["安静的環境", "舒适的坐姿"],
    "sessions": [
      {
        "id": "session-1",
        "title": "呼吸觉察",
        "description": "学习关注呼吸的基本技巧",
        "duration": 300,
        "instructions": [
          "找一个舒适的坐姿",
          "轻轻闭上眼睛",
          "将注意力放在呼吸上",
          "感受空气进入和离开身体"
        ],
        "audioUrl": "https://example.com/audio/session-1.mp3"
      }
    ],
    "progress": {
      "completed": 3,
      "remaining": 7,
      "percentage": 30
    }
  }
}
```

### 5.3 开始训练

**端点**: `POST /api/v1/training/programs/{id}/start`

**路径参数**:

| 参数名 | 类型 | 说明 |
|:-------|:-----|:-----|
| id | string | 训练计划ID |

**请求体**:

```json
{
  "sessionId": "session-1"
}
```

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "trainingId": "trn_abc126",
    "programId": "meditation-beginner",
    "sessionId": "session-1",
    "startedAt": "2026-05-21T10:00:00Z",
    "expiresAt": "2026-05-21T10:15:00Z"
  },
  "message": "训练已开始"
}
```

### 5.4 完成训练

**端点**: `POST /api/v1/training/{id}/complete`

**路径参数**:

| 参数名 | 类型 | 说明 |
|:-------|:-----|:-----|
| id | string | 训练记录ID |

**请求体**:

```json
{
  "completedDuration": 280,
  "mood": {
    "before": 3,
    "after": 4
  },
  "notes": "感觉不错，下次可以延长一点"
}
```

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "trn_abc126",
    "status": "completed",
    "completedDuration": 280,
    "pointsEarned": 5,
    "nextSession": {
      "id": "session-2",
      "name": "身体扫描"
    }
  },
  "message": "训练完成，获得5积分"
}
```

---

## 6. 数据类型定义

### 6.1 TrainingRecord 类型

```typescript
interface TrainingRecord {
  id: string
  programId: string
  programName: string
  category: string
  duration: number
  completedDuration: number
  status: TrainingStatus
  startedAt?: string
  completedAt?: string
  notes?: string
  mood?: MoodRecord
}

type TrainingStatus = 
  | 'in_progress'
  | 'completed'
  | 'partial'
  | 'abandoned'

interface MoodRecord {
  before: number
  after: number
}
```

### 6.2 TrainingProgram 类型

```typescript
interface TrainingProgram {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  sessions: number
  completedSessions: number
  thumbnail?: string
  benefits: string[]
  requirements?: string[]
  sessions?: ProgramSession[]
  progress?: ProgramProgress
}

interface ProgramSession {
  id: string
  title: string
  description: string
  duration: number
  instructions: string[]
  audioUrl?: string
}

interface ProgramProgress {
  completed: number
  remaining: number
  percentage: number
}
```

### 6.3 TrainingStats 类型

```typescript
interface TrainingStats {
  summary: TrainingSummary
  byCategory: CategoryStats[]
  weeklyData: DailyStats[]
  streaks: StreakInfo
}

interface TrainingSummary {
  totalSessions: number
  totalDuration: number
  totalDurationFormatted: string
  completedSessions: number
  partialSessions: number
  averageDuration: number
  completionRate: number
}

interface CategoryStats {
  category: string
  name: string
  sessions: number
  duration: number
  completionRate: number
}

interface DailyStats {
  date: string
  sessions: number
  duration: number
}

interface StreakInfo {
  current: number
  longest: number
  lastTrainingDate: string
}
```

---

## 7. 错误码说明

| 错误码 | 说明 | HTTP状态码 | 处理建议 |
|:-------|:-----|:-----------|:---------|
| 7001 | 训练记录不存在 | 404 | 检查记录ID |
| 7002 | 训练计划不存在 | 404 | 检查计划ID |
| 7003 | 训练计划不支持 | 400 | 检查计划状态 |
| 7004 | 训练记录创建失败 | 500 | 重试或联系技术支持 |
| 7005 | 训练完成失败 | 500 | 重试或联系技术支持 |

---

## 8. 使用示例

### 8.1 获取训练统计

```typescript
import api from '@/api/base/client'

async function getTrainingStats(period = 'week') {
  const response = await api.get('/training/stats', {
    params: { period }
  })
  
  if (response.success) {
    const { summary, byCategory, streaks } = response.data
    
    console.log(`本周训练次数: ${summary.totalSessions}`)
    console.log(`本周训练时长: ${summary.totalDurationFormatted}`)
    console.log(`当前连续训练: ${streaks.current}天`)
    
    return response.data
  }
  
  return null
}
```

### 8.2 开始并完成训练

```typescript
async function completeTraining(programId: string, sessionId: string) {
  // 1. 开始训练
  const startResponse = await api.post(`/training/programs/${programId}/start`, {
    sessionId
  })
  
  if (!startResponse.success) {
    throw new Error('开始训练失败')
  }
  
  const { trainingId } = startResponse.data
  
  // 2. 模拟训练过程 (实际应用中用户会进行真正的训练)
  await performTraining()
  
  // 3. 完成训练
  const completeResponse = await api.post(`/training/${trainingId}/complete`, {
    completedDuration: 280,
    mood: {
      before: 3,
      after: 5
    },
    notes: '训练感觉不错'
  })
  
  if (completeResponse.success) {
    console.log(`获得 ${completeResponse.data.pointsEarned} 积分`)
    return completeResponse.data
  }
}
```

---

## 9. 训练类别定义

| 类别 | 名称 | 说明 |
|:-----|:-----|:-----|
| meditation | 正念冥想 | 正念冥想训练 |
| breathing | 呼吸训练 | 呼吸调节练习 |
| relaxation | 放松训练 | 肌肉放松训练 |
| visualization | 意象训练 | 心理意象练习 |
| attention | 专注训练 | 注意力训练 |
| sleep | 睡眠训练 | 睡眠改善训练 |

---

**文档版本**: v1.0.0
**最后更新**: 2026-05-21
