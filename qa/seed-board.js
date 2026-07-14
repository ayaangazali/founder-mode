// seed-board.js — populate today's daily leaderboard with a fictional founding
// class (owner call 2026-07-14: an empty board doesn't make anyone compete).
// Posts through the LIVE /api/leaderboard endpoint so every row passes the same
// plausibility gate, profanity filter, and one-per-(seed,name) rule as a real
// run. All names are invented archetypes (canon rule 3 — no real people, no
// real brands). Values are tuned to be beatable: a decent human win outranks
// most of the class; a pedigree win takes #1.
//
// The board is daily — rows key to today's SEED_N and age out tomorrow.
// Re-run any morning you want the bar pre-set:  node qa/seed-board.js
// Dry run (print, no POST):                      node qa/seed-board.js --dry
const HOST = 'https://foundermode.vercel.app';
const DRY = process.argv.includes('--dry');

// same formula as index.html: seed #1 = 2026-01-01, local calendar date
const _t = new Date();
const SEED_N = Math.round((Date.UTC(_t.getFullYear(), _t.getMonth(), _t.getDate())
                          - Date.UTC(2026, 0, 1)) / 86400000) + 1;

const mm = s => s * 1000; // seconds → ms
// [name, won, val ($K), raised ($K), time seconds]
const CLASS_OF_TODAY = [
  // the winners' circle — mostly modest multiples; two pedigree flexes on top
  ['NEPOBABYCEO',  true, 580000, 2100, 372],
  ['EXSYNERGYPM',  true, 310000, 1550, 527],
  ['DROPOUTDEV',   true,  42000, 2050, 303],
  ['RAMENPROFIT',  true,  18500, 1800, 441],
  ['SHIPITSALLY',  true,   9800, 1720, 295],
  ['GRINDSETGREG', true,   7400, 1400, 578],
  ['DEMODAYDAN',   true,   5200, 1250, 662],
  ['LATEPIVOT',    true,   3900,  980, 760],
  // everyone else ran out of runway, which is canon
  ['STEALTHMODE',  false, 15500, 310, 214], ['GPTWRAPPER',   false, 4300, 480, 355],
  ['PREREVENUE',   false,   380,  45,  68], ['BURNRATEBRAD', false, 2900, 520, 401],
  ['DECKDADDY',    false,  5100, 610, 379], ['CACQUEEN',     false, 1900, 290, 246],
  ['CHURNVICTIM',  false,   700, 130, 144], ['B2BBECKY',     false, 2400, 350, 312],
  ['MVPMARCO',     false,   990, 220, 201], ['SEEDSTRAPPED', false,  410,  75,  96],
  ['ANGELBAIT',    false,  3700, 430, 358], ['PIVOTPETE',    false, 1650, 380, 296],
  ['DOWNROUNDDAN', false,  2200, 510, 388], ['ARRGONAUT',    false, 4900, 470, 344],
  ['LTVLARRY',     false,  1300, 260, 233], ['SOMASLUGGER',  false, 3300, 590, 456],
  ['FOMOFOUNDER',  false,  1500, 340, 289], ['HYPECYCLE',    false, 2800, 410, 315],
  ['RUNWAYZERO',   false,   120,  28,  51], ['TERMSHEETTIM', false, 4100, 550, 427],
  ['EXITDREAMER',  false,   850, 190, 176], ['UNICORNLARP',  false, 6800, 620, 471],
  ['HOODIEHARRY',  false,  1100, 240, 218], ['QUIETQUITTER', false,  350,  88, 109],
  ['SPRINTZOMBIE', false,  1450, 330, 301], ['OKRSANDY',     false, 1200, 270, 251],
  ['VESTINGCLIFF', false,  2600, 460, 366], ['MOATLESS',     false,  620, 150, 158],
  ['FREEMIUMFRED', false,  1700, 390, 322], ['INTERNARMY',   false, 3900, 510, 409],
  ['STANFURDGRAD', false,  6200, 430, 341], ['COLDDMKING',   false, 1550, 360, 305],
  ['SERIESAAAH',   false,  2500, 490, 377], ['BOOTSTRAPBOB', false,  900, 210, 189],
  ['WEBSCALE',     false,  1350, 300, 266], ['LEANCANVAS',   false, 1050, 250, 227],
  ['TAMTOMMY',     false,  1400, 320, 284], ['GHOSTEDBYVC',  false, 1900, 410, 336],
  ['PMFPILGRIM',   false,  1600, 370, 311], ['RUGPULLED',    false,  430,  95, 121],
  ['BETABLASTER',  false,  1250, 280, 243], ['ZIRPNOSTALGIA',false, 2300, 440, 352],
];

(async () => {
  console.log(`seeding seed #${SEED_N} on ${HOST} with ${CLASS_OF_TODAY.length} founders${DRY ? ' (DRY RUN)' : ''}`);
  let ok = 0, fail = 0;
  for (const [name, won, val, raised, secs] of CLASS_OF_TODAY){
    if (val > Math.ceil(Math.max(raised, 1) * 390) + 10 || val > 2400000 || raised > 6000 || (won && secs < 45))
      { console.log(`SKIP ${name} — would fail the plausibility gate`); fail++; continue; }
    if (DRY){ console.log(`would post ${name} won=${won} val=${val} raised=${raised} t=${secs}s`); ok++; continue; }
    const r = await fetch(HOST + '/api/leaderboard', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, won, val, raised, timeMs: mm(secs), seed: SEED_N }),
    });
    const j = await r.json().catch(() => ({}));
    if (j.ok) ok++; else { fail++; console.log(`FAIL ${name}: ${j.reason || r.status}`); }
    await new Promise(s => setTimeout(s, 120)); // be polite to the function
  }
  console.log(`done: ${ok} posted, ${fail} failed`);
  process.exitCode = fail ? 1 : 0;
})();
