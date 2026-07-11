# FOUNDER MODE — FINAL REVIEW (Synthesis Judge)

Date: 2026-07-11
Inputs: 5 critic panels (readability, gamefeel, shareux, mobile, comedy) + full cross-rebuttals; 12 adversarially-verified bugs; 4 design specs (biomes, customization, eggs, cameos) + canon-cop review.
Target: /home/claude/game/index.html (single-file, 480x270 canvas). Governing doc: /home/claude/game/MASTER-PLAN.md.
North star for every ruling below: the game's stated goals — LinkedIn virality, >80% of players reach a badge, 3-6 minute runs, satire in mechanics, canon rules 1-5 — outrank any single critic's aesthetic.

---

## 1. EXECUTIVE SUMMARY

The game is funny and the tuning at 60Hz/keyboard is decent. It is also currently **broken on every surface the LinkedIn thesis depends on**:

1. **The engine is frame-rate-bound.** No delta time means 2x speed on 120Hz devices (the literal target demographic) and a wall-clock timer that lies when tabs background. Every other tuning conversation is meaningless until this lands. (CONFIRMED critical.)
2. **The core verb is self-harming.** A correctly-executed boss stomp damages the player ~63-70% of the time (jump-cut clips the bounce, player re-enters the boss AABB one frame later), while the opposite input (hold jump) pogo-locks either boss to death in ~1 second with zero input. The advertised mechanic is simultaneously a trap and an exploit. (CONFIRMED critical + major.)
3. **Death erases the run.** Checkpoint respawn is dead code; dying at the final boss replays 2.5-4 minutes. Violates MASTER-PLAN §2.2's own "death costs ≤90s" law and is the #1 quit point.
4. **The viral loop is open-circuit.** Share text and badge contain no URL; the COPY button throws an uncaught TypeError in exactly the in-app webviews LinkedIn posts open in; on phones the touch d-pad renders ON TOP of the end-screen buttons, making SAVE BADGE physically dead; the badge's punchline is illegible at feed size.
5. **Two real trademarks ship in-game** (YC pickup/strings, "Patagonia vest" in the share text) plus one inherited (WEWORK sign) — canon rule 3 violations the plan itself marks launch-blocking.

The panel process worked: 5 findings were disputed and the disputes were substantially correct — the rulings in §2 drop or downscale a hard portrait gate, a hurt-input lock, hitbox growth, over-tuned boss i-frames, and a quip "subtitle bar." Everything else was endorsed, usually by 3+ independent verifications.

All four design specs are **approved for implementation** with canon-cop amendments honored (§4). The single non-negotiable design change: the shipping-tier "2AM REPLIER" cameo must be de-signatured (its own risk note admits the behavior alone identifies a real person).

---

## 2. THE DEBATE — DISPUTES AND RULINGS

Five findings drew formal disputes. Rulings:

### 2.1 Portrait phones: hard rotate-gate vs. non-blocking prompt
- **Readability (critic):** full-screen blocking overlay in portrait, pause input; also "never letterbox below 1.0x in portrait."
- **Shareux + mobile (dispute):** a blocking gate 100%-bounces every user with orientation lock on (most iPhones); the s≥1 clamp crops ~52px/side of a 480px canvas on a 375px viewport, including the HUD. Mobile adds: real phones are DPR 2-3, so the failure is physical size, not resolution.
- **RULING — dispute upheld, fix replaced, problem retained.** Portrait IS broken and IS the default LinkedIn in-app orientation. Ship the **non-blocking** version: a dismissible in-fiction prompt ("ROTATE YOUR PHONE — investors prefer landscape" — comedy panel confirmed this is the funnier of the two proposed lines; ship exactly one), top-align the canvas in portrait, and pull the touch buttons up directly under the canvas. **Dropped:** the input-pausing gate and the s≥1 clamp. Mobile's CSS-rotate-the-wrap idea is noted as an optional post-launch experiment only — too risky for launch. Reason: the funnel goal (>80% reach a badge) is served by degraded-but-playable, never by a wall at second zero.

