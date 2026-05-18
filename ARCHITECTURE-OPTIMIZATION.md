# MindMirror 架构优化与迁移方案

## 📋 文档信息

- **项目**: MindMirror 心镜
- **版本**: v3.0.0
- **日期**: 2026-05-18
- **目标**: 完成遗留页面迁移 + 架构解耦优化

---

## 🎯 当前问题分析

### 1️⃣ 遗留页面迁移状态

**尚未迁移的页面**（`/src/pages/`）：

| 页面 | 功能 | 迁移优先级 | 备注 |
|:-----|:-----|:----------:|:-----|
| ModeSelect | 测评模式选择 | 🔴 高 | 核心功能 |
| AssessmentConfirm | 测评确认 | 🔴 高 | 核心功能 |
| Assessment | 测评进行 | 🔴 高 | 核心功能 |
| Loading | 测评加载 | 🔴 高 | 核心功能 |
| Results | 结果展示 | 🔴 高 | 核心功能 |
| Dashboard | 仪表盘 | 🟡 中 | 可选 |
| About | 关于页面 | 🟡 中 | 可选 |
| Profile | 个人中心 | 🟡 中 | 基础功能 |
| Leaderboard | 排行榜 | 🟢 低 | 增值功能 |
| SoulMatch | 灵魂匹配 | 🟢 低 | 增值功能 |
| TheoryDetail | 理论详情 | 🟢 低 | 知识库 |
| OnePieceModeSelect | 海贼王测评 | 🟢 低 | 娱乐向 |
| ThemeAnalysisDemo | 主题分析演示 | 🟢 低 | 演示功能 |
| ChartShowcase | 图表展示 | 🟢 低 | 演示功能 |
| QuestionOptimizer | 题目优化器 | 🟢 低 | 工具 |
| PhilosophyHistoryPage | 哲学历史 | 🟢 低 | 知识库 |
| PsychologyHistoryPage | 心理学历史 | 🟢 低 | 知识库 |
| IdeologyHistoryPage | 意识形态历史 | 🟢 低 | 知识库 |
| IsmsPage | 流派页面 | 🟢 低 | 知识库 |
| PlatformStoryPage | 平台故事 | 🟢 低 | 内容页 |
| NotFound | 404页面 | ✅ 已迁移 | - |

**统计**：
- 总遗留页面：20个
- 核心功能页面：5个（需优先迁移）
- 可选功能：15个

---

### 2️⃣ 架构耦合问题

#### 🔴 严重耦合

**1. Store 单体问题**
```typescript
// src/store/index.ts - 500+ 行单体 Store
interface AppStore {
  // 用户、测评、成就、收藏、心情、训练... 全部混在一起
  user: UserProfile | null
  currentAssessmentId: string | null
  achievements: Achievement[]
  moodHistory: MoodRecord[]
  trainingRecords: TrainingRecord[]
  // ... 更多功能
}
```

**问题**：
- 单一 Store 包含 20+ 个功能模块
- 难以独立测试和维护
- 状态变更影响范围不明确
- 新增功能必须修改核心 Store

**2. 组件直接依赖 Store**
```typescript
// 组件直接订阅整个 Store
const theme = useAppStore((state) => state.theme)
const user = useAppStore((state) => state.user)
const achievements = useAppStore((state) => state.achievements)
// 组件与 Store 强耦合
```

**3. 页面组件与旧架构耦合**
```typescript
// src/App.tsx - 同时管理两套路由
<Route path="/app/*" element={<NewLayout />}>
  {/* 新架构页面 */}
</Route>
<Route path="/legacy/*" element={<LegacyLayout />}>
  {/* 遗留页面 */}
</Route>
```

#### 🟡 中度耦合

**4. 测评系统复杂度**
```
src/data/
├── assessments/          # 43+ 测评定义
├── professional/        # 专业版数据
├── entertainment/       # 娱乐向数据
└── political-ideology/  # 政治意识形态

src/utils/calculators/
├── CalculatorEngine.ts   # 统一计算引擎
├── *.ts                 # 各类计算器
└── professional/
```

