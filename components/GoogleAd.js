'use client';

export default function GoogleAd({ slot, format = 'auto' }) {
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
        [Google Ad Slot: {slot}]
      </div>
    );
  }
  return null;
}
