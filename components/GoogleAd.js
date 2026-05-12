'use client';

import { useEffect } from 'react';

export default function GoogleAd({ slot, format = 'auto' }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

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

  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
