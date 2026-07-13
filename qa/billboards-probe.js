// billboards-probe.js — acceptance for docs/BILLBOARDS-FINAL.md.
// Gates: (1) billboard names NEVER reach the share surfaces (badge / obituary /
// share text — appearing in the world is a different consent, BILLBOARDS.md §5);
// (2) every board name is either owner-approved real (ALLOWED_REAL, mirrors
// PARTNERS.md) or must not collide with the real-brand denylist (a parody-tier
// board may never be an actual trademark); (3) the SPOTTED popup fires for
// partner boards only, once, +$5K; (4) placement invariants: 19 boards, inside
// the world, outside all three boss arenas, >=240px apart, same-height
// neighbors >=400px; (5) boards actually render pixels; (6) zero page errors.
const { chromium } = require('playwright');
const path = require('path');
let fails = 0;
const check = (n, ok, d) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? '  — ' + d : ''}`); if (!ok) fails++; };

// mirrors PARTNERS.md — owner's locked 19 (2026-07-12). Add here when a new
// real board lands a yes.
const ALLOWED_REAL = ['SUPERSET','VERCEL','WARP','RESEND','EXA',
  'FIRECRAWL','BROWSER USE','MANUFACT','CLEAN','INSFORGE','CALLIX',
  'SUPERMEMORY','HYPERSPELL','AGENTMAIL','KINECT','IMAGINE AI','DEEL'];
// v2 owner pass removed GOJIBERRY / REPLIT / SUPABASE (the latter two stay on
// the denylist: parody boards may never use those marks either)
// real brands a PARODY-tier board must never equal (extend freely)
const DENYLIST = /vercel|supabase|warp|replit|resend|firecrawl|deel|exa|stripe|openai|anthropic|brex|ramp|notion|figma|linear|cursor|baseten|whop/i;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../index.html'));
  await p.waitForTimeout(700);
  await p.keyboard.down('Space'); await p.waitForTimeout(200); await p.keyboard.up('Space');
  await p.waitForTimeout(300);

  // ---- (1) share-surface gate: names absent from badge/obituary/share code+copy ----
  const leak = await p.evaluate(names => {
    const hay = (makeBadge.toString() + makeObituary.toString() + shareText.toString() +
                 JSON.stringify(OBIT_HEADLINES) + OBIT_BODY.map(f => f.toString()).join(' ') + JSON.stringify(WIN_FRONTPAGE) +
                 WIN_BODY.map(f => f.toString()).join(' ') + JSON.stringify(OBIT_CAPTIONS) + badgeFlairs.toString()).toUpperCase();
    return names.filter(n => hay.includes(n));
  }, ALLOWED_REAL);
  check('billboard names never reach badge/obituary/share text', leak.length === 0, leak.join(','));

  // ---- (2) name policy: approved-real or not-a-real-brand ----
  const names = await p.evaluate(() => BILLBOARDS.map(bb => ({ n: bb.name, partner: !!bb.partner })));
  const rogue = names.filter(x => !ALLOWED_REAL.includes(x.n) && DENYLIST.test(x.n));
  check('no unapproved real trademark on any board', rogue.length === 0, rogue.map(x => x.n).join(','));
  const unlisted = names.filter(x => !ALLOWED_REAL.includes(x.n));
  check('every current board is on the PARTNERS.md allowlist', unlisted.length === 0, unlisted.map(x => x.n).join(','));

  // ---- (4) placement invariants ----
  const inv = await p.evaluate(() => {
    const sorted = [...BILLBOARDS].sort((a, c) => a.x - c.x);
    let minGap = 1e9, sameYBad = [];
    for (let i = 1; i < sorted.length; i++){
      minGap = Math.min(minGap, sorted[i].x - sorted[i-1].x);
      if (sorted[i].y === sorted[i-1].y && sorted[i].x - sorted[i-1].x < 400) sameYBad.push(sorted[i].name);
    }
    const arenas = bosses.map(bb => [bb.trigger, bb.wall]);
    const inArena = BILLBOARDS.filter(bb => arenas.some(a => bb.x >= a[0] && bb.x <= a[1])).map(bb => bb.name);
    const outOfWorld = BILLBOARDS.filter(bb => bb.x < 100 || bb.x > 8450).map(bb => bb.name);
    return { count: BILLBOARDS.length, minGap, sameYBad, inArena, outOfWorld };
  });
  check('17 boards (v2 + IMAGINE AI, BUILD-v1.2 A)', inv.count === 17, String(inv.count));
  check('every board outside all three boss arenas', inv.inArena.length === 0, inv.inArena.join(','));
  check('board spacing >=250 world px', inv.minGap >= 250, 'min gap ' + inv.minGap);
  check('same-height neighbors >=400px (no panel overlap at .5 parallax)', inv.sameYBad.length === 0, inv.sameYBad.join(','));
  check('boards inside the reachable world', inv.outOfWorld.length === 0, inv.outOfWorld.join(','));

  // ---- (5) boards render: panel pixels present at a board ----
  await p.evaluate(() => { bosses.forEach(bb => bb.dead = true);
    player.x = 1400; player.y = 100; cam = 1160;
    for (const e of enemies) if (Math.abs(e.x - 1400) < 400) e.dead = true; });
  await p.waitForTimeout(400);
  const drawn = await p.evaluate(() => {
    const bb = BILLBOARDS.find(x => x.name === 'WARP');
    const sx = Math.round((bb.x - cam) * 0.5) - 66;
    const d = cx.getImageData(sx + 66, bb.y + 15, 1, 1).data;   // panel body
    const s = cx.getImageData(sx + 66, bb.y, 1, 1).data;        // accent stripe
    return { panel: [d[0], d[1], d[2]], stripe: [s[0], s[1], s[2]] };
  });
  check('panel renders (WARP body dark)', drawn.panel[0] < 60 && drawn.panel[1] < 60, JSON.stringify(drawn.panel));
  check('accent stripe renders (WARP blue)', drawn.stripe[2] > 150 && drawn.stripe[2] > drawn.stripe[0], JSON.stringify(drawn.stripe));

  // ---- (3) SPOTTED: partner-only, once, +$5K ----
  const r0 = await p.evaluate(() => raised);
  await p.evaluate(() => { player.x = 5758; player.y = 200; cam = 5660; });
  await p.waitForTimeout(400);
  const spot = await p.evaluate(() => ({ clean: BILLBOARDS.find(x => x.name === 'CLEAN').spotted,
    others: BILLBOARDS.filter(x => x.spotted).map(x => x.name), raised }));
  check('partner board spotted (+$5K)', spot.clean && spot.raised === r0 + 5, JSON.stringify(spot));
  check('only partner boards trigger SPOTTED', spot.others.length === 1 && spot.others[0] === 'CLEAN', spot.others.join(','));
  await p.evaluate(() => { player.x = 6060; player.y = 200; cam = 5960; });
  await p.waitForTimeout(400);
  const nonP = await p.evaluate(() => BILLBOARDS.find(x => x.name === 'CALLIX').spotted);
  check('non-partner board never triggers SPOTTED', !nonP);
  const r1 = await p.evaluate(() => raised);
  await p.evaluate(() => { player.x = 5758; cam = 5660; });
  await p.waitForTimeout(300);
  const r2 = await p.evaluate(() => raised);
  check('SPOTTED fires once per run', r2 === r1, `${r1}→${r2}`);
  // re-arms on a fresh run
  const rearmed = await p.evaluate(() => { reset(false); return BILLBOARDS.every(x => !x.spotted); });
  check('SPOTTED re-arms on reset(false)', rearmed);

  check('zero page errors', errors.length === 0, errors.join(' | '));
  console.log(fails === 0 ? 'ALL BILLBOARD CHECKS PASS' : `${fails} BILLBOARD CHECK(S) FAILED`);
  await b.close();
  process.exit(fails ? 1 : 0);
})();
