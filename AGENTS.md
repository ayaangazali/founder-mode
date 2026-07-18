# AGENTS.md - read this first, every session (CLAUDE.md is a symlink to this file)

## What this is
FOUNDER MODE: a single-file, pixel-art, Mario-style browser game satirizing SF startup culture, built to go viral on LinkedIn. The game is `index.html` — **one file, ~1,300 lines of vanilla JS + canvas. No frameworks. No build step. No image assets. Ever.** All sprites are `fillRect` calls on a 480×270 internal canvas.

The current `index.html` is the **QA-hardened war-room build**: fixed-timestep engine, checkpoint respawn, founder customization (6 skin tones / 4 hair / 6 hoodies), 4 zone biomes, 6 cameo NPCs, 3 easter eggs, hardened share loop. `index.v0.1.bak.html` is the pristine original — never modify it.

## Source-of-truth documents (in priority order)
1. `qa/FINAL-REVIEW.md` — adjudicated rulings from the design panel + confirmed-bug list. **Do not re-litigate its rulings** (§2 disputes, §6 dropped findings).
2. `docs/FOUNDER-MODE-BIBLE.md` — the unified design bundle (routes, losses, eggs, culture pack, speedrun contract).
3. `docs/MASTER-PLAN.md` — lore canon (§1.0 rules), copy decks, milestones, traction gate.
4. `docs/GAME-DESIGN.md` — code map (where every tweak lives). `qa/CHANGELOG.md` — what the fixers already changed.
5. `design/` — paste-ready specs: `sprites.js` (all new-entity draw functions), `level-cerebral-valley.js` (v1.0 world data, physics-validated), `gallery.html` (visual reference), `CAMEOS.md`.

## Canon rules (from MASTER-PLAN §1.0 — every change must pass)
1. Satire lives in the **mechanics**, not just labels.
2. Everything named in-universe: money=RAISED, health=RUNWAY, death=OUT OF RUNWAY. Never "score/HP/game over".
3. **Archetypes, never trademarks or identifiable real people.** No YC/Y-Combinator, no real logos, no thin-veil celebrity names. Acceptance letter = "DEMO DAY LETTER" from "THE ACCELERATOR".
4. The player is the butt of the joke, lovingly. No group is ever the punchline.
5. Deadpan corporate-absurd tone. "99.99% uptime*" is the register.
6. Real tropes + invented absurdity mix freely.

## Verification — after EVERY meaningful change
```bash
node test/smoketest.js && node test/playtest.js && node test/deathtest.js
```
All three must pass before moving on. `playtest.js` writes screenshots — LOOK at them after any visual change. Known pre-existing flake: a sub-frame `keyboard.press('Space')` can miss the title-start poll (documented in qa/CHANGELOG.md); re-run before assuming regression.

Canon greps that must stay empty in `index.html`:
```bash
grep -iE 'yc accepted|yc mode|patagonia|wework|y combinator' index.html
```

## Engineering contract
- Small diffs; one milestone (docs/MASTER-PLAN Part 3) per session; commit per item.
- The fixed-timestep loop (16.67ms accumulator) and the simulated `playMs` clock are load-bearing — never reintroduce `performance.now()` timing or per-rAF updates.
- Timer-gated features (T2D3 etc.) must read `playMs`, never wall clock.
- Visual ≥ hitbox: never grow a collision AABB to match art (FINAL-REVIEW ruling 2.3).
- Physics constants are a speedrun contract post-launch: changes require a version note.
- Difficulty is tuned via the levers table in docs/GAME-DESIGN.md, not new mechanics.

## Immediate TODOs (state of the world)
- [ ] Replace `GAME_URL = 'https://foundermode.lol'` placeholder with the real deployed URL (or buy that domain).
- [ ] BEFORE any public GitHub push: strip the "TIER 2 / risky" section from `design/CAMEOS.md` (right-of-publicity; see FINAL-REVIEW §4.4). qa/design-cameos.md is already ship-tier only.
- [ ] M2: deploy (docs/BUILD-GUIDE.md Steps 2–4; `og.png` already exists at repo root — just add the meta tags when the domain is known).
- [ ] M3: daily seed + `/api/og` + Supabase leaderboard (working code in docs/ROADMAP.md §7–9; the `api/` dir may be added — the GAME stays one file).
- [ ] M5 (ONLY if docs/MASTER-PLAN §4.3 traction gate opens): paste `design/level-cerebral-valley.js` + v1.0 bestiary from `design/sprites.js` per the integration checklist in that file.

## Never
- Add a framework, bundler, image asset, or second required file for the game itself.
- Gate play behind a signup wall, account, or anything between page-load and playing. (An optional, local-first display name is fine - it must never gate play; see the accounts/leaderboard work.)
- Ship a thin-veil celebrity cameo, on any tier, under any name.
- Mark a milestone done with a failing test.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
