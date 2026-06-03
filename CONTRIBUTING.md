# Contributing to MindMirror

Thank you for your interest in contributing to MindMirror! This document
provides guidelines and instructions for contributing.

> **Other languages:** [简体中文](README.zh-CN.md) (general README)

---

## 🐛 Bug Reports

Before submitting a bug report:

- **Search** [existing issues](https://github.com/badhope/MindMirror/issues)
  to avoid duplicates.
- Use the [**Bug Report** template](.github/ISSUE_TEMPLATE/bug_report.yml).
- Include **browser / OS** information.
- Provide **steps to reproduce** and expected vs. actual behavior.
- If possible, provide a **minimal reproducible example** (CodeSandbox,
  StackBlitz, screenshots, screen recording, …).

## 💡 Feature Requests

We welcome feature requests! Please:

- **Search** existing issues and PRs first.
- Use the [**Feature Request** template](.github/ISSUE_TEMPLATE/feature_request.yml).
- Clearly describe **the problem** you're solving.
- Explain **why** this feature would benefit the project and the wider
  community.

## 🔧 Development Setup

### Prerequisites

- **Node.js** ≥ 18.0.0 (LTS recommended)
- **npm** ≥ 9.0.0
- **Python** 3.12 (only if you touch the backend)
- **Docker** + **Docker Compose** (only for the full-stack integration test)

### Local Development

```bash
# 1) Clone the repository
git clone https://github.com/badhope/MindMirror.git
cd MindMirror

# 2) Install dependencies
npm install

# 3) Start the dev server (with /api proxy)
npm run dev

# 4) (Optional) start the backend in another terminal
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python3 init_db.py --seed
python3 run.py
```

### Useful Scripts

| Command                | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start Vite dev server with HMR               |
| `npm run typecheck`    | Run TypeScript type checking                 |
| `npm run lint`         | Run ESLint                                   |
| `npm run format`       | Auto-format with Prettier                    |
| `npm run format:check` | Verify formatting without writing            |
| `npm run build`        | Production build (custom backend deployment) |
| `npm run build:pages`  | Build with `--base=/MindMirror/` (for Pages) |
| `npm run preview`      | Preview the production build locally         |

### Project Structure

```
MindMirror/
├── src/                          # React + TypeScript frontend
│   ├── components/              # Reusable UI components
│   │   ├── animations/          # Framer Motion animation primitives
│   │   ├── dashboard/           # Personal dashboard widgets
│   │   └── plugin/              # Plugin system UI
│   ├── data/                    # Built-in assessment question banks
│   ├── hooks/                   # Custom React hooks
│   ├── i18n/                    # en.ts, zh.ts translation tables
│   ├── lib/                     # apiClient + utility helpers
│   ├── pages/                   # Route-level pages
│   ├── services/                # Scoring, auth, mood, training, plugins
│   ├── store/                   # Zustand global state
│   ├── types/                   # TypeScript type definitions
│   ├── App.tsx                  # Root component (Router, layout)
│   └── main.tsx                 # Entry: createRoot, error boundary
├── backend/                     # FastAPI backend (Python 3.12)
│   ├── app/
│   │   ├── api/                 # Route handlers
│   │   ├── core/                # Security helpers
│   │   ├── models/              # SQLAlchemy 2 ORM models
│   │   ├── schemas/             # Pydantic v2 schemas
│   │   ├── config.py            # pydantic-settings
│   │   ├── database.py          # SQLAlchemy engine + session
│   │   ├── dependencies.py      # Reusable FastAPI dependencies
│   │   └── main.py              # FastAPI app entrypoint
│   ├── .env.example
│   ├── init_db.py               # Create tables + optional demo seed
│   ├── requirements.txt
│   └── run.py                   # Dev runner (auto-detects docker vs sqlite)
├── scripts/                     # Build helpers (postbuild.mjs, …)
├── public/                      # Static assets (favicons, og-image, docs/)
├── .github/
│   ├── workflows/               # CI + Pages deploy
│   ├── ISSUE_TEMPLATE/          # Bug / feature / assessment templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   └── dependabot.yml
├── Dockerfile                   # Backend image
├── Dockerfile.frontend          # Frontend image (multi-stage: node build → nginx)
├── docker-compose.yml           # postgres + backend + frontend
└── nginx.conf                   # Reverse proxy + SPA fallback
```

---

## 🌐 Internationalization (i18n)

MindMirror ships in two languages with a built-in switcher: **English**
(default) and **简体中文** (Simplified Chinese).

When adding a user-facing string:

1. Add the key to **both** `src/i18n/en.ts` and `src/i18n/zh.ts`.
2. Use the `t()` helper from `../i18n`.

```typescript
import { t } from '../i18n';

t(locale, 'section.key', { param: value });
```

To add a **new language**:

1. Create `src/i18n/<lang>.ts` with the same shape as `en.ts`.
2. Register it in `src/i18n/index.ts` (add to the `dictionaries` map and
   to the `Locale` type).
3. Add a button to `src/components/LanguageSwitcher.tsx`.
4. Add a quick link in both `README.md` and `README.zh-CN.md`.

---

## 📐 Code Style

- **Formatter**: Prettier — `npm run format`
- **Linter**: ESLint — `npm run lint`
- **TypeScript**: `strict: false` (intentionally — see `tsconfig.json`),
  but new code should still avoid `any` and `// @ts-ignore`.
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/)

