const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + require('path').resolve(__dirname, '../index.html'));
  await page.waitForTimeout(1000);
  await page.keyboard.down('Space'); await page.waitForTimeout(200); await page.keyboard.up('Space');
  await page.waitForTimeout(300);
  let st = await page.evaluate(() => state);
  console.log('started, state =', st);
  await page.evaluate(() => { hearts = 1; player.x = 480; player.hurtT = 0; cam = 380; });
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(3000);
  await page.keyboard.up('ArrowRight');
  const s = await page.evaluate(() => ({ state, hearts }));
  console.log('death check:', JSON.stringify(s));
  await page.screenshot({ path: 'shot6_dead.png' });
  // restart via R
  await page.keyboard.press('r');
  await page.waitForTimeout(400);
  console.log('after R:', await page.evaluate(() => ({ state, hearts, x: Math.round(player.x) })));
  console.log('ERRORS:', errors.length ? errors.join(' | ') : 'none');
  await browser.close();
})();
