# FOUNDER MODE — "PICK YOUR FOUNDER" Character Customization Spec

**Version:** 1.0 · July 2026 · Character Customization Designer
**Milestone:** implemented NOW (pre-M0), by orchestrator decision recorded in FINAL-REVIEW.md §4.2 — this spec is not milestone-orphaned; it ships with the launch fix batch.
**Target file:** `/home/claude/game/index.html` (the game is ONE file; no frameworks, no assets)
**Companion files needing a sync pass:** `/home/claude/game/sprites.js` (§7 drawFounder copy), `/home/claude/game/gallery.html` (renders via sprites.js)
**Validated artifacts produced with this spec (in `/home/claude/qa/`):**
- `contrast-check.js` — node script that computes every WCAG contrast ratio in the tables below (re-run after any hex change: `node contrast-check.js`, must print `ALL RULES PASS`)
- `preview.html` + `customization-preview.png` — headless render of all 4 hair styles × 6 skins × 6 hoodies on BOTH the dusk gradient and the badge gradient (playwright screenshot; geometry below is verified against this image)

---

## 0. What this feature is

A title-screen "pick your founder": **6 skin tones × 4 hair styles × 6 hoodie colors** (144 combos). Cycled with **C / H / V** keys on desktop, **tap chips** on mobile, **persisted in localStorage**, and consumed by **every** place the founder is drawn — in-game player, title preview, and the 1200×630 share badge (`makeBadge`). The share badge showing *your* founder is the viral payoff: every LinkedIn badge is now personal.

### Canon compliance (MASTER-PLAN §1.0)
- Satire in mechanics/copy, not the skin: the picker caption is `cosmetic. like most pivots.` — deadpan, self-aware (§1.0 rule 5).
- No gender labels anywhere. Hair styles are named **HOOD UP / BUZZ / CURLY / PONYTAIL** — style names, never "male/female".
- Skin tones are labeled **TONE 1/6 … 6/6** — never cutesy names, never food metaphors.
- Hoodie color names are startup-deadpan: FOG, MATCHA, GRAPE, SUNSET, OAT MILK, UPTIME.
- The lore says the founder is "a hoodie, jeans, and white sneakers with a person somewhere inside them" — so jeans (`#3b5bdb`) and white sneakers (`#e8e8e8`) are **not** customizable. The hoodie stays the identity; only its color changes.
- localStorage is *consistent with* the plan's intent (§1.7 SERIES B MODE will use it) — §1.7 itself is traction-gated v1.0 content, so this spec introduces the game's first actual localStorage use.

### Hard invariant: zero regression at defaults
Default look = `{s:1, h:0, v:0}` = canon skin `#f2c9a0`, HOOD UP, FOG hoodie. The new `drawFounder` renders this **pixel-identical** to the current sprite (proof in §4.1). A player who never touches the picker — and every existing Playwright test — sees exactly the v0.1 founder.

---

## 1. Data model

Insert at the top of the `// ---- SPRITES ----` section (just above the current `drawFounder`, index.html line ~467). All plain globals, matching the file's style — reachable from `page.evaluate` for tests.

