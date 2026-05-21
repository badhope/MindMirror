# 测评 API 接口规范

> **模块**: assessments
> **版本**: v1.0.0
> **基础路径**: `/api/v1/assessments`

---

## 1. 接口列表

| 方法 | 端点 | 说明 | 优先级 |
|:-----|:-----|:-----|:-------|
| GET | /assessments | 获取测评列表 | 高 |
| GET | /assessments/{id} | 获取测评详情 | 高 |
| GET | /assessments/categories | 获取测评分类 | 中 |
| POST | /assessments/{id}/submit | 提交测评答案 | 高 |
| GET | /assessments/{id}/result | 获取测评结果 | 高 |
| GET | /assessments/{id}/result/{resultId} | 获取指定结果 | 中 |
| GET | /assessments/history | 获取测评历史 | 中 |
| DELETE | /assessments/history/{id} | 删除测评记录 | 低 |

---

## 2. 测评列表接口

### 2.1 获取测评列表

**端点**: `GET /api/v1/assessments`

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|:-------|:-----|:-----|:-----|:-------|
| page | integer | 否 | 页码 | 1 |
| pageSize | integer | 否 | 每页数量 | 20 |
| category | string | 否 | 分类筛选 | - |
| difficulty | string | 否 | 难度筛选 | - |
| search | string | 否 | 搜索关键词 | - |
| sort | string | 否 | 排序方式 | popular |

**排序方式**:

| 值 | 说明 |
|:---|:-----|
| popular | 热门程度 |
| recent | 最新 |
| difficulty-asc | 难度升序 |
| difficulty-desc | 难度降序 |
| duration-asc | 时长升序 |

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "sbti-personality",
        "title": "MBTI 16型人格测试",
        "description": "探索您的人格类型，了解自己的行为模式、优势和潜在发展领域。",
        "category": "趣味测评",
        "subcategory": "人格测试",
        "difficulty": "easy",
        "duration": 8,
        "questionCount": 40,
        "completedCount": 12580,
        "averageScore": 78.5,
        "thumbnail": "https://example.com/thumbnails/sbti.jpg",
        "tags": ["人格", "心理", "MBTI"]
      },
      {
        "id": "ocean-bigfive",
        "title": "大五人格OCEAN",
        "description": "心理学界黄金标准的人格测评模型。",
        "category": "心理测评",
        "subcategory": "人格测试",
        "difficulty": "medium",
        "duration": 15,
        "questionCount": 150,
        "completedCount": 8920,
        "averageScore": 72.3,
        "thumbnail": "https://example.com/thumbnails/ocean.jpg",
        "tags": ["大五人格", "心理", "OCEAN"]
      }
    ],
    "total": 45,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}
```

### 2.2 获取测评分类

**端点**: `GET /api/v1/assessments/categories`

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "name": "心理测评",
      "subcategories": [
        "人格测试",
        "情绪测评",
        "压力测评",
        "关系测评"
      ],
      "count": 18
    },
    {
      "name": "职业测评",
      "subcategories": [
        "职业兴趣",
        "职业能力",
        "职业价值观"
      ],
      "count": 12
    },
    {
      "name": "认知测评",
      "subcategories": [
        "智力测评",
        "注意力测评",
        "记忆力测评"
      ],
      "count": 8
    },
    {
      "name": "趣味测评",
      "subcategories": [
        "人格测试",
        "趣味测试"
      ],
      "count": 7
    }
  ]
}
```

---

## 3. 测评详情接口

### 3.1 获取测评详情

**端点**: `GET /api/v1/assessments/{id}`

**路径参数**:

| 参数名 | 类型 | 说明 |
|:-------|:-----|:-----|
| id | string | 测评ID |

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|:-------|:-----|:-----|:-----|:-------|
| mode | string | 否 | 测评模式 | normal |

**测评模式**:

