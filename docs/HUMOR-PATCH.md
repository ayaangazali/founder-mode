# HUMOR PATCH — v1.1 "THE CLIP UPDATE"
### Diagnosis: the satire is in the nouns; it needs to be in the MOMENTS.

The honest critique: right now the game is mechanically correct satire — enemies with funny names, jokes on signs. What it lacks is **clippable moments**: things that happen TO the player that make them say "wait, what" and screen-record the second run. This patch adds ~10 engineered moments, the celebs (owner-approved, flagged), and the flagship feature: **the generated newspaper obituary**. Everything below has final copy written — implementation is assembly.

Priority order = clip value per line of code. Ship 1–4 before anything else.

---

## 1. THE OBITUARY — generated newspaper loss screen ★ THE FLAGSHIP

When you die, before/alongside the badge, the screen becomes the front page of **HYPERGROWTH DAILY** ("all signal, no revenue · $8/mo") — a 1200×630 canvas-rendered newspaper front page **generated from your actual run telemetry**. This replaces the loss badge as the default share image (keep the old badge behind a toggle button). Every death produces a different article. THIS is the viral unit — a loss screen people want to lose on purpose for.

**Layout (canvas, monospace + a serif-feel via bold spacing):** masthead · date + "MARKETS: {today's market condition}" ticker · giant headline · subhead · 2 fake columns of body text (3 lines each, then greeked lines as gray bars) · a "photo" (the player's founder sprite at 10x, tilted, with caption) · pull quote box · bottom ticker.

**Headline generator — cause-of-death table (death cause is already known at hurtPlayer/pit time; stash `deathCause`):**

| cause | HEADLINE | subhead |
|---|---|---|
| meeting | `LOCAL FOUNDER DIES IN MEETING THAT HAD NO AGENDA` | "recurring invite had no end date, sources confirm" |
| pit | `FOUNDER PIVOTS DIRECTLY INTO THE GROUND` | "the gap in the market was literal" |
| burn | `FOUNDER BURNS OUT WHILE STANDING COMPLETELY STILL` | "runway consumed by ambient costs, thought leadership" |
| gremlin | `CHURN FINALLY GETS HIM` | "retention was 'a Q3 priority'" |
| scooter | `FOUNDER STRUCK BY ANGEL INVESTOR ON SCOOTER` | "the angel was 'just circling back'" |
| thought leader | `FOUNDER RATIO'D TO DEATH IN CEREBRAL VALLEY` | "thread had 9 parts. victim read 4." |
| phantom | `COMPLIANCE PHANTOM CLAIMS ANOTHER STARTUP` | "the regulation existed since 2019, apparently" |
| VC terms | `FOUNDER BURIED UNDER TERM SHEET` | "the liquidation preferences were 'non-standard'" |
| platform boss | `DEVREL MECHA DEPRECATES LOCAL FOUNDER` | "he built on the platform. the platform built on him." |
| buzzword | `MAN KILLED BY THE WORD "{word}"` | "witnesses say it was travelling in a sine wave" |
| rug token | `FOUNDER'S PORTFOLIO 'DIVERSIFIED' INTO ZERO` | "the token had a roadmap" |

**Body copy pool (pick 2, seeded by run):** each is 2–3 lines of deadpan article prose, e.g.: *"The founder, who raised ${raised}K over a {time} career, was described by colleagues as 'basically profitable.' The company's product could not be reached for comment, as it did not exist."* / *"Chad Capital, an early passer on the company, said: 'I passed on them twice. Pattern recognition.'"* / *"SYNERGY.AI issued a statement: 'WE WISH THEM WELL. THEIR USERS ARE NOW OUR TRAINING DATA.'"* / *"The memorial will be a LinkedIn post. In lieu of flowers, please like and repost."* / *"A source close to the cap table says the cap table was the problem."*

**Photo caption pool:** "the founder, moments before checking metrics" · "file photo: hoodie, ambition" · "the deceased, pictured at peak conviction".
**Bottom ticker:** `RAISED ${raised}K ▼ · RUNWAY 0.0 MONTHS ▼ · VIBES DELISTED · NEXT: YOUR RUN?`
**Buttons:** `SAVE FRONT PAGE` (primary) · `COPY LINKEDIN POST` (text references the headline: "I made the front page of Hypergrowth Daily: '{HEADLINE}'. {url}") · `PIVOT (RETRY)` · small `view classic badge` toggle.
**Code shape:** one `makeObituary()` function next to `makeBadge()`, ~120 lines, same canvas idiom. `/api/og` can later take `?h=headlineIndex` for link unfurls.

## 2. "WE'RE SO BACK / IT'S SO OVER" — the mood meter ★ FLAGSHIP #2

Tiny HUD element (top-center, under zone name): the founder's internal monologue, flipping by recent events. Rolling 5s window: coins/stomps/power-ups push positive, hits/near-misses push negative.
States (worst→best): `IT'S SO OVER` → `quiet quitting (myself)` → `heads down building` → `WE'RE SO BACK` → (10s flawless+coffee) `WE ARE SO BACK (deranged)`.
Rules that make it funny: it flips **instantly** on single events (one coin after a beatdown → WE'RE SO BACK), it shows during boss fights, and on the death frame it displays `IT'S SO OVER` one final time — which lands on the obituary screenshot. ~25 lines. Infinite clip fuel because it mirrors the player's actual emotional whiplash.

## 3. THE CELEBS — thin-veil cameos, owner-approved, `RISKY_CAMEOS = true`
(One line for the record: identifiable-person parody carries right-of-publicity risk; owner has been briefed 3× and owns the call. Keep them OFF badges/obituary/marketing images and out of share text. A single const flips them off.)

- **PETER TEAL** — end of Sand Hill, beside the (already shipped) glowing Fellowship door, all black, chess pawn. Bubble on approach: `COMPETITION IS FOR PEOPLE.` If you enter his door, the DROPPED OUT ending's article headline becomes `FOUNDER TAKES THE TEAL FELLOWSHIP; MONOPOLY 'PENDING'`.
- **BARRY GAN** — Cerebral Valley demo-day sign, cap + double thumbs-up, bubble cycle: `YOU CAN JUST DO THINGS` · `SF IS BACK` · `BUILD BUILD BUILD` · (if you die within 60px of him) his next line is `...OK MAYBE NOT LIKE THAT`.
- **MELON TUSK** — never on screen: his rocket launches behind the Sand Hill skyline every ~45s. 1-in-10 launches, the rocket comes back down and lands (reusable). Sign: `ROCKET GUY'S PAD — "acquiring the fog next"`. Easter egg: stand watching a full launch without moving (burn-risk tradeoff!) → popup `WITNESSED HISTORY +$0K`.
- **SAM WALTMAN** — outside SYNERGY.AI campus, gray tee, tiny sign `it knows me`. After you defeat SYNERGY.AI, walking back past him: his sign now reads `it knew me`. (Two rects. Devastating.)
- **GARY THE ACCELERATOR DAD stays** as-is (composite) — Barry Gan is a different guy standing 300px away. Yes, both. That's the bit.

## 4. THE AI NOTETAKER — MEETLY.AI, the boss who doesn't fight ★
During the Chad Capital fight, a small drone (📎-shaped robot, blinking REC dot) floats in the arena corner "taking notes." It is invincible and does nothing. When you beat Chad, before the reward popup: screen dims, `MEETLY.AI HAS SENT THE RECAP` — a fake email overlay for 2.5s: *"Subject: Boss Fight — Recap & Action Items (47) · All action items assigned to: YOU · Next boss fight scheduled: now."* Then a term-sheet-sized enemy made of paper ("ACTION ITEMS") chases you for 10s (non-lethal, blocks like a board member). AI B2B SaaS notetaker apps: satirized. Clip: guaranteed.

## 5. SLOP PHASE — SYNERGY.AI final-boss phase 2
At ≤2 HP, SYNERGY.AI announces `GENERATING CONTENT` and starts spawning **slop clones**: wobbly, off-color, 6-fingered copies of ITSELF (drawn deliberately wrong: eyes misaligned, "AI" label misspelled `IA`, `A1`, `ΛI`). They shamble, die on any touch (popup `SLOP`), and drop $0. Pure spectacle + one real threat hidden among them (the clone drawn *correctly* deals damage — teaching players to spot real vs slop is the joke AND the mechanic).

## 6. SET PIECES (one each, placed, with final copy)
- **CORGI CAFÉ** (Mission, x≈2550): café storefront + a corgi (10×8px, devastating) that follows you for 30s when you walk past. While the corgi follows: burn rate is PAUSED (`morale: high`). If you take a hit, the corgi sits and waits for you. Popup on adoption: `CORGI ACQUIRED (acqui-hire)`. The corgi cannot die. The corgi must never be able to die.
- **HACKATHON HOUSE** (Cerebral Valley, x≈4460, replaces plain hacker-house sign with a door): enter → 12-second interior micro-room: energy-drink cans as +$1K coins, founders frozen mid-keystroke, a wall counter `HOUR 46 OF 48`, banner `SPONSORED BY OMNICORP CLOUD`. A `DEMO IN 10s` timer starts; reach the exit pedestal in time → win a PITCH DECK + trophy popup `1ST PLACE: a Notion template`. Fail → ejected with `honorable mention` (nothing). 
- **MATCHA RUN CLUB** (Mission): the 5AM run-club wave now carries matchas and wears matching merch; the last runner always lags, checking his phone — stomp-safe, bubble: `wait up. wait. guys.`
- **THE VIBES CMO** (Mission, x≈2500): ring-light NPC; passing her triggers a 1.5s fake vertical-video frame overlay around YOUR player ("✨ day in my life as an obstacle ✨ · 2.1M views"). You've been content. Non-lethal, once per run.
- **TOKENMAXXER ALLEY** (Cerebral Valley): the tokenmaxxer now yells `WAGMI` on spawn and `NGMI` when you stomp him. Rug tokens glint 1 frame late — the tell.

## 7. BALL-KNOWLEDGE LAYER (deep cuts — signs, quips, HUD flavor; zero mechanics)
New signs: `DEFAULT ALIVE? (survey pending)` · `SAFE NOTES: money now, math later` · `STEALTH STARTUP — 9 employees, 4 years, "almost ready"` · `COFFEE LINE: 25 MIN — all founders, no meetings` · `DOLORES PARK — 3PM STANDUP (blanket)` · `409A VALUATION: vibes` · `GPU WAITLIST: 14 months (or 1 DM)`. New Chad quips: `WHAT'S YOUR CAC TO LTV?` · `IS THIS VENTURE SCALE?` · `I ONLY DO PRE-SEED NOW` · `MY ANALYST LOVED IT. I DIDN'T ASK MY ANALYST.` New SYNERGY.AI quips: `I HAVE 40 IDENTICAL COMPETITORS` · `MY CONTEXT WINDOW REMEMBERS EVERYTHING` · `YOU WILL BE A CASE STUDY`. Post-boss beat: after Chad dies, a sign lights up behind his arena: `CHAD CAPITAL IS NOW CHAD.AI` (he pivoted, posthumously).
IPO bell bit: **first pull, the rope snaps** — popup `INFRA WASN'T READY TO SCALE` — second pull works. Every winner experiences one beat of pure panic. Clip.
Die 3+ times at the same x (±80): a FAILURE COACH NPC spawns there clapping: `fail faster! this is great for you!`

## 8. EASTER EGG ADDITIONS
Type `CORGI` on title → the corgi is already at your desk at spawn (run starts with morale high). Type `SLOP` → all enemies drawn in slop-style for the run (cosmetic chaos, same hitboxes). Idle at the corgi café 10s → `you are now a regular` (+nothing, forever). Konami code → gray zip-up + the mood meter reads `FOUNDER MODE` permanently.

---

## GUARDRAILS (unchanged, non-negotiable)
Tests green after every item (smoketest/playtest/deathtest + qa probes) · all timing reads `playMs` · no new required files for the game · visual ≥ hitbox · obituary/badges/share text NEVER include celeb names (grep-gate: `grep -iE 'teal|barry gan|tusk|waltman' shareText/makeBadge/makeObituary sections` → empty) · celebs behind `const RISKY_CAMEOS = true` at the top of the file · mood meter and obituary must not touch the fixed-timestep loop · CV difficulty tuning stays enemy-density-only.

## IMPLEMENTATION ORDER (each = 1 commit, test, screenshot)
1. Obituary screen + deathCause plumbing (flagship) → 2. Mood meter → 3. Bell-rope snap + Chad.AI sign + FAILURE COACH → 4. Celebs behind flag → 5. MEETLY.AI → 6. Corgi café → 7. Slop phase → 8. Hackathon house → 9. Vibes CMO + run club + tokenmaxxer voice lines → 10. Ball-knowledge copy batch + eggs → 11. Full bot regression (skilled + tourist, 3–6 min band holds; obituary renders for ≥6 different death causes with screenshots into qa/overnight/).