```js
// ---------------- FOUNDER LOOK (customization) ----------------
// 6 skin tones, light→deep. Each tone carries its own hair colors
// (hair color is paired to tone, not separately customizable — keeps
// the picker to exactly three keys and every pairing pre-validated).
const SKINS = [
  { skin:'#ffdfc2', hair:'#6b4a2e', hairDk:'#503620' },
  { skin:'#f2c9a0', hair:'#4a3626', hairDk:'#35261a' },  // 1 = canon default
  { skin:'#dba470', hair:'#3a2a1e', hairDk:'#2a1d14' },
  { skin:'#b5825a', hair:'#2e2016', hairDk:'#20160e' },
  { skin:'#9a6a45', hair:'#241812', hairDk:'#170f0a' },
  { skin:'#84573a', hair:'#1d130c', hairDk:'#120b06' },
];
const HAIRS = ['HOOD UP','BUZZ','CURLY','PONYTAIL'];   // style names shown in the picker
const HOODIES = [
  { name:'FOG',      main:'#7f8ea3', pocket:'#5f6e83' },  // 0 = canon default
  { name:'MATCHA',   main:'#5da06b', pocket:'#41794e' },
  { name:'GRAPE',    main:'#a281e6', pocket:'#7e5fc0' },
  { name:'SUNSET',   main:'#d9748f', pocket:'#a9556c' },
  { name:'OAT MILK', main:'#d8c9a8', pocket:'#b0a17f' },
  { name:'UPTIME',   main:'#3aa8a0', pocket:'#2a7f79' },
];

// picker state (indices) — NOT reset by reset(); survives runs and reloads
let look = { s:1, h:0, v:0 };
try {
  const j = JSON.parse(localStorage.getItem('fm_look'));
  if (j) look = {
    s: clamp(j.s|0, 0, SKINS.length-1),
    h: clamp(j.h|0, 0, HAIRS.length-1),
    v: clamp(j.v|0, 0, HOODIES.length-1),
  };
} catch(e){ /* private mode / blocked storage — canon default */ }

// resolved colors consumed by every draw site (incl. makeBadge & sprites.js)
function resolveLook(){
  const S = SKINS[look.s], V = HOODIES[look.v];
  return { skin:S.skin, hair:S.hair, hairDk:S.hairDk,
           hood:V.main, pocket:V.pocket, hairStyle:look.h };
}
window.FOUNDER_LOOK = resolveLook();

function cycleLook(k){                       // k: 's' | 'h' | 'v'
  const n = k==='h' ? HAIRS.length : 6;
  look[k] = (look[k] + 1) % n;
  window.FOUNDER_LOOK = resolveLook();
  try { localStorage.setItem('fm_look', JSON.stringify(look)); } catch(e){}
  beep(880, .05, 'square', .05);             // picker tick
}
```

Notes:
- `clamp` already exists (HELPERS section). `beep` already exists (AUDIO section). Since the whole file is one `<script>`, hoisting is fine as long as this block sits **after** HELPERS/AUDIO in source order — the SPRITES section already is.
- `window.FOUNDER_LOOK` (rather than a bare global) is deliberate: `sprites.js` reads the same property with a fallback so `gallery.html` keeps working standalone (§7).
- **Hair color is paired to skin tone, not a fourth cycler.** This keeps the promised C/V/H three-key interface, and lets every hair-on-skin and hair-on-background contrast pair be pre-validated (§2). Pairs go lighter-brown → near-black as tones deepen; for the two deepest tones the *hair* carries head-silhouette contrast against the pink dusk band where the skin luminance is closest to the background (numbers in §2.1).

---

## 2. Palettes + contrast validation

Method: WCAG relative-luminance contrast ratios (`contrast-check.js`), tested against every background the founder is actually drawn on:

| sample | hex | where |
|---|---|---|
| badgeTop | `#141433` | makeBadge gradient top (and dusk sky top) |
| badgeBot | `#2a1a3e` | makeBadge gradient bottom |
| duskMid | `#3a2a55` | drawBG gradient 55% stop |
| duskLow | `#7a4467` | drawBG gradient 80% stop — **this is the band at player-head height (y≈216)** |
| skyline | `#191631` | near-skyline buildings behind the player |
| asphalt | `#33323f` | ground fill below GROUND_Y |

**Acceptance rules (all pass — re-verify with `node /home/claude/qa/contrast-check.js` after any tweak):**
1. For every skin tone, the head group (skin **or** its paired hair) reaches **≥ 2.0** against **every** background sample. (Skin and hair are complementary: light skins pop on dark navies, dark hair pops on the pink duskLow band.)
2. Hair vs its own skin ≥ 1.5 (hairline must read at s=1).
3. Every hoodie main ≥ 1.6 vs every sky/badge sample; pocket vs main ≥ 1.4.

