/* ============================================================
   FOUNDER MODE — DESIGN KIT · sprites.js
   Paste-ready pixel draw functions for every new entity.
   Style contract (matches index.html exactly):
     - everything is fillRect on a virtual pixel grid
     - s = scale (game uses s=1 on the 480x270 canvas)
     - no images, no paths except where the game already uses them
     - palette below reuses the game's existing colors wherever possible
   ============================================================ */

// ---------------- PALETTE (game canon + new entities) ----------------
const PAL = {
  // existing game colors (do not change)
  gold:   '#ffd94a', red:    '#d64550', hurt:  '#ff5a5a', green: '#7cffa5',
  mint:   '#39c46d', blue:   '#7ce0ff', purple:'#c58bff', orange:'#ff8c37',
  skin:   '#f2c9a0', jean:   '#3b5bdb', ink:   '#111',    gray:  '#8d99ae',
  night1: '#141433', night2: '#2a1a3e', cyan:  '#41f2ff',
  // new-entity colors (additions)
  suit:   '#6e7787', suitDk: '#525a68', shirt: '#e8ecf5',
  halo:   '#ffe27a', drone:  '#2b2d42',
  ghost:  '#cfd8ea', ghostEye:'#5a6a8a',
  taxi:   '#f4f6fb', taxiDk: '#c9d2e4', dome:  '#1b1e2c',
  mecha:  '#dfe6f2', mechaDk:'#9fb0cc', corp:  '#1f6feb', crate: '#8a5a2b',
  envG:   '#e8b83a', envD:   '#c2952a', stampR:'#d64550'
};

// pixel-rect helper (identical contract to the game's rp())
function P(c, x, y, w, h, col, s){ c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.ceil(w*s), Math.ceil(h*s)); }

/* ============================================================
   1) BOARD MEMBER  (v0.2 — spawned by term sheets)
   14x18 @ s=1 · non-lethal follower, blocks movement 20s
   Lore: folded inside every term sheet like a fortune cookie
   of governance. Helpful. That's the problem.
   ============================================================ */
function drawBoardMember(c, x, y, s, frame, face){
  const f = face ?? 1, step = (frame>>3) & 1;
  // hair (gray, receding — earned)
  P(c, x+3*s, y, 8, 2, '#b9c0cc', s);
  P(c, x+3*s, y+2*s, 8, 4, PAL.skin, s);                    // face
  P(c, x+(f>0?8:4)*s, y+3*s, 1, 2, PAL.ink, s);             // eye
  // glasses hint
  P(c, x+(f>0?7:3)*s, y+3*s, 3, 1, '#aab4c4', s);
  // suit body
  P(c, x+2*s, y+6*s, 10, 7, PAL.suit, s);
  P(c, x+5*s, y+6*s, 4, 5, PAL.shirt, s);                   // shirt V
  P(c, x+6*s, y+6*s, 2, 5, PAL.red, s);                     // tie
  P(c, x+2*s, y+6*s, 2, 7, PAL.suitDk, s);                  // lapel L
  P(c, x+10*s, y+6*s, 2, 7, PAL.suitDk, s);                 // lapel R
  // "BOD" badge
  P(c, x+9*s, y+8*s, 4, 3, '#fff', s);
  if (s >= 3){ c.fillStyle = PAL.ink; c.font = `bold ${2.2*s}px monospace`; c.fillText('BOD', Math.round(x+9.2*s), Math.round(y+10.4*s)); }
  // briefcase (trailing hand)
  P(c, x+(f>0?0:12)*s, y+10*s, 3, 4, '#5e3c1a', s);
  P(c, x+(f>0?1:13)*s, y+9*s, 1, 1, '#8a5a2b', s);
  // suit trousers, walk cycle
  c.fillStyle = PAL.suitDk;
  if (step){ P(c, x+3*s, y+13*s, 3, 4, PAL.suitDk, s); P(c, x+8*s, y+13*s, 3, 5, PAL.suitDk, s); }
  else     { P(c, x+3*s, y+13*s, 3, 5, PAL.suitDk, s); P(c, x+8*s, y+13*s, 3, 4, PAL.suitDk, s); }
  // dress shoes
  P(c, x+3*s, y+17*s, 3, 1, '#2b2130', s); P(c, x+8*s, y+17*s, 3, 1, '#2b2130', s);
}
// ambient speech bubble text (cycle while following): 'QUICK QUESTION—' · 'RE: METRICS' · 'CIRCLING BACK'

