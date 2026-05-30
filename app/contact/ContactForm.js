'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError('');

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setSending(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      setError('Sorry, something went wrong. Please email us directly.');
    }
  }

  return (
    <>
      {submitted ? (
        <div className="p-6 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-lg font-semibold mb-2">Message sent!</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Thanks for getting in touch. We'll get back to you at {form.email}.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}
            className="px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent-gold)', color: '#000' }}
          >
            Send another enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Name</label>
            <input type="text" required value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-3 rounded-lg text-sm"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-3 rounded-lg text-sm"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Message</label>
            <textarea required rows={5} value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-3 rounded-lg text-sm resize-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              placeholder="Your message..." />
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <button type="submit" disabled={sending}
            className="w-full py-3 rounded-lg font-medium text-sm min-h-[44px] transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: 'var(--accent-gold)', color: '#000' }}>
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </>
  );
}
