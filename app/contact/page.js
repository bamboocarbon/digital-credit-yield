'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleSubmit(e) {
    e.preventDefault();
    window.location.href = `mailto:contact@digitalcredityield.com?subject=Enquiry from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${encodeURIComponent(form.email)}`;
    setTimeout(() => setSubmitted(true), 500);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
        For enquiries, please use the form below or email{' '}
        <a href="mailto:contact@digitalcredityield.com" className="underline hover:text-white" style={{ color: 'var(--accent-gold)' }}>
          contact@digitalcredityield.com
        </a>
      </p>

      {submitted ? (
        <div className="p-6 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-lg font-semibold mb-2">Your email client should have opened</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Please complete and send the email from your mail app. If it didn't open, you can email us directly at{' '}
            <a href="mailto:contact@digitalcredityield.com" className="underline" style={{ color: 'var(--accent-gold)' }}>
              contact@digitalcredityield.com
            </a>
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
          <button type="submit"
            className="w-full py-3 rounded-lg font-medium text-sm min-h-[44px] transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent-gold)', color: '#000' }}>
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
