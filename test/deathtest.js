// Deathtest — asserting (audit P0). Green means: a 1-heart player walking
// into SOMA's gremlins reaches OUT OF RUNWAY, and R starts a fresh run at
// x=20 with full hearts. Fails otherwise.
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  let fail = m => { console.log('DEATHTEST FAIL:', m); process.exitCode = 1; };
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + require('path').resolve(__dirname, '../index.html'));
  await page.waitForTimeout(1000);
  let st = 0;
  for (let tries = 0; tries < 3 && st !== 1; tries++){
    await page.keyboard.down('Space'); await page.waitForTimeout(200); await page.keyboard.up('Space');
    await page.waitForTimeout(300);
    st = await page.evaluate(() => state);
  }
  if (st !== 1) fail('never reached PLAY');
  await page.evaluate(() => { hearts = 1; player.x = 480; player.hurtT = 0; cam = 380; });
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(3500);
  await page.keyboard.up('ArrowRight');
  const s = await page.evaluate(() => ({ state, hearts }));
  console.log('death check:', JSON.stringify(s));
  if (s.state !== 3) fail('expected OUT OF RUNWAY (state 3), got ' + s.state);
  await page.screenshot({ path: 'shot6_dead.png' });
  await page.keyboard.press('r');
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => ({ state, hearts, x: Math.round(player.x) }));
  console.log('after R:', JSON.stringify(r));
  if (!(r.state === 1 && r.x === 20 && r.hearts >= 3)) fail('R did not produce a fresh run: ' + JSON.stringify(r));
  console.log('ERRORS:', errors.length ? errors.join(' | ') : 'none');
  if (errors.length) fail('page errors');
  await browser.close();
})();