### 2.1 Skin tones (measured)

| tone | skin | hair / hairDk | skin vs badgeTop | badgeBot | duskMid | duskLow | skyline | hair vs skin | hair vs duskLow | eye `#222` vs skin |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `#ffdfc2` | `#6b4a2e` / `#503620` | 14.08 | 12.61 | 10.10 | 5.82 | 13.82 | 6.27 | 1.08 | 12.57 |
| 2 (default) | `#f2c9a0` | `#4a3626` / `#35261a` | 11.58 | 10.36 | 8.30 | 4.78 | 11.36 | 7.38 | 1.54 | 10.33 |
| 3 | `#dba470` | `#3a2a1e` / `#2a1d14` | 8.11 | 7.26 | 5.82 | 3.35 | 7.96 | 6.25 | 1.86 | 7.24 |
| 4 | `#b5825a` | `#2e2016` / `#20160e` | 5.35 | 4.79 | 3.84 | 2.21 | 5.25 | 4.73 | 2.14 | 4.78 |
| 5 | `#9a6a45` | `#241812` / `#170f0a` | 3.84 | 3.44 | 2.75 | 1.59 | 3.77 | 3.72 | 2.35 | 3.43 |
| 6 | `#84573a` | `#1d130c` / `#120b06` | 2.89 | 2.59 | 2.07 | 1.19 | 2.84 | 2.96 | 2.48 | 2.58 |

Design reading: tones 5–6 sit near duskLow's luminance (1.59 / 1.19) but their hair clears 2.35 / 2.48 against it, the hoodie clears 2.2+, and the collar row frames the chin — rule 1 holds via the head *group*. Eye stays `#222` for all tones (worst case 2.58 vs tone 6 — legible at s=1 and huge on the badge).

### 2.2 Hoodies (measured)

| hoodie | main / pocket | vs badgeTop | duskMid | duskLow | skyline | vs jeans `#3b5bdb` | vs accel `#ff8c37` | vs gremlin `#d64550` | pocket vs main |
|---|---|---|---|---|---|---|---|---|---|
| FOG (default) | `#7f8ea3` / `#5f6e83` | 5.35 | 3.84 | 2.21 | 5.25 | 1.70 | 1.44 | 1.31 | 1.56 |
| MATCHA | `#5da06b` / `#41794e` | 5.69 | 4.08 | 2.35 | 5.59 | 1.81 | 1.35 | 1.39 | 1.65 |
| GRAPE | `#a281e6` / `#7e5fc0` | 5.79 | 4.15 | 2.39 | 5.68 | 1.84 | 1.89* | 1.41 | 1.59 |
| SUNSET | `#d9748f` / `#a9556c` | 5.81 | 4.17 | 2.40 | 5.70 | 1.85 | 1.32 | 1.42 | 1.63 |
| OAT MILK | `#d8c9a8` / `#b0a17f` | 10.90 | 7.82 | 4.50 | 10.70 | 3.47 | 1.42 | 2.66 | 1.56 |
| UPTIME | `#3aa8a0` / `#2a7f79` | 6.19 | 4.44 | 2.56 | 6.07 | 1.97 | 1.24 | 1.51 | 1.65 |

Collision-avoidance decisions (why these six):
- **No orange family** — `#ff8c37` is the accel/DEMO-DAY invincibility flash; the flash must always read as "different from my hoodie". All six differ from it in hue, and the flash *replaces* the hoodie color outright (§4), so even UPTIME (lowest ratio 1.24) is unambiguous — teal→orange is a hard hue flip.
- **No red family** — `#d64550` is the churn-gremlin/enemy color. Closest is SUNSET, which is clearly pink, not enemy red.
- **No gold** — `#ffd94a` is coins + UI.
- GRAPE was brightened from an earlier `#8a63d2` specifically to clear jeans (1.84) and duskLow (2.39).
- SUNSET vs duskLow band (both pink): 2.40 — validated, distinct.

