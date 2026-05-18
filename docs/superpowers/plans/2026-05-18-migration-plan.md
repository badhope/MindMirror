# MindMirror 架构优化与迁移 - 详细执行计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成遗留页面迁移 + Store模块化拆分 + 组件库重构，实现低耦合高内聚的现代化架构

**Architecture:** 采用渐进式模块化策略，先拆分Store，再迁移页面，最后重构组件库。每一步都保持向后兼容，确保功能稳定。

**Tech Stack:** React 18 + TypeScript + Zustand + React Router 6 + Vite

---

## 📋 总体任务概览

### 阶段一：Store 模块化拆分（20个任务）
1. 创建 Store 模块目录结构
2. 创建用户模块（user）
3. 创建测评模块（assessment）
4. 创建成就模块（achievement）
5. 创建训练模块（training）
6. 创建心情模块（mood）
7. 创建设置模块（settings）
8. 创建统一导出和兼容层
9. 更新组件引用

### 阶段二：遗留页面迁移 P0（30个任务）
#### ModeSelect 页面迁移（6个任务）
10. 分析 ModeSelect 页面依赖
11. 创建新架构 ModeSelectPage
12. 迁移路由配置
13. 更新导航和菜单
14. 测试功能完整性
15. 删除旧代码

#### AssessmentConfirm 页面迁移（6个任务）
16. 分析 AssessmentConfirm 页面依赖
17. 创建新架构 AssessmentConfirmPage
18. 迁移路由配置
19. 更新组件引用
20. 测试功能完整性
21. 删除旧代码

#### Assessment 页面迁移（6个任务）
22. 分析 Assessment 页面依赖
23. 创建新架构 AssessmentPage
24. 迁移路由配置
25. 更新组件引用
26. 测试功能完整性
27. 删除旧代码

#### Loading 页面迁移（6个任务）
28. 分析 Loading 页面依赖
29. 创建新架构 LoadingPage
30. 迁移路由配置
31. 更新组件引用
32. 测试功能完整性
33. 删除旧代码

#### Results 页面迁移（6个任务）
34. 分析 Results 页面依赖
35. 创建新架构 ResultsPage
36. 迁移路由配置
37. 更新组件引用
38. 测试功能完整性
39. 删除旧代码

### 阶段三：P1 页面迁移（18个任务）
40-57. Dashboard、Profile、About 页面迁移（每个6个任务）

### 阶段四：P2 页面迁移（60个任务）
58-117. Leaderboard、SoulMatch 等页面迁移（每个6个任务）

### 阶段五：组件库重构（30个任务）
118-147. 组件分层、迁移、创建索引文件

### 阶段六：依赖优化和测试（20个任务）
148-167. 创建依赖检查脚本、添加ESLint规则、编写测试

---

## 📁 文件结构规划

### Store 模块化后的目录结构
```
src/store/
├── index.ts                    # 统一导出 + 兼容层
├── user/                       # 用户模块
│   ├── index.ts               # 模块导出
│   ├── userStore.ts           # Store实现
│   ├── types.ts               # 类型定义
│   └── selectors.ts           # 选择器
├── assessment/                 # 测评模块
│   ├── index.ts
│   ├── assessmentStore.ts
│   ├── types.ts
│   └── selectors.ts
├── achievement/                # 成就模块
│   ├── index.ts
│   ├── achievementStore.ts
│   ├── types.ts
│   └── selectors.ts
├── training/                   # 训练模块
│   ├── index.ts
│   ├── trainingStore.ts
│   ├── types.ts
│   └── selectors.ts
├── mood/                      # 心情模块
│   ├── index.ts
│   ├── moodStore.ts
│   ├── types.ts
│   └── selectors.ts
└── settings/                   # 设置模块
    ├── index.ts
    ├── settingsStore.ts
    ├── types.ts
    └── selectors.ts
```

