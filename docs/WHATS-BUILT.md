# WHAT'S BUILT — the comprehensive breakdown (2026-07-13)

Everything that exists in FOUNDER MODE as of the audit fix pack, in one document.
This is the "what was made" report: the game, the systems under it, the server,
the tests, and the paper trail. Live at **https://sfspeedrun.com**.

---

## 1. The one-file rule

The entire game is `index.html` — ~3,900 lines of vanilla JavaScript, zero
frameworks, zero build step, zero image assets. Every sprite in the game is
`fillRect` calls on a 480×270 internal canvas scaled up to the window. The only
things that live outside the file are three serverless functions (`api/`),
because a leaderboard needs a database and a share card needs a renderer that
crawlers can fetch. `index.v0.1.bak.html` is the untouched original prototype.

Two rendering tricks make one file feel bigger than it is:

- **The crisp-text overlay.** Pixel-art at 480×270 makes text mushy when
  scaled. The game patches `ctx.fillText` so every string is mirrored onto a
  second, devicePixelRatio-sized canvas layered on top — pixels stay chunky,
  words stay sharp. `occlude()` punches holes in the overlay where world
  geometry should cover text, and speech bubbles stack per-frame so they never
  overlap each other.
- **The fixed-timestep engine.** A 16.67ms accumulator drives the simulation at
  exactly 60Hz regardless of display refresh, and a simulated `playMs` clock
  replaces wall time everywhere. Result: physics behave identically on a 144Hz
  gaming monitor and a throttled MacBook — the "speedrun contract." Sim state
  is only ever mutated in `update()`, never in `draw()`.

## 2. The world

**LEVEL_W = 9200px across five zones:** SOMA (garage-and-fog start) → The
Mission (murals, cafés) → Sand Hill Road (manicured, term sheets in the air) →
Cerebral Valley (AI-hype fever dream) → The Cloud (platforms in the sky,
because at some point every startup is just infrastructure). Checkpoints at
five spots; dying respawns you at the last one with a −25% "bridge round"
haircut on RAISED.

**Enemies are churn:** gremlins (churned users), MEETINGS (they multiply if
you let them), scooter bros, phantom users from your inflated dashboard, VC
term-sheet projectiles, drifting buzzwords (ALIGNMENT, SYNERGY). Stomping pays
— it's the core verb.

**Three bosses in walled arenas:** THE PLATFORM SHIFT (the ground itself turns
against you), THE VC (term-sheet barrages; his notice board explains the
mechanics), and THE MODEL (the AI that was supposed to be your moat). Each has
an HP bar, phases, and a payout.

**The finale:** past the third boss, the IPO bell. Reaching it arms a MASH-R
ceremony — the meter decays if you idle, fills if you mash, and at full it
commits the win (money, endTime, invulnerable confetti celebration) over a
fully drawn Golden Gate bridge: towers, crossbeams, sagging cables with
suspenders, deck.

**Daily market conditions:** a mulberry32 PRNG seeded from the date picks the
day's market — bull run (+1 starting heart), DOWN ROUND SEASON, CONSOLIDATION,
LAYOFFS SZN, AI HYPE CYCLE and friends — each with real mechanical modifiers.
Same day = same world for everyone, which is what makes the daily leaderboard
a fair fight.

## 3. Who you are (the pickers)

All chosen on the title screen, all persistent, all visible on your badge:

- **Founder customization:** 6 skin tones × 4 hairstyles × 6 hoodie colors.
- **Cofounder [X]:** TECHNICAL (+8% move speed), BUSINESS (+1 interview
  answer), AI (nudge + coin magnet), CMO (coins become *impressions*, $0 REAL
  DOLLARS — the frame is the joke), or MOM (+1 heart, and the mom round is
  guaranteed).
