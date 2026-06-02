<div align="center">

<!-- Hero banner -->
<img src="https://raw.githubusercontent.com/badhope/MindMirror/master/public/docs/hero-banner.jpg" alt="MindMirror" width="100%" style="max-width: 980px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,.08); margin: 0 auto 2rem;" />

# 🧠 MindMirror

**Open-Source · Self-Hosted · Privacy-First Psychological Assessment Platform**

> *Discover yourself. Grow every day.*

---

**🌐 Languages:** [English](README.md) · [简体中文](README.zh-CN.md)

---

<!-- Badges -->
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

[**🌐 Live Demo**](https://badhope.github.io/MindMirror/) ·
[**📖 Quick Start**](#-quick-start) ·
[**🐳 Docker Deploy**](#-deployment) ·
[**📚 API Reference**](#-api-reference) ·
[**🤝 Contributing**](CONTRIBUTING.md)

</div>

---

## ✨ Why MindMirror?

- **🔒 Privacy first** — your data lives in *your* database, never in a third-party cloud.
- **🧪 Scientifically validated scales** — Big Five (IPIP / NEO-PI-R), PSS-10, GAD-7, with proper citations.
- **🌐 Fully bilingual** — English & 简体中文 with a built-in language switcher.
- **📦 Two modes** — full FastAPI + PostgreSQL backend, **or** a zero-backend offline demo (`localStorage`) that runs on any static host (including GitHub Pages).
- **🧩 Plugin system** — drop in custom assessments via JSON.
- **📱 PWA-ready** — installable, mobile-first, offline-friendly.
- **🐳 One-command deploy** — `docker compose up` brings the entire stack online.
- **🎨 Polished UX** — Framer Motion animations, dark-mode aware, accessible (WCAG 2.1 AA where feasible).
- **💯 MIT licensed** — use it, fork it, ship it.

---

## 📋 Table of Contents

- [✨ Why MindMirror?](#-why-mindmirror)
- [🖼️ Screenshots](#-screenshots)
- [🚀 Quick Start](#-quick-start)
- [🏗️ Architecture](#-architecture)
- [🛠️ Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🔌 API Reference](#-api-reference)
- [🌐 Deployment Options](#-deployment-options)
- [🧪 Assessments](#-assessments)
- [🌍 Internationalization](#-internationalization)
- [🤝 Contributing](#-contributing)
- [🔒 Security](#-security)
- [📄 License & Citation](#-license--citation)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 🖼️ Screenshots

> Visit the **[live demo](https://badhope.github.io/MindMirror/)** for the real interactive UI — the same code powers self-hosted deployments.

| Home | Assessment Hub |
|:---:|:---:|
| Hero, hero, hero | Catalog of all built-in scales |

| Big Five Result | Mood Tracker |
|:---:|:---:|
| Radar chart, trait explanations | Daily log with trend chart |

(Screenshots rendered from the live build — see `public/docs/` for the latest captures.)

---

## 🚀 Quick Start

### Option A — Local development (hot reload)

```bash
git clone https://github.com/badhope/MindMirror.git
cd MindMirror

# 1) Frontend
npm install
npm run dev          # http://localhost:5173 (Vite, with /api proxy)

# 2) Backend (separate terminal)
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# For local dev without Postgres, edit .env:
#   DATABASE_URL=sqlite:///./mental_health.db
#   SECRET_KEY=dev-secret-key-replace-in-production
python3 init_db.py --seed   # creates tables + demo@mindmirror.app / demo123
python3 run.py              # http://localhost:8000 (FastAPI)
```

### Option B — Docker (production)

```bash
git clone https://github.com/badhope/MindMirror.git
cd MindMirror

cp .env.example .env
# Edit .env and set a strong SECRET_KEY (used to sign JWTs):
#   openssl rand -base64 64

docker compose up -d --build
```

That spins up three containers behind a single port `80`:

| Service      | Host port | Purpose                                                       |
|--------------|-----------|---------------------------------------------------------------|
| `frontend`   | **80**    | nginx → React SPA, reverse-proxies `/api/*` to the backend    |
| `backend`    | —         | FastAPI on 8000 (internal Docker network only)                |
| `postgres`   | —         | PostgreSQL 15 (internal Docker network only)                  |

Verify:

```bash
curl http://localhost/health            # nginx
curl http://localhost/api/v1/health     # FastAPI
open http://localhost                   # UI
open http://localhost/api/v1/docs       # Swagger UI
```

### Option C — Just preview the UI (no backend)

Open the **[GitHub Pages demo](https://badhope.github.io/MindMirror/)**. The app
auto-detects the missing backend and falls back to a privacy-respecting
**local-only mode** where everything (accounts, results, mood) stays in your
browser's `localStorage`.

---

## 🏗️ Architecture

```
                    ┌────────────────────────────────────┐
                    │        Browser / PWA               │
                    │  React 18 · TypeScript · Vite 6    │
                    │  Zustand · Framer Motion · i18n    │
                    └──────────┬─────────────────────────┘
                               │ HTTPS
                               ▼
                    ┌────────────────────────────────────┐
                    │   nginx (port 80) — single entry   │
                    │   - serves /assets (cache 1y)      │
                    │   - reverse-proxy /api/*           │
                    │   - SPA fallback → index.html      │
                    └────────────────────────────────────┘
                               │
                               ▼
                    ┌────────────────────────────────────┐
                    │  FastAPI (port 8000, internal)     │
                    │  /auth  /assessments  /results     │
                    │  /training  /mood  /achievements   │
                    │  JWT (HS256) + bcrypt              │
                    └──────────┬─────────────────────────┘
                               │
                               ▼
                    ┌────────────────────────────────────┐
                    │       PostgreSQL 15                │
                    │   (volume-mounted, internal)       │
                    └────────────────────────────────────┘

        GitHub Pages showcase deployment (no backend):
        ┌──────────────────────────────────────────────┐
        │ badhope.github.io/MindMirror/  → localStorage│
        └──────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer             | Choice                                                       | Why                                            |
|-------------------|--------------------------------------------------------------|------------------------------------------------|
| **Frontend**      | React 18 + TypeScript 5.8 + Vite 6                           | Best DX, fast HMR, type safety                 |
| **State**         | Zustand 5                                                    | Minimal, no boilerplate, persists nicely       |
| **Styling**       | Tailwind 3 + Framer Motion 12                                | Utility-first + smooth animations              |
| **Routing**       | React Router v7 (BrowserRouter with `basename`)              | Clean URLs under any sub-path                   |
| **i18n**          | Hand-rolled EN / ZH dictionaries                             | Zero dependencies, full control                |
| **Backend**       | Python 3.12 + FastAPI 0.115 + Pydantic v2                    | Async, fast, type-safe, auto Swagger docs      |
| **ORM**           | SQLAlchemy 2                                                 | Cross-dialect (PG / SQLite) with `JSONB` shim  |
| **Auth**          | JWT (HS256) via `python-jose` + `bcrypt`                     | Simple, no external IdP needed                 |
| **DB**            | PostgreSQL 15 (Docker) / SQLite (dev fallback)               | Battle-tested, single-binary SQLite fallback    |
| **Container**     | Docker + Compose, multi-stage builds                        | One command to deploy                          |
| **CI / CD**       | GitHub Actions (typecheck + lint + Pages)                    | Free for OSS, zero config                      |

---

## 📁 Project Structure

```
MindMirror/
├── src/                              # React + TypeScript frontend
│   ├── components/                   # UI components (Sidebar, DailyTips, ErrorBoundary, …)
│   │   ├── animations/               # Framer Motion animation primitives
│   │   ├── dashboard/                # Personal dashboard widgets
│   │   └── plugin/                   # Plugin system UI
│   ├── data/                         # Built-in assessment question banks
│   ├── hooks/                        # Custom React hooks
│   ├── i18n/                         # en.ts, zh.ts translation tables
│   ├── lib/                          # apiClient, utility helpers
│   ├── pages/                        # Route-level pages
│   ├── services/                     # Scoring, auth, mood, training, plugins
│   ├── store/                        # Zustand global state
│   ├── types/                        # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── backend/                          # FastAPI backend (Python 3.12)
│   ├── app/
│   │   ├── api/                      # Route handlers (auth, results, mood, …)
│   │   ├── core/                     # Security helpers (JWT, password hashing)
│   │   ├── models/                   # SQLAlchemy 2 ORM models
│   │   ├── schemas/                  # Pydantic v2 schemas
│   │   ├── config.py                 # pydantic-settings
│   │   ├── database.py               # SQLAlchemy engine + session
│   │   ├── dependencies.py           # Reusable FastAPI dependencies
│   │   └── main.py                   # FastAPI app entrypoint
│   ├── .env.example
│   ├── init_db.py                    # Create tables + optional demo seed
│   ├── requirements.txt
│   └── run.py                        # Dev runner (auto-detects docker vs sqlite)
├── scripts/
│   └── postbuild.mjs                 # Copies dist/index.html → dist/404.html
├── public/                           # Static assets (favicons, og-image, docs/)
├── .github/
│   ├── workflows/                    # CI + Pages deploy
│   ├── ISSUE_TEMPLATE/               # Bug, feature, assessment
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   └── dependabot.yml
├── Dockerfile                        # Backend image
├── Dockerfile.frontend               # Frontend image (node build → nginx)
├── docker-compose.yml                # postgres + backend + frontend
├── nginx.conf                        # Reverse proxy + SPA fallback
├── .env.example                      # Compose env template
├── .editorconfig
├── .gitattributes
├── .prettierrc / .prettierignore
├── .eslint.config.mjs
├── vite.config.ts
├── tsconfig.json / tsconfig.node.json
├── README.md                         # English (you are here)
├── README.zh-CN.md                   # 简体中文
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── CITATION.cff
└── LICENSE                           # MIT
```

---

## 🔌 API Reference

All endpoints are prefixed with `/api/v1`. Interactive Swagger docs at
`/api/v1/docs`. `✅` = `Authorization: Bearer <jwt>` required.

| Method   | Path                       | Auth | Description                                                |
|----------|----------------------------|------|------------------------------------------------------------|
| `GET`    | `/health`                  | —    | Liveness probe                                             |
| `POST`   | `/auth/register`           | —    | Create account (`email`, `username`, `password`)           |
| `POST`   | `/auth/login`              | —    | OAuth2 password flow → JWT                                 |
| `POST`   | `/auth/guest`              | —    | Issue a guest account                                      |
| `GET`    | `/auth/me`                 | ✅   | Current user                                               |
| `PATCH`  | `/auth/me`                 | ✅   | Update `username` / `email` / `avatar_url`                 |
| `POST`   | `/auth/logout`             | ✅   | Invalidate session                                         |
| `DELETE` | `/auth/account`            | ✅   | Delete account                                             |
| `GET`    | `/assessments/`            | —    | List built-in assessment definitions                       |
| `GET`    | `/results/`                | ✅   | List user's results (`?assessment_id=` filter)             |
| `POST`   | `/results/`                | ✅   | Save a pre-computed result (frontend scores locally)       |
| `GET`    | `/results/{id}`            | ✅   | Fetch one result                                           |
| `DELETE` | `/results/{id}`            | ✅   | Delete one result                                          |
| `GET`    | `/mood/`                   | ✅   | List mood entries                                          |
| `POST`   | `/mood/`                   | ✅   | Create a mood entry                                        |
| `PATCH`  | `/mood/{id}`               | ✅   | Update a mood entry                                        |
| `DELETE` | `/mood/{id}`               | ✅   | Delete a mood entry                                        |
| `GET`    | `/achievements/`           | ✅   | List unlocked achievements                                 |
| `POST`   | `/achievements/`           | ✅   | Unlock (idempotent)                                        |
| `DELETE` | `/achievements/{id}`       | ✅   | Remove                                                     |
| `GET`    | `/training/`               | ✅   | List training plans                                        |

---

## 🌐 Deployment Options

| Where                          | How                                                        | Backend?               |
|--------------------------------|------------------------------------------------------------|------------------------|
| **GitHub Pages** (showcase)    | Push → Actions builds and deploys                           | No — localStorage mode |
| **Vercel / Netlify**           | Connect repo, build with `npm run build:pages`             | No — localStorage mode |
| **Cloudflare Pages**           | Same as Vercel                                             | No — localStorage mode |
| **Your own VPS**               | `docker compose up -d --build`                             | Yes — full stack       |
| **Kubernetes / Helm**          | Adapt the compose file                                     | Yes                    |

For the showcase-only mode, **no environment variables are required** — the
app auto-detects the missing backend and switches to local-only storage.

---

## 🧪 Assessments

### Big Five (IPIP / NEO-PI-R based, 50 items)

The "OCEAN" traits with sub-facets:

- **Openness** — imagination, creativity, curiosity
- **Conscientiousness** — organization, responsibility, diligence
- **Extraversion** — sociability, assertiveness, positive emotions
- **Agreeableness** — cooperation, trust, empathy
- **Neuroticism** — emotional stability, anxiety, moodiness

### PSS-10 (Cohen's Perceived Stress Scale)

10 items, scored into Low / Moderate / High, with evidence-based tips for
each level.

### GAD-7 (Generalized Anxiety Disorder)

7 items, scored 0–21 with the standard clinical cutoffs
(Minimal / Mild / Moderate / Severe).

### Mood & Achievements

Track your daily mood on a 1–10 scale with tags, view trends, and unlock
achievements as you go (e.g. "First Assessment", "7-Day Streak",
"Mood Master").

---

## 🌍 Internationalization

The UI ships in two languages with a built-in switcher:

- 🇺🇸 **English** (default)
- 🇨🇳 **简体中文**

Adding a new language is straightforward — see
[CONTRIBUTING.md → Internationalization](CONTRIBUTING.md#-internationalization-i18n).

---

## 🤝 Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

```bash
git checkout -b feature/amazing-feature
npm run typecheck && npm run lint
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
# Open a PR — CI runs typecheck + lint + build automatically
```

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md). By participating,
you agree to abide by its terms.

---

## 🔒 Security

- Production deployments **must** set a strong `SECRET_KEY` in `.env`:
  `openssl rand -base64 64`
- Never expose the backend or PostgreSQL ports to the public internet.
- Put the nginx frontend behind HTTPS in production
  (Traefik, Caddy, Cloudflare, …).
- Rotate `SECRET_KEY` if you suspect it has leaked — this invalidates all
  existing user sessions.
- Report vulnerabilities privately — see [SECURITY.md](SECURITY.md).

---

## 📄 License & Citation

This project is licensed under the **[MIT License](LICENSE)** © 2024–2026 badhope.

If you use MindMirror in academic work, please cite the underlying scales
(see [CITATION.cff](CITATION.cff)):

- **GAD-7**: Spitzer, Kroenke, Williams, Löwe (2006).
  *A brief measure for assessing generalized anxiety disorder.*
  Archives of Internal Medicine, 166(10), 1092–1097.
  [doi:10.1001/archinte.166.10.1092](https://doi.org/10.1001/archinte.166.10.1092)
- **PSS-10**: Cohen, Kamarck & Mermelstein (1983).
  *A global measure of perceived stress.*
  Journal of Health and Social Behavior, 24(4), 385–396.
  [doi:10.2307/2136404](https://doi.org/10.2307/2136404)
- **IPIP / Big Five**: [ipip.ori.org](https://ipip.ori.org/)

---

## 🙏 Acknowledgments

- Assessment methodologies based on
  [IPIP](https://ipip.ori.org/) (International Personality Item Pool).
- Inspired by [MindGarden](https://www.mindgarden.com/) and
  [16Personalities](https://www.16personalities.com/).
- Built with ❤️ using open-source software.

---

## 🌟 Star History

If MindMirror helps you, please ⭐ the repo — it means a lot!

[![Star History Chart](https://api.star-history.com/svg?repos=badhope/MindMirror&type=Timeline)](https://star-history.com/#badhope/MindMirror&Timeline)

---

<div align="center">

Made with 🧠 by the [MindMirror contributors](https://github.com/badhope/MindMirror/graphs/contributors).

</div>
