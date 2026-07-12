// overnight-paths.js — every non-traversal path, evaluate-driven where scripted
// play is impractical (acceptance gate item 3). Read-heavy; state writes only to
// stage scenarios the fullrun bots can't reach quickly (forced clock, forced kills).
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const GAME = 'file://' + path.resolve(__dirname, '../index.html');
const SHOTDIR = path.resolve(__dirname, 'overnight');
let fails = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
  if (!ok) fails++;
};

async function fresh(browser, opts = {}){
  const ctx = await browser.newContext({ viewport: { width: 960, height: 540 }, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(GAME);
  await page.waitForTimeout(700);
  return { ctx, page, errors };
}
async function start(page){
  for (let i = 0; i < 5; i++){
    await page.keyboard.down('Space'); await page.waitForTimeout(180); await page.keyboard.up('Space');
    await page.waitForTimeout(250);
    if (await page.evaluate(() => state) === 1) return true;
  }
  return false;
}

(async () => {
  fs.mkdirSync(SHOTDIR, { recursive: true });
  const browser = await chromium.launch();

  // ---------- death badge → PIVOT haircut → checkpoint; then R-restart paths ----------
  {
    const { ctx, page, errors } = await fresh(browser);
    await start(page);
    // stage the honest late-game state: Platform + Chad already beaten (their walls
    // would otherwise reclaim a cheat-teleported player on respawn — unreachable live)
    await page.evaluate(() => { bosses[0].dead = true; bosses[1].dead = true; raised = 400; player.x = 8300;
                                checkpoint = 7240; hearts = 1; player.hurtT = 0; enemies.push(makeEnemy({x: 8310, t: 'g'})); });
    await page.waitForTimeout(1200);
    const dead = await page.evaluate(() => ({ state, ui: document.getElementById('ui').style.display }));
    check('death → OUT OF RUNWAY end screen', dead.state === 3 && dead.ui === 'flex');
    await page.click('#bRe'); // PIVOT (RETRY)
    await page.waitForTimeout(350);
    const r = await page.evaluate(() => ({ x: player.x, hearts, raised, state,
                                           aiBack: !bosses[1].dead && !bosses[1].active }));
    check('PIVOT respawns at checkpoint 7240 with 3 hearts', r.state === 1 && Math.abs(r.x - 7240) < 5 && r.hearts === 3, `x=${Math.round(r.x)}`);
    check('BRIDGE ROUND haircut −25% (400→300)', r.raised === 300, `raised=${r.raised}`);
    // R from DEAD = checkpoint retry too (haircut asserted against the exact
    // raised value frozen on the death screen — stray stomps don't matter)
    await page.evaluate(() => { hearts = 1; raised = 100; player.hurtT = 0; enemies.push(makeEnemy({x: player.x + 10, t: 'g'})); });
    await page.waitForTimeout(1200);
    const atDeath = await page.evaluate(() => ({ state, raised }));
    await page.keyboard.press('r');
    await page.waitForTimeout(350);
    const r2 = await page.evaluate(() => ({ state, x: player.x, raised }));
    // respawn falls from y-40 — landing on the enemy that camped your corpse is a
    // legitimate stomp (+$10K), so the haircut check accepts exp or exp+10
    const exp = Math.floor(atDeath.raised * 0.75);
    check('R from DEAD retries from checkpoint with haircut',
          atDeath.state === 3 && r2.state === 1 && Math.abs(r2.x - 7240) < 5
          && (r2.raised === exp || r2.raised === exp + 10),
          `x=${Math.round(r2.x)} raised ${atDeath.raised}→${r2.raised}`);
    check('no page errors (death/retry block)', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // ---------- WIN → R is a FRESH run (no haircut carryover) ----------
  {
    const { ctx, page, errors } = await fresh(browser);
    await start(page);
    await page.evaluate(() => { bosses.forEach(b => { b.dead = true; }); raised = 500; player.x = 9095; });
    // walk in, ceremony arms, mash R, confetti, win
    await page.keyboard.down('ArrowRight'); await page.waitForTimeout(900); await page.keyboard.up('ArrowRight');
    for (let i = 0; i < 12; i++){ await page.keyboard.down('r'); await page.waitForTimeout(60); await page.keyboard.up('r'); await page.waitForTimeout(70); }
    await page.waitForTimeout(2400);
    const w = await page.evaluate(() => ({ state, bellDone, raised }));
    check('bell → mash ceremony → WIN + $1M bell bonus', w.state === 2 && w.bellDone && w.raised === 1500, `raised=${w.raised}`);
    await page.keyboard.press('r');
    await page.waitForTimeout(350);
    const fresh2 = await page.evaluate(() => ({ state, x: player.x, raised, hearts }));
    check('R from WIN = fresh run at x=20', fresh2.state === 1 && Math.round(fresh2.x) === 20 && fresh2.raised === 0, `x=${Math.round(fresh2.x)}`);
    check('no page errors (win/restart block)', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // ---------- eggs: ZERO CHURN + T2D3 + no-flair control ----------
  {
    const { ctx, page, errors } = await fresh(browser);
    await start(page);
    // ZERO CHURN via a real 20th-kill style finish: mark all but stage the last stomp… (forced kills, per gate)
    const flairBoth = await page.evaluate(() => {
      enemies.forEach(e => e.dead = true);
      bosses.forEach(b => { b.dead = true; });
      playMs = 150000; endTime = 0; player.x = 9095;
      return true;
    });
    void flairBoth;
    await page.keyboard.down('ArrowRight'); await page.waitForTimeout(700); await page.keyboard.up('ArrowRight');
    const f1 = await page.evaluate(() => badgeFlairs(true));
    check('ZERO CHURN + T2D3 flairs on a fast full-clear win', f1.includes('ZERO CHURN') && f1.includes('T2D3'), f1.join('·'));
    await page.screenshot({ path: path.join(SHOTDIR, 'paths-badge-bothflairs.png') });
    await ctx.close();
    check('no page errors (flairs block)', errors.length === 0, errors.join(' | '));
  }
  {
    const { ctx, page, errors } = await fresh(browser);
    await start(page);
    await page.evaluate(() => { // slow win with one survivor → NO flairs
      enemies.forEach((e, i) => e.dead = i !== 0);
      bosses.forEach(b => { b.dead = true; });
      playMs = 200000; endTime = 0; player.x = 9095;
    });
    await page.keyboard.down('ArrowRight'); await page.waitForTimeout(700); await page.keyboard.up('ArrowRight');
    const f2 = await page.evaluate(() => badgeFlairs(true));
    check('no flair on slow win with a survivor (control)', f2.length === 0, JSON.stringify(f2));
    check('no page errors (control block)', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // ---------- egg: THE REVERSE PITCH (idleT-driven title deck) ----------
  {
    const { ctx, page, errors } = await fresh(browser);
    const white = () => page.evaluate(() => {
      const d = cx.getImageData(0, 155, 480, 22).data; // bubble band above the title founder
      let n = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i] > 240 && d[i+1] > 240 && d[i+2] > 240) n++;
      return n;
    });
    const before = await white();
    await page.evaluate(() => { idleT = 3610; });
    await page.waitForTimeout(300);
    const during = await white();
    await page.screenshot({ path: path.join(SHOTDIR, 'paths-reversepitch.png') });
    await page.keyboard.press('ArrowDown'); // any input cancels; ArrowDown never starts the game
    await page.waitForTimeout(200);
    const after = await white();
    const st = await page.evaluate(() => state);
    check('REVERSE PITCH bubble appears at idleT>3600 and input cancels it',
          during > before + 200 && after < during - 200 && st === 0, `white px ${before}→${during}→${after}`);
    check('no page errors (reverse pitch block)', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // ---------- customization: C/H/V cycle, persistence, badge carries the look ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 960, height: 540 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(GAME);
    await page.waitForTimeout(700);
    await page.keyboard.press('c'); await page.keyboard.press('c');           // tone 1→3 (idx 2)
    await page.keyboard.press('h');                                           // hair 0→1 (BUZZ)
    await page.keyboard.press('v'); await page.keyboard.press('v');           // hoodie 0→2 (GRAPE)
    await page.waitForTimeout(150);
    const look1 = await page.evaluate(() => JSON.stringify(look));
    const st = await page.evaluate(() => state);
    check('C/H/V cycle on title without starting the game', look1 === '{"s":3,"h":1,"v":2}' && st === 0, look1);
    await page.reload(); await page.waitForTimeout(700);
    const look2 = await page.evaluate(() => JSON.stringify(look));
    check('look persists across reload (localStorage fm_look)', look2 === look1, look2);
    await start(page);
    // the WIN badge celebrates with the accel glow (yc=won overrides the hoodie),
    // so the look check lives on the LOSS badge — same as the CHANGELOG's probe
    await page.evaluate(() => { hearts = 1; player.hurtT = 0; enemies.push(makeEnemy({x: player.x + 12, t: 'g'})); });
    await page.waitForTimeout(1400);
    const badgePx = await page.evaluate(() => {
      const img = document.querySelector('#uicard img');
      const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let grape = 0; // GRAPE hoodie #a281e6
      for (let i = 0; i < d.length; i += 4)
        if (Math.abs(d[i] - 0xa2) < 12 && Math.abs(d[i+1] - 0x81) < 12 && Math.abs(d[i+2] - 0xe6) < 12) grape++;
      return grape;
    });
    check('loss badge founder wears the chosen GRAPE hoodie', badgePx > 500, `${badgePx} grape px`);
    await page.screenshot({ path: path.join(SHOTDIR, 'paths-badge-customlook.png') });
    check('no page errors (customization block)', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // ---------- SAVE BADGE downloads a real PNG ----------
  {
    const { ctx, page, errors } = await fresh(browser);
    await start(page);
    await page.evaluate(() => { hearts = 1; player.hurtT = 0; enemies.push(makeEnemy({x: player.x + 12, t: 'g'})); });
    await page.waitForTimeout(1200);
    const dl = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
    await page.click('#bDl');
    const download = await dl;
    let pngOk = false, size = 0;
    if (download){
      const p = path.join(SHOTDIR, 'paths-saved-badge.png');
      await download.saveAs(p);
      const buf = fs.readFileSync(p);
      size = buf.length;
      pngOk = buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    }
    check('SAVE BADGE downloads a real PNG', pngOk && size > 20000, `${size} bytes`);
    check('no page errors (save block)', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // ---------- COPY: clipboard path + no-clipboard fallback ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 960, height: 540 },
                                           permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(GAME); await page.waitForTimeout(700);
    await start(page);
    await page.evaluate(() => { hearts = 1; player.hurtT = 0; enemies.push(makeEnemy({x: player.x + 12, t: 'g'})); });
    await page.waitForTimeout(1200);
    await page.click('#bCp');
    await page.waitForTimeout(600);
    const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
    const msg = await page.evaluate(() => document.getElementById('cpMsg').textContent);
    const liveUrl = await page.evaluate(() => GAME_URL); // read, never hardcode — the canonical host moved once already
    check('COPY puts the post on the clipboard (ends with GAME_URL)',
          (clip.includes('FOUNDER MODE') || clip.includes('Hypergrowth Daily')) // loss default = the obituary post
          && clip.trim().endsWith(liveUrl), msg);
    check('no page errors (copy block)', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }
  {
    const { ctx, page, errors } = await fresh(browser);
    await page.addInitScript(() => { /* placeholder — clipboard nuked after load below */ });
    await start(page);
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
      hearts = 1; player.hurtT = 0; enemies.push(makeEnemy({x: player.x + 12, t: 'g'}));
    });
    await page.waitForTimeout(1200);
    await page.click('#bCp');
    await page.waitForTimeout(500);
    const fb = await page.evaluate(() => ({
      msg: document.getElementById('cpMsg').textContent,
      ta: !!document.querySelector('#cpMsg textarea'),
    }));
    check('COPY without navigator.clipboard → graceful fallback, no crash',
          errors.length === 0 && (fb.msg.includes('copied') || fb.ta), JSON.stringify(fb));
    await ctx.close();
  }

  console.log(fails === 0 ? 'ALL PATH CHECKS PASS' : `${fails} PATH CHECK(S) FAILED`);
  await browser.close();
  process.exit(fails === 0 ? 0 : 1);
})();
