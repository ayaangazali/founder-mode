# FOUNDER MODE — Per-Zone Biome Spec (v0.x + v1.0 Cerebral Valley)

**Author:** Biome Designer agent · **Date:** 2026-07-11
**Target file:** `/home/claude/game/index.html`
**Touches exactly two places:** `drawBG()` (currently lines ~557–607) and the ground/platform coloring block inside `draw()` (currently lines ~618, ~632–646). Nothing else changes.
**Constraints honored:** fillRect-only for all NEW drawing · ~30 lines of branching added to `drawBG()` · zero new assets · one data table + one lookup, no per-zone draw functions.

**Validated visually:** `/home/claude/qa/biome-preview.html` renders all 5 biomes with this exact code; screenshot at `/home/claude/qa/biome-preview.png` (includes contrast probes for THE CLOUD: white cloud platform, white MTG enemy, grey-hoodie founder — all legible).

---

## 1. Design intent (canon: MASTER-PLAN §1.0/§1.2 — satire in the visuals, deadpan)

The whole run is one evening in SF: the light changes as your runway burns.

| Zone | x-range | Identity | One-line art direction |
|---|---|---|---|
| SOMA | 0–1900 | Warehouse dusk | The current look, unchanged — cold indigo dusk, sodium-lit windows. Baseline. |
| THE MISSION | 1900–3600 | Mural sunset | Magenta/orange sunset, warm mural-toned buildings, **papel picado bunting strung on wires** across the sky. |
| SAND HILL ROAD | 3600–5460 | Golden-hour money glow | Everything the color of money and khakis. Gold haze, amber windows. "A road made of money that leads to money." |
| THE CLOUD | 5460–7500 | White void | Skylines vanish entirely (the ground stopped being ground; so did the city). White-to-slate gradient, bright fog. |
| CEREBRAL VALLEY (v1.0 only) | inserted 3600–5300 post-shift | Fog-purple | Heavy triple-band Karl fog, purple murk, **GPU-green windows** (every Victorian is mining gradient descent). |

Zone switch is driven by the **camera center** (`cam + W/2`, i.e. `cam + 240`), so the whole screen flips at once, roughly as the player passes each zone's welcome sign (signs sit at 1930 / 3620 / 5540 — the flip at player≈1800/3500/5360 lands just before the sign, which reads as "the light changed, then you saw why"). Hard cut is intentional and arcade-authentic; optional crossfade in Appendix B.

---

## 2. Exact palettes

`sky` = 4 gradient stops at the existing offsets **0 / 0.55 / 0.8 / 1** (top → bottom). Do not change the offsets; they're shared by all zones so the gradient code stays one path.

### SOMA — warehouse dusk (identical to current shipped look)
| Role | Hex |
|---|---|
| sky 0 / .55 / .8 / 1 | `#141433` / `#3a2a55` / `#7a4467` / `#1c1c2e` |
| far skyline (parallax .25) | `#231f3d` |
| near skyline (parallax .5) | `#191631` |
| lit windows | `#ffd94a` |
| stars | `rgba(255,255,255,.5)` |
| fog band / drift | `rgba(220,225,235,.13)` / `rgba(230,235,245,.18)` |
| sidewalk / asphalt / road stripe | `#8a8f9e` / `#33323f` / `#f4c542` |

### THE MISSION — mural sunset + papel picado
| Role | Hex |
|---|---|
| sky | `#2b1b4d` / `#7a2a5e` / `#d96a3b` / `#24182c` |
| far skyline | `#3a2044` |
| near skyline | `#2a1a3e` |
| lit windows | `#ff9d5c` |
| stars (warm, faint) | `rgba(255,220,180,.4)` |
| fog (sunset haze) | `rgba(255,180,120,.10)` / `rgba(255,200,150,.12)` |
| sidewalk / asphalt / stripe | `#a08898` / `#3a2b3c` / `#ff8f5c` |
| **bunting flags** (cycle) | `#ff5d8f` pink · `#3dd6c3` teal · `#ffd94a` yellow · `#b07fe8` purple |
| **bunting wire** | `rgba(20,12,24,.8)` |

