// Dynamic share-badge endpoint (ROADMAP §8), ported to what Vercel actually
// runs in 2026: Node runtime (edge WASM fails platform-wide), .mjs (ESM-only
// dependency), Node req/res signature (req.url is a bare path here), and
// satori element objects instead of JSX (zero-config doesn't compile .jsx).
import { ImageResponse } from '@vercel/og';

const el = (type, style, children) => ({ type, props: { style, children } });

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url, 'https://founder-mode-kit.vercel.app');
  const raised = searchParams.get('raised') ?? '0';
  const time = searchParams.get('time') ?? '??:??';
  const won = searchParams.get('won') === '1';
  const img = new ImageResponse(
    el('div', {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '80px', background: '#141433',
      color: won ? '#ffd94a' : '#ff5a5a', fontSize: 64, fontFamily: 'monospace',
    }, [
      el('div', null, won ? 'CERTIFIED UNICORN' : 'OUT OF RUNWAY'),
      el('div', { color: '#7cffa5', fontSize: 44 }, `RAISED $${raised}K · ${time}`),
      el('div', { color: '#8d99ae', fontSize: 32 }, 'FOUNDER MODE — can you beat it?'),
    ]),
    { width: 1200, height: 630 }
  );
  const buf = Buffer.from(await img.arrayBuffer());
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(buf);
}
