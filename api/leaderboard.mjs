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

const SB = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;
const H = { apikey: KEY, authorization: 'Bearer ' + KEY, 'content-type': 'application/json' };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!SB || !KEY) return res.status(200).json({ ok: false, reason: 'leaderboard not configured yet' });

  if (req.method === 'GET') {
    // CDN absorbs the read traffic: every page load fetches the board, and a
    // viral day would burn one function invocation per visitor for identical
    // JSON. 60s staleness is invisible on a daily leaderboard.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    const { searchParams } = new URL(req.url, 'https://foundermode.vercel.app');
    const seed = parseInt(searchParams.get('seed') || '0', 10) | 0;
    const q = `${SB}/rest/v1/founder_scores?seed=eq.${seed}` +
              `&order=val.desc,time_ms.asc&limit=10&select=name,val,raised,time_ms,won`;
    const r = await fetch(q, { headers: H });
    if (!r.ok) return res.status(200).json({ ok: false, reason: 'board unavailable' });
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
    if (raised < 0 || raised > 3000 || val < 0 || val > Math.ceil(raised * 3.9) + 10 ||
        (won && timeMs < 45000) || timeMs < 0 || timeMs > 6 * 3600 * 1000)
      return res.status(400).json({ ok: false, reason: 'diligence found irregularities' });
    const r = await fetch(`${SB}/rest/v1/founder_scores`, {
      method: 'POST', headers: H,
      body: JSON.stringify({ name, val, raised, time_ms: timeMs, won, seed }),
    });
    return res.status(200).json({ ok: r.ok });
  }

  res.status(405).json({ ok: false });
}
