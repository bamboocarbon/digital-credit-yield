'use client';

import { useState } from 'react';

export default function UnsubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, action: 'unsubscribe' }),
    });
    setStatus(res.ok ? 'done' : 'error');
  }

  if (status === 'done') {
    return (
      <div className="p-6 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-lg font-semibold mb-2">Done</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {email} has been removed from the daily snapshot list.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email" required value={email} onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com" aria-label="Email address"
        className="flex-1 px-4 py-3 rounded-lg text-sm"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
      />
      <button type="submit" disabled={status === 'sending'}
        className="px-6 py-3 rounded-lg font-medium text-sm min-h-[44px] transition-opacity hover:opacity-80 disabled:opacity-50"
        style={{ background: 'var(--accent-gold)', color: '#000' }}>
        {status === 'sending' ? 'Removing…' : 'Unsubscribe'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-red-400 mt-2">Sorry, something went wrong — please try again.</p>
      )}
    </form>
  );
}
