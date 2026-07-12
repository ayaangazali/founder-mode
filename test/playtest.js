const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  await page.goto('file://' + require('path').resolve(__dirname, '../index.html'));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'shot1_title.png' });

  // start game
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);

  // run right for a few seconds, jumping periodically
  await page.keyboard.down('ArrowRight');
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(700);
    await page.keyboard.press('Space');
  }
  await page.screenshot({ path: 'shot2_running.png' });

  const s1 = await page.evaluate(() => ({ x: Math.round(player.x), hearts, raised, state, zone: zoneName(player.x) }));
  console.log('after running:', JSON.stringify(s1));

  // teleport to THE PLATFORM arena (Cerebral Valley mid-boss)
  await page.evaluate(() => { player.x = 5410; player.y = 100; cam = 5310; });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'shot3b_platformboss.png' });
  const s2b = await page.evaluate(() => ({ platformActive: bosses[0].active, platformHp: bosses[0].hp, crates: crates.length }));
  console.log('platform boss:', JSON.stringify(s2b));

  // cheat-kill the platform, teleport to VC boss arena
  await page.evaluate(() => { bosses[0].hp = 0; bosses[0].dead = true; player.x = 6450; player.y = 100; cam = 6350; hearts = 3; });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'shot3_vcboss.png' });
  const s2 = await page.evaluate(() => ({ vcActive: bosses[1].active, vcHp: bosses[1].hp, shots: shots.length }));
  console.log('vc boss:', JSON.stringify(s2));

  // cheat-kill vc boss, teleport to final boss
  await page.evaluate(() => { bosses[1].hp = 0; bosses[1].dead = true; player.x = 8490; player.y = 100; cam = 8390; player.ycT = 0; hearts = 3; });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'shot4_aiboss.png' });
  const s3 = await page.evaluate(() => ({ aiActive: bosses[2].active, aiHp: bosses[2].hp, shots: shots.length }));
  console.log('ai boss:', JSON.stringify(s3));

  // kill final boss, walk to bell
  await page.evaluate(() => { bosses[2].hp = 1; });
  // stomp: place player above boss falling
  await page.evaluate(() => { player.x = bosses[2].x + 8; player.y = bosses[2].y - 30; player.vy = 3; });
  await page.waitForTimeout(600);
  const s4 = await page.evaluate(() => ({ aiDead: bosses[2].dead, raised }));
  console.log('after stomp:', JSON.stringify(s4));

  await page.keyboard.up('ArrowRight');
  await page.evaluate(() => { player.x = 9080; player.y = 180; });
  // walk to the bell — the ceremony arms on arrival; mash R, confetti plays out
  await page.keyboard.down('ArrowRight'); await page.waitForTimeout(1200); await page.keyboard.up('ArrowRight');
  const armed = await page.evaluate(() => ({ armed: !!bellRing, state }));
  console.log('ceremony armed:', JSON.stringify(armed));
  for (let i = 0; i < 12; i++){ await page.keyboard.down('r'); await page.waitForTimeout(60); await page.keyboard.up('r'); await page.waitForTimeout(70); }
  await page.waitForTimeout(2400);
  const s5 = await page.evaluate(() => ({ state, bellDone, raised }));
  console.log('win check:', JSON.stringify(s5));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'shot5_win.png' });

  // test death: reload, start, run into enemies with no jumps
  await page.reload();
  await page.waitForTimeout(400);
  await page.keyboard.press('Space');
  await page.waitForTimeout(300);
  await page.evaluate(() => { hearts = 1; player.x = 500; cam = 400; });
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(2500);
  await page.keyboard.up('ArrowRight');
  const s6 = await page.evaluate(() => ({ state, hearts }));
  console.log('death check:', JSON.stringify(s6));
  await page.screenshot({ path: 'shot6_dead.png' });

  console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})();
