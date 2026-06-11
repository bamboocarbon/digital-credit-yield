'use client';

import { useState } from 'react';

export default function SubscribeBox() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? 'done' : 'error');
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 sm:p-8 rounded-2xl text-center"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--accent-gold)' }}>
      <h2 className="text-xl sm:text-2xl font-bold mb-2">Get the Daily Snapshot</h2>
      <p className="text-sm sm:text-base mb-5" style={{ color: 'var(--text-muted)' }}>
        STRC and SATA prices, dividend insight and the daily chart — delivered to your inbox every market day.
      </p>
      {status === 'done' ? (
        <p className="text-base font-semibold" style={{ color: 'var(--accent-gold)' }}>
          You&rsquo;re subscribed — the next snapshot will land in your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com" aria-label="Email address"
            className="flex-1 px-4 py-3 rounded-lg text-sm"
            style={{ background: 'var(--bg-deep, #0a0f1e)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <button type="submit" disabled={status === 'sending'}
            className="px-6 py-3 rounded-lg font-medium text-sm min-h-[44px] transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: 'var(--accent-gold)', color: '#000' }}>
            {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-400 mt-3">Sorry, something went wrong — please try again.</p>
      )}
      <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
        Free, no spam, unsubscribe any time. Your email is never shared.
      </p>
    </div>
  );
}
