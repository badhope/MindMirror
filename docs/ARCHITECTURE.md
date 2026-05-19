# MindMirror 架构架构文档

> **最后更新**: 2026-05-18
> **当前状态**: 已完成组件库分层、API层抽象

---

## 📋 目录

1. [项目结构概述](#项目结构概述)
2. [组件库分层架构](#组件库分层架构)
3. [API层抽象架构](#api层抽象架构)
4. [Store模块化架构](#store模块化架构)
5. [最佳实践](#最佳实践)

---

## 🏗️ 项目结构概述

```
src/
├── api/                     # ✅ API层抽象
│   ├── base/               # 基础模块
│   │   └── client.ts      # API客户端实现
│   ├── modules/            # 业务模块
│   │   ├── user.ts
│   │   └── assessment.ts
│   ├── types/              # 类型定义
│   │   └── index.ts
│   └── index.ts            # 统一导出
├── components/             # ✅ 组件库分层
│   ├── ui/                 # 基础组件层
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   ├── layout/             # 布局组件层
│   │   ├── PageWrapper.tsx
│   │   ├── ResponsiveContainer.tsx
│   │   └── index.ts
│   ├── animations/         # 动画组件层
│   ├── charts/             # 图表组件层
│   └── ...                # 其他组件
├── store/                 # ✅ Store模块化
│   ├── index.ts
│   ├── user/
│   ├── assessment/
│   └── ...
├── app/                    # 新架构应用
│   ├── pages/
│   └── layout/
├── utils/                  # 工具函数
└── types/                  # 类型定义
```

---

## 🧩 组件库分层架构

### 三层架构模式

```
┌─────────────────────────────────────┐
│  容器组件层 (Containers)             │  ← 有状态、业务逻辑
├─────────────────────────────────────┤
│  业务组件层 (Business)               │  ← 项目特定组件
├─────────────────────────────────────┤
│  基础组件层 (UI)                     │  ← 通用、可复用
└─────────────────────────────────────┘
```

### 各层说明

#### 1. 基础组件层 (`src/components/ui/`)
**职责**: 提供可复用的基础UI元素

**包含**:
- Button - 按钮组件
- Card - 卡片组件
- Input - 输入框组件
- Badge - 徽章组件
- Alert - 警告提示组件
- LoadingState - 加载状态组件
- Skeleton - 骨架屏组件
- Toast - 吐司提示组件
- Tooltip - 工具提示组件

**使用示例**:
```tsx
import { Button, Card, Input } from '@components/ui'

<Card>
  <Input placeholder="输入..." />
  <Button>提交</Button>
</Card>
```

#### 2. 业务组件层
**职责**: 项目特定的业务组件

**已有的业务组件**:
- AnswerSheet - 答题卡
- AssessmentOption - 测评选项
- ReportRenderer - 报告渲染器
- IntegratedAnalysisReport - 综合分析报告

#### 3. 容器组件层
**职责**: 有状态的业务组件，处理数据获取和逻辑

---

## 🔧 API层抽象架构

### 三层API架构

```
┌─────────────────────────────────────┐
│  API调用层 (App)                     │  ← 组件中使用
├─────────────────────────────────────┤
│  业务模块层 (Modules)                │  ← userApi, assessmentApi
├─────────────────────────────────────┤
│  基础客户端层 (Base)                 │  ← ApiClient, 拦截器
└─────────────────────────────────────┘
```

### 基础客户端层 (`src/api/base/`)

**功能**:
- 统一HTTP请求处理
- 请求/响应拦截器
- 错误处理
- Token管理

**ApiClient类**:
```typescript
class ApiClient {
  get<T>(endpoint: string): Promise<ApiResponse<T>>
  post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>
  put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>
  patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>
  delete<T>(endpoint: string): Promise<ApiResponse<T>>
}
```

### 业务模块层 (`src/api/modules/`)

**已创建的模块**:

#### userApi
```typescript
import { userApi } from '@api'

userApi.getCurrent()           // 获取当前用户
userApi.getById(id)           // 通过ID获取用户
userApi.create(data)          // 创建用户
userApi.update(id, data)      // 更新用户
userApi.delete(id)            // 删除用户
```

#### assessmentApi
```typescript
import { assessmentApi } from '@api'

assessmentApi.list()         // 测评列表
assessmentApi.getById(id)    // 获取测评详情
assessmentApi.submit(id, answers)  // 提交测评
assessmentApi.getResult(id)  // 获取测评结果
```

### 使用示例

**在组件中使用**:
```tsx
import { assessmentApi } from '@api'
import { ApiResponse } from '@api/types'

const fetchAssessments = async () => {
  try {
    const response: ApiResponse = await assessmentApi.list()
    if (response.success) {
      // 处理数据
    }
  } catch (error) {
    // 错误处理
  }
}
```

---

## 📦 Store模块化架构

详见 [架构优化方案](../ARCHITECTURE-OPTIMIZATION.md)

---

## ✨ 最佳实践

### 组件开发
1. **优先使用基础组件** - 从 `@components/ui` 导入
2. **保持组件简单** - 单个组件单一职责
3. **TypeScript类型优先** - 完整的类型定义
4. **文档注释** - 使用 JSDoc 注释组件

### API调用
1. **始终使用API层** - 不要直接使用 fetch/axios
2. **错误处理统一** - 在 ApiClient 中处理
3. **类型定义完整** - 提供类型安全
4. **按业务分类** - 新API创建对应的模块文件

### 代码规范
1. **命名统一** - 使用 PascalCase 组件名
2. **导入路径别名** - `@components/`, `@api/`, `@store/`
3. **导出集中** - 使用 index.ts 统一导出

---

## 🚀 后续优化建议

1. **组件文档** - 添加 Storybook 或组件文档
2. **测试** - 添加单元测试和集成测试
3. **性能** - 组件性能优化、懒加载
4. **国际化** - i18n 完善

---

*本文档持续更新，请根据项目进展保持同步。*
