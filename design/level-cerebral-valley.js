/* ============================================================
   FOUNDER MODE — v1.0 LEVEL DATA · CEREBRAL VALLEY
   Complete, validated world-stretch package.
   THE RISKIEST v1.0 REFACTOR, PRE-SOLVED AS DATA.

   Method: the new zone is INSERTED AT x=3956 (an existing pit,
   so no ground segment gets split). Every world x >= 3956 in the
   original data shifts +1700. This file contains (A) the shift
   spec, (B) the new zone's data verbatim, (C) constants to update,
   (D) the integration checklist.
   ============================================================ */

const INS = 3956;      // insertion point (the pit between segs [3036,3900] and [3956,4600])
const SHIFT = 1700;    // Cerebral Valley's width
const NEW_LEVEL_W = 9200;  // was 7500

/* ---------------- (A) THE SHIFT RULE ----------------
   For every array in LEVEL DATA: any x-coordinate >= 3956 gets +1700.
   Applies to: segs (both ends), plats[0], coinRows.x, enemyDefs.x,
   powerDefs.x, signs.x, bosses (x, trigger, wall), checkpoints.
   One-liner Claude Code can apply per array:
     arr.map(v => v >= 3956 ? v + 1700 : v)
   (segs: map both elements; object arrays: map the x field.)
--------------------------------------------------------- */

/* ---------------- (B) NEW ZONE DATA (3956..5656) ----------------
   Paste these entries into the corresponding arrays, keeping arrays
   sorted by x for sanity. All values validated (see notes at bottom).
------------------------------------------------------------------ */

// ground segments — pits are 60 / 48 / 52 px (max jumpable ≈ 60 at base speed)
const CV_SEGS = [ [3956,4420], [4480,4900], [4948,5320], [5372,5656] ];

// Victorian-scaffold platforming: three climbing stacks + boss approach.
// [x, y, w] — one-way, drawn as crates (city style; zone is pre-Cloud).
// GEOMETRY RULE (calibrated to real physics: apex 62px, horiz carry ~54px
// base / ~80px coffee): lows rise <=52 from ground; every step up has
// rise <=34 and edge-gap <=48. All stacks BASE-SPEED reachable.
const CV_PLATS = [
  [4050,184,56],[4154,150,56],[4258,116,64],          // stack 1: the hacker-house climb
  [4560,180,72],[4680,146,64],[4792,180,64],          // stack 2: over the phantom's patrol
  [5000,180,56],[5104,146,56],[5208,180,72],          // stack 3: above the robotaxi route
  [5420,180,64]                                       // boss-arena approach perch
];

// coins — reward the climbs (18px above each plat); jump-bait pairs at pits
const CV_COINROWS = [
  {x:4060,y:166,n:3},{x:4164,y:132,n:3},{x:4268,y:98,n:4},
  {x:4570,y:162,n:4},{x:4690,y:128,n:3},
  {x:5010,y:162,n:3},{x:5114,y:128,n:4},{x:5430,y:162,n:4},
  {x:4430,y:200,n:2},{x:4910,y:200,n:2},{x:5330,y:200,n:2}
];

// enemies — new types t (THOUGHT LEADER, flyer) and c (COMPLIANCE PHANTOM,
// terrain-ignoring drifter); one g + one m for familiarity. Sprites: design/sprites.js.
const CV_ENEMYDEFS = [
  {x:4100,t:'g'}, {x:4250,t:'t'}, {x:4500,t:'c'},
  {x:4750,t:'t'}, {x:5050,t:'c'}, {x:5200,t:'t'}, {x:4880,t:'m'}
];

// ROBOTAXI (neutral moving platform) — patrols seg 3, stops 2s mid-route
const CV_ROBOTAXI = { x0:4960, x1:5300, y:'GROUND_Y-14', speed:0.7, stopEvery:220, stopFor:120 };

// powerups
const CV_POWERDEFS = [ {x:4715,y:122,t:'coffee'}, {x:5245,y:150,t:'sheet'} ];

// signs (jokes locked in MASTER-PLAN voice)
const CV_SIGNS = [
  {x:3980, l:['CEREBRAL VALLEY','11 founders per house','1 GPU']},
  {x:4450, l:['HACKER HOUSE','rent: $2400/bunk','equity accepted']},
  {x:4950, l:['GPU FOR SALE','never used','(waitlist: 14 months)']},
  {x:5250, l:['DEMO DAY 5PM','pitch: 2 min','trauma: lifetime']},
  {x:5310, l:['WARNING: DEVREL','OMNICORP CLOUD','"we love startups"']}
];