---

## 3. The 12×16 sprite — exact pixel maps

Grid: columns x0–x11, rows y0–y15, at `s=1` (all rects below are `fillRect(x + px*s, y + py*s, w*s, h*s)`).
Legend: `.` empty · `O` hoodie main · `P` pocket · `W` white drawstring · `S` skin · `E` eye `#222` · `H` hair · `D` hairDk · `J` jeans `#3b5bdb` · `K` sneaker `#e8e8e8`

### 3.1 Shared body (all styles, facing right, standing `runF=0`)

```
      x: 0 1 2 3 4 5 6 7 8 9 10 11
 y6      . O O O O W O O O O O  .
 y7      . O O O O W O O O O O  .
 y8      . O O O O W O O O O O  .
 y9      . O O O P P P P O O O  .
 y10     . O O O P P P P O O O  .
 y11     . O O O P P P P O O O  .
 y12     . . J J J . . J J J .  .
 y13     . . J J J . . J J J .  .
 y14     . . J J J . . J J J .  .
 y15     . . K K K . . K K K .  .
```
(runF=1 swaps which leg is 3 vs 4 tall, exactly as today. Facing left moves only the eye; the body never mirrors — current behavior, keep.)

### 3.2 Style 0 — HOOD UP (canon, default) · head rows

Drawn in **hoodie main** color (flashes orange in accel mode, like today):
```
 y0      . . O O O O O O O O .  .
 y1      . . O O O O O O O O .  .
 y2      . . O S S S S S S O .  .
 y3      . . . S S S S E S .  .  .
 y4      . . . S S S S E S .  .  .
 y5      . . . S S S S S S .  .  .
```
Rects: `(2,0,8,2)` hood + `(2,2,1,1)` + `(9,2,1,1)` hood sides. This is exactly the visible result of today's hood-rect-then-face-overdraw — pixel-identical default.

### 3.3 Hood-down collar (styles 1–3 only)

All hair styles other than HOOD UP wear the hood down. One rect in **hoodie main**, drawn over the chin row: `(3,5,6,1)`. Face becomes 3 visible skin rows (y2–y4) tucked into the collar; the eye (y3–y4) is untouched. The collar also flashes orange in accel mode — the hoodie identity survives every hairstyle.

### 3.4 Style 1 — BUZZ · head rows

```
 y0      . . . . . . . . . . .  .
 y1      . . . H H H H H H . .  .
 y2      . . . H S S S S H . .  .
 y3      . . . S S S S E S . .  .
 y4      . . . S S S S E S . .  .
 y5      . . . O O O O O O . .  .   ← collar
```
Rects (hair color): `(3,1,6,1)` cap · `(3,2,1,1)` + `(8,2,1,1)` temples. Head reads one pixel shorter than the hood — correct for a buzz.

### 3.5 Style 2 — CURLY · head rows

```
 y0      . H H D H H D H H H H  .
 y1      . H H H D H H H H D H  .
 y2      . H H S S S S S S H H  .
 y3      . . . S S S S E S . .  .
 y4      . . . S S S S E S . .  .
 y5      . . . O O O O O O . .  .   ← collar
```
Rects: hair `(2,0,8,2)` crown · `(1,0,1,3)` + `(10,0,1,3)` side volume · `(2,2,1,1)` + `(9,2,1,1)` temples; texture in hairDk: `(3,0,1,1)`, `(6,0,1,1)`, `(4,1,1,1)`, `(9,1,1,1)`. Widest silhouette (x1–x10) — the volume is the read.

### 3.6 Style 3 — PONYTAIL (long) · head + tail

Tail hangs on the **back** side: facing right (`face>=0`) → columns x0–x1; facing left → columns x10–x11 (both fit the 12px grid).