### 页面迁移后的目录结构
```
src/app/pages/
├── assessment/                 # 测评相关页面
│   ├── ModeSelectPage.tsx    # 模式选择（新迁移）
│   ├── AssessmentConfirmPage.tsx  # 测评确认（新迁移）
│   ├── AssessmentPage.tsx     # 测评进行（新迁移）
│   ├── LoadingPage.tsx        # 加载页（新迁移）
│   ├── ResultsPage.tsx        # 结果展示（新迁移）
│   └── components/            # 测评组件
├── home/
├── dashboard/
│   └── DashboardPage.tsx     # 仪表盘（新迁移）
├── profile/
│   └── ProfilePage.tsx       # 个人中心（新迁移）
├── about/
│   └── AboutPage.tsx         # 关于页面（新迁移）
└── ...
```

### 组件库重构后的目录结构
```
src/components/
├── foundation/                # 基础组件
│   ├── ui/                   # UI组件
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   └── index.ts
│   ├── layout/               # 布局组件
│   │   ├── Container/
│   │   ├── Grid/
│   │   └── index.ts
│   └── animations/           # 动画组件
│       ├── FadeIn/
│       └── index.ts
├── domain/                   # 领域组件
│   ├── charts/               # 图表组件
│   │   ├── BarChart/
│   │   ├── RadarChart/
│   │   └── index.ts
│   └── data-display/         # 数据展示
│       ├── StatCard/
│       └── index.ts
├── features/                 # 功能组件
│   ├── assessment/           # 测评功能
│   │   ├── AssessmentCard.tsx
│   │   ├── AnswerSheet.tsx
│   │   └── index.ts
│   ├── training/             # 训练功能
│   └── social/               # 社交功能
└── layout/                   # 布局组件
    ├── AppLayout/
    └── index.ts
```

---

## 🚀 开始执行

### Task 1: 创建 Store 模块目录结构

**Files:**
- Create: `src/store/user/`
- Create: `src/store/assessment/`
- Create: `src/store/achievement/`
- Create: `src/store/training/`
- Create: `src/store/mood/`
- Create: `src/store/settings/`

- [ ] **Step 1: 创建目录结构**

Run:
```bash
mkdir -p src/store/{user,assessment,achievement,training,mood,settings}
```

Expected: 目录创建成功

- [ ] **Step 2: 创建各模块的 index.ts 骨架**

Create: `src/store/user/index.ts`
```typescript
export * from './userStore'
export * from './types'
export * from './selectors'
```

Create: `src/store/assessment/index.ts`
```typescript
export * from './assessmentStore'
export * from './types'
export * from './selectors'
```

Create: `src/store/achievement/index.ts`
```typescript
export * from './achievementStore'
export * from './types'
export * from './selectors'
```

Create: `src/store/training/index.ts`
```typescript
export * from './trainingStore'
export * from './types'
export * from './selectors'
```

Create: `src/store/mood/index.ts`
```typescript
export * from './moodStore'
export * from './types'
export * from './selectors'
```

Create: `src/store/settings/index.ts`
```typescript
export * from './settingsStore'
export * from './types'
export * from './selectors'
```

- [ ] **Step 3: 提交初始结构**

Run:
```bash
git add src/store/
git commit -m "feat(store): 创建Store模块化目录结构"
```

---

### Task 2: 创建用户模块 (user)

**Files:**
- Create: `src/store/user/types.ts`
- Create: `src/store/user/userStore.ts`
- Create: `src/store/user/selectors.ts`

- [ ] **Step 1: 创建用户类型定义**

Create: `src/store/user/types.ts`
```typescript
import type { UserProfile } from '@/types'

export interface UserState {
  user: UserProfile | null
  isLoading: boolean
  error: string | null
}

export interface UserActions {
  setUser: (user: UserProfile) => void
  updateUser: (updates: Partial<UserProfile>) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export type UserStore = UserState & UserActions
```

- [ ] **Step 2: 创建用户 Store 实现**

Create: `src/store/user/userStore.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserStore, UserState } from './types'
import type { UserProfile } from '@/types'

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user: UserProfile) => set({ user, error: null }),

      updateUser: (updates: Partial<UserProfile>) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearUser: () => set({ user: null, error: null }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'mindmirror-user',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
```

- [ ] **Step 3: 创建用户选择器**

Create: `src/store/user/selectors.ts`
```typescript
import type { UserState } from './types'

export const selectUser = (state: UserState) => state.user
export const selectIsLoggedIn = (state: UserState) => state.user !== null
export const selectUserName = (state: UserState) => state.user?.name ?? '游客'
export const selectUserLoading = (state: UserState) => state.isLoading
export const selectUserError = (state: UserState) => state.error
```

