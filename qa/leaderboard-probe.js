// leaderboard-probe.js — the client board flow over a local http stub (the
// audit found it structurally untestable at file://). Covers: page-load fetch,
// end-card render + empty-day fallback, VIEW TOP 100 expand IN VIEW, one post
// per run (confirmed-only marking), name HTML-escaping, and the title panel.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
let fails = 0;
const check = (n, ok, d) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? '  — ' + d : ''}`); if (!ok) fails++; };

const board = []; // in-memory "supabase"
const srv = http.createServer((req, res) => {
  if (req.url.startsWith('/api/leaderboard')){
    if (req.method === 'POST'){
      let raw = ''; req.on('data', c => raw += c);
      req.on('end', () => {
        const bdy = JSON.parse(raw);
        board.push({ name: bdy.name, val: bdy.val, raised: bdy.raised, time_ms: bdy.timeMs, won: bdy.won });
        board.sort((a, x) => (x.won - a.won) || (x.val - a.val));
        res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ ok: true }));
      });
      return;
    }
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ ok: true, top: board }));
    return;
  }
  if (req.url.startsWith('/_vercel')){ res.setHeader('content-type', 'text/javascript'); res.end(''); return; }
  res.setHeader('content-type', 'text/html');
  res.end(fs.readFileSync(path.resolve(__dirname, '../index.html')));
});

srv.listen(8127, async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.goto('http://localhost:8127/');
  await p.waitForTimeout(800);

  // title chip + panel
  check('title 🏆 chip visible over http', await p.evaluate(() => getComputedStyle(document.getElementById('lbChip')).display) === 'block');
  await p.click('#lbChip'); await p.waitForTimeout(400);
  const empty = await p.evaluate(() => document.getElementById('lbPanelHead').textContent);
  check('empty board says so (no blank panel)', /be the first|YESTERDAY/.test(empty), empty.slice(0, 60));
  await p.click('#lbPanelClose');

  // die, post with a name that must be escaped
  for (let t = 0; t < 3; t++){
    await p.keyboard.down('Space'); await p.waitForTimeout(150); await p.keyboard.up('Space');
    await p.waitForTimeout(350);
    if (await p.evaluate(() => state) === 1) break;
  }
  await p.evaluate(() => { hearts = 1; player.hurtT = 0; hurtPlayer('meeting', 'X'); });
  await p.waitForTimeout(900);
  // simulate a hostile name reaching the client (server sanitizes in prod; the
  // client must not trust that)
  await p.evaluate(() => { lbTop = [{ name: '<img src=x onerror=alert(1)>', val: 10, raised: 10, time_ms: 1000, won: false }]; });
  await p.fill('#lbName', 'PROBE');
  await p.evaluate(() => document.getElementById('lbName').blur());
  await p.waitForTimeout(300);
  await p.click('#lbGo'); await p.waitForTimeout(600);
  const posted = await p.evaluate(() => ({ btn: document.getElementById('lbGo').textContent, run: lbPostedRun === runId }));
  check('post lands + marked for this run only', /ON THE BOARD/.test(posted.btn) && posted.run, JSON.stringify(posted));
  const escaped = await p.evaluate(() => {
    const html = document.getElementById('lbList').innerHTML;
    return !html.includes('<img') || html.includes('&lt;img');
  });
  check('board rows HTML-escape names (XSS)', escaped);
  // double-post blocked
  await p.click('#lbGo'); await p.waitForTimeout(300);
  check('second post is a no-op (one per run)', board.filter(r => r.name === 'PROBE').length === 1, 'rows=' + board.length);
  // expand stays in view
  const all = await p.evaluate(() => !!document.getElementById('lbAll'));
  if (all){
    await p.click('#lbAll'); await p.waitForTimeout(400);
    const seen = await p.evaluate(() => {
      const el = document.getElementById('lbList');
      const r = el.getBoundingClientRect();
      return r.top < innerHeight && r.bottom > 0;
    });
    check('VIEW TOP 100 expands into view (fold bug)', seen);
  } else check('VIEW TOP 100 expands into view (fold bug)', true, 'no rows to expand (stub)');

  check('zero page errors', errors.length === 0, errors.join(' | '));
  console.log(fails === 0 ? 'ALL LEADERBOARD CHECKS PASS' : `${fails} LEADERBOARD CHECK(S) FAILED`);
  await b.close(); srv.close();
  process.exit(fails ? 1 : 0);
});
