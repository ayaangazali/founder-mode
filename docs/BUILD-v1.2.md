# FOUNDER MODE — BUILD v1.2 (billboards + the people patch)
### One self-contained spec. Copy this whole file into the repo as `docs/BUILD-v1.2.md`, then tell Claude Code to build it.

Two feature sets in one branch pass. Canon rules unchanged and enforced: satire lives in mechanics, archetypes only (never real people or groups as the punchline), money=RAISED / health=RUNWAY / death=OUT OF RUNWAY, celeb+partner+real-startup names NEVER appear on badges / obituaries / share text (grep-gated), fixed-timestep loop and playMs untouched, the corgi cannot die, visual ≥ hitbox. Work on branch `build-v1.2`, one commit per numbered item, all 3 Playwright suites + probes green after every commit, screenshot each new moment into `qa/overnight/`, do NOT merge or deploy — leave it for review.

---
---

# PART A — REAL-STARTUP BILLBOARDS (16 boards)

16 recognizable startup billboards float at parallax .5 in the background, two stacked heights. Each ships as a real name (taglines are affectionate + accurate, so they read fine pre-yes); flip `partner:true` per company as they confirm. A once-per-run "SPOTTED" popup fires only for `partner:true` boards.

## A1. The renderer (add near the other draw helpers)

```js
// ---- BILLBOARDS ----
const BILLBOARDS = [
  // ── SOMA (devtools) ──
  {x:300,  name:'SUPERSET',   tagline:'run 100 coding agents in parallel',   bg:'#0d1117', fg:'#20a7c9', partner:false},
  {x:640,  name:'VERCEL',     tagline:'deploys before you finish the sen—',  bg:'#000',    fg:'#fff',    partner:false},
  {x:1150, name:'SUPABASE',   tagline:'the backend your agent controls',     bg:'#1c1c1c', fg:'#3ecf8e', partner:false},
  {x:1650, name:'WARP',       tagline:'the terminal that finishes your bash',bg:'#0a0a0a', fg:'#01a2ff', partner:false},
  // ── THE MISSION (AI hype) ──
  {x:2250, name:'REPLIT',     tagline:'vibe-code your way to prod',          bg:'#0e1525', fg:'#f5960a', partner:false},
  {x:2800, name:'RESEND',     tagline:'email that actually lands',           bg:'#000',    fg:'#fff',    partner:false},
  {x:3350, name:'EXA',        tagline:'search, but it gets the vibe',        bg:'#1a1a2e', fg:'#8b5cf6', partner:false},
  // ── CEREBRAL VALLEY (agents) ── avoid THE PLATFORM arena ~5390-5640
  {x:4150, name:'FIRECRAWL',  tagline:'now hiring: 3 AI agents, $1M',        bg:'#0a0a0a', fg:'#ff6b35', partner:false},
  {x:4650, name:'BROWSER USE',tagline:'your agent, now with a browser',      bg:'#111',    fg:'#7cffa5', partner:false},
  {x:5100, name:'MANUFACT',   tagline:'USB-C for AI (it just works)',        bg:'#0f0f17', fg:'#41f2ff', partner:false},
  // ── SAND HILL ROAD (GTM + money) ── avoid CHAD arena
  {x:5800, name:'CLEAN',      tagline:'warm outbound. no cold slop.',        bg:'#0a0a0a', fg:'#4ade80', partner:true},
  {x:6100, name:'GOJIBERRY',  tagline:'GTM agents that actually close',      bg:'#1a1a2e', fg:'#e94f8a', partner:false},
  {x:6400, name:'CALLIX',     tagline:'GTM agents that dial for you',        bg:'#0a0a0a', fg:'#4ade80', partner:false},
  {x:6700, name:'INSFORGE',   tagline:'the agent-native AWS',                bg:'#0d1117', fg:'#58a6ff', partner:false},
  // ── THE CLOUD (infra + agents) ── avoid SYNERGY.AI arena
  {x:7300, name:'SUPERMEMORY',tagline:'your AI finally remembers you',       bg:'#141433', fg:'#c58bff', partner:false},
  {x:7600, name:'HYPERSPELL', tagline:'memory layer for your agents',        bg:'#141433', fg:'#a78bfa', partner:false},
  {x:7900, name:'AGENTMAIL',  tagline:'an inbox your agent can’t ignore',    bg:'#0a0a0a', fg:'#ffd94a', partner:false},
  {x:8200, name:'KINECT',     tagline:'the AI-native commerce stack',        bg:'#0f0f17', fg:'#00e0c6', partner:false},
  {x:8500, name:'IMAGINE AI', tagline:'we reverse-engineer your LinkedIn',   bg:'#1b1b3a', fg:'#a78bfa', partner:false},
];
// x-values are approximate: Claude Code MUST re-validate each sits in open sky,
// ≥300px apart, and OUTSIDE all three boss arenas (platform/Chad/SYNERGY). Nudge as needed;
// note any moves in PARTNERS.md. Two stacked heights: alternate y between 74 and 116 by index.

const _bbSpotted = {}; // name -> true, once per run; reset in reset()
function drawBillboard(b, i){
  const x = b.x - cam*0.5, y = (i % 2 === 0) ? 74 : 116;   // parallax .5, two rows
  if (x < -190 || x > W+40) return;
  px(x+22, y+40, 6, 60, '#3a3a44'); px(x+150, y+40, 6, 60, '#3a3a44'); // posts
  px(x, y, 180, 40, b.bg); px(x, y, 180, 3, b.fg);                     // panel
  cx.fillStyle=b.fg; cx.font='bold 15px monospace'; cx.fillText(b.name, x+10, y+21);   // wordmark (chunky)
  cx.fillStyle='#cbd5e1'; cx.font='7px monospace'; cx.fillText(b.tagline, x+10, y+33);  // tagline (crisp overlay + occlude)
  if (b.partner){ px(x+152, y+4, 24, 8, '#0a0a0a'); cx.fillStyle=b.fg; cx.font='6px monospace'; cx.fillText('REAL', x+155, y+10); }
}
```

