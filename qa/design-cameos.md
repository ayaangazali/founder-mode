# FOUNDER MODE — Cameo NPC Design Spec (v1)
### Background cameo NPCs evoking famous-tech-figure *archetypes* — composite types, never identifiable people

**Status:** SHIPPING TIER approved for implementation · RISKY TIER is REJECTED, NEVER SHIPS (no sign-off path — FINAL-REVIEW §4.4).
**Canon compliance:** MASTER-PLAN §1.0 rules 3 (archetypes, never real people), 4 (player is the butt, lovingly), 5 (deadpan corporate-absurd). Legal constraint: research §8 / right of publicity — every shipping NPC is a *type*, not a person: no real names, no near-pun names of living people, no signature quotes, no unique physical trademarks.
**Verified visually:** all six sprites rendered headless against the game's dusk palette at 1x and 8x — see `/home/claude/qa/cameo-preview-a.png`, `/home/claude/qa/cameo-preview-b.png` (animation phases), source `/home/claude/qa/cameo-preview.html`. The spec code below is the exact code in that preview.

---

## 1. System design (how cameos work)

Cameos are **pure background decoration with a proximity speech bubble**. They have:

- **Zero collision, zero update logic, zero state.** Nothing added to `reset()`, no entry in `enemies`/`powers`. They are a draw-time function of `(frame, cam, player.x)` only. They cannot hurt the player, block the player, or be stomped.
- **Two draw passes** (matching the game's existing layering):
  1. **Sprites** — drawn after the platforms loop, *before* coins, so all gameplay entities (coins, enemies, bosses, player) render on top of them. Insertion point in `index.html` `draw()`: immediately after the `// platforms` `for` loop and immediately before the `// coins` comment (currently between lines ~657 and ~659).
  2. **Bubbles** — drawn after the popups loop, immediately before `drawHUD()` (currently between lines ~738 and ~740), so dialogue is never hidden behind enemies or particles. Bubble style is copied from the boss quip bubble (`drawBoss`, lines ~545–553): white box, 6px bold monospace, `#111` text, small tail, clamped to screen.
- **Bubble trigger:** shown while `|player.x − (c.x + 7)| ≤ 60` (±60px around sprite center). No sound, no popup, no pause. Walk past fast and you'll only catch it peripherally — correct; they're background texture, and noticing them is the reward.
- **Culling:** skip when `c.x − cam` is outside `[−40, W + 40]`.
- **The satire lives in the animation, not just the label** (canon rule 1, satisfied at zero gameplay cost): the stealth founder periodically ceases to exist; the contrarian is the only character in the Bay facing left; the e/acc guy vibrates in place; the exited founder is exempt from gravity. Each body is the joke.

`px()`, `clamp()`, `W`, `GROUND_Y`, `frame`, `cam`, `player` all already exist in `index.html` — no new helpers needed.

---

## 2. SHIPPING TIER — paste-ready implementation

### 2.1 Data (add near the `signs` array, ~line 192)

```js
// cameo NPCs {x, id, h, line} — background only: no collision, no update, no state
const cameos = [
  {x:455,  id:'shipper',    h:16, line:"IT'S 2AM. GREAT TIME TO SHIP."},
  {x:1740, id:'stealth',    h:16, line:"WE'RE IN STEALTH. TELL EVERYONE."},
  {x:2470, id:'eacc',       h:15, line:"THE FUTURE WON'T POST ITSELF."},
  {x:3560, id:'podcast',    h:16, line:"GREAT QUESTION. SEE EPISODE 400."},
  {x:3990, id:'contrarian', h:17, line:"EVERYONE AGREES WITH ME. TROUBLING."},
  {x:6135, id:'exited',     h:16, line:"I EXITED. I'M FINE. ASK ME IF I'M FINE."}
];
```

### 2.2 Draw functions (add in the SPRITES section, after `drawBoss`)

```js
function drawCameoSprite(c){
  let x = c.x - cam; if (x < -40 || x > W + 40) return;
  let y = GROUND_Y - c.h;
  if (c.id === 'shipper'){
    // milk crate + hunched founder + laptop, screen-lit face
    px(x+2, y+10, 12, 6, '#8a5a2b'); px(x+3, y+11, 10, 4, '#a06a34'); px(x+3, y+13, 10, 1, '#8a5a2b');
    px(x+0, y+12, 2, 3, '#fff');                                   // coffee on the ground
    if ((frame>>4)%2) px(x+0, y+10, 1, 1, '#bbb');                 // steam
    px(x+3, y+8, 9, 2, '#3b5bdb');                                 // folded jeans
    px(x+3, y+4, 8, 4, '#3f4c63');                                 // hoodie torso (hunched)
    px(x+3, y+0, 8, 2, '#3f4c63');                                 // hood up
    px(x+4, y+1, 6, 3, '#ffdfae');                                 // face, lit by screen
    px(x+8, y+2, 1, 1, '#222');                                    // eye locked on the build
    px(x+12, y+3, 2, 6, '#2b2d42');                                // laptop lid
    px(x+11, y+4, 1, 4, '#41f2ff');                                // screen glow spill
    px(x+9, y+8, 4, 1, '#aab4c4');                                 // laptop base
  } else if (c.id === 'stealth'){
    if (frame % 90 > 85) return;                                   // periodically ceases to exist
    const g1='#565e70', g2='#454b5a';
    px(x+3, y+0, 6, 2, g2);                                        // silhouette hair
    px(x+3, y+2, 6, 4, g1);                                        // gray face (whole person NDA'd)
    px(x+2, y+3, 8, 2, '#111');                                    // redaction bar over the eyes
    px(x+1, y+6, 10, 6, g2);                                       // jacket
    px(x+5, y+7, 2, 5, g1);                                        // zip
    px(x+2, y+12, 3, 3, g2); px(x+7, y+12, 3, 3, g2);              // legs
    px(x+2, y+15, 3, 1, '#111'); px(x+7, y+15, 3, 1, '#111');      // shoes
  } else if (c.id === 'eacc'){
    x += (frame>>2)%2;                                             // vibrating (accelerating in place)
    px(x+4, y+0, 6, 2, '#2b2d42'); px(x+10, y+0, 2, 2, '#2b2d42'); // backwards cap + bill
    px(x+4, y+2, 6, 3, '#f2c9a0');                                 // face
    px(x+4, y+2, 6, 1, '#111');                                    // sunglasses. it is dusk.
    px(x+3, y+5, 8, 6, '#2b2d42');                                 // black tee
    px(x+10, y+6, 2, 2, '#f2c9a0');                                // hands out front
    px(x+11, y+4, 3, 5, '#0e1020'); px(x+11, y+4, 3, 1, '#41f2ff');// phone, mid-post
    if ((frame>>1)%2) px(x+10, y+3, 1, 1, '#fff');                 // thumb blur
    px(x+4, y+11, 3, 3, '#2b2d42'); px(x+8, y+11, 3, 3, '#2b2d42');// joggers
    px(x+4, y+14, 3, 1, '#eee'); px(x+8, y+14, 3, 1, '#eee');      // sneakers
  } else if (c.id === 'podcast'){
    px(x+4, y+0, 7, 1, '#222');                                    // headphone band
    px(x+3, y+1, 2, 4, '#222'); px(x+10, y+1, 2, 4, '#222');       // ear cups
    px(x+3, y+2, 1, 2, '#ffd94a'); px(x+11, y+2, 1, 2, '#ffd94a'); // gold pads
    px(x+5, y+1, 5, 4, '#f2c9a0');                                 // face
    px(x+8, y+2, 1, 1, '#222');                                    // eye
    px(x+7, y+4, 2, 1, '#5a2e2e');                                 // mouth: open (always)
    px(x+3, y+5, 9, 6, '#6b4f8a');                                 // henley
    const gest = (frame>>4)%2;
    px(x+1, y+(gest?5:7), 2, 2, '#f2c9a0');                        // the gesturing hand
    px(x+3, y+11, 3, 4, '#33323f'); px(x+8, y+11, 3, 4, '#33323f');// slacks
    px(x+3, y+15, 3, 1, '#111'); px(x+8, y+15, 3, 1, '#111');
    px(x+14, y+8, 1, 8, '#8d99ae');                                // mic stand
    px(x+14, y+3, 1, 5, '#8d99ae'); px(x+12, y+3, 2, 1, '#8d99ae');// boom arm
    px(x+10, y+2, 2, 3, '#222');                                   // capsule at the mouth
    if ((frame>>4)%2) px(x+14, y+7, 1, 1, '#d64550');              // REC. always REC.
  } else if (c.id === 'contrarian'){
    const blk='#12141d', tn='#1c1f2b', pale='#e8c39a';
    px(x+3, y+0, 6, 2, '#2a2d3a');                                 // severe haircut
    px(x+3, y+2, 6, 4, pale);                                      // face (indoor complexion)
    px(x+3, y+2, 3, 1, '#2a2d3a');                                 // low brow
    px(x+3, y+3, 1, 2, '#111');                                    // eye on the LEFT: faces against traffic
    px(x+2, y+6, 8, 1, '#8d99ae');                                 // crew-neck tee at the neckline
    px(x+1, y+7, 10, 6, blk);                                      // blazer
    px(x+1, y+9, 10, 2, tn);                                       // crossed forearms
    px(x+1, y+9, 2, 2, pale); px(x+9, y+9, 2, 2, pale);            // hands
    px(x+2, y+13, 3, 3, blk); px(x+7, y+13, 3, 3, blk);            // trousers
    px(x+2, y+16, 3, 1, '#111'); px(x+7, y+16, 3, 1, '#111');
  } else if (c.id === 'exited'){
    const bob = Math.sin(frame*0.05)*2;
    y = y - 3 + bob;                                               // floats. gravity is pre-exit.
    px(x+4, y+0, 6, 2, '#8d6b3f');                                 // hair, grown out
    px(x+4, y+2, 6, 4, '#f2c9a0');                                 // face
    px(x+5, y+3, 1, 1, '#222'); px(x+8, y+3, 1, 1, '#222');        // BOTH eyes: faces camera. at peace.
    px(x+6, y+5, 3, 1, '#7a4a3a');                                 // small flat smile
    px(x+3, y+6, 8, 6, '#39c46d');                                 // aloha shirt
    px(x+4, y+7, 1, 1, '#ffd94a'); px(x+8, y+8, 1, 1, '#ffd94a'); px(x+6, y+10, 1, 1, '#ffd94a'); // flowers
    px(x+11, y+7, 2, 3, '#fff'); px(x+12, y+5, 1, 2, '#ff8c37');   // drink + tiny umbrella
    px(x+3, y+12, 3, 3, '#e8e0c9'); px(x+8, y+12, 3, 3, '#e8e0c9');// linen shorts
    px(x+3, y+15, 3, 1, '#8a5a2b'); px(x+8, y+15, 3, 1, '#8a5a2b');// sandals
  }
}

function drawCameoBubble(c){
  const x = c.x - cam; if (x < -40 || x > W + 40) return;
  if (Math.abs(player.x - (c.x + 7)) > 60) return;
  if (c.id === 'stealth' && frame % 90 > 85) return;               // can't talk while nonexistent
  cx.font = 'bold 6px monospace';
  const tw = cx.measureText(c.line).width;
  const bx = clamp(x + 7 - tw/2 - 3, 2, W - tw - 8);
  const by = GROUND_Y - c.h - 14;
  px(bx, by - 10, tw + 6, 10, '#fff');
  px(bx + 6, by, 4, 3, '#fff');
  cx.fillStyle = '#111'; cx.fillText(c.line, Math.round(bx + 3), Math.round(by - 2.5));
}
```

### 2.3 Hookup (two one-liners in `draw()`)

```js
// AFTER the platforms loop, BEFORE the coins loop (~line 658):
for (const c of cameos) drawCameoSprite(c);

// AFTER the popups loop, BEFORE drawHUD() (~line 739):
for (const c of cameos) drawCameoBubble(c);
```

`draw()` already early-returns on the title screen, so cameos render only during PLAY/WIN/DEAD frames — no extra state checks needed. Nothing goes in `reset()` or `update()`.

---

## 3. SHIPPING TIER — the six cameos (design rationale)

All placements verified against `segs` (all on solid ground), boss arenas (VC: trigger 4720 / wall 5330; AI: trigger 6760 / wall 7340 — all cameos outside both), and existing/planned signs, platforms, powerups, and enemy spawns (±60px bubble radius stays clear of sign posts).

| # | Name (dev name) | Archetype evoked | id | Size | x | Zone | One-liner |
|---|---|---|---|---|---|---|---|
| 1 | THE 2AM SHIPPER | the founder for whom 2am is core working hours — always shipping, never tired | `shipper` | 16×16 | 455 | SOMA | `IT'S 2AM. GREAT TIME TO SHIP.` |
| 2 | THE STEALTH LEGEND | the stealth-mode founder everyone has "heard things" about | `stealth` | 12×16 | 1740 | SOMA | `WE'RE IN STEALTH. TELL EVERYONE.` |
| 3 | THE REPLY GUY | the e/acc reply guy | `eacc` | 14×15 | 2470 | The Mission | `THE FUTURE WON'T POST ITSELF.` |
| 4 | THE POD SAGE | the podcast-circuit sage (4-hour episodes, gold ear pads) | `podcast` | 16×16 | 3560 | The Mission | `GREAT QUESTION. SEE EPISODE 400.` |
| 5 | THE CONTRARIAN | the contrarian philosopher-VC | `contrarian` | 12×17 | 3990 | Sand Hill Road | `EVERYONE AGREES WITH ME. TROUBLING.` |
| 6 | THE EXITED ONE | the founder who sold, is "fine," still refreshes Slack | `exited` | 14×16 | 6135 | The Cloud | `I EXITED. I'M FINE. ASK ME IF I'M FINE.` |

Per-cameo notes:

1. **THE 2AM SHIPPER (x 455, SOMA).** Sits on a milk crate under the scaffolding (plat 420–476 overhead), hood up, face lit only by laptop glow, coffee going cold beside him. Steam pixel blinks. He is not tired. He is *never* tired. Placement: tutorial zone — the first human the player meets is already outworking them. Clear of gremlin spawn at 520 (gremlin may wander past him; harmless and funny).
2. **THE STEALTH LEGEND (x 1740, SOMA).** Entirely grayscale — the whole person is redacted, with a black redaction bar where eyes should be. Every 90 frames he stops existing for 5 frames (`frame % 90 > 85`), bubble included. Placement: dead coworking territory (sign at 1500), between plat 1650 and the first meeting at 1980.
3. **THE REPLY GUY (x 2470, The Mission).** Sunglasses at dusk, backwards cap, black tee, phone permanently lit, thumb a literal blur, whole sprite jitters 1px (he is accelerating, in place, forever). Placement: café district, clear of the meeting at 2620 and plat 2550.
4. **THE POD SAGE (x 3560, The Mission).** Gold-padded headphones, boom mic on a stand *he carries with him*, mouth permanently open, free hand gesturing on a 2-frame cycle, red REC pixel blinking on the stand. Placement: last stretch of the Mission before Sand Hill (sign at 3620 is 60px away — bubble never overlaps its post); scooter bros at 3480 orbit him, which is correct, because they have all been on the pod.
5. **THE CONTRARIAN (x 3990, Sand Hill Road).** All black — blazer over a crew-neck tee, arms crossed, low brow — and he is the only figure in the entire game facing LEFT, against the level's one-way flow. (The player literally cannot go the direction he's looking. He knows. That's why he looks there.) Placement: start of Sand Hill, well before Chad's trigger at 4720.
6. **THE EXITED ONE (x 6135, The Cloud).** Aloha shirt with gold flowers, linen shorts, sandals, drink with a tiny umbrella — and he *floats*, bobbing on a slow sine, feet 3px off the cloud, the only character exempt from gravity. He faces the camera with both eyes visible — no one else in the game does — because he alone has nothing to run toward. His line undercuts all of it. Placement: between the scooter spawn at 6100 and the cloud plat at 6180; the bubble clears the plat by 6px.

**Why these six pass canon rule 3:** each is a composite of a *behavior class*, not a person — the sprites carry no unique physical trademark of any individual (no specific haircut+glasses combo, no signature garment tied to one person; vest is already spent on Chad), the names are pure archetype labels, and every line is invented deadpan corporate-absurd, not a recognizable quote or catchphrase.

---

## 4. RISKY TIER — thin-veil variants · **REJECTED — NEVER SHIP**

> **STRIP THIS ENTIRE SECTION BEFORE ANY PUBLIC COMMIT (M0 GitHub push).** In any public copy of this doc, replace §4 in full with the single line: "Thin-veil variants were evaluated and rejected; see private notes."

> Each entry below swaps a shipping cameo's name/line for a thin veil of an identifiable living person. Blanket note that applies to all six: California recognizes both statutory (Civ. Code §3344) and common-law right of publicity; "transformative use" is the defense, but this game is explicitly a LinkedIn-virality marketing asset, which is the fact pattern where that defense is weakest. A near-pun name plus a signature behavior = "identifiable" in court even with zero real names used.

| # | Replaces | Thin-veil name | One-liner | Risk note (frank) |
|---|---|---|---|---|
| R1 | THE 2AM REPLIER | **BARRY VAN** | `I REPLIED. IT'S 2AM. THIS IS THE VLOG.` | Rhyme of a real accelerator CEO famous for exactly this 2am-reply behavior — the behavioral signature alone identifies him, the name removes all doubt. He is publicly combative online and has both the resources and the temperament to make an example of a viral game. |
| R2 | THE STEALTH LEGEND | **PAUL GRAM** | `I WROTE AN ESSAY ABOUT YOU. IT'S KIND.` | One-letter-off name of the most quoted living essayist in startups; "essay" as the punchline completes the ID. Likely personally amused, but "he'd probably laugh" is not a legal strategy, and his network amplification cuts both ways if he isn't. |
| R3 | THE REPLY GUY | **BEFF JEZZOS** | `ACCELERATE. THERMODYNAMICALLY. NOW.` | The pseudonym belongs to a real, publicly identified living person, so parodying it still targets him — and the pseudonym itself riffs on a second, famously litigious billionaire's name. Two right-of-publicity exposures in one 14px sprite. |
| R4 | THE POD SAGE | **LEX FREEDMAN** | `LOVE IS THE ANSWER. FOUR HOURS ON WHY.` | Near-homophone of a living podcaster plus his signature earnest register — quote-pattern mimicry makes it identifiable even if the name were dropped. Low litigation risk personally, but his audience is enormous and misfire reads as punching at a beloved figure, which violates canon rule 4 (loving, not mean). |
| R5 | THE CONTRARIAN | **PETER STEEL** | `COMPETITION IS FOR OTHER PEOPLE.` | Rhyming surname + the monopoly-contrarian framing (a paraphrase orbiting his most famous line, which canon bans outright as a "signature quote") = fully identifiable. He has personally bankrolled litigation that destroyed a media company he disliked; he is the single worst test plaintiff in tech. |
| R6 | THE EXITED ONE | **STU BUTTERFLYFIELD** | `SOLD IT. MOVED NORTH. CHECK MY POTTERY.` | Pun-name of a real founder identifiable by his well-publicized exit-and-retire story; the "I'm fine" archetype attached to a specific person turns a loving self-joke into a comment about a named individual's life. Defamation/false-light exposure is low but nonzero; reputational "why'd they pick on him?" cost is the real price. |

**Ship tier only, full stop.** This table documents why each thin-veil was rejected, not a ranking of options. No sign-off path exists to violate canon rule 3.

---

## 5. QA / verification notes for the implementing engineer

- Preview artifacts: `/home/claude/qa/cameo-preview.html` (self-contained, mirrors the game's shim exactly), screenshots `cameo-preview-a.png` / `cameo-preview-b.png`. The spec code in §2 is byte-identical to the code verified there.
- After integration run the standard gate: `cd /home/claude/qa && node /home/claude/game/test/smoketest.js && node /home/claude/game/test/playtest.js && node /home/claude/game/test/deathtest.js` — cameos touch no physics, so all three must stay green untouched.
- Manual checks: (1) walk to x≈455/1740/2470/3560/3990/6135 and confirm each bubble appears within ±60px and never clips off-screen (the clamp handles screen edges; longest line is 39 chars ≈ 141px at 6px monospace, fits 480 easily); (2) confirm the stealth flicker hides bubble and body together; (3) confirm cameos draw *under* enemies/player (a gremlin walking over the 2AM Replier should occlude him); (4) confirm nothing renders on the title screen.
- Performance: 6 sprites × ~20 fillRects, drawn only when on-camera — negligible.
- Do not add cameo hit-testing "later" without a design pass: the moment they block or reward, they stop being background gags and start needing balance, lore, and legal re-review.
