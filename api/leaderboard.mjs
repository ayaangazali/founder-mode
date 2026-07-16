// Daily leaderboard endpoint (ROADMAP §9). Same Vercel-survival choices as
// og.mjs: Node runtime, .mjs, Node req/res signature. Talks to Supabase over
// plain REST — no SDK dependency.
//
// Env (Vercel project settings): SUPABASE_URL, SUPABASE_SERVICE_KEY.
// Until both are set, every request answers ok:false and the game quietly
// falls back to localStorage bests — the leaderboard is never load-bearing.
//
// Table (run once in the Supabase SQL editor):
//   create table founder_scores (
//     id bigint generated always as identity primary key,
//     created_at timestamptz default now(),
//     name text not null check (char_length(name) <= 14),
//     val int not null, raised int not null, time_ms int not null,
//     won boolean not null, seed int not null
//   );
//   create index founder_scores_board on founder_scores (seed, val desc, time_ms asc);
//   create unique index founder_scores_one_per_name on founder_scores (seed, name);

const SB = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;
const H = { apikey: KEY, authorization: 'Bearer ' + KEY, 'content-type': 'application/json' };

// name policy: one entry per name per day (best run wins), and the board is a
// share surface — no slurs/profanity, leetspeak included. Checked on the
// collapsed uppercase string so spacing/punctuation can't dodge it.
const BLOCKLIST = ['FUCK','SHIT','CUNT','BITCH','NIGG','NIGA','FAGG','COCK','DICK','PUSSY',
  'WHORE','SLUT','RAPE','NAZI','HITLER','PENIS','VAGINA','ASSHOLE','PEDO','KYS',
  'RETARD','TWAT','WANK','BOOB','TITTY','SEMEN','CUMS','FVCK','KKK','KIKE','SPIC',
  'COON','CHINK','TRANNY'];