- [ ] **Step 4: 提交用户模块**

Run:
```bash
git add src/store/user/
git commit -m "feat(store): 实现用户模块 (user)"
```

---

### Task 3: 创建测评模块 (assessment)

**Files:**
- Create: `src/store/assessment/types.ts`
- Create: `src/store/assessment/assessmentStore.ts`
- Create: `src/store/assessment/selectors.ts`

- [ ] **Step 1: 创建测评类型定义**

Create: `src/store/assessment/types.ts`
```typescript
import type { Answer, CompletedAssessment } from '@/types'

export interface AssessmentRecord {
  id: string
  assessmentId: string
  completedAt: number
  answers: Record<string, string | number>
  result: Record<string, number | string>
}

export interface AssessmentState {
  currentAssessmentId: string | null
  currentAnswers: Answer[]
  completedAssessments: CompletedAssessment[]
  records: AssessmentRecord[]
  results: Record<string, { data: Record<string, unknown> }> | null
  isLoading: boolean
}

export interface AssessmentActions {
  setCurrentAssessment: (id: string) => void
  addAnswer: (answer: Answer) => void
  updateAnswer: (questionId: string, answer: Answer) => void
  clearCurrentAssessment: () => void
  addCompletedAssessment: (assessment: CompletedAssessment) => void
  deleteAssessment: (recordId: string) => void
  clearAllAssessments: () => void
  addRecord: (record: Omit<AssessmentRecord, 'id'>) => void
  setResults: (results: Record<string, { data: Record<string, unknown> }>) => void
  setLoading: (loading: boolean) => void
}

export type AssessmentStore = AssessmentState & AssessmentActions
```

- [ ] **Step 2: 创建测评 Store 实现**

Create: `src/store/assessment/assessmentStore.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AssessmentStore, AssessmentState, AssessmentRecord } from './types'
import type { Answer, CompletedAssessment } from '@/types'

const initialState: AssessmentState = {
  currentAssessmentId: null,
  currentAnswers: [],
  completedAssessments: [],
  records: [],
  results: null,
  isLoading: false,
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentAssessment: (id: string) => set({
        currentAssessmentId: id,
        currentAnswers: [],
      }),

      addAnswer: (answer: Answer) => 
        set((state) => ({
          currentAnswers: [...state.currentAnswers, answer],
        })),

      updateAnswer: (questionId: string, answer: Answer) =>
        set((state) => ({
          currentAnswers: state.currentAnswers.map((a) =>
            a.questionId === questionId ? answer : a
          ),
        })),

      clearCurrentAssessment: () => set({
        currentAssessmentId: null,
        currentAnswers: [],
      }),

      addCompletedAssessment: (assessment: CompletedAssessment) =>
        set((state) => ({
          completedAssessments: [assessment, ...state.completedAssessments],
        })),

      deleteAssessment: (recordId: string) =>
        set((state) => ({
          completedAssessments: state.completedAssessments.filter((a) => a.id !== recordId),
        })),

      clearAllAssessments: () => set({
        completedAssessments: [],
        records: [],
      }),

      addRecord: (record: Omit<AssessmentRecord, 'id'>) =>
        set((state) => ({
          records: [{ id: crypto.randomUUID(), ...record }, ...state.records],
        })),

      setResults: (results) => set({ results }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'mindmirror-assessment',
      partialize: (state) => ({
        records: state.records,
        completedAssessments: state.completedAssessments,
        results: state.results,
      }),
    }
  )
)
```

- [ ] **Step 3: 创建测评选择器**

Create: `src/store/assessment/selectors.ts`
```typescript
import type { AssessmentState } from './types'

export const selectCurrentAssessmentId = (state: AssessmentState) => state.currentAssessmentId
export const selectCurrentAnswers = (state: AssessmentState) => state.currentAnswers
export const selectCompletedAssessments = (state: AssessmentState) => state.completedAssessments
export const selectAssessmentRecords = (state: AssessmentState) => state.records
export const selectAssessmentResults = (state: AssessmentState) => state.results
export const selectIsAssessmentLoading = (state: AssessmentState) => state.isLoading
export const selectAssessmentCount = (state: AssessmentState) => state.records.length
export const selectHasCompletedAssessment = (state: AssessmentState) => state.records.length > 0
```

