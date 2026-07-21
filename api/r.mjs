// Result URL (ROADMAP §8 step 2): a share link whose unfurl is THAT RUN's
// card. Crawlers read the og tags (image = /api/og with the same params);
// humans get bounced straight into the game. Params bounded like og.mjs.
const HOST = 'https://sfspeedrun.com'; // keep in lockstep with GAME_URL in index.html
export default function handler(req, res) {
  const { searchParams } = new URL(req.url, HOST);
  const pick = (k, re, max) => (searchParams.get(k) || '').replace(re, '').slice(0, max);
  const w = searchParams.get('w') === '1' ? '1' : '0';
  const n = pick('n', /[^a-zA-Z0-9 .-]/g, 14);
  const v = String(Math.max(0, Math.min(2400000, parseInt(searchParams.get('v') || '0', 10) | 0)));
  const r2 = String(Math.max(0, Math.min(6000, parseInt(searchParams.get('r') || '0', 10) | 0)));
  const t = pick('t', /[^0-9:]/g, 7); // matches og.mjs — 100+ minute times keep their last digit
  const p = String(Math.max(0, Math.min(6, parseInt(searchParams.get('p') || '0', 10) | 0)));
  const qs = `w=${w}&n=${encodeURIComponent(n)}&v=${v}&r=${r2}&t=${encodeURIComponent(t)}&p=${p}`;
  const og = `${HOST}/api/og?${qs}`;
  // unicorn gate holds on the unfurl too: sub-$1B wins are certified horses
  const uni = parseInt(v, 10) >= 1000000;
  const title = w === '1' ? `${uni ? 'CERTIFIED UNICORN' : 'CERTIFIED HORSE'} — SF SPEEDRUN` : 'OUT OF RUNWAY — SF SPEEDRUN';
  // per-run description (n is already sanitized to [a-zA-Z0-9 .-] above, safe in an attribute)
  const fm = k => { k = parseInt(k, 10) || 0; return k >= 1000000 ? '$' + (k / 1000000).toFixed(2) + 'B' : k >= 1000 ? '$' + (k / 1000).toFixed(1) + 'M' : '$' + k + 'K'; };
  const who = n || 'a founder';
  const desc = w === '1'
    ? `${who} raised ${fm(r2)} and exited at ${fm(v)} in ${t || '??:??'}. your move.`
    : `${who} raised ${fm(r2)} and died with a ${fm(v)} valuation (down round). SF claims another founder.`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, max-age=3600');
  res.status(200).send(`<!DOCTYPE html><html><head>
<meta charset="utf-8">
<title>${title}</title>
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${HOST}/">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${og}">
<meta http-equiv="refresh" content="0;url=/">
</head><body>redirecting to the game… <a href="/">play SF SPEEDRUN</a></body></html>`);
}
