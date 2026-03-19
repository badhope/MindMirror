# Humanity - 人类测评平台

[![GitHub Pages](https://img.shields.io/badge/部署-GitHub Pages-blue?style=flat-square)](https://badhope.github.io/humanity)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-blue?style=flat-square)](https://vitejs.dev/)

---

## 一、项目简介

Humanity 是一个面向人格、心理、认知、价值观与职业倾向探索的静态测评平台。

### 当前版本定位 (v1.0.0)

**版本名称**: MBTI MVP Release

**核心定位**: 本版本以 **MBTI 职业性格测试** 为主要可用模块，提供完整的答题-结果-记录闭环体验。

**版本策略**: 先做单模块完整闭环，再逐步扩展整站。其他测评模块已建立内容储备和结构基础，陆续开放中。

---

## 二、当前开放状态

### ✅ 已完成模块

| 模块 | 题库 | 题数 | 状态 | 说明 |
|------|------|------|------|------|
| MBTI 职业性格测试 | mbti-basic.json | 16题 | 完整可用 | 16型人格分析、四维倾向解读、个性化建议 |

### 📦 内容已储备（接入中）

以下模块已完成内容建设，正在逐步开放结果页和详细报告功能：

| 模块 | 题库 | 题数 | 状态 |
|------|------|------|------|
| 压力指数评估 | stress-check.json | 12题 | 可答题，报告制作中 |
| 心理韧性评估 | resilience-basic.json | 16题 | 可答题，报告制作中 |
| 逻辑思维评估 | logic-lite.json | 10题 | 可答题，报告制作中 |
| 注意力与思维风格 | focus-style.json | 15题 | 可答题，报告制作中 |
| 价值观光谱 | values-spectrum.json | 12题 | 可答题，报告制作中 |
| 霍兰德职业兴趣测试 | holland-basic.json | 18题 | 可答题，报告制作中 |
| 工作方式偏好 | work-style-basic.json | 15题 | 可答题，报告制作中 |

### 🔧 技术架构

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **路由**: React Router v6 (HashRouter)
- **状态管理**: Zustand
- **样式**: Tailwind CSS
- **动画**: Framer Motion + Three.js
- **图表**: Recharts + D3.js + Chart.js
- **图标**: Lucide React
- **部署**: GitHub Pages (静态部署)
- **数据存储**: localStorage (本地)

---

## 三、项目结构

```
src/
├── components/
│   ├── 3d/
│   │   └── ImmersiveBackground.tsx    # Three.js 沉浸式背景
│   ├── atoms/                         # 基础原子组件
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingScreen.tsx
│   │   └── Progress.tsx
│   ├── charts/                        # 图表组件
│   │   ├── BarAnalysisChart.tsx
│   │   ├── DistributionChart.tsx
│   │   └── RadarChartCard.tsx
│   └── molecules/                      # 分子组件
│       ├── AssessmentCard.tsx
│       ├── CategoryCard.tsx
│       └── PageTransition.tsx
├── features/
│   └── assessment/
│       ├── engine.ts                   # 通用测评引擎
│       ├── registry.ts                 # 题库注册与加载
│       └── scoring.ts                  # MBTI 专用评分
├── pages/
│   ├── AssessmentList.tsx              # 测评列表页
│   ├── Categories.tsx                  # 测评分类页
│   ├── Home.tsx                        # 首页
│   ├── Maintenance.tsx                 # 维护中页面
│   ├── NotFound.tsx                    # 404 页面
│   ├── Profile.tsx                     # 个人中心
│   ├── Quiz.tsx                        # 答题页面
│   └── Results.tsx                     # 结果页面 (MBTI)
├── shared/
│   ├── constants/
│   │   └── index.ts                   # 分类常量定义
│   ├── types/
│   │   └── assessment.ts              # 测评类型定义
│   └── utils/
│       └── index.ts
├── store/
│   ├── quizStore.ts                   # 答题状态管理
│   └── settingsStore.ts               # 设置状态管理
├── App.tsx                            # 根组件
└── main.tsx                           # 入口文件

public/
├── assessments/                        # 题库目录
│   ├── registry.json                  # 题库索引注册表
│   ├── personality/
│   │   └── mbti-basic.json            # MBTI 题库
│   ├── psychology/
│   │   ├── stress-check.json          # 压力评估
│   │   └── resilience-basic.json      # 心理韧性
│   ├── cognition/
│   │   ├── logic-lite.json            # 逻辑思维
│   │   └── focus-style.json           # 注意力风格
│   ├── ideology/
│   │   └── values-spectrum.json       # 价值观光谱
│   └── career/
│       ├── holland-basic.json         # 霍兰德职业兴趣
│       └── work-style-basic.json       # 工作方式偏好
└── index.html

.github/
└── workflows/
    └── deploy.yml                     # GitHub Actions 部署配置
```

---

## 四、题库系统说明

### 题库存放位置

所有题库文件位于 `public/assessments/` 目录下，按类别分组。

### registry.json 工作原理

```json
{
  "version": "1.0.0",
  "assessments": [
    {
      "id": "mbti-basic",
      "slug": "mbti-basic",
      "name": "MBTI 职业性格测试",
      "category": "personality",
      "filePath": "assessments/personality/mbti-basic.json",
      "status": "active"
    }
  ]
}
```

题库通过 `filePath` 字段指定 JSON 文件路径，运行时通过 `fetchAssessmentBySlug()` 加载。

### 题库 JSON 结构

每个题库包含以下核心字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| slug | string | URL 友好标识 |
| name | string | 题库名称 |
| category | string | 所属分类 |
| dimensions | array | 测评维度定义 |
| resultProfiles | array | 结果类型配置 |
| questions | array | 题目列表 |
| scoring | object | 评分规则 |

### 新增题库步骤

1. 在 `public/assessments/<category>/` 下创建 `.json` 文件
2. 在 `registry.json` 的 `assessments` 数组中添加索引条目
3. 确保 `filePath` 指向正确的文件路径
4. 题库将自动出现在对应分类的列表中

---

## 五、当前产品结构

### 页面说明

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 平台介绍、开始测评入口 |
| `/categories` | 分类页 | 五大测评分类入口 |
| `/assessments/:category` | 测评列表 | 按分类查看可用测评 |
| `/quiz/:assessmentId` | 答题页 | 进行测评答题 |
| `/results/:assessmentId` | 结果页 | MBTI 完整结果页 |
| `/profile` | 个人中心 | 历史记录、设置 |
| `/maintenance` | 维护页 | 模块维护中提示 |

### 数据存储

- **答题记录**: `localStorage.setItem('quiz_result_' + assessmentId, data)`
- **用户设置**: Zustand store 持久化
- **结果恢复**: 结果页从 localStorage 读取历史答题数据

---

## 六、本地运行与部署

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 `http://localhost:5173`

### 生产构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录

### 预览构建

```bash
npm run preview
```

### 部署到 GitHub Pages

项目已配置 GitHub Actions 自动部署：

1. Push 代码到 `main` 分支
2. Actions 自动触发构建
3. 部署到 `https://badhope.github.io/humanity/`

**注意**: GitHub Pages 使用 HashRouter，base 路径为 `/humanity/`

---

## 七、当前版本已知限制

1. **结果页仅支持 MBTI**: `/results/:assessmentId` 目前仅完整适配 MBTI，其他测评答题完成后显示"测评完成"提示页
2. **本地存储依赖**: 历史记录完全依赖 localStorage，无后端同步
3. **无用户系统**: 当前为纯静态应用，无登录注册功能
4. **无 AI 分析**: 暂无 AI 辅助解读、报告生成、PDF 导出等功能
5. **无数据导出**: 暂无测评结果导出、分享功能

---

## 八、下一步开发建议

### 优先级排序

#### P0 - 必须完善

1. **结果页通用化**: 将 Results.tsx 从 MBTI 专用改为通用测评结果页，支持多维度评分和结果展示
2. **Profile 历史完善**: 实现从 localStorage 读取真实答题历史，替代当前的本地记录读取

#### P1 - 重要功能

3. **非 MBTI 模块结果开放**: 逐一为 stress-check、resilience-basic 等模块接入完整结果页
4. **测评草稿保存**: 实现答题中断时的草稿自动保存与恢复

#### P2 - 体验优化

5. **数据中心/历史页**: 实现完整的测评历史管理、删除、详情查看
6. **设置中心**: 完善主题、语言、字体大小等设置项
7. **答题进度保存**: 防止刷新后答题进度丢失

#### P3 - 高级功能（未来规划）

8. **AI 报告解读**: 接入 AI 生成个性化分析建议
9. **结果分享**: 生成海报、分享链接
10. **PDF 导出**: 生成可下载的测评报告
11. **高级图表**: 维度对比、历史趋势等
12. **用户系统**: 登录注册、数据云同步

---

## 九、继续开发指引

### 如何接入新题库

1. 在 `public/assessments/<category>/` 创建新题库 JSON
2. 参照现有题库格式定义 dimensions、resultProfiles、questions
3. 在 `registry.json` 添加索引
4. 修改 `COMPLETED_MODULES` 数组（在 `AssessmentList.tsx`）将其标记为可访问

### 如何添加新题型

1. 在 `src/shared/types/assessment.ts` 的 `QuestionType` 添加新类型
2. 在 Quiz.tsx 中添加对应的渲染逻辑
3. 在 engine.ts 中添加评分处理

### 如何修改评分逻辑

- MBTI 专用评分: `src/features/assessment/scoring.ts`
- 通用测评引擎: `src/features/assessment/engine.ts`

---

## 版本历史

### v1.0.0 (2026-03-19)

**MBTI MVP Release** - 初始正式版

- ✅ MBTI 职业性格测试完整闭环
- ✅ 测评题库系统初步成型
- ✅ 5 大测评分类建立
- ✅ 8 套题库内容储备完成
- ✅ 答题卡、进度追踪、本地记录基础功能
- ✅ Maintenance 机制建立
- ✅ GitHub Pages 自动部署配置

---

## License

MIT
