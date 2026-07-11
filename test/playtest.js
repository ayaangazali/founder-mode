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

  // teleport to VC boss arena
  await page.evaluate(() => { player.x = 4730; player.y = 100; cam = 4630; });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'shot3_vcboss.png' });
  const s2 = await page.evaluate(() => ({ vcActive: bosses[0].active, vcHp: bosses[0].hp, shots: shots.length }));
  console.log('vc boss:', JSON.stringify(s2));

  // cheat-kill vc boss, teleport to final boss
  await page.evaluate(() => { bosses[0].hp = 0; bosses[0].dead = true; player.x = 6790; player.y = 100; cam = 6700; player.ycT = 0; hearts = 3; });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'shot4_aiboss.png' });
  const s3 = await page.evaluate(() => ({ aiActive: bosses[1].active, aiHp: bosses[1].hp, shots: shots.length }));
  console.log('ai boss:', JSON.stringify(s3));

  // kill final boss, walk to bell
  await page.evaluate(() => { bosses[1].hp = 1; });
  // stomp: place player above boss falling
  await page.evaluate(() => { player.x = bosses[1].x + 8; player.y = bosses[1].y - 30; player.vy = 3; });
  await page.waitForTimeout(600);
  const s4 = await page.evaluate(() => ({ aiDead: bosses[1].dead, raised }));
  console.log('after stomp:', JSON.stringify(s4));

  await page.keyboard.up('ArrowRight');
  await page.evaluate(() => { player.x = 7380; player.y = 180; });
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(1500);
  await page.keyboard.up('ArrowRight');
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