/* ============================================================
   2) THOUGHT LEADER  (v1.0 — Cerebral Valley flyer)
   16x14 @ s=1 (+ halo above) · sine hover, drops THREAD bombs
   i-frames while "posting" (halo glows) — can't be stomped mid-post
   ============================================================ */
function drawThoughtLeader(c, x, y, s, frame){
  const posting = (frame % 140) < 36;                        // posting window
  const halo = posting && (frame>>2)%2 ? '#fff2b0' : PAL.halo;
  // halo ring (the personal brand)
  P(c, x+4*s, y-4*s, 8, 1, halo, s);
  P(c, x+3*s, y-3*s, 1, 1, halo, s); P(c, x+12*s, y-3*s, 1, 1, halo, s);
  // head
  P(c, x+5*s, y, 6, 5, PAL.skin, s);
  P(c, x+5*s, y, 6, 1, '#4a3626', s);                        // fade haircut
  P(c, x+9*s, y+2*s, 1, 1, PAL.ink, s);                      // eye (locked on phone)
  // body — quarter-zip (the uniform)
  P(c, x+4*s, y+5*s, 8, 6, PAL.drone, s);
  P(c, x+7*s, y+5*s, 2, 3, '#454b66', s);                    // zip
  // phone (always)
  P(c, x+11*s, y+6*s, 3, 4, '#0e1020', s);
  P(c, x+11*s, y+6*s, 3, 1, PAL.cyan, s);                    // screen glow
  // hover jets: ring-light glow underneath (their light source is themselves)
  const jf = (frame>>2)%2;
  P(c, x+5*s, y+11*s, 2, jf?2:1, '#fff', s); P(c, x+9*s, y+11*s, 2, jf?1:2, '#fff', s);
}
// THREAD bomb projectile: white card, red header, label 'THREAD 1/9'
function drawThreadBomb(c, x, y, s){
  P(c, x, y, 14, 9, '#fff', s);
  P(c, x, y, 14, 2, PAL.red, s);
  if (s >= 2){ c.fillStyle = PAL.ink; c.font = `bold ${3*s}px monospace`; c.fillText('1/9', Math.round(x+3*s), Math.round(y+7*s)); }
}
// stomp line: "RATIO'D! +$15K"

/* ============================================================
   3) COMPLIANCE PHANTOM  (v1.0 — phases through terrain)
   14x16 @ s=1 · slow, ignores platforms, translucent
   Lore: the spirit of a regulation you haven't heard of yet.
   NOTE: translucency via globalAlpha — the game's one allowed trick.
   ============================================================ */
function drawCompliancePhantom(c, x, y, s, frame){
  const a = c.globalAlpha; c.globalAlpha = 0.72;
  const wob = Math.sin(frame*0.08)*1.5*s;
  // body sheet
  P(c, x+2*s, y+wob, 10, 11, PAL.ghost, s);
  P(c, x+1*s, y+2*s+wob, 12, 7, PAL.ghost, s);
  // wavy hem (3 scallops, animated)
  const ph = (frame>>3)%2;
  for (let i=0;i<3;i++) P(c, x+(2+i*4+(ph?1:0))*s, y+11*s+wob, 3, 2, PAL.ghost, s);
  // hollow eyes + permanent mild concern
  P(c, x+4*s, y+4*s+wob, 2, 3, PAL.ghostEye, s); P(c, x+8*s, y+4*s+wob, 2, 3, PAL.ghostEye, s);
  P(c, x+5*s, y+8*s+wob, 4, 1, PAL.ghostEye, s);            // flat mouth
  // the tie (it is a professional)
  P(c, x+6*s, y+9*s+wob, 2, 4, PAL.red, s);
  // clipboard, faintly
  P(c, x+11*s, y+6*s+wob, 3, 5, '#aab4c4', s);
  c.globalAlpha = a;
}
// stomp line: "EXEMPTED! +$15K" · contact popup: '-1 RUNWAY (audit)'

