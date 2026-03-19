# HumanOS - 人类测评平台

[![GitHub Pages](https://img.shields.io/badge/部署-GitHub Pages-blue?style=flat-square)](https://badhope.github.io/humanity)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-blue?style=flat-square)](https://vitejs.dev/)

## 项目简介

HumanOS 是一个专业的心理测评静态网站应用，聚合心理测评、人格测试、认知能力、价值观与职业倾向等多维度人类测评。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **路由**: React Router v6
- **状态管理**: Zustand
- **本地数据库**: Dexie.js (IndexedDB)
- **样式**: Tailwind CSS
- **动画**: Framer Motion + GSAP + Three.js
- **图表**: Recharts + D3.js + Chart.js
- **UI 组件**: Radix UI
- **图标**: Lucide React
- **动画效果**: Lottie React

## 快速开始

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

构建产物在 `dist/` 目录

### 预览构建

```bash
npm run preview
```

## 部署到 GitHub Pages

项目已配置 GitHub Actions，push 到 `main` 分支后自动部署。

部署地址: https://badhope.github.io/humanity/

## 项目结构

```
src/
├── components/       # UI 组件
│   ├── 3d/          # Three.js 3D 背景
│   ├── atoms/       # 基础原子组件
│   ├── charts/      # 图表组件
│   └── molecules/   # 分子组件
├── features/        # 功能模块
│   ├── animation/   # 动画配置
│   ├── assessment/  # 测评引擎
│   ├── storage/     # 数据库
│   └── theme/       # 主题管理
├── pages/           # 页面
├── shared/          # 共享资源
│   ├── constants/   # 常量
│   ├── types/       # 类型定义
│   └── utils/       # 工具函数
├── store/           # Zustand 状态管理
└── styles/          # 全局样式
```

## 页面路由

| 路径 | 页面 |
|------|------|
| `/` | 首页 |
| `/categories` | 测评分类 |
| `/assessments/:category` | 测评列表 |
| `/quiz/:assessmentId` | 答题页面 |
| `/results/:assessmentId` | 结果页面 |
| `/profile` | 个人中心 |

## 功能特性

- ✨ 深色/浅色主题切换
- 🎨 动画强度可调节（支持减少动画模式）
- 📊 多维度测评结果分析
- 📱 响应式设计
- 💾 本地数据存储（保护隐私）
- 🚀 GitHub Pages 自动部署

## License

MIT
