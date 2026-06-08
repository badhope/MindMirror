# MindMirror

You are on the **`main` branch**. This is the static edition: a
single-page React app that runs entirely in your browser. Every
answer, every mood log entry, every result stays in your own
`localStorage`. There is no backend, no account system, and no
server. Open the page, take the questionnaire, walk away — the
data is yours.

If you want a multi-user self-hosted build (FastAPI + Postgres,
OAuth, deployable behind a reverse proxy), switch to the `server`
branch. The two branches share the same assessment content but are
**not merged** — pick the one that fits how you want to use it.

🌐 **Live demo:** <https://badhope.github.io/MindMirror/>
📖 **For users:** [USER_GUIDE.md](USER_GUIDE.md) ·
📖 **用户指南:** [USER_GUIDE.zh-CN.md](USER_GUIDE.zh-CN.md)

> **License:** PolyForm Noncommercial 1.0.0. Free for personal,
> academic, and non-profit use. If you want to use this for paid
> coaching, employee screening, hosted SaaS, or anything else that
> brings in money, you need a separate written agreement. See
> [LICENSE](LICENSE).

## What you can do with it

- **Big Five (BFI)** — 60 short statements, 12 per trait, with
  reverse-coded items. The "OCEAN" model used in personality
  research since the 1980s.
- **PSS-10** — 10 items, perceived stress in the last month.
- **GAD-7** — 7 items, generalised anxiety, first-line screening.
- **SSRS (43 items)** — 肖水源's Social Support Rating Scale,
  subjective / objective / utilization + 3 extension items.
- **MBI-GS (40 items)** — Maslach Burnout Inventory, exhaustion /
  cynicism / efficacy + 3 extension items.
- **SWLS (40 items)** — Diener's Satisfaction With Life Scale, 6
  sub-themes + 2 extension items.
- **CD-RISC-10 (40 items)** — Connor-Davidson Resilience Scale, 5
  sub-dimensions + 3 extension items.

Plus a daily mood log, an achievements board, and a CBT-style
training-plan generator.

Each scale takes 5–15 minutes. After the questionnaire you get a
multi-axis report (radar chart + plain-language explanation), a
behavioural profile archetype derived from the extension items, and
the result is saved to your private history so you can see how you
change over time.

## Run it

The build is a plain Vite app. From the repo root:

```bash
npm install
npm run dev
```

Then open <http://localhost:5173/>. That's it. No `docker compose`,
no `.env` file to fill in, no Postgres.

## Where your data lives

Everything you write (assessments, mood log, achievements, profile)
is in your browser's `localStorage`. The page makes no network
calls at runtime — it is a static bundle. To wipe your data, open
DevTools and run `localStorage.clear()`, or just clear site data
in your browser settings.

## Deploying

The fastest way is GitHub Pages: push to `main` and the
`deploy-pages` workflow builds the static bundle and publishes it.
The live site lives at <https://badhope.github.io/MindMirror/>.

Any static host works (Netlify, Cloudflare Pages, S3 + CloudFront,
your own nginx). Build with `npm run build:pages` if you're
serving from a subpath, or `npm run build` if you're serving from
the root.

## What this branch does NOT include

This branch intentionally does **not** ship:

- The FastAPI backend (lives on the `server` branch).
- OAuth, email-based multi-user auth, guest mode that talks to a
  server (the offline guest mode is kept because it is just a
  localStorage record).
- Docker / docker-compose / nginx configs.
- A database.

If you need any of those, switch to the `server` branch.

## Tech stack

| Layer    | What we use                                       |
| -------- | ------------------------------------------------- |
| Frontend | React 18, TypeScript 5, Vite 6, Tailwind 3        |
| Storage  | `window.localStorage` (no IndexedDB, no cookies)  |
| Auth     | None (single-device, local-only)                  |
| CI       | GitHub Actions: typecheck + lint + build + unit   |

## Contributing

Bug reports, scale translations, and design critiques are welcome.
See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow.

If you're a clinician and want to suggest a scale, open an issue
first — we want to talk about licensing, norming, and cultural fit
before adding anything new.

## License

PolyForm Noncommercial 1.0.0 — see [LICENSE](LICENSE). Commercial
use needs a separate agreement.

## Acknowledgements

The BFI was developed by Oliver P. John and Sanjay Srivastava. PSS-10
was developed by Sheldon Cohen. GAD-7 was developed by Robert L.
Spitzer and colleagues. The **SSRS** was developed by 肖水源
(Xiao Shuiyuan, 1986). The **MBI-GS** by Christina Maslach &
Michael Leiter (General Survey version adapted by Wilmar Schaufeli
et al., 1996). The **SWLS** by Ed Diener, Robert Emmons, Randy
Larsen & Sharon Griffin (1985). The **CD-RISC-10** by Kathryn
Connor & Jonathan Davidson (2003).
