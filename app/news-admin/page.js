'use client';

import { useState, useEffect } from 'react';

export const metadata = undefined; // client component — no metadata export

const TAGS = ['STRC', 'SATA', 'BMNP', 'Market'];

const TAG_COLORS = {
  STRC:   { bg: '#14532d', text: '#4ade80' },
  SATA:   { bg: '#1e3a8a', text: '#93c5fd' },
  BMNP:   { bg: '#3b0764', text: '#c4b5fd' },
  Market: { bg: '#1f2937', text: '#9ca3af' },
};

export default function NewsAdmin() {
  const [password, setPassword]   = useState('');
  const [authed, setAuthed]       = useState(false);
  const [authError, setAuthError] = useState('');
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [form, setForm]           = useState({
    date: new Date().toISOString().split('T')[0],
    tag: 'STRC',
    headline: '',
    description: '',
    url: '',
  });
  const [saving, setSaving]   = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('news_admin_pw');
    if (stored) { setPassword(stored); verifyAndLoad(stored); }
  }, []);

  async function verifyAndLoad(pw) {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error();
      // Verify password with a test POST that we won't save
      const test = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pw}` },
        body: JSON.stringify({ headline: '__test__', tag: 'STRC', _test: true }),
      });
      if (test.status === 401) { setAuthError('Incorrect password.'); setLoading(false); return; }
      // Delete the test item immediately
      const created = await test.json();
      if (created.id) {
        await fetch('/api/news', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pw}` },
          body: JSON.stringify({ id: created.id }),
        });
      }
      sessionStorage.setItem('news_admin_pw', pw);
      setAuthed(true);
      setAuthError('');
      const data = await (await fetch('/api/news')).json();
      setItems(data);
    } catch {
      setAuthError('Something went wrong.');
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.headline.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
        body: JSON.stringify(form),
      });
      const item = await res.json();
      setItems(prev => [item, ...prev]);
      setForm(f => ({ ...f, headline: '', description: '', url: '' }));
      setFeedback('Saved ✓');
      setTimeout(() => setFeedback(''), 2500);
    } catch {
      setFeedback('Error saving.');
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    await fetch('/api/news', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
      body: JSON.stringify({ id }),
    });
    setItems(prev => prev.filter(i => i.id !== id));
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#111827', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '36px 32px', width: '100%', maxWidth: '380px' }}>
          <h1 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>News Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && verifyAndLoad(password)}
            style={{ width: '100%', background: '#1e2a3a', border: '1px solid #374151', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
          />
          {authError && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{authError}</p>}
          <button
            onClick={() => verifyAndLoad(password)}
            disabled={loading}
            style={{ width: '100%', background: '#c8893a', color: '#0a0f1e', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}
          >{loading ? 'Checking…' : 'Sign In'}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '32px 20px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <h1 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', marginBottom: '28px' }}>Latest News</h1>

        {/* Add form */}
        <form onSubmit={handleSubmit} style={{ background: '#111827', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '28px 24px', marginBottom: '32px' }}>
          <h2 style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>Add Item</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                style={{ width: '100%', background: '#1e2a3a', border: '1px solid #374151', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>Tag</label>
              <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                style={{ width: '100%', background: '#1e2a3a', border: '1px solid #374151', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
                {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>Headline *</label>
            <input type="text" value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} placeholder="e.g. BitMine to issue preferred equity stock"
              style={{ width: '100%', background: '#1e2a3a', border: '1px solid #374151', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Short summary of the news item…"
              style={{ width: '100%', background: '#1e2a3a', border: '1px solid #374151', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Arial, Helvetica, sans-serif' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>Article URL</label>
            <input type="url" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://…"
              style={{ width: '100%', background: '#1e2a3a', border: '1px solid #374151', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button type="submit" disabled={saving || !form.headline.trim()}
              style={{ background: '#c8893a', color: '#0a0f1e', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : 'Add Item'}
            </button>
            {feedback && <span style={{ color: '#4ade80', fontSize: '14px' }}>{feedback}</span>}
          </div>
        </form>

        {/* Existing items */}
        <h2 style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
          Live Items ({items.length})
        </h2>

        {items.length === 0 && <p style={{ color: '#6b7280', fontSize: '14px' }}>No news items yet.</p>}

        {items.map(item => {
          const tc = TAG_COLORS[item.tag] || TAG_COLORS.Market;
          return (
            <div key={item.id} style={{ background: '#111827', border: '1px solid #1e2a3a', borderRadius: '12px', padding: '18px 20px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ background: tc.bg, color: tc.text, fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' }}>{item.tag}</span>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>{item.date}</span>
                </div>
                <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: '700', margin: '0 0 6px', lineHeight: '1.4' }}>{item.headline}</p>
                {item.description && <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 6px', lineHeight: '1.5' }}>{item.description}</p>}
                {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#c8893a', fontSize: '12px' }}>Read article →</a>}
              </div>
              <button onClick={() => handleDelete(item.id)}
                style={{ background: 'transparent', border: '1px solid #374151', color: '#6b7280', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>
                Delete
              </button>
            </div>
          );
        })}

      </div>
    </div>
  );
}
