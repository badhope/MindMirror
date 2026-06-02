# MindMirror

<div align="center">

![MindMirror](https://img.shields.io/badge/MindMirror-Psychological%20Assessment-4F46E5?style=for-the-badge&logo=brain&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-6DD58C?style=flat-square)
![PRs](https://img.shields.io/badge/PRs-Welcome-FF6B6B?style=flat-square)

**📖 [中文文档](#-mindmirror-1)** | **🤝 [Contributing](CONTRIBUTING.md)**

*Discover yourself, grow every day.*

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 **Big Five Personality Assessment** | Scientific NEO-PI-R based personality test with detailed trait analysis |
| 😰 **Stress Evaluation** | PSS-10 based stress assessment with personalized recommendations |
| 😨 **Anxiety Assessment** | GAD-7 clinical-grade anxiety screening |
| 😊 **Mood Tracker** | Daily mood logging with trend visualization |
| 🏆 **Achievements System** | Gamified progress tracking and milestone rewards |
| 📊 **Results Comparison** | Compare assessments across different time periods |
| 💪 **Mental Training** | CBT-based exercises for stress management |
| 🌐 **Bilingual Support** | Full English / Chinese (简体中文) internationalization |
| 🔐 **JWT Authentication** | Email/password sign-up, login and guest accounts |
| 📱 **Responsive Design** | Mobile-first, works on all devices |
| 🔌 **Plugin System** | Extensible architecture for custom assessments |
| 🎨 **Smooth Animations** | Polished micro-interactions with Framer Motion |
| 🐳 **One-Command Deploy** | `docker compose up` boots the full stack |

---

## 🚀 Quick Start

### Option A — Docker (recommended for production)

```bash
git clone https://github.com/badhope/MindMirror.git
cd MindMirror

cp .env.example .env
# Edit .env and set a strong SECRET_KEY (used to sign JWTs)

docker compose up -d --build
```

The app is then available at:

- Frontend (nginx → React SPA): `http://localhost`
- Backend API (internal): `http://localhost/api/v1/...`
- Backend docs: `http://localhost/api/v1/docs`
- PostgreSQL: `localhost:5432` (only if you map the port)

`docker compose` brings up three containers: `postgres`, `backend` (FastAPI on
port 8000, exposed only to the internal network) and `frontend` (nginx on
port 80) which proxies `/api/*` to the backend.

### Option B — Local development (hot reload)

```bash
# Frontend
npm install
npm run dev          # http://localhost:5173  (proxies /api -> :8000)

# Backend (separate terminal)
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# For local dev without Postgres, edit .env and set:
#   DATABASE_URL=sqlite:///./mental_health.db
#   SECRET_KEY=dev-secret-key-replace-in-production
python3 init_db.py --seed   # creates tables + demo@example.com / demo123
python3 run.py              # http://localhost:8000
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript 5.8, Vite 6 |
| **State Management** | Zustand 5 |
| **Styling** | Tailwind CSS 3, Framer Motion 12 |
| **Routing** | React Router v7 |
| **Backend** | Python 3.12, FastAPI 0.115, SQLAlchemy 2, Pydantic v2 |
| **Auth** | JWT (HS256) via `python-jose` + `bcrypt` |
| **Database** | PostgreSQL 15 (containerised) / SQLite (local dev) |
| **Container** | Docker + Docker Compose, nginx reverse proxy for the API |

---

## 📁 Project Structure

```
MindMirror/
├── src/                     # React + TypeScript frontend
│   ├── components/          # Reusable UI components
│   ├── data/                # Assessment question banks
│   ├── i18n/                # EN/ZH translation files
│   ├── lib/                 # apiClient, utility helpers
│   ├── pages/               # Route page components
│   ├── services/            # Scoring, auth, mood, training, plugins
│   ├── store/               # Zustand global state
│   └── types/               # TypeScript type definitions
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/             # Route handlers (auth, results, mood, …)
│   │   ├── core/            # Security, config helpers
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── schemas/         # Pydantic request/response models
│   │   ├── config.py        # pydantic-settings
│   │   ├── database.py      # SQLAlchemy engine + session
│   │   ├── dependencies.py  # Reusable FastAPI dependencies
│   │   └── main.py          # FastAPI app entrypoint
│   ├── .env.example         # Backend env template
│   ├── init_db.py           # Create tables + optional demo user
│   ├── requirements.txt
│   └── run.py               # Dev server (auto-detects docker vs sqlite)
├── public/                  # Static assets, PWA manifest, icons
├── Dockerfile               # Backend image
├── Dockerfile.frontend      # Frontend image (multi-stage: node build → nginx)
├── docker-compose.yml       # postgres + backend + frontend
├── nginx.conf               # Reverse proxy / SPA fallback
├── .env.example             # Compose env template
├── package.json
└── vite.config.ts
```

---

## 🧪 Assessments

### Big Five Personality (NEO-PI-R Based)

50 questions measuring five major personality traits:

- **Openness** — Imagination, creativity, curiosity
- **Conscientiousness** — Organization, responsibility, diligence
- **Extraversion** — Sociability, assertiveness, positive emotions
- **Agreeableness** — Cooperation, trust, empathy
- **Neuroticism** — Emotional instability, anxiety, moodiness

### Perceived Stress Scale (PSS-10)

10 questions measuring perceived stress levels with clinical thresholds.

### Generalized Anxiety Disorder (GAD-7)

7-question clinical screening tool for anxiety severity assessment.

---

## 🔌 API

| Endpoint | Description |
|----------|-------------|
| `POST /api/v1/auth/register` | Create a new user (email + username + password) |
| `POST /api/v1/auth/login` | OAuth2 password flow → returns JWT |
| `POST /api/v1/auth/guest` | Issue a guest account |
| `GET /api/v1/auth/me` / `PATCH /api/v1/auth/me` | Read / update current user |
| `GET/POST /api/v1/results/` | Cross-device sync of assessment results |
| `GET/POST/PATCH/DELETE /api/v1/mood/` | Mood entries CRUD |
| `GET/POST/DELETE /api/v1/achievements/` | Achievements |
| `GET /api/v1/training/` | Training plans |
| `GET /api/v1/assessments/` | Built-in assessment definitions |
| `GET /health` | Liveness probe (used by Docker `HEALTHCHECK`) |
| `GET /docs` | Interactive Swagger UI |

All authenticated routes expect `Authorization: Bearer <jwt>`.

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting PRs.

```bash
git checkout -b feature/amazing-feature
npm run typecheck
npm run lint
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Assessment methodologies based on [IPIP](https://ipip.ori.org/) (International Personality Item Pool)
- GAD-7 scale from [Spitzer et al.](https://doi.org/10.1001/archpsyc.63.9.1043)
- PSS-10 from [Cohen et al.](https://doi.org/10.1037/t00791-000)
- Inspired by [MindGarden](https://www.mindgarden.com/) and [16Personalities](https://www.16personalities.com/)

---

## 🌟 Star History

If MindMirror helps you, please give it a ⭐ — it means a lot!

[![Star History Chart](https://api.star-history.com/svg?repos=badhope/MindMirror&type=Timeline)](https://star-history.com/#badhope/MindMirror&Timeline)

---

<br>

---

# 🌟 MindMirror

<div align="center">

![MindMirror](https://img.shields.io/badge/MindMirror-心理测评平台-4F46E5?style=for-the-badge&logo=brain&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-6DD58C?style=flat-square)

**🇺🇸 [English Version](#)** | **🤝 [贡献指南](CONTRIBUTING.md)**

*发现自我，每天成长。*

</div>

---

## ✨ 功能特点

| 功能 | 描述 |
|------|------|
| 🧠 **大五人格测评** | 基于 NEO-PI-R 的科学人格测试，详细的特质分析 |
| 😰 **压力评估** | 基于 PSS-10 的压力测评，个性化建议 |
| 😨 **焦虑评估** | GAD-7 临床焦虑筛查量表 |
| 😊 **心情追踪** | 每日心情记录与趋势可视化 |
| 🏆 **成就系统** | 游戏化进度追踪与里程碑奖励 |
| 📊 **结果对比** | 对比不同时期的测评结果 |
| 💪 **心理训练** | CBT 认知行为疗法练习 |
| 🌐 **双语支持** | 完整英文 / 中文国际化 |
| 🔐 **JWT 认证** | 邮箱密码注册、登录、游客账号 |
| 📱 **响应式设计** | 移动端优先，适配所有设备 |
| 🔌 **插件系统** | 可扩展架构，支持自定义测评 |
| 🎨 **流畅动画** | Framer Motion 精制微交互动画 |
| 🐳 **一键部署** | `docker compose up` 启动完整技术栈 |

---

## 🚀 快速开始

### 方式一：Docker（推荐用于生产环境）

```bash
git clone https://github.com/badhope/MindMirror.git
cd MindMirror

cp .env.example .env
# 编辑 .env，至少设置一个强随机 SECRET_KEY（用于 JWT 签名）

docker compose up -d --build
```

启动后：

- 前端（nginx → React SPA）：`http://localhost`
- 后端 API（仅内网）：`http://localhost/api/v1/...`
- 后端文档：`http://localhost/api/v1/docs`
- PostgreSQL：默认不对外暴露

`docker compose` 会启动三个容器：`postgres`、`backend`（FastAPI 8000，仅内网）、`frontend`（nginx 80，反向代理 `/api/*` 到 backend）。

### 方式二：本地开发（热更新）

```bash
# 前端
npm install
npm run dev            # http://localhost:5173  （自动代理 /api -> :8000）

# 后端（另开终端）
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# 本地无 Postgres 时，编辑 .env：
#   DATABASE_URL=sqlite:///./mental_health.db
#   SECRET_KEY=dev-secret-key-replace-in-production
python3 init_db.py --seed   # 建表 + 演示账号 demo@example.com / demo123
python3 run.py              # http://localhost:8000
```

---

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | React 18, TypeScript 5.8, Vite 6 |
| **状态管理** | Zustand 5 |
| **样式** | Tailwind CSS 3, Framer Motion 12 |
| **路由** | React Router v7 |
| **后端** | Python 3.12, FastAPI 0.115, SQLAlchemy 2, Pydantic v2 |
| **认证** | JWT (HS256) via `python-jose` + `bcrypt` |
| **数据库** | PostgreSQL 15（容器化）/ SQLite（本地开发） |
| **容器** | Docker + Docker Compose, nginx 反向代理 API |

---

## 🧪 测评介绍

### 大五人格 (基于 NEO-PI-R)

50 道题测量五大核心人格特质：

- **开放性** — 想象力、创造力、好奇心
- **尽责性** — 条理性、责任感、勤奋
- **外向性** — 社交性、主动性、积极情绪
- **宜人性** — 合作性、信任感、同理心
- **神经质** — 情绪不稳定、焦虑、情绪波动

### 感知压力量表 (PSS-10)

10 道题测量主观压力感知，附带临床阈值参考。

### 广泛性焦虑量表 (GAD-7)

7 道题临床焦虑筛查工具，评估焦虑严重程度。

---

## 🔌 API

| 接口 | 说明 |
|------|------|
| `POST /api/v1/auth/register` | 新用户注册（邮箱 + 用户名 + 密码） |
| `POST /api/v1/auth/login` | OAuth2 密码流登录，返回 JWT |
| `POST /api/v1/auth/guest` | 游客账号 |
| `GET / PATCH /api/v1/auth/me` | 获取/更新当前用户 |
| `GET/POST /api/v1/results/` | 测评结果跨设备同步 |
| `GET/POST/PATCH/DELETE /api/v1/mood/` | 心情记录 CRUD |
| `GET/POST/DELETE /api/v1/achievements/` | 成就管理 |
| `GET /api/v1/training/` | 训练计划 |
| `GET /api/v1/assessments/` | 内置测评定义 |
| `GET /health` | 健康探针（Docker HEALTHCHECK 使用） |
| `GET /docs` | 交互式 Swagger 文档 |

所有需要登录的接口都需要 `Authorization: Bearer <jwt>` 头。

---

## 🤝 贡献指南

欢迎贡献！提交 PR 前请阅读 [贡献指南](CONTRIBUTING.md)。

```bash
git checkout -b feature/amazing-feature
npm run typecheck
npm run lint
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源。

---

## 🙏 致谢

- 测评方法论基于 [IPIP](https://ipip.ori.org/)（国际人格题库）
- GAD-7 量表来自 [Spitzer et al.](https://doi.org/10.1001/archpsyc.63.9.1043)
- PSS-10 来自 [Cohen et al.](https://doi.org/10.1037/t00791-000)
- 灵感来自 [MindGarden](https://www.mindgarden.com/) 和 [16Personalities](https://www.16personalities.com/)