### 2.2 Hurt knockback: 15-frame input lock
- **Gamefeel (critic):** lock directional input 15 frames so knockback plays out; hold-right tanking is dominant.
- **Shareux + mobile (dispute):** tanking is the stealth easy mode load-bearing for the >80%-badge goal; on touch, a quarter-second of ignored input reads as dropped controls; knockback near The Cloud's pits creates chain deaths. **Comedy (endorse):** a costless down round makes RUNWAY decorative.
- **RULING — dispute upheld (2 substantive dissents vs 1 endorse), fix split.** **Ship the juice half only:** 2-frame camera shake + 3-frame hitstop so "-1 RUNWAY" lands as an event. **Drop the input lock.** Comedy's satire point is real but the completion funnel wins; if tanking needs a future tax, tax RAISED (visible on the badge), not control ownership. Filed as post-launch tuning candidate, not a launch change.

### 2.3 Buzzword pill: grow hitbox to match text
- **Readability (critic):** size the shot's w from measureText so hitbox = pill = glyphs.
- **Gamefeel (dispute):** overflow is ~1.3px not ~4px; visual-slightly-larger-than-hitbox is CORRECT for dodge feel; growing 'SYNERGY' hitboxes 26→31px is a pure difficulty increase in the final fight.
- **RULING — dispute upheld.** Fix the **drawing only**: size the drawn pill to the measured text (+ padding), center the label, keep the collision AABB at 26x9 (pill drawn ≥ hitbox on all sides). This also fixes the real problem (white text bleeding onto the near-white Cloud ground) and future-proofs the v0.2 longer words ('AI-NATIVE', 'ALIGNMENT', 'WEB-SCALE'). Never resolve a visual/hitbox mismatch by growing the hitbox to meet the art.

