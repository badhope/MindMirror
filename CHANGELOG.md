# Changelog

All notable changes to MindMirror are tracked here. Dates are ISO 8601
and the format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

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