### SAND HILL ROAD — golden-hour money glow
| Role | Hex |
|---|---|
| sky | `#4a3160` / `#b8742c` / `#ffc45e` / `#2a2118` |
| far skyline | `#4a3423` |
| near skyline | `#33241a` |
| lit windows | `#ffe9a0` |
| stars → gold dust motes | `rgba(255,215,120,.55)` |
| fog (golden haze) | `rgba(255,205,110,.10)` / `rgba(255,220,140,.12)` |
| sidewalk / asphalt / stripe | `#c9b58a` (money-beige) / `#40372a` / `#ffd94a` |

### THE CLOUD — white void
| Role | Hex |
|---|---|
| sky | `#fbfcff` / `#e6ecf7` / `#b9c4de` / `#8f9fc6` |
| far / near skyline | **not drawn** (`voidZone` flag — the city is gone) |
| stars (faint data specks) | `rgba(160,180,220,.35)` |
| fog (bright) | `rgba(255,255,255,.30)` / `rgba(255,255,255,.40)` |
| sidewalk / asphalt / stripe | `#e8ecf5` / `#c3cbe0` / *(none — empty string skips stripes)* |

**Contrast note (verified in preview):** the sky's lower half deliberately darkens to `#b9c4de → #8f9fc6` so the existing white cloud platforms (`#f2f5fc`/`#fff`), the white MTG enemy (`#f4f4f4`), and the founder's grey hoodie (`#7f8ea3`) stay legible. Do NOT brighten the .8/1 stops — a pure-white bottom half makes cloud-zone platforms invisible.

### CEREBRAL VALLEY — fog-purple (v1.0 ONLY; ships with the zone itself)
| Role | Hex |
|---|---|
| sky | `#241a3f` / `#4a3a6e` / `#8a6aa0` / `#2a2440` |
| far skyline | `#2e2450` |
| near skyline | `#201a38` |
| lit windows (GPU green) | `#7dffa0` |
| stars | `rgba(200,180,255,.45)` |
| fog (heavy, + `foggy` flag adds 2 extra bands) | `rgba(205,190,235,.25)` / `rgba(220,205,245,.30)` |
| sidewalk / asphalt / stripe | `#9a92b5` / `#2e2a44` / `#9dffb0` |

---

## 3. Implementation

### 3.1 Data table — add once, above `drawBG()` (data, not branching)

Keys are the **exact strings returned by `zoneName()`** — the lookup is `BIOMES[zoneName(cam + W/2)]`, no new zone-id plumbing. (`reset(false)` runs before the first frame, so `cam` always exists, including on the title screen, which correctly shows SOMA.)

```js
const BIOMES = {
'SOMA':          { sky:['#141433','#3a2a55','#7a4467','#1c1c2e'], far:'#231f3d', near:'#191631', win:'#ffd94a',
                   star:'rgba(255,255,255,.5)',  fog:['rgba(220,225,235,.13)','rgba(230,235,245,.18)'],
                   side:'#8a8f9e', road:'#33323f', stripe:'#f4c542' },
'THE MISSION':   { sky:['#2b1b4d','#7a2a5e','#d96a3b','#24182c'], far:'#3a2044', near:'#2a1a3e', win:'#ff9d5c',
                   star:'rgba(255,220,180,.4)',  fog:['rgba(255,180,120,.10)','rgba(255,200,150,.12)'],
                   side:'#a08898', road:'#3a2b3c', stripe:'#ff8f5c', bunting:1 },
'SAND HILL ROAD':{ sky:['#4a3160','#b8742c','#ffc45e','#2a2118'], far:'#4a3423', near:'#33241a', win:'#ffe9a0',
                   star:'rgba(255,215,120,.55)', fog:['rgba(255,205,110,.10)','rgba(255,220,140,.12)'],
                   side:'#c9b58a', road:'#40372a', stripe:'#ffd94a' },
'THE CLOUD':     { sky:['#fbfcff','#e6ecf7','#b9c4de','#8f9fc6'], far:'', near:'', win:'',
                   star:'rgba(160,180,220,.35)', fog:['rgba(255,255,255,.30)','rgba(255,255,255,.40)'],
                   side:'#e8ecf5', road:'#c3cbe0', stripe:'', voidZone:1 }
// v1.0: add 'CEREBRAL VALLEY' entry from §2 (with foggy:1) when zoneName() gains that branch.
};
const PICADO = ['#ff5d8f','#3dd6c3','#ffd94a','#b07fe8'];
```

### 3.2 `drawBG()` rewrite — replace current lines ~557–607

