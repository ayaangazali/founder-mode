// overnight-mobile.js — mobile pass (acceptance gate item 4):
// 667x375 landscape + 390x664 portrait touch viewports. Touch d-pad moves the
// player, end-screen buttons are hittable AFTER badge decode (elementFromPoint),
// portrait shows the dismissible rotate prompt and the game stays playable.
const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');

const GAME = 'file://' + path.resolve(__dirname, '../index.html');
const SHOTDIR = path.resolve(__dirname, 'overnight');
let fails = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
  if (!ok) fails++;
};

async function touchCtx(browser, w, h){
  const ctx = await browser.newContext({
    viewport: { width: w, height: h }, hasTouch: true, isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(GAME);
  await page.waitForTimeout(800);
  return { ctx, page, errors };
}
const tapXY = async (page, x, y) => { await page.touchscreen.tap(x, y); };

(async () => {
  fs.mkdirSync(SHOTDIR, { recursive: true });
  const browser = await chromium.launch();

  // ---------------- 667x375 landscape ----------------
  {
    const { ctx, page, errors } = await touchCtx(browser, 667, 375);
    // title-redesign: the d-pad is hidden on the title by design; it must appear at game start
    const touchOnTitle = await page.evaluate(() => document.getElementById('touch').style.display);
    check('667x375: touch overlay hidden on the redesigned title', touchOnTitle === 'none', 'display=' + touchOnTitle);
    const tj = await page.evaluate(() => {
      const s = getComputedStyle(document.getElementById('tJ'));
      return `${s.width}/${s.height}/${s.borderRadius}`;
    });
    check('667x375: #tJ jump button is the big 86px circle', tj === '86px/86px/50%', tj);

    await tapXY(page, 333, 120);                       // tap canvas (upper half — lower half opens CUSTOMIZE since the redesign) to start
    await page.waitForTimeout(400);
    check('667x375: tap starts the game', await page.evaluate(() => state) === 1);
    const touchInPlay = await page.evaluate(() => getComputedStyle(document.getElementById('touch')).display);
    check('667x375: touch overlay shown once the run starts', touchInPlay === 'block', 'display=' + touchInPlay);

    // hold the ▶ button region → player moves right
    const x0 = await page.evaluate(() => player.x);
    const rRect = await page.evaluate(() => { const r = document.getElementById('tR').getBoundingClientRect(); return { x: r.x + r.width/2, y: r.y + r.height/2 }; });
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: rRect.x, y: rRect.y }] });
    await page.waitForTimeout(900);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    const x1 = await page.evaluate(() => player.x);
    check('667x375: holding ▶ moves the player right', x1 - x0 > 40, `+${Math.round(x1 - x0)}px`);
    await page.screenshot({ path: path.join(SHOTDIR, 'mobile-667x375-play.png') });

    // pause: ⏸ opens the menu; a tap on the backdrop resumes (the chip sits
    // under the backdrop and could never be re-tapped — owner-visible fix)
    const pRect = await page.evaluate(() => { const r = document.getElementById('tP').getBoundingClientRect(); return { x: r.x + r.width/2, y: r.y + r.height/2 }; });
    await tapXY(page, pRect.x, pRect.y); await page.waitForTimeout(250);
    check('667x375: ⏸ opens the pause menu', await page.evaluate(() => paused && getComputedStyle(document.getElementById('pauseMenu')).display === 'flex'));
    await tapXY(page, 60, 60); await page.waitForTimeout(250); // backdrop, off the card
    check('667x375: backdrop tap resumes', await page.evaluate(() => paused === false));

    // end screen: force a death, then hit-test the buttons after image decode
    await page.evaluate(() => { hearts = 1; player.hurtT = 0; enemies.push(makeEnemy({x: player.x + 12, t: 'g'})); });
    await page.waitForTimeout(1400);
    check('667x375: death reaches end screen', await page.evaluate(() => state) === 3);
    await page.evaluate(() => new Promise(res => {
      const img = document.querySelector('#uicard img');
      if (!img || img.complete) return res(0); img.onload = () => res(1);
    }));
    const hit = await page.evaluate(() => {
      const ids = ['bRe', 'bDl'];
      return ids.map(id => {
        const el = document.getElementById(id);
        if (!el) return id + ':missing';
        const r = el.getBoundingClientRect();
        const at = document.elementFromPoint(r.x + r.width/2, r.y + r.height/2);
        return id + ':' + (at === el || el.contains(at) ? 'ok' : 'blocked-by-' + (at ? at.id || at.tagName : 'null'));
      }).join(' ');
    });
    check('667x375: end-screen buttons hittable after badge decode', !hit.includes('blocked') && !hit.includes('missing'), hit);
    const touchAfter = await page.evaluate(() => document.getElementById('touch').style.display);
    check('667x375: d-pad hidden behind end screen', touchAfter === 'none');
    await page.screenshot({ path: path.join(SHOTDIR, 'mobile-667x375-endscreen.png') });

    // 🏠 TITLE SCREEN: since the title-redesign the d-pad is hidden ON THE TITLE
    // by design (landscape tL/tR covered the founder preview) and the game-start
    // branch hands it back — the original soft-lock guard is now the drivability
    // check below, which still fails if any path leaves #touch hidden in PLAY.
    await page.evaluate(() => document.getElementById('bHome').click());
    await page.waitForTimeout(300);
    check('667x375: 🏠 returns to the title', await page.evaluate(() => state) === 0);
    const touchBack = await page.evaluate(() => document.getElementById('touch').style.display);
    check('667x375: d-pad stays hidden on the redesigned title', touchBack === 'none', 'display=' + touchBack);
    await tapXY(page, 333, 180); await page.waitForTimeout(500);
    check('667x375: next run starts after home', await page.evaluate(() => state) === 1);
    const hx0 = await page.evaluate(() => player.x);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: rRect.x, y: rRect.y }] });
    await page.waitForTimeout(700);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    const hx1 = await page.evaluate(() => player.x);
    check('667x375: post-home run is drivable (▶ moves player)', hx1 - hx0 > 30, `+${Math.round(hx1 - hx0)}px`);
    check('667x375: zero page errors', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // ---------------- 390x664 portrait ----------------
  {
    const { ctx, page, errors } = await touchCtx(browser, 390, 664);
    const rot = await page.evaluate(() => getComputedStyle(document.getElementById('rot')).display);
    check('390x664: rotate prompt visible in portrait', rot === 'block');
    const canvasTop = await page.evaluate(() => document.getElementById('game').getBoundingClientRect().top);
    check('390x664: canvas top-aligned (not centered behind the prompt)', canvasTop < 5, `top=${Math.round(canvasTop)}`);
    // button-position check moved below game start: the redesigned title hides #touch,
    // and getBoundingClientRect on a display:none element reads 0
    const measureBtns = () => page.evaluate(() => {
      const c = document.getElementById('game').getBoundingClientRect();
      const l = document.getElementById('tL').getBoundingClientRect();
      return { canvasBottom: Math.round(c.bottom), tLtop: Math.round(l.top) };
    });

    // dismiss the prompt with a tap
    await page.evaluate(() => { const r = document.getElementById('rot').getBoundingClientRect(); window.__rot = { x: r.x + r.width/2, y: r.y + r.height/2 }; });
    const rp = await page.evaluate(() => window.__rot);
    await tapXY(page, rp.x, rp.y);
    await page.waitForTimeout(200);
    check('390x664: prompt dismissible', await page.evaluate(() => getComputedStyle(document.getElementById('rot')).display) === 'none');

    await page.screenshot({ path: path.join(SHOTDIR, 'mobile-390x664-portrait.png') });

    // still playable in portrait: start + move
    await tapXY(page, 195, 100);
    await page.waitForTimeout(400);
    check('390x664: tap starts the game in portrait', await page.evaluate(() => state) === 1);
    const btnPos = await measureBtns();
    check('390x664: touch buttons sit directly under the canvas', btnPos.tLtop >= btnPos.canvasBottom && btnPos.tLtop - btnPos.canvasBottom < 40, JSON.stringify(btnPos));
    const x0 = await page.evaluate(() => player.x);
    const rRect = await page.evaluate(() => { const r = document.getElementById('tR').getBoundingClientRect(); return { x: r.x + r.width/2, y: r.y + r.height/2 }; });
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: rRect.x, y: rRect.y }] });
    await page.waitForTimeout(900);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    const x1 = await page.evaluate(() => player.x);
    check('390x664: playable in portrait (▶ moves player)', x1 - x0 > 40, `+${Math.round(x1 - x0)}px`);
    check('390x664: zero page errors', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log(fails === 0 ? 'ALL MOBILE CHECKS PASS' : `${fails} MOBILE CHECK(S) FAILED`);
  await browser.close();
  process.exit(fails === 0 ? 0 : 1);
})();
