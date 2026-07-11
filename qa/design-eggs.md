# FOUNDER MODE — Easter Egg Design Spec
*Easter Egg Designer deliverable · written against `/home/claude/game/index.html` v0.1 (886 lines) and `MASTER-PLAN.md` canon §1.0. Line numbers below refer to the current file.*

---

## 0. Code facts every egg below is built on (verified by reading the source)

| Fact | Where |
|---|---|
| `frame` increments every tick **including on the title screen** (`update()` does `frame++` before the `state !== ST.PLAY` early-return) | line 284–286 |
| Main keydown listener lowercases keys into `keys{}`; a second listener handles `M` mute | lines 64–73, 115 |
| `'w'`, `'arrowup'`, `'space'` all start the game from the title (`JUMP()` at line 869) — any typed secret word must avoid `w`, arrows, and space | lines 80, 869 |
| Title screen: founder sprite idles at `(90, GROUND_Y-16)` i.e. `(90, 216)`; `cx.textAlign` is `'left'` until line 770 sets `'center'` | lines 765–787 |
| Boss quip speech-bubble style (white box, 6px monospace, 4×3 tail) is reusable | lines 545–553 |
| `enemies` is a top-level `let` (20 entries from `enemyDefs`); enemies only die via stomp or invincible-touch, never despawn; pit deaths do **not** reset them (only full death → `reset(false)` does) | lines 163–169, 207, 224, 315–321, 374–379 |
| Win path: `bosses[1].dead && p.x > 7400` → `endTime` set → `state = ST.WIN` → `showEndUI(true)` → `makeBadge(true)` | lines 455–462, 836 |
| Badge layout (1200×630): RAISED y=300, TIME y=360, BOSSES y=420, quote y=500, footer y=560 — **y=440–475 is empty** and available for flair | lines 806–825 |
| `fmtTime` exists (line 610); elapsed = `endTime - startTime` ms | lines 609–610 |
| Max camera x = `LEVEL_W - W` = 7020, so world-x 7400+ renders at screen-x 380+; anything wider than ~90px there clips off the right edge. Bell UI text occupies screen ≈402–436. A "sign at x=7499" is **never visible** (would render at screen 491+, off-canvas) — the given idea is repositioned in Egg 6 | lines 331–334, 622–630, 698–707 |
| Playwright probes share the page's global lexical scope, so any new top-level `let` is readable/writable via `page.evaluate` — **all new egg state must be top-level `let`** to stay testable | test harness convention |

---

## 1. Egg catalog (8 designs)

Ranked table, details after. Cost: S = ≤25 lines / ≤1h · M = ≤80 lines / half-day · L = bigger.