| 值 | 说明 | 题目数量 |
|:---|:-----|:---------|
| normal | 标准模式 | 20-30题 |
| advanced | 高级模式 | 50-60题 |
| professional | 专业模式 | 100+题 |

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "sbti-personality",
    "title": "MBTI 16型人格测试",
    "description": "探索您的人格类型，了解自己的行为模式、优势和潜在发展领域。",
    "category": "趣味测评",
    "subcategory": "人格测试",
    "difficulty": "easy",
    "duration": 8,
    "questionCount": 40,
    "instructions": "请根据您的第一反应选择最符合您的选项。",
    "warnings": ["本测评仅供参考", "结果不应作为诊断依据"],
    "thumbnail": "https://example.com/thumbnails/sbti.jpg",
    "questions": [
      {
        "id": "sbti-1",
        "text": "您更愿意：",
        "type": "likert-5",
        "options": [
          { "value": 1, "label": "与他人共度时光" },
          { "value": 2, "label": "通常与他人在一起" },
          { "value": 3, "label": "两者兼顾" },
          { "value": 4, "label": "通常独处" },
          { "value": 5, "label": "完全独处" }
        ],
        "dimension": "extraversion"
      }
    ],
    "metadata": {
      "theory": "卡尔·荣格的人格类型理论",
      "author": "伊莎贝尔·迈尔斯 & 凯瑟琳·布里格斯",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

---

## 4. 测评提交接口

### 4.1 提交测评答案

**端点**: `POST /api/v1/assessments/{id}/submit`

**路径参数**:

| 参数名 | 类型 | 说明 |
|:-------|:-----|:-----|
| id | string | 测评ID |

**请求头**:

```
Authorization: Bearer <access_token>
```

**请求示例**:

```json
{
  "mode": "normal",
  "answers": [
    {
      "questionId": "sbti-1",
      "value": 4,
      "selectedOption": "通常独处"
    },
    {
      "questionId": "sbti-2",
      "value": 3,
      "selectedOption": "适度参与"
    }
  ],
  "startTime": "2026-05-21T10:00:00Z",
  "endTime": "2026-05-21T10:08:00Z"
}
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|:-------|:-----|:-----|:-----|
| mode | string | 是 | 测评模式 |
| answers | array | 是 | 答案列表 |
| startTime | string | 否 | 开始时间 |
| endTime | string | 否 | 结束时间 |

**answers 数组元素**:

| 参数名 | 类型 | 说明 |
|:-------|:-----|:-----|
| questionId | string | 题目ID |
| value | integer | 答案值 |
| selectedOption | string | 选中选项文本 |

**成功响应** (201 Created):

```json
{
  "success": true,
  "data": {
    "submissionId": "sub_xyz789abc",
    "assessmentId": "sbti-personality",
    "submittedAt": "2026-05-21T10:08:30Z",
    "duration": 480,
    "result": {
      "id": "res_abc123",
      "typeCode": "INTJ",
      "typeName": "建筑师",
      "score": 85,
      "dimensions": [
        {
          "name": "能量来源",
          "score": 35,
          "preference": "I",
          "preferenceName": "内向"
        },
        {
          "name": "信息获取",
          "score": 42,
          "preference": "N",
          "preferenceName": "直觉"
        },
        {
          "name": "决策方式",
          "score": 38,
          "preference": "T",
          "preferenceName": "思考"
        },
        {
          "name": "生活态度",
          "score": 45,
          "preference": "J",
          "preferenceName": "判断"
        }
      ],
      "title": "你的人格类型: INTJ - 建筑师",
      "summary": "富有想象力和战略性的思想家，一切皆在计划之中",
      "strengths": ["强大的分析和战略思维能力", "高度的自律和责任感"],
      "careerSuggestions": ["科学研究", "系统架构", "战略规划"],
      "compatibility": "与 ENTJ, INFP, INFJ 有较好的兼容性"
    }
  },
  "message": "测评提交成功"
}
```

**错误响应** (400 Bad Request):

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "答案不完整",
    "details": {
      "required": 40,
      "provided": 38,
      "missingQuestions": ["sbti-12", "sbti-35"]
    }
  }
}
```

---

## 5. 测评结果接口

### 5.1 获取最新测评结果

**端点**: `GET /api/v1/assessments/{id}/result`

**路径参数**:

| 参数名 | 类型 | 说明 |
|:-------|:-----|:-----|
| id | string | 测评ID |

**请求头**:

```
Authorization: Bearer <access_token>
```

**成功响应** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "res_abc123",
    "assessmentId": "sbti-personality",
    "typeCode": "INTJ",
    "typeName": "建筑师",
    "score": 85,
    "accuracy": 88,
    "submittedAt": "2026-05-21T10:08:30Z",
    "dimensions": [...],
    "title": "你的人格类型: INTJ - 建筑师",
    "summary": "富有想象力和战略性的思想家...",
    "detailedAnalysis": "...",
    "strengths": [...],
    "weaknesses": [...],
    "careerSuggestions": [...],
    "famousPeople": ["尼古拉·特斯拉", "爱因斯坦", "马斯克"],
    "compatibility": "与 ENTJ, INFP, INFJ 有较好的兼容性"
  }
}
```

### 5.2 获取指定测评结果

**端点**: `GET /api/v1/assessments/{id}/result/{resultId}`

**路径参数**:

| 参数名 | 类型 | 说明 |
|:-------|:-----|:-----|
| id | string | 测评ID |
| resultId | string | 结果ID |

**成功响应** (200 OK): 同上

---

## 6. 测评历史接口

### 6.1 获取测评历史

**端点**: `GET /api/v1/assessments/history`

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
        "id": "sub_xyz789abc",
        "assessmentId": "sbti-personality",
        "assessmentTitle": "MBTI 16型人格测试",
        "assessmentCategory": "趣味测评",
        "resultId": "res_abc123",
        "resultSummary": "INTJ - 建筑师",
        "score": 85,
        "submittedAt": "2026-05-21T10:08:30Z",
        "duration": 480
      },
      {
        "id": "sub_xyz789abd",
        "assessmentId": "ocean-bigfive",
        "assessmentTitle": "大五人格OCEAN",
        "assessmentCategory": "心理测评",
        "resultId": "res_abc124",
        "resultSummary": "开放性: 78, 尽责性: 65",
        "score": 72,
        "submittedAt": "2026-05-20T14:30:00Z",
        "duration": 900
      }
    ],
    "total": 15,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1
  }
}
```