**问题**：
- 测评数据与计算逻辑耦合
- 报告组件依赖特定计算器
- 难以添加新的测评类型

**5. 组件库层级混乱**
```
src/components/
├── animations/          # 动画组件
├── charts/             # 图表组件
├── reports/            # 报告组件
├── ui/                 # UI 基础组件
├── AnswerSheet.tsx      # 测评答题卡
├── AssessmentCard3D.tsx # 测评卡片
├── GlobalMenu.tsx       # 全局菜单
└── ...                 # 其他业务组件
```

**问题**：
- 基础组件与业务组件混在一起
- 难以区分可复用性
- 组件职责不清晰

---

## 🏗️ 架构优化方案

### 📌 核心原则

1. **单向依赖**: 上层依赖下层，下层不依赖上层
2. **接口隔离**: 通过接口/类型解耦具体实现
3. **领域驱动**: 按业务领域划分模块边界
4. **独立可测**: 每个模块可独立测试和部署

---

### 🎯 方案一：渐进式模块化（推荐）

#### 阶段一：Store 模块化拆分

**目标**：将单体 Store 拆分为领域 Store

```
src/store/
├── index.ts              # 统一导出 + 兼容层
├── user/                 # 用户模块
│   ├── index.ts
│   ├── userStore.ts
│   ├── types.ts
│   └── selectors.ts
├── assessment/           # 测评模块
│   ├── index.ts
│   ├── assessmentStore.ts
│   ├── types.ts
│   └── selectors.ts
├── achievement/          # 成就模块
│   ├── index.ts
│   ├── achievementStore.ts
│   └── types.ts
├── training/            # 训练模块
│   ├── index.ts
│   ├── trainingStore.ts
│   └── types.ts
├── mood/               # 心情追踪模块
│   ├── index.ts
│   ├── moodStore.ts
│   └── types.ts
└── settings/           # 设置模块
    ├── index.ts
    ├── settingsStore.ts
    └── types.ts
```

**Store 模块化示例**：

```typescript
// src/store/user/userStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  user: UserProfile | null
  isLoading: boolean
  setUser: (user: UserProfile) => void
  updateUser: (updates: Partial<UserProfile>) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      clearUser: () => set({ user: null }),
    }),
    { name: 'user-storage' }
  )
)

// src/store/user/selectors.ts
export const selectUser = (state: UserState) => state.user
export const selectIsLoggedIn = (state: UserState) => state.user !== null

// src/store/index.ts - 统一导出
export { useUserStore } from './user/userStore'
export { useAssessmentStore } from './assessment/assessmentStore'
export { useAchievementStore } from './achievement/achievementStore'
export { useTrainingStore } from './training/trainingStore'
export { useMoodStore } from './mood/moodStore'
export { useSettingsStore } from './settings/settingsStore'

// 兼容层（向后兼容）
import { useUserStore, useAssessmentStore } from './index'

export const useAppStore = {
  // 组合多个 store 的选择器
  getState: () => ({
    user: useUserStore.getState(),
    // ...
  })
}
```

#### 阶段二：测评系统模块化

**目标**：测评数据、计算逻辑、报告展示解耦

```
src/features/
├── assessments/
│   ├── domain/           # 领域层
│   │   ├── entities/     # 测评实体
│   │   │   ├── Assessment.ts
│   │   │   ├── Question.ts
│   │   │   └── Result.ts
│   │   ├── repositories/ # 数据仓库接口
│   │   │   └── AssessmentRepository.ts
│   │   └── services/     # 领域服务
│   │       └── AssessmentService.ts
│   ├── data/            # 数据层
│   │   ├── repositories/ # 数据仓库实现
│   │   │   └── AssessmentRepositoryImpl.ts
│   │   ├── datasources/  # 数据源
│   │   │   ├── standardAssessments.ts
│   │   │   ├── professionalAssessments.ts
│   │   │   └── entertainmentAssessments.ts
│   │   └── mappers/     # 数据映射
│   │       └── AssessmentMapper.ts
│   ├── application/     # 应用层
│   │   ├── usecases/    # 用例
│   │   │   ├── StartAssessmentUseCase.ts
│   │   │   ├── SubmitAnswerUseCase.ts
│   │   │   └── GetResultUseCase.ts
│   │   └── dto/         # 数据传输对象
│   │       ├── AssessmentDTO.ts
│   │       └── ResultDTO.ts
│   └── presentation/    # 展示层
│       ├── components/  # 测评组件
│       │   ├── AssessmentCard.tsx
│       │   ├── QuestionRenderer.tsx
│       │   └── ProgressIndicator.tsx
│       ├── pages/       # 测评页面
│       │   ├── ModeSelectPage.tsx
│       │   ├── AssessmentPage.tsx
│       │   └── ResultsPage.tsx
│       └── hooks/       # 测评 Hooks
│           ├── useAssessment.ts
│           └── useTimer.ts
```

