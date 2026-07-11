// fullrun.js — human-like full playthrough bot (acceptance gate items 1/2).
// Real keyboard events + real button clicks only. Game state is READ as the
// bot's eyes; nothing is ever written into the page. Title → SOMA → MISSION →
// SAND HILL (Chad Capital) → THE CLOUD (SYNERGY.AI) → IPO bell → badge.
//
//   node test/fullrun.js            clean-ish run (may die like a human; ≤3
//                                   recoveries via the real PIVOT button)
//   node test/fullrun.js --quiet    same, no screenshots
//   node test/fullrun.js --casual   TOURIST profile: reads signs (pauses), tries
//                                   the coin platforms, hesitates at arenas,
//                                   fights sloppier, and dies ONCE deliberately
//                                   at the VC arena to prove checkpoint + haircut.
//                                   This is the "normal completed run" the
//                                   MASTER-PLAN §2.1 3–6 minute band describes.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CASUAL = process.argv.includes('--casual');
const QUIET = process.argv.includes('--quiet');
const SHOTDIR = path.resolve(__dirname, '../qa/overnight');
const TAG = CASUAL ? 'casual' : 'clean';

// world knowledge mirrored from LEVEL DATA (the bot's map, not access) — v1.0 world
// (adjacent CV/Sand-Hill segs merged at 5656: no pit there, no false lip stops)
const SEGS = [[0,780],[822,1420],[1468,2350],[2402,2980],[3036,3900],
              [3956,4420],[4480,4900],[4948,5320],[5372,6300],
              [6344,7150],[7204,8000],[8052,9200]];
const TICK = CASUAL ? 130 : 50;
const MAX_RECOVERIES = CASUAL ? 8 : 4; // tourists die — that's what checkpoints are for
                                       // (§2.1 budgeted 2 deaths across 4 zones; 5 denser zones earn 6)
// tourist behavior stops (casual mode): sign posts get read, coin platforms get
// attempted. Pauses stay ≤3s — always under the 4s minimum burn-rate tick.
const SIGN_STOPS = [70, 250, 640, 1040, 1500, 1930, 2120, 2720, 3050, 3958, 4340,
                    4450, 4640, 5062, 5270, 5690, 5880, 6000, 6180, 6350, 7032,
                    7210, 7380, 7490, 7690, 8260, 8400];
const COIN_DETOURS = [420, 1060, 2170, 2550, 3260, 4164, 4680, 5114, 5928, 7460, 7750];

