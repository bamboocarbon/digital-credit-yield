import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Node runtime (not edge): the edge runtime returned 503 on Cloud Run after the 2026-11-11 move off Vercel.
// Fonts and the background photo are read from public/ on disk instead of fetched from our own URL.
export const runtime = 'nodejs';

const GOLD   = '#f5a623';
const NAVY   = '#0a0f1e';
const CARD   = '#111827';
const MUTED  = '#b9c0cc'; // light grey — must stay readable over the photo background

let fontRegular = null;
let fontBold    = null;

async function getFonts() {
  if (fontRegular && fontBold) return [fontRegular, fontBold];
  const dir = join(process.cwd(), 'public', 'fonts');
  const [r, b] = await Promise.all([readFile(join(dir, 'inter-400.ttf')), readFile(join(dir, 'inter-700.ttf'))]);
  fontRegular = r.buffer.slice(r.byteOffset, r.byteOffset + r.byteLength);
  fontBold    = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
  return [fontRegular, fontBold];
}

let bgDataUri = null;
async function getBackground() {
  if (bgDataUri) return bgDataUri;
  try {
    const buf = await readFile(join(process.cwd(), 'public', 'og-bg.jpg'));
    bgDataUri = `data:image/jpeg;base64,${buf.toString('base64')}`;
  } catch { bgDataUri = ''; }
  return bgDataUri;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Digital Credit Yield';
  const sub   = searchParams.get('sub')   || '';
  const rate  = searchParams.get('rate')  || '';
  const tag   = searchParams.get('tag')   || '';

  const bg = await getBackground();
  let fonts = [];
  try {
    const [regular, bold] = await getFonts();
    fonts = [
      { name: 'Inter', data: regular, weight: 400 },
      { name: 'Inter', data: bold,    weight: 700 },
    ];
  } catch { /* render with fallback font */ }

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', position: 'relative',
        background: NAVY,
        fontFamily: fonts.length ? 'Inter' : 'sans-serif',
      }}>

        {/* Photo background + legibility overlay */}
        <img
          src={bg}
          width={1200}
          height={630}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(180deg, rgba(10,15,30,0.35) 0%, rgba(10,15,30,0.45) 45%, rgba(10,15,30,0.84) 100%)',
        }} />

        {/* Extra bottom padding keeps the footer clear of X's black caption
            overlay, which covers roughly the bottom 90px of the card */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          width: '100%', height: '100%', padding: '56px 64px 130px',
        }}>

        {/* Top bar — branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'auto' }}>
          <div style={{ width: 12, height: 12, background: GOLD, borderRadius: 3, flexShrink: 0 }} />
          <span style={{ color: MUTED, fontSize: 22, fontWeight: 400 }}>Digital Credit Yield</span>
          {tag && (
            <div style={{
              display: 'flex', marginLeft: 16,
              background: 'rgba(245,166,35,0.12)', border: `1px solid ${GOLD}`,
              borderRadius: 8, padding: '4px 14px',
              color: GOLD, fontSize: 16, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {tag}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 52 }}>
          <div style={{
            color: '#ffffff', fontSize: 72, fontWeight: 700,
            lineHeight: 1.1, marginBottom: sub ? 18 : 0,
            letterSpacing: '-0.02em',
          }}>
            {title}
          </div>
          {sub && (
            <div style={{ color: MUTED, fontSize: 30, fontWeight: 400 }}>
              {sub}
            </div>
          )}
        </div>

        {/* Footer row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          {rate ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              background: CARD, border: `1px solid ${GOLD}`,
              borderRadius: 14, padding: '16px 28px', gap: 4,
            }}>
              <span style={{ color: MUTED, fontSize: 16, fontWeight: 400 }}>Annual Dividend Rate</span>
              <span style={{ color: GOLD, fontSize: 54, fontWeight: 700, lineHeight: 1 }}>{rate}</span>
            </div>
          ) : (
            <div style={{ display: 'flex' }}>
              <span style={{ color: GOLD, fontSize: 20, fontWeight: 400 }}>
                Tracking STRC, SATA, BMNP, CHAD and MORE for growth
              </span>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span style={{ color: '#ffffff', fontSize: 24, fontWeight: 700 }}>digitalcredityield.com</span>
            <span style={{ color: MUTED, fontSize: 18, fontWeight: 400 }}>Preferred Stock Tracker</span>
          </div>
        </div>

        </div>

      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    },
  );
}
