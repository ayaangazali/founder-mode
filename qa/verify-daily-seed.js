// verify-daily-seed.js — ROADMAP §7 determinism probe
// 1) two different (faked) dates → different seed #s and, across a small date
//    range, visibly different market modifiers on the title ticker
// 2) the same date loaded twice → identical seed, identical modifier, and an
//    identical run layout (enemy set, boss HP, starting hearts, coin value)
// Date is faked via addInitScript; the game's only wall-clock read is the
// calendar date for the seed — all timers stay on playMs.
const { chromium } = require('playwright');
const path = require('path');

const GAME = 'file://' + path.resolve(__dirname, '../index.html');

function fakeDateScript(iso){
  return `(() => {
    const RealDate = Date;
    const fixed = new RealDate('${iso}T12:00:00');
    class FakeDate extends RealDate {
      constructor(...a){ if (a.length) super(...a); else super(fixed.getTime()); }
      static now(){ return fixed.getTime(); }
    }
    FakeDate.UTC = RealDate.UTC; FakeDate.parse = RealDate.parse;
    window.Date = FakeDate;
  })()`;
}

async function probe(browser, iso){
  const ctx = await browser.newContext({ viewport: { width: 960, height: 540 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(fakeDateScript(iso));
  await page.goto(GAME);
  await page.waitForTimeout(700);
  // fingerprint the SPAWN layout on the title screen (enemies only move in ST.PLAY)
  const r = await page.evaluate(() => ({
    seed: SEED_N,
    market: MARKET.s,
    coin: COIN_VALUE,
    burnFrames: BURN_FRAMES,
    layout: JSON.stringify({
      enemies: enemies.map(e => [e.x, e.t, e.dead]),
      bosses: bosses.map(b => [b.hp, b.maxhp]),
      hearts, maxHearts,
    }),
  }));
  await page.keyboard.down('Space'); await page.waitForTimeout(200); await page.keyboard.up('Space');
  await page.waitForTimeout(400);
  r.state = await page.evaluate(() => state);
  r.errors = errors;
  await ctx.close();
  return r;
}

(async () => {
  const browser = await chromium.launch();
  let fails = 0;
  const check = (name, ok, detail) => {
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
    if (!ok) fails++;
  };

  // same date, two independent loads
  const a1 = await probe(browser, '2026-07-20');
  const a2 = await probe(browser, '2026-07-20');
  check('same date → same seed #', a1.seed === a2.seed, `#${a1.seed}`);
  check('same date → same modifier', a1.market === a2.market, a1.market);
  check('same date → identical run layout', a1.layout === a2.layout);
  check('game reaches PLAY under a faked date', a1.state === 1 && a2.state === 1);

  // different date → different seed; scan a week for at least two distinct modifiers
  const b = await probe(browser, '2026-07-21');
  check('different date → different seed #', b.seed !== a1.seed, `#${a1.seed} vs #${b.seed}`);
  const seen = new Set([a1.market, b.market]);
  const days = ['2026-07-22', '2026-07-23', '2026-07-24', '2026-07-25'];
  for (const d of days){ if (seen.size >= 2) break; seen.add((await probe(browser, d)).market); }
  check('dates produce visibly different modifiers', seen.size >= 2, [...seen].map(s => s.split(' — ')[0]).join(' | '));

  // a modifier's lever actually moves: find a RATES day in a scan and compare coin value
  const all = [a1, b];
  for (const d of ['2026-07-26', '2026-07-27', '2026-07-28', '2026-08-01', '2026-08-02', '2026-08-03',
                   '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07', '2026-08-08', '2026-08-09']){
    if (all.some(r => r.coin !== 5) && all.some(r => r.coin === 5)) break;
    all.push(await probe(browser, d));
  }
  const coinDay = all.find(r => r.coin !== 5), baseDay = all.find(r => r.coin === 5);
  check('RATES modifier moves the coin lever on its day', !!coinDay && !!baseDay,
        coinDay ? `${coinDay.coin} on "${coinDay.market.split(' — ')[0]}" vs ${baseDay.coin}` : 'no RATES day in scanned range (informational)');

  const anyErrors = [a1, a2, b, ...all].flatMap(r => r.errors || []);
  check('zero page errors across all loads', anyErrors.length === 0, anyErrors.join(' | '));

  console.log(fails === 0 ? 'ALL CHECKS PASS' : `${fails} CHECK(S) FAILED`);
  await browser.close();
  process.exit(fails === 0 ? 0 : 1);
})();
