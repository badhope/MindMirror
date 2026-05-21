# MindMirror 依赖分析报告

> **文档版本**: v1.0.0
> **创建日期**: 2026-05-21
> **目标**: 分析现有代码结构，为前后端分离重构提供依据

---

## 1. 数据结构分析

### 1.1 测评数据结构 (src/data/assessments/)

#### 1.1.1 标准测评列表

| ID | 名称 | 分类 | 题目数 | 计算器 |
|:---|:-----|:-----|:-------|:-------|
| sbti-personality | MBTI 16型人格测试 | 趣味测评 | 40 | calculateSBTI |
| ocean-bigfive | 大五人格OCEAN | 趣味测评 | 150 | calculateOcean |
| eq-goleman | 情商测评 | 心理测评 | 40 | eqCalculator |
| dark-triad | 暗黑三人格 | 心理测评 | 27 | darkCalculator |
| ecr-attachment | 依恋风格测评 | 心理测评 | 36 | ecrCalculator |
| scl90 | 症状自评量表 | 心理测评 | 90 | scl90Calculator |
| sas-standard | 焦虑自评量表 | 心理测评 | 20 | sasCalculator |
| sds-standard | 抑郁自评量表 | 心理测评 | 20 | sdsCalculator |
| pss-standard | 压力感知量表 | 心理测评 | 10 | pss10Calculator |
| pcq-standard | 心理资本量表 | 心理测评 | 24 | pcqCalculator |
| hardiness-standard | 心理韧性量表 | 心理测评 | 27 | hardinessCalculator |
| schwartz-standard | 施瓦茨价值观 | 心理测评 | 56 | schwartzCalculator |
| holland-sds | 霍兰德职业兴趣 | 职业测评 | 60 | hollandCalculator |
| kolb-standard | 科尔布学习风格 | 职业测评 | 12 | kolbCalculator |
| mindset-standard | 成长型思维 | 职业测评 | 20 | mindsetCalculator |
| metacognition-standard | 元认知能力 | 职业测评 | 22 | metacognitionCalculator |
| mlq-standard | 生命意义感 | 心理测评 | 21 | mlqCalculator |
| tki-standard | TKI冲突模式 | 心理测评 | 30 | tkiCalculator |
| els-standard | 情绪劳动量表 | 心理测评 | 15 | elsCalculator |
| ocb-standard | 组织公民行为 | 心理测评 | 24 | ocbCalculator |
| mft-standard | 道德 foundations | 心理测评 | 20 | mftCalculator |
| iq-ravens | 瑞文智力测验 | 认知测评 | 30 | iqCalculator |
| gma-maturity | 一般心理能力 | 认知测评 | 40 | gmaCalculator |
| attention-test | 注意力测验 | 认知测评 | 20 | attentionCalculator |
| sleep-quality | 睡眠质量测评 | 健康测评 | 18 | psqiCalculator |
| burnout-mbi | 职业倦怠量表 | 健康测评 | 22 | burnoutCalculator |
| cast-parenting | 父母效能测评 | 关系测评 | 20 | castCalculator |
| ideology-9square | 政治立场测评 | 趣味测评 | 30 | ideologyCalculator |
| internet-addiction | 网络成瘾测评 | 健康测评 | 20 | lazyCalculator |
| foodie-level | 吃货等级测评 | 趣味测评 | 20 | foodieCalculator |
| life-meaning | 生命意义感 | 心理测评 | 20 | lifeMeaningCalculator |
| officialdom-dream | 官场梦测评 | 趣味测评 | 30 | officialdomCalculator |
| color-subconscious | 颜色潜意识 | 趣味测评 | 10 | colorSubconsciousCalculator |
| abm-love-animal | 动物恋测评 | 趣味测评 | 15 | abmLoveAnimalCalculator |
| mental-age | 心理年龄测评 | 趣味测评 | 30 | mentalAgeCalculator |
| lacan-diagnosis | 拉康诊断 | 趣味测评 | 30 | lacanCalculator |
| pua-resistance | PUA防御能力 | 心理测评 | 20 | puaCalculator |
| patriotism-purity | 爱国纯粹度 | 趣味测评 | 20 | patriotismCalculator |
| slacking-purity | 摸鱼纯粹度 | 趣味测评 | 20 | lazyCalculator |
| fubao-index | 福报指数 | 趣味测评 | 15 | fubaoCalculator |
| philo-spectrum | 哲学立场测评 | 趣味测评 | 30 | philoCalculator |
| onepiece-bounty | 海贼王赏金 | 趣味测评 | 20 | sbtiCalculator |
| asi-standard | 威权人格量表 | 心理测评 | 20 | asiCalculator |

