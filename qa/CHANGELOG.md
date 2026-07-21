# FOUNDER MODE — CHANGELOG

## 2026-07-11 — [FIX-BUGS] pass (FINAL-REVIEW.md §5, items 1-33) — /home/claude/game/index.html

Baseline preserved at /home/claude/game/index.v0.1.bak.html (untouched). All three game tests
(smoketest / playtest / deathtest) green after every batch. Canon greps
(`yc accepted|yc mode|patagonia|wework|uber`) → 0 matches in index.html.

### Engine + timing
1. **Fixed-timestep loop** — `loop()` replaced with a 16.67ms accumulator (100ms clamp) driven by the
   rAF timestamp; `stepGame()` runs 60 sim-steps/s regardless of display refresh. No physics constants
   changed. Verified: verify-framerate-skeptic2 → walk 102px/s at both vsync and uncapped rAF (ratio 1.00x).
2. **Simulated play clock** — new `playMs += 1000/60` per PLAY update; HUD, makeBadge, shareText all read
   `fmtTime(endTime || playMs)`; `startTime`/`performance.now()` timing removed; `endTime` is a playMs
   snapshot. Verified: verify-blur-timer (8.3s backgrounded wall → timer advanced only 1.53s, exactly the
   92 sim frames that ran); verify-timer-freeze (HUD == badge TIME on WIN and DEAD, zero pixel drift).
3. **Input hygiene on blur** — `clearAllInput()` zeroes all keys[] + touch.L/R/J on window blur and
   document.hidden. Verified: verify-stuck-keys → 0px drift, 0 hearts lost after refocus.

### State machine
4. **Bell state guard + death returns** — bell check now requires `state === ST.PLAY`; every
   `hurtPlayer()` call site in update() returns immediately if it caused death; boss death clears all
   live shots. Verified: verify-die-at-bell + verify-die-while-winning → endCalls==['DEAD'] only,
   0/21 race-window hits.
5. **Held-R badge wipe** — loop-level `keys['r']` restart block deleted; `showEndUI()` clears `keys['r']`.
   The edge-triggered keydown handler is the only restart path. Verified: verify-heldR-skips-badge →
   badge persists on WIN and DEAD with R held.

### Physics
6. **Pit-wall snap-up** — ground landing now requires prev-frame-above (`p.y+p.h-p.vy <= g+4`).
   Verified: verify-pitsnap → 0 wall snaps, hold-right never crosses a pit without jumping (probe's snap
   detector updated to exclude intended checkpoint respawns, which teleport x).
7. **Ledge footing** — player ground probe narrowed to `groundBelow(p.x+3, p.w-6)` (player only).
   Verified: verify-lip-overhang → x=779.5 falls; max standable overhang now ~9px vs 11.5px.
8. **[PAIR w/9] Reward-bounce exemption** — `p.bounceT=12` on enemy and boss stomps; line-297 jump-cut
   now `!(p.bounceT>0)` gated. Verified: verify-stomp-hurt → stomp-hurt rate 0.02 (was 0.63-0.70),
   fresh-stomp hurt rate 0.00, separation depth always -1px.
9. **[PAIR w/8] Boss stomp separation + i-frames** — on stomp: `p.y = b.y - p.h - 1` + bounce;
   `b.hitT = 30` i-frames, boss flashes (alternating frames), hp only decrements when hitT==0. NO retreat
   (ruling 2.4). **Deviation, documented:** hitT=30 alone cannot stop the pogo-lock because the bounce
   return period is ~31.4 frames — every landing still dealt damage (hands-free kill measured at 2.1s).
   To meet item 9's own acceptance test ("no-input drop no longer kills either boss") a damaging stomp
   additionally requires an *armed* stomp: `p.pogo` flag set on every stomp bounce, cleared only by a
   fresh jump press (rising edge) or ground/platform contact. All ruled numbers unchanged (hitT=30,
   bounce -5.5, no retreat; the bounce itself still always happens). Verified: verify-pogo3 → hands-free
   drop = exactly 1 hit, boss survives 20s; casual mash bot (10-frame human-length presses) still wins
   both fights (VC 4.5s / AI 4.0s of arena time, 1 heart lost each — measured for the ruling's
   "re-measure before escalation" note).
10. **Jump buffer + rising edge** — `p.jbuf=6` on JUMP rising edge (prevJump tracked), jump fires on
    `jbuf>0 && onGround`; holding jump = exactly one jump. Kills keyboard auto-pogo.

### Progression + death
11. **[PAIR w/12] Checkpoint respawn** — death retries (PIVOT button, R from DEAD) call `reset(true)`;
    its else-branch now: hearts=3, hurtT=120, shots cleared, live boss deactivated back to trigger
    (position/hp restored via stored x0/y0; dead bosses stay dead), `raised = floor(raised*0.75)` +
    popup **'BRIDGE ROUND: -25%'**. Win-screen restarts stay `reset(false)`. Verified: die at final boss
    → respawn x=6740, 3 hearts, VC stays dead, AI back at trigger, raised 400→300.
12. **[PAIR w/11] Checkpoint list** → `[20, 1930, 3660, 4700, 5350, 6740]`. Verified: pit at 5450
    respawns at 5350 (feelprobe2: 120px setback, 1.2s walkback); boss deaths respawn at arena doors.
13. **Hurt juice (no input lock)** — 2-frame camera shake (draw-side translate) + 3-frame hitstop
    (sim frozen, draw continues) on hurtPlayer(). Knockback/input untouched (ruling 2.2).

### Mobile input
14. **Touch overlay vs end screen** — showEndUI hides #touch + zeroes touch flags; every return-to-PLAY
    path (`resumePlay()`) restores it. CSS `#ui{z-index:10}` `#touch{z-index:5}` +
    `#ui{background:rgba(8,8,20,.78)}` (item 25). Verified on 667x375 touch: elementFromPoint over
    SAVE/RETRY returns the buttons after badge decode.
15. **#tJ specificity** — selector now `#touch div#tJ`. Verified: computed 86px/86px/50%.
16. **Unified touch handler** — one container handler on #touch for touchstart/move/end/cancel recomputes
    L/R/J from every live touch point with 10px slop (thumb-slide, dead-gutter, and touchcancel all fixed
    in one change). Verified: slide tL→tR flips L→R; touchcancel clears all.
17. **Safe area** — `viewport-fit=cover`; button bottoms/`#tL`/`#tR` lefts/`#tJ` right wrapped in
    `calc(... + env(safe-area-inset-*, 0px))`. Layout byte-identical where env()=0.
18. **Portrait (non-blocking, ruling 2.1)** — on touch+portrait: canvas top-aligned, touch buttons
    repositioned directly under the canvas, dismissible prompt 'ROTATE YOUR PHONE — investors prefer
    landscape' (exactly once, tap to dismiss). Game fully playable in portrait. Verified at 390x664:
    prompt visible+dismissible, canvas top 0, buttons at y=233 under canvas bottom 219, d-pad moves player.

### First 5 seconds
19. **Title CTA + controls** — CTA blink replaced with alpha pulse `0.65+0.35*sin(frame*0.1)` (never
    fully gone); controls line 8px on rgba(0,0,0,.45) backing, touch branch '◀ ▶ move · A jump · stomp
    enemies'. Footer whisper untouched.

### Share loop
20. **GAME_URL** — hardcoded const (`https://foundermode.lol` — **placeholder pending M2 deploy; TODO
    comment left at the definition; never location.href**); appended `Play: {URL}` to both share texts;
    badge footer 'FOUNDER MODE · foundermode.lol' bold 34px #ffd94a y=565.
21. **Clipboard hardening** — existence-guarded navigator.clipboard → execCommand('copy') fallback →
    visible readonly textarea last resort. Verified: verify-share-insecure → no pageerror on insecure
    http; fallback actually copies in all 3 contexts.
22. **Native share + blob save** — badge blob pre-generated at showEndUI (iOS-safe); canShare({files})
    feature-detected with a sync dummy file (no UA sniffing) → first-position SHARE BADGE button; SAVE
    uses blob object-URL; desktop COPY attempts a rich ClipboardItem (image/png + text/plain) before
    plain text. Touch-only caption: 'press & hold the badge to save it. yes, really.'
23. **Badge legibility** — stats leading 52px (y=295/347/399); quote bold 36px #cfd6e4 y=495 (drawn at
    x=60 full-width with measure-and-shrink guard — at x=320 both 36px quotes overflowed the 1200px
    canvas and clipped the punchline); footer 34px y=565. Verified legible at 300px downscale.
