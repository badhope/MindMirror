# Changelog

All notable changes to MindMirror are tracked here. Dates are ISO 8601
and the format follows [Keep a Changelog](https://keepachangelog.com/).

> **Note:** This changelog covers the `main` branch (static, no-backend
> edition). Server-side changes (FastAPI, Postgres, Docker, etc.) live
> on the `server` branch and its own changelog.

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
  and the public-facing user guide all reflect the change.
- **Dependabot disabled.** `.github/dependabot.yml` is removed from
  both branches and the three leftover `dependabot/*` remote
  branches have been folded into a single commit on each branch.
- **Frontend dependency bumps folded in:** `playwright ^1.57.0` →
  `^1.60.0`, `@types/node ^22.19.19` → `^22.19.20`,
  `react-router-dom ^7.3.0` → `^7.17.0`. `package-lock.json`
  regenerated; typecheck, lint, build, and 887 unit-test assertions
  all pass.
- **Dead public assets removed.** `public/docs/hero-banner.jpg`
  (unreferenced) and 34 unused `tests/e2e/screenshots/*.png` files
  are gone.
- **About / contact info corrected.** All references to
  `mindmirror.app` (a domain we don't own) are replaced with the GitHub
  issue tracker. The on-page shareable-result HTML footer now links
  to the repo, not the dead domain.
- **i18n strings updated for the static build.** FAQ answers about
  data storage, licensing, and privacy now reflect the localStorage-only
  reality (no "online mode", no "MIT", no "docker compose").
- **Contact section rewritten.** The About page now links directly to
  GitHub Issues instead of a broken `mailto:` link.
- **CODEOWNERS cleaned up.** Removed backend/Docker entries that don't
  exist on this branch.
- **CONTRIBUTING.md updated.** Removed backend testing instructions,
  fixed branch name (`master` → `main`), removed dependabot mention.

### Added

- **Four new psychological scales** with 40+ items each, expanded from
  the original short forms via dimension-aligned question banks:
  - **SSRS** 肖水源社会支持量表 — 43 items (10 core + 30 bank × 3
    dimensions: subjective / objective / utilization + 3 extension)
  - **MBI-GS** Maslach Burnout Inventory — 40 items (15 core + 22
    bank × 3 dimensions: exhaustion / cynicism / efficacy + 3 ext)
  - **SWLS** Diener Satisfaction With Life Scale — 40 items (5 core
    - 33 bank × 6 themes: relationships / health / achievement /
      growth / meaning / daily + 2 extension)
  - **CD-RISC-10** Connor-Davidson Resilience Scale — 40 items
    (10 core + 27 bank × 5 sub-dimensions + 3 extension)
- **Bank questions are reverse-coded** to detect acquiescent responding
  and **behaviour-anchored** to discriminate people who would give
  similar abstract-self-evaluation answers but actually differ in
  lived experience.
- **Behavioral profile archetypes** — 16 new archetypes (4 per scale)
  derived from the extension items, complementing the score bands.
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

### Fixed

- Removed two stray `eslint-disable no-console` comments that
  ESLint was warning about.
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

- `SECURITY.md` — supported versions, disclosure process, threat model
  for the localStorage-only build, known limitations.
- `.editorconfig`, `.github/CODEOWNERS`, `CITATION.cff`.

## [1.0.0] — 2026-06-02

First public release. The React app runs as a static demo on GitHub
Pages with `localStorage` as the only data store.

Highlights:

- Big Five (NEO-PI-R, 50 items), PSS-10, GAD-7
- Mood tracker, achievements, CBT-style training plans
- Bilingual UI: English / 简体中文
- GitHub Actions: type-check + lint + build on every PR; Pages
  deploy on `main`

[1.0.0]: https://github.com/badhope/MindMirror/releases/tag/v1.0.0