- **Pedigree [P]:** the valuation multiplier with baggage. SERIAL FOUNDER ×5
  (−1 heart — you've done this before, you're tired), STANFURD DROPOUT ×10,
  30 UNDER 30 ×15 (phantom users haunt you; they pay nothing — they're not
  real), TEAL FELLOW ×20 (can't use the pitch deck; ideology), NEPO FOUNDER
  ×50 (a board-member drone periodically syncs you 0.8× slower), ex-SYNERGY.AI
  ×100 (the final boss remembers you: +2 HP).

## 4. The mini-games

- **Coffee chats** (3 tables): timed two-option trivia in startup-speak; 3/3
  pays the full $150K check. Answer sides are randomized per question via a
  bit-mix of the run's roll — mashing one arrow doesn't work.
- **THE ACCELERATOR interview** (the door at x900): 7 questions, 15 seconds
  TOTAL for all seven, deadpan-absurd answer bank. 7/7 stamps **BATCH F26** on your badge and
  obituary forever. Same anti-mash randomization.
- **The intern fair:** booths you hire from by standing still (dwell-to-hire —
  sprinting past never triggers it). GRINDER, 10X (tanks exactly one hit for
  you, then quits to start a competitor), and colleagues. Interns are remote:
  they help, they don't follow you around the map.
- **The mom round:** hit $0 RUNWAY and — if you took MOM as cofounder, or a
  1-in-6 roll past the 20-second mark — the screen stops: mom wires $2K and
  two hearts. Once per run. She believes in you.

## 5. The comedy layer

- **16 real-startup billboards** along the route at parallax, consent-tracked
  in PARTNERS.md, never on share surfaces (probe-gated). Plus the "IS CODE
  DEAD?" conference panel staffed entirely by archetypes and one intern,
  because the big names canceled.
- **Six parody celebs** scattered across the map (RISKY_CAMEOS tier,
  owner-approved, one const kills them all), each riffing on the
  code-is-dead beat. Draw-only, no hitboxes, grep-gated off every share
  surface.
- **Archetype NPCs** with speech bubbles, an emotional-support corgi (petting
  it is a valuation multiplier — DOG MODE), three easter eggs (Konami among
  them), and popup one-liners tuned to the "99.99% uptime*" register.
- **HYPERGROWTH DAILY:** die and the end screen renders your startup's
  obituary as a newspaper front page — your name in the headline ("AYAAN DIES
  IN MEETING"), cause of death, a pull quote, a ticker. Win and you get the
  victory edition ("i never doubted us"). Toggle to the classic badge; save
  either as a PNG.

## 6. Scoring + the leaderboard

**VALUATION = RAISED × speed × discipline × corgi × pedigree.** The breakdown
card at the end shows every multiplier line, so the absurdity is legible.

**The board** (Supabase, one project, one table): daily, keyed to the seed, 
ranked `won DESC, val DESC, time ASC` so a slow win always beats a fast
farmed loss. Client: a 🏆 chip on the title screen, top-10 panel with VIEW TOP
100 expand-in-view, post-once-per-run with your persistent 14-char name.
Server: plausibility gate (RAISED ≤ $6M cap, valuation ≤ RAISED × max-legit-
multiplier-chain, 2.4M absolute), profanity blocklist with leet-speak folding,
unique-(seed,name) index with a compare-and-PATCH race handler. Rows are never
deleted (owner rule).

**The share loop:** the share button emits a `/api/r` result URL. Crawlers
unfurl it into THAT RUN's card — outcome, founder name, RAISED, TIME,
VALUATION, PEDIGREE — rendered by `/api/og` (satori, params strictly bounded);
humans get bounced straight into the game. Badge PNG + clipboard + native
share sheet all fall back gracefully. Analytics: a four-event funnel
(start → first_boss → badge_screen → win) on Vercel Analytics.

## 7. The test rig

Everything asserts and exits nonzero (as of the fix pack — they used to be
decorative, and the moment they weren't, one caught a real bug):

- `test/smoketest.js` — boots, starts, no console errors.
- `test/playtest.js` — plays a full win and a full death with screenshots,
  `must()`-gated at every stage.
- `test/deathtest.js` — death → OUT OF RUNWAY → R → verified-fresh run.
- `test/fullrun.js` — a sense-act bot that plays the entire game (reads the
  world, jumps gaps, fights bosses, mashes the bell) under a death budget;
  `--casual` runs the tourist profile.
- **11 qa/ probes:** mini-games, leaderboard (over a local http stub), celebs
  (incl. the names-never-on-share-surfaces grep gate), billboards (same gate),
  obituary, moments, daily seed, and the rest of the war-room suite.

## 8. The paper trail

`docs/AUDIT-2026-07-13.md` — a six-lens, ~70-finding audit of the whole repo,
with §8 marking what the fix pack closed. `qa/CHANGELOG.md` — every shipped
change with reasoning. `qa/FINAL-REVIEW.md` — the design panel's rulings.
`PARTNERS.md` — the billboard consent ledger. CLAUDE.md — the constitution,
rewritten to match reality. The v0.1-era design docs carry stale-doc banners
and are kept as history.

## 9. What the fix pack changed (this pass, condensed)

1. **Killed both economy exploits** — the 30 UNDER 30 phantom farm (phantoms
   now pay $0 but still count for the ZERO CHURN badge) and the bell
   double-payout (win commits atomically at meter-full; dying mid-confetti
   can no longer eat a win or re-arm the bell).
2. **Made the leaderboard defensible** — win-first ranking, server-side
   plausibility caps, profanity+leet filter, insert-race handling, bounded
   share-card params so forged cards can't exceed a legit run.
3. **Made the mini-games honest** — randomized answer sides, a rewritten
   interview bank where the short answer is actually right, chat intro
   timing, power timers that keep ticking indoors, throwDeck gated during
   dialogue.
4. **Wired the share loop** — /api/og went from dead code to the unfurl for
   per-run /api/r result links.
5. **Made the tests real** — asserting gates (which instantly exposed a
   days-old silent playtest break), plus committed probes for every v1.2/v1.3
   feature and the leaderboard client.
6. **Made the docs true** — CLAUDE.md reconciliation, cameo-doc §4 strip,
   stale banners, status corrections, this document, and the README.

## 10. Still open (owner actions)

- Rotate the Anthropic API key that was pasted into an early chat.
- Collect written yeses for PARTNERS.md boards (CLEAN included).
- Run docs/LAUNCH-PLAYBOOK.md — the game is more finished than its launch.
- Buy the joke domain, if wanted; swap GAME_URL and og tags.
- Backlog by judgment: endings pack, all-time board tab, board-member-from-
  term-sheets, world-stretch (docs/AUDIT-2026-07-13.md §7/§8).
