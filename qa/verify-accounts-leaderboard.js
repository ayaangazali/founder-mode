// Account + home-board acceptance: the identity is local-first, HTTP uses the
// existing /api/leaderboard contract, and file:// never makes the game depend
// on a network request.
const { chromium } = require('playwright');
const fs = require('fs');
const http = require('http');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'));
let posts = [];
const server = http.createServer((req, res) => {
  // The game conditionally adds Vercel Analytics on HTTP; a no-op script keeps
  // this local mock focused on the leaderboard contract.
  if (req.url === '/_vercel/insights/script.js') {
    res.setHeader('content-type', 'application/javascript'); return res.end('');
  }
  if (req.url.startsWith('/api/leaderboard')) {
    if (req.method === 'POST') {
      let raw = ''; req.on('data', c => raw += c); req.on('end', () => {
        posts.push(JSON.parse(raw)); res.setHeader('content-type', 'application/json'); res.end('{"ok":true}');
      });
      return;
    }
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify({ ok:true, top:[{name:'MAYA', val:42000, raised:42, time_ms:88000, won:true}] }));
  }
  res.setHeader('content-type', 'text/html'); res.end(html);
});
const check = (name, ok, detail='') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); if (!ok) process.exitCode = 1; };

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport:{width:960, height:540} });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(url); await page.waitForTimeout(300);

  await page.keyboard.press('l');
  await page.waitForSelector('#lbClose');
  check('title keyboard opens leaderboard', await page.locator('#lbClose').count() === 1);
  check('leaderboard renders API top run', (await page.locator('#uicard').innerText()).includes('MAYA'));
  // review-7: the opening key toggles the panel shut, and Escape dismisses it too
  await page.keyboard.press('l'); await page.waitForTimeout(50);
  check('opening key toggles board closed', await page.evaluate(() => !homePanelOpen && getComputedStyle(ui).display === 'none'));
  await page.keyboard.press('l'); await page.waitForSelector('#lbClose');
  await page.keyboard.press('Escape'); await page.waitForTimeout(50);
  check('Escape dismisses board panel', await page.evaluate(() => !homePanelOpen && getComputedStyle(ui).display === 'none'));

  await page.keyboard.press('n');
  await page.waitForSelector('#identityName');
  await page.locator('#identityName').fill('Ada <Founder>');
  await page.locator('#identitySave').click();
  check('claim flow stores sanitized identity', await page.evaluate(() => localStorage.getItem('fm_name')) === 'ADA FOUNDER');
  await page.locator('#identityClose').click();

  await page.evaluate(() => { endTime = 90000; raised = 20; state = ST.WIN; showEndUI(true); });
  await page.locator('#lbGo').click(); await page.waitForTimeout(100);
  check('finished claimed run posts to backend contract', posts.length === 1 && posts[0].name === 'ADA FOUNDER', JSON.stringify(posts[0] || {}));
  // review-2: editing the name field and hitting POST (without a separate CLAIM click)
  // commits the typed name, so the posted name can't diverge from what's on screen.
  posts = [];
  await page.evaluate(() => { lbPostedRun = -1; });   // let this run post again for the test
  await page.locator('#lbName').fill('Grace H');
  await page.locator('#lbGo').click(); await page.waitForTimeout(100);
  check('end POST commits the edited name field', posts.length === 1 && posts[0].name === 'GRACE H', JSON.stringify(posts[0] || {}));
  check('edited name persisted to identity', await page.evaluate(() => localStorage.getItem('fm_name')) === 'GRACE H');
  check('zero page errors online', errors.length === 0, errors.join(' | '));
  await browser.close();

  const offline = await chromium.launch();
  const file = await offline.newPage({ viewport:{width:960, height:540} });
  const requests = []; file.on('request', r => requests.push(r.url()));
  await file.goto('file://' + path.resolve(__dirname, '../index.html')); await file.waitForTimeout(250);
  await file.evaluate(() => localStorage.clear());
  await file.reload(); await file.waitForTimeout(250);
  await file.keyboard.press('l'); await file.waitForTimeout(50);
  // #ui is hidden by the stylesheet (display:none), so the inline style stays ''
  // until something opens the panel - assert computed visibility + the open flag.
  check('file mode hides uncached leaderboard', await file.evaluate(() => !LB_ON && !homePanelOpen && getComputedStyle(ui).display === 'none'));
  await file.keyboard.press('n'); await file.waitForSelector('#identityName');
  check('file mode keeps local identity claim available', await file.locator('#identitySave').count() === 1);
  check('file mode makes no leaderboard request', !requests.some(u => u.includes('/api/leaderboard')), requests.join(' | '));
  // Degradation path 2: a board cached from a prior online session still opens
  // offline, is labeled cached, and still triggers no network request.
  const seed = await file.evaluate(() => SEED_N);
  await file.evaluate(s => localStorage.setItem('fm_board_' + s,
    JSON.stringify([{ name:'CACHED CARL', val:1234, raised:12, time_ms:99000, won:false }])), seed);
  const before = requests.length;
  await file.reload(); await file.waitForTimeout(250);
  await file.keyboard.press('l'); await file.waitForSelector('#lbClose');
  const cachedText = await file.locator('#uicard').innerText();
  check('file mode shows cached board when present', cachedText.includes('CACHED CARL') && cachedText.toLowerCase().includes('cached'), cachedText.replace(/\n/g, ' '));
  check('cached board still makes no leaderboard request', !requests.slice(before).some(u => u.includes('/api/leaderboard')));
  await offline.close();
  server.close();
  console.log(process.exitCode ? 'ACCOUNT/BOARD CHECKS FAILED' : 'ALL ACCOUNT/BOARD CHECKS PASS');
})().catch(err => { console.error(err); server.close(); process.exit(1); });