#### 1.1.2 测评数据结构定义

```typescript
interface Assessment {
  id: string                           // 测评唯一标识
  title: string                        // 测评标题
  description: string                   // 测评描述
  category: string                     // 主分类
  subcategory: string                  // 子分类
  difficulty: '简单' | '中等' | '困难' // 难度级别
  duration: string                     // 预计时长
  questionCount: number                 // 题目数量
  quality: 'standard' | 'professional' // 质量级别
  resultCalculator: string              // 计算器函数名
  questions: Question[]                // 题目列表
}

interface Question {
  id: string                           // 题目ID
  text: string                         // 题目文本
  type: 'likert-5' | 'likert-7' | 'choice' // 题型
  options: string[]                    // 选项列表
  dimension?: string                   // 所属维度
  reverseScored?: boolean              // 是否反向计分
}
```

#### 1.1.3 数据文件统计

| 目录 | 文件数 | 说明 |
|:-----|:-------|:-----|
| src/data/assessments/ | 45 | 标准测评数据 |
| src/data/professional/ | 60+ | 专业测评数据 |
| src/data/entertainment/ | 30+ | 趣味测评数据 |
| src/data/political-ideology/ | 15+ | 政治立场测评 |
| src/data/knowledge-base/ | 10+ | 知识库数据 |

---

## 2. 计算器逻辑分析

### 2.1 核心计算引擎 (CalculatorEngine)

**文件**: `src/utils/calculators/CalculatorEngine.ts`

**职责**:
- 统一调度所有测评计算器
- 提供 fallback 降级机制
- 性能监控和元数据记录

**核心方法**:

```typescript
interface CalculationContext {
  assessmentId: string
  answers: number[]
  mode: 'normal' | 'advanced' | 'professional'
}

interface CalculationResult {
  result: AssessmentResult
  metadata: CalculationMetadata
}
```

### 2.2 主要计算器列表

| 计算器 | 文件 | 复杂度 | 迁移优先级 |
|:-------|:-----|:-------|:----------|
| SBTI/MBTI | sbti-calculator.ts | 中 | 高 |
| OCEAN 大五 | ocean-calculator.ts | 高 | 高 |
| 情商 EQ | eq-calculator.ts | 中 | 高 |
| 霍兰德职业 | holland-calculator.ts | 中 | 高 |
| 抑郁 SDS | sds-calculator.ts | 中 | 高 |
| 焦虑 SAS | sas-calculator.ts | 低 | 中 |
| 压力 PSS | pss10-calculator.ts | 低 | 中 |
| 依恋风格 ECR | ecr-calculator.ts | 中 | 中 |
| 职业倦怠 | burnout-calculator.ts | 中 | 中 |
| IQ 智力 | iq-calculator.ts | 高 | 中 |
| 睡眠质量 | psqi-calculator.ts | 高 | 中 |
| 冲突风格 TKI | tki-calculator.ts | 中 | 低 |
| 学习风格 Kolb | kolb-calculator.ts | 中 | 低 |
| 心理资本 PCQ | pcq-calculator.ts | 中 | 低 |
| 价值观 Schwartz | schwartz-calculator.ts | 高 | 低 |
| 成长思维 | mindset-calculator.ts | 低 | 低 |
| 元认知 | metacognition-calculator.ts | 中 | 低 |

### 2.3 计算器算法详解

#### 2.3.1 SBTI/MBTI 计算器

**算法流程**:

1. **答案映射**: 将答案数组转换为问题ID映射
2. **维度分组**: 将30道题分配到4个维度
   - 能量来源 (E-I): 题1-8
   - 信息获取 (S-N): 题9-16
   - 决策方式 (T-F): 题17-24
   - 生活态度 (J-P): 题25-30
3. **分数计算**: 每个维度计算标准化分数 (0-100)
4. **类型判定**: 根据分数确定四字性格代码
5. **结果生成**: 生成详细报告、优势、劣势、职业建议等

**核心算法**:

```typescript
function calculateSBTI(answers: Answer[]): SBTIResult {
  // 1. 答案映射
  const answerMap: Record<string, number> = {}
  
  // 2. 维度分数计算
  let eScore = 0, nScore = 0, fScore = 0, pScore = 0
  
  // 3. 标准化分数 (0-100)
  const E = Math.min(100, Math.max(0, 50 + (eScore / eCount) * 25))
  
  // 4. 确定偏好
  const ePref = E >= 50 ? 'E' : 'I'
  
  // 5. 组合性格代码
  const typeCode = ePref + sPref + tPref + jPref
}
```

#### 2.3.2 OCEAN 大五计算器

**算法流程**:

1. **答案映射**: 将150道题映射到题号
2. **反向计分处理**: 识别并处理反向计分题
3. **维度分数计算**: 计算5个维度的原始分数
4. **常模校正**: 基于McCrae标准化数据校正
5. **响应风格校正**: 使用diversityEngine校正
6. **人格画像生成**: 根据组合生成人格类型描述

**核心算法**:

```typescript
function calculateOcean(answers: Answer[]): OceanResult {
  // 1. 维度分组 (每维度30题)
  const oItems = ['ocean-001', ..., 'ocean-030']
  const cItems = ['ocean-031', ..., 'ocean-060']
  const eItems = ['ocean-061', ..., 'ocean-090']
  const aItems = ['ocean-091', ..., 'ocean-120']
  const nItems = ['ocean-121', ..., 'ocean-150']
  
  // 2. 反向计分处理
  const reverseO = ['ocean-005', 'ocean-010', ...]
  
  // 3. 分数计算
  const calcScore = (items: string[], reverse: string[]) => {
    let raw = 0
    items.forEach(id => {
      let val = answerMap[id] || 3
      if (reverse.includes(id)) val = 6 - val
      raw += val
    })
    return Math.round(((raw - items.length) / (items.length * 4)) * 100)
  }
  
  // 4. 响应风格校正
  const correctedScores = diversityEngine.applyResponseStyleCorrection(rawScores, responseStyle)
}
```

### 2.4 计算器依赖关系图

```
┌─────────────────────────────────────────────────────────────┐
│                    CalculatorEngine                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 1. validateAnswers() - 验证答案数组                     │ │
│  │ 2. executeCalculator() - 执行对应计算器                 │ │
│  │ 3. fallbackCalculate() - 降级计算                       │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────────────┐
│ 专业计算器     │ │ 标准计算器     │ │ 专业计算器工厂         │
│ professional/ │ │ 根目录 calculators/ │ │ professionalCalculators/ │
└───────────────┘ └───────────────┘ └───────────────────────┘
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────────────┐
│ - mbti/        │ │ - sbti-calc   │ │ - CalculatorFactory   │
│ - bigfive/     │ │ - ocean-calc  │ │ - BaseCalculator      │
│ - ecr/         │ │ - eq-calc     │ │ - 专业计算器注册      │
│ - disc/        │ │ - iq-calc     │ │                       │
│ - holland/     │ │ - ...         │ │                       │
│ - ...          │ │               │ │                       │
└───────────────┘ └───────────────┘ └───────────────────────┘
```

---

## 3. 状态管理分析

### 3.1 Store 模块结构

**文件**: `src/store/`

#### 3.1.1 Store 模块列表

| 模块 | 文件 | 职责 | 数据类型 |
|:-----|:-----|:-----|:---------|
| user | user/userStore.ts | 用户信息管理 | UserProfile |
| assessment | assessment/assessmentStore.ts | 测评进度管理 | AssessmentRecord |
| achievement | achievement/achievementStore.ts | 成就系统 | Achievement |
| mood | mood/moodStore.ts | 心情记录 | MoodRecord |
| training | training/trainingStore.ts | 训练记录 | TrainingRecord |
| settings | settings/settingsStore.ts | 用户设置 | UserSettings |

#### 3.1.2 统一 Store (index.ts)

**核心状态**:

```typescript
interface AppStore {
  // 用户模块
  user: UserProfile | null
  setUser: (user: UserProfile) => void
  updateUserName: (name: string) => void
  updateUserProfile: (updates: Partial<UserProfile>) => void
  
  // 测评模块
  currentAssessmentId: string | null
  currentAnswers: Answer[]
  completedAssessments: CompletedAssessment[]
  records: AssessmentRecord[]
  
  // 成就模块
  achievements: Achievement[]
  
  // 心情模块
  moodHistory: MoodRecord[]
  
  // 训练模块
  trainingRecords: TrainingRecord[]
  
  // UI状态
  theme: 'dark' | 'light'
  isLoading: boolean
}
```

### 3.2 Store 持久化策略

**存储键**: `human-os-unified`

