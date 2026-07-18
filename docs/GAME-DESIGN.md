# Game Design & Code Map

How FOUNDER MODE works internally, and exactly where to change things. All references are to sections of `index.html` (search for the `// ---- SECTION ----` comment banners).

## Architecture at a glance

- **Rendering:** 480×270 internal canvas scaled up with `image-rendering: pixelated` — this is what makes plain `fillRect` calls look like authentic pixel art. All sprites are drawn with rectangles; there are no image assets.
- **Loop:** `requestAnimationFrame` → `update()` (physics, AI, collisions) → `draw()` (background → world → entities → HUD).
- **States:** `TITLE → PLAY → WIN | DEAD` in the `ST` enum.
- **Audio:** WebAudio oscillator bleeps, created lazily on first input (browser autoplay rules). No audio files.
- **Level:** one long world, `LEVEL_W = 7500` px, four themed zones.

## Where to change things

### Jokes & writing
| What | Where |
|---|---|
| Roadside sign jokes | `signs` array — `{x, l:[lines]}`. Add/edit freely; width auto-fits. |
| Boss trash talk | `bosses[n].quips` arrays ("WHAT'S YOUR MOAT?", "YOUR STARTUP IS A PROMPT"). Cycles every ~2.3s. |
| Buzzword projectiles | the `words` array inside the boss attack block (`['PIVOT','SYNERGY','GTM','AGENTIC','B2B']`) |
| Stomp reward messages | `msgs` object in the enemy-collision block (`CHURN CRUSHED!`, `MEETING CANCELED!`...) |
| Badge one-liners & share post text | `makeBadge()` and `shareText()` in END SCREENS + BADGE |
| Zone names | `zoneName()` |

### Difficulty
| Lever | Where | Current |
|---|---|---|
| Move speed / coffee speed | `const speed = p.coffeeT > 0 ? 2.5 : 1.7` | 1.7 / 2.5 |
| Jump height | `JUMPV = -6.6`, gravity `GRAV = 0.35` | comfortably clears all pits |
| Starting health | `hearts = 3` in `reset()` | 3 (max 5 via term sheets) |
| Enemy speed | `espd` in enemy update (`s`cooter 1.1, others 0.45) | |
| Boss HP | `hp` in the `bosses` array | VC: 3, SYNERGY.AI: 5 |
| Boss attack rate | `b.atkT = 95` (VC) / `70` (AI) — frames between shots | |
| Pit widths | gaps between `segs` entries (currently 42–62px; max jumpable ≈ 60 at base speed, more with coffee) | |
| Checkpoints | `checkpoints` array (one per zone start) | |

### World layout
- `segs` — ground segments `[x0,x1]`; the gaps are pits.
- `plats` — floating platforms `[x, y, width]`; one-way (jump up through, land on top). Drawn as crates in the city, clouds past x≈5460.
- `coinRows` — `{x, y, n}` places n "$" coins 16px apart.
- `enemyDefs` — `{x, t}` with `t` ∈ `g` (churn gremlin), `m` (standing meeting — hops), `s` (scooter bro — accelerates toward you).
- `powerDefs` — `{x, y, t}` with `t` ∈ `coffee` | `yc` | `sheet`.

### Entities & satire-by-mechanics notes
- **Churn gremlin** — slow walker; the tutorial enemy.
- **Standing meeting** — a calendar invite with legs; periodically hops (harder to stomp mid-hop). The joke: it wastes your time by controlling the tempo.
- **Scooter bro** — fast; homes toward the player within 140px.
- **Chad Capital (VC boss)** — paces, lobs "TERMS" paper in arcs (arc = the negotiation), quips. 3 stomps.
- **SYNERGY.AI (final boss)** — bigger, faster attacks, buzzword bullets that wobble sinusoidally (they never travel in a straight line, because of course they don't). 5 stomps.
- **Score = "RAISED $"**, health = **"RUNWAY"**, death = "OUT OF RUNWAY". Keep all new mechanics named in-universe; the research (report §4) shows theme-in-mechanics is what earns satire games their reputation.

### Badge / share system
- `makeBadge(won)` draws a 1200×630 PNG (LinkedIn OG card ratio) on an offscreen canvas: title, run stats, blown-up player sprite, one-liner. Edit copy/colors here.
- `shareText(won)` is the clipboard text for the COPY LINKEDIN POST button. Win and loss variants.
- Both are wired up in `showEndUI(won)` — download uses `canvas.toDataURL`; copy uses `navigator.clipboard` with a graceful fallback message.

### Identity & daily board (accounts-lite)
- `normalizeName()` / `claimIdentity()` - the client name policy (uppercase, `A-Z0-9 .-`, max 14), mirroring the server checks in `api/leaderboard.mjs`. The name lives in `localStorage` key `fm_name`; it is optional, local-first, and never gates play.
- Title-screen entry points: the `[L] TODAY'S BOARD` / `[N] CLAIM IDENTITY` rows drawn in `drawTitle()`, tap zones in `HOME_ZONES`, panels in `showLeaderboard()` / `showIdentityClaim()` / `closeHomePanel()` (END SCREENS area). Escape or the opening key closes a panel; `eggInProgress()` keeps L/N from firing while a title egg (CORGI/SLOP) is being typed.
- Endpoint seam: `LB_ENDPOINT = window.FOUNDER_MODE_LEADERBOARD_URL || '/api/leaderboard'` - set the global before the game script to point at another deployment. `LB_ON` gates all network: on `file://` the game never fetches.
- Board cache: a successful read lands in `localStorage` key `fm_board_<seed>` (prior days pruned); offline the board renders the cache or hides its entry point.

### Known v0.1 limitations (intentional scope cuts)
- The daily leaderboard is global only once deployed with Supabase env vars set (`api/leaderboard.mjs` header has the setup). Unconfigured, the route answers ok:false and the board just stays empty; on `file://` with no cache the `[L]` title entry hides and the game falls back to the localStorage personal best.
- Link previews use a static OG image — dynamic per-run badges need a serverless endpoint (ROADMAP.md §2).
- The "Y" acceptance-letter power-up should be renamed/redrawn before public launch (research report §8 — trade-dress risk).
- One level. That's a feature: research says finishable-in-minutes drives completion, and completion drives shares.