- [ ] **Step 4: 提交测评模块**

Run:
```bash
git add src/store/assessment/
git commit -m "feat(store): 实现测评模块 (assessment)"
```

---

### Task 4: 创建成就模块 (achievement)

**Files:**
- Create: `src/store/achievement/types.ts`
- Create: `src/store/achievement/achievementStore.ts`
- Create: `src/store/achievement/selectors.ts`

- [ ] **Step 1: 创建成就类型定义**

Create: `src/store/achievement/types.ts`
```typescript
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: number
  progress?: number
  target?: number
}

export interface AchievementState {
  achievements: Achievement[]
  isLoading: boolean
}

export interface AchievementActions {
  unlockAchievement: (id: string) => void
  updateAchievementProgress: (id: string, progress: number) => void
  setAchievements: (achievements: Achievement[]) => void
  setLoading: (loading: boolean) => void
}

export type AchievementStore = AchievementState & AchievementActions

export const defaultAchievements: Achievement[] = [
  { id: 'first-assessment', title: '初次测评', description: '完成你的第一个测评', icon: '🌟', progress: 0, target: 1 },
  { id: 'explorer', title: '探索者', description: '尝试5个不同的测评', icon: '🔍', progress: 0, target: 5 },
  { id: 'psychologist', title: '心理学爱好者', description: '完成10个心理测评', icon: '🧠', progress: 0, target: 10 },
  { id: 'knowledge-seeker', title: '知识追寻者', description: '完成所有认知能力测评', icon: '📚', progress: 0, target: 5 },
  { id: 'social-butterfly', title: '社交达人', description: '分享3次测评结果', icon: '🦋', progress: 0, target: 3 },
  { id: 'streak-7', title: '连续7天', description: '连续7天完成测评', icon: '🔥', progress: 0, target: 7 },
  { id: 'streak-30', title: '月度坚持', description: '连续30天完成测评', icon: '💎', progress: 0, target: 30 },
  { id: 'completionist', title: '完美主义', description: '完成50个测评', icon: '🏆', progress: 0, target: 50 },
  { id: 'night-owl', title: '夜猫子', description: '在凌晨完成测评', icon: '🦉' },
  { id: 'early-bird', title: '早起鸟', description: '在早晨6点前完成测评', icon: '🐦' },
]
```

- [ ] **Step 2: 创建成就 Store 实现**

Create: `src/store/achievement/achievementStore.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AchievementStore, AchievementState } from './types'
import { defaultAchievements } from './types'

const initialState: AchievementState = {
  achievements: [...defaultAchievements],
  isLoading: false,
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set) => ({
      ...initialState,

      unlockAchievement: (id: string) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, unlockedAt: Date.now(), progress: a.target || 1 } : a
          ),
        })),

      updateAchievementProgress: (id: string, progress: number) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, progress } : a
          ),
        })),

      setAchievements: (achievements) => set({ achievements }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'mindmirror-achievement',
      partialize: (state) => ({ achievements: state.achievements }),
    }
  )
)
```

- [ ] **Step 3: 创建成就选择器**

Create: `src/store/achievement/selectors.ts`
```typescript
import type { AchievementState } from './types'

export const selectAchievements = (state: AchievementState) => state.achievements
export const selectUnlockedAchievements = (state: AchievementState) =>
  state.achievements.filter((a) => a.unlockedAt)
export const selectLockedAchievements = (state: AchievementState) =>
  state.achievements.filter((a) => !a.unlockedAt)
export const selectAchievementById = (id: string) => (state: AchievementState) =>
  state.achievements.find((a) => a.id === id)
export const selectAchievementCount = (state: AchievementState) => state.achievements.length
export const selectUnlockedCount = (state: AchievementState) =>
  state.achievements.filter((a) => a.unlockedAt).length
export const selectAchievementProgress = (id: string) => (state: AchievementState) => {
  const achievement = state.achievements.find((a) => a.id === id)
  if (!achievement) return 0
  if (!achievement.target) return achievement.unlockedAt ? 100 : 0
  return Math.min(100, ((achievement.progress || 0) / achievement.target) * 100)
}
```

