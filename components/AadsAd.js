'use client';

import { useEffect, useState } from 'react';
import { isConsentGranted } from '@/lib/consent';

const ADS_ENABLED = true;

export default function AadsAd() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    setGranted(isConsentGranted());
    const onChange = () => setGranted(isConsentGranted());
    window.addEventListener('cookieConsentChange', onChange);
    return () => window.removeEventListener('cookieConsentChange', onChange);
  }, []);

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
        [AADS Ad Unit 2454479]
      </div>
    );
  }

  // A-Ads' own iframe sets cookies and serves interest-based ads (see
  // https://aads.com/privacy_policy/) — gated the same way as Google
  // Analytics, so it doesn't load for EEA/UK visitors before they accept.
  if (!granted) return null;

  return (
    <div style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 99998 }}>
      <iframe
        data-aa="2454479"
        src="//acceptable.a-ads.com/2454479/?size=Adaptive&background_color=transparent"
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