## A2. Wire it in
1. Call the billboards in the **background pass** (after skyline, before gameplay entities), looping `BILLBOARDS.forEach(drawBillboard)`. Tagline text must route through the existing crisp-overlay + `occlude()` so it's legible; the wordmark stays on the chunky game canvas.
2. **SPOTTED popup:** in `update()`, for each `partner:true` board, if `!_bbSpotted[name]` and player passes within 40px, set it true, `raised += 5`, popup `SPOTTED: {name} (a real startup, unlike yours) +$5K`. Reset `_bbSpotted` in `reset()`. Fires only for partners so it never spams.
3. **PARTNERS.md** tracker file (status per board — see A3); flipping a parody→partner is a one-line `partner:true` + tagline edit.
4. **Guardrails:** billboards NEVER appear on badge/obituary/share text (extend the existing celeb grep-probe to also assert no `BILLBOARDS[].name` reaches those surfaces). Denylist-grep the tagline strings so no accidental trademark leaks elsewhere. Spacing + arena-avoidance probe (you already have a 16-check billboard probe pattern — keep it green).

## A3. PARTNERS.md status (start here; flip as yeses land)
| Board | Company | Reach | Status |
|---|---|---|---|
| CLEAN | tryclean.ai | you know them | ✅ REAL seed partner |
| MANUFACT | mcp-use YC S25 | your network | ping for verbal yes |
| INSFORGE | insforge.dev YC P26 | your network | ping for verbal yes |
| CALLIX | callix.io | your network | ping for verbal yes |
| HYPERSPELL | YC F25 | DM founder | real |
| GOJIBERRY / AGENTMAIL / KINECT / SUPERSET | YC | DM founder | real |
| FIRECRAWL | firecrawl.dev | DM @firecrawl_dev | real |
| BROWSER USE | YC W25 | DM | real |
| SUPERMEMORY | supermemory.ai | DM Dhravya | real |
| EXA / RESEND | exa.ai / resend.com | DM | real |
| IMAGINE AI | imagineai.me YC F25 | DM Sky Yang — on-theme | real, easy yes |
| VERCEL / SUPABASE / WARP / REPLIT | big | approach w/ proof | ship affectionate, flip partner on yes |