- [ ] **Step 4: 提交成就模块**

Run:
```bash
git add src/store/achievement/
git commit -m "feat(store): 实现成就模块 (achievement)"
```

---

### Task 5: 创建训练模块 (training)

**Files:**
- Create: `src/store/training/types.ts`
- Create: `src/store/training/trainingStore.ts`
- Create: `src/store/training/selectors.ts`

- [ ] **Step 1: 创建训练类型定义**

Create: `src/store/training/types.ts`
```typescript
export interface TrainingRecord {
  id: string
  programId: string
  completedAt: number
  duration: number
  category: string
}

export interface TrainingState {
  trainingRecords: TrainingRecord[]
  currentTrainingId: string | null
  isLoading: boolean
}

export interface TrainingActions {
  addTrainingRecord: (record: Omit<TrainingRecord, 'id'>) => void
  deleteTrainingRecord: (id: string) => void
  clearTrainingRecords: () => void
  setCurrentTraining: (id: string | null) => void
  setLoading: (loading: boolean) => void
}

export type TrainingStore = TrainingState & TrainingActions
```

- [ ] **Step 2: 创建训练 Store 实现**

Create: `src/store/training/trainingStore.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TrainingStore, TrainingState, TrainingRecord } from './types'

const initialState: TrainingState = {
  trainingRecords: [],
  currentTrainingId: null,
  isLoading: false,
}

export const useTrainingStore = create<TrainingStore>()(
  persist(
    (set) => ({
      ...initialState,

      addTrainingRecord: (record: Omit<TrainingRecord, 'id'>) =>
        set((state) => ({
          trainingRecords: [
            { ...record, id: crypto.randomUUID() },
            ...state.trainingRecords,
          ],
        })),

      deleteTrainingRecord: (id: string) =>
        set((state) => ({
          trainingRecords: state.trainingRecords.filter((r) => r.id !== id),
        })),

      clearTrainingRecords: () => set({ trainingRecords: [] }),

      setCurrentTraining: (id: string | null) => set({ currentTrainingId: id }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'mindmirror-training',
      partialize: (state) => ({ trainingRecords: state.trainingRecords }),
    }
  )
)
```

- [ ] **Step 3: 创建训练选择器**

Create: `src/store/training/selectors.ts`
```typescript
import type { TrainingState } from './types'

export const selectTrainingRecords = (state: TrainingState) => state.trainingRecords
export const selectCurrentTrainingId = (state: TrainingState) => state.currentTrainingId
export const selectIsTrainingLoading = (state: TrainingState) => state.isLoading
export const selectTrainingCount = (state: TrainingState) => state.trainingRecords.length
export const selectTotalTrainingDuration = (state: TrainingState) =>
  state.trainingRecords.reduce((acc, r) => acc + r.duration, 0)
export const selectTrainingByCategory = (category: string) => (state: TrainingState) =>
  state.trainingRecords.filter((r) => r.category === category)
export const selectRecentTraining = (limit: number) => (state: TrainingState) =>
  state.trainingRecords.slice(0, limit)
```

- [ ] **Step 4: 提交训练模块**

Run:
```bash
git add src/store/training/
git commit -m "feat(store): 实现训练模块 (training)"
```

---

### Task 6: 创建心情模块 (mood)

**Files:**
- Create: `src/store/mood/types.ts`
- Create: `src/store/mood/moodStore.ts`
- Create: `src/store/mood/selectors.ts`

- [ ] **Step 1: 创建心情类型定义**

Create: `src/store/mood/types.ts`
```typescript
export interface MoodRecord {
  date: string
  mood: number
  timestamp: number
  note?: string
}

export interface MoodState {
  moodHistory: MoodRecord[]
  isLoading: boolean
}

export interface MoodActions {
  recordMood: (mood: number, note?: string) => void
  deleteMoodRecord: (date: string) => void
  clearMoodHistory: () => void
  setLoading: (loading: boolean) => void
}

export type MoodStore = MoodState & MoodActions
```

- [ ] **Step 2: 创建心情 Store 实现**