### 2.4 Boss i-frames: 45f + 1.5x retreat
- **Gamefeel (critic):** hitT=45 + retreat at 1.5x → 30-45s pattern fights.
- **Shareux (dispute):** up to +90s on a 3-6 minute run; lengthened exposure lowers casual win rate; proposed 20f, no retreat. **Mobile (endorse w/ tuning):** hitT=30, retreat 1.0x, target 15-25s per boss on touch.
- **RULING — direction endorsed, numbers tuned down.** Bosses need i-frames — both the pogo-lock exploit and the stomp-hurt bug are CONFIRMED, and a 1.08s final boss delivers one quip of five (comedy: the crescendo is undelivered material). Ship **hitT=30, boss flashes, still bounce the player, NO retreat behavior in v1**. Combined with the stomp-separation fix (§3 bug #2) this yields ~2s minimum per hit cycle → ~10-25s fights. Re-measure casual-bot win rate before any escalation. MUST land in the same commit as checkpoint respawn and the bounceT fix (each makes the others safe).

### 2.5 Boss quips: fixed "talking head" bar
- **Readability (critic):** relocate quip bubble to a fixed screen bar at y≈30.
- **Comedy (dispute):** the viral screenshot unit is robot+speech-bubble in one frame; a subtitle bar reads as UI and splits joke from speaker in every crop.
- **RULING — dispute upheld.** Keep the bubble **anchored to the boss**, raise it to b.y-34, and let the other three de-collision fixes (popup horizontal offset, buzz spawn stagger capped at b.y+22 per gamefeel's amendment, pips staying at b.y-12) clear the band. Gate the bubble on actual boss visibility (x > -b.w && x < W) — this simultaneously fixes the orphaned-bubble finding, so no separate patch for that.

### Minor amendments adopted without dispute (recorded so fixers don't re-litigate)
- 'HIT! (n CONVICTION LEFT)' → **'CONVICTION: n'** (grammar + width; pips carry the count). Boss final hit keeps 'DOWN ROUND!!'.
- Respawn haircut popup is **'BRIDGE ROUND: -25%'**, not 'DOWN ROUND' (semantic collision with the boss-kill popup).
- Keep the word **'TERMS'** on the projectile (the word is the payload, per lore) at 6px with dark backing — do not swap to '$'.
- VEST fillText deleted; the replacement quip is the lore's own **'MY VEST IS LOAD-BEARING'** (not the invented 'NICE VEST, RIGHT?').
- Chad's split quip merges to **'A FEATURE, NOT A COMPANY.'**; freed slot filled with **'LOVE IT. PASSING.'**
- Pit popup in The Cloud reads **'-1 RUNWAY (the 0.01% downtime)'** (with the word "downtime" — self-contained joke).
- 'or press R to run it back' hint **gated on !('ontouchstart' in window)**.
- No UA sniffing for in-app browsers; show the long-press caption unconditionally on touch: **'press & hold the badge to save it. yes, really.'**
- GAME_URL is **hardcoded** (location.href inside webviews can be a tracking redirector; a wrong link in a thousand posts is unfixable).
- Loss-badge share order: **PIVOT (RETRY) first, share buttons immediately second** — never below the fold (comedy: losers are the comedy's best distributors).
- Title footer whisper ('a dumb side project...') stays at whisper contrast. Do not "fix" it.
- Jump buffer 6f + rising-edge (kills auto-pogo); keep the generous ledge rule as de facto coyote time.

---

## 3. CONFIRMED BUG LIST (adversarially verified), RANKED

| # | Bug | Sev | One-line fix direction |
|---|-----|-----|------------------------|
| 1 | **No delta-time** — game speed ∝ display refresh; 2x at 120Hz, slow-mo under throttling | CRITICAL | Fixed-timestep accumulator (16.67ms steps, 100ms clamp) in loop() |
| 2 | **Boss stomp self-damage ~63-70%** — jump-cut clips bounce, player re-enters boss AABB next frame → hurtPlayer() | CRITICAL | Separate player above boss top on stomp + bounceT exemption from line-297 jump cut |
| 3 | **Pogo-lock** — one no-input drop kills either boss (no boss i-frames + homing AI re-centers under player) | MAJOR | Boss hitT=30 i-frames (see ruling 2.4); pairs with #2 |
| 4 | **Pit-wall snap-up** — player teleports up through pit walls from any depth; hold-right crosses pits at base speed, no jump | MAJOR | Prev-frame-above guard on landing (mirror collidePlats lines 257-258) |
| 5 | **Die-and-win same frame** — bell check has no state guard; dead player gets CERTIFIED UNICORN + $1M (two independent confirmations) | MAJOR | `state === ST.PLAY` guard on bell check; return after death; clear boss shots on boss death |
| 6 | **Held R skips badge** — level-triggered restart in loop() wipes the win badge unrecoverably | MAJOR | Delete loop-level keys['r'] block; clear keys in showEndUI |
| 7 | **Run timer counts backgrounded wall-clock** — inflated TIME on HUD/badge/share text of a time-attack game | MAJOR | Accumulate simulated playMs per update() step (NOT visibilitychange — verified occlusion throttling bypasses it) |
| 8 | **HUD timer ticks behind the end screen**, contradicting the frozen badge TIME in the screenshot frame | MAJOR | Freeze HUD clock outside ST.PLAY (subsumed by #7's playMs) |
| 9 | **Stuck keys on blur** — alt-tab with a key held auto-runs the founder into enemies/pits | MAJOR | Clear keys + touch flags on window blur / document.hidden |
| 10 | **COPY crashes on insecure/webview contexts** — navigator.clipboard undefined → sync TypeError, intended fallback unreachable | MAJOR | Existence guard + execCommand fallback + visible readonly textarea last resort |
| 11 | **1px-foot mid-air stand** — 11.5/12px overhang reads as grounded, reachable via friction slide | MINOR | Narrower centered ground sensor for player only: groundBelow(p.x+3, p.w-6) |

Additionally, four **critic findings were independently reproduced during rebuttal** and are treated as confirmed bugs for scheduling purposes: touch overlay eats end-screen taps (CRITICAL — SAVE BADGE 100% dead across its width on 667x375 after image decode), checkpoint respawn is dead code (CRITICAL for retention), #tJ CSS specificity discards the 86px jump button (MAJOR), touchcancel never handled → phantom held input (MAJOR).

---

## 4. DESIGN-SPEC VERDICTS (+ canon-cop items to honor)

### 4.1 BIOMES — /home/claude/qa/design-biomes.md — **APPROVED AS SPECCED**
Single BIOMES table keyed by zoneName(cam+W/2), ~12 net branching lines, SOMA byte-identical baseline, Cloud void contrast-probed, Cerebral Valley row dormant until v1.0. No canon findings. Hard-cut zone switch is correct; the crossfade stays Appendix-B optional.

### 4.2 CUSTOMIZATION — /home/claude/qa/design-customization.md — **APPROVED WITH 2 AMENDMENTS**
The spec honors every hard constraint (one file, no assets, pixel-identical default, WCAG-validated hexes, tests pass unmodified). Canon-cop items to honor:
- Add a **Milestone header** to the spec assigning it explicitly (it is being implemented now by orchestrator decision; record that decision in the doc rather than leaving it milestone-orphaned).
- Reword line 22: localStorage is *consistent with* the plan's intent (§1.7 will use it), not *blessed by* it — §1.7 is traction-gated v1.0 content.

### 4.3 EGGS — /home/claude/qa/design-eggs.md — **SHIP SET APPROVED; SPEC STRINGS MUST BE CANON-FIXED FIRST**
Implement ship set only: ZERO CHURN, T2D3, THE REVERSE PITCH. Held eggs (PIVOT cycler, ADVISOR MODE, SPACE AVAILABLE, NO GOING LEFT, SERIAL ENTREPRENEUR) stay held — but their spec strings get fixed NOW so the violation cannot ship later:
- Line 47: `Uber for jumping` → **`rideshare for jumping`** (rule 3; §1.1's "Uber for something" is unrendered lore prose, not display-copy precedent).
- Line 49: `THIS IS JUST LIKE UBER IN 2011` → **`I SAW THIS EXACT THING IN 2011.`**
- Line 184 (§3 item 3): rewrite the garbled self-contradicting trademark guidance; delete the Airbnb aside.
- Egg 6 setup restated as **'the coworking-husk joke'** (depends on the WEWORK sign rename, §5 item F-28).
- 'Konami' stays dev-facing only; rename in spec to 'the classic cheat-code sequence (↑↑↓↓←→←→BA)' with a never-render note.

### 4.4 CAMEOS — /home/claude/qa/design-cameos.md — **SHIPPING TIER APPROVED WITH 2 SPRITE/COPY CHANGES; RISKY TIER: NEVER**
- **THE 2AM REPLIER → THE 2AM SHIPPER** (critical canon item; the spec's own R1 note admits the reply-at-2am signature alone identifies a real accelerator CEO). Bubble: `IT'S 2AM. GREAT TIME TO SHIP.` Sprite unchanged.
- **Contrarian turtleneck → crew-neck tee** under the blazer (same rects, relabel + non-collar color). Keep arms-crossed and faces-LEFT — those carry the joke.
- **Line 192 rewritten:** "ship tier only, full stop; this table documents why each thin-veil was rejected, not a ranking of options." No sign-off path exists to violate rule 3.
- **§4 (risky tier) must not be committed to any public repo.** Strip before M0's GitHub push; replace with one line: "Thin-veil variants were evaluated and rejected; see private notes."
- Upstream: the x=1500 sign `WEWORK` → `COWORKING space available (all of it)`; update both specs' references ('dead coworking territory').

---

## 5. THE IMPLEMENTATION ORDER

Rules for fixers: work top-to-bottom within a section; items marked [PAIR] must land in the same commit as their partner; after EVERY item in [FIX-BUGS], re-run `cd /home/claude/qa && node /home/claude/game/test/smoketest.js && node /home/claude/game/test/playtest.js && node /home/claude/game/test/deathtest.js`. Named probes live in /home/claude/qa/.

### [FIX-BUGS] — /home/claude/game/index.html

**Engine + timing (do first; everything else is tuned against it)**
1. **Fixed-timestep loop.** Replace loop() (lines ~868-880): `acc += Math.min(now-last,100); last=now; while(acc>=1000/60){update();acc-=1000/60;} draw();` using the rAF timestamp. No physics constants change. TEST: verify-framerate-skeptic2.js → walk ≈100px/s with uncapped rAF; measure in-page in one evaluate (round-trips starve when uncapped).
2. **Simulated play clock.** Add `playMs += 1000/60` per update() step while state===ST.PLAY; HUD (line 758), makeBadge (814), shareText (830) all read fmtTime(playMs); remove performance.now()-startTime timing (keep endTime = playMs snapshot). TEST: verify-blur-timer.js → backgrounded time not counted; verify-timer-freeze.js → HUD == badge TIME on end screens.
3. **Input hygiene on blur.** `window.addEventListener('blur', clearAllInput)` + same on document.hidden, where clearAllInput zeroes every keys[] entry and touch.L/R/J. TEST: verify-stuck-keys.js → player stationary after refocus.

**State machine**
4. **Bell state guard.** Line ~456: `if (state===ST.PLAY && finalBoss.dead && !bellDone && p.x>7400)`. Also `return` from update() immediately after any hurtPlayer() call that set state=ST.DEAD (mirror the pit path at 318), and clear that boss's live shots in the b.hp<=0 branch. TEST: verify-die-at-bell.js + verify-die-while-winning.js → endCalls==['DEAD'] only; control win still clean.
5. **Held-R wipe.** Delete the keys['r'] restart block from loop() (line ~872); in showEndUI() add `keys['r']=false`. The edge-triggered keydown handler (line ~70) remains the only restart path. TEST: verify-heldR-skips-badge.js → badge persists with R held.

**Physics**
6. **Pit-wall snap-up.** In the landing check (line ~305-306): require the player was above the surface last frame: `&& p.y + p.h - p.vy <= g + 4`. TEST: verify-pitsnap.js scenarios 1 AND 2 → player falls/dies, never teleports up; playtest still completes.
7. **Ledge footing.** Player ground probe → `groundBelow(p.x+3, p.w-6)` (player only; enemy 1px sensor untouched). TEST: verify-lip-overhang.js → x=779.5 falls; friction-slide case B falls; all pits still clearable (feelprobe2 pit sweep).
8. **[PAIR w/ 9] Reward-bounce exemption.** Add `p.bounceT` set to 12 on enemy stomp (line 377) and boss stomp (line 424), decremented with hurtT; line 297 → `if (!JUMP() && p.vy < -2.5 && !(p.bounceT>0)) p.vy = -2.5;`. TEST: verify-stomp-hurt.js → 0 stomp-hurts at any contact depth, both jump-held and tap styles.
9. **[PAIR w/ 8] Boss stomp separation + i-frames.** On successful stomp: `p.y = b.y - p.h - 1;` alongside the bounce; add `b.hitT = 30`, decrement per frame, skip the hp-- branch while b.hitT>0 (still bounce the player; flash boss sprite on alternating frames). NO retreat behavior (ruling 2.4). TEST: verify-pogo3.js → no-input drop no longer kills either boss; scripted fight lands in 10-25s; casual bot still wins.
10. **Jump buffer + rising edge.** `p.jbuf=6` on JUMP() rising edge (track prevJump); jump fires on `p.jbuf>0 && p.onGround`; holding no longer auto-pogos. TEST: feelprobe.js E3 → buffered and late-tap jumps register; hold-jump produces exactly one jump per press.

**Progression + death**
11. **[PAIR w/ 12] Checkpoint respawn.** Death-retry paths (PIVOT button + R restart from ST.DEAD) call reset(true); fix reset()'s fromCheckpoint branch: else-clause sets hearts=3, player.hurtT=120, shots.length=0, live boss deactivated back to trigger (not revived if dead); raised haircut `raised=Math.floor(raised*0.75)` + popup **'BRIDGE ROUND: -25%'**. Full restart only from WIN screen. TEST: die at x≈7000, retry → respawn at checkpoint, 3 hearts, dead bosses stay dead, raised = 75%.
12. **[PAIR w/ 11] Checkpoint list** (line 200) → `[20, 1930, 3660, 4700, 5350, 6740]`. TEST: pit at 5450 respawns at 5350; boss deaths respawn at arena doors 4700/6740.
13. **Hurt juice (no input lock).** 2-frame camera shake + 3-frame hitstop (skip update, keep draw) on hurtPlayer(). Knockback/input handling otherwise unchanged (ruling 2.2). TEST: visual; feelprobe E8 displacement unchanged.

**Mobile input**
14. **Touch overlay vs end screen.** showEndUI(): hide #touch, zero touch.L/R/J; restore on every return to ST.PLAY (retry button, R path, canvas tap-restart line ~92). CSS: `#ui{z-index:10}` `#touch{z-index:5}`. TEST: readability_verify2.js pattern — elementFromPoint over #bDl/#bRe AFTER badge image decode returns the buttons, on 667x375 touch.
15. **#tJ specificity.** Line 35 selector → `#touch div#tJ`. TEST: getComputedStyle(#tJ) → 86px/86px/50% radius.
16. **Unified touch handler.** Replace per-button listeners with one container handler on #touch: on touchstart/touchmove/touchend/touchcancel, recompute touch.L/R/J from scratch by hit-testing every live e.touches point against the three button rects (+10px slop). This delivers thumb-slide between ◀▶, kills the 16px dead gutter, and fixes touchcancel stickiness in one change (supersedes separate touchcancel patches). TEST: synthetic touch sequence start-on-tL-move-to-tR → touch.R true; touchcancel → all false.
17. **Safe area.** Meta: add `viewport-fit=cover`; CSS: `bottom: calc(18px + env(safe-area-inset-bottom,0px))` (+ horizontal insets on tL). TEST: computed styles present; layout unchanged where env()=0.
18. **Portrait handling (non-blocking — ruling 2.1).** On touch+portrait: dismissible overlay 'ROTATE YOUR PHONE — investors prefer landscape' (this exact line, once); top-align the canvas letterbox; position touch buttons directly under the canvas. Game stays playable in portrait. TEST: 390x664 → prompt visible + dismissible, canvas at top, buttons adjacent, input works.

**First 5 seconds**
19. **Title CTA + controls.** Replace frame%60 blink with alpha pulse `0.65+0.35*sin(frame*0.1)`; controls line: 8px, rgba(0,0,0,.45) backing rect, and branch on ontouchstart → `◀ ▶ move · A jump · stomp enemies` (drop 'M mute' on touch). Footer whisper untouched. TEST: screenshot any frame contains CTA; touch UA shows touch string.

**Share loop**
20. **GAME_URL.** `const GAME_URL='<canonical URL — hardcoded, never location.href>';` append `\n\nPlay: ${GAME_URL}` to both shareText branches; badge footer → `'FOUNDER MODE · '+GAME_URL.replace('https://','')` bold 34px #ffd94a. TEST: clipboard text ends with URL; 300px badge downscale shows readable footer.
21. **Clipboard hardening.** bCp handler: `if(navigator.clipboard?.writeText){...then(ok,fallback)}else fallback();` fallback = temp textarea + execCommand('copy'); on failure replace #cpMsg with a visible readonly textarea of the post text + 'select all + copy manually'. TEST: verify-share-insecure.js on plain-http host → no pageerror, visible fallback.
22. **Native share + blob save.** At showEndUI, pre-generate the badge blob (toBlob — synchronously available for the click handler, required on iOS); if `navigator.canShare({files:[file]})` render first-position 'SHARE BADGE' calling navigator.share({files,text:shareText(won)}); COPY on desktop also attempts ClipboardItem image write; SAVE switches to blob object-URL. On touch, permanent caption under the badge: **'press & hold the badge to save it. yes, really.'** No UA sniffing. TEST: canShare-mocked env shows button; desktop unaffected; caption renders on touch only.
23. **Badge legibility.** Quote → bold 36px #cfd6e4 at y=495; footer → 34px y=565; stats leading 60→52px (y=295/347/399). TEST: re-run 300px downscale (share_probe.js) → quote and footer readable.
24. **Loss badge progress.** makeBadge(false): replace BOSSES line with `'DIED IN  '+zoneName(player.x)` in #c58bff at ≥36px (win badge keeps BOSSES); shareText(false) mirrors: 'Raised $NK and died in SOMA. It was a market timing issue.' TEST: loss badges at two death points differ; 300px legible.
25. **End-screen hierarchy.** `#ui{background:rgba(8,8,20,.78)}`; skip drawHUD() and popup rendering when state!==ST.PLAY. TEST: loss/win screenshots show no debris/HUD behind card.
26. **Button order + copy.** Loss screen: PIVOT (RETRY) first, share buttons immediately second (never demoted further — ruling §2 amendments); success msg → 'post copied ✓ — now SAVE BADGE and attach it'; add 'or press R to run it back' gated on `!('ontouchstart' in window)`. TEST: DOM order on loss vs win; hint absent on touch.

**Copy + canon batch (one commit, greppable acceptance)**
27. **De-brand.** YC pickup → gold envelope w/ red rocket stamp (sprites.js ~202); line 349 → 'ACCELERATED! INVINCIBLE'; line 761 → 'DEMO DAY MODE '+s; keep internal yc/ycT keys. Line 832 → 'out-jumped a VC whose vest is load-bearing'. GATE: `grep -iE 'yc accepted|yc mode|patagonia' index.html` → empty.
28. **WEWORK sign** (x=1500) → `COWORKING space available (all of it)`. GATE: `grep -i wework index.html` → empty.
29. **Register fixes.** Line 426 → `'CONVICTION: '+b.hp` while hp>0, 'DOWN ROUND!!' on kill; line 377 scooter → 'THESIS DECLINED! +$10K'; line 348 → 'COLD BREW! VELOCITY +47%'. Update MASTER-PLAN §1.3/§1.6 [keep] entries to match (resolving the plan's internal contradictions).
30. **In-world text floor.** Line 714: enlarge term-sheet shot to w:12,h:10, draw 'TERMS' at 6px with rgba(0,0,0,.55) backing (keep the word — ruling §2); lines 526-527: delete 'VEST' fillText; add 'MY VEST IS LOAD-BEARING' to Chad's quips. Also merge Chad's split quip → 'A FEATURE, NOT A COMPANY.' and add 'LOVE IT. PASSING.'
31. **Boss-band de-collision (ruling 2.5).** Bubble anchored to boss, raised to b.y-34, gated on `x > -b.w && x < W` (fixes orphaned bubble); hit popups spawn at b.x-40; buzz spawn band staggered b.y-6..b.y+22 with skip-if-live-buzz-within-30px; buzz pill DRAWN sized to measured text + centered label, collision AABB stays 26x9. TEST: r2_ai_chaos-style capture → no text mutual occlusion; shot hitboxes unchanged in evaluate.
32. **Cloud jokes.** New sign at x=6000: 'MIND THE GAPS' / `(that's the 0.01%)`; pit popup (line 317) zone-aware: THE CLOUD → '-1 RUNWAY (the 0.01% downtime)', else unchanged. TEST: sign renders on seg [5504,6300]; forced Cloud pit death shows new string.
33. **Full regression.** All three test scripts + re-run the probe suite for items 1-16. Any probe that now fails because the bug is fixed gets its expectation inverted, not deleted.

### [CUSTOMIZATION] — implement /home/claude/qa/design-customization.md
34. Add Milestone header + reword the localStorage line (spec doc first — §4.2 amendments).
35. Land the FOUNDER_LOOK data model (SKINS/HAIRS/HOODIES, resolveLook, cycleLook, localStorage 'fm_look' with clamped validation, try/catch, untouched by reset()).
36. Land the drop-in drawFounder replacement (optional 8th look param; hair drawn last). TEST: default look {s:1,h:0,v:0} renders pixel-identical to v0.1 (screenshot diff vs pre-change capture); all 3 game tests pass unmodified.
37. Land the title-screen picker: C/H/V on keydown, three canvas chips (x112, y192/206/220) with padded tap zones intercepting canvas touchstart before tap-to-start, mousedown handler, s=3 live preview at x56. Caption 'cosmetic. like most pivots.' TEST: cycle via keys and taps; persistence across reload; tap-to-start still works outside chip zones.
38. Verify badge pickup: makeBadge renders the chosen look with zero signature change. Run /home/claude/qa/contrast-check.js → 'ALL RULES PASS'. Sync sprites.js/gallery.html.

### [EGGS] — implement ship set from /home/claude/qa/design-eggs.md
39. Canon-fix the spec strings FIRST (§4.3: rideshare line 47, advisor quip line 49, §3 item 3 rewrite, konami rename, Egg 6 'coworking-husk' wording). Held eggs remain unimplemented.
40. ZERO CHURN: top-level kill counter, in-run popup on 20/20, badgeFlairs() rail at badge y=462, share-text line. TEST: evaluate-driven full-clear run → flair present; miss one enemy → absent.
41. T2D3: win with playMs < 180000 (NOTE: spec said wall-clock performance.now(); after item 2 this MUST read the simulated playMs so background tabs neither help nor hurt) → badge flair + share-text line. TEST: forced fast win shows flair; 3:01 win doesn't.
42. THE REVERSE PITCH: idleT ticking on title (frame++ verified line 285), 60s → looping boss-style bubble over the title founder at (90,216), inserted before drawTitle's textAlign='center'; idleT reset on keydown, touch bind, canvas touchstart. All new state as top-level `let`. TEST: evaluate idleT=3600 → bubble cycles; any input clears it.
43. Regression: all three game tests + negative probes from the spec's QA plan.

### [BIOMES+CAMEOS] — implement /home/claude/qa/design-biomes.md + shipping tier of design-cameos.md
44. BIOMES lookup table (exact hexes from spec, SOMA byte-identical) + zoneName(cam+W/2) lookup once per frame in drawBG().
45. Zone recolors: Mission mural sunset + fillRect bunting (64px wire y=88, 4-flag cycle, parallax .5); Sand Hill golden hour; Cloud voidZone skyline skip + darkened lower sky (#b9c4de→#8f9fc6); ground palette (sidewalk/asphalt/stripe) into the table, deleting the inCloud special case. Cerebral Valley row present but unreachable until v1.0. TEST: screenshot at each zone center vs /home/claude/qa/biome-preview.png reference; boundary segments flip sky+ground same frame; title screen still shows SOMA.
46. Cameo spec amendments FIRST (§4.4): 2AM REPLIER → **2AM SHIPPER** with bubble 'IT'S 2AM. GREAT TIME TO SHIP.'; contrarian turtleneck → crew-neck; line 192 rewrite; §4 stripped from any doc that will be committed publicly; both docs' 'WeWork territory' → 'coworking territory'.
47. Cameo render passes: sprites after platforms loop (~line 658), proximity bubbles (|player.x-cx|≤60, clamped) before drawHUD (~line 739); zero collision/update/reset state. All six at verified x positions (455, 1740, 2470, 3560, 3990, 6135). TEST: screenshots at each cameo in both animation phases vs cameo-preview-a/b.png; no page errors; playtest timing unaffected (pure draw).
48. Final full pass: all three game tests, framerate probe, mobile hit-test probe, badge downscale probe, and the canon greps (yc|wework|patagonia|uber → empty in index.html and all rendered strings).

---

## 6. DROPPED / DOWNSCALED FINDINGS (and why)

| Finding | Disposition | Why |
|---|---|---|
| Portrait hard rotate-gate + s≥1 clamp (readability) | Fix replaced (item 18) | Bricks orientation-locked iPhones = 100% bounce at funnel top; clamp crops the HUD. Problem itself confirmed and fixed non-blockingly. |
| 15-frame hurt input lock (gamefeel) | Dropped; juice-only shipped (item 13) | 2 substantive disputes: tanking is the accessibility valve for the >80%-badge goal; on touch, ignored held input reads as broken controls; knockback-into-pit chain deaths. |
| Grow buzzword hitbox to match text (readability) | Draw-only fix shipped (item 31) | Visual ≥ hitbox is correct dodge feel; the fix as written was a stealth difficulty increase in the final fight. |
| Boss hitT=45 + 1.5x retreat (gamefeel) | Tuned to hitT=30, no retreat (item 9) | +90s of boss exposure vs the 3-6 min target and casual chip-death risk; re-measure before escalating. |
| Fixed 'talking head' quip bar (readability) | Replaced by raised anchored bubble (item 31) | The screenshot unit is boss+bubble in one frame; a subtitle bar splits joke from speaker in every viral crop. |
| Standalone orphaned-bubble patch | Merged into item 31 | Visibility gate fixes it as a side effect; don't patch the clamp twice. |
| Standalone touchcancel patch | Merged into item 16 | Container-level recompute-from-e.touches fixes cancel, slide-over, and the dead gutter in one handler. |
| UA-sniff in-app browser relabel (mobile) | Dropped (item 22) | UA strings churn; wrong sniff mislabels a working button; unconditional touch caption achieves the goal. |
| Risky-tier cameos (all 6) | Never ship; docs sanitized (item 46) | Canon rule 3 is absolute; the spec's own notes concede identifiability; public-repo exposure with zero gameplay upside. |

— end of review —
