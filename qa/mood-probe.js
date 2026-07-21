// mood-probe.js — HUMOR PATCH item 2 acceptance: instant flips, playMs decay,
// deranged tier, and IT'S SO OVER on the death frame.
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
  await p.keyboard.down('Space'); await p.waitForTimeout(180); await p.keyboard.up('Space');
  await p.waitForTimeout(300);

  check('spawn mood = heads down building', await p.evaluate(() => moodTier) === 2);

  // hit → instant IT'S SO OVER (a buzz shot: clean one-frame hit, no corpse to
  // revenge-stomp — a spawned gremlin gets stomped by the knockback arc and
  // flips the mood right back up, which is the feature working, not a bug)
  await p.evaluate(() => { player.hurtT = 0; shots.push({x: player.x + 4, y: player.y + 4, vx: 0, vy: 0, w: 26, h: 9, t: 'buzz', label: 'GTM', wob: 1}); });
  await p.waitForTimeout(250);
  check("hit → IT'S SO OVER instantly", await p.evaluate(() => moodTier) === 0);

  // one coin after the beatdown → WE'RE SO BACK instantly
  await p.evaluate(() => { enemies.forEach(e => e.dead = true); player.hurtT = 200;
                           coins.push({x: player.x + 2, y: player.y + 2, w: 8, h: 10, got: false}); });
  await p.waitForTimeout(300);
  check("one coin → WE'RE SO BACK instantly", await p.evaluate(() => moodTier) === 3);

  // decay back toward the middle on the simulated clock
  await p.waitForTimeout(3200);
  check('decays toward heads down building (playMs)', await p.evaluate(() => moodTier) === 2, 'tier=' + await p.evaluate(() => moodTier));

  // deranged: SO BACK + coffee + 10s flawless
  await p.evaluate(() => { moodTier = 3; moodChangedAt = playMs; lastHitAt = playMs - 11000; player.coffeeT = 300; });
  await p.waitForTimeout(200);
  check('coffee + flawless 10s → deranged tier', await p.evaluate(() => moodTier) === 4);

  // death frame: meter reads IT'S SO OVER and still draws behind the obituary
  await p.evaluate(() => { hearts = 1; player.hurtT = 0; player.coffeeT = 0; enemies.push(makeEnemy({x: player.x + 8, t: 'g'})); });
  await p.waitForTimeout(1500);
  const dead = await p.evaluate(() => ({ state, moodTier }));
  check("death frame shows IT'S SO OVER", dead.state === 3 && dead.moodTier === 0, JSON.stringify(dead));
  await p.screenshot({ path: path.resolve(__dirname, 'overnight', 'mood-death-frame.png') });

  check('zero page errors', errors.length === 0, errors.join(' | '));
  console.log(fails === 0 ? 'ALL MOOD CHECKS PASS' : `${fails} MOOD CHECK(S) FAILED`);
  await b.close();
  process.exit(fails ? 1 : 0);
})();