**存储内容**:
- 用户信息
- 完成记录
- 成就进度
- 心情历史
- 训练记录
- UI偏好设置

### 3.3 Store 依赖关系

```
┌──────────────────────────────────────────────────────┐
│                   AppStore (Zustand)                  │
│  ┌────────────────────────────────────────────────┐  │
│  │ persist middleware (localStorage)                │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┬───────────────┐
    ▼               ▼               ▼               ▼
┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ User    │   │Assessment │   │Achievement│   │  Mood    │
│ Store   │   │ Store    │   │ Store    │   │ Store    │
└─────────┘   └──────────┘   └──────────┘   └──────────┘
    │               │               │               │
    ▼               ▼               ▼               ▼
UserProfile   AssessmentRecord   Achievement    MoodRecord
```

---

## 4. API 调用结构

### 4.1 API 模块结构

**文件**: `src/api/`

#### 4.1.1 API 模块列表

| 模块 | 文件 | 功能 |
|:-----|:-----|:-----|
| base/client | base/client.ts | 基础HTTP客户端 |
| user | modules/user.ts | 用户API |
| assessment | modules/assessment.ts | 测评API |
| achievement | modules/achievement.ts | 成就API |
| mood | modules/mood.ts | 心情API |
| training | modules/training.ts | 训练API |
| settings | modules/settings.ts | 设置API |

### 4.2 基础客户端

**文件**: `src/api/base/client.ts`

**核心功能**:
- 统一HTTP请求处理
- 请求/响应拦截器
- 错误处理
- Token管理

**方法**:

```typescript
interface ApiClient {
  get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>>
  post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
  put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
  patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
  delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>>
  setAuthToken(token: string): void
  removeAuthToken(): void
}
```

### 4.3 API 模块定义

#### 4.3.1 用户 API (userApi)

```typescript
interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

const userApi = {
  getCurrent(): Promise<ApiResponse<User>>
  getById(id: string): Promise<ApiResponse<User>>
  create(data: CreateUserRequest): Promise<ApiResponse<User>>
  update(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>>
  delete(id: string): Promise<ApiResponse<void>>
}
```

#### 4.3.2 测评 API (assessmentApi)

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

const assessmentApi = {
  list(): Promise<ApiResponse<PaginatedResponse<Assessment>>>
  getById(id: string): Promise<ApiResponse<Assessment>>
  submit(id: string, answers: Answer[]): Promise<ApiResponse<Submission>>
  getResult(id: string): Promise<ApiResponse<AssessmentResult>>
}
```

### 4.4 API 类型定义

```typescript
interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  code?: number
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface ApiError {
  code: number
  message: string
  details?: any
}
```

---

## 5. 需要迁移到后端的业务逻辑

### 5.1 业务逻辑优先级分类

#### 5.1.1 高优先级 (必须迁移)

| 序号 | 业务逻辑 | 当前位置 | 说明 |
|:-----|:---------|:---------|:-----|
| 1 | 测评计算引擎 | CalculatorEngine.ts | 核心计算逻辑，需迁移到后端确保一致性 |
| 2 | SBTI/MBTI 计算 | sbti-calculator.ts | 成熟算法，稳定可迁移 |
| 3 | OCEAN 大五计算 | ocean-calculator.ts | 包含复杂校正逻辑，需精确迁移 |
| 4 | 测评数据存储 | data/assessments/ | 所有测评题目和元数据 |
| 5 | 用户认证 | store/userStore.ts | JWT 认证逻辑 |

#### 5.1.2 中优先级 (建议迁移)

| 序号 | 业务逻辑 | 当前位置 | 说明 |
|:-----|:---------|:---------|:-----|
| 1 | 成就系统 | store/achievementStore.ts | 逻辑简单，但需同步 |
| 2 | 心情记录 | store/moodStore.ts | 时序数据，后端更合适 |
| 3 | 训练记录 | store/trainingStore.ts | 用户数据，应持久化 |
| 4 | 抑郁 SDS 计算 | sds-calculator.ts | 临床量表，需准确性 |
| 5 | 焦虑 SAS 计算 | sas-calculator.ts | 临床量表，需准确性 |
| 6 | IQ 智力计算 | iq-calculator.ts | 复杂计算逻辑 |

#### 5.1.3 低优先级 (可选迁移)

| 序号 | 业务逻辑 | 当前位置 | 说明 |
|:-----|:---------|:---------|:-----|
| 1 | 趣味测评计算 | entertainment/ | 娱乐性强，可保持前端 |
| 2 | 知识库数据 | knowledge-base/ | 静态数据，可缓存在前端 |
| 3 | 设置偏好 | store/settingsStore.ts | 简单键值对，前端存储足够 |

### 5.2 迁移影响评估

#### 5.2.1 架构影响

```
当前架构 (单页应用):
┌─────────────────────────────────────┐
│           Frontend (React)           │
│  ┌─────────────────────────────────┐ │
│  │ Data Layer (静态数据)           │ │
│  │ - 测评数据                      │ │
│  │ - 计算器                        │ │
│  │ - 知识库                        │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ Business Logic                 │ │
│  │ - 测评计算                      │ │
│  │ - 结果生成                      │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ Storage (localStorage)          │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘

目标架构 (前后端分离):
┌─────────────────────────────────────┐
│         Frontend (React)              │
│  ┌─────────────────────────────────┐ │
│  │ View Layer (UI)                 │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ State Management                │ │
│  │ - UI State                      │ │
│  │ - Cache (IndexedDB)             │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
                    │
                    │ API Calls
                    ▼
┌─────────────────────────────────────┐
│         Backend (Python/FastAPI)     │
│  ┌─────────────────────────────────┐ │
│  │ Data Layer                      │ │
│  │ - 测评数据                      │ │
│  │ - 知识库                        │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ Business Logic                  │ │
│  │ - 测评计算                      │ │
│  │ - 业务验证                      │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ Database (SQLite/PostgreSQL)    │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### 5.2.2 风险评估

| 风险项 | 影响程度 | 可能性 | 缓解措施 |
|:-------|:---------|:-------|:---------|
| 计算器算法迁移不一致 | 高 | 中 | 保留前端fallback，全面测试 |
| 数据格式转换错误 | 中 | 中 | 设计迁移脚本，验证数据完整性 |
| 后端性能瓶颈 | 中 | 低 | 异步处理，缓存策略 |
| 离线功能降级 | 中 | 低 | IndexedDB本地缓存 |
| 用户体验影响 | 低 | 低 | 渐进迁移，保持UI不变 |

---

## 6. 数据迁移清单

### 6.1 需要迁移的数据文件

#### 6.1.1 测评数据 (优先级: 高)

- `src/data/assessments/*.ts` (45个文件)
- `src/data/professional/*/` (60+个文件)
- `src/data/entertainment/*/` (30+个文件)
- `src/data/political-ideology/*.ts` (15个文件)

#### 6.1.2 知识库数据 (优先级: 中)

- `src/data/knowledge-base/theories/*.ts`
- `src/data/knowledge-base/guides/*.ts`

### 6.2 需要迁移的计算器

#### 6.2.1 专业计算器 (优先级: 高)

- `src/utils/calculators/sbti-calculator.ts`
- `src/utils/calculators/ocean-calculator.ts`
- `src/utils/calculators/eq-calculator.ts`
- `src/utils/calculators/ecr-calculator.ts`
- `src/utils/calculators/scl90-calculator.ts`
- `src/utils/calculators/sds-calculator.ts`
- `src/utils/calculators/sas-calculator.ts`
- `src/utils/calculators/pss10-calculator.ts`
- `src/utils/calculators/iq-calculator.ts`

#### 6.2.2 标准计算器 (优先级: 中)

- `src/utils/calculators/professional-calculators-factory.ts`
- `src/utils/calculators/professional/*/` (10+个文件)

---

## 7. 附录

### 7.1 文件统计

| 分类 | 文件数 | 总行数 | 平均行数/文件 |
|:-----|:-------|:-------|:--------------|
| 数据文件 | 150+ | 15000+ | 100 |
| 计算器 | 30+ | 5000+ | 170 |
| Store模块 | 6 | 500+ | 85 |
| API模块 | 6 | 300+ | 50 |
| **总计** | **200+** | **21000+** | **105** |

### 7.2 技术栈

**前端**:
- React 18
- TypeScript 5
- Zustand (状态管理)
- React Router 6

**后端 (目标)**:
- Python 3.11
- FastAPI
- SQLAlchemy
- Pydantic

### 7.3 参考文档

- 重构计划: `docs/superpowers/plans/2026-05-21-full-stack-refactor.md`
- API文档: `docs/API.md`
- 架构文档: `docs/ARCHITECTURE.md`

---

**文档创建**: 2026-05-21
**状态**: ✅ 完成