function nameBlocked(name){
  const collapsed = name.toUpperCase()
    .replace(/0/g, 'O').replace(/1/g, 'I').replace(/3/g, 'E').replace(/4/g, 'A')
    .replace(/5/g, 'S').replace(/6/g, 'G').replace(/7/g, 'T').replace(/8/g, 'B')
    .replace(/9/g, 'G').replace(/@/g, 'A').replace(/\$/g, 'S')
    .replace(/[^A-Z]/g, '');
  return BLOCKLIST.some(w => collapsed.includes(w));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!SB || !KEY) return res.status(200).json({ ok: false, reason: 'leaderboard not configured yet' });

  if (req.method === 'GET') {
    const { searchParams } = new URL(req.url, 'https://sfspeedrun.com');
    const seed = parseInt(searchParams.get('seed') || '0', 10) | 0;
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '10', 10) | 0));
    // CDN absorbs the read traffic: every page load fetches the board, and a
    // viral day would burn one function invocation per visitor for identical
    // JSON. 60s staleness is invisible on a daily board. The header is set on
    // SUCCESS only — a Supabase blip must not be pinned on the edge for 60s.
    const cacheOk = () => res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    if (searchParams.get('all') === '1') {
      // all-time board: best surviving row per founder across every daily seed
      const q = `${SB}/rest/v1/founder_scores?order=won.desc,val.desc,time_ms.asc&limit=400` +
                `&select=name,val,raised,time_ms,won,seed`;
      const r = await fetch(q, { headers: H });
      if (!r.ok) return res.status(200).json({ ok: false, reason: 'board unavailable' });
      const seen = new Set(), top = [];
      for (const row of await r.json()) {
        if (seen.has(row.name)) continue;
        seen.add(row.name); top.push(row);
        if (top.length >= limit) break;
      }
      cacheOk();
      return res.status(200).json({ ok: true, top, all: true });
    }
    const q = `${SB}/rest/v1/founder_scores?seed=eq.${seed}` +
              `&order=won.desc,val.desc,time_ms.asc&limit=${limit}&select=name,val,raised,time_ms,won`;
    const r = await fetch(q, { headers: H });
    if (!r.ok) return res.status(200).json({ ok: false, reason: 'board unavailable' });
    cacheOk();
    return res.status(200).json({ ok: true, top: await r.json() });
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (!body || typeof body !== 'object') {
      let raw = ''; for await (const c of req) raw += c;
      try { body = JSON.parse(raw); } catch { body = {}; }
    }
    const name = (String(body.name || '').toUpperCase().replace(/[^A-Z0-9 .-]/g, '').trim().slice(0, 14)) || 'YOU';
    const val = body.val | 0, raised = body.raised | 0, timeMs = body.timeMs | 0;
    const won = !!body.won, seed = body.seed | 0;
    // plausibility gate — max multiple is 2.0 speed x 1.75 discipline x 1.1 corgi
    // x 100 pedigree (BUILD v1.3: the resume multiplies the raise — by design),
    // plus an absolute ceiling so nothing overflows the board or the badge.
    // raised cap 6000: a thorough full-clear legitimately crosses 3000 (coins +
    // kills + bosses + chats + interview + bell ≈ 3900, and the 30-UNDER-30
    // phantom is farmable). val allowance floors raised at 1 so $0-raised
    // pedigree deaths (val = mult/2) still post. Ceiling: $2.4B.
    if (raised < 0 || raised > 6000 || val < 0 ||
        val > Math.ceil(Math.max(raised, 1) * 390) + 10 || val > 2400000 ||
        (won && timeMs < 45000) || timeMs < 0 || timeMs > 6 * 3600 * 1000)
      return res.status(400).json({ ok: false, reason: 'diligence found irregularities' });
    if (nameBlocked(name))
      return res.status(400).json({ ok: false, reason: 'legal has concerns about that name' });
    // the board only accepts today's seed (±1 day: the client seeds off the LOCAL
    // calendar, the server runs UTC) — nobody pre-fills next week's board
    const now = new Date();
    const daySeed = Math.round((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
                    - Date.UTC(2026, 0, 1)) / 86400000) + 1;
    if (seed < daySeed - 1 || seed > daySeed + 1)
      return res.status(400).json({ ok: false, reason: 'wrong fiscal day' });

    // one row per (seed, name): keep the best run, ranked the way the board
    // ranks (won first, then val, then time — a loss must never bury a win).
    // Manual compare + a unique index backstop for insert races + a filtered
    // PATCH so two concurrent improvements can't leave the lesser one standing.
    const betterThan = old => (won !== !!old.won) ? won
      : (val > old.val || (val === old.val && timeMs < old.time_ms));
    const patchGuard = won
      ? `&or=(won.is.false,val.lt.${val},and(val.eq.${val},time_ms.gt.${timeMs}))`
      : `&won=is.false&or=(val.lt.${val},and(val.eq.${val},time_ms.gt.${timeMs}))`;
    const exQ = `${SB}/rest/v1/founder_scores?seed=eq.${seed}&name=eq.${encodeURIComponent(name)}&select=id,val,time_ms,won`;
    const ex = await fetch(exQ, { headers: H });
    const rows = ex.ok ? await ex.json() : [];
    if (rows.length){
      const old = rows[0];
      if (!betterThan(old)) return res.status(200).json({ ok: true, kept: 'existing' }); // their earlier run was stronger
      const up = await fetch(`${SB}/rest/v1/founder_scores?id=eq.${old.id}${patchGuard}`, {
        method: 'PATCH', headers: H,
        body: JSON.stringify({ val, raised, time_ms: timeMs, won }),
      });
      return res.status(200).json({ ok: up.ok, kept: 'improved' });
    }
    const r = await fetch(`${SB}/rest/v1/founder_scores`, {
      method: 'POST', headers: H,
      body: JSON.stringify({ name, val, raised, time_ms: timeMs, won, seed }),
    });
    if (r.ok) return res.status(200).json({ ok: true });
    // unique-index race: someone inserted this (seed,name) between our read and
    // write — re-read and take the compare/PATCH path once (audit)
    const ex2 = await fetch(exQ, { headers: H });
    const rows2 = ex2.ok ? await ex2.json() : [];
    if (rows2.length){
      const old2 = rows2[0];
      if (!betterThan(old2)) return res.status(200).json({ ok: true, kept: 'existing' });
      const up2 = await fetch(`${SB}/rest/v1/founder_scores?id=eq.${old2.id}${patchGuard}`, {
        method: 'PATCH', headers: H, body: JSON.stringify({ val, raised, time_ms: timeMs, won }) });
      return res.status(200).json({ ok: up2.ok, kept: 'improved' });
    }
    return res.status(200).json({ ok: false, reason: 'board hiccup — try again' });
  }

  res.status(405).json({ ok: false });
}
