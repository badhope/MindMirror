# 心情 API 接口规范

> **模块**: moods
> **版本**: v1.0.0
> **基础路径**: `/api/v1/moods`

---

## 1. 接口列表

| 方法 | 端点 | 说明 | 优先级 |
|:-----|:-----|:-----|:-------|
| GET | /moods | 获取心情记录列表 | 中 |
| POST | /moods | 添加心情记录 | 高 |
| GET | /moods/{id} | 获取心情详情 | 低 |
| DELETE | /moods/{id} | 删除心情记录 | 低 |
| GET | /moods/stats | 获取心情统计 | 中 |
| GET | /moods/trends | 获取心情趋势 | 中 |
| GET | /moods/today | 获取今日心情 | 中 |

---

## 2. 心情记录接口

### 2.1 获取心情记录列表

**端点**: `GET /api/v1/moods`

**请求头**:

```
Authorization: Bearer <access_token>
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|:-------|:-----|:-----|:-----|:-------|
| page | integer | 否 | 页码 | 1 |
| pageSize | integer | 否 | 每页数量 | 30 |
| startDate | string | 否 | 开始日期 | - |
| endDate | string | 否 | 结束日期 | - |
| moodLevel | integer | 否 | 心情等级筛选 | - |

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "mood_abc123",
        "date": "2026-05-21",
        "mood": 5,
        "moodLabel": "很开心",
        "moodEmoji": "😊",
        "intensity": 0.8,
        "triggers": ["完成了一个测评", "天气很好"],
        "notes": "今天感觉特别棒！",
        "recordedAt": "2026-05-21T18:00:00Z",
        "weather": "晴",
        "activities": ["测评", "训练"]
      },
      {
        "id": "mood_abc124",
        "date": "2026-05-20",
        "mood": 3,
        "moodLabel": "一般",
        "moodEmoji": "😐",
        "intensity": 0.5,
        "triggers": [],
        "notes": "普普通通的一天",
        "recordedAt": "2026-05-20T20:00:00Z"
      }
    ],
    "total": 45,
    "page": 1,
    "pageSize": 30,
    "totalPages": 2
  }
}
```

---

## 3. 添加心情记录

### 3.1 创建心情记录

**端点**: `POST /api/v1/moods`

**请求头**:

```
Authorization: Bearer <access_token>
```

**请求示例**:

```json
{
  "mood": 5,
  "intensity": 0.8,
  "triggers": ["完成了一个测评", "天气很好"],
  "notes": "今天感觉特别棒！",
  "weather": "晴",
  "activities": ["测评", "训练"]
}
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 | 验证规则 |
|:-------|:-----|:-----|:-----|:---------|
| mood | integer | 是 | 心情等级 | 1-5 |
| intensity | number | 否 | 心情强度 | 0-1 |
| triggers | array | 否 | 心情触发因素 | 最多5个 |
| notes | string | 否 | 心情备注 | 最多500字符 |
| weather | string | 否 | 天气状况 | 预定义选项 |
| activities | array | 否 | 当日活动 | 最多10个 |

**mood 等级说明**:

| 值 | 心情 | Emoji | 说明 |
|:---|:-----|:------|:-----|
| 1 | 很低落 | 😢 | 情绪非常低落 |
| 2 | 不太好 | 😔 | 情绪有些低落 |
| 3 | 一般 | 😐 | 情绪平稳 |
| 4 | 不错 | 🙂 | 心情愉悦 |
| 5 | 很开心 | 😊 | 心情非常好 |

**triggers 预定义选项**:

| 值 | 说明 |
|:---|:-----|
| 工作顺利 | 工作上的成就 |
| 完成目标 | 达成了某个目标 |
| 社交活动 | 与朋友聚会等 |
| 运动健身 | 运动带来的愉悦 |
| 学习进步 | 学到了新知识 |
| 天气很好 | 天气影响心情 |
| 睡眠充足 | 休息质量好 |
| 健康状况 | 身体感觉良好 |

**weather 预定义选项**:

| 值 | 说明 |
|:---|:-----|
| 晴 | 晴天 |
| 多云 | 多云 |
| 阴 | 阴天 |
| 雨 | 下雨 |
| 雪 | 下雪 |
| 雾 | 有雾 |

**activities 预定义选项**:

| 值 | 说明 |
|:---|:-----|
| 测评 | 完成心理测评 |
| 训练 | 进行心理训练 |
| 阅读 | 阅读学习 |
| 工作 | 工作相关 |
| 运动 | 体育锻炼 |
| 社交 | 社交活动 |
| 娱乐 | 娱乐休闲 |
| 休息 | 休息放松 |

**成功响应** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "mood_abc125",
    "date": "2026-05-21",
    "mood": 5,
    "moodLabel": "很开心",
    "moodEmoji": "😊",
    "intensity": 0.8,
    "triggers": ["完成了一个测评", "天气很好"],
    "notes": "今天感觉特别棒！",
    "weather": "晴",
    "activities": ["测评", "训练"],
    "recordedAt": "2026-05-21T18:00:00Z",
    "insights": {
      "streak": 3,
      "weeklyAverage": 4.2
    }
  },
  "message": "心情记录成功"
}
```