| # | Egg | Trigger | Payoff (one line) | Cost | Risk | Ship? |
|---|---|---|---|---|---|---|
| 1 | **ZERO CHURN** | Stomp all 20 enemies, then win | In-run popup + badge flair + share-text line: `ZERO CHURN` | S | Low | **SHIP** |
| 2 | **T2D3** | Win in under 3:00 | Badge flair + share-text line: `T2D3` — spawns "beat my time" reply chains (Plan §4.2's exact viral signal) | S | Low | **SHIP** |
| 3 | **THE REVERSE PITCH** | Idle 60s on the title screen | The idle founder turns to camera and starts pitching *you*, in a looping speech bubble, deck-slide by deck-slide | S | None | **SHIP** |
| 4 | **PIVOT** | Type `pivot` on the title screen (repeatable) | The subtitle pivots: "the SF startup platformer" → "a marketplace (for platformers)" → "rideshare for jumping" → … (canon §1.1: the startup has pivoted too many times to keep a name) | S | None | hold (v0.3) |
| 5 | **ADVISOR MODE** | The classic cheat-code sequence (↑↑↓↓←→←→BA), any time | A translucent gray-hoodie ghost founder trails you 0.75s behind, periodically emitting useless advice bubbles ("HAVE YOU TRIED GOING RIGHT?"). Cosmetic only. | M | Med | hold (v0.3) |
| 6 | **SPACE AVAILABLE** | Defeat SYNERGY.AI; a sign that was never there before now stands at x=7395, read during the walk to the Bell | `SPACE AVAILABLE / (previously: SYNERGY.AI)` — the coworking-husk joke closing its loop: you acquired them, their campus is instantly for lease | S | Low | hold |
| 7 | **NO GOING LEFT** | Hold ← against the world's left edge for 2s at run start | Popup `THERE IS NO GOING LEFT.`; do it again: `there was never any going left.` (verbatim canon, §1.1) | S | None | hold |
| 8 | **SERIAL ENTREPRENEUR** | 3rd+ death in one browser session (counter survives resets) | Loss-badge quote becomes `"serial entrepreneur" — you, technically`; title tagline becomes `attempt #N. investors love persistence.` | S | Low | hold |

### Why these beat the brief's starter ideas
- The brief's *"hidden sign at x=7499"* is geometrically impossible (see §0 table, last row) — Egg 6 keeps the spirit (a secret sign at the world's end) but moves it to x=7395, gates it on `bosses[1].dead` so it appears only post-acquisition, and upgrades the joke from "hidden text" to a **callback punchline** (the coworking-husk sign at x=1500 — `COWORKING / space available / (all of it)` — set it up 6000px earlier).
- The brief's *"100% stomp"* and *"sub-3:00"* ideas are kept but wired into the **badge PNG and clipboard share text**, not just a line on screen — the badge is the viral artifact (Plan §2.1 invariants), so flair that lives in the PNG travels to LinkedIn for free.
- The brief's *"idle 60s = the game pitches YOU"* is kept but staged as the **founder sprite doing the pitching** in the existing boss-bubble visual language, which is cheaper (reuses a proven draw pattern), funnier (the butt of the joke is the player-character, per canon rule 4), and screenshot-shaped (one bubble per beat).
- The brief's *"secret word"* and *"cheat-code advisor"* survive as Eggs 4 and 5 — good, but they lose the ship-now slots because their discovery rate is lower (nobody types on a title screen unprompted; the source is one readable file so they WILL be found eventually, which is fine for a v0.3 drop and gives launch week a "there's more hidden" news beat).

### Per-egg design notes (non-shipped)

**Egg 4 — PIVOT (S).** Keydown buffer: in the main listener, `if (state===ST.TITLE && e.key.length===1) typedBuf=(typedBuf+e.key.toLowerCase()).slice(-8);` then `if (typedBuf.endsWith('pivot'))` → `pivotIdx=(pivotIdx+1)%SUBS.length; typedBuf=''; sCoin();`. `drawTitle` renders `SUBS[pivotIdx]` instead of the hardcoded subtitle. Subtitle pool (canon §1.1 pivot history): `the SF startup platformer` · `a marketplace (for platformers)` · `a dev tool (for platformers)` · `rideshare for jumping` · `an agentic platforming platform` · back to start. Letters p-i-v-o-t collide with zero control keys. Risk: none.

