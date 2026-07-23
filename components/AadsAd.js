'use client';

const ADS_ENABLED = true;

export default function AadsAd() {
  if (!ADS_ENABLED) return null;

  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px dashed var(--border)',
        padding: '20px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '12px',
        margin: '20px 0',
        borderRadius: '8px',
      }}>
        [AADS Ad Unit 2440783]
      </div>
    );
  }

  return (
    <div style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 99998 }}>
      <iframe
        data-aa="2440783"
        src="//acceptable.a-ads.com/2440783/?size=Adaptive&background_color=transparent"
        style={{
          border: 0,
          padding: 0,
          width: '70%',
          height: 'auto',
          overflow: 'hidden',
          display: 'block',
          margin: 'auto',
        }}
      />
    </div>
  );
}
