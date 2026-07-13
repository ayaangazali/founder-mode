# FOUNDER MODE — The Master Plan

> **STALE-DOC NOTICE (2026-07-13):** this document describes the v0.1 build
> (~1,300 lines, 4 zones, no mini-games). The shipped game is ~3,900 lines with
> 5 zones, mini-games, leaderboard, and the MASH-R finale. Read this as design
> history; for current truth use CLAUDE.md, qa/CHANGELOG.md, and
> docs/AUDIT-2026-07-13.md.
### Lore bible · progression design · Claude Code build plan

**Strategy in one line:** ship the small game first (v0.2 → v0.3 → LAUNCH), with the big game (v1.0) fully designed now but built only if launch traction earns it.

This document is the single source of truth for everything that happens next. It contains:

1. **The Lore Bible** — the complete fictional world: canon rules, story, zones, bestiary, bosses, power-ups, and every line of copy, written paste-ready.
2. **Progression Design** — the run arc, difficulty curve, and the mechanics of each phase (v0.2, v0.3, v1.0).
3. **The Claude Code Build Plan** — high-level milestones, in order, each with a goal, scope, and a verification gate.
4. **The Traction Gate** — the measurable criteria that decide whether v1.0 gets built at all.

It builds on (and never contradicts) the kit's existing docs: `RESEARCH-REPORT.md` (the fact-checked why), `ROADMAP.md` (the v0.2/v0.3 what), `BUILD-GUIDE.md` (deploy how), `LAUNCH-PLAYBOOK.md` (distribution). Where those docs give implementation code, this plan defers to them.

---

# PART 1 — THE LORE BIBLE

## 1.0 Canon rules (read before writing a single joke)

These are the laws of the FOUNDER MODE universe. Every new mechanic, enemy, or line of copy must pass all six:

1. **The satire lives in the mechanics, not the skin.** (Research §4 — this is the verified reason Universal Paperclips worked.) A joke that's only a label is a weak joke. Burn rate hurts you for standing still — *that's* a joke. A sign that says something funny is seasoning.
2. **Everything is named in-universe.** Money is RAISED. Health is RUNWAY. Death is OUT OF RUNWAY. Damage is a DOWN ROUND. Never "score," "HP," "lives," or "game over."
3. **Archetypes, never trademarks or real people.** (Research §8.) Invented company names (Chad Capital, SYNERGY.AI), archetypal characters (a VC in a vest, an AI CEO in a gray tee — unnamed). No real logos, no real fonts, no "Y Combinator," no Sam-Altman-shaped boss. Real *places* (SOMA, Valencia St, Sand Hill Road) are fine — geography isn't trademarked.
4. **The player is always the butt of the joke, lovingly.** The game teases founders from the inside, not sneering from the outside. Self-deprecating, never mean. The loss badge says "it was a market timing issue" — the player laughs *at themselves* and shares it.
5. **The tone is deadpan corporate-absurd.** Jokes are delivered with a straight face in the language of pitch decks and standups. Never wacky, never random. "99.99% uptime*" is the register. The asterisk is doing the comedy.
6. **Mix real tropes with invented absurdity freely.** (Research §8 explicitly refuted the idea that satire must stick to real rituals.) Standing meetings are real; buzzword projectiles that can't travel in a straight line are invented. Both belong.

**Zeitgeist calibration (July 2026):** the discourse has shifted from pure AI hype to *hype fatigue* — "agentic" as self-parody, "AI slop," every company claiming to be AI-native, the hype-to-pragmatism turn. SYNERGY.AI saying "I AM AGENTIC." is funnier *now* than it was in 2024, because everyone is tired of hearing it. Waymos are the new cable cars — an SF icon. The lore below leans into this. Comedy note from the research (§10): which jokes land is *unverifiable in advance* — ship, watch what people screenshot, double down.

---

## 1.1 The story

### The world
The game takes place in **the Bay** — a fictionalized San Francisco where startup culture's metaphors are literally true. Runway is a physical resource that drains. Meetings have legs and chase you. Buzzwords are projectiles. The fog (Karl, canonically) watches everything and comments on nothing. It is always dusk in the Bay, because everyone is either shipping late or fundraising early.

At the far eastern edge of the Bay, past where the streets end, the city dissolves into **The Cloud** — the abstraction layer where startups go when they stop being companies and become line items. At the very end of The Cloud hangs the **IPO Bell**. Ringing it is the only known way out of founder mode.