// mid-boss: THE PLATFORM (OMNICORP CLOUD DevRel mecha) — full spec in
// MASTER-PLAN §1.7 + sprites.js drawPlatformBoss/drawSDKCrate
const CV_BOSS = {
  id:'platform', x:5560, y:'GROUND_Y-48', w:40, h:48,
  hp:4, maxhp:4, trigger:5390, wall:5640, active:false, dead:false,
  name:'THE PLATFORM',
  quips:['BUILD ON US','WE LOVE STARTUPS','FREE CREDITS*','THE API CHANGED THIS MORNING','YOUR CATEGORY IS OUR KEYNOTE'],
  // attack: every 140f drop an SDK crate at player.x; crate falls with GRAV,
  // lands, becomes a TEMPORARY plats entry for 480f (8s), then despawns
  // with popup 'DEPRECATION NOTICE'. Crates are also the ladder to its head.
  atkEvery:140, crateLifeF:480, killBonus:350, killLine:'DEPRECATED! +$350K'
};

/* ---------------- (C) CONSTANTS & CODE POINTS TO UPDATE ---------------- */
const CODE_UPDATES = [
  "LEVEL_W: 7500 -> 9200",
  "zoneName(): x<1900 SOMA · x<3900 THE MISSION · x<5656 CEREBRAL VALLEY · x<7160 SAND HILL ROAD · else THE CLOUD",
  "checkpoints: [20, 1930, 3970, 5750, 7240]   // one per zone start (5 zones now)",
  "MOVE the 'SAND HILL ROAD pitch or perish' sign: x 3620 -> 5720 (it sits before the insertion point but announces a zone that moved)",
  "cloud-style thresholds (three hardcoded x checks): plats cloud-drawing 'pl[0] > 5460' -> '> 7160' · cloud ground 's[0] >= 5504' -> '>= 7204' · zone check in draw() unchanged (uses zoneName)",
  "golden gate anchor in drawBG(): ggx = 6900 - cam*0.85 -> 8600 - cam*0.85",
  "IPO bell: win check 'p.x > 7400' -> '> 9100' · bell draw 'bx = 7430 - cam' -> '9130 - cam'",
  "bosses array: vc trigger/x/wall +1700 (6420/6850/7030) · ai +1700 (8460/8780/9040) · insert CV_BOSS between them",
  "playtest.js teleports: 4730 -> 6430 (vc), and add a platform-boss check at 5400"
];

/* ---------------- (D) INTEGRATION CHECKLIST (one Claude Code session) ----------------
 1. Apply SHIFT rule to all 8 arrays (mechanical, do first, commit alone)
 2. Apply CODE_UPDATES constants (commit)
 3. Run tests with updated teleport coords — game must be beatable BEFORE new content
 4. Paste CV_* data into arrays (commit)
 5. Add enemy branches: 't' flyer (sine hover, no gravity, i-frames while posting),
    'c' drifter (no gravity, ignores segs/plats, alpha 0.72) — sprites from design/sprites.js
 6. Robotaxi: moving plats entry + drawRobotaxi (it is NOT an enemy — no hurt collision)
 7. THE PLATFORM boss: extend drawBoss with 'platform' case + SDK-crate attack block
 8. New playtest assertions: reach CV checkpoint, kill platform boss, full win at x>9100
 VALIDATION DONE (design/level-preview.html renders + machine-checks this data
 against calibrated v0.1 physics: jump apex ≈62px, horizontal carry ≈70px):
   ✓ all 12 pits <= 60px · ✓ all 34 platforms reachable (rise≤52 / gap≤70)
   ✓ no sign or enemy inside any of the 3 boss arenas
   ✓ checkpoints on solid ground · ✓ boss arenas on continuous ground
   ✓ coins over pits only as legal jump-bait (jumpable pit + arc height)
------------------------------------------------------------------------- */

/* ---------------- (E) LATENT v0.1 FINDING (from validation) ----------------
 The validator, calibrated to the real physics (apex 62px, carry ~54px base /
 ~80px coffee), found that several SHIPPED v0.1 decorative platforms are
 unreachable, so their coins can never be collected:
   [3290,150,56]  rise-from-neighbors ok but 84px gap  — needs gap<=54 (or 80 w/ coffee)
   [3700,168,72]  rise from ground 64px > 62 apex      — lower to y>=172
   [4250,148,64]  86px gap from both neighbors          — nudge x or lower
   [5750,142,64]  78px gap (coffee-only, coffee nearby) — arguably fine, flag only
   [6450,168,72]  rise from ground 64px > 62 apex      — lower to y>=172
 Suggested one-line fixes (v0.2 difficulty pass): lower the two y:168 plats to
 y:174, and retile the two isolated mids to gap<=54 from a neighbor. Harmless
 (all optional bonus plats) but "100% coins" is currently impossible.
--------------------------------------------------------------------------- */

if (typeof module !== 'undefined') module.exports = { INS, SHIFT, NEW_LEVEL_W, CV_SEGS, CV_PLATS, CV_COINROWS, CV_ENEMYDEFS, CV_ROBOTAXI, CV_POWERDEFS, CV_SIGNS, CV_BOSS, CODE_UPDATES };
