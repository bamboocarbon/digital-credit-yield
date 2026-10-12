// Generic top-to-bottom capital stack, styled to match StrategyCapitalStack / StriveCapitalStack.
// tiers: [{ label, sub, tag, accent?, highlight?, dashed? }]
export default function CapitalStackDiagram({ tiers, caption, accent = '#c8893a' }) {
  const label = { fontSize: '0.75em', fontWeight: 600, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase' };
  return (
    <div style={{ margin: '1.25rem auto', maxWidth: '640px', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={label}>Most Senior</span>
        <div style={{ flex: 1, height: '1px', background: '#374151' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {tiers.map((tier) => {
          const edge = tier.highlight ? accent : '#374151';
          const style = tier.dashed ? 'dashed' : 'solid';
          return (
            <div
              key={tier.label}
              style={{
                background: tier.highlight ? 'rgba(200,137,58,0.08)' : 'rgba(17,24,39,0.8)',
                border: `1px ${style} ${edge}`,
                borderLeft: `4px ${style} ${edge}`,
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: tier.highlight ? '0 0 0 1px rgba(200,137,58,0.3)' : 'none',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 700, fontSize: '0.95em', color: tier.highlight ? accent : '#e5e7eb' }}>{tier.label}</span>
                <p style={{ margin: '3px 0 0', fontSize: '0.78em', color: '#6b7280', lineHeight: 1.4 }}>{tier.sub}</p>
              </div>
              <span style={{ fontSize: '0.65em', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: tier.highlight ? accent : '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {tier.tag}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        <div style={{ flex: 1, height: '1px', background: '#374151' }} />
        <span style={label}>Most Junior</span>
      </div>
      {caption && <p style={{ margin: '0.75rem 0 0', fontSize: '0.75em', color: '#4b5563', textAlign: 'center' }}>{caption}</p>}
    </div>
  );
}