This is the current function with colors swapped for `B.*` lookups plus three small branches (`voidZone` skyline skip, `bunting`, `foggy`). Net new *branching* ≈ 12 lines; everything else is a recolor of existing lines. Stars, parallax offsets, fog drift, and the world-anchored Golden Gate block are **unchanged in structure**.

```js
function drawBG(){
  const B = BIOMES[zoneName(cam + W/2)];                         // zone by camera center
  const grd = cx.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, B.sky[0]); grd.addColorStop(0.55, B.sky[1]);
  grd.addColorStop(0.8, B.sky[2]); grd.addColorStop(1, B.sky[3]);
  cx.fillStyle = grd; cx.fillRect(0, 0, W, H);
  // stars (SOMA) / warm specks (Mission) / gold motes (Sand Hill) / data specks (Cloud)
  cx.fillStyle = B.star;
  for (let i = 0; i < 24; i++){
    const sx = (i * 137 + 40) % W, sy = (i * 61) % 90;
    if ((frame + i * 13) % 120 < 100) cx.fillRect(sx, sy, 1, 1);
  }
  if (!B.voidZone){                                              // THE CLOUD: no city at all
    const o1 = -(cam * 0.25) % 300;
    cx.fillStyle = B.far;
    for (let bx = o1 - 300; bx < W + 300; bx += 300){
      /* ...existing far-skyline fillRects, verbatim (lines 572–581)... */
    }
    const o2 = -(cam * 0.5) % 260;
    for (let bx = o2 - 260; bx < W + 260; bx += 260){
      cx.fillStyle = B.near;
      /* ...existing 4 near-building fillRects, verbatim (line 587)... */
      cx.fillStyle = B.win;
      /* ...existing window double-loop, verbatim (lines 589–590)... */
    }
  }
  if (B.bunting){                                                // THE MISSION: papel picado on wires, parallax .5
    const o3 = -(cam * 0.5) % 64;
    for (let bx = o3 - 64; bx < W + 64; bx += 64){
      cx.fillStyle = 'rgba(20,12,24,.8)'; cx.fillRect(bx, 88, 64, 1);              // wire
      for (let f = 0; f < 4; f++){ cx.fillStyle = PICADO[f];
        cx.fillRect(bx + 6 + f*15, 89, 7, 5); cx.fillRect(bx + 8 + f*15, 94, 3, 2); } // flag + cut-paper tail
    }
  }
  // Karl the Fog (existing drift, recolored per zone)
  const fx = (frame * 0.2) % (W + 200) - 100;
  cx.fillStyle = B.fog[0]; cx.fillRect(0, 110, W, 26);
  cx.fillStyle = B.fog[1]; cx.fillRect(fx - 60, 104, 200, 20); cx.fillRect(fx + 180, 116, 160, 16);
  if (B.foggy){ cx.fillStyle = B.fog[0]; cx.fillRect(0, 60, W, 20); cx.fillRect(0, 140, W, 34); } // Cerebral Valley only
  /* ...existing Golden Gate block, verbatim (lines 598–606) — keep unconditional;
     #c0402a red reads on every palette incl. the white void... */
}
```

