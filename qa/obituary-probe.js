// obituary-probe.js — HUMOR PATCH item 1 acceptance:
// stages 6+ distinct death causes, screenshots each HYPERGROWTH DAILY front page
// into qa/overnight/, verifies the toggle + SAVE download, and checks the copy
// text carries the headline. Run: node qa/obituary-probe.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const GAME = process.env.GAME_URL || 'file://' + path.resolve(__dirname, '../index.html'); // GAME_URL=https://... runs the suite against a deployment
const SHOTDIR = path.resolve(__dirname, 'overnight');
let fails = 0;
const check = (n, ok, d) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? '  — ' + d : ''}`); if (!ok) fails++; };

// each stager arranges an honest death of that cause from a 1-heart state
const CAUSES = {
  gremlin:  () => { enemies.push(makeEnemy({x: player.x + 10, t: 'g'})); },
  meeting:  () => { enemies.push(makeEnemy({x: player.x + 10, t: 'm'})); },
  scooter:  () => { enemies.push(makeEnemy({x: player.x + 30, t: 's'})); },
  phantom:  () => { const e = makeEnemy({x: player.x + 14, t: 'c'}); e.y = player.y; enemies.push(e); },
  'VC terms': () => { shots.push({x: player.x + 20, y: player.y + 4, vx: -1.2, vy: 0, w: 12, h: 10, t: 'sheet', label: 'TERMS'}); },
  buzzword: () => { shots.push({x: player.x + 20, y: player.y + 4, vx: -1.2, vy: 0, w: 26, h: 9, t: 'buzz', label: 'ALIGNMENT', wob: 1}); },
  pit:      () => { player.x = 795; player.y = 250; player.vy = 6; cam = 700; }, // over the first pit, below ground line
  'sdk crate': () => { crates.push({ x: player.x - 2, y: player.y - 60, vy: 2, landed: false, t: 480 }); }, // breaking change, falling (shipped 07-14, was unprobed)
};

(async () => {
  fs.mkdirSync(SHOTDIR, { recursive: true });
  const browser = await chromium.launch();

  const seen = new Set();
  for (const [cause, stager] of Object.entries(CAUSES)){
    const ctx = await browser.newContext({ viewport: { width: 960, height: 540 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(GAME);
    await page.waitForTimeout(700);
    for (let i = 0; i < 5; i++){
      await page.keyboard.down('Space'); await page.waitForTimeout(180); await page.keyboard.up('Space');
      await page.waitForTimeout(250);
      if (await page.evaluate(() => state) === 1) break;
    }
    await page.evaluate(`hearts = 1; player.hurtT = 0; (${stager.toString()})();`);
    await page.waitForTimeout(1800);
    const r = await page.evaluate(() => ({
      state, cause: deathCause,
      imgShown: !!document.getElementById('endImg'),
      headlinePx: (() => { // headline present on the rendered front page?
        const img = document.getElementById('endImg');
        if (!img) return 0;
        const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
        const g = c.getContext('2d'); g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 120, 1200, 60).data; // headline band
        let ink = 0;
        for (let i = 0; i < d.length; i += 4) if (d[i] < 60 && d[i+1] < 60) ink++;
        return ink;
      })(),
    }));
    const ok = r.state === 3 && r.cause === cause && r.imgShown && r.headlinePx > 300;
    check(`death by ${cause} → obituary front page (cause recorded, headline inked)`,
          ok, `cause=${r.cause} inkPx=${r.headlinePx}${errors.length ? ' ERR:' + errors[0] : ''}`);
    if (ok) seen.add(cause);
    await page.screenshot({ path: path.join(SHOTDIR, `obit-${cause.replace(/ /g, '')}.png`) });
    await ctx.close();
  }
  check('>= 7 distinct causes rendered', seen.size >= 7, `${seen.size} causes`);

  // toggle + copy-text headline + SAVE on one final loss
  const ctx = await browser.newContext({ viewport: { width: 960, height: 540 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  // capture the REAL clipboard write: the rich (image+text) path is forced to
  // reject so the game falls back to writeText, which we record
  await page.addInitScript(() => {
    window.__copied = null;
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: t => { window.__copied = String(t); return Promise.resolve(); },
      write: () => Promise.reject(new Error('probe: force the text path')),
    }});
  });
  await page.goto(GAME);
  await page.waitForTimeout(700);
  await page.keyboard.down('Space'); await page.waitForTimeout(180); await page.keyboard.up('Space');
  await page.waitForTimeout(300);
  await page.evaluate(() => { hearts = 1; player.hurtT = 0; enemies.push(makeEnemy({x: player.x + 10, t: 'g'})); });
  await page.waitForTimeout(1500);
  const obitSrc = await page.evaluate(() => document.getElementById('endImg').src.length);
  await page.click('#bTg');
  const badgeSrc = await page.evaluate(() => ({ len: document.getElementById('endImg').src.length,
                                                label: document.getElementById('bTg').textContent }));
  check('toggle swaps to the classic badge and back-label updates',
        badgeSrc.len !== obitSrc && badgeSrc.label === 'view front page', badgeSrc.label);
  await page.click('#bTg'); // back to the front page
  const dl = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
  await page.click('#bDl');
  const download = await dl;
  let pngOk = false;
  if (download){
    const pth = path.join(SHOTDIR, 'obit-saved-frontpage.png');
    await download.saveAs(pth);
    const buf = fs.readFileSync(pth);
    pngOk = buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) && buf.length > 30000;
  }
  check('SAVE FRONT PAGE downloads a real PNG', pngOk, download ? download.suggestedFilename() : 'no download');
  // the REAL surface text, read from the actual clipboard write the SAVE click
  // performed (the previous check rebuilt the string itself and compared it to
  // itself — it could never fail; this one reads what a player would paste)
  const copied = await page.evaluate(() => ({ t: window.__copied, h: obitHeadline(false) }));
  check('share copy (real clipboard write) carries the headline + game link',
    !!copied.t && copied.t.includes(copied.h) && copied.h.length > 10 && copied.t.includes('https://sfspeedrun.com'),
    copied.t ? copied.t.slice(0, 70) : 'nothing captured');
  check('zero page errors (toggle/save block)', errors.length === 0, errors.join(' | '));
  await ctx.close();

  console.log(fails === 0 ? 'ALL OBITUARY CHECKS PASS' : `${fails} OBITUARY CHECK(S) FAILED`);
  await browser.close();
  process.exit(fails === 0 ? 0 : 1);
})();
