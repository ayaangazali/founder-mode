# FOUNDER MODE — THE BIBLE

> **STALE-DOC NOTICE (2026-07-13):** this document describes the v0.1 build
> (~1,300 lines, 4 zones, no mini-games). The shipped game is ~3,900 lines with
> 5 zones, mini-games, leaderboard, and the MASH-R finale. Read this as design
> history; for current truth use CLAUDE.md, qa/CHANGELOG.md, and
> docs/AUDIT-2026-07-13.md.
### One bundle. Everything from this entire project, stitched together.

This document consolidates every piece of work produced across this project — the master plan, the lore, the design kit, the level data, the cameo file, the QA war-room — and answers, in one place: how it loads, how it plays, how it's stitched together, every route, every loss, every easter egg, every speedrun trick, and every way to break it.

**The bundle manifest (what exists and where):**

| File | What it is |
|---|---|
| `index.html` | The game (v0.1 shipped; QA-hardened build incoming from the fixer agents) |
| `docs/MASTER-PLAN.md` | Lore bible v1 + progression + Claude Code milestones + traction gate |
| `docs/FOUNDER-MODE-BIBLE.md` | THIS — the unifying bundle (supersedes where they differ) |
| `docs/RESEARCH-REPORT.md` / `ROADMAP.md` / `BUILD-GUIDE.md` / `LAUNCH-PLAYBOOK.md` | The kit's verified research + deploy/launch process (unchanged, still canon) |
| `design/gallery.html` | Animated design lab — every new sprite, the Platform boss fight demo, all 6 badges, title mock |
| `design/sprites.js` | Paste-ready draw functions (the code source of truth for all new art) |
| `design/DESIGN-NOTES.md` | Function → index.html section mapping for integration |
| `design/level-cerebral-valley.js` | Complete v1.0 world-stretch: shift math + validated zone data |
| `design/level-preview.html` + `levelmap.png` | The full 9200px world rendered + machine-validated vs real jump physics |
| `design/CAMEOS.md` | 6 ship-safe composite legends + 4 thin-veil parodies with risk notes |
| `qa/` (incoming) | FINAL-REVIEW.md, design specs (biomes/customization/eggs/cameos), confirmed-bug list, CHANGELOG |

---

## 1. HOW IT LOADS

One HTML file, ~40KB, zero requests beyond itself. Open the URL (or double-click the file) → title screen is rendering in **under a second** on anything made this decade. No loading bar, no asset fetch, no framework boot, no cookie banner, no signup — the research (§1) is explicit that this *is* the growth strategy: instant load, one input, free, finishable. The WebAudio context initializes lazily on the first keypress (browser autoplay rules), so even sound costs zero startup.