---
---

# PART B — THE PEOPLE PATCH (interns, cofounders, the mom round, Accelerator 2.0, CMO crank)

The game finally has *people*. Everything below has final copy written. Interns & cofounders reuse the existing follower AI (board member / corgi) — no new physics.

## B1. COFOUNDER PICKER (smallest first — unlocks MOM)
Title screen: add `[X] COFOUNDER` next to C/H/V, persisted in localStorage. A second small sprite trails you all run with a passive + occasional bubble. Four options:
- **TECHNICAL** — move speed +8%; silent except once: `pushed to prod.`
- **BUSINESS (50/50)** — no platforming help; gives one free correct answer in every investor mini-game. Bubbles: `I handle the business side.` · `I'm basically the CEO.` · `I found this game — that's the hard part.`
- **AI COFOUNDER** — free; ~once/run briefly auto-nudges your movement wrong. Bubbles: `I have 200 IQ.` · `I do not sleep.` · `I have deleted the database.` → `I have restored the database.`
- **YOUR MOM** — start at +1 RUNWAY, unlocks the mom-round flavor (B3). Bubble: `did you eat?`
End card shows `COFOUNDER: {name}`.

## B2. INTERNS ★ (flagship) — INTERN FAIR booth
Folding-table booth (SOMA x≈1400; second in Cerebral Valley near the hackathon house). Walk into an intern to hire (costs RAISED). Hold up to 2; each trails you with a lanyard. Weighted-random per booth:

| Intern | Cost | Does | The catch (popup) |
|---|---|---|---|
| THE GRINDER | $20K | auto-collect coins within 40px | 20s: `got a better offer. it was also unpaid.` |
| THE GHOST 👻 | $20K | nothing — accepts, never appears | 3s: `your intern ghosted — accepted 6 other offers` |
| THE 10X INTERN | $40K | tanks exactly one hit | then: `can I get equity? a title? to lead eng?` quits |
| THE NEPO INTERN | $30K | coin value +20% while employed | `my dad knows everyone at Sequoiadendron` · leaves in a town car |
| THE UNPAID INTERN | $0 | collects coins "for exposure" | 15s: a `LABOR BOARD` phantom spawns and chases you |

Hire popup `HIRED: {type} (-${cost}K)`. Booth sign `INTERN FAIR / equity: no / exposure: yes`. Eggs: hire 3 in one run → badge line `built a real team (allegedly)`; hire only THE GHOST → `SERIAL DELEGATOR`.

## B3. BACKED BY YOUR MOM ★★
**(a) MOM ROUND rescue:** once/run, on hitting 0 RUNWAY, a 1.2s beat before OUT OF RUNWAY: `📞 INCOMING: MOM` → `YOUR MOM LED YOUR SEED ROUND` `+2 RUNWAY · "I believe in you, sweetie"`. Fires if MOM is your cofounder, else 1-in-6 chance.
**(b) FLAVOR (the shareable gold):** when the mom round has fired or MOM is backer —
- Win badge line: `SEED LED BY: MOM (undisclosed)`
- HYPERGROWTH DAILY win pull-quote: *"The round was led by the founder's mother. 'He's always been very driven,' she said, declining to disclose terms."*
- Obituary loss line: *"The company's sole investor — the founder's mom — released a statement: 'I'm still proud of you.' The cap table was, in the end, a family matter."*

