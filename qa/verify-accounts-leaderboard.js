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
  await page.locator('#lbClose').click();

  await page.keyboard.press('n');
  await page.waitForSelector('#identityName');
  await page.locator('#identityName').fill('Ada <Founder>');
  await page.locator('#identitySave').click();
  check('claim flow stores sanitized identity', await page.evaluate(() => localStorage.getItem('fm_name')) === 'ADA FOUNDER');
  await page.locator('#identityClose').click();

  await page.evaluate(() => { endTime = 90000; raised = 20; state = ST.WIN; showEndUI(true); });
  await page.locator('#lbGo').click(); await page.waitForTimeout(100);
  check('finished claimed run posts to backend contract', posts.length === 1 && posts[0].name === 'ADA FOUNDER', JSON.stringify(posts[0] || {}));
  check('zero page errors online', errors.length === 0, errors.join(' | '));
  await browser.close();

  const offline = await chromium.launch();
  const file = await offline.newPage({ viewport:{width:960, height:540} });
  const requests = []; file.on('request', r => requests.push(r.url()));
  await file.goto('file://' + path.resolve(__dirname, '../index.html')); await file.waitForTimeout(250);
  await file.evaluate(() => localStorage.clear());
  await file.reload(); await file.waitForTimeout(250);
  await file.keyboard.press('l'); await file.waitForTimeout(50);
  check('file mode hides uncached leaderboard', await file.evaluate(() => !LB_ON && ui.style.display === 'none'));
  await file.keyboard.press('n'); await file.waitForSelector('#identityName');
  check('file mode keeps local identity claim available', await file.locator('#identitySave').count() === 1);
  check('file mode makes no leaderboard request', !requests.some(u => u.includes('/api/leaderboard')), requests.join(' | '));
  await offline.close();
  server.close();
  console.log(process.exitCode ? 'ACCOUNT/BOARD CHECKS FAILED' : 'ALL ACCOUNT/BOARD CHECKS PASS');
})().catch(err => { console.error(err); server.close(); process.exit(1); });
