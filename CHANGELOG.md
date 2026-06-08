# Changelog

All notable changes to MindMirror are tracked here. Dates are ISO 8601
and the format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Changed (2026-06-08)

- **Repo split into two parallel branches.** `main` is the static,
  no-backend edition (everything in `localStorage`, deployable to
  GitHub Pages); `server` is the full FastAPI + PostgreSQL self-host
  edition. The two are **not merged** — pick the one that fits how
  you want to use it. Same assessment content on both.
- **License switched from MIT to PolyForm Noncommercial 1.0.0.**
  Personal, academic, and non-profit use is still free; commercial
  deployments now need a written agreement. The LICENSE file,
  `package.json` `license` field, `CITATION.cff`, every i18n string,
  and the public-facing user guide all reflect the change. Stale
  MIT mentions in `README.zh-CN.md` and the original Cloud-marketing
  copy are gone.
- **Dependabot disabled.** `.github/dependabot.yml` is removed from
  both branches and the three leftover `dependabot/*` remote
  branches (`playwright-1.60.0`, `react-stack-8395414482`,
  `types/node-22.19.20`) have been folded into a single
  `deps(frontend): bump playwright, @types/node, react-router-dom`
  commit on each branch. The repo no longer opens dependency PRs
  automatically.
- **Frontend dependency bumps folded in:** `playwright ^1.57.0` →
  `^1.60.0`, `@types/node ^22.19.19` → `^22.19.20`,
  `react-router-dom ^7.3.0` → `^7.17.0`. `package-lock.json`
  regenerated; typecheck, lint, build, and 887 unit-test assertions
  all pass.
- **Dead public assets removed.** `public/docs/hero-banner.jpg`
  (unreferenced) and 34 unused `tests/e2e/screenshots/*.png` files
  (no e2e script imports any of them) are gone.