Facing right:
```
 y0      . . H H H H H H H H .  .
 y1      H H H H H H H H H H .  .   ← tail starts (x0–x1)
 y2      H H H S S S S S S H .  .   ← sideburns x2, x9
 y3      H H H S S S S E S H .  .
 y4      D D . S S S S E S . .  .   ← hairDk tie band on tail
 y5      H H . O O O O O O . .  .   ← collar
 y6      H H . (body rows — tail overlaps the shoulder)
 y7      H H .
 y8      H H . (this row only while runF — run bounce)
```
Rects: hair `(2,0,8,2)` crown · `(2,2,1,2)` + `(9,2,1,2)` sideburns · tail `(tx,1,2,7)` where `tx = face>=0 ? 0 : 10` · tie `(tx,4,2,1)` hairDk · bounce `(tx,8,2,1)` hair, **only when `runF`**.
Draw-order requirement: the tail must be drawn **after** the hoodie body so it lies over the shoulder — which the new function guarantees by drawing all hair last (§4).
Hitbox: player stays `w:12, h:16` (reset(), line ~218) — the tail is visual only, no gameplay change.

---

## 4. `drawFounder` — full replacement

Replace the current function (index.html lines 468–490) with this. **Signature is backward compatible**: all three existing call sites pass 7 args and keep working; the 8th arg is an optional look override (used by gallery/tests).

```js
// hoodie founder sprite (12x16 at s=1)
// lk (optional): resolved look object; defaults to the player's chosen look.
function drawFounder(ctx2, x, y, s, face, runF, yc, lk){
  const L = lk || window.FOUNDER_LOOK ||
    { skin:'#f2c9a0', hair:'#4a3626', hairDk:'#35261a',
      hood:'#7f8ea3', pocket:'#5f6e83', hairStyle:0 };     // canon fallback
  const hood = yc ? '#ff8c37' : L.hood;                     // accel flash overrides hoodie
  const R = (px2, py2, w, h, c) => { ctx2.fillStyle = c;
    ctx2.fillRect(Math.round(x + px2*s), Math.round(y + py2*s), w*s, h*s); };

  // hoodie body + pocket + drawstring
  R(1,6,10,6, hood);
  R(4,9,4,3, L.pocket);
  R(5,6,1,3, '#fff');
  // jeans (run animation alternates legs) + sneakers — not customizable (canon)
  if (runF){ R(2,12,3,3,'#3b5bdb'); R(7,12,3,4,'#3b5bdb'); }
  else     { R(2,12,3,4,'#3b5bdb'); R(7,12,3,3,'#3b5bdb'); }
  R(2,15,3,1,'#e8e8e8'); R(7,15,3,1,'#e8e8e8');
  // face + eye
  R(3,2,6,4, L.skin);
  if (face >= 0) R(7,3,1,2,'#222'); else R(4,3,1,2,'#222');

  // hair / hood — drawn LAST so it frames the face and lies over the shoulder
  const st = L.hairStyle;
  if (st === 0){                                   // HOOD UP (pixel-identical to v0.1)
    R(2,0,8,2, hood); R(2,2,1,1, hood); R(9,2,1,1, hood);
  } else {
    R(3,5,6,1, hood);                              // collar: hood worn down
    if (st === 1){                                 // BUZZ
      R(3,1,6,1, L.hair); R(3,2,1,1, L.hair); R(8,2,1,1, L.hair);
    } else if (st === 2){                          // CURLY
      R(2,0,8,2, L.hair); R(1,0,1,3, L.hair); R(10,0,1,3, L.hair);
      R(2,2,1,1, L.hair); R(9,2,1,1, L.hair);
      R(3,0,1,1, L.hairDk); R(6,0,1,1, L.hairDk); R(4,1,1,1, L.hairDk); R(9,1,1,1, L.hairDk);
    } else {                                       // PONYTAIL
      R(2,0,8,2, L.hair); R(2,2,1,2, L.hair); R(9,2,1,2, L.hair);
      const tx = face >= 0 ? 0 : 10;
      R(tx,1,2,7, L.hair); R(tx,4,2,1, L.hairDk);
      if (runF) R(tx,8,2,1, L.hair);
    }
  }
}
```