### 6.2 删除测评记录

**端点**: `DELETE /api/v1/assessments/history/{id}`

**路径参数**:

| 参数名 | 类型 | 说明 |
|:-------|:-----|:-----|
| id | string | 记录ID |

**请求头**:

```
Authorization: Bearer <access_token>
```

**成功响应** (200 OK):

```json
{
  "success": true,
  "message": "测评记录删除成功"
}
```

---

## 7. 数据类型定义

### 7.1 Assessment 类型

```typescript
interface Assessment {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  questionCount: number
  instructions?: string
  warnings?: string[]
  thumbnail?: string
  questions: Question[]
  metadata?: AssessmentMetadata
}

interface Question {
  id: string
  text: string
  type: 'likert-5' | 'likert-7' | 'choice'
  options: QuestionOption[]
  dimension?: string
  reverseScored?: boolean
}

interface QuestionOption {
  value: number
  label: string
}
```

### 7.2 Submission 类型

```typescript
interface Submission {
  id: string
  assessmentId: string
  mode: 'normal' | 'advanced' | 'professional'
  answers: Answer[]
  startTime?: string
  endTime?: string
  submittedAt: string
  duration?: number
}

interface Answer {
  questionId: string
  value: number
  selectedOption: string
}
```

### 7.3 Result 类型

```typescript
interface AssessmentResult {
  id: string
  assessmentId: string
  typeCode: string
  typeName: string
  score: number
  accuracy?: number
  dimensions: Dimension[]
  title: string
  summary: string
  detailedAnalysis?: string
  strengths: string[]
  weaknesses?: string[]
  careerSuggestions?: string[]
  famousPeople?: string[]
  compatibility?: string
  submittedAt: string
}

interface Dimension {
  name: string
  score: number
  preference?: string
  preferenceName?: string
  description?: string
}
```

---

## 8. 错误码说明

| 错误码 | 说明 | HTTP状态码 | 处理建议 |
|:-------|:-----|:-----------|:---------|
| 4001 | 测评不存在 | 404 | 检查测评ID |
| 4002 | 答案不完整 | 400 | 补充缺失答案 |
| 4003 | 答案格式错误 | 400 | 检查答案数据格式 |
| 4004 | 测评模式不支持 | 400 | 使用支持的模式 |
| 4005 | 已超过测评时限 | 400 | 重新开始测评 |
| 5001 | 计算器错误 | 500 | 联系技术支持 |
| 5002 | 服务器内部错误 | 500 | 重试或联系技术支持 |

---

## 9. 使用示例

### 9.1 获取并完成测评

```typescript
import api from '@/api/base/client'

async function completeAssessment(assessmentId: string) {
  // 1. 获取测评详情
  const assessmentResponse = await api.get(`/assessments/${assessmentId}`)
  
  if (!assessmentResponse.success) {
    throw new Error('获取测评失败')
  }
  
  const { questions } = assessmentResponse.data
  
  // 2. 收集用户答案
  const answers = questions.map(q => ({
    questionId: q.id,
    value: getUserAnswer(q.id), // 实际应用中获取用户输入
    selectedOption: getUserOption(q.id)
  }))
  
  // 3. 提交答案
  const submitResponse = await api.post(`/assessments/${assessmentId}/submit`, {
    mode: 'normal',
    answers,
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString()
  })
  
  if (submitResponse.success) {
    return submitResponse.data.result
  }
}
```

### 9.2 获取历史测评

```typescript
async function getAssessmentHistory(page = 1, pageSize = 20) {
  const response = await api.get('/assessments/history', {
    params: { page, pageSize }
  })
  
  if (response.success) {
    const { items, total, totalPages } = response.data
    return { items, total, totalPages }
  }
  
  return { items: [], total: 0, totalPages: 0 }
}
```

---

## 10. 性能优化建议

1. **缓存测评数据**: 测评详情可缓存1小时
2. **分页加载**: 大列表使用分页
3. **异步计算**: 复杂测评结果异步返回
4. **结果压缩**: 历史记录可压缩存储

---

**文档版本**: v1.0.0
**最后更新**: 2026-05-21
