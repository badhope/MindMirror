<div align="center">

<!-- Hero banner -->
<img src="https://raw.githubusercontent.com/badhope/MindMirror/master/public/docs/hero-banner.jpg" alt="MindMirror" width="100%" style="max-width: 980px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,.08); margin: 0 auto 2rem;" />

# 🧠 MindMirror

**开源 · 自托管 · 隐私优先的心理测评平台**

> *发现自我，每天成长。*

---

**🌐 语言:** [English](README.md) · [简体中文](README.zh-CN.md)

---

<!-- 徽章 -->
[![License: MIT](https://img.shields.io/badge/license-MIT-6DD58C?style=for-the-badge)](LICENSE)
[![Stars](https://img.shields.io/github/stars/badhope/MindMirror?style=for-the-badge&color=FF6B6B)](https://github.com/badhope/MindMirror/stargazers)
[![Forks](https://img.shields.io/github/forks/badhope/MindMirror?style=for-the-badge&color=4ECDC4)](https://github.com/badhope/MindMirror/network/members)
[![Last commit](https://img.shields.io/github/last-commit/badhope/MindMirror?style=for-the-badge)](https://github.com/badhope/MindMirror/commits/master)
[![Top language](https://img.shields.io/github/languages/top/badhope/MindMirror?style=for-the-badge&color=3178C6)](https://github.com/badhope/MindMirror)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=for-the-badge)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white&style=for-the-badge)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white&style=for-the-badge)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white&style=for-the-badge)](https://www.docker.com/)

[**🌐 线上演示**](https://badhope.github.io/MindMirror/) ·
[**📖 快速开始**](#-快速开始) ·
[**🐳 Docker 部署**](#-部署选项) ·
[**📚 API 文档**](#-api-速查) ·
[**🤝 贡献指南**](CONTRIBUTING.md)

</div>

---

## ✨ 为什么选择 MindMirror？

- **🔒 隐私优先** — 数据保存在 *你的* 数据库里，永不进入第三方云。
- **🧪 科学量表** — 大五人格 (IPIP / NEO-PI-R)、PSS-10、GAD-7，均有规范引用。
- **🌐 完整双语** — 英文与简体中文，顶部一键切换。
- **📦 双模式** — 完整 FastAPI + PostgreSQL 后端 **或** 零后端离线 demo（`localStorage`），可部署到任何静态托管（含 GitHub Pages）。
- **🧩 插件系统** — 通过 JSON 加载自定义测评。
- **📱 PWA 就绪** — 可安装、移动优先、离线友好。
- **🐳 一键部署** — `docker compose up` 启动整个技术栈。
- **🎨 精致体验** — Framer Motion 动画、暗黑模式感知、无障碍。
- **💯 MIT 协议** — 可自由使用、修改、再分发。

---

## 📋 目录

- [✨ 为什么选择 MindMirror？](#-为什么选择-mindmirror)
- [🖼️ 截图](#-截图)
- [🚀 快速开始](#-快速开始)
- [🏗️ 架构](#-架构)
- [🛠️ 技术栈](#-技术栈)
- [📁 项目结构](#-项目结构)
- [🔌 API 速查](#-api-速查)
- [🌐 部署选项](#-部署选项)
- [🧪 测评介绍](#-测评介绍)
- [🌍 国际化](#-国际化)
- [🤝 贡献指南](#-贡献指南)
- [🔒 安全](#-安全)
- [📄 协议与引用](#-协议与引用)
- [🙏 致谢](#-致谢)

---

## 🖼️ 截图

> 打开 **[线上演示](https://badhope.github.io/MindMirror/)** 查看真实可交互的 UI —— 同样的代码也驱动自托管部署。

| 首页 | 测评中心 |
|:---:|:---:|
| 主视觉 | 全部内置量表目录 |

| 大五人格结果 | 心情追踪 |
|:---:|:---:|
| 雷达图与特质解读 | 每日记录 + 趋势图 |

（截图来自最新线上构建，源文件见 `public/docs/`。）

---

## 🚀 快速开始

### 方式一：本地开发（热更新）

```bash
git clone https://github.com/badhope/MindMirror.git
cd MindMirror

# 1) 前端
npm install
npm run dev          # http://localhost:5173（Vite 自带 /api 代理）

# 2) 后端（另开一个终端）
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# 无 Postgres 时，编辑 .env：
#   DATABASE_URL=sqlite:///./mental_health.db
#   SECRET_KEY=dev-secret-key-replace-in-production
python3 init_db.py --seed   # 建表 + 演示账号 demo@mindmirror.app / demo123
python3 run.py              # http://localhost:8000（FastAPI）
```

### 方式二：Docker 部署（生产）

```bash
git clone https://github.com/badhope/MindMirror.git
cd MindMirror

cp .env.example .env
# 编辑 .env 设置一个强随机 SECRET_KEY（用于签名 JWT）：
#   openssl rand -base64 64

docker compose up -d --build
```

启动后三个容器共用端口 `80`：

| 服务         | 宿主机端口 | 用途                                                       |
|--------------|-----------|------------------------------------------------------------|
| `frontend`   | **80**    | nginx → React SPA，反向代理 `/api/*` 到后端                |
| `backend`    | —         | FastAPI（8000，仅 Docker 内网）                            |
| `postgres`   | —         | PostgreSQL 15（仅 Docker 内网）                            |

验证：

```bash
curl http://localhost/health            # nginx
curl http://localhost/api/v1/health     # FastAPI
open http://localhost                   # UI
open http://localhost/api/v1/docs       # Swagger UI
```

### 方式三：只看不部署

打开 **[GitHub Pages 演示](https://badhope.github.io/MindMirror/)**，应用会自动
检测到后端不可用，并切换到隐私友好的**本地模式**，所有数据（账号、结果、心情）
都保存在你浏览器的 `localStorage` 中。

---

## 🏗️ 架构

```
                    ┌────────────────────────────────────┐
                    │        浏览器 / PWA                 │
                    │  React 18 · TypeScript · Vite 6    │
                    │  Zustand · Framer Motion · i18n    │
                    └──────────┬─────────────────────────┘
                               │ HTTPS
                               ▼
                    ┌────────────────────────────────────┐
                    │   nginx (端口 80) — 唯一入口       │
                    │   - 静态资源 /assets 缓存 1y       │
                    │   - 反代 /api/*                    │
                    │   - SPA fallback → index.html      │
                    └────────────────────────────────────┘
                               │
                               ▼
                    ┌────────────────────────────────────┐
                    │   FastAPI (端口 8000，内网)        │
                    │   /auth  /assessments  /results    │
                    │   /training  /mood  /achievements  │
                    │   JWT (HS256) + bcrypt             │
                    └──────────┬─────────────────────────┘
                               │
                               ▼
                    ┌────────────────────────────────────┐
                    │       PostgreSQL 15                │
                    │   （数据卷持久化，内网）            │
                    └────────────────────────────────────┘

        GitHub Pages 展示部署（无后端）：
        ┌──────────────────────────────────────────────┐
        │ badhope.github.io/MindMirror/  → localStorage│
        └──────────────────────────────────────────────┘
```

---

## 🛠️ 技术栈

| 层级           | 选型                                                            | 理由                              |
|----------------|-----------------------------------------------------------------|-----------------------------------|
| **前端**       | React 18 + TypeScript 5.8 + Vite 6                              | 最佳 DX、快速 HMR、类型安全        |
| **状态**       | Zustand 5                                                       | 极简、零样板、可持久化             |
| **样式**       | Tailwind 3 + Framer Motion 12                                   | 原子化 CSS + 流畅动画              |
| **路由**       | React Router v7（BrowserRouter + `basename`）                   | 任意子路径下都是干净 URL          |
| **i18n**       | 手写 EN / ZH 字典                                               | 零依赖、完全可控                   |
| **后端**       | Python 3.12 + FastAPI 0.115 + Pydantic v2                       | 异步、极速、类型安全、自动文档     |
| **ORM**        | SQLAlchemy 2                                                    | 跨方言（PG / SQLite），含 JSONB 兼容层 |
| **认证**       | JWT (HS256) via `python-jose` + `bcrypt`                        | 简单、无外部 IdP                   |
| **数据库**     | PostgreSQL 15（Docker）/ SQLite（开发兜底）                      | 久经考验，SQLite 单文件兜底        |
| **容器**       | Docker + Compose，多阶段构建                                    | 一条命令部署                       |
| **CI / CD**    | GitHub Actions（typecheck + lint + Pages）                      | 开源免费、零配置                   |

---

## 📁 项目结构

```
MindMirror/
├── src/                              # React + TypeScript 前端
│   ├── components/                   # UI 组件（Sidebar、DailyTips、ErrorBoundary…）
│   │   ├── animations/               # Framer Motion 动画原子
│   │   ├── dashboard/                # 个人仪表盘组件
│   │   └── plugin/                   # 插件系统 UI
│   ├── data/                         # 内置测评题库
│   ├── hooks/                        # 自定义 React hooks
│   ├── i18n/                         # en.ts / zh.ts 翻译表
│   ├── lib/                          # apiClient、工具函数
│   ├── pages/                        # 路由级页面
│   ├── services/                     # 评分、认证、心情、训练、插件
│   ├── store/                        # Zustand 全局状态
│   ├── types/                        # TypeScript 类型
│   ├── App.tsx
│   └── main.tsx
├── backend/                          # FastAPI 后端（Python 3.12）
│   ├── app/
│   │   ├── api/                      # 路由处理（auth, results, mood, …）
│   │   ├── core/                     # 安全工具（JWT、密码哈希）
│   │   ├── models/                   # SQLAlchemy 2 ORM 模型
│   │   ├── schemas/                  # Pydantic v2 schemas
│   │   ├── config.py                 # pydantic-settings
│   │   ├── database.py               # SQLAlchemy engine + session
│   │   ├── dependencies.py           # 可复用 FastAPI 依赖
│   │   └── main.py                   # FastAPI 入口
│   ├── .env.example
│   ├── init_db.py                    # 建表 + 可选演示种子
│   ├── requirements.txt
│   └── run.py                        # 开发服务器（自动检测 docker/sqlite）
├── scripts/
│   └── postbuild.mjs                 # dist/index.html → dist/404.html
├── public/                           # 静态资源（favicons、og-image、docs/）
├── .github/
│   ├── workflows/                    # CI + Pages 部署
│   ├── ISSUE_TEMPLATE/               # Bug / Feature / Assessment 模板
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   └── dependabot.yml
├── Dockerfile                        # 后端镜像
├── Dockerfile.frontend               # 前端镜像（node build → nginx）
├── docker-compose.yml                # postgres + backend + frontend
├── nginx.conf                        # 反代 + SPA fallback
├── .env.example                      # Compose 环境模板
├── .editorconfig
├── .gitattributes
├── .prettierrc / .prettierignore
├── .eslint.config.mjs
├── vite.config.ts
├── tsconfig.json / tsconfig.node.json
├── README.md                         # English
├── README.zh-CN.md                   # 简体中文（你在这里）
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── CITATION.cff
└── LICENSE                           # MIT
```

---

## 🔌 API 速查

所有接口前缀为 `/api/v1`，交互式文档见 `/api/v1/docs`。
`✅` = 需要 `Authorization: Bearer <jwt>`。

| 方法       | 路径                          | 鉴权 | 描述                                                       |
|------------|-------------------------------|------|------------------------------------------------------------|
| `GET`      | `/health`                     | —    | 健康探针                                                   |
| `POST`     | `/auth/register`              | —    | 注册（`email` / `username` / `password`）                  |
| `POST`     | `/auth/login`                 | —    | OAuth2 密码流登录 → JWT                                    |
| `POST`     | `/auth/guest`                 | —    | 申请游客账号                                               |
| `GET`      | `/auth/me`                    | ✅   | 当前用户                                                   |
| `PATCH`    | `/auth/me`                    | ✅   | 更新 `username` / `email` / `avatar_url`                   |
| `POST`     | `/auth/logout`                | ✅   | 注销会话                                                   |
| `DELETE`   | `/auth/account`               | ✅   | 删除账号                                                   |
| `GET`      | `/assessments/`               | —    | 列出内置测评定义                                           |
| `GET`      | `/results/`                   | ✅   | 列出当前用户的结果（`?assessment_id=` 过滤）               |
| `POST`     | `/results/`                   | ✅   | 提交预计算结果（前端本地评分）                             |
| `GET`      | `/results/{id}`               | ✅   | 取单条结果                                                 |
| `DELETE`   | `/results/{id}`               | ✅   | 删除单条结果                                               |
| `GET`      | `/mood/`                      | ✅   | 列出心情记录                                               |
| `POST`     | `/mood/`                      | ✅   | 新建心情记录                                               |
| `PATCH`    | `/mood/{id}`                  | ✅   | 更新心情记录                                               |
| `DELETE`   | `/mood/{id}`                  | ✅   | 删除心情记录                                               |
| `GET`      | `/achievements/`              | ✅   | 列出已解锁成就                                             |
| `POST`     | `/achievements/`              | ✅   | 解锁成就（幂等）                                           |
| `DELETE`   | `/achievements/{id}`          | ✅   | 移除成就                                                   |
| `GET`      | `/training/`                  | ✅   | 列出训练计划                                               |

---

## 🌐 部署选项

| 目标                          | 方式                                       | 是否需要后端           |
|-------------------------------|--------------------------------------------|------------------------|
| **GitHub Pages**（展示）      | 推送 → Actions 自动构建部署                | 否 — localStorage 模式 |
| **Vercel / Netlify**          | 链接仓库，build `npm run build:pages`      | 否 — localStorage 模式 |
| **Cloudflare Pages**          | 同 Vercel                                  | 否 — localStorage 模式 |
| **自己的 VPS**                | `docker compose up -d --build`             | 是 — 完整技术栈        |
| **Kubernetes / Helm**         | 改写 compose 为 chart                      | 是                     |

**展示模式不需要任何环境变量** —— 应用会自动检测后端不可用，并切换到本地模式。

---

## 🧪 测评介绍

### 大五人格（IPIP / NEO-PI-R，50 题）

OCEAN 五大特质 + 子维度：

- **开放性** — 想象力、创造力、好奇心
- **尽责性** — 条理性、责任感、勤奋
- **外向性** — 社交性、主动性、积极情绪
- **宜人性** — 合作性、信任感、同理心
- **神经质** — 情绪稳定性、焦虑、情绪波动

### PSS-10 感知压力量表

10 题，划分低 / 中 / 高三档，附各档循证建议。

### GAD-7 广泛性焦虑量表

7 题，0–21 分，使用标准临床切点（轻 / 轻中 / 中重 / 重）。

### 心情 & 成就

每日 1–10 评分 + emoji 标签，趋势图可视化，连续记录解锁成就（如「首次测评」「连续 7 天」「心情达人」）。

---

## 🌍 国际化

界面内置两种语言，可一键切换：

- 🇺🇸 **English**（默认）
- 🇨🇳 **简体中文**

新增语言很简单 —— 详见 [CONTRIBUTING.md → 国际化](CONTRIBUTING.md)。

---

## 🤝 贡献指南

欢迎贡献！详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

```bash
git checkout -b feature/amazing-feature
npm run typecheck && npm run lint
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
# 提 PR，CI 自动跑 typecheck + lint + build
```

请遵守 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。参与即表示你同意其条款。

---

## 🔒 安全

- 生产部署**必须**在 `.env` 设置强随机 `SECRET_KEY`：`openssl rand -base64 64`
- 不要把后端或 PostgreSQL 端口暴露公网
- 生产环境请把 nginx 放在 HTTPS 后面（Traefik / Caddy / Cloudflare…）
- 一旦怀疑 `SECRET_KEY` 泄露请立即轮换 —— 这会让所有现有会话失效
- 发现漏洞请私下上报，详见 [SECURITY.md](SECURITY.md)

---

## 📄 协议与引用

本项目采用 **[MIT 协议](LICENSE)** © 2024–2026 badhope。

如果用在学术工作中，请引用底层量表（见 [CITATION.cff](CITATION.cff)）：

- **GAD-7**: Spitzer, Kroenke, Williams, Löwe (2006).
  *A brief measure for assessing generalized anxiety disorder.*
  Archives of Internal Medicine, 166(10), 1092–1097.
  [doi:10.1001/archinte.166.10.1092](https://doi.org/10.1001/archinte.166.10.1092)
- **PSS-10**: Cohen, Kamarck & Mermelstein (1983).
  *A global measure of perceived stress.*
  Journal of Health and Social Behavior, 24(4), 385–396.
  [doi:10.2307/2136404](https://doi.org/10.2307/2136404)
- **IPIP / 大五人格**: [ipip.ori.org](https://ipip.ori.org/)

---

## 🙏 致谢

- 测评方法论基于 [IPIP](https://ipip.ori.org/)（国际人格题库）。
- 灵感来自 [MindGarden](https://www.mindgarden.com/) 和 [16Personalities](https://www.16personalities.com/)。
- 用 ❤️ 与开源软件构建。

---

## 🌟 Star 历史

如果 MindMirror 对你有帮助，请 ⭐ 一下 —— 这对我意义重大！

[![Star History Chart](https://api.star-history.com/svg?repos=badhope/MindMirror&type=Timeline)](https://star-history.com/#badhope/MindMirror&Timeline)

---

<div align="center">

由 [MindMirror 贡献者们](https://github.com/badhope/MindMirror/graphs/contributors) 用 🧠 制作。

</div>
