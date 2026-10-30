import { resolveStack } from '@/lib/capitalStacksLive';

const COLOURS = {
  debt: { bg: 'linear-gradient(180deg, rgba(220,38,38,0.34), rgba(220,38,38,0.14))', border: '#dc2626', text: '#fecaca', tag: '#f87171' },
  pref: { bg: 'rgba(55,65,81,0.55)', border: '#4b5563', text: '#e5e7eb', tag: '#9ca3af' },
  none: { bg: 'transparent', border: '#374151', text: '#9ca3af', tag: '#22c55e', dashed: true },
  common: { bg: 'linear-gradient(180deg, rgba(99,102,241,0.38), rgba(99,102,241,0.16))', border: '#6366f1', text: '#c7d2fe', tag: '#818cf8' },
  highlight: { bg: 'rgba(200,137,58,0.22)', border: '#c8893a', text: '#c8893a', tag: '#c8893a' },
};

// mcap is in millions of the stack's currency
const fmtMoney = (m, cur) => {
  if (m === 0) return 'None';
  if (m >= 1000) { const b = m / 1000; return `${cur}${b >= 10 ? b.toFixed(1) : b.toFixed(2).replace(/0$/, '')}bn`; }
  return `${cur}${m >= 100 ? Math.round(m) : m.toFixed(1).replace(/\.0$/, '')}m`;
};
const eyebrow = { fontSize: '0.75em', fontWeight: 600, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase' };

// Capital stack + market-cap pyramid in one. Block width scales with the SQUARE ROOT of market
// cap relative to the largest block (MSTR common): a linear scale would shrink every preferred to
// a sliver beside ~$60bn of equity; sqrt keeps them legible while still showing the credit layer
// is small against the base. Labels carry the real dollar figures.
// `ticker` picks the stack; `highlightId` (optional) overrides which row gets the "This page" highlight,
// so STRK/STRF/STRD/STRE can show Strategy's stack with their own row picked out.
export default async function CapitalPyramid({ ticker, highlightId }) {
  const stack = await resolveStack(ticker);
  if (!stack) return null;
  const { rows, currency: cur, caption } = stack;
  const max = Math.max(...rows.map(d => d.mcap));

  return (
    <div style={{ margin: '2rem auto', maxWidth: '820px' }}>
      <style>{`
        .csp-row{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr) 64px;align-items:center;gap:1rem}
        @media (max-width:640px){.csp-row{grid-template-columns:1fr 60px}.csp-bar{grid-column:1 / -1;grid-row:2}}
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
        <span style={eyebrow}>Most senior</span>
        <div style={{ flex: 1, height: '1px', background: '#374151', minWidth: '20px' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {rows.map(d => {
          const isHi = highlightId ? d.id === highlightId : d.highlight;
          const c = isHi ? COLOURS.highlight : COLOURS[d.kind];
          const pct = Math.max(14, Math.sqrt(d.mcap / max) * 100);
          const dashed = c.dashed ? 'dashed' : 'solid';
          return (
            <div key={d.id} className="csp-row">
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95em', color: c.text }}>{d.label}</span>
                  {isHi && (
                    <span style={{
                      fontSize: '0.65em', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                      background: 'rgba(200,137,58,0.15)', color: '#c8893a', border: '1px solid rgba(200,137,58,0.4)',
                      borderRadius: '4px', padding: '2px 6px',
                    }}>This page</span>
                  )}
                  <span style={{ fontSize: '0.62em', fontWeight: 600, letterSpacing: '0.06em', color: c.tag }}>{d.tag}</span>
                </div>
                <p style={{ margin: '2px 0 0', fontSize: '0.75em', color: '#6b7280', lineHeight: 1.4 }}>{d.sub}</p>
              </div>
              <div className="csp-bar" style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  title={`${d.label}: ${fmtMoney(d.mcap, cur)}`}
                  style={{
                    width: `${pct}%`, height: '38px', background: c.bg, border: `1px ${dashed} ${c.border}`,
                    borderRadius: '6px', boxShadow: isHi ? '0 0 0 1px rgba(200,137,58,0.3)' : 'none',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: '0.8em', fontWeight: 600, color: '#9ca3af', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {fmtMoney(d.mcap, cur)}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem' }}>
        <span style={eyebrow}>Most junior</span>
        <div style={{ flex: 1, height: '1px', background: '#374151' }} />
      </div>

      <p style={{ margin: '0.75rem 0 0', fontSize: '0.72em', color: '#4b5563', textAlign: 'center', lineHeight: 1.5 }}>
        Block width shows market value on a square-root scale (not linear) so the smaller layers stay visible;
        labels show the actual figure. {caption}
        {stack.anyLive && ` · Market value = shares × last closing price, updated daily${stack.countsAsOf.length ? `; share counts from filings (${stack.countsAsOf.join(', ')})` : ''}`}
      </p>
    </div>
  );
}
