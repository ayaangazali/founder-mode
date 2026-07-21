# PROJECT CONTEXT — the decision ledger

The single brief for picking this project up cold (new device, new session, new
collaborator). It captures **what was decided and why** — the context that isn't
obvious from the code. For the constitution read [`../CLAUDE.md`](../CLAUDE.md);
for the feature breakdown read [`WHATS-BUILT.md`](WHATS-BUILT.md); for how the
automation runs read [`AUTOMATION.md`](AUTOMATION.md); for change history read
[`../qa/CHANGELOG.md`](../qa/CHANGELOG.md). This file is the "why."

---

## What it is
FOUNDER MODE — a single-file, pixel-art, Mario-style browser platformer
satirizing SF startup culture, built to be shared on LinkedIn. The game is
`index.html`: ~4,000 lines of vanilla JS on a 480×270 canvas. No framework, no
build step, no image assets. **Live at https://sfspeedrun.com.**

## The owner & working style
- Solo founder-developer, ships fast, communicates in quick heavy-typo bursts.
- Wants deliverables for a "coworker chat" as single self-contained paragraphs.
- Prefers: archetypes over real people (absolute), steady visuals (no flicker),
  readable text, paragraph-style handoffs.
- Reviews live by playing; most changes come from real playtest reactions.

## Canon (every change must pass — MASTER-PLAN §1.0)
1. Satire lives in the **mechanics**, not just labels.
2. Everything named in-universe: money = **RAISED**, health = **RUNWAY**, death
   = **OUT OF RUNWAY**.
3. **Archetypes, never trademarks or identifiable real people** — two
   owner-ruled, gated exceptions (below).
4. The player is the butt of the joke, lovingly. No group is the punchline.
5. Deadpan corporate-absurd tone ("99.99% uptime\*").
6. Real tropes + invented absurdity mix freely.

---

## Decision ledger (owner rulings + rationale)

**Platform / hosting**
- Canonical domain is **sfspeedrun.com** (owner-bought 2026-07-14, Vercel
  nameservers, apex + www live). Old `foundermode.vercel.app` still serves so
  links already in the wild keep working. All host refs centralize on
  `GAME_URL`; cutover procedure in [`DEPLOY-CHECKLIST.md`](DEPLOY-CHECKLIST.md).
- One file forever: no framework, bundler, image asset, or second required file
  for the game. `api/` (3 serverless functions) is the only sanctioned code
  outside `index.html`. `index.v0.1.bak.html` is the untouched original.
- **Engine ruling (2026-07-20, re-affirmed on request): vanilla JS + canvas 2D
  is the engine.** Alternatives were weighed and rejected: Phaser/PixiJS add a
  100KB+ runtime and a build step for features the game doesn't use (the whole
  scene is `fillRect` on 480×270); Godot/Unity WebGL exports are multi-megabyte
  multi-file bundles that break "one file, loads instantly, no build". The
  fixed-timestep accumulator + `playMs` sim clock already solve the hard
  engine problems (determinism, pause, tab-throttle). Any future perf work
  optimizes *within* this choice — culling, allocation discipline, layer
  caching — never by swapping runtimes.

**Two gated exceptions to "archetypes only"** (owner owns the business risk):
- **RISKY_CAMEOS** — 6 parody tech celebs, draw-only, zero hitboxes, one const
  kills them all. Names must NEVER reach badge/obituary/share text
  (`qa/celebs-probe.js` grep-gates it).
- **Real-startup billboards** — consent tracked in [`../PARTNERS.md`](../PARTNERS.md);
  names never on share surfaces (`qa/billboards-probe.js` gates it). Roster v3
  (2026-07-14): 16 boards, CLEAN + DEEL removed, NOZOMIO added. **No board is
  `partner:true`** — no written yes collected yet — so the SPOTTED popup is
  dormant (code kept, reactivates on the first recorded yes).

