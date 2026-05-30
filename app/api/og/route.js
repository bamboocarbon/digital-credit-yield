import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const GOLD   = '#f5a623';
const NAVY   = '#0a0f1e';
const CARD   = '#111827';
const MUTED  = '#6b7280';
const BORDER = '#1e2a3a';

let fontRegular = null;
let fontBold    = null;

async function loadTTF(family, weight) {
  // No modern UA → Google Fonts returns TTF (truetype), which satori supports
  const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`)
    .then(r => r.text());
  const url = css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!url) throw new Error('Font URL not found');
  return fetch(url).then(r => r.arrayBuffer());
}

async function getFonts() {
  if (fontRegular && fontBold) return [fontRegular, fontBold];
  const [r, b] = await Promise.all([
    loadTTF('DM+Sans', 400),
    loadTTF('DM+Sans', 700),
  ]);
  fontRegular = r;
  fontBold    = b;
  return [fontRegular, fontBold];
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Digital Credit Yield';
  const sub   = searchParams.get('sub')   || '';
  const rate  = searchParams.get('rate')  || '';
  const tag   = searchParams.get('tag')   || '';

  let fonts = [];
  try {
    const [regular, bold] = await getFonts();
    fonts = [
      { name: 'DM Sans', data: regular, weight: 400 },
      { name: 'DM Sans', data: bold,    weight: 700 },
    ];
  } catch { /* render with fallback font */ }

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        background: NAVY, padding: '56px 64px',
        fontFamily: fonts.length ? 'DM Sans' : 'sans-serif',
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
            <div style={{
              display: 'flex',
              background: CARD, border: `1px solid ${BORDER}`,
              borderRadius: 14, padding: '16px 28px',
            }}>
              <span style={{ color: MUTED, fontSize: 20, fontWeight: 400 }}>
                Tracking STRC and SATA for growth
              </span>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span style={{ color: '#ffffff', fontSize: 24, fontWeight: 700 }}>digitalcredityield.com</span>
            <span style={{ color: MUTED, fontSize: 18, fontWeight: 400 }}>Preferred Stock Tracker</span>
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
