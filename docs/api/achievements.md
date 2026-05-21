# 成就 API 接口规范

> **模块**: achievements
> **版本**: v1.0.0
> **基础路径**: `/api/v1/achievements`

---

## 1. 接口列表

| 方法 | 端点 | 说明 | 优先级 |
|:-----|:-----|:-----|:-------|
| GET | /achievements | 获取成就列表 | 中 |
| GET | /achievements/{id} | 获取成就详情 | 低 |
| POST | /achievements/{id}/unlock | 解锁成就 | 中 |
| GET | /achievements/stats | 获取成就统计 | 中 |

---

## 2. 成就列表接口

### 2.1 获取成就列表

**端点**: `GET /api/v1/achievements`

**请求头**:

```
Authorization: Bearer <access_token>
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|:-------|:-----|:-----|:-----|:-------|
| status | string | 否 | 筛选状态 | all |

**筛选状态**:

| 值 | 说明 |
|:---|:-----|
| all | 全部 |
| unlocked | 已解锁 |
| locked | 未解锁 |
| in_progress | 进行中 |

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "first-assessment",
        "name": "初次测评",
        "description": "完成你的第一个测评",
        "icon": "🌟",
        "category": "exploration",
        "status": "unlocked",
        "unlockedAt": "2026-05-21T10:30:00Z",
        "progress": 1,
        "target": 1,
        "points": 10
      },
      {
        "id": "explorer",
        "name": "探索者",
        "description": "尝试5个不同的测评",
        "icon": "🔍",
        "category": "exploration",
        "status": "in_progress",
        "progress": 3,
        "target": 5,
        "points": 50
      },
      {
        "id": "completionist",
        "name": "完美主义",
        "description": "完成50个测评",
        "icon": "🏆",
        "category": "dedication",
        "status": "locked",
        "progress": 15,
        "target": 50,
        "points": 500
      },
      {
        "id": "night-owl",
        "name": "夜猫子",
        "description": "在凌晨完成测评",
        "icon": "🦉",
        "category": "special",
        "status": "unlocked",
        "unlockedAt": "2026-05-20T02:15:00Z",
        "progress": 1,
        "target": 1,
        "points": 30
      }
    ],
    "total": 25,
    "unlockedCount": 8,
    "totalPoints": 280
  }
}
```

---

## 3. 成就详情接口

### 3.1 获取成就详情

**端点**: `GET /api/v1/achievements/{id}`

**路径参数**:

| 参数名 | 类型 | 说明 |
|:-------|:-----|:-----|
| id | string | 成就ID |

**请求头**:

```
Authorization: Bearer <access_token>
```

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "first-assessment",
    "name": "初次测评",
    "description": "完成你的第一个测评",
    "icon": "🌟",
    "category": "exploration",
    "status": "unlocked",
    "unlockedAt": "2026-05-21T10:30:00Z",
    "progress": 1,
    "target": 1,
    "points": 10,
    "hint": "完成任意一个测评即可解锁",
    "requirements": [
      "完成至少1个测评"
    ],
    "rewards": {
      "points": 10,
      "badges": []
    }
  }
}
```

---

## 4. 解锁成就接口

### 4.1 手动解锁成就

**端点**: `POST /api/v1/achievements/{id}/unlock`

**路径参数**:

| 参数名 | 类型 | 说明 |
|:-------|:-----|:-----|
| id | string | 成就ID |

**请求头**:

```
Authorization: Bearer <access_token>
```

**请求体**: 无

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "achievement": {
      "id": "early-bird",
      "name": "早起鸟",
      "description": "在早晨6点前完成测评",
      "icon": "🐦",
      "status": "unlocked",
      "unlockedAt": "2026-05-21T05:45:00Z"
    },
    "pointsEarned": 30,
    "totalPoints": 310
  },
  "message": "成就解锁成功！恭喜获得30积分"
}
```

**注意**: 大部分成就由系统自动检测并解锁，此接口主要用于特殊成就的手动触发。

---

## 5. 成就统计接口

### 5.1 获取成就统计

**端点**: `GET /api/v1/achievements/stats`

**请求头**:

```
Authorization: Bearer <access_token>
```

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "totalAchievements": 25,
    "unlockedCount": 8,
    "lockedCount": 17,
    "totalPoints": 280,
    "rank": {
      "level": 3,
      "title": "探索者",
      "nextLevelPoints": 500,
      "currentProgress": 56
    },
    "categoryStats": [
      {
        "category": "exploration",
        "name": "探索",
        "total": 8,
        "unlocked": 3
      },
      {
        "category": "dedication",
        "name": "坚持",
        "total": 5,
        "unlocked": 1
      },
      {
        "category": "special",
        "name": "特殊",
        "total": 7,
        "unlocked": 2
      },
      {
        "category": "social",
        "name": "社交",
        "total": 5,
        "unlocked": 2
      }
    ],
    "recentUnlocks": [
      {
        "id": "night-owl",
        "name": "夜猫子",
        "unlockedAt": "2026-05-20T02:15:00Z"
      },
      {
        "id": "explorer",
        "name": "探索者",
        "unlockedAt": "2026-05-19T15:30:00Z"
      }
    ]
  }
}
```

---

## 6. 成就分类定义

### 6.1 成就类别

| 类别 | 名称 | 说明 |
|:-----|:-----|:-----|
| exploration | 探索 | 探索不同类型测评 |
| dedication | 坚持 | 持续使用应用 |
| special | 特殊 | 特殊时间或行为 |
| social | 社交 | 分享或邀请 |
| skill | 技能 | 完成特定技能测评 |
| master | 大师 | 成为某领域专家 |

### 6.2 成就列表

| ID | 名称 | 类别 | 目标 | 积分 |
|:---|:-----|:-----|:-----|:-----|
| first-assessment | 初次测评 | exploration | 完成1个测评 | 10 |
| explorer | 探索者 | exploration | 完成5个不同测评 | 50 |
| psychologist | 心理学爱好者 | exploration | 完成10个心理测评 | 100 |
| knowledge-seeker | 知识追寻者 | exploration | 完成所有认知测评 | 200 |
| social-butterfly | 社交达人 | social | 分享3次测评结果 | 80 |
| friend-inviter | 社交达人 | social | 邀请3个好友 | 150 |
| streak-7 | 连续7天 | dedication | 连续7天完成测评 | 100 |
| streak-30 | 月度坚持 | dedication | 连续30天完成测评 | 300 |
| completionist | 完美主义 | dedication | 完成50个测评 | 500 |
| night-owl | 夜猫子 | special | 凌晨0-4点完成测评 | 30 |
| early-bird | 早起鸟 | special | 早晨4-6点完成测评 | 30 |
| speed-demon | 神速完成 | special | 10分钟内完成测评 | 40 |
| perfectionist | 完美主义 | special | 所有题目认真作答 | 50 |

---

## 7. 数据类型定义

### 7.1 Achievement 类型

```typescript
interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: AchievementCategory
  status: AchievementStatus
  unlockedAt?: string
  progress: number
  target: number
  points: number
  hint?: string
  requirements?: string[]
  rewards?: AchievementRewards
}

type AchievementCategory = 
  | 'exploration'
  | 'dedication'
  | 'special'
  | 'social'
  | 'skill'
  | 'master'

type AchievementStatus = 
  | 'locked'
  | 'in_progress'
  | 'unlocked'

interface AchievementRewards {
  points: number
  badges?: string[]
}
```

### 7.2 AchievementStats 类型

```typescript
interface AchievementStats {
  totalAchievements: number
  unlockedCount: number
  lockedCount: number
  totalPoints: number
  rank: UserRank
  categoryStats: CategoryStat[]
  recentUnlocks: RecentUnlock[]
}

interface UserRank {
  level: number
  title: string
  nextLevelPoints: number
  currentProgress: number
}

interface CategoryStat {
  category: string
  name: string
  total: number
  unlocked: number
}

interface RecentUnlock {
  id: string
  name: string
  unlockedAt: string
}
```

---

## 8. 错误码说明

| 错误码 | 说明 | HTTP状态码 | 处理建议 |
|:-------|:-----|:-----------|:---------|
| 6001 | 成就不存在 | 404 | 检查成就ID |
| 6002 | 成就已解锁 | 400 | 无需重复解锁 |
| 6003 | 解锁条件不满足 | 400 | 查看成就要求 |
| 6004 | 成就解锁失败 | 500 | 联系技术支持 |

---

## 9. 使用示例

### 9.1 获取成就列表

```typescript
import api from '@/api/base/client'

async function getAchievements(status?: string) {
  const response = await api.get('/achievements', {
    params: status ? { status } : undefined
  })
  
  if (response.success) {
    return response.data.achievements
  }
  
  return []
}
```

### 9.2 获取成就统计

```typescript
async function getAchievementStats() {
  const response = await api.get('/achievements/stats')
  
  if (response.success) {
    const { totalPoints, rank, categoryStats } = response.data
    
    console.log(`当前积分: ${totalPoints}`)
    console.log(`当前等级: ${rank.level} - ${rank.title}`)
    
    return response.data
  }
  
  return null
}
```

---

## 10. 自动触发机制

### 10.1 系统自动检测

以下成就由系统在特定事件触发时自动检测并解锁：

| 触发事件 | 检测的成就 |
|:---------|:----------|
| 完成测评 | first-assessment, explorer, completionist |
| 连续登录 | streak-7, streak-30 |
| 分享结果 | social-butterfly |
| 凌晨测评 | night-owl |
| 早晨测评 | early-bird |
| 快速完成 | speed-demon |

### 10.2 成就推送

当成就被解锁时，系统会推送通知：

```json
{
  "type": "achievement_unlocked",
  "data": {
    "achievementId": "first-assessment",
    "achievementName": "初次测评",
    "pointsEarned": 10
  }
}
```

---

**文档版本**: v1.0.0
**最后更新**: 2026-05-21