#### 阶段三：组件库重构

**目标**：清晰的分层架构

```
src/components/
├── foundation/          # 基础组件（无业务依赖）
│   ├── ui/              # 通用 UI
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   ├── Card/
│   │   ├── Input/
│   │   └── ...
│   ├── layout/          # 布局组件
│   │   ├── Container/
│   │   ├── Grid/
│   │   └── ...
│   └── animations/      # 动画组件
│       ├── FadeIn/
│       ├── SlideIn/
│       └── ...
├── domain/             # 领域组件（业务无关）
│   ├── charts/          # 图表组件
│   │   ├── BarChart/
│   │   ├── RadarChart/
│   │   └── ...
│   └── data-display/    # 数据展示
│       ├── StatCard/
│       └── ...
├── features/           # 功能组件（业务相关）
│   ├── assessment/      # 测评功能
│   │   ├── AssessmentCard.tsx
│   │   ├── AnswerSheet.tsx
│   │   └── ...
│   ├── training/        # 训练功能
│   ├── social/          # 社交功能
│   └── ...
└── layout/             # 布局组件
    ├── AppLayout/
    ├── PageHeader/
    └── ...
```

#### 阶段四：路由重构

**目标**：路由与页面组件解耦

```typescript
// src/routes/routes.ts - 路由配置
export const routes = [
  {
    path: '/app',
    layout: AppLayout,
    children: [
      { path: 'home', component: HomePage },
      { path: 'assessments', component: AssessmentsPage },
      // ...
    ]
  },
  {
    path: '/legacy',
    redirectTo: '/app' // 或使用 LegacyLayout
  }
]

// src/routes/index.ts - 路由组装
import { createBrowserRouter } from 'react-router-dom'
import { routes } from './routes'

export const router = createBrowserRouter(
  routes.map(route => ({
    ...route,
    element: route.layout ? (
      <route.layout>
        <Switch>
          {route.children?.map(child => (
            <Route key={child.path} path={child.path} element={<child.component />} />
          ))}
        </Switch>
      </route.layout>
    ) : undefined
  }))
)
```

---

### 🎯 方案二：Monorepo 微前端架构（长期）

如果项目继续增长，考虑拆分为多个独立包：

```
mindmirror/
├── packages/
│   ├── core/              # 核心库
│   │   ├── calculator-engine/
│   │   ├── assessment-data/
│   │   └── ui-components/
│   ├── features/
│   │   ├── assessment-feature/
│   │   ├── training-feature/
│   │   ├── social-feature/
│   │   └── gamification-feature/
│   └── apps/
│       ├── web/           # 主应用
│       └── admin/         # 管理后台
├── configs/               # 共享配置
├── scripts/               # 构建脚本
└── package.json
```

**工具链**：
- **Turborepo**: 任务编排和缓存
- **Changesets**: 版本管理和发布
- **pnpm workspaces**: 包管理

---

## 📋 实施计划

### 🚀 第一阶段：遗留页面迁移（1-2周）

#### 优先级排序

**P0 - 核心功能（必须迁移）**：
1. ✅ `NotFound` - 已完成
2. 🔄 `ModeSelect` - 进行中
3. 🔄 `AssessmentConfirm` - 待迁移
4. 🔄 `Assessment` - 待迁移
5. 🔄 `Loading` - 待迁移
6. 🔄 `Results` - 待迁移