### You
You are **the Founder** — a hoodie, jeans, and white sneakers with a person somewhere inside them. You are never named, and neither is your startup, **because it has pivoted too many times to keep a name**. (Canonically it has been, at various points: a marketplace, a dev tool, "Uber for something," and most recently "an agentic platform." Nobody, including you, can say what it does. This never comes up, and that's the joke.)

You wake up at your desk in SOMA with 3 months of runway, $0 raised, and a cold brew going warm. To your right: the entire city, every obstacle in it, and at the end, the Bell. There is no going left. There was never any going left.

### The antagonist
**SYNERGY.AI** is the final boss and the ur-competitor: an AI B2B SaaS company that achieved consciousness during a rebrand. It was formed when fourteen dying startups pivoted into each other at high speed and merged into one entity. It has raised $2B on a deck, it describes itself as "basically AGI," and its product is — as far as anyone can determine — a dashboard. It squats at the top of The Cloud, absorbing startups, converting them into features it announces but never ships.

SYNERGY.AI doesn't hate you. It's worse than that: it considers you **legacy code**.

### The gatekeeper
Between you and The Cloud stands **Chad Capital** — a general partner in a Patagonia-style vest who guards the end of Sand Hill Road. Chad is not evil either. Chad is *pattern-matching*. Chad lobs term sheets at founders not as attacks but because that is simply what Chad emits, the way a squid emits ink. To pass, you must do the one thing no founder has done to a VC: get on top of him. Three times.

### The run
One complete run = one funding journey: SOMA (grind) → The Mission (distraction) → Sand Hill Road (money gauntlet) → The Cloud (abstraction) → the Bell. Target length: 3–6 minutes. That's not just scope discipline — canonically, **that's how long your runway lasts.**

---

## 1.2 The zones

Four acts, one long scroll. (Zone Zero and the Exit are v1.0 — designed in §1.7, built only if the Traction Gate opens.)

### ZONE 1: SOMA (x 0–1900) — "The Grind"
**Act function:** tutorial. Warehouses-turned-offices, $8 toast, WeWork husks.
**Lore:** SOMA is where startups are born and where they return to die. Every ground-floor office has been, in order: a startup, a bigger startup's satellite office, a WeWork, and a startup again. The churn gremlins nest in the WeWork vacancies.
**Enemy cast:** churn gremlins only (the tutorial enemy).
**Difficulty law:** the first 30 seconds must be nearly unloseable (Research §5). One free coin row, one slow gremlin to stomp, one joke sign — *before* any pit.

### ZONE 2: THE MISSION (x 1900–3600) — "The Distraction"
**Act function:** skill check ramps up. Murals, coffee shops, calendar invites with legs.
**Lore:** the Mission is where founders go to "work from a café," which is how the standing meetings get you. The meetings roam Valencia St in packs, feeding on unstructured time. Four coffee shops per block, zero profits — the coffee shops are all pre-revenue too; they're pivoting to being "third places" (a subscription).
**Enemy cast:** standing meetings (hop — timing check), late gremlins.

### ZONE 3: SAND HILL ROAD (x 3600–5460) — "The Gauntlet"
**Act function:** hardest platforming + first boss.
**Lore:** a road made of money that leads to money, guarded by people who used to have your job. The scooter bros commute here from their angel-investing side gigs — they accelerate toward anything that smells like deal flow (you). At the end: Chad Capital's velvet-rope arena. Nobody remembers whether the road is named after a hill of sand or whether it just describes what your equity becomes here.
**Enemy cast:** scooter bros (homing), meetings, gremlins — full mix.
**Boss:** CHAD CAPITAL (§1.4).

### ZONE 4: THE CLOUD (x 5460–7500) — "The Abstraction"
**Act function:** floaty precision platforming + final boss + the Bell.
**Lore:** past the Golden Gate the ground stops being ground and starts being *uptime* (99.99%, hence the missing platforms — that's the 0.01%). Everything is white and serene and billed per-second. SYNERGY.AI's arena sits at the top, humming, agentic. The IPO Bell hangs just beyond, and it is exactly as satisfying to ring as you imagine.
**Enemy cast:** all three types, cloud-platform gaps doing most of the work.
**Boss:** SYNERGY.AI (§1.4).

---

## 1.3 The bestiary

Every entry: lore, mechanic (the satire-in-mechanics reading), and stomp reward line.

### CHURN GREMLIN (`g`) — v0.1, keep
- **Lore:** the physical form of a canceled subscription. Born whenever a customer's card silently expires. Weak alone, deadly in aggregate — like churn.
- **Mechanic:** slow patroller, turns at edges. The tutorial enemy: churn is the first monster every founder meets.
- **Stomp line:** `CHURN CRUSHED! +$10K`

### STANDING MEETING (`m`) — v0.1, keep
- **Lore:** a calendar invite that gained legs the day someone set it to recurring, no end date. It cannot be declined, only stomped. The red header bar is its face; the "MTG" is a birthmark.
- **Mechanic:** hops on a timer — it controls the tempo of the encounter, exactly like it controls your Tuesday. Harder to stomp mid-hop.
- **Stomp line:** `MEETING CANCELED! +$10K`

### SCOOTER BRO (`s`) — v0.1, keep
- **Lore:** was an early employee at four unicorns ("I was employee #9") and now angel-invests from an electric scooter, which he rides on the sidewalk, at you, while telling you about his thesis.
- **Mechanic:** fast, homes toward the player within 140px. The aggression *is* the networking.
- **Stomp line:** `SCOOTER YEETED! +$10K`

### BOARD MEMBER — new in v0.2 (spawned by term sheets)
- **Lore:** every term sheet has one folded inside, like a fortune cookie of governance. Materializes the moment you accept the money. Not hostile — *worse*: helpful. Follows you forever (well, 20 seconds, which in founder time is forever), physically standing where you want to jump, asking about metrics.
- **Mechanic:** non-lethal follower that blocks movement, spawned when you grab a `sheet` power-up. Raising money = gaining runway + losing freedom. This is the loudest satire-in-mechanics in the game (Research §4's #1 recommendation).
- **Visual:** a churn-gremlin walker reskinned — gray suit tone, a tie, tiny "BOD" label.
- **Popup on spawn:** `+1 RUNWAY, +1 OPINION` · while following, occasional bubble: `QUICK QUESTION—`

### BURN (environmental hazard) — new in v0.2
- **Lore:** the Bay's ambient predator. Invisible, patient, always hungry. It cannot catch you if you keep moving. Nobody has ever seen it, because nobody has ever stood still long enough.
- **Mechanic:** stand still ~6 seconds → lose 1 RUNWAY, popup `BURN RATE`. Smoke particles start at ~3s as the warning. You literally cannot stand still in founder mode.

*(v1.0 bestiary additions — THOUGHT LEADER drone, COMPLIANCE PHANTOM, and the neutral WAYMO — are specced in §1.7.)*

---

## 1.4 The bosses

### BOSS 1: CHAD CAPITAL — the VC (x≈5150, 3 HP)
- **Lore:** General Partner at Chad Capital (he named the fund after himself; the fund is also just him). Stanford, then two years at a hedge fund he describes as "operating experience." Passed on three decacorns and mentions it as a credential, because it proves he *saw* them. His vest is load-bearing.
- **Fight:** paces his arena, lobs TERMS paper in arcs — the arc is the negotiation: it looks generous at the top and lands on you. 3 stomps. On each hit: `HIT! (n HP)`. On kill: `VC HUMBLED +$250K`.
- **Quips (v0.1 set, keep):** `WHAT'S YOUR MOAT?` · `COME BACK AT $1M ARR` · `IS THIS A FEATURE` · `OR A COMPANY?` · `I NEED 10X, KID`
- **Quips (v0.2 additions, append to the array):** `SEND ME A DECK` · `WHO ELSE IS IN?` · `LOVE IT. PASSING.` · `MY LPs ARE NERVOUS` · `IS THERE AI IN THIS?`

### BOSS 2: SYNERGY.AI — the final boss (x≈7080, 5 HP)
- **Lore:** see §1.1. Its eyes glow the exact blue of a landing page. The red light on its antenna is not a recording indicator; it's a Series F. It attacks with buzzwords because buzzwords are, structurally, all it contains. The buzzwords wobble sinusoidally because nothing SYNERGY.AI ships travels in a straight line.
- **Fight:** bigger, faster attack rate (70f), buzzword projectiles. 5 stomps. On kill: `SYNERGY.AI ACQUIRED (BY YOU) +$500K` — the accursed roles reversed at last.
- **Quips (v0.1 set, keep):** `I AM AGENTIC.` · `YOUR STARTUP IS A PROMPT` · `DEPLOYING SYNERGY...` · `I RAISED $2B ON A DECK` · `HUMANS ARE LEGACY CODE`
- **Quips (v0.2 additions):** `I AM AI-NATIVE. YOU ARE AI-NAIVE.` · `YOUR MOAT IS MY FEATURE` · `GENERATING SLOP...` · `I PIVOTED 14 TIMES TODAY` · `THIS CONVERSATION IS TRAINING DATA`
- **Buzzword projectile pool (v0.2, replaces the current 5):** `PIVOT` `SYNERGY` `GTM` `AGENTIC` `B2B` `SLOP` `AI-NATIVE` `ROADMAP` `ALIGNMENT` `WEB-SCALE`

---

## 1.5 The power-ups

### COLD BREW (`coffee`) — keep
- **Lore:** brewed for 20 hours, drunk in 4 seconds. The Bay runs on it.
- **Mechanic:** speed 1.7 → 2.5 for 10s. Purple particle trail. Popup: `COLD BREW! speed x1.5`. HUD: `CAFFEINATED`.

### TERM SHEET (`sheet`) — upgraded in v0.2
- **Lore:** a beautiful document. Everyone tells you not to celebrate it. Everyone celebrates it.
- **Mechanic (v0.2):** +1 RUNWAY (max 5) **and** spawns a BOARD MEMBER (§1.3). Double-edged by design. Popup: `TERM SHEET! +1 RUNWAY` then `+1 OPINION`.

### DEMO DAY LETTER (`accel`) — v0.2 rename of the `yc` power-up ⚠ REQUIRED BEFORE LAUNCH
- **Why:** the orange "Y" square reads as real trade dress — the single riskiest asset in v0.1 (Research §8, Roadmap §2).
- **New visual:** a **gold envelope with a red rocket stamp**. No letter glyph, no orange square.
- **New lore:** an acceptance letter from **THE ACCELERATOR** — which one? Doesn't matter. All of them. The letter's power is social: for 8 seconds, everyone in the Bay simply *gets out of your way*. Invincibility as a metaphor for warm intros.
- **Strings:** `YC ACCEPTED! INVINCIBLE` → `ACCELERATED! INVINCIBLE` · HUD `YC MODE` → `DEMO DAY MODE` · invincible-stomp popup `DISRUPTED! +$10K` (keep).
- **Code note:** the internal `'yc'` type key and `ycT` timer can stay (invisible to players); only visuals + strings must change. Rename if convenient, don't let it balloon the diff.

---

## 1.6 Copy deck (paste-ready)

Complete text inventory. v0.1 lines marked **[keep]**, new lines marked **[new]**. Claude Code should treat this section as the content source of truth.

### Sign jokes (the `signs` array)
Existing ten **[keep]** — they're good and they pace the run: `SOMA / ← nothing  glory →` · `$8 ARTISANAL TOAST` · `CHURN GREMLINS stomp on sight` · `WEWORK space available (all of it)` · `THE MISSION beware: standing meetings` · `VALENCIA ST 4 coffee shops 0 profits` · `SAND HILL ROAD pitch or perish` · `WARNING: VC AHEAD know your CAC` · `THE CLOUD 99.99% uptime*` · `FINAL BOSS SYNERGY.AI "basically AGI"`

**[new — add in v0.2; x-positions verified against the `segs` ground data and boss triggers (4720 / 6760) — each sits on solid ground, outside boss arenas]**
| x (suggested) | lines |
|---|---|
| 1150 | `HIRING: 10X ENGINEER` / `pay: exposure` / `(to churn gremlins)` |
| 2320 | `CAFÉ SEMICOLON` / `laptops allowed` / `working discouraged` |
| 3050 | `PIVOT AHEAD` / `(the road, and you)` |
| 4200 | `ANGEL CROSSING` / `they can smell` / `your cap table` |
| 4700 | `CHAD CAPITAL HQ` / `"we invest in people"` / `(who look like chad)` |
| 6000 | `NOW ENTERING` / `THE CLOUD` / `*not actual uptime` |
| 6700 | `SYNERGY.AI CAMPUS` / `humans welcome` / `(as training data)` |

### Stomp / event popups
**[keep]** `+$5K` (coin) · `CHURN CRUSHED! +$10K` · `MEETING CANCELED! +$10K` · `SCOOTER YEETED! +$10K` · `DISRUPTED! +$10K` (invincible) · `-1 RUNWAY` (hit) · `-1 RUNWAY (pivot failed)` (pit) · `HIT! (n HP)` · `DOWN ROUND!!` (boss final hit) · `VC HUMBLED +$250K` · `SYNERGY.AI ACQUIRED (BY YOU) +$500K`
**[new v0.2]** `BURN RATE` (idle drain) · `+1 OPINION` (board member spawn) · `QUICK QUESTION—` (board member ambient)

### Badge one-liners (`makeBadge()` footer quote — v0.2: rotate randomly per badge)
**WIN pool:** **[keep]** `"we're basically profitable" — you, probably` · **[new]** `"this was the plan all along" — you, revising history` · `"I never doubted us" — you, who doubted us` · `"staying humble" — your LinkedIn post about it`
**LOSS pool:** **[keep]** `"it was a market timing issue" — you, on LinkedIn` · **[new]** `"we learned so much" — you, learning nothing` · `"the market wasn't ready" — the market, ready` · `"pivoting to consulting" — 40% of your batch`

### Badge stat block (v0.2 upgrade per Roadmap §6)
Keep RAISED / TIME / BOSSES. Add footer line with the **game URL baked into the PNG** — screenshots travel without links on LinkedIn; the image must carry the URL: `► PLAY: {URL}` in the accent color, ≥28px monospace.

### Share post text (`shareText()`)
**[keep both v0.1 variants]**, with one v0.2 edit: append the game URL as the final line of both (clipboard text should carry the link even when the image gets re-shared without it).

### Daily "market conditions" lines — v0.3 (daily seed, shown on title screen; one per day, seeded)
1. `AI HYPE CYCLE: PEAK — SYNERGY.AI +1 HP`
2. `RATES HIGH — coins worth -20%`
3. `RATES CUT — coins worth +20%`
4. `MEGACORP LAYOFFS — +2 scooter bros on Sand Hill`
5. `HYPE→PRAGMATISM — bosses quip 2x faster, hit same`
6. `FOG THICK TODAY — Karl covers the pits (visual only, good luck)`
7. `EVERYONE'S AT A CONFERENCE — half the meetings are remote (despawned)`
8. `DOWN ROUND SEASON — term sheets grant no runway (still spawn board members)`
9. `BULL MARKET — start with +1 RUNWAY`
10. `AUDIT WEEK — burn rate ticks 2s faster`

(Format: headline + mechanical effect. The joke must be readable in the modifier itself. Effects map to existing levers — boss HP, coin value, enemy spawns, burn timer — so each is ~1–3 lines of code.)

---

## 1.7 v1.0 expansion lore — designed now, built ONLY after the Traction Gate

Everything below is fully specced so Claude Code can build it in one milestone — but it ships **only if launch traction earns it** (§4.3). Scope discipline is the strategy; the research is unambiguous.

### New zone: CEREBRAL VALLEY (inserted between The Mission and Sand Hill Road)
- **Lore:** the neighborhood where the AI hacker houses grow. Every Victorian contains eleven founders, one GPU, and a whiteboard that says "AGI TIMELINE" with the dates scratched out. The air is 40% fog, 60% pitch. Tourists are bussed through to see the founders in their natural habitat.
- **Level design:** ~1,700px of new world (LEVEL_W 7500 → ~9200, all downstream x-coords shift — see M5). Vertical Victorian-scaffold platforming, denser than any prior zone.
- **Zone sign:** `CEREBRAL VALLEY` / `11 founders per house` / `1 GPU`
- **New enemies:**
  - **THOUGHT LEADER (`t`)** — a hovering drone with a glowing head-ring that drops `🧵 THREAD` bombs in a slow sine hover. Lore: achieved product-market fit *as a person*. Can't be stomped while posting (brief glow = i-frames — timing check). Stomp line: `RATIO'D! +$15K`
  - **COMPLIANCE PHANTOM (`c`)** — a translucent ghost in a tie that phases through platforms, moving slowly but ignoring terrain. Lore: the spirit of a regulation you haven't heard of yet. It is not angry, it just needs a moment of your time (your RUNWAY). Stomp line: `EXEMPTED! +$15K`
  - **WAYMO (neutral)** — not an enemy: a robotaxi that trundles along the ground as a **moving platform** you can ride. Periodically stops dead mid-intersection for 2s (its one flaw, lovingly observed). Cannot hurt you; you can, canonically, trust it more than the scooter bro. The 2026-authentic SF touch.

### New mid-boss: THE PLATFORM (end of Cerebral Valley, 4 HP)
- **Lore:** a MegaCorp Developer-Relations mecha sent down from a company that is definitely not any specific real company — **OMNICORP CLOUD** (invented, safe). It doesn't want to kill you; it wants you to **build on the platform**. Its arms are APIs. Its embrace is a deprecation notice.
- **Fight:** slow, huge, drops `SDK` crates from above that become temporary platforms (its attacks literally build lock-in around you — satire in the mechanics). 4 stomps. Kill line: `DEPRECATED! +$350K`
- **Quips:** `BUILD ON US` · `WE LOVE STARTUPS` (eye twitches) · `FREE CREDITS*` · `THE API CHANGED THIS MORNING` · `YOUR CATEGORY IS OUR KEYNOTE`

### Multiple endings (the big v1.0 feature — three new badges = three new share loops)
1. **IPO (existing):** ring the Bell → `CERTIFIED UNICORN`.
2. **THE ACQUI-HIRE [new]:** at SYNERGY.AI half-HP, it pauses and makes an offer: `ACQUISITION OFFER: STOP FIGHTING. JOIN US. (walk into the glowing door = accept)`. A door appears at the arena's left edge for 6s. Accept → ending badge `ACQUI-HIRED — "excited for this next chapter"`, stats show `RAISED` recast as `RETENTION BONUS`. The coward's ending, and on LinkedIn, arguably the most shareable one.
3. **THE ZOMBIE [new]:** reach the Bell with ≤ $50K raised (skipped nearly everything) → `ZOMBIE STARTUP — technically still alive`. "You rang the bell. Quietly. Nobody looked up."
4. **SECRET — THE LIFESTYLE BUSINESS [new]:** go *back* to the very start after beating Chad Capital and idle at your SOMA desk 10 full seconds (surviving burn ticks) → `LIFESTYLE BUSINESS — you win?` The only ending where the founder looks happy. Never marketed; players who find it will do the marketing.

### SERIES B MODE (New Game+)
- Unlocked after any win (stored in `localStorage` — fine on your own domain). Title screen gains `[B] SERIES B MODE`.
- Remix, not rebuild: burn ticks 2s faster · +1 HP on all bosses · scooter bros home from 220px · term sheets spawn **two** board members · badge gains a `SERIES B` flair ribbon.
- Lore: you did it once, so now everyone *expects* it. The sequel round is always harder than the first.

---

# PART 2 — PROGRESSION DESIGN

## 2.1 The run arc (beat chart)

| Beat | x-range | Time (target) | Function | Emotional beat |
|---|---|---|---|---|
| Cold open | 0–500 | 0:00–0:25 | Unloseable: free coins, 1 gremlin, 2 jokes | "oh it's actually fun" |
| SOMA proper | 500–1900 | 0:25–1:00 | Teach stomp, pits, platforms | competence |
| The Mission | 1900–3600 | 1:00–1:50 | Hop-timing checks, first deaths | "ok it's a real game" |
| Sand Hill climb | 3600–4700 | 1:50–2:30 | Full enemy mix, hardest platforming | tension |
| CHAD CAPITAL | 4700–5460 | 2:30–3:10 | Boss 1 — arcs + patience | first triumph |
| The Cloud | 5460–6760 | 3:10–4:00 | Floaty gaps, precision | atmosphere shift |
| SYNERGY.AI | 6760–7400 | 4:00–5:00 | Boss 2 — the crescendo | the money shot |
| The Bell | 7400–7500 | +0:10 | Walk right, ring it, badge | release → SHARE |

**Invariants (never violate, any version):** loads in <5s on a phone · zero signup · one full run finishable in ≤6 min · a first-time player reaches *a* badge screen (win or death) >80% of the time · badge + copy button work on mobile. The badge only spreads if players reach the badge.

## 2.2 Difficulty curve philosophy
- **Deaths should feel like jokes, not injustice.** Every death names its cause (`BURN RATE`, `-1 RUNWAY (pivot failed)`).
- **Checkpoints at every zone start** (already true) — a death costs ≤90s of progress.
- **The bosses are patience checks, not skill walls.** Chad punishes greed; SYNERGY.AI punishes panic. Both are beatable first-try by a careful player, and that's correct — completion drives shares (Research §4).
- **Tuning levers live in one place each** (see GAME-DESIGN.md difficulty table). Never tune by adding mechanics; tune by turning existing knobs.

## 2.3 What each phase adds (mechanics summary)

**v0.2 — pre-launch (~half a day):** burn rate · double-edged term sheets (board member) · DEMO DAY LETTER de-risk · first-30s pass (first gremlin 520→650, free coin row at x150) · badge polish (URL in PNG, rotating one-liners) · new signs & quips (§1.6). *Everything else in the game stays frozen.*

**v0.3 — launch week (~a day):** daily seed + market conditions (10 modifiers, §1.6) · dynamic per-run OG badges (`/api/og`, Roadmap §8 has the code) · Supabase daily leaderboard (Roadmap §9 has the schema) · analytics events (`start`, `first_boss`, `badge_screen`).

**v1.0 — traction-gated (~2–3 days):** Cerebral Valley zone + 2 enemies + WAYMO platform · THE PLATFORM mid-boss · 3 new endings · SERIES B MODE. Ships as **"FOUNDER MODE: SERIES B"** — a *re-launch event* with its own HN/LinkedIn moment ("the game got a new round of content"), not a silent patch.

---

# PART 3 — THE CLAUDE CODE BUILD PLAN

High-level milestones, in order. Each = one focused Claude Code session (or a few). The verification gate at the end of each milestone is non-negotiable: **the Playwright tests must pass before moving on.**

### How to work with Claude Code on this repo (once, before M1)
- **Create a `CLAUDE.md` at the repo root.** It's the first thing Claude Code reads every session. It should state: the game is ONE file (`index.html`), no frameworks/build step ever; the canon rules (§1.0 — especially in-universe naming and no-trademarks); that `docs/MASTER-PLAN.md` is the content source of truth and GAME-DESIGN.md is the code map; and that after every change it must run `node test/smoketest.js && node test/playtest.js && node test/deathtest.js` and look at the screenshots playtest produces.
- **One milestone per session.** Small diffs, test between items. The single-file architecture makes big speculative diffs dangerous.
- **Point it at sections, not vibes.** The code has `// ---- SECTION ----` banners and GAME-DESIGN.md maps every change to its location. Reference them in your prompts ("in the powerups block…").
- **Let it verify visually.** playtest.js captures screenshots — have Claude Code read them after changes to sprites/badges (it can see images).
- **You are the comedy QA.** Claude Code implements the copy deck; whether a joke lands is decided by you playing the build (Research §10: comedy needs playtesting, not research).

---

### M0 — Repo & harness (30 min)
**Goal:** the kit becomes a git repo Claude Code can work in confidently.
**Scope:** `git init` + push to GitHub · write `CLAUDE.md` (contents above) · `npm install playwright` · run all 3 tests, confirm green · commit as the v0.1 baseline tag.
**Gate:** all 3 tests pass on the untouched game; repo pushed.

### M1 — v0.2: the content & mechanics patch (half a day)
**Goal:** everything in §2.3-v0.2, i.e. Roadmap items 2–6 + this plan's copy deck.
**Scope (suggested commit order):** ① DEMO DAY LETTER rename/redraw (the legal blocker — do it first) → ② burn rate → ③ board-member followers → ④ first-30s pass → ⑤ badge polish (URL in PNG, rotating one-liner pools) → ⑥ copy deck: new signs, quips, projectile words (§1.6).
**Gate:** tests pass · manual checklist from BUILD-GUIDE Step 5 · full run on your phone · **zero remaining "Y"/"YC" strings or orange-square visuals** (`grep -i "yc\|Y COMBINATOR" index.html` finds only the internal type key, if kept) · you personally laugh at least once at a sign you forgot you added.

### M2 — Deploy (1 hour)
**Goal:** a public URL with correct link previews.
**Scope:** BUILD-GUIDE Steps 2–4 verbatim (Vercel via GitHub — you'll want Vercel for M3's edge functions) · static `og.png` + meta tags · optional joke domain · re-run tests against the live URL (playtest scripts accept a URL — if they're file-path-only, M2 includes making the target configurable).
**Gate:** LinkedIn Post Inspector renders the preview · game plays on phone from the live URL · badge download + clipboard copy work on iOS Safari (the strictest clipboard environment — test it specifically).

### M3 — v0.3: the launch-week systems (a day)
**Goal:** daily seed, dynamic OG badges, leaderboard, analytics.
**Scope:** ① daily seed + market conditions — seeded RNG from the date, title-screen banner, the 10 modifiers from §1.6 mapped to existing levers → ② `/api/og` + `/r` result-URL routes (Roadmap §8 has working code; repo grows an `api/` dir — the *game* stays one file) → ③ Supabase daily leaderboard (Roadmap §9 schema; win screen shows top 10, name entry ≤24 chars, profanity-filter the obvious) → ④ analytics pixel + 3 events.
**Gate:** tests pass · two different days' seeds produce visibly different runs (fake the date to verify) · pasting a result URL into LinkedIn Post Inspector shows *that run's* badge · leaderboard insert+read works from the live site · analytics events visible in the dashboard.

### M4 — Launch (launch day, Tue/Wed/Thu)
**Goal:** execute LAUNCH-PLAYBOOK.md. Claude Code's role is support, not posting.
**Scope:** pre-flight checklist top of the playbook · Claude Code on standby for hotfixes (a viral HN thread WILL surface bugs — the single-file no-build architecture means fix→push→live in ~60s, which is a superpower; use it) · capture the 20–40s gameplay GIF for X (playtest harness can record frames) · you stay in the HN thread all morning.
**Gate:** you posted. The funnel is being watched (`start` → `first_boss` → `badge_screen`).

### M5 — v1.0 "SERIES B" (2–3 days) — ⚠ BLOCKED BY THE TRACTION GATE (§4.3)
**Goal:** everything in §1.7.
**Scope (order matters):** ① world stretch — insert Cerebral Valley's 1,700px, shift all downstream x-coords (segs, plats, coinRows, enemyDefs, powerDefs, signs, bosses, checkpoints, LEVEL_W, zoneName, bell) — this is the riskiest refactor in the whole plan; do it alone, test, commit → ② THOUGHT LEADER + COMPLIANCE PHANTOM + WAYMO platform → ③ THE PLATFORM mid-boss → ④ endings 2–4 + badge variants → ⑤ SERIES B MODE → ⑥ re-tune the beat chart (run should land ≤7 min even with the new zone; cut coins before cutting jokes).
**Gate:** tests updated for the longer world and passing · all 4 endings reachable (add a playtest for each) · Series B run completes · re-launch posts drafted ("the game raised a Series B: new zone, new boss, you can now sell out mid-boss-fight").

---

# PART 4 — MEASUREMENT & THE TRACTION GATE

## 4.1 The funnel (from M3 analytics)
`page load → start → first_boss → badge_screen → (share proxy: badge downloads / copy-post clicks if instrumented)`. The number that matters most: **% of starts reaching a badge screen — target >80%** (Roadmap §10). If it's low, the fix is difficulty tuning in M1's levers, not new content.

## 4.2 What "working" looks like in week 1
Signals worth acting on: HN front page (any position) · >10 organic LinkedIn posts with badges you didn't prompt · anyone you don't know posting their loss badge · a "beat my time" reply chain that sustains itself for a day.

## 4.3 The Traction Gate (decides M5)
Build v1.0 **only if, within 14 days of launch, at least two of:**
1. ≥25,000 unique players
2. ≥50 organic badge shares you can find (LinkedIn + X combined)
3. HN front page OR ≥3 pieces of independent coverage/newsletter mentions
4. Players asking for more content unprompted (the strongest signal of all)

**If the gate doesn't open:** don't build v1.0 — the research is blunt that more content doesn't create virality, it rewards it. Instead: one week of joke-sharpening based on what people screenshotted, one more distribution push (Product Hunt, relevant newsletters), then let it be what it is — a great portfolio piece and the funniest thing on your GitHub. **If it half-opens** (one criterion, strong): ship only the endings (§1.7 #2–4) — cheapest content, directly feeds the share loop — and re-evaluate.

---

*Master plan v1 — July 2026. Written against index.html v0.1 (7,500px world, 2 bosses, 20 enemies, 10 signs). Fresh-zeitgeist references (AI-slop / agentic-fatigue / hype-to-pragmatism / Waymo-as-icon) verified current as of July 2026.*