24. **Loss badge progress** — loss badges show 'DIED IN  {zone}' (#c58bff, 44px) instead of BOSSES;
    loss share text mirrors 'died in {zone}'. Verified: two death points produce different badges.
25. **End-screen hierarchy** — HUD + popups skipped when state !== PLAY; dim #ui backdrop.
26. **Button order + copy** — loss: PIVOT (RETRY) first, share buttons immediately second; win:
    SHARE/SAVE/COPY then RUN IT BACK. Copy success: 'post copied ✓ — now SAVE BADGE and attach it';
    'or press R to run it back' rendered only when `!('ontouchstart' in window)`.

### Copy + canon batch
27. **De-brand** — YC pickup redrawn as the DEMO DAY LETTER (gold envelope #e8b83a/#c2952a, red rocket
    stamp, shine sweep — per sprites.js §6, fillRect only); 'ACCELERATED! INVINCIBLE'; HUD 'DEMO DAY
    MODE'; share text 'out-jumped a VC whose vest is load-bearing'. Internal `yc`/`ycT` keys kept.
28. **WEWORK sign** (x=1500) → 'COWORKING / space available / (all of it)'.
29. **Register fixes** — boss hit popup 'CONVICTION: n' (kill keeps 'DOWN ROUND!!'); scooter stomp
    'THESIS DECLINED! +$10K'; 'COLD BREW! VELOCITY +47%'. MASTER-PLAN §1.3/§1.4/§1.5/§1.6 [keep] entries
    updated to match (scooter line, CONVICTION, cold brew, quip set, sign list, popup inventory).
30. **In-world text floor** — term-sheet shot enlarged to 12x10, 'TERMS' at 6px on rgba(0,0,0,.55)
    backing (word kept per ruling); 'VEST' fillText deleted; Chad quips: split quip merged to
    'A FEATURE, NOT A COMPANY.', added 'LOVE IT. PASSING.' and 'MY VEST IS LOAD-BEARING'.
31. **Boss-band de-collision** — quip bubble anchored to boss, raised to b.y-34, gated on
    `x > -b.w && x < W` (also fixes the orphaned bubble); hit popups spawn at b.x-40; buzz spawn band
    b.y-6..b.y+22 with skip-if-live-buzz-within-30px; buzz pill drawn to measured text (centered label,
    ≥ hitbox on all sides) — collision AABB stays 26x9; pips stay at b.y-12.
32. **Cloud jokes** — new sign x=6000 'MIND THE GAPS / (that's the 0.01%)'; pit popup zone-aware:
    THE CLOUD → '-1 RUNWAY (the 0.01% downtime)'.
33. **Regression** — all three tests green; probe expectations updated where the bug they hunted is now
    fixed (verify-timer-freeze + verify-blur-timer read playMs; verify-heldR checks display 'flex' —
    its 'block' check never matched even pre-fix; verify-pitsnap detector excludes checkpoint respawns;
    verify-stomp-hurt spawn height corrected — old value embedded the player 12px under ground, which
    the old snap-up bug silently masked; verify-lip-overhang uses a held Space start). New post-fix
    probes: verify-mobile-fixed.js, verify-share-fixed.js. Screenshots: fixed_title.png,
    fixed_vc_fight.png, fixed_ai_fight.png, fixed_envelope.png, fixed_gaps_sign.png,
    fixed_win_screen.png, fixed_badge_win_300.png, fixed_badge_loss.png, verify-portrait-fixed.png.

**Known pre-existing (not a regression):** a sub-frame `keyboard.press('Space')` can miss the title-start
JUMP() poll (reproduced byte-identical on index.v0.1.bak.html); playtest's post-reload death-check
occasionally reports state 0 for this reason. Consider an edge-triggered title start in a future pass.

## 2026-07-11 — [CUSTOMIZATION] pass (FINAL-REVIEW.md §5, items 34-38) — /home/claude/game/index.html, sprites.js, qa/design-customization.md

"Pick your founder": 6 skin tones × 4 hair styles × 6 hoodie colors, per design-customization.md
(approved w/ 2 amendments, FINAL-REVIEW §4.2). All three game tests green after every batch, unmodified.

34. **Spec amendments** — design-customization.md gains an explicit Milestone header (implemented now,
    pre-M0, orchestrator decision recorded); localStorage line reworded to *consistent with* the plan's
    intent (§1.7 is traction-gated v1.0 content — this is the game's first actual localStorage use).
35. **FOUNDER LOOK data model** — SKINS (6 tones, hair color paired to tone), HAIRS (HOOD UP/BUZZ/
    CURLY/PONYTAIL), HOODIES (FOG/MATCHA/GRAPE/SUNSET/OAT MILK/UPTIME), `resolveLook()`,
    `cycleLook()` (+picker tick beep), `window.FOUNDER_LOOK`. Persisted as localStorage `fm_look`
    with clamped validation in try/catch (corrupt/garbage values degrade to canon default — verified);
    `look` is NOT touched by reset() — survives death, restart, reload.
36. **drawFounder replacement** — new 8-arg signature (optional trailing `lk` look override; all three
    existing 7-arg call sites unchanged); hair/hood drawn last; hood-down collar for styles 1-3;
    ponytail trails the facing direction w/ runF bounce; accel flash still overrides hoodie+hood/collar,
    hair keeps its color. Old redundant `rp()` double-draw quirk deleted (helper was then dead code and
    removed). Default `{s:1,h:0,v:0}` proven pixel-identical to v0.1: in-page getImageData diff of old
    v0.1 algorithm vs new across 24 cases (s=1/3/4 × face ±1 × runF 0/1 × yc on/off) → 0 mismatches;
    frozen-frame in-game player crop byte-identical (cust-pre-player.png == cust-post35-player.png).
37. **Title-screen picker** — s=3 live walking preview at (56, GROUND_Y-48) replaces the s=1 founder;
    controls hint raised to y=184 (backing rect y=175) to clear the chips; three canvas chips at
    x112/y192-232 ('[C] TONE n/6' gold, '[H] HAIR: …' blue, '[V] HOODIE: …' purple) + caption
    'cosmetic. like most pivots.'; C/H/V cycle on keydown (edge-triggered, TITLE only, never starts the
    game); PICKER_ZONES + pickerHit() with ±8/±5 internal-px slop wired into canvas touchstart (chip tap
    cycles instead of starting; tap elsewhere still starts) and a new mousedown handler for desktop.
38. **Badge + kit sync** — makeBadge needs no change: badge founder renders the chosen look at 14×
    (probe: GRAPE body + tone-6 crown pixels verified in the badge canvas; screenshot
    cust-badge-nondefault.png). sprites.js §7 drawFounder replaced with the customization-aware copy
    (canon fallback keeps gallery.html standalone — headless load: 0 page errors).
    contrast-check.js → ALL RULES PASS.

Verification: customization-probe.js (19 checks — defaults, cycling, persistence, wraparound, corrupt
storage, chip tap/click vs start, live-canvas + badge pixel truth, page errors) → all pass. Screenshots:
cust-title-hair0..3.png (one per hair style, non-default tones/hoodies), cust-badge-nondefault.png
(tone 6 + PONYTAIL + GRAPE on the loss badge), cust-gallery-check.png.

## 2026-07-11 — [EGGS] pass (FINAL-REVIEW.md §5, items 39-43) — /home/claude/game/index.html, qa/design-eggs.md

Ship set only (ZERO CHURN, T2D3, THE REVERSE PITCH — design-eggs.md §2, approved FINAL-REVIEW §4.3).
Held eggs (PIVOT, ADVISOR MODE, SPACE AVAILABLE, NO GOING LEFT, SERIAL ENTREPRENEUR) remain
unimplemented. All three game tests green after implementation and at final regression.

39. **Spec canon-fixes FIRST (design-eggs.md)** — 'Uber for jumping' → 'rideshare for jumping' (table
    row + Egg 4 subtitle pool); advisor quip 'THIS IS JUST LIKE UBER IN 2011' → 'I SAW THIS EXACT
    THING IN 2011.'; §3 item 3 trademark guidance rewritten (Airbnb aside deleted; lore prose ≠
    display-copy precedent stated plainly); 'Konami' renamed to 'the classic cheat-code sequence
    (↑↑↓↓←→←→BA)' with an explicit never-render-in-game note; Egg 6 restated as the coworking-husk
    joke (callback to the renamed 'COWORKING / space available / (all of it)' sign). Also synced the
    spec's T2D3 timing to the fixed-timestep reality (item 41's NOTE): all `endTime - startTime`
    wall-clock references → simulated `playMs`/`endTime` snapshot. Grep `uber|konami|wework|airbnb`
    on the spec → only the dev-facing §3 explanation of why lore prose is not precedent.
