# AUTOMATION — what runs where, and how to run it from any device

The key idea: **the automation runs on GitHub's servers, not on a laptop.**
Cloning the repo on a new device doesn't "move" the jobs — they're already
running 24/7 in the cloud. A new device only needs setup to *drive* them
(trigger manually, deploy, run tests locally). Everything is committed to the
repo, so a fresh clone + the bootstrap below = full control from anywhere.

## The jobs

| Job | Where it runs | Trigger | Needs LLM? | What it does |
|---|---|---|---|---|
| **research-sweep** | GitHub Actions (24/7) | every 4h @ :17 · push to main · manual | No | Security sweeps (canon grep, secret-shape scan, `npm audit`) + full asserting test battery. Commits a report to `research`; opens/closes a GitHub issue on hard-gate failure. Runs `qa/ci-sweep.sh`. |
| **claude** | GitHub Actions | `@claude` in an issue/PR comment | Yes | Interactive: answers, proposes fixes as PRs, triages issues. Dormant until enabled. |
| **claude-research** | GitHub Actions (24/7) | every 4h @ :41 · manual | Yes | Autonomous rotating-lens analysis → appends to `research` log, opens issues for P0/P1. The durable version of the in-session cron. Dormant until enabled. |
| _session cron_ | This Claude chat only | every 4h | Yes (me) | Same reasoning analysis, but **dies when the chat closes** and is **not portable**. `claude-research` replaces it once enabled. |

All three GitHub jobs touch only the `research` branch or CI config — they
**never edit `index.html` on main and never deploy.**

## First-time repo setup (do once, from any device)

1. **Secrets** — Settings → Secrets and variables → Actions → *Secrets*:
   - `ANTHROPIC_API_KEY` — a **FRESH** key from console.anthropic.com. Do NOT
     reuse the key that leaked into chat history (rotate that separately).
   - `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` — already set in Vercel; only needed
     in Actions if a workflow ever posts to the board (none do today).
2. **Variable** — same page → *Variables*: `ENABLE_CLAUDE_CI = true`.
   This is the master switch for the two LLM workflows; until it's `true` they
   stay dormant (no failing runs).
3. **Claude GitHub App** — install at https://github.com/apps/claude.
4. **PR permission** — Settings → Actions → General → Workflow permissions →
   enable "Allow GitHub Actions to create and approve pull requests."

`research-sweep` needs none of the above — it runs on the built-in token and is
live already.

## Onboarding a new device to DRIVE it (clone-and-go)

```bash
git clone https://github.com/ayaangazali/founder-mode.git
cd founder-mode
bash scripts/bootstrap.sh     # installs deps + Chromium, checks gh/vercel auth
```

Then authenticate the local tools the bootstrap flags as missing:
- `gh auth login` — GitHub CLI (manual workflow triggers, issues, PRs).
- `vercel login` + `vercel link` — deploys (`vercel deploy --prod`).
- Supabase admin (board wipes/reseeds): token lives in the macOS keychain item
  `Supabase CLI` on the original machine; on a new device create it with
  `security add-generic-password -s "Supabase CLI" -a posthog -w` (it prompts),
  or export `SUPABASE_ACCESS_TOKEN` for the session. Never commit it.

The game itself needs nothing: `open index.html` plays offline anywhere.

## Manual controls (from any authenticated device)

```bash
gh workflow run research-sweep.yml     # force a deterministic sweep now
gh workflow run claude-research.yml     # force an LLM analysis now (if enabled)
gh run list --workflow=research-sweep.yml   # see recent runs
gh run watch                                # follow the latest run live
bash qa/ci-sweep.sh && cat /tmp/ci-report.md # run the exact CI checks locally
```

## Cost note

`research-sweep` is free CI minutes. The two LLM workflows spend Anthropic API
credits per run — `claude-research` every 4h ≈ 6 runs/day. Tune the cron or
flip `ENABLE_CLAUDE_CI` off to pause spend. GitHub Actions minutes on private
repos also draw from the monthly free allotment (generous for this cadence).
