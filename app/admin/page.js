'use client';

import { useState, useEffect } from 'react';

const NEWS = 'news', THOUGHTS = 'thoughts', QUIZ = 'quiz';

const SECTIONS = [
  { key: NEWS,     label: 'News' },
  { key: THOUGHTS, label: 'Thought of the Day' },
  { key: QUIZ,     label: 'Quiz' },
];

const NEWS_TAGS = ['STRC', 'SATA', 'BMNP', 'Metaplanet', 'Market'];
const TAG_COLORS = {
  STRC:       '#4ade80',
  SATA:       '#3b82f6',
  BMNP:       '#fde047',
  Metaplanet: '#7dd3fc',
  Market:     '#9ca3af',
};

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

const emptyForm = () => ({
  date: new Date().toISOString().split('T')[0],
  tag: 'STRC',
  headline: '',
  description: '',
  url: '',
  text: '',
  answer: '',
});

// API endpoint + GET url for each section.
const endpoint = section => (section === NEWS ? '/api/news' : '/api/thoughts');
const listUrl  = section => (section === NEWS ? '/api/news' : `/api/thoughts?kind=${section}`);

export default function Admin() {
  const [password, setPassword]   = useState('');
  const [authed, setAuthed]       = useState(false);
  const [authError, setAuthError] = useState('');
  const [section, setSection]     = useState(NEWS);
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [form, setForm]           = useState(emptyForm());
  const [saving, setSaving]       = useState(false);
  const [feedback, setFeedback]   = useState('');
  const [editingId, setEditingId] = useState(null);

  const [bulkOpen, setBulkOpen]   = useState(false);
  const [bulkText, setBulkText]   = useState('');
  const [bulkBusy, setBulkBusy]   = useState(false);
  const [bulkResult, setBulkResult] = useState('');

  const isNews  = section === NEWS;
  const isQuiz  = section === QUIZ;
  const noun    = isNews ? 'News Item' : isQuiz ? 'Quiz Post' : 'Thought';

  useEffect(() => {
    const stored = sessionStorage.getItem('news_admin_pw');
    if (stored) { setPassword(stored); verifyAndLoad(stored); }
  }, []);

  function sortItems(data) {
    return [...data].sort((a, b) => (b.date.localeCompare(a.date)) || (String(b.id).localeCompare(String(a.id))));
  }

  async function loadItems(s = section) {
    const data = await (await fetch(listUrl(s))).json();
    setItems(sortItems(data));
  }

  async function verifyAndLoad(pw) {
    setLoading(true);
    try {
      // Verify password with a throwaway POST to the thoughts store, then delete it.
      const test = await fetch('/api/thoughts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pw}` },
        body: JSON.stringify({ text: '__test__' }),
      });
      if (test.status === 401) { setAuthError('Incorrect password.'); setLoading(false); return; }
      const created = await test.json();
      if (created.id) {
        await fetch('/api/thoughts', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pw}` },
          body: JSON.stringify({ id: created.id }),
        });
      }
      sessionStorage.setItem('news_admin_pw', pw);
      setAuthed(true);
      setAuthError('');
      await loadItems(NEWS);
      fetchSubscriberCount(pw);
    } catch {
      setAuthError('Something went wrong.');
    }
    setLoading(false);
  }

  async function fetchSubscriberCount(pw) {
    try {
      const res = await fetch('/api/subscribe', { headers: { Authorization: `Bearer ${pw}` } });
      if (!res.ok) return;
      const data = await res.json();
      setSubscriberCount(data.count);
    } catch {}
  }

  async function switchSection(s) {
    if (s === section) return;
    setSection(s);
    setEditingId(null);
    setForm(emptyForm());
    setFeedback('');
    setBulkResult('');
    setBulkOpen(false);
    setItems([]);
    await loadItems(s);
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setForm({ ...emptyForm(), ...item });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
  }

  function buildPayload() {
    if (isNews) {
      return { date: form.date, tag: form.tag, headline: form.headline, description: form.description, url: form.url };
    }
    const base = { kind: section, date: form.date, text: form.text, url: form.url };
    if (isQuiz) base.answer = form.answer;
    return base;
  }

  const canSave = isNews ? !!form.headline.trim() : (!!form.text.trim() || !!form.url.trim());

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    try {
      const payload = buildPayload();
      if (editingId) {
        const res = await fetch(endpoint(section), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
          body: JSON.stringify({ ...payload, id: editingId }),
        });
        const updated = await res.json();
        setItems(prev => prev.map(i => i.id === editingId ? updated : i));
        setEditingId(null);
        setForm(emptyForm());
        setFeedback('Updated ✓');
      } else {
        const res = await fetch(endpoint(section), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
          body: JSON.stringify(payload),
        });
        const item = await res.json();
        setItems(prev => sortItems([item, ...prev]));
        setForm(emptyForm());
        setFeedback('Saved ✓');
      }
      setTimeout(() => setFeedback(''), 2500);
    } catch {
      setFeedback('Error saving.');
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    const body = isNews ? { id } : { kind: section, id };
    await fetch(endpoint(section), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
      body: JSON.stringify(body),
    });
    setItems(prev => prev.filter(i => i.id !== id));
  }

  // Bulk import (Thought of the Day / Quiz only).
  //   Thoughts: "YYYY-MM-DD | text | url"
  //   Quiz:     "YYYY-MM-DD | url | answer"
  async function handleBulkImport() {
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    setBulkBusy(true);
    setBulkResult('');
    let ok = 0, fail = 0;
    for (const line of lines) {
      const parts = line.split('|').map(p => p.trim());
      let date = '';
      let rest = parts;
      if (parts.length >= 2 && /^\d{4}-\d{2}-\d{2}$/.test(parts[0])) {
        date = parts[0];
        rest = parts.slice(1);
      }
      let payload;
      if (isQuiz) {
        payload = { kind: QUIZ, date: date || undefined, url: rest[0] || '', answer: rest[1] || '' };
        if (!payload.url) { fail++; continue; }
      } else {
        payload = { kind: THOUGHTS, date: date || undefined, text: rest[0] || '', url: rest[1] || '' };
        if (!payload.text && !payload.url) { fail++; continue; }
      }
      try {
        const res = await fetch('/api/thoughts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
          body: JSON.stringify(payload),
        });
        if (res.ok) ok++; else fail++;
      } catch { fail++; }
    }
    await loadItems();
    setBulkText('');
    setBulkBusy(false);
    setBulkResult(`Imported ${ok}${fail ? `, ${fail} failed` : ''}.`);
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#111827', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '36px 32px', width: '100%', maxWidth: '380px' }}>
          <h1 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>Site Admin</h1>
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

  const tabStyle = active => ({
    flex: 1,
    background: active ? '#c8893a' : 'transparent',
    color: active ? '#0a0f1e' : '#9ca3af',
    border: active ? 'none' : '1px solid #374151',
    borderRadius: '10px',
    padding: '10px 8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '32px 20px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px' }}>
          <h1 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: 0 }}>Site Admin</h1>
          <div style={{ background: '#111827', border: '1px solid #1e2a3a', borderRadius: '10px', padding: '8px 16px', textAlign: 'right', flexShrink: 0 }}>
            <p style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Newsletter Subscribers</p>
            <p style={{ color: '#c8893a', fontSize: '18px', fontWeight: '700', margin: 0 }}>{subscriberCount === null ? '…' : subscriberCount}</p>
          </div>
        </div>

        {/* Section selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {SECTIONS.map(s => (
            <button key={s.key} type="button" onClick={() => switchSection(s.key)} style={tabStyle(section === s.key)}>{s.label}</button>
          ))}
        </div>

        {/* Add / edit form */}
        <form onSubmit={handleSubmit} style={{ background: '#111827', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '28px 24px', marginBottom: '20px' }}>
          <h2 style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>{editingId ? `Edit ${noun}` : `Add ${noun}`}</h2>

          {isNews ? (
            <>
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
                    {NEWS_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>Headline *</label>
                <input type="text" value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} placeholder="e.g. Bitmine to issue preferred equity stock"
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
            </>
          ) : (
            <>
              <div style={{ marginBottom: '12px', maxWidth: '220px' }}>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  style={{ width: '100%', background: '#1e2a3a', border: '1px solid #374151', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>X post URL</label>
                <input type="url" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://x.com/DCYieldHub/status/…"
                  style={{ width: '100%', background: '#1e2a3a', border: '1px solid #374151', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                <p style={{ color: '#6b7280', fontSize: '11px', margin: '6px 0 0', lineHeight: '1.5' }}>Paste the link to your {isQuiz ? 'quiz ' : ''}tweet — the live post is embedded on the page exactly as it appears on X.</p>
              </div>
              {isQuiz && (
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>Answer *</label>
                  <textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} rows={3} placeholder="The answer revealed when the visitor clicks ‘Reveal answer’ below the post."
                    style={{ width: '100%', background: '#1e2a3a', border: '1px solid #374151', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: '1.6' }} />
                </div>
              )}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>{isQuiz ? 'Question text (fallback)' : 'Thought text (fallback)'}</label>
                <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={4} placeholder="Optional — shown only if the embedded post can't load. Required if you don't give a URL."
                  style={{ width: '100%', background: '#1e2a3a', border: '1px solid #374151', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: '1.6' }} />
              </div>
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button type="submit" disabled={saving || !canSave}
              style={{ background: '#c8893a', color: '#0a0f1e', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', opacity: (saving || !canSave) ? 0.6 : 1 }}>
              {saving ? 'Saving…' : editingId ? `Update ${noun}` : `Add ${noun}`}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit}
                style={{ background: 'transparent', border: '1px solid #374151', color: '#9ca3af', borderRadius: '10px', padding: '12px 20px', fontSize: '15px', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
            {feedback && <span style={{ color: '#4ade80', fontSize: '14px' }}>{feedback}</span>}
            {!canSave && !feedback && (
              <span style={{ color: '#6b7280', fontSize: '13px' }}>
                {isNews ? 'Add a headline to enable saving.' : 'Add an X post URL (or text) to enable saving.'}
              </span>
            )}
          </div>
        </form>

        {/* Bulk import — thoughts/quiz only */}
        {!isNews && (
          <div style={{ background: '#111827', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '20px 24px', marginBottom: '32px' }}>
            <button type="button" onClick={() => setBulkOpen(o => !o)}
              style={{ background: 'transparent', border: 'none', color: '#c8893a', fontSize: '14px', fontWeight: '700', cursor: 'pointer', padding: 0 }}>
              {bulkOpen ? '− Hide bulk import' : `+ Bulk import past ${isQuiz ? 'quiz posts' : 'thoughts'}`}
            </button>
            {bulkOpen && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ color: '#6b7280', fontSize: '12px', lineHeight: '1.6', marginBottom: '10px' }}>
                  One per line. Format:{' '}
                  <span style={{ color: '#9ca3af' }}>
                    {isQuiz ? 'YYYY-MM-DD | https://x.com/... | answer text' : 'YYYY-MM-DD | thought text | https://x.com/...'}
                  </span>. The leading date is optional (defaults to today).
                </p>
                <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={8}
                  placeholder={isQuiz
                    ? '2026-06-17 | https://x.com/DCYieldHub/status/123 | STRC ranks senior to STRK, STRD and common stock.'
                    : '2026-06-17 | Compounding rewards patience, not timing. | https://x.com/DCYieldHub/status/123'}
                  style={{ width: '100%', background: '#1e2a3a', border: '1px solid #374151', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'monospace', lineHeight: '1.6' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={handleBulkImport} disabled={bulkBusy || !bulkText.trim()}
                    style={{ background: '#c8893a', color: '#0a0f1e', border: 'none', borderRadius: '10px', padding: '10px 22px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: bulkBusy ? 0.6 : 1 }}>
                    {bulkBusy ? 'Importing…' : 'Import all'}
                  </button>
                  {bulkResult && <span style={{ color: '#4ade80', fontSize: '13px' }}>{bulkResult}</span>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Existing items */}
        <h2 style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
          Live {isNews ? 'News' : isQuiz ? 'Quiz Posts' : 'Thoughts'} ({items.length})
        </h2>

        {items.length === 0 && <p style={{ color: '#6b7280', fontSize: '14px' }}>Nothing here yet.</p>}

        {items.map(item => (
          <div key={item.id} style={{ background: '#111827', border: '1px solid #1e2a3a', borderRadius: '12px', padding: '18px 20px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {isNews ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ color: TAG_COLORS[item.tag] || TAG_COLORS.Market, fontSize: '11px', fontWeight: '700' }}>{item.tag}</span>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>{item.date}</span>
                  </div>
                  <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: '700', margin: '0 0 6px', lineHeight: '1.4' }}>{item.headline}</p>
                  {item.description && <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 6px', lineHeight: '1.5' }}>{item.description}</p>}
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#c8893a', fontSize: '12px' }}>Read article →</a>}
                </>
              ) : (
                <>
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 8px' }}>{formatDate(item.date)}</p>
                  {item.text && <p style={{ color: '#ffffff', fontSize: '14px', margin: '0 0 6px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{item.text}</p>}
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#c8893a', fontSize: '12px' }}>View on X →</a>}
                  {isQuiz && item.answer && (
                    <p style={{ color: '#9ca3af', fontSize: '13px', margin: '8px 0 0', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                      <span style={{ color: '#c8893a', fontWeight: '700' }}>Answer: </span>{item.answer}
                    </p>
                  )}
                </>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
              <button onClick={() => handleEdit(item)}
                style={{ background: 'transparent', border: '1px solid #374151', color: '#c8893a', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(item.id)}
                style={{ background: 'transparent', border: '1px solid #374151', color: '#6b7280', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