40. **ZERO CHURN** — `if (enemies.every(x2 => x2.dead))` popup 'ZERO CHURN' (#ff8c37) inside BOTH kill
    branches (invincible-touch and stomp; per-kill check only, never per-frame); new `badgeFlairs(won)`
    next to the end-screen code; flair rail on the badge at y=462 ('FLAIR: …' bold 30px #ff8c37 —
    verified empty band between BOSSES y=399 and quote y=495); win share text gains
    'Flair earned: …' before the challenge line.
41. **T2D3** — `(endTime || playMs) < 180000` inside badgeFlairs — reads the SIMULATED clock (endTime
    is a playMs snapshot post item-2), so backgrounded tabs neither help nor hurt (the spec's original
    wall-clock trigger would have regressed under the new fixed-timestep engine). Badge flair + share
    line only; no in-run popup (per spec).
42. **THE REVERSE PITCH** — top-level `let idleT`; ticks on TITLE in update() (zeroed in any other
    state); zeroed by keydown, unified #touch handler, canvas touchstart, and canvas mousedown; at
    idleT>3600 a boss-style white bubble loops the 6-slide pitch deck (240f/slide, loops from slide
    one — the re-pitch IS the joke). **Geometry adapted, documented:** spec placed the bubble at
    y=190-203 over the old s=1 founder at (90,216); the [CUSTOMIZATION] pass replaced that founder
    with the s=3 picker preview at (56,184) and put chips in y=192-232, so the bubble now sits at
    y=160-170 (tail 170-173, x centered on the preview's head at x≈74) — clears the controls backing
    (y≥175) by 2px and the centered CTA (x≥168) at every clamp position. Spec strings unchanged.
43. **Regression + probes** — smoketest/playtest/deathtest green; canon grep
    (`yc accepted|yc mode|patagonia|wework|uber|konami`) → 0 matches in index.html. New probe
    qa/eggs-probe.js (21 checks): bubble absent/present/loops/cancels via pixel-band white count +
    idleT math, ArrowLeft never starts the game, in-run ZERO CHURN popup on a real 20th-kill stomp,
    both-flairs win, ZERO-CHURN-only (playMs=200000), T2D3-only (one survivor), no-flair
    (slow + missed one), loss never earns flair, share-text line ordering, 0 page errors → ALL PASS.
    Screenshots: eggs-title-pitch-slide1.png, eggs-title-pitch-slide6.png, eggs-popup-zerochurn.png,
    eggs-badge-bothflairs.png (+ eggs-badge-bothflairs-300.png feed-size legibility),
    eggs-badge-zerochurn-only.png, eggs-badge-t2d3-only.png, eggs-badge-noflair.png.

Note for [BIOMES+CAMEOS]: eggs are draw/UI-additive only — no collision, update-order, or reset()
state touched; idleT and badgeFlairs are top-level and probe-reachable per harness convention.

## 2026-07-11 — [BIOMES+CAMEOS] (items 44-48, FINAL-REVIEW §5)

44. **BIOMES table** — `const BIOMES` (4 rows: SOMA/THE MISSION/SAND HILL ROAD/THE CLOUD, exact hexes
    from design-biomes.md §2; SOMA row = shipped v0.1 values so the baseline is palette-identical) +
    `const PICADO` flag cycle, added above drawBG(). Lookup is `BIOMES[zoneName(cam + W/2)]`, once in
    drawBG() and once in draw() — no new zone-id plumbing. CEREBRAL VALLEY row deliberately absent
    until v1.0 (the `foggy` branch is already in place for it).
45. **Zone recolors** — drawBG() rewritten per spec §3.2: sky gradient stops, stars, far/near skyline,
    lit windows, and Karl-the-Fog drift all read `B.*`; skyline/window fillRect geometry kept verbatim.
    Three branches only: `voidZone` (THE CLOUD skips both skylines — the city is gone), `bunting`
    (THE MISSION papel picado: wire y=88 + 4-flag cycle per 64px segment, parallax .5), `foggy`
    (dormant, Cerebral Valley v1.0). Ground block in draw(): `inCloud` special case (its only two
    readers) replaced by the same `B` lookup — sidewalk/asphalt/stripe now table-driven, sky+ground
    flip in the same frame (pixel-verified at all three boundaries: 1600→2000, 3400→3800, 5200→5700).
    **Deviation (documented):** Golden Gate anchor 6900→6000. With cam clamped at LEVEL_W−W=7020 the
    old `6900 − cam*0.85` needed cam>7435 to enter the screen — the bridge was unreachable dead code
    in v0.1 (spec §3.2 assumed it rendered; QA §4.3 requires it red against the void). 6000 sweeps it
    across the finale; draw-only, verified vs backup that 6900 is inherited, not a prior fixer's edit.
46. **Cameo spec amendments (docs first, §4.4)** — design-cameos.md: THE 2AM REPLIER → **THE 2AM
    SHIPPER** (id `replier`→`shipper`, archetype restated as always-shipping, bubble → "IT'S 2AM.
    GREAT TIME TO SHIP.", 'inbox' comment de-signatured; sprite rects unchanged); contrarian
    turtleneck collar → crew-neck tee at the neckline ('#8d99ae', same rect; arms-crossed +
    faces-LEFT kept); recommendation line rewritten to "Ship tier only, full stop… not a ranking of
    options. No sign-off path exists to violate rule 3."; §4 header → REJECTED-NEVER-SHIP with a
    strip-before-public-commit banner carrying the exact one-line public replacement; header status
    line updated; 'dead WeWork territory' → 'dead coworking territory' (only doc occurrence — biomes
    doc clean).
47. **Cameo render passes** — SHIPPING TIER ONLY, all six at spec x (455 shipper / 1740 stealth /
    2470 eacc / 3560 podcast / 3990 contrarian / 6135 exited): `cameos` data by zoneName();
    drawCameoSprite + drawCameoBubble after drawBoss (spec §2.2 verbatim + the two §4.4 sprite/copy
    changes); sprite loop after platforms before coins (gameplay occludes them — gremlin-over-shipper
    verified); bubble loop inside the `state===ST.PLAY` block before drawHUD() (end-screen frames
    stay clean per item 25, nothing on title). Zero collision/update/reset state — pure draw.
48. **Full pass** — smoketest/playtest/deathtest green (one playtest start-timing flake observed,
    passed 2/2 on rerun); verify-framerate-skeptic2 (1.00x walk/fps ratio), verify-mobile-fixed
    (end-screen hit test, slide/cancel, portrait prompt all pass), share_probe (badge + URL intact);
    canon greps `yc accepted|yc mode|patagonia|wework|uber|turtleneck|2am replier` → 0 in index.html.
    New probes: qa/biome-cameo-proof.js (zone/title/boundary/cameo-phase shots; teleports mark bosses
    dead — a live wall snaps teleported players back and contaminates shots), qa/proof-exited-fix.js
    (atomic teleport+freeze; the scooter at 6100 otherwise knocks the player out of bubble range).
    Proof shots: proof-zone-{soma,mission,sandhill,cloud,goldengate}.png, proof-title-soma.png,
    proof-cameo-{shipper,stealth,eacc,podcast,contrarian,exited}-{a,b}.png.

## 2026-07-11 — [OVERNIGHT M0-M3 + ACCEPTANCE GATE] (GOAL.md phases 0-6) — repo root

Unattended overnight pass. All three game tests green after every commit; canon greps clean throughout.

### Phase 0 — baseline (a53284c, e52af3d, tag v0.2-rc1)
- **Restored the war-room build.** The kit's index.html was byte-identical to index.v0.1.bak.html
  (md5 9a0933ea…) — the copy step had clobbered the QA-hardened build with the pristine original, and
  the canon greps FAILED at baseline (WEWORK sign, YC ACCEPTED/YC MODE strings, Patagonia share text).
  Real war-room build recovered from ~/Downloads/founder-mode-kit/index.html (65,312 bytes: fixed
  timestep, playMs, checkpoints, customization, biomes, cameos, eggs; greps clean) and committed as
  e52af3d. v0.2-rc1 tag placed there.
- Local test env: `npm install playwright` + chromium headless shell (none was installed).

### Phase 1 — public sanitize (209aead)
- design/CAMEOS.md TIER 2 section stripped per FINAL-REVIEW §4.4; replaced with the approved one-line
  pointer. Tier-1 composites + preamble + recommendation untouched (recommendation still references
  R1/R3/R4 by id — ids now resolve only in private notes; no real-adjacent names remain in the file).

### Phase 2 — v0.2 copy deck (2033e2a, 36b0329, 372e682, 6c6e34d)
- Seven §1.6 signs. Placement deviations, screenshot-verified: HIRING 1150→1080 and CAFÉ 2320→2200
  (crate platforms at [1180,182]/[2290,184] covered the 3-line text band at every ±40 offset — the ±40
  rule assumed sign/cameo occupants, not platforms); MIND THE GAPS 6000→5880 so NOW ENTERING THE CLOUD
  keeps its verified 6000 (item-32 acceptance "renders on seg [5504,6300]" still holds at 5880).
- Fund-district row (BIBLE §8): A17Z 3760 · SEQUOIADENDRON 4020 · FOUNDERS ETC. 4320 · HF-0 MONASTERY
  4460 (≥120px apart, pre-arena, on segs).
- Chad +5 quips (4× §1.4 + I'M ALSO IN A17Z'S NEW FUND from BIBLE §8); SYNERGY.AI +5 quips (§1.4);
  buzzword pool → 10 words. Pill-vs-hitbox re-proven for every word (max pill 38.4px vs 26x9 AABB,
  centered — item 31 behavior intact).
- Badge one-liners rotate from the §1.6 win/loss pools, `quoteRoll` seeded once per fresh run (stable
  across respawns/re-renders); DIED IN {zone} stat line untouched (zone stays, quote rotates). All 8
  quotes fit the shrink guard at ≥32px.

### Phase 3 — daily seed + market conditions (a0a9ad6)
- Date-derived SEED_N (#1 = 2026-01-01) + mulberry32; one of the ten §1.6 modifiers (exact strings) on
  the title ticker + `daily seed #N` line. Levers: AI +1 HP · coins ±20% (COIN_VALUE, popup follows) ·
  +2 Sand Hill scooters · quips 70f · visual pit fog · half the meetings pre-despawned · term sheets
  +0 runway on DOWN ROUND days · BULL 4 starting hearts · AUDIT burn tick 4s.
- **Burn rate added** (ROADMAP §3 spec, 4 lines + smoke warning): it is the lever AUDIT WEEK needs and
  the fixers had not landed it. 6s stand-still = BURN RATE −1 heart, frame-counted (blur can't burn).
  The calendar date is now the game's only wall-clock read; every timer stays on playMs.
- New probe qa/verify-daily-seed.js (8 checks): same-date determinism (seed/modifier/spawn layout),
  cross-date variance, coin-lever movement, zero page errors.

### Phase 4 — deploy scaffolding, files only (8aad727)
- api/og.jsx = ROADMAP §8 verbatim; og:image/twitter:card tags from BUILD-GUIDE Step 4 pointing at
  og.png (1200×630 confirmed) on the GAME_URL placeholder root; @vercel/og pinned in package.json
  (playwright → devDependencies). No vercel.json: zero-config already covers static root + api/.
  Nothing deployed.

### Acceptance gate — playable proof (b1a0805, tag playable-rc1)
- test/fullrun.js: human-input bot (keyboard + real buttons only; reads state, never writes). Clean
  profile: 3/3 consecutive title→UNICORN passes, badge TIME 1:19–1:35, zero page errors (~1 mid-run
  death each, recovered via the real PIVOT). Tourist profile (--casual: 16 sign stops, 7 coin detours,
  arena hesitation, sloppier mash): 2:31 with one deliberate Chad death proving checkpoint 4700 +
  BRIDGE ROUND 106→79.
- qa/overnight-paths.js (23 checks) + qa/overnight-mobile.js (15 checks) + 24 evidence screenshots in
  qa/overnight/. file:// and local-http loads both clean.
- Probe-expectation inversions (item 33 discipline): none required — the only pre-existing probe in
  the kit is qa/verify-daily-seed.js (the war-room probe suite lives in the fixers' environment and
  never shipped with the kit).
- Run-length finding, flagged for a human: fast competent floor ≈ 1:19 (walk floor 73.5s = 7500px at
  contract speed 1.7); best tourist proxy 2:31. Under the requested 3–6 band; no permitted lever
  closes it (ruling 2.4 forbids i-frame escalation without casual-win-rate re-measurement, §1.4 fixes
  boss HP canon, enemy density threatens the >80%-badge invariant for seconds of yield). §2.1's own
  hard invariant is "finishable ≤6 min" (upper bound) and T2D3 expects sub-3:00 wins to exist. The
  sanctioned lengthener is M5's +1,700px Cerebral Valley zone, traction-gated.

## 2026-07-11 — [SESSION 2: M5 GATE-JUMP + READABILITY + GITHUB] — repo root

Owner decisions this session: traction gate MANUALLY OPENED for M5 (option B of the morning
report's run-length ruling); signs judged unreadable at small window sizes; repo pushed to
GitHub (private).

### Readability (main: 2ba1eec, and folded into the M5 sign re-lay)
- Canvas snaps to integer scale above 1x — fractional scales smeared the pixel fonts.
- Sign face 6px→8px, line-height 10 — every board re-laid and screenshot-verified clear of
  platform text-band collisions. VERSION NOTE (speedrun contract): sign geometry is visual
  only; no hitboxes exist on signs.

### M5 — CEREBRAL VALLEY lands on main (world 7500→9200px)
- SPEEDRUN CONTRACT VERSION NOTE: run LENGTH changed (+1700px, +1 mid-boss). Physics
  constants (GRAV 0.35 / JUMPV -6.6 / speeds) untouched. All previous times are a
  different category now.
- Per design/level-cerebral-valley.js: shift rule (+1700 for x≥3956) on segs/plats/coins/
  enemies/powerups/bosses/checkpoints; CV zone data pasted verbatim (stack-1 base nudged
  4050→4070 to clear the zone sign; step-gap rule still met). zoneName 5 zones;
  checkpoints [20,1930,3970,5750,7240] (spec list — boss-door checkpoints from item 12
  superseded by the v1.0 spec; worst death-walkback ≈16s, within §2.2's ≤90s law).
- THE PLATFORM mid-boss (4 HP, OMNICORP CLOUD DevRel mecha): drops SDK crates at the
  player's x that land and become one-way platforms for 8s ('DEPRECATION NOTICE' on
  expiry) — the crates are the ladder to its head. No hop (it is huge), bspd 0.35,
  same stomp/i-frame/pogo rules as the other bosses. Kill: 'DEPRECATED! +$350K'.
- THOUGHT LEADER 't' (sine flyer, THREAD bombs every 150f within 220px, unstompable in
  its 36f posting window — halo glows) and COMPLIANCE PHANTOM 'c' (terrain-ignoring
  0.3-speed drifter, 0.72 alpha). Stomps: RATIO'D! / EXEMPTED! +$15K. Both count for
  ZERO CHURN.
- ROBOTAXI: neutral rideable moving platform, patrol 4960-5300 at 0.7, stops 2s every
  220f ('UNPLANNED STOP (safe)' if ridden); riding does not tick burn rate.
- CV biome row (fog-purple, GPU-green windows, foggy:1 heavy Karl) per design-biomes §2.
- Golden Gate anchor 7700, NOT the spec's 8600 — the spec predates the war-room
  unreachable-anchor finding; 8600 needs cam>9435 vs the new 8720 clamp (dead code
  again). 7700 = war-room fix + shift.
- Sign re-lay notes: HF-0 MONASTERY → Cerebral Valley 4640 (its BIBLE §8 canon home);
  FOUNDERS ETC. → 7380 (The Cloud approach); CHAD CAPITAL HQ → 7032 (post-arena);
  A17Z/SEQUOIADENDRON/ANGEL/VC-AHEAD along 5880-6350; DEVREL herald board deliberately
  overhangs the arena pit (post on solid ground at 5317).
- v1.0 powerups from BIBLE §6: MATCHA (+15% jump 10s, zen particles, HUD MATCHA'D),
  ENTERPRISE CONTRACT (+$100K, speed ×0.85 8s, HUD ENTERPRISE PROCESS), RUG TOKEN
  (-$5K, the glint is slightly wrong). Placed 2248/6270/{2900,5060,7520}.
- Badge: BOSSES n/3. Market lever aims re-pointed (aihype → bosses[2]; layoffs scooters
  → 5850/6130 on the new Sand Hill).
- MASTER-PLAN §1.7 items NOT included in this pass: multiple endings, SERIES B MODE,
  LARPer/tokenmaxxer/run-club bestiary, coffee-chat snare (each is its own milestone).
- playtest.js gains the Platform leg (5410 trigger check + crates>0); fullrun bot
  learned: never hop at flyers, abort pit-creep when a ground enemy closes.

### GitHub
- Private repo github.com/ayaangazali/founder-mode; main + testing + tags pushed.
  TIER 2 strip landed before any push (FINAL-REVIEW §4.4 satisfied); canon greps clean
  at every pushed commit.

### Final timings (post-M5, measured by the bots)
- Skilled clean run: 02:08 (was 1:19 pre-M5). Tourist profile: **04:58 PASS** — 5 unplanned deaths
  recovered via PIVOT + the scripted Chad death, 21 sign stops, 7 coin detours, all 3 bosses,
  zero page errors. The 3–6 minute §2.1 band is now met; morning-report item (e) is RESOLVED
  by option B. CV difficulty pass: phantom 4500→4620, DEMO DAY sign 4180→4340 (tourist-bot
  telemetry; sanctioned levers only).

## 2026-07-11 — [FEEL PATCH: SOLID UNDERSIDES] (owner requests, evening session)

- SPEEDRUN CONTRACT VERSION NOTE: city platforms are now SOLID from below (head-bonk,
  7px corner forgiveness; clouds stay soft; SDK crates + robotaxi stay one-way). The
  jump-up-through-platform tech is gone from all city zones — routes change. Physics
  constants untouched.
- Steady lights: stars no longer blink; skyline windows seed per world tile (the old
  parallax-float seed re-rolled the pattern every frame while scrolling).
- PITCH DECK staged at all three boss doors (5410/6390/8430): every boss fightable by
  stomp or deck.
- Level fixes the new physics exposed (all bot-verified death loops): crate 2290→2280
  (ended 4px before a pit lip), CV pit 4420-4480 → 4432-4480 (60px was the exact jump
  maximum — a ~1.4px frame-perfect landing window), compliance phantom now patrols ±60
  and chases only within 120px (320px chase intercepted players on pit landings).
- Bot benchmarks post-change: clean profile PASS x2 at 03:18 (budget 6); tourist PASS
  x2 at 05:46 (budget 12 — explicitly a bot-skill-floor benchmark, not a difficulty
  verdict; the bot cannot time hopping meetings under the now-solid crates the way a
  sighted human does). Human playtest should rule on CV difficulty; levers-table knobs
  (enemy density) are the sanctioned response if it feels brutal.

## 2026-07-12 — [FUN PATCH: minigames + valuation + leaderboard] (owner playtest verdict on humor-patch: "like it, expand it")

- CRISP TEXT OVERLAY: second canvas at devicePixelRatio stacked over the 480×270 game
  canvas; every cx.fillText mirrors there at native resolution (layout math stays in
  game units; maxWidth pins runs to the measured width). Backing boxes punch out the
  overlay beneath them (occlude()) to keep draw-order occlusion. Sprites stay chunky.
  This answers the third legibility complaint; 8px-at-2x was the single-canvas ceiling.
- POWER-UP CLARITY: pickup popups hold 2.5s and say the effect in plain words; the
  PITCHING HUD line names the fire key; first 6s of a run show a bottom controls strip.
- VALUATION: end-of-run score = RAISED × growth story (speed) × capital discipline
  (runway) × chief morale officer (corgi); loss = ×0.5 down round. Breakdown card under
  the badge, number in share texts. This is the leaderboard metric.
- MINI-GAME, COFFEE CHAT: three funder archetypes at sidewalk tables (x1150/5100/6480),
  press C (touch: stand still); 3 timed A/B questions; right answer = the archetype's
  bias. 3/3 their check, 2/3 small check, else deadpan pass. World pauses; pays once/run.
- MINI-GAME, THE ACCELERATOR INTERVIEW: door at x900; seven questions, ten seconds
  TOTAL; the short answer is always right. 5/7 = DEMO DAY LETTER (8s invincible +$150K).
- GAG BATCH (deferred CLIP-REPORT items): run-club wave sweeps Dolores every 45s and
  laps the laggard; tokenmaxxer in THE CLOUD flips WAGMI→NGMI the frame you get hit;
  PAD 39-B sign (departures hourly, arrivals every 10th — the real rocket mechanic).
- LEADERBOARD: api/leaderboard.mjs (Supabase REST, env-gated, plausibility checks);
  client posts {initials, valuation} per daily seed, renders today's top-5 on the end
  card, "today's top exit — beat it" on the title. file:// falls back to localStorage
  best. Game remains one file. NOT LIVE until SUPABASE_URL/SUPABASE_SERVICE_KEY are set
  in Vercel and the founder_scores table exists (SQL in the endpoint header comment).
- QA: moments-probe scans both canvases (glyphs live on the overlay now); end-badge
  height capped so the taller card fits 667×375; fullrun bot checked against a
  pre-session baseline worktree — both hover at the 6-death budget on today's DOWN
  ROUND SEASON seed; no session regression. All probe suites + test trio green.

## 2026-07-12/13 — [LAUNCH-POLISH SWEEP] (owner live-playtest calls, shipped same-day)

- CANONICAL URL: foundermode.vercel.app (old founder-mode-kit host still serves).
  GAME_URL, og:image, api bases all point at the new host.
- SHIPPED TO MAIN: billboards v2 (16 boards after GOJIBERRY/REPLIT/SUPABASE cut;
  132×30 framed panels, ≥290px spacing, title-screen suppressed, sky-band tiers
  56/90) + "IS CODE DEAD?" panel (archetypes + intern only, "the big names
  canceled") + six scattered look-alike parody celebs (POL GRAM x1560, BARRY GAN
  x4300, XANDR WING x4840, PETER TEAL x7100, DAREO x7560, WALTMAN x8420), all on
  the code-is-dead beat, RISKY_CAMEOS tier, grep-gated off share surfaces.
- FINALE v2: rope-snap joke retired (owner call); reaching the bell arms a
  MASH-R ceremony (meter decays while idle) → three-partial chime + confetti +
  $1M → badge. endTime snapshots at the ring. Full Golden Gate rebuilt: towers,
  crossbeams, sagging cables with suspenders, deck. bellPhase removed everywhere.
- END SCREEN: valuation breakdown card; YOUR NAME field (14 chars, persists)
  stamps the badge (FOUNDER: NAME), the front-page headline (NAME RINGS BELL /
  NAME DIES IN MEETING...), and the photo caption, restamping live on change;
  badge↔front-page toggle now on BOTH endings (new win edition of HYPERGROWTH
  DAILY: win body pool, "i never doubted us" pull quote, ▲ ticker).
- ZOOM: fit() uses exact fractional scale (integer floor letterboxed up to a
  third of the window; obsolete since the crisp-text overlay). Title screen
  cleanup: market ticker + seed line dropped, gold "made by ayaan gazali"
  LinkedIn chip (title-only DOM).
- Leaderboard name field 3→14 chars client+server. Analytics via http-gated
  script injection (static tag 404'd on file:// and tripped playtest).
- July 11 history compressed 37→26 commits (fixups folded into feature
  leaders), all branches rebased, tags remapped; content verified byte-identical.

## 2026-07-13 — [AUDIT FIX PACK] (docs/AUDIT-2026-07-13.md §7 priority list, batches A–G)

**Exploits (P0, live-board integrity):**
- ZERO CHURN farm dead: list/labor phantom respawns carry `inj`+`noBounty` —
  they count for the badge check (`dead || inj`) but pay $0 on stomp.
- Valuation cap: server POST gate `val ≤ max(raised,1)×390+10` (max legit
  multiplier chain) and ≤2.4M absolute; raised ≤ 6000. og/r endpoints clamp
  the same bounds so forged share cards can't exceed a legit run.
- Insert-race on the unique(seed,name) index: on conflict re-GET, compare,
  PATCH once if better, else honest "board hiccup — try again".

**Mechanics honesty:**
- Bell finale commits the win the frame the meter fills (`bellDone` + endTime
  snapshot + invulnerable celebration) — dying mid-confetti no longer eats a win.
- Interview/chat answer sides randomized per-question via `swapFor()` (bit-mix
  of the run's quoteRoll) — mash-left no longer clears either mini-game; probe
  reads the same function to stay deterministic.
- Chat opens with an 8s clock + intro beat; power timers (deck/coffee/matcha/
  slow/yc) tick down during chats, interviews, and rooms instead of freezing.
- throwDeck gated off during chat/interview/room/pause. Mom-round roll
  decorrelated from the cosmetic quoteRoll. First gremlin moved to x650 and a
  4-coin tutorial row added pre-contact.
- lateDraws flush moved outside the hurt-flash gate (celebs/billboards no
  longer vanish for a frame when hurt); occlude() rects now integer-aligned.

**Share loop (dead code → wired):**
- api/r.mjs result page: og tags point at /api/og with THAT RUN's params, meta
  refresh into the game. shareText/share sheet now emit resultUrl(won).
  api/og.mjs rewritten to the current badge surface (VALUATION, PEDIGREE,
  FOUNDER name, bounded params, s-maxage=86400).
- Analytics funnel: track('start'/'first_boss'/'badge_screen'/'win') on the
  existing window.va shim.

**Tests (were decorative, now load-bearing):**
- smoketest/playtest/deathtest assert and exit nonzero. Playtest's new must()
  gates immediately exposed the death leg silently idling on the TITLE screen
  (state 0 logged as pass) — fixed with Space-retry after reload; deathtest
  asserts state 3 + R-respawn to a fresh run.
- NEW qa/minigames-probe.js: chats, interview+BATCH F26, cofounder passives,
  mom-round paths, pedigree tiers (SERIAL check is seed-relative — bull days
  give +1 base heart), interns (dwell/10X/sprint-safe), CMO frame, pause-
  freezes-playMs. NEW qa/leaderboard-probe.js: http stub covering post/
  confirm/double-post-block/XSS-escape/fold-expand/empty-day.
- celebs-probe grep gate widened (+OBIT_CAPTIONS, +badgeFlairs); obituary
  probe asserts the real share copy; fullrun COIN_DETOURS resynced.

**Docs:** CLAUDE.md rewritten to current truth (owner-ruled celeb/billboard
gates recorded); qa/design-cameos.md §4 thin-veil table stripped per its own
instruction; stale-doc banners on the v0.1-era docs; CLIP-REPORT merge status
corrected; PARTNERS.md live-list note; README.md + docs/WHATS-BUILT.md created.

## 2026-07-13 — [INPUT NORMALIZATION] (owner field bug: MacBook where only WASD+X worked)

- Root cause: the key handler read raw `e.key` names (' ', 'ArrowLeft',
  'Escape'). Letters are the only names every browser agrees on — legacy
  engines and some layout/IME setups report 'Spacebar', 'Left'/'Up'/'Down'/
  'Right', 'Esc', or 'Process', so Space/arrows/Escape silently died while
  WASD+X kept working (and W still started the game because JUMP() includes it —
  exactly the reported symptom).
- Fix: normKey(e) — e.key when it parses (respects user layout), legacy-name
  map, e.code physical-key fallback for nav keys, and Key[A-Z] code recovery
  when an IME swallows a letter ('Process'). preventDefault now keys off the
  normalized name too, so those browsers also stop page-scrolling. Mute and
  keyup go through the same path; the lbName stopPropagation guard unchanged.
- smoketest now synthesizes the deviant events (Spacebar/Left/Up-with-no-code/
  Process+KeyD) and asserts the game reads them — the field bug is a permanent
  regression check. No physics/timing change; not a speedrun-contract item.

## 2026-07-13 — [MINI-GAME READABILITY] (owner call from a user playtest: "didn't
## understand the coffee-chat arrows; time too quick; shake when time runs out")

- Dialogue block moved to the TOP of the screen for both coffee chats and the
  interview: question, then the two answer cards directly under it, then an
  explicit "← picks the left answer, → the right" line. The scene art stays
  below; nothing important lives at the bottom edge anymore.
- Clocks loosened: chat questions 6s → 9s (first question 12s = 3s intro + 9s);
  interview 10s → 15s total (subtitle copy updated — still absurd, now
  answerable). React/end-card timings unchanged.
- TIME bar: labeled, thicker (6px), track behind it, drains left→right;
  turns red in the last third and blinks in the final stretch.
- Urgency shake: last ~2s of a chat question / ~3.5s of the interview, the
  whole dialogue judders ±1px (draw-only uiShake offset consumed by px() and
  the text overlay so sprites and crisp text move together; HUD exempt; sim
  untouched — not a speedrun-contract item, no physics change).

## 2026-07-14 — [POSTHOG + BOARD SEED + MEETLY CUT] (owner calls)

- PostHog wired (project 511099, US cloud): manual array.js loader + pre-load
  queue next to the Vercel Analytics shim — same http(s) gate, localhost
  excluded so qa probes stay hermetic, autocapture off (canvas game).
  track() now sends both targets and carries seed/valuation/raised/play_s.
- qa/seed-board.js: seeds today's daily board with 50 invented archetype
  founders through the LIVE endpoint (same plausibility gate + profanity
  filter as real runs; canon rule 3 — no real names). Values tuned beatable:
  8 winners (two pedigree flexes on top at $580M/$310M val), 42 out-of-runway.
  Daily board = rows age out with the seed; re-run any morning. --dry to preview.
- MEETLY.AI aftermath CUT (owner: "I don't get the papers thing" — post-boss-2
  recap email + the chasing ACTION ITEMS stack killed the win moment).
  The notetaker drone in Chad's arena stays: draw-only, does nothing,
  that's the product. CLIP-REPORT item 5 annotated.

## 2026-07-14 — [BOARD ROSTER v2 + ROW FORMATTING] (owner calls)

- Seed roster v2: reads like a real player base — common American/Mexican/
  Asian first names (JAKE, SOFIA G, WEI CHEN, PRIYA…), a few one-word
  originals (ZOZO, KAIROS, NIMBUS), best 10 troll handles kept
  (NEPOBABYCEO still #1). The 40 retired v1 joke rows were deleted from
  seed 195 by exact name (fabricated rows only — the never-delete-player-
  data rule covers humans, and none were touched).
- lbRowsHtml: prose lines → aligned flex columns (rank · name · valuation
  right-aligned · 🦄/💀 · time), podium medals + gold names for top 3,
  zebra striping, long names ellipsized. Same esc() — XSS probe still gates.

## 2026-07-14 — [SDK CRATES HURT] (owner bug report: "the SDK the first boss
## drops doesn't do any damage")

- Falling SDK crates now deal 1 RUNWAY on contact (once per crate, honest
  16×12 visual-equals-hitbox). Landed crates stay pure platforms — the
  mechanic is unchanged once the breaking change has shipped.
- New obituary: FOUNDER CRUSHED BY BREAKING CHANGE / "the SDK update shipped
  without a migration guide."
- Difficulty note (speedrun contract): the platform-boss arena gains a real
  hazard. Bot benchmarks post-change on seed #195: clean 5/6 budget,
  casual 10/12 — both inside budget, no lever pull needed.

## 2026-07-14 — [BILLBOARD ROSTER v3] (owner call, branch board-and-domain)

- CLEAN and DEEL removed; NOZOMIO added (nozomio.com, YC — "context for your
  coding agent", pink-on-ink #ff7ac2/#0f0f17). 16 boards total. NOZOMIO took
  CLEAN's vacated 5760/y56 slot: the CV agents row's 500px rhythm leaves no
  legal ≥400px same-height gap, so it sits one row over (gaps 610/300,
  nearest same-height 600px, outside all arenas) — nudge noted per procedure.
- CLEAN was the only partner:true board — the SPOTTED popup is now DORMANT.
  Code path kept; it reactivates the day the first written yes lands.
- qa/billboards-probe.js v3: ALLOWED_REAL mirrors the new roster, count 16,
  SPOTTED section now asserts dormancy (nothing fires, $0 granted).

## 2026-07-14 — [DOC RECONCILIATION] (audit discrepancy fixes, docs only)

- PARTNERS.md table rewritten to exactly the shipped 16-board roster (was
  self-contradicting 16-vs-17 and still listed CLEAN as seed partner):
  CLEAN + DEEL moved to a "Removed v3" section, NOZOMIO row added, no seed
  partner exists — outreach all-open, SPOTTED dormant until a written yes.
- docs/BILLBOARDS-FINAL.md: superseded banner → PARTNERS.md is the single
  source of truth; FINAL.md is design history.
- Drift fixes: interview is 15s TOTAL (WHATS-BUILT + README said 10s each);
  chat pay ($150K) and remote interns were already stated correctly.

## 2026-07-14 — [UNICORN GATE] (owner call)

- 🦄 is earned, not granted: wins render 🦄 only at VALUATION ≥ $1B; below
  that you get 🐴 (you're a horse until you're a unicorn). Losses stay 💀.
  Applied everywhere the win emoji sits next to a valuation: leaderboard
  rows (winEmoji helper in lbRowsHtml), the title-screen "your best exit"
  chip, and the win share text. The /api/og card shows no emoji — its
  CERTIFIED UNICORN headline is untouched (win branding, not a tier claim).
- Today's entire seeded class is sub-$1B, so NEPOBABYCEO defends #1 at
  $580M as a horse. leaderboard-probe now asserts all three tiers.

## 2026-07-14 — [DOMAIN PREP: sfspeedrun.com] (NOT DEPLOYED — checklist gated)

- Every host reference centralized on https://sfspeedrun.com: GAME_URL const
  + og:image/og:url/twitter:image meta tags (index.html), api/r.mjs (3 uses
  hoisted to a HOST const), URL-parse bases in api/og.mjs + leaderboard.mjs,
  qa/seed-board.js HOST, README links, WHATS-BUILT live line. Badge/obituary
  footers + shareText already derived from GAME_URL — no change needed there.
- docs/DEPLOY-CHECKLIST.md: buy → attach in Vercel (+www) → verify DNS →
  merge → deploy → verify endpoints → LinkedIn Post Inspector on an /api/r
  URL → re-run seed-board. Branch tip stays undeployed until the owner
  confirms purchase + attachment.

## 2026-07-14 — [REGRESSION PASS, branch board-and-domain] (probe fix + benchmarks)

- celebs-probe WITNESSED HISTORY leg was failing on today's seed — traced to a
  corpse: an earlier leg drains the last heart on some daily layouts and the
  witness gate only ticks in PLAY. The leg now revives (resumePlay) before
  staging, re-stages enemies/hearts every hop, retries across 3 launch cycles,
  and polls instead of blind-sleeping through the ascent. Reproduced on
  pre-branch main first (not the diff); game code untouched.
- Full battery green: 3 suites, 9 probes, casual bot 6/12. Clean bot straddles
  its 6-death budget post-crate-damage: branch {7,7,4}, baseline main {3,5},
  same seed — overlapping distributions, shared hotspot x5521 (platform-arena
  crates), display-only diff confirmed by hunk audit. Verdict: straddle
  variance, no branch regression. If CV starts feeling brutal in human play,
  the sanctioned lever is crate cadence — owner call, since crate damage was
  an explicit owner order.
- Screenshots: qa/overnight/board-nozomio.png (pink-on-ink render at 5760),
  qa/overnight/board-horse-tier.png ($1.2B 🦄 above $580M 🐴 above 💀).

## 2026-07-14 — [PAUSE MENU + HOME + FUNDING-ROUND BOSSES] (owner calls)

- Pause is now clickable: a ⏸ PAUSE chip (top-right, desktop, PLAY-only —
  touch keeps its existing ⏸ button) in addition to Escape. Pausing opens a
  proper menu: ▶ BACK TO WORK and 🏳 SHUT IT DOWN (title screen). Surrender
  stages a fresh run; playMs stays frozen while paused (speedrun contract).
- Both end cards (win + loss) gain 🏠 TITLE SCREEN next to retry.
- Bosses are the funding rounds (owner framing): arena entry banners
  PRE-SEED ROUND: THE PLATFORM / SEED ROUND: CHAD CAPITAL / SERIES A:
  SYNERGY.AI; kills close the round (PRE-SEED SECURED — DEPRECATED!,
  SEED CLOSED — VC HUMBLED, SERIES A CLOSED — ACQUIRED (BY YOU)) and the
  Series A kill adds the beat: "technically, you can IPO now." — the bell
  was already the IPO. Names carry the stage; mechanics untouched.
- Burn rate kept AS IS after owner query — it's ROADMAP §3 canon (standing
  still burns runway; smoke warns at 3s, tick at 6s, corgi/robotaxi exempt,
  the burnout obituary + WITNESSED HISTORY egg depend on it). AFK is now
  safe anyway: pause freezes the world and there's a button for it.

## 2026-07-15 — [FIX-SWEEP] full-repo bug-hunt fix pack + ALL-TIME leaderboard — branch fix-sweep

Four-lens adversarial review (sim / share-api / input-UI / test-integrity) over main @ 2cb4b93;
every finding verified against source before fixing. Trio + full probe battery green after the pack.

### P1 — launch blocker
1. **Mobile soft-lock after 🏠 TITLE SCREEN** — `showEndUI` hides `#touch`; only `resumePlay` restored
   it. `goHome()` and the title-start path now hand the d-pad back. New overnight-mobile leg guards it
   (home → title → next run drivable).

### Game fixes
2. **draw() no longer mutates state** — cold-brew steam particles emitted from update() (a paused frame
   was pushing 60 particles/s forever → unbounded array, FPS collapse); `shakeT` decays in stepGame().
3. **Interview invincibility is the full 8s** — `ycT` granted when control returns, not at the end-card
   transition (tickPowers was burning ~4s of it through the card).
4. **POST VALUATION works after a retry** — checkpoint respawn clears `lbPostedRun` (server keeps best);
   a second click on the same end screen now says "✓ already on the board" instead of eating the click.
5. **Blur pauses a running game** — a visible-but-unfocused window kept simulating; burn rate could kill
   an idle founder at a second monitor. Blur/hidden → pause (menu offers BACK TO WORK).
6. **Bell mash can't wipe the win screen** — 45-frame end-screen grace before R restarts (`endGraceT`,
   sim-clock, no wall time).
7. **No coffee chats mid-boss-fight** — the CONTRARIAN table sits inside CHAD's arena; chats/interviews
   now refuse to open while a boss is live, opening one ends the update frame (no same-frame hit), and
   checkpoint respawn clears any frozen mini-game state.
8. **Corgi shift-end cooldown (10s)** — expiry used to re-adopt instantly if you stood still, making
   burn immunity permanent from x≈2596 on. followT parks at -600 and ticks back.
9. **Hackathon room ticks buffs** — roomUpdate() now calls tickPowers() like chat/interview (the audited
   "buffs don't park" invariant); entering the room ends the frame (no parting slop hit).
10. **Title eggs don't move pickers** — SLOP's P was silently cycling the pedigree (non-cosmetic);
    egg-prefix keys skip the picker, and CORGI's leading C-cycle is reverted when the word completes.
11. **ZERO CHURN deck-kill path honors `inj`** — parity with the stomp paths (injected phantoms don't gate).
12. **Share text follows the typed name** — the badge post text was frozen with the pre-typing name
    (blank FOUNDER line on the unfurl) and the obit post dropped the per-run /api/r link on re-stamp.
13. **fm_name escaped at the innerHTML sink** (self-XSS hardening; shared `escHtml`).

### Leaderboard (client + api) — incl. the owner ask: DAILY + ALL-TIME boards
14. **ALL-TIME leaderboard** — `GET /api/leaderboard?all=1` returns the best surviving row per founder
    across every seed (dedup server-side, same 60s CDN cache). Toggles: 🏅 ALL-TIME on the end-card list
    and on the title panel. Daily board unchanged (still resets with the seed).
15. **Keep-best is won-aware** — the board ranks won→val→time but the overwrite compare ignored `won`:
    a $500K death could bury a $300K win (and vice versa). Compare + PATCH now mirror board order.
16. **PATCH races guarded** — concurrent improvements could leave the lesser run standing
    (last-writer-wins); the PATCH now carries a still-worse filter.
17. **Post-confirm board is fresh** — the list under "✓ ON THE BOARD" re-fetched the pre-post CDN copy
    (the exact bug the bust param claimed to fix); busted reads now drive the visible list.
18. **Seed clamp** — POST accepts today's seed ±1 day only (client seeds off the local calendar, server
    UTC); nobody pre-fills next week's board. Closes RESEARCH-LOG F2.
19. **Errors are no-store** — a Supabase blip was CDN-cached for 60s as "board unavailable".
20. **Blocklist additions** (leet-collapsed slur variants); Scunthorpe false positives (HANCOCK, DICKENS)
    consciously accepted — the rejection copy is part of the joke.
21. **og/r time width 5→7** — a legal 100+ minute run rendered "TIME 103:2" on the share card.

### Test integrity (the gates that could not fail)
22. corgi-probe static scan read the FIRST script tag (the analytics loader) — vacuously green forever;
    now scans the game script. obituary-probe's share-copy check compared a string to itself — now reads
    the REAL clipboard write. celebs-probe's WALTMAN check asserted the probe's own write — now a
    sign-pixel flip check. NEW: celebs-probe loads a RISKY_CAMEOS=false build and requires the celebs
    gone (the one-const kill switch, exercised for the first time). leaderboard-probe's XSS check passed
    on an empty list — the hostile row is now guaranteed present + escaped, stub server errors exit 1.
    playtest asserts SDK crates actually drop. obituary-probe stages the 'sdk crate' death. NEW pause/home
    coverage: minigames-probe (menu, resume, SHUT IT DOWN → clean title → fresh run), overnight-mobile
    (⏸ menu, backdrop-tap resume, 🏠 d-pad restore + drivable next run).
23. ci-sweep.sh: plausibility-clamp check is a HARD gate (was warn-only); secret scan covers
    sk-ant-oat/sid, sk-proj, ghp_/github_pat_, AKIA, phx_ + CHANGELOG.md no longer excluded.
    billboards-probe leak gate uses word boundaries (EXACT no longer trips EXA).
24. research-sweep.yml: timeout 20→30min; CI-SWEEP-LOG header order bug fixed (verified broken on the
    research branch); push races rebase+retry; an infra timeout can no longer file a "hard gate failing"
    issue (empty gate_exit guarded).
25. .gitignore += `.env*`; .vercelignore += `scripts/`, `.github/` (they were deploying to the public URL).

### Known-accepted, unchanged
- POST rate-limit still absent (RESEARCH-LOG F1, table-bloat only); rows remain forgeable within caps
  (no-HMAC owner tradeoff); CONTRARIAN table stays at x6480 as set decoration (chat gated off instead).
26. **📤 SHARE for everyone** (owner ask, same session): the button no longer requires file-share
    support — native share sheet where it exists, and the post text + per-run link land on the
    clipboard on EVERY click ("post + link copied ✓ — paste it anywhere").

## 2026-07-20 — [OVERNIGHT VERIFY] engine ruling + perf baseline + full gate + prod check (no game-code changes)

Overnight /goal run against ARGUMENTS "decide the engine, optimize, test thoroughly, verify production."
`index.html` was NOT modified — every deliverable is docs/QA/evidence. Verified-lines: all hard gates green
at `b392b0e`, prod byte-identical to main.

1. **Engine ruling recorded** (docs/PROJECT-CONTEXT.md ledger, 2026-07-20): vanilla JS + canvas 2D IS the
   engine, re-affirmed on request. Phaser/PixiJS rejected (100KB+ runtime + build step for unused
   features); Godot/Unity WebGL rejected (multi-megabyte multi-file exports break "one file, loads
   instantly"). Future perf work optimizes within this choice, never by swapping runtimes.
2. **`qa/perf-bench.js`** — advisory frame-cost benchmark (deliberately NOT a `*-probe`: perf numbers are
   machine-noisy, so it never gates CI). Wraps `stepGame()`/`draw()` with `performance.now()` across
   title, all five biomes, and the AI-boss arena.
3. **Optimization verdict: none needed, measured first.** Worst-phase p95 step+draw = **0.70ms of the
   16.67ms budget** (24× headroom, headless software raster — real GPUs are faster), zero over-budget
   frames, heap flat at 9.5MB across 90s of continuous play, entity arrays bounded (popups cap, shots/
   crates culled). Speculative micro-optimization of a 0.3ms draw = churn risk on a load-bearing loop for
   zero payoff; ruled out.
4. **Full gate re-run, all green** (`bash qa/ci-sweep.sh`): canon grep clean · secret scan clean ·
   npm audit 0 · plausibility clamps intact · smoketest/playtest/deathtest · all 8 probes +
   verify-daily-seed · clean fullrun PASS (badge 02:45, 4 recoveries of 6 budget). Plus:
   overnight-paths ALL PASS, overnight-mobile ALL PASS, `fullrun --casual` PASS (badge 04:39,
   9 recoveries of 12 budget, checkpoint haircut exact) — seed #201.
5. **Production verified read-only, zero drift**: sfspeedrun.com + www + foundermode.vercel.app all
   HTTP 200 serving a deploy **byte-identical to main HEAD**; live headless play session — 930ms load,
   playable, seed #201, zero console errors (`qa/overnight/prod-live-2026-07-20.png`);
   `/api/leaderboard` daily + `?all=1` healthy (all-time board live, AYAAN $1.107B 🦄 on top);
   `/api/r` result page 200 with correct og tags; `/api/og` renders a 43KB PNG card; `og.png` 200.
   No deploys, no writes, no accounts touched.

## 2026-07-21 — [PERSONA SWEEP] 10-archetype playtest → 15-item UX/feel/sound pack

Ten persona agents (staff engineer, VC associate, non-technical marketer, retro-gamer/speedrunner,
Gen-Z mobile, a11y designer, HN graybeard, seed-stage founder, SF newcomer, game-UX designer) each
played the live build headless and filed structured findings; a synthesis judge deduped them into a
canon-vetted backlog (full report: `qa/persona/persona-report-2026-07-21.json`). All 15 items landed
or were consciously partialed, one commit each, three tests green per commit.

1. **Death sting** — `sDead()`, a four-note descending triangle arpeggio at both `state=ST.DEAD`
   sites; `beep()` gained an AC-clock start offset (`at` param) so multi-note phrases never touch
   setTimeout. (9/10 personas flagged the silent obituary.)
2. **Checkpoint visibility** — term-sheet pennant flags in-world (gray→green, steady), TERM SHEET
   SIGNED popup + rising two-note confirm on crossing, BRIDGE ROUND popup 60→150 frames.
3. **Early-SOMA churn loop** — checkpoints[] += 950 (past the first pits) and 5250 (boss-1 doorstep);
   opening gremlin pair 650/680 split to 650/800. Array levers only; no i-frames (do_not_do).
4. **SHARE never fails silently** — synchronous status on every tap; rejected clipboard with no share
   sheet falls back to the visible readonly textarea (hoisted `manualCopy`, shared with SAVE).
5. **Mute you can see** — [M] MUTED HUD tag (steady), unmute confirm blip, pause-menu SOUND ON/OFF
   button (first touch-reachable control), persisted via `fm_muted`.
6. **DECK taught when it exists** — first-6s strip is move/jump/stomp only; a one-shot 5s strip
   returns when a deck first scrolls into camera; zero-damage pogo bounces whiff audibly.
7. **MUSIC** — 16-step chiptune sequencer (triangle bass + square lead) driven by `playMs`, notes
   scheduled on `AC.currentTime`; per-zone transposition; pause/blur/minigames silence it for free.
   No asset files, no setTimeout.
8. **Space retries end screens** — joins R behind the same endGraceT mash guard; 'R / SPACE to
   pivot' caption under the buttons.
9. **Popup de-overlap** — addPop nudges newcomers up a text row instead of stacking scrims into
   soup (scrims already existed; the overlap was the real a11y bug).
10. **Coyote time, 5 frames** — SPEEDRUN-CONTRACT NOTE: additive input forgiveness only (late-press
    ledge grace, zeroed on jump). No constant changed: GRAV 0.35, JUMPV -6.6, speeds untouched.
    Asymmetric gravity, accel curves, and held-jump bounce were REJECTED as contract violations.
11. **Juice + motion comfort** — boss hits: hitstop 8 + shake 4 + 110Hz damage thunk, kills hold 20;
    boss i-frame 15Hz flash-skip → steady 0.55-alpha ghost; title rocket flame 15Hz → 0.75Hz;
    `RMOTION` (prefers-reduced-motion) gates camera shake + clock judder at draw sites only.
12. **End-card fold pass** — rotate banner hidden behind the end card (fit() re-decides on resume);
    short-DESKTOP viewports put the name/POST row above the buttons (scoped after the mobile probe
    caught landscape-phone regression); stale below-fold R caption removed; HUD timer W-62→W-130
    out from under the pause chip.
13. **Analytics privacy gate** — PostHog loader now honors DNT + Global Privacy Control. Replacing
    it with a first-party counter = owner call, not taken overnight.
14. **Share-surface truth** — unicorn gate on every headline (badge/og card//api/r title: sub-$1B
    wins are CERTIFIED HORSE), T2D3 self-glosses '(sub-3:00 exit)' (paths-probe expectation updated
    per item-33 rule), STANFURD title footnote, /api/r og:description now describes THE run.
    SKIPPED 14b (pedigree column on the leaderboard): live Supabase migration = owner action.
15. **PIVOT roulette** — retries rename the company (8 invented names, popup + obituary ticker
    'PIVOT #N: …'); the label is now a mechanic, per the founder persona.

## 2026-07-21 — [TITLE REDESIGN] 5-critic panel → decluttered start screen + CUSTOMIZE panel

Owner complaint: title too crowded, dev-jargon copy, customization should be a tab. Five design-critic
agents (hierarchy, copy, first-play, mobile, Rams) analyzed screenshots + drawTitle source; a judge
merged them into one spec (`qa/persona/title-redesign-spec-2026-07-21.json`). Shipped in two commits,
Playwright-screenshot verified on desktop + both mobile orientations.

1. **Copy**: tab/og/twitter titles drop 'the SF startup platformer' for
   'FOUNDER MODE — stomp churn. dodge VCs. ring the IPO bell.' On-canvas tagline cut (the pitch line
   IS the tagline now); controls line trimmed to '←→ move · SPACE jump'.
2. **Layout**: 11 text elements → 6, 7 hues → 3. CTA promoted 12px→14px, pulse floor 0.65→0.8, sole
   green + sole pulse on screen with ~35px of air above. Stakes line recolored gray. Controls plate
   deleted. Footer = one joke line. Credit chip demoted from 17px gold box (it out-shouted the
   wordmark on portrait) to leaderboard-chip weight, bottom-right, 11px unboxed on portrait.
3. **CUSTOMIZE FOUNDER panel** (DOM overlay, pauseMenu precedent — canvas rows can't hit 44px tap
   targets at portrait scale): five picker rows with ‹ › arrows, stanfurd footnote under the PEDIGREE
   row it glosses, 'cosmetic. like most pivots.' as the header sub. Live founder preview stays visible
   left of the panel. Entry: [C] CUSTOMIZE FOUNDER chip · sprite tap · any picker key (C/H/V/X/P still
   apply their cycle first — probes pass untouched). Exit: ESC / DONE / tap-outside (never starts);
   SPACE ships it. Egg guards intact; completed CORGI closes what its C opened.
4. **Touch**: d-pad hidden on the title (landscape L/R pads covered the founder preview and swallowed
   its taps); game start/resume restore it, so the goHome soft-lock cannot recur.
5. **Probe updates (item-33 rule, consciously)**: overnight-mobile asserts d-pad hidden-on-title +
   shown-in-play (drivability guard retained); overnight-paths reverse-pitch sample band follows the
   bubble to y146-156 (moved clear of the taller CTA).

## 2026-07-21 — [SF SPEEDRUN] rename + female styles + skyline pass (owner asks, live session)

1. **The game is SF SPEEDRUN** — wordmark, tab/og/twitter titles ('SF SPEEDRUN — how fast can your
   startup IPO?'), badge footer, both share texts, /api/r titles, og-card tagline, reverse-pitch egg.
   Kept: the konami mood-meter FOUNDER MODE payoff (a mode, not a brand) and HYPERGROWTH DAILY.
   Paths-probe share-clip expectation follows the brand.
2. **LONG + BUN hair styles** — feminine silhouettes beyond PONYTAIL; HAIRS drives the picker/panel
   so no extra wiring; screenshot-verified at preview scale (`qa/persona/hair-*.png`).
3. **Ambient Karl-fog bands deleted** (owner: 'the clouds ruin it') — fog now exists only as the
   FOG THICK TODAY modifier's street overlay. B.fog/B.foggy remain in the biome table, unused.
4. **Skyline pass**: steady sine-sum twin-peaks hills (parallax .12), Coit Tower in the far loop,
   painted-ladies row in THE MISSION (parallax .5).
5. **Street gags** (draw-only, no hitboxes, invented names only): NO LEFT TURN (EVER) · FOR RENT
   1BR $4,600 cozy* *no windows · 2HR PARKING (towed anyway) · rideshare scooter graveyard ·
   STEALTH HQ porta-potty.

## 2026-07-21 — [GAME BOY MOBILE + APP FEEL] (owner asks, live session)

1. **Game Boy shell on touch**: chunky hardware d-pad halves (pressed-in active state), big crimson A,
   START/SOUND pills — SOUND is the first in-game touch mute (wired to setMuted, dims while muted).
   Portrait = GB classic: bezeled screen up top (outline — zero layout shift), deck below, pills
   centered, steady power-LED 'SF SPEEDRUN' brand line. Landscape = GBA: d-pad mid-left, A mid-right
   at 62% height (below billboards, above the ground line). Desktop untouched; mobile suite green
   with zero expectation changes.
2. **Installable app**: apple-mobile-web-app meta set + manifest.json + sw.js + icons (founder sprite
   + SF wordmark, rendered from the game's own draw code). Standalone fullscreen from the home
   screen, offline via network-first SW that never touches /api/ and registers only on
   https+non-localhost (probes stay hermetic). All new files are OPTIONAL (og.png/api class); the
   game remains one file.
3. **iMessage (GamePigeon-style) ruled out honestly**: native iMessage App Extension = Xcode + App
   Store + Apple dev account; not reachable from a web repo. Nearest shipped equivalent: iMessage
   link → per-run unfurl card → installable standalone app.