## B4. ACCELERATOR INTERVIEW 2.0 (upgrade the existing minigame + batch payoff)
Keep the 7-question / 10-second-total / short-answer-always-wins mechanic. Swap in this bank (✓ = correct/crisp answer):
- **"What does your company do?"** ✓`We help {X} do {Y}.` · `It's like Uber but for—` · `Honestly? It's a movement.` · `Can't say. Stealth.`
- **"How big is the market?"** ✓`$4B and growing.` · `Everyone is the market.` · `TAM is basically infinite.` · `We're creating the market.`
- **"Why you two?"** ✓`We've shipped this before.` · `I have the gene.` · `I dropped out, so.` · `A dream, mostly.`
- **"Who's your competition?"** ✓`{A} and {B} — we're faster.` · `No one.` · `We ARE the competition.` · `Google. They don't know yet.`
- **"What's your revenue?"** ✓`$12K MRR, up 40%.` · `Revenue is a distraction.` · `Pre-revenue. By choice.` · `Vibes are up.`
- **"Are you default alive?"** ✓`Yes — 18 months runway.` · `Define alive.` · `Spiritually, yes.` · `My mom is backing us.` ← if MOM is your backer, THIS answer also passes; partner says `...respect.`
- **"What'll you do with the money?"** ✓`Hire two engineers.` · `Billboards.` · `A bigger billboard.` · `Repaint the billboard.`
- **"Where in ten years?"** ✓`Category leader.` · `Acquired by SYNERGY.AI.` · `On the moon (literally).` · `I'll be on a podcast.`

**Payoff — the batch stamp.** Win (5/7) → stamped `ACCELERATOR · BATCH F26` for the run (season code evokes the real accelerator without ever writing its name — canon-safe). Shows as: title flair `▸ ACCELERATOR ALUM` after first acceptance; badge `CERTIFIED UNICORN · BATCH F26`; newspaper both outcomes `The BATCH F26 company…` (obituary: *"He was, it should be noted, BATCH F26."*). Reward stays DEMO DAY LETTER + $150K.

## B5. THE CMO (vibes) — crank the existing NPC
Keep the ring light, matcha, and the vertical-video frame that catches the player with a view counter. Add: the counter ticks up live for 1.5s + a `LIKE` heart floats off you; while in-frame, coins show `+0 REAL DOLLARS (impressions)` (vanity metrics, literally); new bubbles: `we did a brand moment.` · `the deck has a vibe.` · `2M views. zero signups. worth it.` · `the product? the *brand* is done.` · `pre-revenue, post-aesthetic.` Placement THE MISSION near the matcha powerup. Not an enemy.
*(The joke targets vibes-marketing behavior, not any group — same rule as every archetype in this game. Keeps it funny, never the mean screenshot.)*

---
---

# IMPLEMENTATION ORDER (branch `build-v1.2`, 1 commit each, test + screenshot after every one)
1. **Billboards** — array + `drawBillboard()` + background pass + SPOTTED popup + PARTNERS.md; validate spacing/arena, extend grep-probe so no board name reaches share surfaces.
2. **Cofounder picker** — [X] on title, 4 options, trailing sprite + passives + bubbles (unlocks MOM).
3. **Mom round** — rescue event + badge/newspaper/obituary flavor lines.
4. **Interns** — INTERN FAIR booth(s) + 5 types + follower behaviors + hire economy + eggs.
5. **Accelerator Interview 2.0** — new question bank + BATCH F26 stamp on title flair, badge, and newspaper.
6. **CMO crank** — bubbles + live view counter + `+0 REAL DOLLARS` in-frame coin reflavor.
7. **Full regression** — 3 suites + all probes + sense-act bot beats the game (skilled + tourist still land in the 3–6 min band); screenshot every new moment into `qa/overnight/`; add "why someone clips this" rows to `CLIP-REPORT.md`.

**Do NOT merge to main or deploy.** Leave `build-v1.2` for owner review.

## GUARDRAILS (repeat — non-negotiable)
Tests green after every commit · all timing reads `playMs` · fixed-timestep loop untouched · interns/cofounders reuse existing follower AI, no new physics · the corgi cannot die (probe holds) · billboard + celeb + real names NEVER on badge/obituary/share text (grep gate) · "ACCELERATOR / BATCH F26" only, never the real accelerator's name on any shareable surface · MOM is a role, never a real person · no demographic is ever the punchline · if a spec item conflicts with existing code, pick the smaller diff and note it in CLIP-REPORT.md.