Title screen shows: logo, the market-conditions ticker (v0.3: today's seed modifier, e.g. `RATES HIGH — coins worth −20%`), the founder picker hint (v-next: `C skin · V hoodie · H hair`), and `PRESS SPACE TO START` / `TAP TO START`. One input starts the run. Total time from click-in-feed to playing: **~3 seconds.**

## 2. UI/UX — every screen, every interaction

**Screens:** `TITLE → PLAY → (WIN | DEAD) → overlay card → restart`. That's the whole state machine, and it's load-bearing: no menus, no pause screen, no settings. M mutes. R restarts. The game IS the menu.

**HUD (PLAY):** top-left `RAISED $X` + `RUNWAY` hearts (the money and the mortality, always visible); top-center current zone name; top-right run timer. Active power-up status (CAFFEINATED / DEMO DAY MODE / MATCHA'D) under the hearts. Nothing else — at 480×270 internal resolution, every HUD pixel is rent.

**Founder picker (title, from the customization build):** cycle skin tone (6), hoodie color (6), hair (4 — buzz, flow, ponytail, curly; expressive without gender labels). Keyboard C/V/H; on mobile, tap the founder sprite itself to cycle. Choice persists in localStorage and follows you onto every badge — *your* founder rings the bell.

**End card (WIN or DEAD):** the badge IS the screen — a 1200×630 share card rendered live with your look, your stats, your one-liner, the game URL baked in. Three buttons, in priority order: `SAVE BADGE` · `COPY LINKEDIN POST` · `RUN IT BACK / PIVOT (RETRY)`. Clipboard failure has a graceful fallback message ("screenshot the badge instead"). This screen is the entire growth engine; everything above it exists to get people here.

**Mobile:** ◀ ▶ buttons bottom-left, big round jump button bottom-right (86px — thumb-sized), auto-shown on touch devices. Canvas letterboxes to any aspect. Tap anywhere to start.

## 3. THE GAMEPLAY EXPERIENCE — a run, minute by minute

**0:00–0:25, SOMA (the hook):** you spawn at your desk. Free coins immediately (dopamine before difficulty), one slow churn gremlin walks at you — the stomp teaches itself. Two joke signs before any threat. Burn rate hasn't been explained; you just notice smoke when you stand still and *understand*.
**0:25–1:00, SOMA proper:** pits appear, gremlin density rises, the WEWORK sign lands. You've learned move/jump/stomp without a tutorial.
**1:00–1:50, THE MISSION:** standing meetings hop on their own tempo — the first real timing check. Coffee chat snare zones slow you if you linger (v1.0). First cold brew. First deaths happen here, and the death names its cause.
**1:50–2:30 (v1.0: CEREBRAL VALLEY):** verticality — hacker-house scaffold climbs, thought leaders hovering on sine waves dropping THREAD bombs, compliance phantoms drifting through walls, the robotaxi you can ride (it stops mid-intersection; you forgive it). LARPers who look almost exactly like you. THE PLATFORM boss drops SDK crates that become the very platforms you climb to stomp it.
**2:30–3:10, SAND HILL ROAD:** the fund-sign district (§8), scooter bros homing at you, the money gauntlet — then CHAD CAPITAL's arena. Term-sheet arcs, five quips, three stomps, `VC HUMBLED +$250K`.
**3:10–4:00, THE CLOUD:** the ground becomes uptime (99.99% — the gaps are the 0.01%). Floaty precision. The Golden Gate recedes behind you.
**4:00–5:00, SYNERGY.AI:** buzzword bullets that wobble because nothing it ships travels straight. Five stomps. `SYNERGY.AI ACQUIRED (BY YOU)`.
**+0:10, THE BELL:** walk right. Ring it. `CERTIFIED UNICORN`. Badge. Share. The loop closes.

## 4. THE ROUTES — how different players actually play

1. **The Tourist (most players):** hold right, jump when scared, die twice, finish in ~5:30, share the loss or the win. The game is tuned so this route *always* reaches a badge (>80% target).
2. **Any% Speedrunner:** skip every coin, both cold brews chained for max uptime speed, damage-boost through enemy lines using hurt i-frames, pogo off enemies to skip platforming. Target: sub-3:00 → earns the `T2D3` badge flair.
3. **100% Completionist:** every coin, every stomp (`ZERO CHURN` line on the badge). Only possible after the unreachable-platform fix (§12) — the validator proved v0.1's 100% was literally impossible, which speedrunners would have discovered publicly. We found it first.
4. **The Pacifist:** stomp nothing, dodge everything. No badge reward in v0.1 — v1.0 adds the `ZERO CONFLICT — "we grew organically"` badge line. Hard mode disguised as peace.
5. **The Sellout:** take SYNERGY.AI's mid-fight acquisition offer → `ACQUI-HIRED` ending. Fastest "win," most shareable shame.
6. **The Dropout:** find the Fellowship door at the end of Sand Hill → run ends instantly, `DROPPED OUT` badge. A secret third exit mid-game.
7. **The Monk (secret):** after beating Chad, walk BACK to your SOMA desk and idle 10 seconds, surviving burn ticks → `LIFESTYLE BUSINESS`, the only ending where the founder looks happy.
8. **The Zombie:** reach the bell with ≤$50K raised → `ZOMBIE STARTUP — technically still alive`.

## 5. HOW YOU LOSE — every death, each with its joke

Runway = 3 hearts (max 5 via term sheets). Each loss source names itself, because a death that explains its own joke is a death you screenshot:

| Cause | Popup / flavor |
|---|---|
| Enemy contact | `-1 RUNWAY` |
| Pit fall | `-1 RUNWAY (pivot failed)` — respawn at checkpoint |
| Boss projectile (TERMS / buzzword) | `-1 RUNWAY` |
| Standing still 6s | `BURN RATE` |
| Rug token pickup (v1.0) | `RUGGED. -$5K` (money, not heart — worse, somehow) |
| Podcast invite hit (v1.0) | freezes you 1.5s — `"quick 3-hour pod?"` — usually the *indirect* cause of death |
| Final heart gone | `OUT OF RUNWAY` badge — `"it was a market timing issue"` |

v1.0 refinement: the loss badge's one-liner keys off your killer — died to a meeting: `"died in a meeting that could have been an email"`; died to burn: `"the money ran out quietly"`; died to a rug token: `"it was a liquidity event (theirs)"`.

## 6. POWER-UPS & ITEMS — complete table

| Item | Effect | The satire |
|---|---|---|
| COLD BREW | speed ×1.5, 10s, purple trail | the Bay runs on it |
| MATCHA (v1.0) | jump +15%, 10s, green zen glow | the calm counter-meta; type `MATCHA` on title to convert all cold brews |
| TERM SHEET | +1 RUNWAY **and** spawns a BOARD MEMBER who follows/blocks you 20s | money = power + obligations |
| DEMO DAY LETTER | 8s invincibility, everyone gets out of your way | acceptance as social armor (replaces the legally risky "Y" square) |
| ENTERPRISE CONTRACT (v1.0) | +$100K but speed ×0.85 for 8s | big logo, heavy process |
| RUG TOKEN (v1.0, trap) | looks like a coin, glints slightly wrong; −$5K | tokenmaxxing, mechanically punished |
| SDK CRATE (boss drop) | becomes a real platform 8s, then `DEPRECATION NOTICE` | lock-in as literal architecture |

## 7. BESTIARY — full cast (v0.1 + additions)

Churn gremlin (tutorial walker) · Standing meeting (tempo-controlling hopper) · Scooter bro (140px homing) · **Board member** (non-lethal follower, spawned by term sheets) · **Thought leader** (sine flyer, THREAD bombs, un-stompable while posting) · **Compliance phantom** (drifts through terrain) · **Robotaxi** (neutral rideable platform, stops mid-intersection) · **Founder LARPer** (v1.0, Cerebral Valley: wears your exact sprite with the hoodie 1 shade off; walks importantly between two points doing nothing; stomp: `LARP EXPOSED! +$10K`) · **Tokenmaxxer** (v1.0: scatters rug tokens ahead of you; stomp: `PORTFOLIO DIVERSIFIED! +$10K`) · **The 5AM Run Club** (v1.0 set piece, not an enemy: a pack of joggers periodically sweeps the Mission as a wave you must jump — they cannot be stomped because they are, technically, thriving) · **Coffee chat snare** (v1.0 zone hazard: standing in the café's glow slows you 50%; popup `"just 15 minutes?"`).
Bosses: **CHAD CAPITAL** (3HP, term-sheet arcs) · **THE PLATFORM** (v1.0, 4HP, SDK crates) · **SYNERGY.AI** (5HP, wobbling buzzwords).

## 8. THE CULTURE PACK — your list, mapped into the game

Every trope you named, placed where it bites (mechanics first, signs second):

- **Coffee chats** → the Mission café snare hazard (§7) + sign: `CAFÉ SEMICOLON — laptops allowed, working discouraged`.
- **Matcha** → the MATCHA power-up + easter egg (§6, §9). The cold-brew/matcha duality is the game's espresso-vs-zen meta.
- **The vibes CMO** → **THE VIBES CMO** cameo NPC (Mission, x≈2500): iced matcha in hand, ring light halo, sign: `THE VIBES CMO — "the brand did 2M views" — (the product does not exist)`. *Design note: the "ABG CMO" meme is ethnicity-coded; the archetype ships on vibe alone — same laugh, nobody's group is the punchline (canon rule 4).*
- **LARPing** → the Founder LARPer enemy (§7) — a doppelgänger of literally-you is the most mechanically honest LARP joke possible.
- **AI B2B SaaS** → already the final boss. It remains the final boss.
- **Podcasts** → THE PODCAST SAGE cameo + the podcast-invite freeze projectile (§5).
- **Going on runs / tech-bro-ing** → THE 5AM RUN CLUB wave (§7) + sign: `RUN CLUB 5AM — networking at zone 2 heart rate`.
- **Tokenmaxxing** → the Tokenmaxxer + rug tokens (§6, §7) — fake money that costs you real money.
- **The funds & institutions (parody names, canon rule 3 — recognizable morphs, invented marks):**
  - YC → **THE ACCELERATOR** (already canon: Demo Day Letter, Demo Day Mode)
  - a16z → **A17Z** — Sand Hill HQ sign: `A17Z — "software eats, we invoice"`
  - Sequoia → **SEQUOIADENDRON** — sign: `SEQUOIADENDRON — est. before your parents`
  - Founders Inc → **FOUNDERS ETC.** — fort by the marina; sign: `FOUNDERS ETC. — a fort. actually a fort.`
  - HF0 → **HF-0 MONASTERY** — Cerebral Valley; sign: `HF-0 MONASTERY — ship or pray (both)`
  - These live as a **fund-district sign row** on Sand Hill Road (pure copy, ships in v0.2 for free) and Chad gains the quip: `I'M ALSO IN A17Z'S NEW FUND`.

## 9. EASTER EGGS — the full list, and what each one does

| # | Trigger | Effect |
|---|---|---|
| 1 | Type `HUSTLE` on title | **ADVISOR MODE**: a translucent ghost-advisor follows you all run, offering useless advice bubbles (`have you tried enterprise?` · `what if it was a marketplace?`). Cosmetic. |
| 2 | Idle 60s on title | The game starts pitching YOU: title morphs into a deck — `FOUNDER MODE — pre-seed, raising $2M at $20M cap, deck on request` |
| 3 | Walk to the absolute world edge past the bell | Hidden sign: `you read the last sign. we're hiring.` |
| 4 | Stomp 100% of enemies | `ZERO CHURN` line on your badge |
| 5 | Win under 3:00 | `T2D3` flair stamped on the badge |
| 6 | Type `MATCHA` on title | All cold brews become matcha for this run (green particles, jump-boost variant) |
| 7 | The Fellowship door (end of Sand Hill, unmarked) | Ends your run: `DROPPED OUT` badge — the mechanic from CAMEOS.md R1, shipped nameless |
| 8 | Return to your SOMA desk after beating Chad, idle 10s | `LIFESTYLE BUSINESS` secret ending |
| 9 | Toggle mute 10× in 5s | Popup: `INVESTOR UPDATE MUTED` |
| 10 | Die 10 times in one session | Title gains a flavor line: `PIVOT #10: it's a social network now` |
| 11 | Ride the robotaxi its full route without jumping off | Popup: `5 STARS. TIPPED THE ALGORITHM` +$5K |
| 12 | Stomp a LARPer while wearing the identical hoodie color | `IDENTITY CRISIS RESOLVED +$25K` |

Rule for all eggs: discovered, never advertised. Eggs are for the second run and the group chat — they're retention content, not launch content.

## 10. SPEEDRUNNING — how they'll break your game politely

**Categories that will emerge (design for them):** Any% (bell, no constraints) · 100% (all coins + all stomps — possible only post-fix) · Pacifist · All-Endings (needs 4 runs minimum) · Daily-Seed (the leaderboard category — everyone runs the same conditions, times comparable).
**The tech:** cold-brew chaining (route both brews for ~20s of ×1.5); hurt-cancel damage boosts (take a hit on purpose — i-frames + knockback cross enemy packs faster than dodging); pogo-chains (stomp bounce = free height, skip whole platform stacks); boss quick-kills (bait the hop, triple-stomp Chad in ~9s); pit-edge coyote abuse if any exists (QA is checking).
**Leaderboard integrity:** client-side scores are forgeable; the plan (Roadmap §9) accepts this — cap raised at theoretical max in a DB constraint and treat the inevitable `999:99 — definitely-not-cheating.eth` as free content. Daily seed resets keep it winnable.
**What we owe speedrunners:** a stable physics contract (never "tune feel" after launch without a version note on the leaderboard) and a visible ms timer. They will find everything else themselves, including things in §12 — that's their gift to you.

## 11. THE GOING-BACK LOOP — why anyone returns tomorrow

The comeback engine has four gears: **(1) The daily seed** — new market conditions each day (`AUDIT WEEK: burn ticks 2s faster`), same run for everyone, comparable times, daily leaderboard that resets so it stays winnable. **(2) The badge collection** — eight distinct badges (unicorn, out-of-runway, acqui-hired, zombie, lifestyle, dropped-out, series-b, plus flairs) function as an ending-hunt meta; nobody collects them in one day. **(3) The beat-my-time conversation** — the LinkedIn post skeleton ends with "beat my time and I'll repost yours"; every reply-with-badge is another distribution node, and reposting good ones is the compounding loop from the playbook. **(4) SERIES B MODE** — NG+ for anyone who won: faster burn, +1 boss HP, double board members, the flair ribbon. The sequel round is always harder than the first, canonically and mechanically.

## 12. BREAKING IT — the adversarial program (run, not imagined)

A multi-agent war room was actually executed against the real build: **five critics** (readability at 1×/4×, game-feel argued from measured physics, share-UX judging badges downscaled to feed size, mobile/touch, comedy) filed findings and then **formally rebutted each other**; **four breakers** wrote and ran live Playwright probes (physics/walls, state-machine abuse, endgame/badge edges, stress/tab-blur); **skeptic agents re-ran every claimed bug and tried to refute it** — only reproduced bugs count; a **canon-cop** audited the new design specs for lore and IP violations; a synthesis judge ruled on disputes; and four fixer agents are patching the game with all three tests required green after each change. Results land in `qa/FINAL-REVIEW.md` + `qa/CHANGELOG.md`.

**Already caught before the war room even reported:** the geometry validator proved five shipped v0.1 platforms are unreachable at the real jump physics (apex 62px vs 64–86px required) — so 100% completion was mathematically impossible in the version the world would have speedrun. Fix list is in `design/level-cerebral-valley.js` §E.

**The standing attack surfaces the QA program covers** (and any future change must re-check): boss-wall bypass, R-spam during badge render, die-while-winning races, checkpoint-inside-arena respawns, run-timer counting during tab blur (performance.now doesn't pause when rAF does), clipboard-denied fallback, download-attribute behavior on iOS, fmtMoney overflow, maxHearts display carryover, enemy pit-edge AI, and long-idle audio-context decay.

## 13. STITCHING IT ALL TOGETHER — what's done vs. what remains

**Done, in this chat, without Claude Code:** the research-grounded plan and phasing · complete lore + copy decks · every new sprite as working code · all six badges · the animated design lab · the full v1.0 world data, physics-validated · the cameo roster (both tiers) · the culture pack designs · the QA war room + (incoming) a hardened index.html with customization, easter eggs, biomes, and confirmed bug fixes already implemented by fixer agents against passing tests.

**Claude Code's remaining job (small, mechanical, in order):** M0 repo + CLAUDE.md → M1 verify/land the v0.2 content set (the war-room build may have already absorbed most of it — diff against `qa/CHANGELOG.md` first) → M2 deploy to Vercel + OG tags → M3 daily seed + `/api/og` + Supabase leaderboard (code already written in ROADMAP §7–9) → M4 launch day (LAUNCH-PLAYBOOK verbatim) → M5, gated: paste `level-cerebral-valley.js` + the v1.0 bestiary/endings per MASTER-PLAN §1.7.

**The one rule that survives all of this:** every addition above is either copy (free), a self-contained mechanic (cheap), or gated behind launch traction (v1.0). The ship-shaped thing stays small. The research said scope discipline *is* the strategy, and nothing in this bible argues with the research — it just makes the small thing dense.

---
*The Bible, v1 — July 2026. Compiled from: MASTER-PLAN.md, the design lab, the level validator, CAMEOS.md, the live QA war room, and one founder who kept saying "keep cooking."*
