import { ImageResponse } from '@vercel/og';
export const config = { runtime: 'edge' };
export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const raised = searchParams.get('raised') ?? '0';
  const time = searchParams.get('time') ?? '??:??';
  const won = searchParams.get('won') === '1';
  return new ImageResponse(
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column',
      justifyContent:'center', padding:'80px', background:'#141433',
      color: won ? '#ffd94a' : '#ff5a5a', fontSize:64, fontFamily:'monospace' }}>
      <div>{won ? 'CERTIFIED UNICORN' : 'OUT OF RUNWAY'}</div>
      <div style={{ color:'#7cffa5', fontSize:44 }}>RAISED ${raised}K · {time}</div>
      <div style={{ color:'#8d99ae', fontSize:32 }}>FOUNDER MODE — can you beat it?</div>
    </div>,
    { width: 1200, height: 630 }
  );
}
