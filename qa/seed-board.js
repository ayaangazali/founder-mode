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
const HOST = 'https://sfspeedrun.com'; // re-run against the new host after the domain cutover
const DRY = process.argv.includes('--dry');

// same formula as index.html: seed #1 = 2026-01-01, local calendar date
const _t = new Date();
const SEED_N = Math.round((Date.UTC(_t.getFullYear(), _t.getMonth(), _t.getDate())
                          - Date.UTC(2026, 0, 1)) / 86400000) + 1;

const mm = s => s * 1000; // seconds → ms
// [name, won, val ($K), raised ($K), time seconds]
const CLASS_OF_TODAY = [
  // v2 roster (owner call): reads like a real player base. Unicorn gate note
  // (2026-07-14): 🦄 needs VALUATION ≥ $1B — every winner below is sub-$1B, so
  // the whole class renders 🐴 (NEPOBABYCEO at $580M is a horse, which is funnier). — common American /
  // Mexican / Asian first names, a few one-word originals, and the best of the
  // troll handles kept. Still zero real identifiable people (canon rule 3).
  // the winners' circle
  ['NEPOBABYCEO', true, 580000, 2100, 372],
  ['WEI CHEN',    true, 310000, 1550, 527],
  ['JAKE',        true,  42000, 2050, 303],
  ['PRIYA',       true,  18500, 1800, 441],
  ['SOFIA G',     true,   9800, 1720, 295],
  ['RAMENPROFIT', true,   7400, 1400, 578],
  ['MINJI KIM',   true,   5200, 1250, 662],
  ['CARLOS M',    true,   3900,  980, 760],
  // out of runway — the realistic crowd
  ['TYLER',      false, 2900, 520, 401], ['EMILY R',    false, 1900, 290, 246],
  ['BRANDON',    false,  700, 130, 144], ['SARAH K',    false, 2400, 350, 312],
  ['MIKE D',     false,  990, 220, 201], ['ASHLEY',     false,  410,  75,  96],
  ['CHRIS P',    false, 3700, 430, 358], ['MATT H',     false, 1650, 380, 296],
  ['KYLE',       false, 2200, 510, 388], ['HANNAH B',   false, 4900, 470, 344],
  ['JOSH T',     false, 1300, 260, 233], ['MEGAN',      false, 3300, 590, 456],
  ['ALEJANDRO',  false, 1500, 340, 289], ['DIEGO',      false, 2800, 410, 315],
  ['VALENTINA',  false,  120,  28,  51], ['LUPITA',     false, 4100, 550, 427],
  ['XIMENA',     false,  850, 190, 176], ['JORGE R',    false, 1100, 240, 218],
  ['KENJI',      false,  350,  88, 109], ['RAJ P',      false, 1450, 330, 301],
  ['HIROSHI',    false, 1200, 270, 251], ['ANH NGUYEN', false, 2600, 460, 366],
  ['MEI LIN',    false,  620, 150, 158], ['ARJUN S',    false, 1700, 390, 322],
  ['YUKI T',     false, 3900, 510, 409], ['JIN W',      false, 6200, 430, 341],
  ['SANA',       false, 1550, 360, 305], ['VIKRAM',     false, 2500, 490, 377],
  ['ZOZO',       false,  900, 210, 189], ['KAIROS',     false, 1350, 300, 266],
  ['BLU J',      false, 1050, 250, 227], ['NIMBUS',     false, 1400, 320, 284],
  ['JUNIPER',    false, 1600, 370, 311], ['MOSS',       false, 1250, 280, 243],
  // the troll bench, by popular demand
  ['GPTWRAPPER',   false,  4300, 480, 355], ['STEALTHMODE',  false, 15500, 310, 214],
  ['RUGPULLED',    false,   430,  95, 121], ['DECKDADDY',    false,  5100, 610, 379],
  ['PREREVENUE',   false,   380,  45,  68], ['GHOSTEDBYVC',  false,  1900, 410, 336],
  ['ZIRPNOSTALGIA',false,  2300, 440, 352], ['UNICORNLARP',  false,  6800, 620, 471],
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
