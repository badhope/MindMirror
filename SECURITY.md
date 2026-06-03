# Security

## Reporting a vulnerability

Email **security@mindmirror.app** (private, encrypted at rest by your
provider). Please don't open a public GitHub issue. Include a
reproducer, the impact, and the commit/tag. We'll acknowledge within
three business days and aim to ship a fix within 30 days.

PGP key: request one in your first email and we'll send it back.

## Supported versions

| Version  | Status               |
| -------- | -------------------- |
| `main`   | Active development   |
| `v1.x`   | Bug & security fixes |
| older    | End of life          |

## Threat model (in scope)

- JWT (HS256) auth with 7-day expiry; tokens carry only the user id.
- bcrypt password hashing with explicit 72-byte truncation.
- CORS allow-list enforced at startup; wildcard rejected.
- All Pydantic schemas strict; `avatar_url` restricted to `http(s)`.

## Out of scope (for now)

- Rate limiting on `/auth/*` is now enforced in-app
  (`slowapi`, 20 req/min) and returns HTTP 429 when exceeded.
- 2FA / WebAuthn, password complexity rules beyond a 6-char minimum,
  and forensic audit logging.

See [CHANGELOG.md](CHANGELOG.md) for the recent security-relevant
changes; see the backend source for the implementation.
