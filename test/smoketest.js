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
  // Legacy key-name normalization (field bug: a MacBook where only WASD+X
  // worked — its browser reports 'Spacebar'/'Left'/'Esc' instead of the spec
  // names). Synthesizes the deviant events and asserts the game still reads them.
  const legacyOk = await page.evaluate(() => {
    const fire = (type, key, code) => window.dispatchEvent(new KeyboardEvent(type, { key, code }));
    const results = [];
    fire('keydown', 'Spacebar', 'Space');   results.push(keys['space'] === true);
    fire('keyup',   'Spacebar', 'Space');   results.push(keys['space'] === false);
    fire('keydown', 'Left', 'ArrowLeft');   results.push(keys['arrowleft'] === true);
    fire('keyup',   'Left', 'ArrowLeft');   results.push(keys['arrowleft'] === false);
    fire('keydown', 'Up', '');              results.push(keys['arrowup'] === true);  // no e.code at all
    fire('keyup',   'Up', '');              results.push(keys['arrowup'] === false);
    fire('keydown', 'Process', 'KeyD');     results.push(keys['d'] === true);        // IME-swallowed letter
    fire('keyup',   'Process', 'KeyD');     results.push(keys['d'] === false);
    return results.every(Boolean) ? 'ok' : 'FAIL ' + results.join(',');
  });
  console.log('state:', st, '| legacy keys:', legacyOk, '| errors:', errors.length ? errors.join(' | ') : 'none');
  await browser.close();
  if (st !== 1 || legacyOk !== 'ok' || errors.length){ console.log('SMOKETEST FAIL'); process.exitCode = 1; }
})();