**Egg 5 — ADVISOR MODE (M).** Trigger is the classic cheat-code sequence (↑↑↓↓←→←→BA) — that name is dev-facing shorthand only and must NEVER render in-game or in any player-visible string. Sequence detector on keydown against `['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a']` (arrows are `preventDefault`ed but still reach the listener — verified line 64–66). Toggle `advisor`. While PLAY: push `{x,y,face,runFrame}` into a 45-slot ring buffer each frame; draw `drawFounder` at the 45-frames-ago slot with `cx.globalAlpha=0.45` and a gray hood (add an optional hood-color param or a parallel tint — `drawFounder` already takes a `yc` recolor flag, extend the same way). Advice bubble (boss-bubble style) every ~300 frames from pool: `HAVE YOU TRIED GOING RIGHT?` · `JUMP, BUT MAKE IT STRATEGIC` · `I SAW THIS EXACT THING IN 2011.` · `FOCUS. ALSO, DO MORE.` · `I KNOW A GUY AT SYNERGY.AI` · `HAPPY TO INTRO YOU TO CHAD`. **Constraint: zero gameplay effect** (no collision, no blocking) — v0.2's BOARD MEMBER owns "follower that blocks"; the advisor must not steal that mechanic's thunder. **Risk (why it's M and held):** bubble clutter during boss fights (suppress advice while any `b.active && !b.dead` boss is within 300px) and ghost/player visual confusion in The Cloud's white palette (alpha 0.45 + gray hood mitigates). Needs eyeball QA via playtest screenshots.

**Egg 6 — SPACE AVAILABLE (S).** Add to `signs`: `{x:7395, l:['SPACE AVAILABLE','(previously: SYNERGY.AI)'], post:true}` and in the sign draw loop (line 622): `if (sg.post && !bosses[1].dead) continue;`. At player x 7340→7400 the camera is pinned at 7020, so the sign renders at screen-x 375–470 — fully readable for the ~2s walk to the Bell, gone from every earlier moment of the game. Clear of the bell prompt (screen 402–436 at y=GROUND_Y-44; the sign body tops out at GROUND_Y-42 with 2 lines — if it kisses the prompt, drop to `l:['SPACE','AVAILABLE','(prev: SYNERGY.AI)']` which narrows it). Risk: low; verify with one screenshot.

**Egg 7 — NO GOING LEFT (S).** In `update()` player block: `if (L() && player.x <= cam - 1.5 && player.onGround) leftT++; else leftT=0;` at `leftT===120` → `addPop(player.x+20, player.y-14, leftMsgN===0 ? 'THERE IS NO GOING LEFT.' : 'there was never any going left.', '#8d99ae'); leftMsgN=1; leftT=-240;` (cooldown). Works anywhere the camera pins you, which in practice is the spawn. Risk: none.

**Egg 8 — SERIAL ENTREPRENEUR (S).** Top-level `let sessionDeaths=0;` increment where `state = ST.DEAD` is set (two sites: lines 274, 318). In `makeBadge(false)`, if `sessionDeaths>=3` force the quote to `"serial entrepreneur" — you, technically`. In `drawTitle`, if `sessionDeaths>=3` swap line 785's tagline for `attempt #${sessionDeaths+1}. investors love persistence.`. No localStorage (per-session only — persistence is a v0.3 decision). Risk: low; interacts with v0.2's rotating quote pools (this egg's quote simply wins when the condition holds).

---

## 2. SHIP SET — full implementation spec (Eggs 1, 2, 3)

All three are S. Combined diff ≈ 60 lines, all additive, no existing behavior changed, game stays one file. Suggested single commit: `easter eggs: ZERO CHURN, T2D3, reverse pitch`.

### 2.0 Shared: badge flair rail

New top-level function (put it next to `makeBadge`, ~line 790):

```js
function badgeFlairs(won){
  const f = [];
  if (!won) return f;
  if (enemies.every(e => e.dead)) f.push('ZERO CHURN');
  if ((endTime || playMs) < 180000) f.push('T2D3');   // simulated play clock — see timing note below
  return f;
}
```

**In `makeBadge(won)`** — insert after the BOSSES line (line 821), before the quote (line 822):

```js
const flairs = badgeFlairs(won);
if (flairs.length){
  b.fillStyle = '#ff8c37'; b.font = 'bold 30px monospace';
  b.fillText('FLAIR: ' + flairs.join('  ·  '), 320, 462);
}
```

y=462 sits in the verified empty band between BOSSES (y=420) and the quote (y=500). `#ff8c37` is the existing accelerator-orange accent already in the palette. Both flairs together = `FLAIR: ZERO CHURN  ·  T2D3` = 24 chars × ~18px ≈ 430px wide, fits the 880px column.

**In `shareText(won)`** (line 829) — append to the *win* string only, before the final question line:

```js
const f = badgeFlairs(true);
// win variant becomes:
`I just beat FOUNDER MODE 🦄\n\nRaised ${fmtMoney(raised)}, ...defeated SYNERGY.AI in ${t}.` +
(f.length ? `\n\nFlair earned: ${f.join(' · ')}.` : '') +
`\n\nCan you ring the IPO bell faster?`
```

Timing note (UPDATED post fixed-timestep pass, FINAL-REVIEW item 41): the game clock is now the simulated `playMs` (accumulated per update() step) and `endTime` is a `playMs` snapshot taken before `showEndUI` in both win and death paths — `badgeFlairs` never sees a stale value. T2D3 MUST read this simulated clock, never `performance.now()` wall time, so backgrounded tabs neither help nor hurt the run.

### 2.1 Egg 1 — ZERO CHURN

**Design.** Lore: churn is the first monster every founder meets (Plan §1.3); a run where nothing churned is the founder's impossible dream, stated with a straight face as a retention metric. Satire lives in the mechanic (canon rule 1): the reward is for *doing the tedious completionist thing founders actually brag about*.

**Trigger.** Every one of the 20 `enemies` has `dead === true` at win time. Feasibility verified: all enemies sit between x=520 and x=6420, backtracking works (camera follows the player left, line 332; boss walls block only while the boss is alive), enemies never despawn, and invincible-touch kills (line 374) count — handled is handled. Pit deaths don't resurrect enemies; full death restarts the run, which naturally restarts the counter.

**Payoffs (three, layered):**
1. *In-run moment* — the instant the final enemy dies, in **both** kill branches (invincible-touch line 374 and stomp line 375–379), after setting `e.dead = true`:
   ```js
   if (enemies.every(x => x.dead)) addPop(e.x, e.y - 18, 'ZERO CHURN', '#ff8c37');
   ```
   (One `every()` over 20 items per kill, ≤20 times per run — negligible. Must be inside the kill branches, not per-frame.)
2. *Badge flair* — `ZERO CHURN` via §2.0. This is the artifact that reaches LinkedIn.
3. *Share text* — `Flair earned: ZERO CHURN.` via §2.0.

**Risk: Low.** Sole failure mode would be an unreachable/unkillable enemy; audit of `enemyDefs` against `segs` shows every spawn on solid ground with stompable patrol space. Deathtest/playtest unaffected (purely additive).

### 2.2 Egg 2 — T2D3

**Design.** "T2D3" (triple-triple-double-double-double) is the canonical VC growth-curve meme — flair for a sub-3:00 run reframes speedrunning as hitting your growth plan, deadpan (canon rules 2 and 5: never say "speedrun", say T2D3). The run targets 3–6 min (Plan §1.1), so sub-3:00 is genuinely expert: skip coins, no-hit the bosses. This manufactures the "beat my time" reply chain the plan explicitly lists as a week-1 success signal (§4.2).

**Trigger.** `won && endTime < 180000` (endTime = simulated playMs snapshot) — evaluated only inside `badgeFlairs`, no new state.

**Payoffs.** Badge flair `T2D3` + share-text line, both via §2.0. No in-run popup (the player is busy winning; the badge is the reveal).

**Risk: Low.** Client-side timer is console-editable — irrelevant, everything in this game is; there's no leaderboard until v0.3 (which has its own server-side plan). One real interaction to respect later: v0.3's daily "market conditions" modifiers change run difficulty, so if a leaderboard ever consumes T2D3, tag it with the daily seed. Not this diff's problem.

### 2.3 Egg 3 — THE REVERSE PITCH (title idle 60s)

**Design.** The founder has been standing on the title screen the whole time. After 60 seconds of being ignored, they do the only thing a founder knows how to do to a warm body that won't respond: pitch it. Canon rule 4 (player-character is the butt, lovingly) and rule 5 (pitch-deck register, straight face). It rewards the exact person most likely to screenshot it: someone who left the tab open.

**New state** (top-level `let`, next to `frame` at line 205, so probes can reach it):

```js
let idleT = 0;
```

**Reset on input** — three touchpoints:
1. Main keydown listener (line 64 block): add `idleT = 0;`
2. Touch `bind()` touchstart handler (line 88): add `idleT = 0;`
3. Canvas touchstart (line 92): add `idleT = 0;`

**Tick** — in `update()` immediately after `frame++` (line 285):

```js
if (state === ST.TITLE) idleT++; else idleT = 0;
```

**Render** — in `drawTitle()`, insert immediately after the `drawFounder` call (line 768), while `cx.textAlign` is still `'left'` (required: the bubble uses `measureText` + left-anchored `fillText`, same as the boss bubble):

```js
if (idleT > 3600){
  const PITCH = [
    "hey. quick pitch while you're here.",
    'FOUNDER MODE. pre-revenue. pre-you.',
    'TAM: everyone with a keyboard.',
    'traction: you read this far.',
    'the ask: one (1) press of SPACE.',
    "we'll circle back."
  ];
  const q = PITCH[Math.floor((idleT - 3600) / 240) % PITCH.length];
  cx.font = 'bold 6px monospace';
  const tw = cx.measureText(q).width;
  const bx = clamp(96 - tw / 2 - 3, 2, W - tw - 8);
  px(bx, 190, tw + 6, 10, '#fff');
  px(bx + 6, 200, 4, 3, '#fff');        // tail, points at the founder below
  cx.fillStyle = '#111';
  cx.fillText(q, Math.round(bx + 3), Math.round(190 + 7.5));
}
```

Geometry: founder head top is y=216; bubble box at y=190–200 + tail 200–203 clears the head by 13px and sits below the controls line (y=190 text baseline is at the far right/center — the bubble is left-clamped near x≈30–160 for these string widths, no collision with the centered `←→ / AD move…` line whose glyphs near x<160 it may kiss; if playtest screenshot shows overlap, move the bubble to y=204/tail 214, still 2px clear of the head). One line every 240 frames (4s); after `we'll circle back.` the loop restarts from the top — a founder circling back and re-pitching from slide one *is* the joke. Any input zeroes `idleT` and the bubble vanishes; starting the game leaves no residue.

Longest line = 35 chars × ~3.7px ≈ 130px — fits at every clamp position.

**Risk: None.** Title-only, draw-only, self-cancelling. Existing tests never idle 60s so nothing regresses.

---

## 3. Canon compliance check (all 8 against §1.0's six laws)

1. *Satire in mechanics:* ZERO CHURN rewards a retention obsession; T2D3 renames mastery as a growth curve; Reverse Pitch punishes(rewards) inaction with fundraising. Pass.
2. *In-universe naming:* no "score/achievement/speedrun/secret" anywhere — FLAIR, ZERO CHURN, T2D3, circling back. Pass.
3. *No trademarks / real people:* T2D3 is an industry meme, not a mark. Display copy never names a real company: Egg 4's pivot subtitle is `rideshare for jumping` and Egg 5's advisor says `I SAW THIS EXACT THING IN 2011.` (§1.1's "Uber for something" is unrendered lore prose, not display-copy precedent — rule 3 applies to every string that renders). Advisor quips otherwise name only in-universe entities (Chad, SYNERGY.AI). Pass.
4. *Player is the butt, lovingly:* the pitch's "traction: you read this far."; "serial entrepreneur — you, technically". Pass.
5. *Deadpan corporate-absurd:* every string above is deliverable with a straight face; nothing wacky/random. Pass.
6. *Real tropes + invented absurdity mixed:* T2D3 (real) beside a game that pitches its player (invented). Pass.

---

## 4. QA plan for the ship set

Run from `/home/claude/qa` (playwright resolves; target `file:///home/claude/game/index.html`). All new state is top-level `let` → reachable via `page.evaluate`.

1. **Regression:** `node /home/claude/game/test/smoketest.js && node /home/claude/game/test/playtest.js && node /home/claude/game/test/deathtest.js` — must stay green (all changes additive).
2. **ZERO CHURN probe:** evaluate `enemies.forEach(e => e.dead = true); bosses.forEach(b => b.dead = true); player.x = 7405;`, wait 500ms, assert `state === 2`, screenshot `#uicard img` → badge shows `FLAIR: ZERO CHURN  ·  T2D3` (fast win also earns T2D3 — expected). Negative: leave one enemy alive → flair line absent or T2D3 only.
3. **T2D3 negative probe:** same warp but first `playMs = 200000;` → badge shows ZERO CHURN only.
4. **Reverse Pitch probe:** on title, evaluate `idleT = 3599;`, wait 3 frames, screenshot → bubble with line 1; evaluate `idleT = 3600 + 240*5;` → screenshot shows `we'll circle back.`; press ArrowLeft (non-starting key), assert `idleT === 0` and bubble gone.
5. **Eyeball pass (comedy QA is human, Plan §M-notes):** read the two badge screenshots and the idle-title screenshot; confirm nothing overlaps and the flair line reads clean at LinkedIn thumbnail size (~300px wide — 30px font survives).

---

## 5. Rollout note

Ship Eggs 1–3 pre-launch (they feed the badge/share loop from day one). Bank Eggs 4–8 as the launch-week content valve: dropping ADVISOR MODE or PIVOT mid-week gives the HN/LinkedIn thread a second "there are secrets" news beat without touching balance. Egg 6 (SPACE AVAILABLE) pairs naturally with any v0.2 sign-copy commit since it's one array entry + one guard line.