- **About / contact info corrected.** All references to
  `mindmirror.app` (a domain we don't own) and
  `an issue on github.com/badhope/mindmirror/issues` are replaced with the GitHub repo and
  issue tracker. The on-page shareable-result HTML footer now links
  to the repo, not the dead domain.

### Added

- **Four new psychological scales** with 40+ items each, expanded from
  the original short forms via dimension-aligned question banks:
  - **SSRS** 肖水源社会支持量表 — 43 items (10 core + 30 bank × 3
    dimensions: subjective / objective / utilization + 3 extension)
  - **MBI-GS** Maslach Burnout Inventory — 40 items (15 core + 22
    bank × 3 dimensions: exhaustion / cynicism / efficacy + 3 ext)
  - **SWLS** Diener Satisfaction With Life Scale — 40 items (5 core
    + 33 bank × 6 themes: relationships / health / achievement /
    growth / meaning / daily + 2 extension)
  - **CD-RISC-10** Connor-Davidson Resilience Scale — 40 items
    (10 core + 27 bank × 5 sub-dimensions + 3 extension)
- **Bank questions are reverse-coded** to detect acquiescent responding
  and **behaviour-anchored** to discriminate people who would give
  similar abstract-self-evaluation answers but actually differ in
  lived experience.
- **Behavioral profile archetypes** — 16 new archetypes (4 per scale)
  derived from the extension items, complementing the score bands.
- **Backend catalog expanded** to 7 assessments, with all 4 new
  scales' questions + options + traits + reverse flags synced from
  the frontend `src/data/` so the API and the SPA can't drift.
- **New test suite** `tests/unit/40q-bank-test.mjs` (77 assertions)
  covering question counts, ID uniqueness, trait distribution, score
  dynamics, level boundaries, and edge-case empty input across the
  four expanded scales.

### Changed

- **Scoring services use dynamic max calculation.** All four services
  (`ssrsScoring`, `mbiScoring`, `swlsScoring`, `resilienceScoring`)
  now compute their dimension maxima from the actual question set
  passed in. Adding/removing questions no longer requires touching
  the scoring code.
- **Severity thresholds use percentages** (not absolute scores) for
  `getMBITotalLevel`, `getSWLSLevel`, `getResilienceLevel`, and the
  per-dimension level helpers. The original Schaufeli / Pavot /
  Connor-Davidson cut-points are preserved when running on the
  original short forms (e.g. 15-item MBI still maps to 30-point
  max), so historical results stay comparable.
- **Severity ranges scaled proportionally** to new total maxima:
  SSRS 50→180, MBI 30→74, SWLS 35→266, CD-RISC 40→148.
- `getQuestionsForAssessment` (`src/data/mockData.ts`) now returns
  the full 40+ question list (main + bank + extension) for the four
  expanded scales.
- Assessment metadata in the four data files:
  - `totalQuestions` reflects the new totals (43 / 40 / 40 / 40)
  - `estimatedTime` updated to 11-12 minutes
  - descriptions mention the bank-expansion design intent
- `init_db.py` seed now creates 7 assessments (was 3) and is
  idempotent across re-runs. Catalog version bumped to `1.1` for
  the four expanded scales.

### Security

- Hard-coded `SECRET_KEY` fallback removed. Production now refuses to
  start if `SECRET_KEY` is unset, equal to the dev placeholder, or
  shorter than 32 characters. Development gets a randomly-generated
  ephemeral key and a warning at boot — sessions don't survive a
  restart, which is the right trade-off for a dev box.
- Wildcard CORS origin is no longer accepted. The dev default is a
  localhost allow-list; production requires an explicit
  `CORS_ORIGIN` list. Methods/headers are now whitelisted and the
  preflight cache is 10 minutes.
- `DELETE /api/v1/auth/account` is no longer a no-op for registered
  users. Non-guest accounts must confirm with their password
  (400/401 otherwise); guest accounts self-delete with no body. The
  User row's cascade-deletes take assessments, training plans, mood
  entries and achievements with it.
- `python-jose` is pinned to `>=3.5.0,<4.0.0` (closes the
  alg-confusion / `alg=none` / DoS CVEs from 2024-2025). The decode
  call site already pinned the algorithm allow-list, but the version
  bump is defense in depth.
- `avatar_url` is validated as an `http`/`https` URL only —
  `javascript:`, `data:`, and `file:` are rejected at the schema
  layer, closing a stored-XSS vector.
- `User.username` carries a database-level `UNIQUE` index. The
  application still does a pre-check; the constraint closes the
  TOCTOU race on simultaneous registrations.
- All list endpoints (`/results/`, `/mood/`, `/assessments/`,
  `/training/`, `/achievements/`) bound `skip ≥ 0` and
  `1 ≤ limit ≤ 200` (100 for training). FastAPI rejects out-of-range
  values with 422 before the SQL is built.
- `verify_token` now catches `JWTError` instead of bare `Exception`;
  `verify_password` narrows the bcrypt catch to `ValueError`/`TypeError`
  so real bugs surface instead of being swallowed.

### Fixed

- `database.py` was passing `pool_size` / `max_overflow` to
  `create_engine` unconditionally; SQLite rejects them, so any
  `DATABASE_URL=sqlite://...` deployment crashed on import. Pool
  arguments are now set only for non-sqlite URLs.
- Guest signup used `*@mindmirror.local`, which Pydantic v2's
  `EmailStr` rejects (`.local` is a reserved TLD). Switched to
  `*@guest.mindmirror.example` (RFC 2606 reserved, accepted by
  validators, never used to send mail).
- `init_db.py --seed` was creating `demo@example.com`; README and
  the live demo say `demo@mindmirror.app`. They agree now.
- Removed two stray `eslint-disable no-console` comments that
  ESLint was warning about.

### Changed

- `index.html` no longer carries an `X-Frame-Options` meta tag
  (it has to be an HTTP header, not a meta tag — was triggering
  a console warning).
- `<Router>` in `src/App.tsx` uses `basename={import.meta.env.BASE_URL}`
  so the SPA works under any base path (fixes the GitHub Pages
  "blank page" issue when deployed under a project sub-path).
- `public/sitemap.xml` paths use the new BrowserRouter URLs
  (`/assessments`) instead of the old hash routes.
- `README` split into `README.md` (English, primary) and
  `README.zh-CN.md`; both self-contained.
- `package.json` declares `engines.node ≥ 18` and `engines.npm ≥ 9`,
  adds `format` / `format:check` scripts, and the `homepage` field
  points at the live demo.

### Added

- `SECURITY.md` — supported versions, disclosure process, deployer
  hardening checklist, known limitations.
- `backend/.env.example` — annotated with the things that
  actually have to be set, including how to mint a `SECRET_KEY`.
- `.editorconfig`, `.github/CODEOWNERS`, `.github/dependabot.yml`,
  `CITATION.cff`.
- `backend/tests/` — real pytest suite covering auth, account
  deletion, pagination guards, the security primitives
  (bcrypt round-trip + `alg=none` rejection + wrong-secret
  rejection), CORS config rules, and the rate limiter.
  `make test-backend` runs them.
- `app/core/cors.py`, `app/core/logging.py`, `app/core/middleware.py`,
  `app/core/ratelimit.py` — CORS allow-list resolver, structured
  logging (text in dev, JSON in prod), per-request id middleware
  that joins access logs, and `slowapi`-backed IP rate limiting on
  `/auth/*` (20 attempts / minute / IP).
- `Makefile` — `make dev`, `make test`, `make lint`, `make build`,
  `make docker-up`, etc.

## [1.0.0] — 2026-06-02

First public release. Full FastAPI + PostgreSQL stack replaces the
old Supabase / Vercel arrangement; the same React app still runs as
a static demo on GitHub Pages with `localStorage` as the only
backend.

Highlights:

- Big Five (NEO-PI-R, 50 items), PSS-10, GAD-7
- Mood tracker, achievements, CBT-style training plans
- Bilingual UI: English / 简体中文
- Docker Compose for postgres + backend + frontend
- JWT (HS256) auth, bcrypt passwords, CORS-aware, strict Pydantic
  schemas
- GitHub Actions: type-check + lint + build on every PR; Pages
  deploy on `main`

[1.0.0]: https://github.com/badhope/MindMirror/releases/tag/v1.0.0
