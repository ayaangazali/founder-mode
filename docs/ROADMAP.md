# Roadmap — v0.2 (pre-launch) and v0.3 (launch week)

> **STALE-DOC NOTICE (2026-07-13):** this document describes the v0.1 build
> (~1,300 lines, 4 zones, no mini-games). The shipped game is ~3,900 lines with
> 5 zones, mini-games, leaderboard, and the MASH-R finale. Read this as design
> history; for current truth use CLAUDE.md, qa/CHANGELOG.md, and
> docs/AUDIT-2026-07-13.md.

Priorities derived from the fact-checked research (see RESEARCH-REPORT.md). Each item says *why*, *what*, and *how*.

---

## v0.2 — do these BEFORE any public post (~half a day)

### 1. Deploy to a real URL
Why: links spread, files don't. How: BUILD-GUIDE.md Step 2. **This is the only truly blocking item.**

### 2. De-risk the acceptance-letter power-up
Why: the orange square with "Y" reads as real trade dress (report §8). Post-*Jack Daniel's v. VIP*, using someone's mark as your own identifier is the *least* protected form of parody.
How, in `index.html`:
- In the powerup drawing block, change the `'yc'` case: different color (e.g. gold envelope with a rocket stamp), no "Y".
- Rename strings: `'YC ACCEPTED! INVINCIBLE'` → `'ACCELERATED! INVINCIBLE'`, `'YC MODE'` → `'DEMO DAY MODE'`.
- Archetypes stay: "Chad Capital" and "SYNERGY.AI" are invented names and fine as-is.

### 3. Burn rate — satire in the mechanics
Why: report §4 — theme must live in the game loop. Burn rate means you literally cannot stand still, which is both difficulty tuning and the joke.
How: add to `update()` under the player block:
```js
// burn rate: standing still burns runway
if (Math.abs(p.vx) < 0.3 && p.onGround) p.burnT = (p.burnT||0) + 1; else p.burnT = 0;
if (p.burnT === 60*6){ hurtPlayer(); addPop(p.x, p.y-14, 'BURN RATE', '#ff5a5a'); p.burnT = 0; }
```
Six idle seconds → lose a heart with a "BURN RATE" popup. Tune the 6s to taste; show a smoke particle after ~3s as warning.

### 4. Double-edged term sheets (optional, funniest mechanic on the list)
Why: raising money = power + obligations.
How: when a `sheet` powerup is taken, also spawn a slow "BOARD MEMBER" follower (reuse the gremlin walker with a tie, non-lethal but blocks movement) that trails the player for 20s. +1 runway, −1 freedom.

### 5. First-30-seconds difficulty pass
Why: feed-clickers must reach a joke and a stomp before any threat (report §5 inference).
How: in `enemyDefs`, move the first gremlin from x:520 to x:650; add one free coin row at x:150, y:200. Verify no pit before x:760 (already true).

### 6. Badge polish
- Bake the game URL into the PNG itself (edit `makeBadge()` footer line) — screenshots travel without links on LinkedIn, so the image must carry the URL.
- Add "🔥 daily seed #N" line once §7 ships.

---

## v0.3 — launch week (~a day)

### 7. Daily seed + comparable runs
Why: Wordle's "everyone plays the same puzzle" effect (report §5).
How: derive a seed from the date, use a tiny seeded RNG for enemy placement jitter and a daily "market conditions" modifier shown on the title screen (e.g. "RATES HIGH: coins worth −20%", "AI HYPE: SYNERGY.AI has +1 HP"). ~30 lines.

### 8. Dynamic per-player OG badges (Vercel serverless)
Why: report §9 — when someone pastes their result URL on LinkedIn, *their* badge should be the preview image.
How (verified path, Vercel docs current as of 2026-06):
1. `npm i @vercel/og` and add `api/og.jsx`:
```jsx
import { ImageResponse } from '@vercel/og';
export const config = { runtime: 'edge' };
export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const raised = searchParams.get('raised') ?? '0';
  const time = searchParams.get('time') ?? '??:??';
  const won = searchParams.get('won') === '1';
  return new ImageResponse(
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column',
      justifyContent:'center', padding:'80px', background:'#141433',
      color: won ? '#ffd94a' : '#ff5a5a', fontSize:64, fontFamily:'monospace' }}>
      <div>{won ? 'CERTIFIED UNICORN' : 'OUT OF RUNWAY'}</div>
      <div style={{ color:'#7cffa5', fontSize:44 }}>RAISED ${raised}K · {time}</div>
      <div style={{ color:'#8d99ae', fontSize:32 }}>FOUNDER MODE — can you beat it?</div>
    </div>,
    { width: 1200, height: 630 }
  );
}
```
2. On win/death, build a result URL `https://YOUR-DOMAIN/?r=1510&t=94&w=1` and have a tiny bit of JS rewrite the page's `og:image` server-side — simplest is a `/r` route (one more edge function) that serves a redirect page whose `<meta og:image>` points at `/api/og?...`. The COPY POST button should copy this result URL.
3. Constraints: Satori supports a flexbox CSS subset only (no grid/z-index/calc); fonts must be ttf/otf/woff; 500KB edge bundle cap.

### 9. Global leaderboard (Supabase, ~50 lines)
Why: scoreboard comparison drives repeat plays; daily reset keeps it winnable.
How:
1. Free Supabase project → table `scores(id uuid default gen_random_uuid(), name text check (char_length(name) <= 24), raised int, ms int, day date default current_date, created_at timestamptz default now())`.
2. Enable Row Level Security with INSERT-for-anon and SELECT-for-anon policies (no update/delete).
3. Client: `@supabase/supabase-js` via CDN `<script>`, insert on win, `select ... where day = today order by ms asc limit 10` for the board. Show it on the win screen under the badge.
4. Cheating: scores are client-side and forgeable. For a humor game, accept it — cap `raised` at the theoretical max (sanity check in a DB constraint) and consider the inevitable cheater screenshot to be free content.

### 10. Instrument the funnel (optional)
One free analytics pixel (e.g. Plausible/GoatCounter) + three custom events: `start`, `first_boss`, `win`. You want to know where feed traffic dies. Target: first-time players reaching *a* badge screen (win or death) >80% — the badge only spreads if people reach it.

---

## Explicitly cut (scope discipline is the strategy)
- More levels, world map, characters select — no. 2048 was one board.
- Accounts/logins — never. Signup is friction; friction kills virality.
- Mobile app builds — the browser IS the distribution.
- Multiplayer — the leaderboard is the multiplayer.
