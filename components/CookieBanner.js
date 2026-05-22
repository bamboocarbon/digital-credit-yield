'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setVisible(true);
  }, []);

  function handleAccept() {
    localStorage.setItem('cookieConsent', 'accepted');
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem('cookieConsent', 'declined');
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4 sm:px-6"
      style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <p className="text-sm flex-1" style={{ color: 'var(--text-muted)' }}>
          We use cookies to improve your experience and serve relevant advertisements.
          By clicking Accept, you consent to our use of cookies in accordance with our{' '}
          <Link href="/privacy-policy" className="underline hover:text-white">Privacy Policy</Link>.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium rounded-lg min-h-[44px]"
            style={{ background: 'var(--accent-gold)', color: '#000' }}
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium rounded-lg min-h-[44px]"
            style={{ background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
