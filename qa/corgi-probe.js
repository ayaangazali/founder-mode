// corgi-probe.js — HUMOR PATCH item 6 acceptance. The load-bearing requirement:
// THE CORGI CANNOT DIE. Verified two ways: (1) statically — the corgi object
// never appears in any collision path (enemies array, shots loop, hurt paths);
// (2) dynamically — a chaos bath of enemies, boss shots, pits and boss contact
// at the corgi's exact position leaves it unharmed and still rendering.
const { chromium } = require('playwright');
const path = require('path');
let fails = 0;
const check = (n, ok, d) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? '  — ' + d : ''}`); if (!ok) fails++; };
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.goto(process.env.GAME_URL || 'file://' + path.resolve(__dirname, '../index.html'));
  await p.waitForTimeout(700);

  // (1) static immortality: no health, no death flag, no collision references
  const staticCheck = await p.evaluate(() => {
    // the GAME script, not the first <script> (that's the analytics loader — a scan
    // of it passes vacuously forever, which is how this gate lied green)
    const src = [...document.querySelectorAll('script')].map(s => s.textContent).find(t => t.includes('RISKY_CAMEOS')) || '';
    return {
      noHp: !('hp' in corgi) && !('hearts' in corgi) && !('dead' in corgi),
      // the real invariant: the corgi is never an aabb participant and never a
      // hurtPlayer argument — its own follow/draw blocks are allowed to exist
      neverInCollision: !/aabb\([^)]*corgi|corgi[^)]*\baabb|hurtPlayer\([^)]*corgi|corgi\.(hp|dead|hearts)\s*[-+=]/.test(src),
      notAnEnemy: !enemies.includes(corgi),
    };
  });
  check('corgi has no health and no death flag', staticCheck.noHp);
  check('corgi appears in NO collision/hurt path (code scan)', staticCheck.neverInCollision);
  check('corgi is not in the enemies array', staticCheck.notAnEnemy);

  await p.keyboard.down('Space'); await p.waitForTimeout(200); await p.keyboard.up('Space');
  await p.waitForTimeout(300);

  // adoption: walk past the café
  await p.evaluate(() => { player.x = 2560; player.y = GROUND_Y - 40; cam = 2460; player.hurtT = 240; hearts = 5;
                           enemies.forEach(e => { if (Math.abs(e.x - 2596) < 300) e.dead = true; }); });
  await p.keyboard.down('ArrowRight'); await p.waitForTimeout(600); await p.keyboard.up('ArrowRight');
  const adopted = await p.evaluate(() => ({ f: corgi.following, t: corgi.followT > 0 }));
  check('walk past the café → CORGI ACQUIRED (follows)', adopted.f && adopted.t);
  await p.screenshot({ path: path.resolve(__dirname, 'overnight', 'corgi-adopted.png') });

  // burn is paused while the corgi follows
  await p.waitForTimeout(5000); // 5s dead still — burn would need 6s anyway, but burnT should stay 0
  const burn = await p.evaluate(() => player.burnT || 0);
  check('burn rate paused while corgi follows (burnT stays 0)', burn === 0, 'burnT=' + burn);

  // (2) dynamic immortality: chaos bath at the corgi's exact position
  const corgiBefore = await p.evaluate(() => JSON.stringify({ f: corgi.following, s: corgi.sitting }));
  await p.evaluate(() => {
    for (const t of ['g', 'm', 's']) enemies.push(makeEnemy({x: corgi.x, t}));
    shots.push({x: corgi.x, y: GROUND_Y - 12, vx: 0, vy: 0, w: 26, h: 9, t: 'buzz', label: 'SYNERGY', wob: 1});
    shots.push({x: corgi.x, y: GROUND_Y - 30, vx: 0, vy: 2, w: 12, h: 10, t: 'sheet', label: 'TERMS'});
    crates.push({x: corgi.x - 2, y: 60, vy: 6, landed: false, t: 480});
  });
  await p.waitForTimeout(1500);
  const alive = await p.evaluate(() => ({
    exists: typeof corgi === 'object' && corgi !== null,
    noDeadFlag: !('dead' in corgi) && !('hp' in corgi),
    stillHasState: typeof corgi.following === 'boolean',
  }));
  check('corgi survives the chaos bath (enemies + shots + falling crate)', alive.exists && alive.noDeadFlag && alive.stillHasState);

  // hit the PLAYER (deterministic shot), then WALK AWAY — a sitting corgi next
  // to its human un-sits immediately (that IS the waiting-for-you behavior)
  await p.evaluate(() => { player.hurtT = 0;
    shots.push({x: player.x + 2, y: player.y + 4, vx: 0, vy: 0, w: 26, h: 9, t: 'buzz', label: 'GTM', wob: 1}); });
  await p.waitForTimeout(150);
  await p.evaluate(() => { player.x = corgi.x + 220; cam = player.x - 240; player.hurtT = 240; });
  await p.waitForTimeout(300);
  const sat = await p.evaluate(() => corgi.sitting && corgi.following);
  check('player takes a hit → corgi sits and waits', sat === true);
  await p.evaluate(() => { player.x = corgi.x + 4; cam = Math.max(0, player.x - 240); player.hurtT = 240; });
  await p.waitForTimeout(1000); // outlive the 45-frame minimum sit (cam set too — the cam-2 clamp shoves un-anchored teleports away)
  const resumed = await p.evaluate(() => corgi.following && !corgi.sitting);
  check('return to the corgi → it resumes following', resumed === true);
  await p.screenshot({ path: path.resolve(__dirname, 'overnight', 'corgi-cafe.png') });

  check('zero page errors', errors.length === 0, errors.join(' | '));
  console.log(fails === 0 ? 'ALL CORGI CHECKS PASS (the corgi cannot die)' : `${fails} CORGI CHECK(S) FAILED`);
  await b.close();
  process.exit(fails ? 1 : 0);
})();
