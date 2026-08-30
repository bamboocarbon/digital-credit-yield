'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const DAY_LABEL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABEL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function dayLabel(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  return `${DAY_LABEL[d.getUTCDay()]} ${d.getUTCDate()}`;
}

function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  return `${MONTH_LABEL[m - 1]} ${y}`;
}

function StatRow({ label, count }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #1e2a3a' }}>
      <span style={{ color: '#e5e7eb', fontSize: '13px' }}>{label}</span>
      <span style={{ color: '#c8893a', fontWeight: 700, fontSize: '14px' }}>{count.toLocaleString()}</span>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ color: '#6b7280', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '18px', marginBottom: '4px' }}>
      {children}
    </div>
  );
}

export default function AdminPageviews() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('news_admin_pw');
    if (stored) { setPassword(stored); load(stored); }
  }, []);

  async function load(pw) {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/pageview-stats', { headers: { Authorization: `Bearer ${pw}` } });
      if (res.status === 401) { setAuthError('Incorrect password.'); setLoading(false); return; }
      if (!res.ok) { setAuthError('Something went wrong.'); setLoading(false); return; }
      const data = await res.json();
      sessionStorage.setItem('news_admin_pw', pw);
      setStats(data);
      setAuthed(true);
    } catch {
      setAuthError('Something went wrong.');
    }
    setLoading(false);
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <form
          onSubmit={e => { e.preventDefault(); load(password); }}
          style={{ background: '#111827', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '36px 32px', width: '100%', maxWidth: '380px' }}
        >
          <h1 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>Page Views</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', background: '#1e2a3a', border: '1px solid #374151', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
          />
          {authError && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{authError}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#c8893a', color: '#0a0f1e', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}
          >{loading ? 'Checking…' : 'Sign In'}</button>
          <Link href="/admin" style={{ display: 'block', textAlign: 'center', marginTop: '16px', color: '#6b7280', fontSize: '13px' }} prefetch={false}>
            ← Site Admin
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '32px 20px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginBottom: '24px' }}>
          <h1 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: 0 }}>Page Views</h1>
          <Link href="/admin" style={{ color: '#6b7280', fontSize: '13px', whiteSpace: 'nowrap' }} prefetch={false}>
            ← Site Admin
          </Link>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1e2a3a', borderRadius: '16px', padding: '20px 24px' }}>
          <p style={{ color: '#6b7280', fontSize: '12.5px', marginBottom: '4px' }}>
            Server-side count of every real page load, no cookies — not gated by analytics consent the way GA4 is.
          </p>
          {!stats || stats.totalRecorded === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: '13px', marginTop: '12px' }}>No page views recorded yet.</div>
          ) : (
            <>
              <SectionLabel>Last 7 days</SectionLabel>
              {stats.daily.map((d) => <StatRow key={d.date} label={dayLabel(d.date)} count={d.count} />)}

              <SectionLabel>Last 4 weeks</SectionLabel>
              {stats.weekly.map((w, i) => <StatRow key={i} label={w.label} count={w.count} />)}

              <SectionLabel>By month</SectionLabel>
              {stats.monthly.map((m) => <StatRow key={m.month} label={monthLabel(m.month)} count={m.count} />)}

              <SectionLabel>Top 10 pages</SectionLabel>
              {stats.topPages.map((p) => <StatRow key={p.path} label={p.path} count={p.count} />)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