/* ============================================================
   4) ROBOTAXI  (v1.0 — NEUTRAL moving platform, not an enemy)
   30x14 @ s=1 · trundles right, stops dead 2s at "intersections"
   Archetype name only — never a real brand. Hazards blink while stopped.
   ============================================================ */
function drawRobotaxi(c, x, y, s, frame, stopped){
  // sensor dome (spins via 2-frame highlight)
  P(c, x+12*s, y-4*s, 6, 3, PAL.dome, s);
  P(c, x+(13+((frame>>3)%2)*2)*s, y-4*s, 2, 1, PAL.cyan, s);
  P(c, x+14*s, y-1*s, 2, 1, PAL.dome, s);                    // mast
  // body
  P(c, x, y+2*s, 30, 8, PAL.taxi, s);
  P(c, x+2*s, y, 26, 4, PAL.taxi, s);                        // cabin
  P(c, x+4*s, y+1*s, 8, 3, '#9fd7e8', s);                    // windows (empty. always empty.)
  P(c, x+14*s, y+1*s, 8, 3, '#9fd7e8', s);
  P(c, x, y+8*s, 30, 2, PAL.taxiDk, s);                      // skirt
  // wheels
  P(c, x+4*s, y+10*s, 5, 4, PAL.dome, s); P(c, x+21*s, y+10*s, 5, 4, PAL.dome, s);
  P(c, x+5*s, y+11*s, 3, 2, '#4a5162', s); P(c, x+22*s, y+11*s, 3, 2, '#4a5162', s);
  // hazards when stopped (its one flaw, lovingly observed)
  if (stopped && (frame>>4)%2){ P(c, x+1*s, y+4*s, 2, 2, PAL.orange, s); P(c, x+27*s, y+4*s, 2, 2, PAL.orange, s); }
  // roof rider hint-arrow when player nearby is drawn by game, not sprite
}
// popup when it stops under you: 'UNPLANNED STOP (safe)'

/* ============================================================
   5) THE PLATFORM  (v1.0 mid-boss — OMNICORP CLOUD DevRel mecha)
   40x48 @ s=1 · 4 HP · drops SDK crates that become platforms
   Its attacks literally build lock-in around you.
   ============================================================ */
function drawPlatformBoss(c, x, y, s, frame){
  const blink = (frame % 90) > 84;
  // shoulder cable-arms (APIs) — segmented, sway
  const sway = Math.sin(frame*0.05)*2*s;
  for (let i=0;i<3;i++){
    P(c, x-6*s+sway*(i/3), y+(10+i*7)*s, 4, 4, PAL.mechaDk, s);
    P(c, x+42*s-sway*(i/3), y+(10+i*7)*s, 4, 4, PAL.mechaDk, s);
  }
  P(c, x-7*s+sway, y+31*s, 6, 5, PAL.corp, s);               // connector hands
  P(c, x+41*s-sway, y+31*s, 6, 5, PAL.corp, s);
  // torso
  P(c, x, y+10*s, 40, 26, PAL.mecha, s);
  P(c, x, y+10*s, 40, 3, PAL.mechaDk, s);
  P(c, x+2*s, y+33*s, 36, 3, PAL.mechaDk, s);
  // chest lanyard + badge (it is, after all, DevRel)
  P(c, x+19*s, y+13*s, 2, 8, PAL.corp, s);
  P(c, x+16*s, y+21*s, 8, 6, '#fff', s);
  if (s>=2){ c.fillStyle = PAL.corp; c.font = `bold ${2.6*s}px monospace`; c.fillText('OMNI', Math.round(x+16.6*s), Math.round(y+25.4*s)); }
  // head: a screen with a keynote smile
  P(c, x+8*s, y, 24, 12, PAL.dome, s);
  P(c, x+10*s, y+2*s, 20, 8, blink ? '#0e1020' : '#12325a', s);
  if (!blink){
    P(c, x+14*s, y+4*s, 3, 2, PAL.cyan, s); P(c, x+23*s, y+4*s, 3, 2, PAL.cyan, s);   // eyes
    P(c, x+15*s, y+8*s, 10, 1, PAL.cyan, s);                                          // the smile. constant.
  }
  // status LEDs
  for (let i=0;i<4;i++) P(c, x+(4+i*3)*s, y+15*s, 2, 2, (frame>>3)%4===i ? PAL.green : '#3a4152', s);
  // treads
  P(c, x+2*s, y+36*s, 14, 8, PAL.dome, s); P(c, x+24*s, y+36*s, 14, 8, PAL.dome, s);
  const to = (frame>>2)%4;
  for (let i=0;i<3;i++){ P(c, x+(3+((i*4+to)%12))*s, y+42*s, 2, 1, '#4a5162', s); P(c, x+(25+((i*4+to)%12))*s, y+42*s, 2, 1, '#4a5162', s); }
}
// SDK crate (falls, lands, becomes a one-way platform for 8s, then despawns)
function drawSDKCrate(c, x, y, s, frame){
  P(c, x, y, 16, 12, PAL.crate, s);
  P(c, x+1*s, y+1*s, 14, 10, '#a06a34', s);
  P(c, x+1*s, y+5*s, 14, 1, PAL.crate, s);                   // strap
  P(c, x+3*s, y+3*s, 10, 6, '#fff', s);                      // label
  if (s>=2){ c.fillStyle = PAL.ink; c.font = `bold ${3.4*s}px monospace`; c.fillText('SDK', Math.round(x+4.4*s), Math.round(y+7.8*s)); }
  if (frame !== undefined && (frame>>3)%2) P(c, x+13*s, y+1*s, 2, 2, PAL.gold, s);   // "new version!" ping
}
// quips: 'BUILD ON US' · 'WE LOVE STARTUPS' · 'FREE CREDITS*' ·
//        'THE API CHANGED THIS MORNING' · 'YOUR CATEGORY IS OUR KEYNOTE'
// kill line: 'DEPRECATED! +$350K'