**注意**: 同一日期只能有一条心情记录，如果当天已记录会更新而非创建新记录。

---

## 4. 心情详情接口

### 4.1 获取心情详情

**端点**: `GET /api/v1/moods/{id}`

**路径参数**:

| 参数名 | 类型 | 说明 |
|:-------|:-----|:-----|
| id | string | 心情记录ID |

**请求头**:

```
Authorization: Bearer <access_token>
```

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "mood_abc123",
    "date": "2026-05-21",
    "mood": 5,
    "moodLabel": "很开心",
    "moodEmoji": "😊",
    "intensity": 0.8,
    "triggers": ["完成了一个测评", "天气很好"],
    "notes": "今天感觉特别棒！",
    "weather": "晴",
    "activities": ["测评", "训练"],
    "recordedAt": "2026-05-21T18:00:00Z",
    "relatedAssessments": [
      {
        "assessmentId": "sbti-personality",
        "title": "MBTI 16型人格测试",
        "score": 85
      }
    ],
    "suggestions": [
      "继续保持好心情！",
      "今天适合学习新技能"
    ]
  }
}
```

---

## 5. 心情统计接口

### 5.1 获取心情统计

**端点**: `GET /api/v1/moods/stats`

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
      "totalRecords": 45,
      "averageMood": 3.8,
      "highestMood": 5,
      "lowestMood": 2,
      "mostCommonMood": 4,
      "mostCommonEmoji": "🙂"
    },
    "distribution": [
      { "mood": 1, "label": "很低落", "count": 2, "percentage": 4.4 },
      { "mood": 2, "label": "不太好", "count": 5, "percentage": 11.1 },
      { "mood": 3, "label": "一般", "count": 12, "percentage": 26.7 },
      { "mood": 4, "label": "不错", "count": 18, "percentage": 40.0 },
      { "mood": 5, "label": "很开心", "count": 8, "percentage": 17.8 }
    ],
    "byCategory": [
      {
        "category": "work",
        "name": "工作日",
        "averageMood": 3.5,
        "count": 30
      },
      {
        "category": "weekend",
        "name": "周末",
        "averageMood": 4.2,
        "count": 15
      }
    ],
    "topTriggers": [
      { "trigger": "睡眠充足", "count": 20, "averageMood": 4.2 },
      { "trigger": "社交活动", "count": 15, "averageMood": 4.5 },
      { "trigger": "运动健身", "count": 12, "averageMood": 4.1 }
    ],
    "insights": {
      "positiveTrend": true,
      "trendDescription": "本周心情呈上升趋势",
      "recommendations": [
        "继续保持规律作息",
        "增加社交活动频率"
      ]
    }
  }
}
```

---

## 6. 心情趋势接口

### 6.1 获取心情趋势

**端点**: `GET /api/v1/moods/trends`

**请求头**:

```
Authorization: Bearer <access_token>
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|:-------|:-----|:-----|:-----|:-------|
| period | string | 否 | 趋势周期 | month |
| granularity | string | 否 | 数据粒度 | day |

**period 选项**: week, month, year, all

**granularity 选项**: day, week, month

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "period": "month",
    "granularity": "day",
    "dataPoints": [
      {
        "date": "2026-05-21",
        "mood": 4.5,
        "moodLabel": "不错",
        "emoji": "🙂",
        "count": 1
      },
      {
        "date": "2026-05-20",
        "mood": 3.8,
        "moodLabel": "一般",
        "emoji": "😐",
        "count": 1
      },
      {
        "date": "2026-05-19",
        "mood": 4.2,
        "moodLabel": "不错",
        "emoji": "🙂",
        "count": 1
      }
    ],
    "statistics": {
      "average": 4.0,
      "median": 4.0,
      "standardDeviation": 0.5,
      "min": 3.5,
      "max": 4.5,
      "trend": "stable"
    },
    "anomalies": [
      {
        "date": "2026-05-15",
        "mood": 2.0,
        "reason": "当天记录显示心情较低"
      }
    ]
  }
}
```

---

## 7. 今日心情接口

### 7.1 获取今日心情

**端点**: `GET /api/v1/moods/today`

**请求头**:

```
Authorization: Bearer <access_token>
```

**成功响应** (200 OK) - 已记录:

```json
{
  "success": true,
  "data": {
    "recorded": true,
    "mood": {
      "id": "mood_abc123",
      "mood": 4,
      "moodLabel": "不错",
      "moodEmoji": "🙂",
      "recordedAt": "2026-05-21T18:00:00Z"
    },
    "streak": {
      "current": 7,
      "message": "已连续记录7天"
    },
    "nextReminder": null
  }
}
```

**成功响应** (200 OK) - 未记录:

```json
{
  "success": true,
  "data": {
    "recorded": false,
    "mood": null,
    "streak": {
      "current": 7,
      "message": "再记录1天就能连续8天了！"
    },
    "suggestions": [
      "记录一下今天的心情吧",
      "良好的情绪觉察有助于心理健康"
    ],
    "nextReminder": {
      "time": "20:00",
      "message": "今晚8点提醒你记录心情"
    }
  }
}
```