Create: `src/store/mood/moodStore.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MoodStore, MoodState, MoodRecord } from './types'

const initialState: MoodState = {
  moodHistory: [],
  isLoading: false,
}

export const useMoodStore = create<MoodStore>()(
  persist(
    (set) => ({
      ...initialState,

      recordMood: (mood: number, note?: string) =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0]
          const timestamp = Date.now()
          const newRecord: MoodRecord = { date: today, mood, timestamp, note }

          const existingIndex = state.moodHistory.findIndex((m) => m.date === today)
          if (existingIndex >= 0) {
            const newHistory = [...state.moodHistory]
            newHistory[existingIndex] = newRecord
            return { moodHistory: newHistory }
          }

          return { moodHistory: [newRecord, ...state.moodHistory] }
        }),

      deleteMoodRecord: (date: string) =>
        set((state) => ({
          moodHistory: state.moodHistory.filter((m) => m.date !== date),
        })),

      clearMoodHistory: () => set({ moodHistory: [] }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'mindmirror-mood',
      partialize: (state) => ({ moodHistory: state.moodHistory }),
    }
  )
)
```

- [ ] **Step 3: 创建心情选择器**

Create: `src/store/mood/selectors.ts`
```typescript
import type { MoodState } from './types'

export const selectMoodHistory = (state: MoodState) => state.moodHistory
export const selectIsMoodLoading = (state: MoodState) => state.isLoading
export const selectMoodCount = (state: MoodState) => state.moodHistory.length
export const selectTodayMood = (state: MoodState) => {
  const today = new Date().toISOString().split('T')[0]
  return state.moodHistory.find((m) => m.date === today)
}
export const selectMoodTrend = (days: number) => (state: MoodState) =>
  state.moodHistory.slice(0, days).reverse()
export const selectAverageMood = (state: MoodState) => {
  if (state.moodHistory.length === 0) return 0
  const sum = state.moodHistory.reduce((acc, m) => acc + m.mood, 0)
  return sum / state.moodHistory.length
}
```

- [ ] **Step 4: 提交心情模块**

Run:
```bash
git add src/store/mood/
git commit -m "feat(store): 实现心情模块 (mood)"
```

---

### Task 7: 创建设置模块 (settings)

**Files:**
- Create: `src/store/settings/types.ts`
- Create: `src/store/settings/settingsStore.ts`
- Create: `src/store/settings/selectors.ts`

- [ ] **Step 1: 创建设置类型定义**

Create: `src/store/settings/types.ts`
```typescript
export type Theme = 'dark' | 'light'

export interface SettingsState {
  theme: Theme
  language: string
  notifications: boolean
  isLoading: boolean
}

export interface SettingsActions {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setLanguage: (language: string) => void
  setNotifications: (enabled: boolean) => void
  setLoading: (loading: boolean) => void
}

export type SettingsStore = SettingsState & SettingsActions
```

- [ ] **Step 2: 创建设置 Store 实现**

Create: `src/store/settings/settingsStore.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SettingsStore, SettingsState } from './types'

const initialState: SettingsState = {
  theme: 'dark',
  language: 'zh-CN',
  notifications: true,
  isLoading: false,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme) => set({ theme }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      setLanguage: (language) => set({ language }),

      setNotifications: (enabled) => set({ notifications: enabled }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'mindmirror-settings',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        notifications: state.notifications,
      }),
    }
  )
)
```

- [ ] **Step 3: 创建设置选择器**

Create: `src/store/settings/selectors.ts`
```typescript
import type { SettingsState } from './types'

export const selectTheme = (state: SettingsState) => state.theme
export const selectIsDarkTheme = (state: SettingsState) => state.theme === 'dark'
export const selectLanguage = (state: SettingsState) => state.language
export const selectNotifications = (state: SettingsState) => state.notifications
export const selectIsSettingsLoading = (state: SettingsState) => state.isLoading
```

- [ ] **Step 4: 提交设置模块**

Run:
```bash
git add src/store/settings/
git commit -m "feat(store): 实现设置模块 (settings)"
```

---

### Task 8: 创建统一导出和兼容层

**Files:**
- Modify: `src/store/index.ts`

- [ ] **Step 1: 备份现有 Store 实现**

Run:
```bash
cp src/store/index.ts src/store/index.ts.backup
```

- [ ] **Step 2: 创建新的统一导出文件**