### 4.1 Pixel-identity proof for defaults
Old code: hood rect `(2,0,8,3)` drawn first, then face `(3,2,6,4)` overdraws its bottom-center — net visible hood = rows y0–y1 (x2–x9) + two side pixels at y2. New HOOD UP draws exactly those pixels directly. Body/pocket/string/jeans/shoes/face/eye rects are coordinate-for-coordinate and color-for-color the old ones (only reordered — no overlaps among them, so order is irrelevant). The old line-472 `rp(...)` call was a redundant duplicate of the hood rect (same pixels, drawn twice) and is dropped.
(The old code also drew the hood rect twice via `rp()` + `fillRect` — a v0.1 quirk, safe to delete.)

### 4.2 Interactions with existing effects — all preserved
- **Accel / DEMO DAY flash** (`yc` arg): hoodie body + hood/collar turn `#ff8c37`. Hair keeps its color during the flash (hair is not clothing). With hood down, ~70% of the old flashing area still flashes — verified readable in `customization-preview.png` (bottom-right orange sample).
- **Hurt flicker** (draw-skip at line ~723): unaffected — happens outside drawFounder.
- **Run cycle**: legs unchanged; ponytail gains the 1px bounce tied to the same `runF` bit.
- **Facing**: eye flips as before; ponytail flips sides with `face` so it always trails.

---

## 5. Draw-site inventory (every place the founder appears)

| site | index.html line (pre-change) | change required |
|---|---|---|
| in-game player | 724 `drawFounder(cx, player.x - cam, ...)` | **none** — reads `window.FOUNDER_LOOK` via fallback |
| title screen founder | 768 `drawFounder(cx, 90, GROUND_Y - 16, 1, ...)` | **replaced** by the s=3 picker preview (§6.2) |
| share badge | 806 `drawFounder(b, 80, 200, 14, 1, 0, won)` | **none** — badge automatically shows the chosen founder at 14× (this is the point) |
| `sprites.js` §7 copy + `makeBadgeV2` | sprites.js lines 226–241, 287–288 | replace the copied function with §4's version verbatim (its built-in canon fallback keeps `gallery.html` rendering standalone; optionally also copy `SKINS`/`HOODIES` into the gallery for a swatch page) |

`makeBadge` needs **no signature change**. Won-state still passes `yc=true` for the gold glow — with hood down, collar+body glow, hair stays; verified readable on the badge gradient in the preview render.

---

## 6. Title-screen picker

### 6.1 Interaction model
- **Keyboard (desktop):** `C` cycles skin tone, `H` cycles hair, `V` cycles hoodie. Title state only. Handled on **keydown events** (not the polled `keys{}` map — cycling must be one step per press).
- **Tap (mobile):** three tappable chips on the canvas (the canvas already gets touch events; the DOM D-pad only shows in play).
- **Click (desktop mouse):** same chip zones, via a `mousedown` listener — free to add, spec'd below.
- Cycling **never** starts the game; `SPACE`/`W`/`↑`/tap-elsewhere still starts (JUMP is untouched).
- Every cycle: update `window.FOUNDER_LOOK`, save to localStorage, tick sfx.

### 6.2 Layout (internal 480×270 coordinates)

Changes inside `drawTitle()` (lines 765–787):

1. **Move** the controls hint line from y=190 to **y=184** (same string, same style) to clear the chip rows.
2. **Replace** the s=1 walking founder (line 768) with a s=3 live preview, standing on the ground:
   `drawFounder(cx, 56, GROUND_Y - 48, 3, 1, frame % 24 < 12 ? 1 : 0, false);`
   (36×48 px at x56–92, feet on the ground line. It walks in place and re-renders the chosen look every frame — it IS the preview.)
