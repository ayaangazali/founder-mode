// celebs-probe.js — HUMOR PATCH item 4 acceptance + the non-negotiable GUARDRAIL:
// celeb names must NEVER appear in makeBadge / makeObituary / shareText output
// or source. Plus behavior: Teal bubble, Barry's death-line memory, Waltman's
// sign flip, the rocket, and the WITNESSED HISTORY egg.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const os = require('os');
let fails = 0;
const check = (n, ok, d) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? '  — ' + d : ''}`); if (!ok) fails++; };
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../index.html'));
  await p.waitForTimeout(700);

  // ---- THE GREP GATE (spec GUARDRAILS, verbatim intent) ----
  const gate = await p.evaluate(() => {
    const src = makeBadge.toString() + makeObituary.toString() + shareText.toString()
              + JSON.stringify(OBIT_HEADLINES) + OBIT_BODY.map(f => f.toString()).join('')
              + JSON.stringify(WIN_FRONTPAGE) + WIN_BODY.map(f => f.toString()).join('')
              + JSON.stringify(OBIT_CAPTIONS) + badgeFlairs.toString(); // full surface, parity with the billboard gate (audit)
    // incl. the IS CODE DEAD panel cast (pol gram / xandr wing / dareo)
    return /teal|barry gan|tusk|waltman|pol gram|xandr wing|dareo/i.test(src);
  });
  check('GREP GATE: no celeb names in makeBadge/makeObituary/shareText', gate === false);
  const flagged = await p.evaluate(() => typeof RISKY_CAMEOS === 'boolean');
  check('RISKY_CAMEOS kill-switch exists (probe no longer pins it ON — audit)', flagged);

  await p.keyboard.down('Space'); await p.waitForTimeout(200); await p.keyboard.up('Space');
  await p.waitForTimeout(300);

  const whiteBubble = () => p.evaluate(() => { // any celeb bubble = white box in the NPC band
    const d = cx.getImageData(0, 150, 480, 70).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] > 245 && d[i+1] > 245 && d[i+2] > 245) n++;
    return n;
  });

  // TEAL: bubble on approach (tealOn also anchors the kill-switch comparison below)
  await p.evaluate(() => { bosses.forEach(bb => bb.dead = true); player.x = 7080; player.y = GROUND_Y - 40; cam = 6900; player.hurtT = 240; });
  await p.waitForTimeout(250);
  const tealOn = await whiteBubble();
  check('PETER TEAL bubbles on approach', tealOn > 250, tealOn + ' white px');
  await p.screenshot({ path: path.resolve(__dirname, 'overnight', 'celeb-teal.png') });

  // WALTMAN: the hand-held sign must actually FLIP when the final boss dies —
  // the old check asserted the probe's own `bosses[2].dead = true` write back
  // at itself (tautology; the flip rendering could break and the gate stayed
  // green). Real check: the sign's parchment box is sized to the text
  // ('it knows me' → 'it knew me' changes its width), so the lit-parchment
  // pixel count in the sign band must move when the flag flips.
  const signPix = () => p.evaluate(() => {
    const d = cx.getImageData(0, 195, 480, 40).data; // sign band: GROUND_Y-17+2 ≈ y217
    let n = 0;
    for (let i = 0; i < d.length; i += 4)
      if (d[i] > 215 && d[i+1] > 205 && d[i+2] > 170 && d[i+2] < 225) n++; // #e8e0c9 parchment
    return n;
  });
  await p.evaluate(() => { player.x = 8380; player.y = GROUND_Y - 40; cam = 8280; player.hurtT = 240; bosses[2].dead = false; });
  await p.waitForTimeout(250);
  const signBefore = await signPix();
  await p.evaluate(() => { bosses[2].dead = true; });
  await p.waitForTimeout(250);
  const signAfter = await signPix();
  await p.screenshot({ path: path.resolve(__dirname, 'overnight', 'celeb-waltman-knew.png') });
  check('WALTMAN sign flips when SYNERGY.AI dies (sign pixels changed)',
    signBefore > 0 && signAfter > 0 && Math.abs(signAfter - signBefore) > 12,
    signBefore + ' → ' + signAfter + ' parchment px');

  // BARRY: cycles, then remembers your death
  await p.evaluate(() => { bosses.forEach(bb => { bb.dead = false; bb.active = false; }); // fresh-ish
                           player.x = 4280; player.y = GROUND_Y - 40; cam = 4160; player.hurtT = 240; });
  await p.waitForTimeout(250);
  check('BARRY bubbles his cycle near the demo-day sign', await whiteBubble() > 250);
  await p.evaluate(() => { hearts = 1; player.hurtT = 0; enemies.push(makeEnemy({x: player.x + 8, t: 'g'})); });
  await p.waitForTimeout(1400);
  await p.click('#bRe');
  await p.waitForTimeout(400);
  const barry = await p.evaluate(() => barrySawIt);
  check("BARRY saw you die there (next line queued: '...OK MAYBE NOT LIKE THAT')", barry === true);
  await p.evaluate(() => { player.x = 4280; player.y = GROUND_Y - 40; cam = 4160; player.hurtT = 240; });
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.resolve(__dirname, 'overnight', 'celeb-barry-sawit.png') });

  // ROCKET: ascent frames put white+red pixels above the skyline at the anchor
  const rocketSeen = await p.evaluate(() => {
    // jump the sim to the start of a launch window deterministically? frame is
    // read-only in spirit — instead just report whether we're in a window and
    // where the anchor sits; the screenshot is the visual proof
    return { rt: frame % 2700, sx: Math.round(ROCKET_ANCHOR - cam * 0.5) };
  });
  await p.evaluate(() => { player.x = 6000; cam = 5900; player.hurtT = 240; });
  // wait for an ascent window (max ~45s of sim — poll cheaply)
  let inWindow = false;
  for (let i = 0; i < 200; i++){
    const rt = await p.evaluate(() => frame % 2700);
    if (rt > 10 && rt < 180){ inWindow = true; break; }
    await p.waitForTimeout(250);
  }
  check('rocket launch window reachable', inWindow, JSON.stringify(rocketSeen));
  await p.screenshot({ path: path.resolve(__dirname, 'overnight', 'celeb-rocket.png') });

  // WITNESSED HISTORY: must be standing still BEFORE liftoff — wait for the
  // countdown (rt wrapping toward 2700), then hold still through the whole ascent.
  // Hardened 2026-07-14 (seed-195 flake, baseline reproduced pre-diff): daily
  // layouts can patrol a scooter pack into x6050 during the multi-cycle wait and
  // burn ticks can drain the staged hearts — re-stage the scene every hop and
  // retry across up to 3 launch cycles. The game's witness code path is untouched.
  const stage = () => p.evaluate(() => { hearts = 5;
    bosses.forEach(bb => { bb.dead = true; bb.active = false; }); // Barry's block revived them — a live Platform wall yanks teleports into its arena
    enemies.forEach(e => { if (e.x > 5500 && e.x < 7200) e.dead = true; }); });
  let eggGot = false;
  for (let attempt = 0; attempt < 3 && !eggGot; attempt++){
    await p.evaluate(() => { if (state === 3) resumePlay(true); // an earlier leg can leave a corpse (seed-195 trace: st=3 through all attempts) — the gate only ticks in PLAY
                             witnessStill = 0; witnessed = false; player.hurtT = 60;
                             player.x = 6050; player.y = GROUND_Y - 40; player.vx = 0; cam = 5950; });
    await stage();
    for (let i = 0; i < 400; i++){
      const rt = await p.evaluate(() => frame % 2700);
      if (rt > 2580) break;             // T-minus ~2s
      // fidget IN PLACE with hops — walking drifts you into the Platform arena
      // (verified: it killed an earlier probe), and standing still burns runway
      await p.keyboard.down('Space'); await p.waitForTimeout(90); await p.keyboard.up('Space');
      await stage();
      await p.waitForTimeout(1100);
    }
    await p.evaluate(() => { player.vx = 0; player.hurtT = 0; });
    await stage();
    // stand dead still and POLL through the ascent — a blind sleep drifts with
    // wall-clock jitter and can slide the still-window past frame 220 (the
    // 2026-07-14 flake); polling exits the moment the egg lands
    eggGot = await p.evaluate(async () => {
      for (let t = 0; t < 560; t++){
        await new Promise(r => setTimeout(r, 16));
        if (witnessed) return true;
      }
      return witnessed;
    });
  }
  check('WITNESSED HISTORY +$0K for standing dead still through a launch', eggGot === true);

  // ---- THE KILL SWITCH, EXERCISED OFF (canon rule 3: "one const kills them all") ----
  // Nothing ever loaded a RISKY_CAMEOS=false build before — a celeb drawn outside
  // the gate would have passed every check. Load a flipped copy and require the
  // TEAL spot to render NO bubble and NO errors.
  const srcHtml = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
  check('kill-switch const present in source', /const RISKY_CAMEOS = (true|false);/.test(srcHtml));
  const offPath = path.join(os.tmpdir(), 'fm-riskyoff.html');
  fs.writeFileSync(offPath, srcHtml.replace(/const RISKY_CAMEOS = (true|false);/, 'const RISKY_CAMEOS = false;'));
  const p2 = await b.newPage({ viewport: { width: 960, height: 540 } });
  const errors2 = [];
  p2.on('pageerror', e => errors2.push(e.message));
  await p2.goto('file://' + offPath);
  await p2.waitForTimeout(700);
  await p2.keyboard.down('Space'); await p2.waitForTimeout(200); await p2.keyboard.up('Space');
  await p2.waitForTimeout(300);
  await p2.evaluate(() => { bosses.forEach(bb => bb.dead = true); player.x = 7080; player.y = GROUND_Y - 40; cam = 6900; player.hurtT = 240; });
  await p2.waitForTimeout(300);
  const offBubble = await p2.evaluate(() => {
    const d = cx.getImageData(0, 150, 480, 70).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] > 245 && d[i+1] > 245 && d[i+2] > 245) n++;
    return n;
  });
  // comparative, not absolute: the band has baseline whites (billboards, clouds
  // — measured ~320) that a fixed cap misreads. The celebs contribute ~1600px;
  // the OFF build must sit near baseline, far under the ON reading.
  check('RISKY_CAMEOS=false: TEAL spot near baseline (kill switch verified)',
    offBubble < 600 && offBubble < tealOn / 2, `off=${offBubble} vs on=${tealOn} white px`);
  check('RISKY_CAMEOS=false build boots with zero page errors', errors2.length === 0, errors2.join(' | '));
  await p2.close();
  try { fs.unlinkSync(offPath); } catch(e){}

  check('zero page errors', errors.length === 0, errors.join(' | '));
  console.log(fails === 0 ? 'ALL CELEB CHECKS PASS' : `${fails} CELEB CHECK(S) FAILED`);
  await b.close();
  process.exit(fails ? 1 : 0);
})();
