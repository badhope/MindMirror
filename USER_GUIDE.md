# MindMirror — User Guide

> 📖 Other languages: [简体中文](USER_GUIDE.zh-CN.md)

A short, no-jargon walkthrough of how to use MindMirror. If you just
want to try it: **[open the demo](https://badhope.github.io/MindMirror/)** and come
back here if anything is unclear.

---

## 1. What you can do here

| Feature                          | What it gives you                                                       |
| -------------------------------- | ----------------------------------------------------------------------- |
| **Personality** (Big Five)       | A 60-item snapshot of where you sit on five big trait dimensions.       |
| **Stress** (PSS-10)              | A quick read on how much "load" you've been carrying lately.            |
| **Anxiety** (GAD-7)              | A standard anxiety screen, the same one a GP would use.                 |
| **Social support** (SSRS, 43)    | How strong your support network is — subjectively, objectively, and how well you use it. |
| **Burnout** (MBI-GS, 40)         | Emotional exhaustion, cynicism and professional efficacy at work.       |
| **Life satisfaction** (SWLS, 40) | How satisfied you are across relationships, health, achievement, growth, meaning and daily life. |
| **Resilience** (CD-RISC-10, 40)  | How well you adapt, recover, and grow through difficulty.              |
| **Mood log**                     | A daily 1-line check-in. After a couple of weeks, you get a trend line. |
| **Training plans**               | A short CBT-style plan you can do in your own time.                     |
| **History**                      | Every assessment you've ever done, side by side.                        |

## 2. The four-step flow

1. **Pick a scale.** The home page lists everything that's available.
   Each one tells you how long it takes and what it measures.
2. **Answer honestly.** No right or wrong answers — the more honest
   the response, the more useful the report.
3. **Read your report.** A short summary, a radar chart, and a list
   of subscores with plain-language explanations.
4. **Come back later.** Your results save to your private history.
   We recommend retaking stress and anxiety every 4–6 weeks so you
   can see the trend, not just the snapshot.

## 3. Two ways to use it

### 3a. The online demo (no setup)

Point your browser at
**[badhope.github.io/MindMirror](https://badhope.github.io/MindMirror/)**.
Everything you do lives in `localStorage` on your device. We don't
see it, and you can wipe it any time with `localStorage.clear()` in
the DevTools console.

Pros: zero friction, no account.
Cons: tied to one device/browser, no sync.

### 3b. Self-hosting (your own server)

This page is for the static, no-backend build on the `main` branch.
If you want a multi-user self-hosted install (FastAPI + Postgres,
OAuth, your own reverse proxy), switch to the `server` branch in
the same repo and follow the README there.

## 4. Privacy in plain English

- We don't have ads anywhere. There's no "sponsored" content.
- We don't run third-party analytics. We don't have a Google
  Analytics tag, a Facebook pixel, or anything similar.
- In the online demo, your data lives in _your_ browser. Closing
  the tab and re-opening in another browser starts from scratch.
- In a self-hosted install, your data lives in _your_ database.
  We have no remote access to it.
- We will never sell or share your data, because we never have
  it to begin with.

If you have a specific concern that this page doesn't answer,
email **an issue on github.com/badhope/mindmirror/issues** (replace `#` with `@`).

## 5. FAQ

**Q. Is this a clinical diagnosis?**
A. No. The scales are the same ones clinicians use as a _starting
point_, not as a final word. If something is bothering you
persistently, please talk to a professional.

**Q. Can I use this for my team?**
A. Yes. A self-hosted install lets everyone in your organisation
take assessments against the same database. Aggregate reports for
HR are on the roadmap.

**Q. How often should I retake?**
A. Personality is fairly stable; once a year is plenty. Stress and
anxiety shift with life — every 4–6 weeks is a good rhythm.

**Q. I deleted something by accident. Can I get it back?**
A. From the online demo, no — once it's gone from `localStorage`,
it's gone. From a self-hosted install, yes — restore from your
Postgres backup.

**Q. Do you have an app for iOS / Android?**
A. The web app installs as a PWA, so you can pin it to your home
screen and use it offline. A native app isn't planned; the web
stack is the product.

## 6. Keyboard shortcuts

The web app supports a few keyboard shortcuts in the questionnaire
view:

| Key                            | Action                           |
| ------------------------------ | -------------------------------- |
| `1`–`5` (or `1`–`7` for GAD-7) | Pick that answer                 |
| `←` / `→`                      | Previous / next question         |
| `Enter`                        | Submit when on the last question |

## 7. Getting help

- **Bug or weird behaviour?** Open an issue on
  [GitHub](https://github.com/badhope/MindMirror/issues).
- **Privacy or security question?** See [SECURITY.md](SECURITY.md).
- **Want to suggest a feature?** Open an issue and tag it "feature".
- **Email?** Open an issue on
  [github.com/badhope/mindmirror/issues](https://github.com/badhope/mindmirror/issues)
  and mark it as private if you don't want the question public.

We usually reply within 1–3 working days.