**P1 - 重要功能（建议迁移）**：
7. `Dashboard` - 仪表盘
8. `Profile` - 个人中心
9. `About` - 关于页面

**P2 - 增值功能（可选迁移）**：
10. 其他 10+ 个页面

#### 迁移步骤

1. **分析页面依赖**
   ```bash
   # 使用工具分析导入关系
   npm run analyze-dependencies
   ```

2. **创建新架构对应页面**
   ```typescript
   // src/app/pages/assessment/
   // ModeSelect.tsx → src/app/pages/assessment/ModeSelectPage.tsx
   ```

3. **迁移路由**
   ```typescript
   // src/App.tsx
   // 旧路由
   <Route path="/legacy/mode-select/:id" component={ModeSelect} />
   
   // 新路由
   <Route path="/app/assessment/:id/select" element={<ModeSelectPage />} />
   ```

4. **移除旧代码**
   ```bash
   # 迁移完成后
   rm src/pages/ModeSelect.tsx
   ```

---

### 🚀 第二阶段：Store 模块化（2-3周）

#### 步骤 1：创建模块目录结构

```bash
mkdir -p src/store/{user,assessment,achievement,training,mood,settings}
```

#### 步骤 2：拆分用户模块

```typescript
// src/store/user/types.ts
export interface UserProfile {
  id: string
  name: string
  avatar: string
  bio: string
  createdAt: number
  assessments: string[]
}

// src/store/user/userStore.ts
export const useUserStore = create<UserState>()(...)
```

#### 步骤 3：创建选择器

```typescript
// src/store/user/selectors.ts
export const selectUser = (state: UserState) => state.user
export const selectIsLoggedIn = (state: UserState) => !!state.user
```

#### 步骤 4：统一导出

```typescript
// src/store/index.ts
export { useUserStore, selectUser, selectIsLoggedIn } from './user'
export { useAssessmentStore } from './assessment'
// ...
```

#### 步骤 5：更新组件引用

```typescript
// 旧代码
const user = useAppStore((state) => state.user)

// 新代码
const user = useUserStore((state) => state.user)
// 或使用选择器
const user = useUserStore(selectUser)
```

---

### 🚀 第三阶段：组件库重构（2-4周）

#### 步骤 1：识别组件类型

```bash
# 分析组件业务依赖
# foundation/ - 无外部依赖
# domain/ - 仅依赖其他 foundation
# features/ - 依赖业务逻辑
```

#### 步骤 2：创建目录结构

```bash
mkdir -p src/components/{foundation/{ui,layout,animations},domain/{charts,data-display},features/{assessment,training,social},layout}
```

#### 步骤 3：迁移组件

```bash
# 移动 UI 组件
mv src/components/ui/* src/components/foundation/ui/

# 移动图表组件
mv src/components/charts/* src/components/domain/charts/
```

#### 步骤 4：创建索引文件

```typescript
// src/components/foundation/ui/index.ts
export { Button } from './Button'
export { Card } from './Card'
// ...
```

---

### 🚀 第四阶段：依赖优化（1-2周）

#### 1. 创建领域边界

```typescript
// src/core/domains/assessment/
// 定义清晰的接口
export interface AssessmentRepository {
  getAssessment(id: string): Promise<Assessment>
  saveResult(result: AssessmentResult): Promise<void>
}

// src/features/assessment/
// 依赖接口而非实现
export class AssessmentService {
  constructor(private repository: AssessmentRepository) {}
}
```

#### 2. 依赖检查脚本

```bash
#!/bin/bash
# scripts/check-dependencies.sh

# 检查是否违反依赖规则
npx madge --circular src/

# 检查未使用的导出
npx depcheck

# 检查类型错误
npm run typecheck
```

