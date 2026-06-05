# MindMirror

**A quiet, science-based app for checking in with yourself.**

Seven validated psychological scales — personality, stress, anxiety,
social support, burnout, life satisfaction, and resilience.
No accounts required. No ads. No data sold. Results stay on your device
or on infrastructure you control.

🌐 **Live demo:** [mindmirror.app](https://mindmirror.app) ·
📖 **For users:** [USER_GUIDE.md](USER_GUIDE.md) ·
📖 **用户指南:** [USER_GUIDE.zh-CN.md](USER_GUIDE.zh-CN.md)

---

## What it does

- **Big Five (BFI)** — five trait dimensions, sixty short statements
  (12 per trait, with reverse-coded items to catch acquiescent
  responding). The "ocean" model used in personality research
  since the 1980s.
- **PSS-10** — ten items that capture how overwhelmed you've felt
  in the last month. The most-used perceived-stress scale worldwide.
- **GAD-7** — seven items for generalised anxiety. A standard
  first-line screening tool.
- **SSRS** (43 items) — 肖水源's Social Support Rating Scale with
  a 30-item question bank across the subjective / objective /
  utilization dimensions, plus 3 behaviour-anchored extension items.
  Range 29–180.
- **MBI-GS** (40 items) — Maslach Burnout Inventory (General Survey)
  with a 22-item bank on the exhaustion / cynicism / efficacy
  dimensions, plus 3 extension items for behavioural profiling.
  Comprehensive 4-archetype burnout classification.
- **SWLS** (40 items) — Diener's Satisfaction With Life Scale with
  a 33-item bank across relationships / health / achievement /
  growth / meaning / daily themes, plus 2 extension items.
  Range 38–266.
- **CD-RISC-10** (40 items) — Connor-Davidson Resilience Scale
  with a 27-item bank across five sub-dimensions
  (adaptability / relationships / meaning / self-efficacy /
  optimism), plus 3 extension items. Range 0–148.

Each takes 5–15 minutes. After the questionnaire you get a multi-axis
report (radar chart + plain-language explanation), a behavioral
profile archetype derived from the extension items, and the result is
saved to your private history so you can see how you change over time.

A daily mood log, an achievement board, and a CBT-style training-plan
generator round out the app — everything you need for a regular
self-check-in, in one place.

## Who is it for

- **Individuals** who want a structured look at themselves.
- **Therapists & coaches** who want to send a client a baseline
  before the first session.
- **Small teams / HR** who want a one-off anonymous wellness
  check-in (GDPR-friendly by default).

## Why MindMirror

- **Open source** — MIT-licensed, audit the code, self-host for free.
- **No vendor lock-in** — your data sits in Postgres or in your
  browser. Both are easy to export and back up.
- **Real scales** — the same questionnaires a clinician would hand
  you, not a "vibe quiz".
- **Bilingual** — English and 简体中文 at the moment, easy to add
  more because the i18n layer is just two flat dictionaries.

## Try it (no install)

The static demo runs entirely in your browser — no account, no
network calls. Open it here:

**[mindmirror.app](https://mindmirror.app)**

Everything you do stays in `localStorage`. Open the DevTools console
and type `localStorage.clear()` to wipe it.

## Run the full version (local + your own database)

You'll need Docker and ~5 minutes.

```bash
git clone https://github.com/badhope/MindMirror.git
cd MindMirror
docker compose up -d
```

That's it. The frontend is on http://localhost:5173, the API on
http://localhost:8000/docs, and Postgres stores your data.

For a step-by-step dev setup (without Docker), see
[CONTRIBUTING.md](CONTRIBUTING.md). For a server-side deploy
(VPS, HTTPS, backups, monitoring), see
[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md).

### Want GitHub login on your self-hosted instance?

It's wired up, but the OAuth credentials are **not** shipped with
this repo (they'd be a secret leak). To turn it on, register a
GitHub OAuth App at <https://github.com/settings/developers> and
set the following env vars on the backend:

```bash
GITHUB_CLIENT_ID=<your-oauth-app-id>
GITHUB_CLIENT_SECRET=<your-oauth-app-secret>
# The exact URL GitHub will call back to. Must match the OAuth
# App's "Authorization callback URL" field byte-for-byte.
GITHUB_REDIRECT_URI=https://your-domain.example.com/api/v1/auth/oauth/github/callback
# Where the SPA lives — used to build the /auth/callback redirect
# that hands the code back to the SPA.
FRONTEND_URL=https://your-domain.example.com
# CRITICAL: this must be unset OR "false" in production. The dev
# shim is hard-disabled when ENVIRONMENT=production regardless of
# this flag, but you should still set it explicitly.
MINDMIRROR_DEV_OAUTH=false
ENVIRONMENT=production
```

A "Register with GitHub" button will then bounce the browser to
`github.com/login/oauth/authorize` and back to your `/auth/callback`.

> **Heads up — you need to do this yourself.** Nothing in the
> codebase will fetch credentials for you, and nobody is going to
> email them. The OAuth App dashboard is the single source of
> truth. If your backend is on a different host than your frontend,
> set `CORS_ORIGIN` to the frontend origin or the preflight will
> fail before OAuth even starts.

## How your data is handled

- **Static demo (the GitHub Pages one):** everything stays in your
  browser's `localStorage`. We never see it.
- **Self-hosted (your own server):** everything goes into your
  Postgres database. We never see it.
- **Cloud version:** if we ever offer one, it'll use the same
  self-hosted stack on infrastructure we control, with the same
  privacy guarantees. This will be opt-in and clearly labelled.

We don't have analytics, third-party trackers, or ads anywhere in the
codebase. The only network calls the frontend makes are to its own
backend.

For a fuller report, see [SECURITY.md](SECURITY.md).

## ⚠️ Security & privacy reminders (read me before deploying)

This is the "stuff the codebase can't do for you" list. None of
these are automated — if you skip them, you will eventually regret
it.

- **Never commit secrets.** `.env`, real database files, and
  `__pycache__/` are in `.gitignore` for a reason. If you ever paste
  a GitHub Personal Access Token, an OAuth client secret, a
  `SECRET_KEY`, or a database URL into a commit, **rotate it
  immediately** — git history is forever. The `git log -p` output
  is enough to scrape a leaked token.
- **Use a fine-grained GitHub PAT, not a classic one.** Classic
  PATs (the `ghp_…` kind) get every scope your account has. When
  you create a token just for pushing to your own repo, give it
  exactly one permission: `Contents: Read and write` on that one
  repository. No `repo`, no `workflow`, no `admin:org`.
- **Never paste a real PAT into a chat with an AI assistant.**
  Even if the assistant doesn't echo it back, the transcript may
  be logged, indexed, or read by a human. Generate a throwaway
  token with the minimum scope you need, use it once, and revoke
  it. Rotate any token that has ever left your machine.
- **Generate `SECRET_KEY` once, store it in a secret manager.**
  Use `openssl rand -base64 64`. Losing it invalidates every JWT
  in circulation; having it stolen lets an attacker mint valid
  sessions for any user.
- **`MINDMIRROR_DEV_OAUTH=true` is for your laptop only.** It
  bypasses GitHub entirely and accepts any "login" you type. The
  code hard-disables it when `ENVIRONMENT=production`, but you
  should also make sure it's not set in your prod `.env` or
  container config.
- **`CORS_ORIGIN` must match the frontend origin exactly.** If
  your backend is on `api.example.com` and your frontend is on
  `app.example.com`, set `CORS_ORIGIN=https://app.example.com` —
  not a wildcard, not a list, the exact origin. The OAuth flow
  fails silently with a CORS error otherwise.
- **HTTPS is not optional in production.** GitHub's OAuth flow
  requires HTTPS redirect URIs (except for `localhost`); the JWT
  cookie / `Authorization` header carries your session token in
  the clear otherwise. Put Caddy / Traefik / nginx in front.
- **GitHub Pages cache can be aggressive.** When you push a fix,
  Pages may keep serving the old bundle for a few minutes. Append
  `?v=2` to the URL or hard-reload (`Ctrl+Shift+R`) to bypass the
  CDN cache during testing.
- **The `MINDMIRROR_DEV_OAUTH` dev shim creates `*.example`
  accounts.** They live forever in your DB; the password hash is
  a random secret, not anything you can log in with from the SPA.
  Don't `git push` a `dev_mindmirror.db` file with real-looking
  data in it.
- **Email-based login is still available** even if you turn
  GitHub OAuth on. You don't have to choose; users can use
  either method, and both end up in the same `users` table.

## Tech stack (for the curious)

| Layer    | What we use                                       |
| -------- | ------------------------------------------------- |
| Frontend | React 18, TypeScript 5, Vite 6, Tailwind 3        |
| Backend  | Python 3.12, FastAPI 0.115, SQLAlchemy 2          |
| Auth     | JWT (HS256) + bcrypt; ~20-attempt/min rate limit  |
| Database | PostgreSQL 15 in Docker; SQLite works for dev     |
| Deploy   | Static site to GitHub Pages; backend anywhere     |
| CI       | GitHub Actions: typecheck + lint + build + pytest |

## Contributing

Bug reports, scale translations, and design critiques are all very
welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow.

If you're a clinician and want to suggest a scale, please open an
issue first — we want to talk about licensing, norming, and cultural
fit before adding anything new.

## License

MIT — see [LICENSE](LICENSE). Use it commercially, fork it, ship it
under your own brand. We just ask for a link back somewhere in the
credits.

## Acknowledgements

The BFI was developed by Oliver P. John and Sanjay Srivastava. PSS-10
was developed by Sheldon Cohen. GAD-7 was developed by Robert L.
Spitzer and colleagues. The **SSRS** (Social Support Rating Scale)
was developed by 肖水源 (Xiao Shuiyuan, 1986). The **MBI-GS** by
Christina Maslach & Michael Leiter (General Survey version adapted
by Wilmar Schaufeli et al., 1996). The **SWLS** by Ed Diener,
Robert Emmons, Randy Larsen & Sharon Griffin (1985). The
**CD-RISC-10** by Kathryn Connor & Jonathan Davidson (2003). The
psychology here is theirs; the bugs are ours.

---

_If something here helped you, we'd love to hear about it._
_If something is broken, please open an issue._
