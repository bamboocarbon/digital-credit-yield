import { ImageResponse } from 'next/og';
import { blobUrl } from '@/lib/blobUrl';

export const runtime = 'edge';

// Portrait quote card — a site-generated equivalent of the dcy-app export,
// but backed by the archive's own stored text so it can render ANY date
// (the app itself can only ever show today's date), and can be shared
// straight to X, LinkedIn or Threads without the manual screenshot step.

const GOLD  = '#f5a623';
const NAVY  = '#0a0f1e';
const MUTED = '#9ca3af';

let fontRegular = null;
let fontBold    = null;

async function getFonts(origin) {
  if (fontRegular && fontBold) return [fontRegular, fontBold];
  const [r, b] = await Promise.all([
    fetch(`${origin}/fonts/inter-400.ttf`).then(res => res.arrayBuffer()),
    fetch(`${origin}/fonts/inter-700.ttf`).then(res => res.arrayBuffer()),
  ]);
  fontRegular = r;
  fontBold    = b;
  return [fontRegular, fontBold];
}

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T12:00:00Z`);
  return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
}

async function lookupEntry(date, id) {
  if (!date && !id) return null;
  try {
    const res = await fetch(blobUrl('dcy-thoughts.json'), {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const items = await res.json();
    return (id ? items.find(i => i.id === id) : items.find(i => i.date === date)) || null;
  } catch {
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date');
  const id        = searchParams.get('id');
  const textParam = searchParams.get('text');

  const entry = textParam ? null : await lookupEntry(dateParam, id);
  const text = textParam || entry?.text || '';
  const date = entry?.date || dateParam; // prefer the matched entry's own date (id lookups won't have one otherwise)

  if (!text.trim()) {
    return new Response('No thought text found for this entry', { status: 404 });
  }

  const origin = new URL(request.url).origin;
  let fonts = [];
  try {
    const [regular, bold] = await getFonts(origin);
    fonts = [
      { name: 'Inter', data: regular, weight: 400 },
      { name: 'Inter', data: bold,    weight: 700 },
    ];
  } catch { /* render with fallback font */ }

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: NAVY, fontFamily: fonts.length ? 'Inter' : 'sans-serif',
        padding: '72px 64px',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 16, height: 16, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
          <span style={{ color: '#ffffff', fontSize: 28, fontWeight: 700 }}>Digital Credit Yield</span>
          {date && <span style={{ color: MUTED, fontSize: 28, fontWeight: 400 }}>· {formatDate(date)}</span>}
        </div>

        {/* Tracking pill */}
        <div style={{
          display: 'flex', marginTop: 44, alignSelf: 'flex-start', maxWidth: '85%',
          border: `2px solid ${GOLD}`, borderRadius: 22, padding: '20px 36px',
        }}>
          <span style={{ color: GOLD, fontSize: 32, fontWeight: 700, lineHeight: 1.3 }}>
            Tracking STRC, SATA and BMNP for growth
          </span>
        </div>

        {/* Label */}
        <div style={{ display: 'flex', marginTop: 64 }}>
          <span style={{ color: MUTED, fontSize: 32, fontWeight: 700 }}>Thought for the Day</span>
        </div>

        {/* Thought text */}
        <div style={{
          display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center',
          marginTop: 32, marginBottom: 32,
        }}>
          <span style={{
            color: '#ffffff', fontSize: 62, fontWeight: 700, lineHeight: 1.28,
            textAlign: 'center',
          }}>
            {text}
          </span>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: MUTED, fontSize: 22, textAlign: 'center', lineHeight: 1.5 }}>
            Not financial advice. For informational purposes only.
          </span>
          <span style={{ color: MUTED, fontSize: 22, textAlign: 'center', lineHeight: 1.5, marginBottom: 24 }}>
            Always do your own research before making any investment decisions.
          </span>
          <span style={{ color: '#ffffff', fontSize: 30, fontWeight: 700 }}>digitalcredityield.com</span>
        </div>

      </div>
    ),
    {
      width: 1080,
      height: 1350,
      fonts,
    },
  );
}
