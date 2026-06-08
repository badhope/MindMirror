# Security

## Reporting a vulnerability

Open a **private** issue or contact the maintainer via the email
linked in [README.md](README.md). Please don't post vulnerabilities
in a public issue. Include a reproducer, the impact, and the
commit/tag. We'll acknowledge within three business days and aim
to ship a fix within 30 days.

## Supported versions

| Branch / version | Status               |
| ---------------- | -------------------- |
| `main`           | Active static build  |
| `server`         | Active self-hosted   |
| older            | End of life          |

## Threat model (in scope)

- The static build keeps all user data in `localStorage` on the
  device. There is no server-side trust boundary in the
  `localStorage`-only mode.
- The local "auth" uses PBKDF2-HMAC-SHA-256 (200,000 iterations)
  with a per-browser random salt. Password hashes are never sent
  off the device. The HMAC-signed local token is a forgery
  deterrent, not a real credential — anyone with DevTools can
  read or write `localStorage`.
- No third-party scripts, no analytics, no fingerprinting, no
  remote network calls at runtime.

## Out of scope (for now)

- Server-side rate limiting, 2FA / WebAuthn, password complexity
  rules beyond a 6-char minimum, and forensic audit logging. The
  static build has no server, so these are only relevant on the
  `server` branch.

See [CHANGELOG.md](CHANGELOG.md) for the recent security-relevant
changes.