---

## 8. 数据类型定义

### 8.1 MoodRecord 类型

```typescript
interface MoodRecord {
  id: string
  date: string
  mood: MoodLevel
  moodLabel: string
  moodEmoji: string
  intensity: number
  triggers?: string[]
  notes?: string
  weather?: WeatherCondition
  activities?: string[]
  recordedAt: string
  relatedAssessments?: RelatedAssessment[]
  suggestions?: string[]
}

type MoodLevel = 1 | 2 | 3 | 4 | 5

type WeatherCondition = 
  | '晴'
  | '多云'
  | '阴'
  | '雨'
  | '雪'
  | '雾'

interface RelatedAssessment {
  assessmentId: string
  title: string
  score: number
}
```

### 8.2 MoodStats 类型

```typescript
interface MoodStats {
  summary: MoodSummary
  distribution: MoodDistribution[]
  byCategory: CategoryMoodStats[]
  topTriggers: TriggerStats[]
  insights: MoodInsights
}

interface MoodSummary {
  totalRecords: number
  averageMood: number
  highestMood: number
  lowestMood: number
  mostCommonMood: number
  mostCommonEmoji: string
}

interface MoodDistribution {
  mood: number
  label: string
  count: number
  percentage: number
}

interface CategoryMoodStats {
  category: string
  name: string
  averageMood: number
  count: number
}

interface TriggerStats {
  trigger: string
  count: number
  averageMood: number
}

interface MoodInsights {
  positiveTrend: boolean
  trendDescription: string
  recommendations: string[]
}
```

### 8.3 MoodTrends 类型

```typescript
interface MoodTrends {
  period: string
  granularity: string
  dataPoints: TrendDataPoint[]
  statistics: TrendStatistics
  anomalies?: TrendAnomaly[]
}

interface TrendDataPoint {
  date: string
  mood: number
  moodLabel: string
  emoji: string
  count: number
}

interface TrendStatistics {
  average: number
  median: number
  standardDeviation: number
  min: number
  max: number
  trend: 'up' | 'down' | 'stable'
}

interface TrendAnomaly {
  date: string
  mood: number
  reason: string
}
```

---

## 9. 错误码说明

| 错误码 | 说明 | HTTP状态码 | 处理建议 |
|:-------|:-----|:-----------|:---------|
| 8001 | 心情记录不存在 | 404 | 检查记录ID |
| 8002 | 心情等级无效 | 400 | 使用1-5的有效等级 |
| 8003 | 心情强度无效 | 400 | 使用0-1的有效强度 |
| 8004 | 触发因素无效 | 400 | 使用预定义选项 |
| 8005 | 记录创建失败 | 500 | 重试或联系技术支持 |
| 8006 | 统计计算失败 | 500 | 重试或联系技术支持 |

---

## 10. 使用示例

### 10.1 记录今日心情

```typescript
import api from '@/api/base/client'

async function recordMood() {
  const response = await api.post('/moods', {
    mood: 5,
    intensity: 0.8,
    triggers: ['睡眠充足', '运动健身'],
    notes: '今天感觉特别好！',
    weather: '晴',
    activities: ['运动', '阅读']
  })
  
  if (response.success) {
    console.log(`已记录今天的心情: ${response.data.moodLabel}`)
    return response.data
  }
  
  return null
}
```

### 10.2 获取心情趋势

```typescript
async function getMoodTrends() {
  const response = await api.get('/moods/trends', {
    params: {
      period: 'month',
      granularity: 'day'
    }
  })
  
  if (response.success) {
    const { dataPoints, statistics } = response.data
    
    console.log(`本月平均心情: ${statistics.average.toFixed(1)}`)
    console.log(`心情趋势: ${statistics.trend}`)
    
    return response.data
  }
  
  return null
}
```

---

## 11. 智能提醒机制

### 11.1 提醒规则

| 提醒类型 | 触发条件 | 提醒时间 |
|:---------|:---------|:---------|
| 每日提醒 | 未记录心情 | 20:00 |
| 连续提醒 | 连续3天以上未记录 | 10:00 |
| 积极提醒 | 连续5天积极心情 | 即时 |
| 关注提醒 | 连续3天心情低落 | 10:00 |

### 11.2 推送数据

```json
{
  "type": "mood_reminder",
  "data": {
    "message": "今天心情怎么样？记录一下吧~",
    "streak": {
      "current": 7,
      "message": "再记录1天就能连续8天了！"
    },
    "quickOptions": [
      { "mood": 5, "label": "很开心 😊" },
      { "mood": 4, "label": "不错 🙂" },
      { "mood": 3, "label": "一般 😐" },
      { "mood": 2, "label": "不太好 😔" },
      { "mood": 1, "label": "很低落 😢" }
    ]
  }
}
```

---

**文档版本**: v1.0.0
**最后更新**: 2026-05-21
