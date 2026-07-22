// billboards-probe.js — acceptance for the SHIPPED billboard system (v3 pass:
// 16 boards after CLEAN/DEEL cut + NOZOMIO add, >=250px gaps; FINAL.md spec
// numbers are historical).
// Gates: (1) billboard names NEVER reach the share surfaces (badge / obituary /
// share text — appearing in the world is a different consent, BILLBOARDS.md §5);
// (2) every board name is either owner-approved real (ALLOWED_REAL, mirrors
// PARTNERS.md) or must not collide with the real-brand denylist (a parody-tier
// board may never be an actual trademark); (3) the SPOTTED popup fires for
// partner boards only, once, +$5K — currently DORMANT: no partner:true board
// exists until the first written yes lands; (4) placement invariants: 16 boards, inside
// the world, outside all three boss arenas, >=240px apart, same-height
// neighbors >=400px; (5) boards actually render pixels; (6) zero page errors.
const { chromium } = require('playwright');
const path = require('path');
let fails = 0;
const check = (n, ok, d) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? '  — ' + d : ''}`); if (!ok) fails++; };

// mirrors PARTNERS.md — owner roster of 2026-07-14 (CLEAN + DEEL removed,
// NOZOMIO added). Add here when a new real board lands a yes.
const ALLOWED_REAL = ['CURSOR','VERCEL','WARP','RESEND','EXA', // SUPERSET→CURSOR, owner swap 2026-07-22
  'FIRECRAWL','BROWSER USE','MANUFACT','NOZOMIO','INSFORGE','CALLIX',
  'SUPERMEMORY','HYPERSPELL','AGENTMAIL','KINECT','IMAGINE AI'];
// v2 owner pass removed GOJIBERRY / REPLIT / SUPABASE (the latter two stay on
// the denylist: parody boards may never use those marks either)
// real brands a PARODY-tier board must never equal (extend freely)
const DENYLIST = /vercel|supabase|warp|replit|resend|firecrawl|deel|exa|stripe|openai|anthropic|brex|ramp|notion|figma|linear|cursor|baseten|whop/i;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.goto(process.env.GAME_URL || 'file://' + path.resolve(__dirname, '../index.html'));
  await p.waitForTimeout(700);
  await p.keyboard.down('Space'); await p.waitForTimeout(200); await p.keyboard.up('Space');
  await p.waitForTimeout(300);

  // ---- (1) share-surface gate: names absent from badge/obituary/share code+copy ----
  const leak = await p.evaluate(names => {
    const hay = (makeBadge.toString() + makeObituary.toString() + shareText.toString() +
                 JSON.stringify(OBIT_HEADLINES) + OBIT_BODY.map(f => f.toString()).join(' ') + JSON.stringify(WIN_FRONTPAGE) +
                 WIN_BODY.map(f => f.toString()).join(' ') + JSON.stringify(OBIT_CAPTIONS) + badgeFlairs.toString()).toUpperCase();
    // word-boundary match: bare includes() on 3-letter names (EXA, WARP…) reds
    // the gate on innocent words like EXACT/EXAMPLE in share-surface source
    return names.filter(n => new RegExp('\\b' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(hay));
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
  check('16 boards (owner roster 2026-07-14)', inv.count === 16, String(inv.count));
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

  // ---- (3) SPOTTED: dormant while no partner:true board exists ----
  // the code path stays (reactivates on the first written yes) — assert it
  // stays quiet: walk the NOZOMIO slot and CALLIX, nothing fires, $0 granted.
  const r0 = await p.evaluate(() => raised);
  await p.evaluate(() => { player.x = 5758; player.y = 200; cam = 5660; });
  await p.waitForTimeout(400);
  await p.evaluate(() => { player.x = 6060; cam = 5960; });
  await p.waitForTimeout(400);
  const spot = await p.evaluate(() => ({ any: BILLBOARDS.filter(x => x.spotted).map(x => x.name),
    partners: BILLBOARDS.filter(x => x.partner).map(x => x.name), raised }));
  check('no partner boards in the roster (outreach all-open)', spot.partners.length === 0, spot.partners.join(','));
  check('SPOTTED dormant — nothing fires, $0 granted', spot.any.length === 0 && spot.raised === r0, JSON.stringify(spot));

  check('zero page errors', errors.length === 0, errors.join(' | '));
  console.log(fails === 0 ? 'ALL BILLBOARD CHECKS PASS' : `${fails} BILLBOARD CHECK(S) FAILED`);
  await b.close();
  process.exit(fails ? 1 : 0);
})();