3. **Add** the three chips + caption (after the existing footer text, still inside `drawTitle`):

```js
// ---- founder picker ----
const chipDefs = [
  { y:192, c:'#ffd94a', txt:'[C] TONE '   + (look.s+1) + '/6' },
  { y:206, c:'#7ce0ff', txt:'[H] HAIR: '  + HAIRS[look.h] },
  { y:220, c:'#c58bff', txt:'[V] HOODIE: '+ HOODIES[look.v].name },
];
cx.textAlign = 'left'; cx.font = 'bold 7px monospace';
for (const ch of chipDefs){
  cx.fillStyle = 'rgba(0,0,0,.45)'; cx.fillRect(112, ch.y, 104, 12);
  cx.fillStyle = ch.c; cx.fillText(ch.txt, 116, ch.y + 9);
}
cx.fillStyle = '#5d647a'; cx.font = 'bold 6px monospace';
cx.fillText('cosmetic. like most pivots.', 224, 229);
cx.textAlign = 'center';   // restore for the lines below it (title code uses center)
```
Layout audit (against current drawTitle): title y92 · subtitle y108 · tagline y132 · blink START y168 · controls (moved) y184 · chips y192–232 · footer joke y258. Preview occupies x56–92 / y184–232; controls line is centered ≈x120–360 at y177–184 → no overlap. Chips end flush with GROUND_Y (232) — drawn over the ground strip, intentional.

### 6.3 Chip hit zones + input code

```js
// picker tap/click zones (title screen) — generous padding for mobile
const PICKER_ZONES = [
  { x:112, y:192, w:104, h:12, k:'s' },
  { x:112, y:206, w:104, h:12, k:'h' },
  { x:112, y:220, w:104, h:12, k:'v' },
];
function pickerHit(clientX, clientY){
  const r = cv.getBoundingClientRect();
  const mx = (clientX - r.left) * W / r.width;
  const my = (clientY - r.top)  * H / r.height;
  for (const z of PICKER_ZONES)
    if (mx > z.x - 8 && mx < z.x + z.w + 8 && my > z.y - 5 && my < z.y + z.h + 5)
      return z.k;
  return null;
}
```
(±8 / ±5 internal-px padding ≈ a 120×22 internal target; at a typical landscape-phone scale of ~1.75× that's ~210×38 device px per chip — comfortably tappable. The three chips are vertically adjacent, so padding may not overlap the START blink zone; it doesn't.)

**Keyboard** — add inside the existing `keydown` listener (lines 64–73), after the `keys[...] = true` bookkeeping:
```js
if (state === ST.TITLE){
  const k = e.key.toLowerCase();
  if (k === 'c') cycleLook('s');
  else if (k === 'h') cycleLook('h');
  else if (k === 'v') cycleLook('v');
}
```
(`c`, `h`, `v` are unused today — `m` mute, `r` restart, `a/d/w` movement. No conflicts. C/H/V don't satisfy `JUMP()`, so they can't start the game.)

**Touch** — modify the existing canvas touchstart (line 92) so a chip tap cycles instead of starting:
```js
cv.addEventListener('touchstart', e => {
  e.preventDefault(); anyKeyPressed = true; initAudio();
  if (state === ST.TITLE){
    const k = pickerHit(e.touches[0].clientX, e.touches[0].clientY);
    if (k){ cycleLook(k); return; }               // tap chip = cycle, not start
  }
  if (state !== ST.PLAY){ touch.J = true; setTimeout(() => touch.J = false, 120); }
}, {passive:false});
```

**Mouse (new, desktop nicety):**
```js
cv.addEventListener('mousedown', e => {
  if (state !== ST.TITLE) return;
  const k = pickerHit(e.clientX, e.clientY);
  if (k) cycleLook(k);
});
```

