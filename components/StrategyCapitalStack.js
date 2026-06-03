'use client';

const tiers = [
  {
    label: 'Convertible Senior Notes',
    sub: '~$6.7B outstanding · Fixed maturity · Paid first in all scenarios',
    tag: 'DEBT',
    tagColor: '#6b7280',
    bg: 'rgba(55,65,81,0.5)',
    border: '#4b5563',
    highlight: false,
  },
  {
    label: 'STRF',
    sub: '10% fixed rate · Quarterly payments · Most senior preferred',
    tag: 'PREFERRED',
    tagColor: '#9ca3af',
    bg: 'rgba(30,42,60,0.6)',
    border: '#374151',
    highlight: false,
  },
  {
    label: 'STRC',
    sub: '11.50% variable rate · Monthly payments · Second most senior preferred',
    tag: 'PREFERRED',
    tagColor: '#c8893a',
    bg: 'rgba(200,137,58,0.08)',
    border: '#c8893a',
    highlight: true,
  },
  {
    label: 'STRE',
    sub: '10% fixed rate · Quarterly EUR payments · EEA professional investors only',
    tag: 'PREFERRED',
    tagColor: '#9ca3af',
    bg: 'rgba(30,42,60,0.6)',
    border: '#374151',
    highlight: false,
  },
  {
    label: 'STRK',
    sub: '8% fixed rate · Convertible into MSTR common stock',
    tag: 'PREFERRED',
    tagColor: '#9ca3af',
    bg: 'rgba(30,42,60,0.6)',
    border: '#374151',
    highlight: false,
  },
  {
    label: 'STRD',
    sub: '8% stated rate · Most junior preferred · Trades below par',
    tag: 'PREFERRED',
    tagColor: '#9ca3af',
    bg: 'rgba(30,42,60,0.6)',
    border: '#374151',
    highlight: false,
  },
  {
    label: 'MSTR Common Stock',
    sub: 'Absorbs losses first · No dividend priority · Uncapped upside',
    tag: 'COMMON EQUITY',
    tagColor: '#6b7280',
    bg: 'rgba(17,24,39,0.8)',
    border: '#1f2937',
    highlight: false,
  },
];

export default function StrategyCapitalStack() {
  return (
    <div style={{ margin: '2rem 0', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75em', fontWeight: 600, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase' }}>Most Senior</span>
        <div style={{ flex: 1, height: '1px', background: '#374151' }} />
        <svg width="10" height="10" viewBox="0 0 10 10" style={{ color: '#6b7280' }}>
          <path d="M5 0 L10 10 L0 10 Z" fill="currentColor" />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            style={{
              background: tier.bg,
              border: `1px solid ${tier.border}`,
              borderLeft: `4px solid ${tier.border}`,
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: tier.highlight ? '0 0 0 1px rgba(200,137,58,0.3)' : 'none',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontWeight: 700,
                  fontSize: '0.95em',
                  color: tier.highlight ? '#c8893a' : '#e5e7eb',
                }}>
                  {tier.label}
                </span>
                {tier.highlight && (
                  <span style={{
                    fontSize: '0.65em',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    background: 'rgba(200,137,58,0.15)',
                    color: '#c8893a',
                    border: '1px solid rgba(200,137,58,0.4)',
                    borderRadius: '4px',
                    padding: '2px 6px',
                  }}>
                    This site
                  </span>
                )}
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.78em', color: '#6b7280', lineHeight: 1.4 }}>
                {tier.sub}
              </p>
            </div>
            <span style={{
              fontSize: '0.65em',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: tier.tagColor,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              {tier.tag}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        <svg width="10" height="10" viewBox="0 0 10 10" style={{ color: '#6b7280' }}>
          <path d="M5 10 L10 0 L0 0 Z" fill="currentColor" />
        </svg>
        <div style={{ flex: 1, height: '1px', background: '#374151' }} />
        <span style={{ fontSize: '0.75em', fontWeight: 600, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase' }}>Most Junior</span>
      </div>

      <p style={{ margin: '0.75rem 0 0', fontSize: '0.75em', color: '#4b5563', textAlign: 'center' }}>
        Strategy Inc capital structure as of June 2026 · Source: SEC 424B5 prospectus filings
      </p>
    </div>
  );
}
