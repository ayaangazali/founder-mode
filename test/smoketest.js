const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + require('path').resolve(__dirname, '../index.html'));
  await page.waitForTimeout(900);
  await page.keyboard.down('Space'); await page.waitForTimeout(150); await page.keyboard.up('Space');
  await page.waitForTimeout(500);
  console.log('state:', await page.evaluate(() => state), '| errors:', errors.length ? errors.join(' | ') : 'none');
  await browser.close();
})();