/* ============================================================
   6) DEMO DAY LETTER  (v0.2 — REPLACES the orange 'Y' square)
   14x14 @ s=1 · gold envelope, red rocket stamp, NO letter glyphs
   8s invincibility · 'ACCELERATED! INVINCIBLE' · HUD 'DEMO DAY MODE'
   ============================================================ */
function drawDemoDayLetter(c, x, y, s, frame){
  const bob = Math.sin((frame??0)*0.1)*2*s;
  // envelope body
  P(c, x, y+3*s+bob, 14, 9, PAL.envG, s);
  // flap (V fold)
  P(c, x, y+3*s+bob, 14, 2, PAL.envD, s);
  P(c, x+1*s, y+4*s+bob, 5, 2, PAL.envD, s); P(c, x+8*s, y+4*s+bob, 5, 2, PAL.envD, s);
  P(c, x+6*s, y+6*s+bob, 2, 2, PAL.envD, s);                 // flap point
  // rocket stamp (top-right): tiny red rocket on white
  P(c, x+10*s, y+4*s+bob, 4, 4, '#fff', s);
  P(c, x+11.5*s, y+4.5*s+bob, 1, 2, PAL.stampR, s);          // rocket body
  P(c, x+11*s, y+6.5*s+bob, 2, 1, PAL.orange, s);            // flame
  // shine sweep
  const sh = ((frame??0)>>2) % 28;
  if (sh < 10) P(c, x+(2+sh)*s, y+5*s+bob, 1, 6, '#fff3c4', s);
  // sparkle above (it knows it's important)
  if (((frame??0)>>3)%2) P(c, x+2*s, y+bob, 1, 1, '#fff', s);
}

/* ============================================================
   7) FOUNDER (copied verbatim from index.html — needed by badges)
   ============================================================ */
