// Smoketest — asserting (audit P0: the canonical gates were log-only and
// could not fail). Green means: the game boots, a Space press reaches PLAY,
// zero page errors. Retries the documented title-start flake.
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + require('path').resolve(__dirname, '../index.html'));
  await page.waitForTimeout(900);
  let st = 0;
  for (let tries = 0; tries < 3 && st !== 1; tries++){
    await page.keyboard.down('Space'); await page.waitForTimeout(150); await page.keyboard.up('Space');
    await page.waitForTimeout(500);
    st = await page.evaluate(() => state);
  }
  console.log('state:', st, '| errors:', errors.length ? errors.join(' | ') : 'none');
  await browser.close();
  if (st !== 1 || errors.length){ console.log('SMOKETEST FAIL'); process.exitCode = 1; }
})();