### 6.4 Persistence rules
- Key: `localStorage['fm_look']`, value `{"s":0-5,"h":0-3,"v":0-5}` (JSON, ints).
- Load once at boot (§1 code), validating/clamping every index — a corrupt or future-versioned value degrades to canon defaults, never throws.
- Save on every cycle. Never saved/loaded anywhere else; `reset()` must NOT touch `look` (customization survives death, restart, and SERIES B).
- All storage access wrapped in try/catch (private browsing, sandboxed iframes, file:// quirks).

---

## 7. Copy deck (all new strings)

| string | where | note |
|---|---|---|
| `[C] TONE n/6` | chip 1 | never names tones |
| `[H] HAIR: HOOD UP / BUZZ / CURLY / PONYTAIL` | chip 2 | style names only, no gender words |
| `[V] HOODIE: FOG / MATCHA / GRAPE / SUNSET / OAT MILK / UPTIME` | chip 3 | deadpan SF-startup palette names |
| `cosmetic. like most pivots.` | caption under chips | the §1.0-rule-5 joke; keep lowercase |

No other strings change. Share text, badge text, HUD: untouched.

---

## 8. QA / test plan

Run from `/home/claude/qa`: `node /home/claude/game/test/smoketest.js && node /home/claude/game/test/playtest.js && node /home/claude/game/test/deathtest.js` — all three must stay green **unmodified** (defaults are pixel-identical, no new required interactions before START).

New probe script (write as `/home/claude/qa/customization-probe.js`, playwright, target `file:///home/claude/game/index.html`):
1. **Defaults:** `page.evaluate(() => [look.s, look.h, look.v])` → `[1,0,0]`; `window.FOUNDER_LOOK.hood` → `#7f8ea3`.
2. **Cycling:** dispatch `keydown` `c`×3, `h`×2, `v`×4 on title → `look` = `{s:4,h:2,v:4}`; `localStorage.fm_look` matches.
3. **Persistence:** `page.reload()` → `look` still `{s:4,h:2,v:4}`.
4. **Wraparound:** `c`×2 more from s=4 → s=0 (6-cycle); `h`×2 from 2 → 0 (4-cycle).
5. **Chip taps:** `page.touchscreen.tap()` at the client coords of chip 2's center (compute from `cv.getBoundingClientRect()`) → `look.h` incremented AND `state` still `0` (TITLE — tap must not start the game); tap at canvas center-top → game starts.
6. **Render truth:** start game, `cx.getImageData(player.x - cam + 5, player.y + 8, 1, 1)` → equals `HOODIES[look.v].main`; head pixel `(player.x - cam + 5, player.y)` → hair color for styles 2–3.
7. **Badge:** set `look = {s:5,h:3,v:2}`, force a death (`hearts = 1` + walk into an enemy or reuse deathtest), screenshot the end UI → badge founder shows GRAPE hoodie + ponytail at 14×. Eyeball the screenshot.
8. **Screenshots:** title screen once per hair style (4 images) for the human comedy/legibility pass.
9. **Palette regression guard:** `node /home/claude/qa/contrast-check.js` → `ALL RULES PASS`.

---

## 9. Out of scope / explicit non-goals
- No hair-color cycler (paired to tone by design — see §1).
- No jeans/sneaker customization (canon uniform).
- No picker on the death/win screens (the badge is the payoff, the title is the fitting room).
- No new DOM elements — the picker is canvas-drawn, so it scales with the game and screenshots cleanly.
- `gallery.html` swatch page for the 144 combos: nice-to-have, not required for ship.

## 10. Engineer checklist (suggested commit order)
1. Insert §1 data model block above `drawFounder`; replace `drawFounder` with §4. Run tests → green (nothing consumes the picker yet, defaults identical).
2. `drawTitle` changes (§6.2) + input handlers (§6.3). Run tests + probe steps 1–5.
3. Sync `sprites.js` §7 (and note in gallery). Probe steps 6–9. Screenshot review.
