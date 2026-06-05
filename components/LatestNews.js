'use client';

import { useState, useEffect } from 'react';

const TAG_COLORS = {
  STRC:   { bg: '#14532d', text: '#4ade80' },
  SATA:   { bg: '#1e3a8a', text: '#93c5fd' },
  BMNP:   { bg: '#3b0764', text: '#c4b5fd' },
  Market: { bg: '#1f2937', text: '#9ca3af' },
};

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function LatestNews() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => setItems(data.slice(0, 5)))
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Latest News</h2>
      <div className="space-y-4">
        {items.map(item => {
          const tc = TAG_COLORS[item.tag] || TAG_COLORS.Market;
          const content = (
            <div
              className="card p-5 rounded-xl transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span style={{ background: tc.bg, color: tc.text, fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' }}>
                  {item.tag}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(item.date)}</span>
              </div>
              <p className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)', lineHeight: '1.4' }}>{item.headline}</p>
              {item.description && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
              )}
              {item.url && (
                <p className="text-xs mt-3" style={{ color: 'var(--accent-gold)' }}>Read article →</p>
              )}
            </div>
          );

          return item.url ? (
            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
              {content}
            </a>
          ) : (
            <div key={item.id}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