Notes for the implementer:
- The `/* verbatim */` blocks are the existing code lifted unchanged — only the `cx.fillStyle = '#…'` lines immediately above them are replaced by `B.far` / `B.near` / `B.win` / `B.fog[…]` / `B.star`.
- Bunting sits at y=88–96, between the far skyline tops and the fog band, and scrolls at parallax .5 (same layer as the near skyline — it's strung between those buildings). 64px period, 4 flags per segment, colors fixed per slot (`PICADO[f]`), which yields a repeating pink-teal-yellow-purple string. fillRect only.
- Bunting is only in THE MISSION; `foggy` only in CEREBRAL VALLEY; `voidZone` only in THE CLOUD. Everything else is table-driven recoloring — no other conditionals.

### 3.3 Ground recolor inside `draw()` — replace lines ~618 and ~632–646

The `inCloud` special-case collapses into the same table. Replace:

```js
const inCloud = zoneName(player.x) === 'THE CLOUD';
```
with
```js
const B = BIOMES[zoneName(cam + W/2)];   // same lookup as drawBG — sky and ground flip together
```

and replace the ground-segment loop body's coloring:

```js
if (B.voidZone){
  px(x0, GROUND_Y, x1 - x0, 6, B.side); px(x0, GROUND_Y + 6, x1 - x0, H - GROUND_Y, B.road);
} else {
  px(x0, GROUND_Y, x1 - x0, 5, B.side);              // sidewalk
  px(x0, GROUND_Y + 5, x1 - x0, H - GROUND_Y, B.road); // asphalt
  cx.fillStyle = B.stripe;
  for (let lx = Math.floor((cam + x0) / 40) * 40; lx < cam + x1; lx += 40){
    const dx = lx - cam; if (dx > x0 && dx < x1 - 12) cx.fillRect(dx, GROUND_Y + 16, 12, 2);
  }
}
```

- Ground follows the **camera zone**, not per-segment zone, so a segment tail straddling a boundary (e.g. seg `[1468,2350]` across x=1900, `[3036,3900]` across x=3600) recolors in the same frame the sky flips — one coherent cut, never a two-tone screen.
- The old `s[0] >= 5504` check is subsumed: when the camera center passes 5460 the only visible ground is the cloud segs (the 5450–5504 gap is a pit).
- **Do not touch** the platform loop (lines ~649–657): its `pl[0] > 5460` cloud/crate branch is world-anchored and already correct.
- The `inCloud` variable has no other readers (verified: only lines 618 and 636) — safe to replace.

### 3.4 v1.0 hook — CEREBRAL VALLEY

When M5 inserts the zone (MASTER-PLAN §1.7: between THE MISSION and SAND HILL ROAD, LEVEL_W 7500→~9200, downstream x shifted), the only biome work is:
1. `zoneName()` gains `if (x < 5300) return 'CEREBRAL VALLEY';` after the MISSION branch (exact bound per M5's final coords).
2. Add the `'CEREBRAL VALLEY'` row from §2 to `BIOMES`, including `foggy:1`.
Zero changes to `drawBG()` — the `foggy` branch is already in place from §3.2.

---

## 4. QA checklist (headless, playwright)

Probe script pattern (game globals are reachable; teleport, settle one frame, screenshot):
```js
await page.evaluate(x => { player.x = x; cam = Math.max(0, x - 100); }, X);
```
1. Screenshot at x = 400 (SOMA), 2600 (MISSION — bunting visible, scrolling at half player speed), 4200 (SAND HILL — gold), 6000 (CLOUD — no skyline, platforms/MTG/founder all legible), title screen (must equal SOMA).
2. Walk x 1700→2100 and 5300→5700: exactly one full-screen palette cut each, sky+ground in the same frame, no two-tone ground.
3. Golden Gate still renders red near x 6900 against the white void.
4. `node /home/claude/game/test/playtest.js` + smoketest + deathtest all pass (biomes are draw-only; any sim diff is a bug).
5. Perf: drawBG does ≤ ~40 extra fillRects/frame worst case (Mission bunting ≈ 9 segments × 9 rects) — no measurable cost at 480×270.

---

## Appendix A — preview artifacts
- `/home/claude/qa/biome-preview.html` — standalone render of all 5 biomes using the exact code above (plus cloud contrast probes).
- `/home/claude/qa/biome-preview.png` — approved reference render. Implementations should visually match it per zone.

## Appendix B — optional crossfade (only if the hard cut tests badly)
8 extra lines: `function mix(a,b,t){const p=x=>parseInt(x,16),h=(i)=>Math.round(p(a.slice(i,i+2))*(1-t)+p(b.slice(i,i+2))*t).toString(16).padStart(2,'0');return '#'+h(1)+h(3)+h(5);}` — blend each `sky` stop (hex-only fields) between the two zones' tables over a 240px window centered on the boundary (`t = clamp((camCenter - (edge-120))/240, 0, 1)`); snap non-hex fields (fog rgba, flags, flags) at t=0.5. Ship the hard cut first; this is a polish option, not a requirement.

## Appendix C — canon compliance (MASTER-PLAN §1.0)
- Satire in mechanics/visuals: the light literally turns to money on Sand Hill; the city ceases to exist in The Cloud; Cerebral Valley is 40% fog by volume. No text added, so no tone risk.
- No trademarks: papel picado is a cultural craft, not a brand; skyline silhouettes are unchanged from shipped v0.1.
- Zero new assets, fillRect-only, table-driven — one `BIOMES` const, ~12 net new branching lines in `drawBG()`, one recolor block in `draw()`.
