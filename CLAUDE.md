# CLAUDE.md — read this first, every session

## What this is
FOUNDER MODE: a single-file, pixel-art, Mario-style browser game satirizing SF startup
culture, built to go viral on LinkedIn. **LIVE at https://foundermode.vercel.app.**
The game is `index.html` — **one file, ~3,900 lines of vanilla JS + canvas. No
frameworks. No build step. No image assets. Ever.** Sprites are `fillRect` calls on a
480×270 canvas; text renders crisp via a devicePixelRatio overlay canvas. `api/` holds
three small serverless functions (leaderboard, per-run og card, result-URL page) — the
GAME itself stays one file. `index.v0.1.bak.html` is the pristine original — never
modify it (and note it still contains pre-sanitize brand strings; it is deploy-excluded
but ships with the repo).

Current build: 5 zone biomes (SOMA → THE CLOUD, LEVEL_W 9200), 3 bosses, checkpoint
respawns, founder customization + [X] cofounder + [P] pedigree pickers, coffee-chat and
accelerator-interview mini-games, intern fair, the mom round, daily-seed market
conditions, 17 real-startup billboards (PARTNERS.md), 6 owner-approved parody celebs,
VALUATION scoring, a Supabase daily leaderboard, and the MASH-R bell finale.

## Source-of-truth documents (in priority order)
1. `qa/FINAL-REVIEW.md` — adjudicated rulings + confirmed-bug list. Do not re-litigate,
   BUT note two rulings were superseded by explicit owner calls recorded below.
2. `docs/FOUNDER-MODE-BIBLE.md` + `docs/MASTER-PLAN.md` — design canon & lore (§1.0
   rules still bind; feature lists are historical — trust the game + CHANGELOG).
3. `qa/CHANGELOG.md` — what changed and why. `docs/CLIP-REPORT.md` — shipped moments +
   spec deviations. `docs/AUDIT-2026-07-13.md` — full findings + backlog.
4. `PARTNERS.md` — billboard consent ledger. `docs/GAME-DESIGN.md` and most other
   docs/ files are v0.1-era and stale; read them as history, not fact.

## Canon rules (MASTER-PLAN §1.0 — every change must pass)
1. Satire lives in the **mechanics**, not just labels.
2. Everything named in-universe: money=RAISED, health=RUNWAY, death=OUT OF RUNWAY.
3. **Archetypes, never trademarks or identifiable real people** — with two owner-ruled
   exceptions, both gated:
   - **RISKY_CAMEOS celebs** (parody names, draw-only, zero hitboxes): owner was briefed
     3× on right-of-publicity and owns the call. One const kills them all. Their names
     must NEVER reach badge/obituary/share text (qa/celebs-probe.js grep-gates it).
   - **Real-startup billboards**: consent tracked in PARTNERS.md; names never on share
     surfaces (qa/billboards-probe.js gates it). Flip partner:true only with recorded
     evidence.
4. The player is the butt of the joke, lovingly. No group is ever the punchline.
5. Deadpan corporate-absurd tone. "99.99% uptime*" is the register.
6. Real tropes + invented absurdity mix freely.

## Verification — after EVERY meaningful change
```bash
node test/smoketest.js && node test/playtest.js && node test/deathtest.js
```
All three ASSERT and set exit codes (since 2026-07-13). The full gate before any
merge/deploy also includes:
```bash
for f in qa/*-probe.js qa/verify-daily-seed.js; do node "$f" || exit 1; done
node test/fullrun.js          # sense-act bot, clean profile (budget 6 deaths)
node test/fullrun.js --casual # tourist profile (budget 12) — note the flag needs --
```
Known: daily seeds change difficulty; before blaming a diff for a bot failure, run the
same bot in a worktree at the pre-change commit (same day) and compare.
Canon greps that must stay empty in `index.html`:
```bash
grep -iE 'yc accepted|yc mode|patagonia|wework|y combinator' index.html
```

## Engineering contract
- Small diffs; commit per item; CHANGELOG entry per shipped change.
- The fixed-timestep loop (16.67ms accumulator) and the simulated `playMs` clock are
  load-bearing — never reintroduce wall-clock timing or per-rAF sim updates (state may
  only be mutated in update(), never in draw()).
- Timer-gated features read `playMs`, never wall clock. The daily seed's calendar read
  is the single sanctioned exception.
- Visual ≥ hitbox (FINAL-REVIEW 2.3). Physics constants are a speedrun contract —
  changes require a CHANGELOG version note.
- Difficulty is tuned via the levers table concept (GAME-DESIGN.md is stale; the levers
  live in code comments at their sites), never via new mechanics.

## Open TODOs (owner-action unless marked)
- [ ] Buy the joke domain (foundermode.lol etc.) → swap GAME_URL + og tags + api URLs.
- [ ] Rotate the Anthropic API key that was pasted into chat history.
- [ ] Execute docs/LAUNCH-PLAYBOOK.md (pick a day; run the pre-flight incl. LinkedIn
      Post Inspector + iOS Safari badge-save check).
- [ ] PARTNERS.md outreach: get written yeses; record evidence links (CLEAN included).
- [ ] Refresh og.png to current badge art (the static unfurl is v0.1-era) — or rely on
      the new /api/r result links which unfurl per-run cards.
- [ ] BEFORE making the repo public: this file's celeb/billboard gates are the policy,
      but ALSO purge index.v0.1.bak.html brand strings or exclude it, and re-check
      docs/qa for anything you wouldn't defend in public.
- [ ] Backlog lives in docs/AUDIT-2026-07-13.md §7 (endings pack, world-stretch, etc.).

## Never
- Add a framework, bundler, image asset, or second required file for the game itself.
- Add signup, accounts, or anything between page-load and playing.
- Add a NEW real-person cameo or real-brand board without an explicit owner ruling
  recorded here and in PARTNERS.md.
- Mark a milestone done with a failing test.
