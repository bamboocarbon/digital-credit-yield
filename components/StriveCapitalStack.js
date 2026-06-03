'use client';

const tiers = [
  {
    label: 'No Debt',
    sub: 'All legacy debt retired Q1 2026 · Zero existing indebtedness · Debt-free by policy',
    tag: 'DEBT FREE',
    tagColor: '#22c55e',
    bg: 'rgba(34,197,94,0.04)',
    border: '#1f2937',
    borderLeft: '#1f2937',
    labelColor: '#6b7280',
    dashed: true,
    highlight: false,
  },
  {
    label: 'SATA',
    sub: '13% variable rate · Monthly payments · Only preferred series · Most senior security outstanding',
    tag: 'PREFERRED',
    tagColor: '#2563eb',
    bg: 'rgba(37,99,235,0.08)',
    border: '#2563eb',
    borderLeft: '#2563eb',
    labelColor: '#93c5fd',
    dashed: false,
    highlight: true,
  },
  {
    label: 'ASST Common Stock',
    sub: 'Absorbs losses first · No dividend priority · Uncapped upside from Bitcoin appreciation',
    tag: 'COMMON EQUITY',
    tagColor: '#6b7280',
    bg: 'rgba(17,24,39,0.8)',
    border: '#1f2937',
    borderLeft: '#374151',
    labelColor: '#e5e7eb',
    dashed: false,
    highlight: false,
  },
];

export default function StriveCapitalStack() {
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
              border: `1px ${tier.dashed ? 'dashed' : 'solid'} ${tier.border}`,
              borderLeft: `4px ${tier.dashed ? 'dashed' : 'solid'} ${tier.borderLeft}`,
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontWeight: 700,
                  fontSize: '0.95em',
                  color: tier.labelColor,
                  textDecoration: tier.dashed ? 'line-through' : 'none',
                  textDecorationColor: '#374151',
                }}>
                  {tier.label}
                </span>
                {tier.highlight && (
                  <span style={{
                    fontSize: '0.65em',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    background: 'rgba(37,99,235,0.15)',
                    color: '#93c5fd',
                    border: '1px solid rgba(37,99,235,0.4)',
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
        Strive Inc capital structure as of June 2026 · Source: SEC 424B5 prospectus filings
      </p>
    </div>
  );
}