function drawFounder(ctx2, x, y, s, face, runF, accel){
  const hood = accel ? '#ff8c37' : '#7f8ea3';
  const skin = '#f2c9a0', jean = '#3b5bdb', shoe = '#e8e8e8';
  ctx2.fillStyle = hood; ctx2.fillRect(Math.round(x+2*s), Math.round(y), 8*s, 3*s);
  ctx2.fillStyle = skin; ctx2.fillRect(Math.round(x+3*s), Math.round(y+2*s), 6*s, 4*s);
  ctx2.fillStyle = '#222';
  if (face >= 0) ctx2.fillRect(Math.round(x+7*s), Math.round(y+3*s), 1*s, 2*s);
  else ctx2.fillRect(Math.round(x+4*s), Math.round(y+3*s), 1*s, 2*s);
  ctx2.fillStyle = hood; ctx2.fillRect(Math.round(x+1*s), Math.round(y+6*s), 10*s, 6*s);
  ctx2.fillStyle = '#5f6e83'; ctx2.fillRect(Math.round(x+4*s), Math.round(y+9*s), 4*s, 3*s);
  ctx2.fillStyle = '#fff'; ctx2.fillRect(Math.round(x+5*s), Math.round(y+6*s), 1*s, 3*s);
  ctx2.fillStyle = jean;
  if (runF){ ctx2.fillRect(Math.round(x+2*s), Math.round(y+12*s), 3*s, 3*s); ctx2.fillRect(Math.round(x+7*s), Math.round(y+12*s), 3*s, 4*s); }
  else     { ctx2.fillRect(Math.round(x+2*s), Math.round(y+12*s), 3*s, 4*s); ctx2.fillRect(Math.round(x+7*s), Math.round(y+12*s), 3*s, 3*s); }
  ctx2.fillStyle = shoe; ctx2.fillRect(Math.round(x+2*s), Math.round(y+15*s), 3*s, 1*s); ctx2.fillRect(Math.round(x+7*s), Math.round(y+15*s), 3*s, 1*s);
}

/* ============================================================
   8) BADGE FACTORY — all six 1200x630 variants
   makeBadgeV2(kind, stats) → canvas
   kind: 'unicorn' | 'runway' | 'acquihire' | 'zombie' | 'lifestyle' | 'seriesb'
   stats: { raised:'$1.51M', time:'04:32', bosses:'2/2', url:'foundermode.lol' }
   Design rules (research §2): whole run in one glance · spoiler-free ·
   URL baked into the PNG (v0.2 spec) · loss variants funnier than wins.
   ============================================================ */
const BADGES = {
  unicorn:  { border:'#ffd94a', title:'CERTIFIED UNICORN',  titleC:'#ffd94a',
              sub:'survived SF · defeated SYNERGY.AI',
              quote:'"we\'re basically profitable" — you, probably', founderGlow:true },
  runway:   { border:'#d64550', title:'OUT OF RUNWAY',      titleC:'#ff5a5a',
              sub:'SF claims another founder',
              quote:'"it was a market timing issue" — you, on LinkedIn', founderGlow:false },
  acquihire:{ border:'#7ce0ff', title:'ACQUI-HIRED',        titleC:'#7ce0ff',
              sub:'joined SYNERGY.AI mid-boss-fight',
              quote:'"excited for this next chapter" — you, in the memo',
              statOverride:{ label:'RETAINED', note:'RETENTION BONUS' }, founderGlow:false },
  zombie:   { border:'#8d99ae', title:'ZOMBIE STARTUP',     titleC:'#8d99ae',
              sub:'rang the bell. quietly. nobody looked up.',
              quote:'"technically still alive" — the whole company', founderGlow:false },
  lifestyle:{ border:'#7cffa5', title:'LIFESTYLE BUSINESS', titleC:'#7cffa5',
              sub:'went home. kept the company. kept weekends.',
              quote:'"you win?" — the only happy ending', founderGlow:true },
  seriesb:  { border:'#c58bff', title:'SERIES B UNICORN',   titleC:'#c58bff',
              sub:'did it again, on hard mode, as expected',
              quote:'"staying humble" — your LinkedIn post about it',
              ribbon:'SERIES B', founderGlow:true }
};