**Leaderboard** (owner: "let people think others already played; incentivize
beating them")
- Supabase daily board, keyed to the date seed, ranked `won → val → time` so a
  slow win always beats a farmed loss. Rows are **never deleted** (owner order).
- Defensible not bulletproof: server plausibility gate (raised ≤ $6M, val ≤
  raised×390+10 ≤ $2.4B, wins ≥ 45s), leet-folding profanity filter,
  one-per-(seed,name). HMAC consciously declined — client is open text; a secret
  in page JS is theater, and the caps bound damage on a joke board.
- Seeded with a fictional founding class via `qa/seed-board.js` (realistic
  American/Mexican/Asian first names + kept troll handles). Daily board → rows
  age out with the seed; re-run per morning if a lived-in board is wanted.
- Formatting: aligned columns (medal/rank · name · valuation · outcome · time),
  gold top-3, zebra rows, VIEW TOP 100 expand.

**Unicorn gate** (owner: "🦄 shouldn't be free")
- 🦄 only at VALUATION ≥ $1B; sub-$1B wins render 🐴 ("you're a horse until
  you're a unicorn"); losses 💀. Everywhere a win-emoji sits by a valuation.

**Bosses are the funding rounds** (owner framing)
- PRE-SEED (THE PLATFORM) → SEED (CHAD CAPITAL) → SERIES A (SYNERGY.AI). Arena
  entry banners the round; the kill closes it; the Series A kill adds
  "technically, you can IPO now." — which the bell already is. Framing only;
  HP/arenas/mechanics unchanged.

**Mini-game readability** (from a real playtester who didn't get the arrows)
- Coffee chat + interview dialogue moved to the TOP with an explicit "← picks
  the left answer, → the right" line. Clocks loosened (chat 6s→9s, interview
  10s→15s total). TIME bar labeled, reddens + blinks late; whole dialogue
  judders ±1px in the final seconds (draw-only; HUD + sim exempt).

**Input** (owner bug: a MacBook where only WASD+X worked)
- All key events normalized through `normKey()` — e.key, a legacy-name map,
  e.code physical fallback, IME-swallowed-letter recovery. smoketest synthesizes
  the deviant events so the field bug can't return.

**Burn rate — KEPT after owner query** ("why do I take damage standing still?")
- It's canon (satire in mechanics: existing costs money). Standing still 6s
  burns 1 RUNWAY; smoke warns at 3s; moving/robotaxi/corgi exempt; the burnout
  obituary + WITNESSED HISTORY egg depend on it. AFK is now safe anyway — pause
  freezes the world and there's a button for it.

**Pause + navigation** (owner ask)
- ⏸ PAUSE chip (desktop) + Escape + touch button → a menu with BACK TO WORK and
  SHUT IT DOWN (surrender to title, fresh run staged). Both end cards gained a
  TITLE SCREEN button. Pause freezes `playMs` (speedrun contract).

**Cut: MEETLY.AI aftermath** (owner: "I don't get the papers thing")
- The post-VC-boss recap email + chasing ACTION ITEMS paperwork confused
  playtesters and smothered the win moment — removed. The do-nothing notetaker
  drone in the arena stays (that's the joke).

**Analytics**
- Four-event funnel (start → first_boss → badge_screen → win) mirrored to Vercel
  Analytics **and** PostHog (project 511099, US cloud, autocapture off,
  http(s)-only so file:// + probes stay offline).

**Engineering contract** (non-negotiable)
- Fixed-timestep 60Hz loop + simulated `playMs`; never wall-clock timing, never
  sim mutation in `draw()`. Physics are a speedrun contract — changes need a
  CHANGELOG version note. Small diffs, commit per item, CHANGELOG per change.
- Tests assert (exit codes). Never mark a milestone done with a failing test.

**Automation** (owner: "analyze for vulns/bugs every 4h; runnable from any
device 24/7; auto PRs + issues")
- Deterministic half is live and free: `research-sweep` GitHub Action (every 4h
  + push + manual) runs the sweeps + full battery, commits reports to the
  `research` branch, auto-files a GitHub issue on hard-gate failure. Never edits
  main, never deploys.
- LLM half is committed but dormant behind `ENABLE_CLAUDE_CI`: `claude.yml`
  (interactive `@claude`) + `claude-research.yml` (autonomous rotating-lens
  analysis → issues/PRs). Needs a **fresh** `ANTHROPIC_API_KEY` secret.
- Findings never touch main until triaged. Full map: [`AUTOMATION.md`](AUTOMATION.md).

---

## Current live state (2026-07-15)
- **Domain:** sfspeedrun.com (prod), old Vercel host still serving.
- **Game:** `index.html` @ ~4,000 lines, 5 zones, 3 bosses, MASH-R IPO finale.
- **Leaderboard:** live; a real $1.11B owner win (AYAAN) is the first true 🦄.
- **Analytics:** Vercel + PostHog wired.
- **Automation:** research-sweep live; LLM workflows dormant pending the key.
- **Branches:** `main` = prod; aliases (`billboards`/`build-v1.2`/`humor-patch`/
  `pedigree`/`board-and-domain`) fast-forward to main; `testing-pedigree` =
  main + TEST_MODE god-mode kit (never merged); `research` = analysis only.

## Doc map
| Doc | Role |
|---|---|
| [`../CLAUDE.md`](../CLAUDE.md) | Constitution — read first, every session |
| [`PROJECT-CONTEXT.md`](PROJECT-CONTEXT.md) | This file — decisions + why |
| [`WHATS-BUILT.md`](WHATS-BUILT.md) | Full feature breakdown |
| [`AUTOMATION.md`](AUTOMATION.md) | What runs where + per-device onboarding |
| [`DEPLOY-CHECKLIST.md`](DEPLOY-CHECKLIST.md) | Domain-cutover steps |
| [`AUDIT-2026-07-13.md`](AUDIT-2026-07-13.md) | Six-lens audit + §8 fix-pack status |
| [`../qa/CHANGELOG.md`](../qa/CHANGELOG.md) | Every shipped change + reasoning |
| `qa/RESEARCH-LOG.md` + `qa/CI-SWEEP-LOG.md` (on the **`research`** branch) | Continuous vuln/bug findings + CI sweep reports |
| [`../PARTNERS.md`](../PARTNERS.md) | Billboard consent ledger (single source) |
| v0.1-era docs (GAME-DESIGN, BIBLE, MASTER-PLAN, ROADMAP, BUILD-GUIDE, BILLBOARDS-FINAL) | History only — carry stale-doc banners |

## Open owner-action items
- [ ] Rotate the Anthropic API key that leaked into chat history (then a NEW key
      for the `ANTHROPIC_API_KEY` CI secret if enabling the LLM workflows).
- [ ] Collect written billboard yeses in PARTNERS.md (unlocks SPOTTED).
- [ ] Run [`LAUNCH-PLAYBOOK.md`](LAUNCH-PLAYBOOK.md) incl. LinkedIn Post
      Inspector on an `/api/r` link with the new domain.
- [ ] Refresh `og.png` (static unfurl is v0.1-era; per-run `/api/r` cards are current).
