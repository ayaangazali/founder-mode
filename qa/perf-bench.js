// qa/perf-bench.js — advisory frame-cost benchmark (NOT a *-probe: perf numbers
// vary per machine and headless uses a software rasterizer, so this never gates
// CI). It wraps stepGame()/draw() with performance.now() and reports per-phase
// avg / p95 / max in ms, plus frames whose combined work blew the 16.67ms step.
// Compare before/after on the SAME machine, same day (daily seed changes load).
// Usage: node qa/perf-bench.js
const { chromium } = require('playwright');
const pct = (a, p) => a.slice().sort((x, y) => x - y)[Math.floor(a.length * p)] || 0;
const stats = a => ({
  n: a.length,
  avg: +(a.reduce((s, v) => s + v, 0) / (a.length || 1)).toFixed(3),
  p95: +pct(a, 0.95).toFixed(3),
  max: +Math.max(0, ...a).toFixed(3),
});
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto('file://' + require('path').resolve(__dirname, '../index.html'));
  await page.waitForTimeout(800);

  await page.evaluate(() => {
    window.__perf = { step: [], draw: [] };
    const _s = stepGame, _d = draw;
    window.stepGame = function(){ const t0 = performance.now(); _s(); window.__perf.step.push(performance.now() - t0); };
    window.draw = function(){ const t0 = performance.now(); _d(); window.__perf.draw.push(performance.now() - t0); };
  });

  const sample = async (label, ms) => {
    await page.evaluate(() => { window.__perf.step.length = 0; window.__perf.draw.length = 0; });
    await page.waitForTimeout(ms);
    const { step, draw } = await page.evaluate(() => window.__perf);
    const over = draw.map((d, i) => d + (step[i] || 0)).filter(t => t > 16.67).length;
    console.log(label.padEnd(22),
      'step', JSON.stringify(stats(step)).padEnd(46),
      'draw', JSON.stringify(stats(draw)),
      over ? `OVER-BUDGET frames: ${over}` : '');
    return { label, step: stats(step), draw: stats(draw), over };
  };

  const results = [];
  results.push(await sample('title', 2500));

  for (let tries = 0; tries < 3; tries++){
    await page.keyboard.down('Space'); await page.waitForTimeout(150); await page.keyboard.up('Space');
    await page.waitForTimeout(400);
    if (await page.evaluate(() => state) === 1) break;
  }
  if (await page.evaluate(() => state) !== 1){ console.log('BENCH FAIL: never reached PLAY'); process.exit(1); }

  // moving through each biome — hold right so entities/parallax actually churn
  const zones = [
    ['soma-run', 300],
    ['mission-run', 2500],
    ['sandhill-signs', 3900],   // fund-district sign row: measureText-heavy
    ['platform-arena', 5350],
    ['cloud-run', 7000],
  ];
  for (const [label, x] of zones){
    await page.evaluate(nx => { player.x = nx; player.y = 100; cam = Math.max(0, nx - 100); hearts = 3; }, x);
    await page.keyboard.down('ArrowRight');
    results.push(await sample(label, 3000));
    await page.keyboard.up('ArrowRight');
  }

  // AI boss active — shots + boss draw + pills
  await page.evaluate(() => { bosses[0].hp = 0; bosses[0].dead = true; bosses[1].hp = 0; bosses[1].dead = true; player.x = 7950; player.y = 100; cam = 7850; hearts = 3; });
  await page.waitForTimeout(1200);
  results.push(await sample('ai-boss', 3000));

  const worst = Math.max(...results.map(r => r.draw.p95 + r.step.p95));
  console.log('---');
  console.log('worst-phase p95 step+draw:', worst.toFixed(2) + 'ms', '(budget 16.67ms; headless software raster inflates this)');
  console.log('page errors:', errors.length ? errors.join(' | ') : 'none');
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})();
