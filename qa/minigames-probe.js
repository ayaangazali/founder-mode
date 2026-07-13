// minigames-probe.js — committed coverage for the BUILD v1.2/v1.3 wave the
// audit found untested: coffee chats, the accelerator interview + BATCH F26,
// cofounder passives, the mom round, interns, pedigree tiers, the CMO frame,
// and pause. Deterministic: pins rolls it depends on; uses direct hurtPlayer
// calls where enemy pathing would flake.
const { chromium } = require('playwright');
const path = require('path');
let fails = 0;
const check = (n, ok, d) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? '  — ' + d : ''}`); if (!ok) fails++; };
const start = async p => {
  for (let t = 0; t < 3; t++){
    await p.keyboard.down('Space'); await p.waitForTimeout(150); await p.keyboard.up('Space');
    await p.waitForTimeout(350);
    if (await p.evaluate(() => state) === 1) return true;
  }
  return false;
};
const tap = async (p, key, hold = 90) => { await p.keyboard.down(key); await p.waitForTimeout(hold); await p.keyboard.up(key); };

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../index.html'));
  await p.waitForTimeout(800);
  check('title reached PLAY', await start(p));

  // ---- coffee chat: opens, right answers pay, closes once ----
  await p.evaluate(() => { reset(false); state = 1; player.x = 1148; player.y = 200; cam = 1050;
    for (const e of enemies) if (Math.abs(e.x - 1150) < 300) e.dead = true; });
  await p.waitForTimeout(350);
  await tap(p, 'c', 120); await p.waitForTimeout(250);
  check('chat opens at the table', await p.evaluate(() => !!chat));
  for (let i = 0; i < 3; i++){
    const sw = await p.evaluate(() => chat && chat.swap);
    await tap(p, sw ? 'ArrowRight' : 'ArrowLeft');   // correct = option a, displayed per swap
    await p.waitForTimeout(2300);
  }
  const chatEnd = await p.evaluate(() => chat && { score: chat.score, amt: chat.amt });
  check('3/3 chat pays the full check', chatEnd && chatEnd.score === 3 && chatEnd.amt === 150, JSON.stringify(chatEnd));
  await p.waitForTimeout(3600);
  check('chat closes + table done', await p.evaluate(() => !chat && CHATS[0].done));

  // ---- interview: 7/7 via swap-aware picks, BATCH F26 stamps ----
  await p.evaluate(() => { player.x = 898; player.y = 200; cam = 800;
    for (const e of enemies) if (Math.abs(e.x - 900) < 300) e.dead = true; });
  await p.waitForTimeout(350);
  await tap(p, 'c', 120); await p.waitForTimeout(250);
  check('interview opens at the door', await p.evaluate(() => !!interview));
  for (let i = 0; i < 7; i++){
    const st2 = await p.evaluate(() => interview && interview.phase === 'q' ? { qi: interview.qi, sw: swapFor('acc', interview.qi) } : null);
    if (!st2) break;
    await tap(p, st2.sw ? 'ArrowRight' : 'ArrowLeft', 70);
    await p.waitForTimeout(110);
  }
  const iv = await p.evaluate(() => interview && { score: interview.score, won: interview.won });
  check('interview 7/7 win', iv && iv.won && iv.score === 7, JSON.stringify(iv));
  await p.waitForTimeout(4400);
  const stamp = await p.evaluate(() => ({ accBatch, badge: makeBadge(true) && true, paper: makeObituary(true) && true }));
  check('BATCH F26 stamped; badge + paper render', stamp.accBatch && stamp.badge && stamp.paper);

  // ---- cofounders ----
  const mom1 = await p.evaluate(() => { cofIdx = 4; reset(false); state = 1; return { hearts, max: maxHearts }; });
  check('MOM cofounder: +1 RUNWAY', mom1.hearts === mom1.max && mom1.hearts >= 4, JSON.stringify(mom1));
  const tech = await p.evaluate(() => { cofIdx = 1; reset(false); state = 1; return 1; });
  await p.keyboard.down('ArrowRight'); await p.waitForTimeout(300);
  const vx = await p.evaluate(() => player.vx);
  await p.keyboard.up('ArrowRight');
  check('TECHNICAL: +8% speed', Math.abs(vx - 1.7 * 1.08) < 0.02, 'vx=' + vx.toFixed(3));

  // ---- mom round: guaranteed with MOM, once per run; roll-gated otherwise ----
  const m1 = await p.evaluate(() => { cofIdx = 4; reset(false); state = 1; hearts = 1; player.hurtT = 0;
    hurtPlayer('meeting', 'T'); return { state, hearts, momRoundUsed }; });
  check('mom round rescues at 0 runway', m1.state === 1 && m1.hearts === 2 && m1.momRoundUsed, JSON.stringify(m1));
  const m2 = await p.evaluate(() => { hearts = 1; player.hurtT = 0; hurtPlayer('meeting', 'T'); return state; });
  check('mom round fires once per run', m2 === 3);
  const m3 = await p.evaluate(() => { cofIdx = 0; reset(false); state = 1; momRoll = 0.9;
    hearts = 1; player.hurtT = 0; hurtPlayer('meeting', 'T'); return state; });
  check('no mom + failed roll: real death', m3 === 3);
  await p.evaluate(() => { document.getElementById('bRe') && document.getElementById('bRe').click(); });
  await p.waitForTimeout(400);

  // ---- pedigree ----
  const ser = await p.evaluate(() => { pedIdx = 0; reset(false); const base = hearts;
    pedIdx = 1; reset(false); state = 1; return { base, serial: hearts }; });
  check('SERIAL FOUNDER: -1 RUNWAY vs the day base', ser.serial === Math.max(1, ser.base - 1), JSON.stringify(ser));
  const ex = await p.evaluate(() => { pedIdx = 6; reset(false); state = 1; return bosses[2].hp; });
  check('ex-SYNERGY.AI: final boss +2 HP', ex >= 7, 'hp=' + ex);
  const vmath = await p.evaluate(() => { pedIdx = 6; raised = 100; hearts = 0; endTime = 100000;
    const r = valuation(true); return { v: r.v, line: r.lines.some(l => l.includes('PEDIGREE')) }; });
  check('valuation carries the x100 term legibly', vmath.line && vmath.v === 100 * 2 * 100, JSON.stringify(vmath));
  const teal = await p.evaluate(() => { pedIdx = 4; reset(false); state = 1;
    powers.push({ x: player.x, y: player.y, w: 14, h: 14, t: 'deck', got: false }); return 1; });
  await p.waitForTimeout(300);
  check('TEAL FELLOW cannot use the deck', await p.evaluate(() => player.deckT === 0));

  // ---- interns: dwell-hire, 10X tank, sprint-past never hires ----
  await p.evaluate(() => { pedIdx = 0; cofIdx = 0; reset(false); state = 1; raised = 100;
    BOOTHS[0].type = 0; BOOTHS[0].hired = false;
    player.x = 1330; player.y = 200; cam = 1230;
    for (const e of enemies) if (Math.abs(e.x - 1330) < 300) e.dead = true; });
  await p.waitForTimeout(900);
  const hire = await p.evaluate(() => ({ hired: BOOTHS[0].hired, id: interns[0] && interns[0].id, raised }));
  check('dwell-hire works (-$20K GRINDER)', hire.hired && hire.id === 'grinder' && hire.raised === 80, JSON.stringify(hire));
  const tank = await p.evaluate(() => { interns.push({ id: 'tenx', x: 0, t: -1 }); hearts = 2; player.hurtT = 0;
    hurtPlayer('meeting', 'T'); return { hearts, n: interns.filter(i2 => i2.id === 'tenx').length }; });
  check('10X intern tanks one hit then quits', tank.hearts === 2 && tank.n === 0, JSON.stringify(tank));
  await p.evaluate(() => { reset(false); state = 1; BOOTHS[0].hired = false; player.x = 1200; player.y = 200; cam = 1100;
    for (const e of enemies) if (Math.abs(e.x - 1330) < 300) e.dead = true; });
  await p.keyboard.down('ArrowRight'); await p.waitForTimeout(2200); await p.keyboard.up('ArrowRight');
  const sprint = await p.evaluate(() => ({ hired: BOOTHS[0].hired, x: Math.round(player.x) }));
  check('sprinting past a booth never hires (bot-safe)', !sprint.hired && sprint.x > 1380, JSON.stringify(sprint));

  // ---- CMO frame: coins are impressions ----
  await p.evaluate(() => { reset(false); state = 1; player.x = 2320; player.y = 200; cam = 2220;
    for (const e of enemies) if (Math.abs(e.x - 2320) < 300) e.dead = true; });
  await p.waitForTimeout(300);
  const cmo = await p.evaluate(() => { const r0 = raised;
    coins.push({ x: player.x, y: player.y, w: 8, h: 10, got: false }); return r0; });
  await p.waitForTimeout(200);
  const cmo2 = await p.evaluate(() => ({ raised, framed: cmoT > 0, pop: popups.some(q => q.txt.includes('REAL DOLLARS')) }));
  check('CMO frame: coins pay +0 REAL DOLLARS', cmo2.framed && cmo2.raised === cmo && cmo2.pop, JSON.stringify(cmo2));

  // ---- pause freezes sim + playMs ----
  await p.evaluate(() => { reset(false); state = 1; });
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  const t1 = await p.evaluate(() => ({ paused, t: Math.round(playMs) }));
  await p.waitForTimeout(600);
  const t2 = await p.evaluate(() => Math.round(playMs));
  await p.keyboard.press('Escape');
  check('pause freezes playMs (speedrun contract)', t1.paused && t1.t === t2, `${t1.t} vs ${t2}`);

  check('zero page errors', errors.length === 0, errors.join(' | '));
  console.log(fails === 0 ? 'ALL MINIGAME CHECKS PASS' : `${fails} MINIGAME CHECK(S) FAILED`);
  await b.close();
  process.exit(fails ? 1 : 0);
})();