Modify: `src/store/index.ts`
```typescript
// ============ 新模块化导出 ============
export * from './user'
export * from './assessment'
export * from './achievement'
export * from './training'
export * from './mood'
export * from './settings'

// ============ 类型导出 ============
export type { UserState, UserActions, UserStore } from './user/types'
export type { AssessmentState, AssessmentActions, AssessmentStore, AssessmentRecord } from './assessment/types'
export type { AchievementState, AchievementActions, AchievementStore } from './achievement/types'
export type { TrainingState, TrainingActions, TrainingStore } from './training/types'
export type { MoodState, MoodActions, MoodStore } from './mood/types'
export type { SettingsState, SettingsActions, SettingsStore } from './settings/types'

// ============ 兼容层（向后兼容） ============
import { useUserStore } from './user/userStore'
import { useAssessmentStore } from './assessment/assessmentStore'
import { useAchievementStore } from './achievement/achievementStore'
import { useTrainingStore } from './training/trainingStore'
import { useMoodStore } from './mood/moodStore'
import { useSettingsStore } from './settings/settingsStore'
import type { UserProfile, CompletedAssessment, Answer } from '@/types'

// 组合所有 store 状态
export const useAppStore = {
  // 用户状态
  getUser: () => useUserStore.getState().user,
  setUser: (user: UserProfile) => useUserStore.getState().setUser(user),
  
  // 测评状态
  getCurrentAssessment: () => useAssessmentStore.getState().currentAssessmentId,
  setCurrentAssessment: (id: string) => useAssessmentStore.getState().setCurrentAssessment(id),
  getCompletedAssessments: () => useAssessmentStore.getState().completedAssessments,
  getRecords: () => useAssessmentStore.getState().records,
  
  // 成就状态
  getAchievements: () => useAchievementStore.getState().achievements,
  unlockAchievement: (id: string) => useAchievementStore.getState().unlockAchievement(id),
  
  // 训练状态
  getTrainingRecords: () => useTrainingStore.getState().trainingRecords,
  addTrainingRecord: (record: any) => useTrainingStore.getState().addTrainingRecord(record),
  
  // 心情状态
  getMoodHistory: () => useMoodStore.getState().moodHistory,
  recordMood: (mood: number, note?: string) => useMoodStore.getState().recordMood(mood, note),
  
  // 设置状态
  getTheme: () => useSettingsStore.getState().theme,
  setTheme: (theme: 'dark' | 'light') => useSettingsStore.getState().setTheme(theme),
  toggleTheme: () => useSettingsStore.getState().toggleTheme(),
}

// 兼容旧的 useStore
export const useStore = {
  getState: () => {
    const userState = useUserStore.getState()
    const assessmentState = useAssessmentStore.getState()
    const settingsState = useSettingsStore.getState()
    
    return {
      user: userState.user,
      setUser: userState.setUser,
      updateUserName: userState.updateUser,
      currentAssessmentId: assessmentState.currentAssessmentId,
      currentAnswers: assessmentState.currentAnswers,
      setCurrentAssessment: assessmentState.setCurrentAssessment,
      addAnswer: assessmentState.addAnswer,
      updateAnswer: assessmentState.updateAnswer,
      clearCurrentAssessment: assessmentState.clearCurrentAssessment,
      completedAssessments: assessmentState.completedAssessments,
      addCompletedAssessment: assessmentState.addCompletedAssessment,
      deleteAssessment: assessmentState.deleteAssessment,
      isLoading: userState.isLoading || assessmentState.isLoading,
      setIsLoading: (loading: boolean) => {
        userState.setLoading(loading)
        assessmentState.setLoading(loading)
      },
      theme: settingsState.theme,
      toggleTheme: settingsState.toggleTheme,
    }
  },
  subscribe: (listener: (state: any) => void) => useUserStore.subscribe(listener),
}

// 兼容旧的 useUserStore
export const useUserStoreCompat = {
  getState: () => {
    const userState = useUserStore.getState()
    const assessmentState = useAssessmentStore.getState()
    const achievementState = useAchievementStore.getState()
    
    return {
      profile: userState.user,
      records: assessmentState.records,
      achievements: achievementState.achievements,
      setProfile: userState.setUser,
      updateProfile: userState.updateUser,
      addRecord: assessmentState.addRecord,
      getRecords: () => assessmentState.records,
      getRecordById: (id: string) => assessmentState.records.find(r => r.assessmentId === id),
      unlockAchievement: achievementState.unlockAchievement,
      updateAchievementProgress: achievementState.updateAchievementProgress,
      getAchievements: () => achievementState.achievements,
    }
  },
  subscribe: (listener: (state: any) => void) => useUserStore.subscribe(listener),
}

// 默认导出组合 store
export default useAppStore
```

