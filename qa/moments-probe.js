// moments-probe.js — HUMOR PATCH item 3 acceptance: bell-rope snap sequence,
// the posthumous CHAD.AI sign, and the FAILURE COACH summoning ritual.
const { chromium } = require('playwright');
const path = require('path');
let fails = 0;
const check = (n, ok, d) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? '  — ' + d : ''}`); if (!ok) fails++; };
(async () => {
  const b = await chromium.launch();

  // ---- bell rope snap: pull → fail; retreat → re-arm; pull → win ----
  {
    const p = await b.newPage({ viewport: { width: 960, height: 540 } });
    const errors = [];
    p.on('pageerror', e => errors.push(e.message));
    await p.goto('file://' + path.resolve(__dirname, '../index.html'));
    await p.waitForTimeout(700);
    await p.keyboard.down('Space'); await p.waitForTimeout(200); await p.keyboard.up('Space');
    await p.waitForTimeout(300);
    await p.evaluate(() => { bosses.forEach(bb => { bb.dead = true; }); player.x = 9080; player.y = 180; cam = 8720; });
    await p.keyboard.down('ArrowRight'); await p.waitForTimeout(1200); await p.keyboard.up('ArrowRight');
    const snap = await p.evaluate(() => ({ phase: bellPhase, state, bellDone }));
    check('first pull snaps the rope (no win)', snap.phase === 1 && snap.state === 1 && !snap.bellDone, JSON.stringify(snap));
    await p.screenshot({ path: path.resolve(__dirname, 'overnight', 'moment-ropesnap.png') });
    await p.keyboard.down('ArrowLeft'); await p.waitForTimeout(2000); await p.keyboard.up('ArrowLeft');
    const rearmed = await p.evaluate(() => bellPhase);
    check('retreat past 9060 re-rigs the rope', rearmed === 2);
    await p.keyboard.down('ArrowRight'); await p.waitForTimeout(1500); await p.keyboard.up('ArrowRight');
    const win = await p.evaluate(() => ({ state, bellDone }));
    check('second pull wins', win.state === 2 && win.bellDone, JSON.stringify(win));
    check('no page errors (bell block)', errors.length === 0, errors.join(' | '));
    await p.close();
  }

  // ---- CHAD.AI sign: absent while Chad lives, lit once he's dead ----
  {
    const p = await b.newPage({ viewport: { width: 960, height: 540 } });
    await p.goto('file://' + path.resolve(__dirname, '../index.html'));
    await p.waitForTimeout(700);
    await p.keyboard.down('Space'); await p.waitForTimeout(200); await p.keyboard.up('Space');
    await p.waitForTimeout(300);
    const cyan = () => p.evaluate(() => { // AI-blue glow pixels in the sign band at x≈6900
      // text renders on the crisp overlay since the hi-res text canvas landed —
      // scan BOTH surfaces (sprites on cx, glyphs on tcx)
      let n = 0;
      const d = cx.getImageData(0, 0, 480, 232).data;
      for (let i = 0; i < d.length; i += 4) if (d[i] < 150 && d[i+1] > 180 && d[i+2] > 220) n++;
      const d2 = tcx.getImageData(0, 0, tv.width, Math.round(232 * TS)).data;
      for (let i = 0; i < d2.length; i += 4) if (d2[i+3] > 60 && d2[i] < 150 && d2[i+1] > 180 && d2[i+2] > 220) n++;
      return n;
    });
    await p.evaluate(() => { bosses[0].dead = true; player.x = 6880; player.y = GROUND_Y - 40; cam = 6720; player.hurtT = 240; });
    await p.waitForTimeout(300);
    const before = await cyan();
    await p.evaluate(() => { bosses[1].dead = true; bosses[1].active = false; });
    await p.waitForTimeout(300);
    const after = await cyan();
    check('CHAD.AI sign lights up only after Chad dies', after > before + 60, `glow px ${before}→${after}`);
    await p.screenshot({ path: path.resolve(__dirname, 'overnight', 'moment-chadai.png') });
    await p.close();
  }

  // ---- FAILURE COACH: 3 deaths at the same spot summon him ----
  {
    const p = await b.newPage({ viewport: { width: 960, height: 540 } });
    const errors = [];
    p.on('pageerror', e => errors.push(e.message));
    await p.goto('file://' + path.resolve(__dirname, '../index.html'));
    await p.waitForTimeout(700);
    await p.keyboard.down('Space'); await p.waitForTimeout(200); await p.keyboard.up('Space');
    await p.waitForTimeout(300);
    for (let i = 0; i < 3; i++){
      await p.evaluate(() => { player.x = 600; hearts = 1; player.hurtT = 0; cam = 500;
                               enemies.push(makeEnemy({x: 604, t: 'g'})); });
      await p.waitForTimeout(1200);
      const st = await p.evaluate(() => state);
      if (st === 3){ await p.click('#bRe'); await p.waitForTimeout(350); }
    }
    const coach = await p.evaluate(() => ({ coachX, spots: deathSpots.length }));
    check('3 deaths at one spot summon the FAILURE COACH', coach.coachX !== null && Math.abs(coach.coachX - 600) < 90, JSON.stringify(coach));
    await p.evaluate(() => { player.x = coachX - 20; cam = coachX - 240; player.hurtT = 240; });
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.resolve(__dirname, 'overnight', 'moment-failurecoach.png') });
    check('no page errors (coach block)', errors.length === 0, errors.join(' | '));
    await p.close();
  }

  console.log(fails === 0 ? 'ALL MOMENT CHECKS PASS' : `${fails} MOMENT CHECK(S) FAILED`);
  await b.close();
  process.exit(fails ? 1 : 0);
})();