#### 3. ESLint 规则

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // 禁止从 features 导入 foundation
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@/features/**', '@/components/features/**']
      }
    ]
  }
}
```

---

## 📊 预期收益

### ✅ 迁移收益

1. **代码质量提升**
   - 消除技术债务
   - 统一代码风格
   - 提高可维护性

2. **开发效率提升**
   - 新功能开发更快
   - Bug 定位更容易
   - 代码复用率提高

3. **团队协作改善**
   - 明确模块边界
   - 减少代码冲突
   - 独立模块可并行开发

### ✅ 架构优化收益

1. **可维护性**
   - 模块独立可测试
   - 状态管理清晰
   - 依赖关系明确

2. **可扩展性**
   - 新功能容易添加
   - 旧功能容易修改
   - 技术升级成本低

3. **性能优化**
   - Tree-shaking 更有效
   - 代码分割更精细
   - 首屏加载更快

---

## 🛠️ 工具和脚本

### 1. 依赖分析

```bash
# 安装依赖分析工具
npm install -D madge depcheck

# 分析循环依赖
npx madge --circular src/

# 分析未使用的依赖
npx depcheck

# 可视化依赖图
npx madge --image graph.svg src/
```

### 2. 迁移脚本

```typescript
// scripts/migrate-page.ts
import { Project } from 'ts-morph'

const project = new Project({
  tsConfigFilePath: './tsconfig.json'
})

// 分析页面依赖
function analyzePage(pagePath: string) {
  const sourceFile = project.getSourceFile(pagePath)
  const imports = sourceFile?.getImportDeclarations()
  
  return {
    imports: imports?.map(i => i.getModuleSpecifier().getText()),
    exports: sourceFile?.getExportedDeclarations()
  }
}

// 迁移页面
async function migratePage(oldPath: string, newPath: string) {
  // 1. 复制文件
  // 2. 更新导入
  // 3. 替换组件引用
  // 4. 移动文件
  // 5. 更新路由
}
```

### 3. 测试脚本

```bash
# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 运行 E2E 测试
npm run test:e2e

# 生成覆盖率报告
npm run test:coverage
```

---

## 📝 验收标准

### 迁移完成标准

- [ ] 所有 P0 页面已迁移到新架构
- [ ] 旧页面代码已删除
- [ ] 路由已更新
- [ ] 功能测试通过
- [ ] 性能无明显下降

### 架构优化标准

- [ ] Store 已模块化拆分
- [ ] 组件库已分层
- [ ] 无循环依赖
- [ ] ESLint 规则通过
- [ ] TypeScript 编译无错误
- [ ] 测试覆盖率 > 70%

---

## 🔄 风险和缓解

### 风险 1：迁移过程中功能损坏

**缓解**：
- 每次迁移后进行完整测试
- 保留旧代码直到新代码稳定
- 使用功能开关控制

### 风险 2：性能下降

**缓解**：
- 使用 React.lazy 进行代码分割
- 监控性能指标
- 及时优化瓶颈

### 风险 3：团队适应困难

**缓解**：
- 提供详细的迁移指南
- 组织代码审查
- 记录最佳实践

---

## 📚 参考资料

- [Zustand 官方文档](https://zustand.docs.pmnd.rs)
- [React 组件设计模式](https://react.dev/learn)
- [领域驱动设计](https://martinfowler.com/tags/domain%20driven%20design.html)
- [微前端架构](https://micro-frontends.org/)

---

## 🎯 下一步行动

### 立即执行

1. ✅ 创建架构优化规范文档（本文档）
2. 🔄 分析遗留页面依赖关系
3. 🔄 制定迁移优先级清单
4. 🔄 开始 P0 页面迁移（ModeSelect）

### 本周计划

- [ ] 完成 ModeSelect 页面迁移
- [ ] 完成 AssessmentConfirm 页面迁移
- [ ] 完成 Assessment 页面迁移
- [ ] 创建 Store 模块化脚手架

### 下周计划

- [ ] 完成 Results 页面迁移
- [ ] 开始 Store 模块化实施
- [ ] 创建组件库分层规范
- [ ] 制定依赖检查流程

---

**文档版本**: v1.0
**创建日期**: 2026-05-18
**最后更新**: 2026-05-18
**负责人**: 架构优化团队