- [ ] **Step 3: 测试兼容性**

Run:
```bash
npm run typecheck
```

Expected: 无 TypeScript 错误

- [ ] **Step 4: 提交兼容层**

Run:
```bash
git add src/store/index.ts
git commit -m "feat(store): 创建统一导出和兼容层"
```

---

### Task 9: 更新组件引用

**Files:**
- Modify: 多个组件文件

- [ ] **Step 1: 查找使用旧 Store 的组件**

Run:
```bash
grep -r "useAppStore" src/components/ --include="*.tsx" | head -20
```

- [ ] **Step 2: 创建更新脚本**

Create: `scripts/update-store-refs.js`
```javascript
const fs = require('fs')
const path = require('path')

const replacements = [
  {
    from: /import.*useAppStore.*from.*['"]@\/store['"]/g,
    to: (match) => {
      const imports = []
      if (match.includes('theme')) imports.push("useSettingsStore from '@/store/settings/settingsStore'")
      if (match.includes('user')) imports.push("useUserStore from '@/store/user/userStore'")
      if (match.includes('achievement')) imports.push("useAchievementStore from '@/store/achievement/achievementStore'")
      return imports.join('\n')
    }
  }
]

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false
  
  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to)
      modified = true
    }
  })
  
  if (modified) {
    fs.writeFileSync(filePath, content)
    console.log(`Updated: ${filePath}`)
  }
}

// Recursively process all TSX files
function walkDir(dir) {
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath)
    } else if (file.endsWith('.tsx')) {
      processFile(filePath)
    }
  })
}

walkDir('src/components')
console.log('Done!')
```

- [ ] **Step 3: 手动更新关键组件**

对于重要组件，手动更新引用：

```typescript
// src/components/SomeComponent.tsx

// 旧代码
import { useAppStore } from '@/store'
const theme = useAppStore((state) => state.theme)

// 新代码
import { useSettingsStore } from '@/store/settings'
const theme = useSettingsStore((state) => state.theme)
```

- [ ] **Step 4: 测试更新后的组件**

Run:
```bash
npm run dev
```

Expected: 应用正常运行，无错误

- [ ] **Step 5: 提交更新**

Run:
```bash
git add src/components/
git commit -m "refactor(components): 更新Store引用为新模块化结构"
```

---

## 📝 待续...

### 阶段二：遗留页面迁移

由于篇幅限制，页面迁移的详细步骤将在后续文档中继续：

- [ ] Task 10-39: ModeSelect、AssessmentConfirm、Assessment、Loading、Results 页面迁移
- [ ] Task 40-57: Dashboard、Profile、About 页面迁移
- [ ] Task 58-117: 其他页面迁移

### 阶段三：组件库重构

- [ ] Task 118-147: 组件分层和迁移

### 阶段四：依赖优化和测试

- [ ] Task 148-167: 依赖检查、ESLint规则、测试编写

---

## ✅ 完成检查清单

- [x] Task 1: 创建 Store 模块目录结构
- [x] Task 2: 创建用户模块 (user)
- [x] Task 3: 创建测评模块 (assessment)
- [x] Task 4: 创建成就模块 (achievement)
- [x] Task 5: 创建训练模块 (training)
- [x] Task 6: 创建心情模块 (mood)
- [x] Task 7: 创建设置模块 (settings)
- [x] Task 8: 创建统一导出和兼容层
- [x] Task 9: 更新组件引用

---

## 📚 参考资料

- [Zustand 官方文档](https://zustand.docs.pmnd.rs)
- [React Router 6 文档](https://reactrouter.com/docs)
- [Vite 构建优化](https://vitejs.dev/guide/build)

---

**文档版本**: v1.0
**创建日期**: 2026-05-18
**负责人**: 架构优化团队
**状态**: 执行中