```
<type>(<scope>): <description>

Types:  feat, fix, docs, style, refactor, test, chore, perf, build, ci
Scope:  auth, scoring, i18n, assessment, training, mood, ui, …
```

Examples:

- `feat(i18n): add Portuguese language support`
- `fix(scoring): correct T-score calculation for stress test`
- `docs(readme): clarify Docker quick-start`
- `refactor(components): extract ErrorBoundary into a shared module`

---

## 🧪 Testing

### Manual Smoke Test

```bash
# Build the production bundle
npm run build:pages

# Serve it locally (Python 3)
cd dist && python3 -m http.server 4173
# open http://localhost:4173/MindMirror/
```

### Automated Tests

Currently the project relies on TypeScript type checking and ESLint for
quality assurance. Unit tests with [Vitest](https://vitest.dev/) are on
the roadmap — see [open issues](https://github.com/badhope/MindMirror/issues?q=is%3Aissue+is%3Aopen+label%3Atesting).

When writing a new assessment scoring algorithm, please:

1. Cross-check your formula against a published source.
2. Add at least one golden test (hand-calculated expected output).
3. Document the source in the file header.

---

## 📋 Pull Request Process

1. **Fork & branch** off `master`:

   ```bash
   git checkout master
   git pull upstream master
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Develop**: make focused commits with clear messages.

3. **Verify** locally before pushing:

   ```bash
   npm run typecheck
   npm run lint
   npm run format:check
   npm run build:pages
   ```

4. **Push & open a PR** against `main`:

   ```bash
   git push origin feature/your-feature-name
   ```

   - Fill in the PR template completely.
   - Link related issues with `Closes #123` or `Refs #456`.
   - Add screenshots / recordings for UI changes.
   - Wait for CI to pass (typecheck + lint + Pages build).

5. **Review**: address feedback from maintainers, push fixes to the same
   branch — the PR will update automatically.

---

## 🧭 Adding a New Assessment

1. **Create the question data** in `src/data/`:

   ```typescript
   // src/data/myAssessmentData.ts
   export const myAssessmentData = {
     id: 'my-assessment',
     title: { en: 'My Assessment', zh: '我的测评' },
     description: { en: '…', zh: '…' },
     questions: [
       {
         id: 'q1',
         text: { en: 'Question text', zh: '问题文本' },
         options: [
           { value: 1, label: { en: 'Strongly disagree', zh: '非常不同意' } },
           { value: 5, label: { en: 'Strongly agree', zh: '非常同意' } },
         ],
         reverse: false,
         facet: 'openness', // which Big-Five facet, if applicable
       },
     ],
   };
   ```

2. **Implement scoring** in `src/services/`:

   ```typescript
   // src/services/myAssessmentScoring.ts
   export function calculateMyAssessmentScores(answers, questions) {
     // Your scoring logic here. Document the source.
   }
   ```

3. **Register the plugin** in `src/store/index.ts` (or the plugin registry)
   and **register the route** in `src/App.tsx`.

4. **Add translations** in `src/i18n/en.ts` and `src/i18n/zh.ts`.

5. **Add navigation** in `src/components/Sidebar.tsx` and a card on
   `src/pages/Home.tsx`.

6. **Cite the scale** in `CITATION.cff` and add a credit to
   `README.md → License & Citation`.

---

## ⚠️ Important Notes

- **Never commit secrets** — use `.env` for secrets, `.env.example` for
  templates. CI will fail if a real `.env` is committed.
- **Assessment content** — only use scientifically validated scales with
  proper references. Don't invent your own personality taxonomy.
- **Privacy** — all user-data handling must comply with privacy
  best-practices: no third-party analytics, no tracking pixels, no
  external fonts.
- **Accessibility** — follow [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)
  where feasible. Test with keyboard navigation and a screen reader.
- **Dependencies** — Dependabot opens weekly PRs; review them but don't
  blindly merge major-version bumps.

---

## 🙏 Thank You

Every contribution matters — code, docs, bug reports, translations,
design, and ideas. Thank you for making MindMirror better! 💚
