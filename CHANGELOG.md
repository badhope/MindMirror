# Changelog

All notable changes to MindMirror are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

> **Languages:** [English](CHANGELOG.md)

---

## [Unreleased]

### 🐛 Bug Fixes
- **Router basename** — add `basename={import.meta.env.BASE_URL}` to
  `<Router>` in `src/App.tsx`. Without it, when deployed under a sub-path
  (e.g. GitHub Pages at `/MindMirror/`), every route falls through to
  the 404 NotFound page. Fixes the GitHub Pages "blank page" issue.
- **Invalid `X-Frame-Options` meta tag** — removed from `index.html`;
  this header can only be sent as an HTTP response header, not via
  `<meta>`. (Was triggering a console warning.)
- **Sitemap** — replaced hash-based URLs (`#/assessments`) with the new
  clean BrowserRouter URLs (`/assessments`) in `public/sitemap.xml`.

### 📚 Documentation
- **Repository hygiene** — added `.editorconfig`, `.github/CODEOWNERS`,
  `.github/dependabot.yml`, and `CITATION.cff`.
- **README rewrite** — split the monolithic bilingual README into
  `README.md` (English, primary) and `README.zh-CN.md` (简体中文) with
  a language switcher at the top. Both versions are now self-contained
  and easier to read.
- **CHANGELOG** — this file.
- **CONTRIBUTING** — clarified prerequisites, scripts, i18n flow, and
  switched the default branch reference from `main` to `master`.

### ⚙️ Configuration
- **`package.json`** — added `engines` (Node ≥ 18, npm ≥ 9), `format`
  / `format:check` scripts, added `prettier` as a dev dependency,
  expanded keywords, fixed `homepage` to point to the live GitHub Pages
  URL.
- **Sitemap** — `public/sitemap.xml` paths now match the BrowserRouter
  routes.

---

## [1.0.0] - 2026-06-02

### 🎉 Initial Open-Source Release

First public release of MindMirror as a fully self-hostable, Docker-based
psychological assessment platform.

#### ✨ Frontend
- Big Five personality assessment (NEO-PI-R based, 50 items, IPIP-derived)
- PSS-10 perceived stress scale
- GAD-7 anxiety screening
- Daily mood tracker with trend chart
- Achievements system
- Compare results across time
- Personal dashboard
- CBT-based mental training plans
- Plugin system for custom assessments
- Crisis resources page (international hotlines)
- Bilingual UI: English / 简体中文
- Smooth Framer Motion animations
- Mobile-first responsive layout
- Dark-mode aware meta themes
- **Local-only demo mode** (offline-first, no backend required) for
  GitHub Pages and quick previews

#### 🛠 Backend (new, replaces previous Supabase + Vercel stack)
- FastAPI 0.115 + Python 3.12
- SQLAlchemy 2 + Pydantic v2
- JWT (HS256) auth via `python-jose`
- `bcrypt` password hashing (no passlib)
- PostgreSQL 15 (Docker) / SQLite (local dev) with `JSONB`-compatible
  cross-dialect column
- Modules: `auth`, `assessments`, `results`, `training`, `mood`,
  `achievements`
- Auto-create tables on startup (no Alembic needed for the demo)
- `init_db.py` with optional `--seed` demo account
- CORS-aware, secure headers, input validation

#### 🐳 Container & Deployment
- Multi-service `docker compose`: `postgres`, `backend`, `frontend`
- Multi-stage frontend build: Vite → nginx
- nginx reverse proxy for `/api/*` to backend
- Healthchecks on every service
- `.dockerignore` to keep image size small
- Persistent PostgreSQL volume

#### 🌐 GitHub Pages (showcase)
- Live demo at <https://badhope.github.io/MindMirror/>
- BrowserRouter with `basename=/MindMirror/`
- `postbuild.mjs` produces `dist/404.html` for clean deep links
- GitHub Actions: type-check + lint on every PR, build & deploy Pages
  on push to `master`

#### 📦 Project Hygiene
- Removed Vercel serverless `api/`, `vercel.json`, `@vercel/node`
- Removed Supabase directory and `src/lib/supabase.ts`
- Removed unused Express / CORS / dotenv / nodemon / tsx dependencies
- Added `LICENSE` (MIT), `CODE_OF_CONDUCT`, `SECURITY`, `CHANGELOG`
- Refreshed bilingual `README.md` and `CONTRIBUTING.md`

[1.0.0]: https://github.com/badhope/MindMirror/releases/tag/v1.0.0