function makeBadgeV2(kind, stats){
  const B = BADGES[kind];
  const bc = document.createElement('canvas'); bc.width = 1200; bc.height = 630;
  const b = bc.getContext('2d'); b.imageSmoothingEnabled = false;
  const g = b.createLinearGradient(0,0,0,630);
  g.addColorStop(0,'#141433'); g.addColorStop(1,'#2a1a3e');
  b.fillStyle = g; b.fillRect(0,0,1200,630);
  // pixel border + notches (v0.1 signature, keep)
  b.fillStyle = B.border;
  b.fillRect(0,0,1200,12); b.fillRect(0,618,1200,12); b.fillRect(0,0,12,630); b.fillRect(1188,0,12,630);
  for (let i=0;i<30;i++){ b.fillRect(20+i*40,24,12,12); b.fillRect(20+i*40,594,12,12); }
  // founder sprite (zombie gets a tilt; lifestyle stands on sand)
  if (kind==='lifestyle'){ b.fillStyle='#e8b83a'; b.fillRect(60,424,240,14); }         // sand first, founder on top
  if (kind==='zombie'){ b.save(); b.translate(160,380); b.rotate(-0.22); drawFounder(b,-80,-160,14,1,0,false); b.restore(); }
  else drawFounder(b, 80, 200, 14, 1, kind==='lifestyle'?1:0, B.founderGlow);
  // ribbon (series b)
  if (B.ribbon){
    b.save(); b.translate(1050,80); b.rotate(0.6);
    b.fillStyle='#c58bff'; b.fillRect(-160,-22,320,44);
    b.fillStyle='#141433'; b.font='bold 30px monospace'; b.textAlign='center';
    b.fillText(B.ribbon, 0, 10); b.restore(); b.textAlign='left';
  }
  // text column
  b.textAlign='left';
  b.fillStyle = B.titleC; b.font = 'bold 64px monospace'; b.fillText(B.title, 320, 150);
  b.fillStyle = '#fff';   b.font = 'bold 32px monospace'; b.fillText(B.sub, 320, 202);
  const S = stats || { raised:'$1.51M', time:'04:32', bosses:'2/2', url:'foundermode.lol' };
  b.font='bold 44px monospace';
  b.fillStyle='#7cffa5'; b.fillText((B.statOverride?B.statOverride.label:'RAISED')+'  '+S.raised, 320, 296);
  b.fillStyle='#7ce0ff'; b.fillText('TIME    '+S.time, 320, 354);
  b.fillStyle='#c58bff'; b.fillText('BOSSES  '+S.bosses+' defeated', 320, 412);
  if (B.statOverride){ b.textAlign='right'; b.fillStyle='#8d99ae'; b.font='bold 22px monospace'; b.fillText('(recast as '+B.statOverride.note+')', 1160, 296); b.textAlign='left'; }
  b.fillStyle='#8d99ae'; b.font='bold 26px monospace'; b.fillText(B.quote, 320, 488);
  // v0.2 spec: URL baked into the PNG — screenshots travel without links
  b.fillStyle = B.border; b.font='bold 30px monospace';
  b.fillText('► PLAY: '+S.url, 320, 556);
  b.textAlign='right'; b.fillStyle='#5d647a'; b.font='bold 20px monospace';
  b.fillText('FOUNDER MODE — the SF startup platformer', 1160, 592);
  b.textAlign='left';
  return bc;
}

/* ============================================================
   9) SIGN RENDERER (game-style) — for previewing the new v0.2 signs
   ============================================================ */
function drawSign(c, lines, x, groundY, scale){
  c.font = `bold ${6*scale}px monospace`;
  const wmax = Math.max(...lines.map(t => c.measureText(t).width)) + 8*scale;
  const h = lines.length*8*scale;
  c.fillStyle = '#5d4a36'; c.fillRect(x, groundY-26*scale-h, wmax, h+5*scale);
  c.fillStyle = '#4a3a2a'; c.fillRect(x+wmax/2-2*scale, groundY-22*scale, 4*scale, 22*scale);
  c.fillStyle = '#ffe9b3';
  lines.forEach((t,i)=> c.fillText(t, Math.round(x+4*scale), Math.round(groundY-22*scale-h+i*8*scale+6*scale)));
  return wmax;
}

// export for gallery use (no modules in the game — plain globals, like the game itself)
if (typeof window !== 'undefined'){
  Object.assign(window, { PAL, P, drawBoardMember, drawThoughtLeader, drawThreadBomb,
    drawCompliancePhantom, drawRobotaxi, drawPlatformBoss, drawSDKCrate,
    drawDemoDayLetter, drawFounder, makeBadgeV2, BADGES, drawSign });
}
