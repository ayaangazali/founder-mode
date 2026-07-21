// Per-run share card (ROADMAP §8, wired at last — this endpoint was dead code
// for a week). Rendered to match the current in-game badge: outcome, founder
// name, RAISED, TIME, VALUATION, pedigree. Same Vercel-survival choices as
// ever: Node runtime, .mjs, satori element objects (zero-config compiles no
// JSX; edge WASM is dead platform-wide).
//
// Params are strictly bounded before they touch the renderer — this endpoint
// is public and its cache keys on the query string.
import { ImageResponse } from '@vercel/og';

const el = (type, style, children) => ({ type, props: { style, children } });
const PED_LABELS = ['', 'SERIAL FOUNDER ×5', 'STANFURD DROPOUT ×10', '30 UNDER 30 ×15',
  'TEAL FELLOW ×20', 'NEPO FOUNDER ×50', 'ex-SYNERGY.AI ×100'];

function fmtMoney(k){
  return k >= 999995 ? '$' + (k / 1000000).toFixed(2) + 'B'
       : k >= 1000 ? '$' + (k / 1000).toFixed(2) + 'M' : '$' + k + 'K';
}

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url, 'https://sfspeedrun.com');
  const won = searchParams.get('w') === '1';
  const name = (searchParams.get('n') || '').toUpperCase().replace(/[^A-Z0-9 .-]/g, '').slice(0, 14);
  const val = Math.max(0, Math.min(2400000, parseInt(searchParams.get('v') || '0', 10) | 0));
  const raised = Math.max(0, Math.min(6000, parseInt(searchParams.get('r') || '0', 10) | 0));
  const time = (searchParams.get('t') || '').replace(/[^0-9:]/g, '').slice(0, 7) || '??:??'; // 100+ minute runs are legal (6h cap) — "103:22" must not truncate to "103:2"
  const ped = PED_LABELS[Math.max(0, Math.min(6, parseInt(searchParams.get('p') || '0', 10) | 0))];

  const rows = [
    el('div', { color: won ? '#ffd94a' : '#ff5a5a', fontSize: 64, fontWeight: 700 },
      won ? (val >= 1000000 ? 'CERTIFIED UNICORN' : 'CERTIFIED HORSE') : 'OUT OF RUNWAY'), // unicorn gate: same $1B bar as the emoji
    name ? el('div', { color: '#7ce0ff', fontSize: 34 }, `FOUNDER: ${name}`) : null,
    el('div', { color: '#7cffa5', fontSize: 44 }, `RAISED  ${fmtMoney(raised)}`),
    el('div', { color: '#7ce0ff', fontSize: 44 }, `TIME    ${time}`),
    el('div', { color: '#ffd94a', fontSize: 50 }, `VALUATION ${fmtMoney(val)}`),
    ped ? el('div', { color: '#ff8c37', fontSize: 30 }, `PEDIGREE: ${ped}`) : null,
    el('div', { color: '#8d99ae', fontSize: 28, marginTop: 20 },
      'FOUNDER MODE — the SF startup platformer. can you beat it?'),
  ].filter(Boolean);

  const img = new ImageResponse(
    el('div', {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '70px 80px', background: '#141433',
      fontFamily: 'monospace', gap: 14, borderTop: '12px solid ' + (won ? '#ffd94a' : '#d64550'),
      borderBottom: '12px solid ' + (won ? '#ffd94a' : '#d64550'),
    }, rows),
    { width: 1200, height: 630 }
  );
  const buf = Buffer.from(await img.arrayBuffer());
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, max-age=3600');
  res.status(200).send(buf);
}