async function snap(page, name){
  if (QUIET) return;
  fs.mkdirSync(SHOTDIR, { recursive: true });
  await page.screenshot({ path: path.join(SHOTDIR, name) });
}
const lipDist = x => {                      // distance from player x to the current seg's right lip
  for (const [a, b] of SEGS) if (x >= a - 2 && x <= b) return b - x;
  return 999;                               // airborne over a pit / respawning
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  await page.goto('file://' + path.resolve(__dirname, '../index.html'));
  await page.waitForTimeout(900);
  await snap(page, `${TAG}-title.png`);

  for (let tries = 0; tries < 5; tries++){
    await page.keyboard.down('Space'); await page.waitForTimeout(180); await page.keyboard.up('Space');
    await page.waitForTimeout(250);
    if (await page.evaluate(() => state) === 1) break;
  }
  if (await page.evaluate(() => state) !== 1){ console.log('FAIL: never left title'); process.exit(1); }

  const sense = () => page.evaluate(() => ({
    x: player.x, y: player.y, og: player.onGround,
    hearts, raised, state, playMs, zone: zoneName(player.x),
    bosses: bosses.map(b => ({ id: b.id, x: b.x, w: b.w, hp: b.hp,
                               active: b.active, dead: b.dead, trigger: b.trigger, wall: b.wall })),
    near: enemies.filter(e => !e.dead && e.x > player.x - 24 && e.x < player.x + 110)
                 .map(e => ({ x: e.x, y: e.y, t: e.t })),
    shotsNear: shots.filter(s2 => Math.abs(s2.x - player.x) < 70).length,
    bellDone,
  }));

  let right = false;
  const setRight = async on => { if (on !== right){ right = on; await page.keyboard[on ? 'down' : 'up']('ArrowRight'); } };
  const jump = async holdMs => { await page.keyboard.down('Space'); await page.waitForTimeout(holdMs); await page.keyboard.up('Space'); };

  const zonesShot = new Set(), bossShot = new Set(), hesitated = new Set();
  const signsRead = new Set(), detoursDone = new Set();
  let lastJump = 0, recoveries = 0, pitSetbacks = 0, prevX = 0;
  let diedOnPurpose = false, deathBadge = null, respawnInfo = null;
  const t0 = Date.now();
  const DEADLINE = 12 * 60 * 1000;

  while (Date.now() - t0 < DEADLINE){
    const s = await sense();

    if (s.state === 2) break;                                   // WIN

    if (s.state === 3){                                         // DEAD → real PIVOT click
      const planned = CASUAL && diedOnPurpose && !deathBadge;
      if (planned){
        deathBadge = await page.evaluate(() => ({
          uiShown: document.getElementById('ui').style.display === 'flex', raisedAtDeath: raised,
        }));
        await snap(page, 'casual-death-badge.png');
      } else {
        recoveries++;
        console.log(`  (death #${recoveries} at x=${Math.round(s.x)} ${s.zone} t=${Math.round(s.playMs/1000)}s — recovering via PIVOT)`);
        if (recoveries > MAX_RECOVERIES){
          console.log(`FAIL: ${recoveries} unplanned deaths (last at x=${Math.round(s.x)}, ${s.zone})`);
          await snap(page, `${TAG}-toomanydeaths.png`);
          await browser.close(); process.exit(1);
        }
      }
      await setRight(false);
      const preRetry = await page.evaluate(() => raised);
      await page.click('#bRe');
      await page.waitForTimeout(350);
      const r = await sense();
      if (planned){
        // respawn drops from y-40: landing on the enemy camping your corpse is a
        // legitimate stomp (+$10K on top of the exact 75% haircut)
        const exp = Math.floor(preRetry * 0.75);
        respawnInfo = { x: Math.round(r.x), hearts: r.hearts, raised: r.raised,
                        haircutOk: r.raised === exp || r.raised === exp + 10 };
      }
      continue;
    }

    if (s.x < prevX - 150) pitSetbacks++;                       // checkpoint snap-back = pit fall
    prevX = s.x;

    if (!zonesShot.has(s.zone) && s.og){
      zonesShot.add(s.zone);
      await snap(page, `${TAG}-zone-${s.zone.toLowerCase().replace(/ /g, '')}.png`);
    }

    const boss = s.bosses.find(b => b.active && !b.dead);
    if (boss){
      if (!bossShot.has(boss.id)){ bossShot.add(boss.id); await page.waitForTimeout(400); await snap(page, `${TAG}-boss-${boss.id}.png`); }

      if (CASUAL && !hesitated.has(boss.id)){                   // tourist: stop and read the boss
        hesitated.add(boss.id);
        await setRight(false);
        await page.waitForTimeout(2600);
      }

      if (CASUAL && boss.id === 'vc' && !diedOnPurpose){        // scripted: lose this fight on purpose
        diedOnPurpose = true;
        for (let i = 0; i < 500; i++){
          const d = await sense();
          if (d.state !== 1) break;
          const vc = d.bosses.find(b => b.id === 'vc');
          await setRight(vc.x > d.x + 6);                       // hug the boss, never jump
          await page.waitForTimeout(110);
        }
        continue;
      }

      // the proven fight style: keep drifting onto the boss and MASH short,
      // human-length jump presses — every landing on its head is an armed stomp,
      // and staying airborne beats standing next to a walking hitbox
      const dx = boss.x + boss.w / 2 - (s.x + 6);
      if (dx > 8) await setRight(true);
      else if (dx < -8){ await setRight(false); await page.keyboard.down('ArrowLeft'); await page.waitForTimeout(60); await page.keyboard.up('ArrowLeft'); }
      else await setRight(false);
      await page.keyboard.down('Space'); await page.waitForTimeout(CASUAL ? 150 : 100); await page.keyboard.up('Space');
      await page.waitForTimeout(CASUAL ? 300 : 130);
      continue;
    }

    // ---- traversal ----
    const d = lipDist(s.x + 12);                                // player right edge → lip
    if (s.og && d < 70){
      // pit protocol: brake, creep to the lip, full-arc jump from the edge
      await setRight(false);
      let creeps = 0;
      while (creeps++ < 60){
        const c = await page.evaluate(() => ({ x: player.x, og: player.onGround, state,
          danger: enemies.some(e => !e.dead && e.t !== 't' && e.y > 185 && Math.abs(e.x - player.x) < 50) }));
        if (c.state !== 1) break;
        if (!c.og) break;                                       // fell — respawn logic handles it
        const cd = lipDist(c.x + 12);
        if (cd > 70) break;                                     // moved past (respawned/knocked back)
        if (cd <= (CASUAL ? 9 : 6) || c.danger){                // lip reached — or something is
          await setRight(true);                                 // closing in: jump NOW, a wet landing
          await jump(380);                                      // costs a heart, a corpse costs a run
          await page.waitForTimeout(450);
          break;
        }
        await page.keyboard.down('ArrowRight'); await page.waitForTimeout(28); await page.keyboard.up('ArrowRight');
        right = false;
        await page.waitForTimeout(30);
      }
      continue;
    }

    // tourist stops: read the sign / try the coin platform overhead.
    // NEVER stop with a thought leader in drift range — THREAD bombs can't hit a
    // walker (they drop at your feet and you've left), but they execute loiterers.
    const flyerInDriftRange = s.near.some(e => e.t === 't');
    if (CASUAL && s.og && !flyerInDriftRange){
      const sign = SIGN_STOPS.find(sx => !signsRead.has(sx) && Math.abs(s.x - sx) < 26);
      if (sign !== undefined && !s.near.length){
        signsRead.add(sign);
        await setRight(false);
        await page.waitForTimeout(1400 + Math.random() * 1200); // reads the joke (< burn tick)
        continue;
      }
      const det = COIN_DETOURS.find(dx2 => !detoursDone.has(dx2) && Math.abs(s.x - dx2) < 30);
      if (det !== undefined && !s.near.length){
        detoursDone.add(det);
        await setRight(false);
        for (let h = 0; h < 3; h++){                            // hops for the coins overhead
          await jump(320);
          await page.waitForTimeout(620);
        }
        continue;
      }
    }

    await setRight(true);
    const now = Date.now();
    // hop only at GROUND-level threats; thought leaders hover above head height —
    // the correct play is to keep walking underneath them, never to jump into them.
    // And if a flyer IS overhead, don't hop at all: walk through and let the
    // i-frames absorb the gremlin — a heart is cheaper than the flyer sandwich.
    const flyerOverhead = s.near.some(e => e.t === 't' && Math.abs(e.x - s.x) < 60);
    const enemyAhead = s.near.some(e => e.t !== 't' && e.y > 185 && e.x > s.x - 4 && e.x - s.x < (CASUAL ? 46 : 85));
    if (s.og && enemyAhead && !flyerOverhead && d > 90 && now - lastJump > 300){
      lastJump = now; await jump(210);                          // stomp-or-clear hop
    }
    await page.waitForTimeout(TICK);
  }

  const end = await page.evaluate(() => ({
    state, bellDone, raised, endTime, playMs,
    badgeShown: document.getElementById('ui').style.display === 'flex',
    flairs: badgeFlairs(state === 2),
  }));
  await page.waitForTimeout(500);
  await snap(page, `${TAG}-win-badge.png`);

  const t = Math.round((end.endTime || end.playMs) / 1000);
  const mmss = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
  const ok = end.state === 2 && end.bellDone && end.badgeShown && errors.length === 0
             && (!CASUAL || (deathBadge && deathBadge.uiShown && respawnInfo && respawnInfo.haircutOk));

  console.log(JSON.stringify({
    result: ok ? 'PASS' : 'FAIL', mode: TAG,
    badgeTime: mmss, playMsSeconds: t, raised: end.raised, flairs: end.flairs,
    unplannedRecoveries: recoveries, pitSetbacks,
    signsRead: signsRead.size, coinDetours: detoursDone.size,
    zonesSeen: [...zonesShot], bossesFought: [...bossShot],
    casualDeath: deathBadge, casualRespawn: respawnInfo,
    errors,
  }, null, 2));
  await browser.close();
  process.exit(ok ? 0 : 1);
})();
