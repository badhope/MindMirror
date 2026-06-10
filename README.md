# MindMirror

> A quiet self-check tool that runs entirely in your browser.
> No account, no telemetry, no server. Just a page and a `localStorage`.

🌐 **Live demo:** <https://badhope.github.io/MindMirror/>
📖 **[User guide](USER_GUIDE.md)** (中文版见 [USER_GUIDE.zh-CN.md](USER_GUIDE.zh-CN.md))
🪟 **Self-host the full stack?** See the [`server` branch](https://github.com/badhope/mindmirror/tree/server)
for the FastAPI + PostgreSQL edition. The two branches are intentionally
kept parallel and **do not merge** — pick the one that fits how you
want to use it.

---

## What this is, in one paragraph

A single-page React app. You open it, answer some questions, get a
report. The whole thing is one static bundle; the only place your
answers ever live is your own browser's `localStorage`. If you close
the tab, open the page on a different device, or wipe site data,
**everything is gone** — and that is the feature, not a limitation.
We don't have a database. We don't have a server. We don't have a
"we value your privacy" page that takes 4,000 words to admit we
collect 47 categories of telemetry. There is nothing to collect.

Seven validated psychological scales ship in the box:

| Scale                            | What it measures                                           | Items |
| -------------------------------- | ---------------------------------------------------------- | ----- |
| **BFI** (Big Five / OCEAN)       | The personality traits most-used in modern psych research  | 60    |
| **PSS-10**                       | How often you felt overloaded in the last month            | 33    |
| **GAD-7**                        | Generalised anxiety, with the standard clinical cut-points | 28    |
| **SSRS** (肖水源 1986)           | Subjective / objective / utilisation social support        | 43    |
| **MBI-GS** (Maslach)             | Burnout across exhaustion / cynicism / efficacy            | 40    |
| **SWLS** (Diener)                | Life satisfaction, with theme sub-scores                   | 40    |
| **CD-RISC-10** (Connor-Davidson) | Resilience, with sub-dimension breakdown                   | 40    |

Long-form scales use a dimension-aligned **question bank** plus
**behaviour-anchored extension items** so people who would give
similar abstract self-evaluations but actually live differently
get separated. After the questionnaire you get a multi-axis report
(radar chart + plain-language explanation + a behaviour-anchored
archetype), and the result joins your private history so you can
watch yourself change over weeks and months.

Around the scales, there's a daily mood log, a CBT-style training
plan generator, and an achievement system. None of it is required
— you can ignore every feature except the questionnaire you came for.

## What this is not

It is worth being honest about the edges:

- **Not a clinical diagnostic tool.** A score of 17 on the GAD-7
  is a screening hint, not a diagnosis. If a scale says something
  worrying, take it to a clinician who knows you.
- **Not a research instrument.** The long-form scales are not
  re-validated against their full original samples; they exist so
  you can see a richer picture of yourself, not so you can publish
  papers. The original authors and citations are in
  [CITATION.cff](CITATION.cff) — cite _them_, not us.
- **Not a sync service.** There is no cloud. There is no account.
  If you switch browsers, you start over. That is the trade for
  the privacy guarantee.
- **Not a paid product.** The license is [PolyForm Noncommercial
  1.0.0](LICENSE): free for personal, academic, and non-profit
  use. If you want to wrap it in a paid coaching product, sell
  employee-screening to a for-profit, or charge a subscription,
  you need a separate agreement (open an issue on the repo).
- **Not a clone of [16Personalities](https://www.16personalities.com/),
  [MindGarden](https://www.mindgarden.com/), or any specific
  test-vendor product.** We are not affiliated with any of them.

## How to use it

### As a regular person

1. Open <https://badhope.github.io/MindMirror/>.
2. Pick a scale. Most take 5–15 minutes. There is no time limit per
   item, but the page will warn you if you go too fast (because
   acquiescent responding ruins the result).
3. Read the report. It has three parts: a numeric score with
   cut-points, a radar chart, and a behaviour-anchored archetype.
4. **Optional:** register a local account (PBKDF2, 200,000 iterations,
   in your browser — not sent anywhere). This lets you keep a
   history across scales and see how you change over time. To wipe
   it, open DevTools and run `localStorage.clear()`.

You can also use it fully anonymously as a guest. The local account
is just for keeping your own history organised.

### As someone running it on your own server / static host

You don't need us. The build output is plain static files.

```bash
git clone https://github.com/badhope/mindmirror.git
cd mindmirror
npm install
npm run build           # serves from "/"
# or
npm run build:pages     # serves from "/MindMirror/" (for GitHub Pages)
```

The `dist/` directory is the whole app. Drop it on any static host.
There is no `nginx.conf` to write, no `DATABASE_URL` to set, no
`docker compose up` to babysit. The page loads, the page works, the
page does not call home.

The CI workflow (`.github/workflows/deploy-pages.yml`) auto-publishes
to GitHub Pages on every push to `main`. If you forked the repo,
change `VITE_BASE_PATH` in the workflow to your repo name and rename
the Pages source to match.

### As a clinician or researcher

The scale items and scoring algorithms live in `src/data/` and
`src/services/`. Each scale is a self-contained module so you can
read it end-to-end without learning the rest of the app:

- `src/data/bfiData.ts`, `pss10Data.ts`, …, `resilienceData.ts` —
  the literal question banks, including reverse-coding flags
- `src/services/{scale}Scoring.ts` — the scoring service for each
  scale, with original-author thresholds preserved where the scale
  has them
- `src/types/index.ts` — the `UnifiedAssessmentResult` type that
  the dashboard / history / share views consume

The whole codebase is the documentation. There is no API to integrate
with, but if you want a CSV export of an individual's history, the
`Personal Data Center` page gives you a button that does exactly
that — it runs entirely client-side.

## How to extend it

There are three layers, from cheapest to heaviest.

### 1. Add a translation

`src/i18n/en.ts` and `src/i18n/zh.ts` are flat key-value tables.
Find a missing key, add the translation, run `npm run typecheck`.
No other file changes needed; the app reads them at runtime.

### 2. Add a new scale (the "long way")

This is roughly a day's work, mostly typing questions. Look at
`src/data/resilienceData.ts` for the most recent template — it
has the cleanest structure of any scale in the repo. You'll need:

1. A new `src/data/<yourScale>Data.ts` exporting the question
   bank, dimension metadata, severity bands, and archetype
   definitions. Reverse-coded items are flagged at the question
   level, not patched in at scoring time.
2. A new `src/services/<yourScale>Scoring.ts` exporting a function
   that takes the raw answers and returns a `UnifiedAssessmentResult`.
3. A new page route in `src/App.tsx` and an entry in
   `src/components/AssessmentList.tsx`.
4. i18n strings (English + Chinese) for the new scale's name,
   description, and dimension labels.
5. At least one unit test in `tests/unit/` that checks reverse-coding,
   score ranges, and level boundaries.

If you are porting a published scale, **open an issue first** with
the scale's citation and your licensing interpretation. We don't
ship scales we don't have the right to.

### 3. Add a plugin (the "short way")

The plugin system lives in `src/services/plugin/`. A plugin is a
plain TypeScript object that conforms to `PluginManifest` (see
`src/types/dataAbstraction.ts`) and ships as a JS file the user
loads at runtime. This is for power users who want to add their
own scales without forking the repo. It is functional, not
ergonomic — you should expect to read source. Plugin
docs are in `src/services/plugin/`.

## Architecture, in one diagram

```
                       ┌─────────────────────────────────────┐
                       │  React 18 + TypeScript + Vite 6     │
                       │  (one bundle, no SSR, no hydration) │
                       └────────────────┬────────────────────┘
                                        │
            ┌───────────────────────────┼───────────────────────────┐
            │                           │                           │
   ┌────────▼─────────┐       ┌─────────▼─────────┐       ┌─────────▼─────────┐
   │  Scale modules   │       │  Mood / Training  │       │     Plugins       │
   │  data + scoring  │       │  / Achievements   │       │ (runtime-loaded)  │
   └────────┬─────────┘       └─────────┬─────────┘       └─────────┬─────────┘
            │                           │                           │
            └───────────────────────────┼───────────────────────────┘
                                        │
                            ┌───────────▼───────────┐
                            │  localStorage (and    │
                            │  only localStorage)   │
                            └───────────────────────┘
```

There is no arrow leaving the box. That's the point.

## Testing

```bash
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run format:check # Prettier
npm run build        # Vite build
for f in tests/unit/*.mjs; do node --import tsx "$f"; done
```

The 887 unit-test assertions in `tests/unit/` are plain Node
scripts that import the same scoring modules the app does. They
do not need a browser; they do not need a database. If a refactor
breaks a scale's scoring, you'll know in under 10 seconds.

## License & contact

PolyForm Noncommercial 1.0.0 — see [LICENSE](LICENSE). Commercial
use needs a separate written agreement.

Bugs, scale translations, design critiques: open an issue.
Security: see [SECURITY.md](SECURITY.md) for the (private) reporting
path before disclosing publicly.

## Acknowledgements

The scales are not ours. The BFI items derive from the IPIP-NEO
items by [Oliver P. John & Sanjay Srivastava](https://ipip.ori.org/);
PSS-10 by [Sheldon Cohen et al. (1983)](https://doi.org/10.2307/2136404);
GAD-7 by [Spitzer, Kroenke, Williams & Löwe (2006)](https://doi.org/10.1001/archinte.166.10.1092);
SSRS by [肖水源 (1986)](https://doi.org/10.1002/da.10113);
MBI-GS by [Schaufeli, Leiter, Maslach & Jackson (1996)](https://doi.org/10.1111/j.2044-8325.1996.tb00625.x);
SWLS by [Diener, Emmons, Larsen & Griffin (1985)](https://doi.org/10.1207/s15327752jpa4901_13);
CD-RISC-10 by [Connor & Davidson (2003)](https://doi.org/10.1002/da.10113).
The bugs are ours.
