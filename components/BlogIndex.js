'use client';

import { useState } from 'react';
import Link from 'next/link';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

const tickerColour = {
  STRC: '#4ade80',
  SATA: '#3b82f6',
  BMNP: '#fde047',
  CHAD: '#b91c1c',
  SOL: '#a78bfa',
  Metaplanet: '#7dd3fc',
};

function categoryStyle(category) {
  const c = tickerColour[category];
  return c
    ? { color: c }
    : { color: '#9ca3af' };
}

function CategoryTag({ category }) {
  if (Array.isArray(category)) {
    return (
      <span className="flex items-center gap-1.5 mb-3 self-start">
        {category.map(c => (
          <span key={c} className="text-xs font-semibold px-2 py-0.5 rounded-full" style={categoryStyle(c)}>{c}</span>
        ))}
      </span>
    );
  }
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full mb-3 self-start" style={categoryStyle(category)}>
      {category}
    </span>
  );
}

export default function BlogIndex({ articles }) {
  const [filter, setFilter] = useState('All');

  const tail = ['Education', 'Guide'];
  // CHAD is unioned in even though no article is tagged with it yet — the filter
  // button should exist alongside STRC/SATA/BMNP from launch, the same way it
  // would once a CHAD article exists, rather than waiting for one to appear.
  const allCats = [...new Set([...articles.flatMap(a => [].concat(a.category)), 'CHAD'])];
  const categories = [
    'All',
    ...allCats.filter(c => !tail.includes(c)).sort(),
    ...tail.filter(c => allCats.includes(c)),
  ];
  const shown = filter === 'All'
    ? articles
    : articles.filter(a => [].concat(a.category).includes(filter));

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="text-xs font-semibold px-3 py-2 rounded-full min-h-[36px] transition-colors"
              style={{
                background: active ? 'var(--accent-gold)' : 'var(--bg-card)',
                border: `1px solid ${active ? 'var(--accent-gold)' : 'var(--border)'}`,
                color: active ? '#000' : (tickerColour[cat] || 'var(--text-muted)'),
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {shown.length === 0 && (
        <p className="text-sm text-center py-12" style={{ color: 'var(--text-muted)' }}>
          No {filter} articles yet — check back soon.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shown.map(article => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            prefetch={false}
            className="flex flex-col rounded-xl p-5 transition-colors"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <CategoryTag category={article.category} />
            <h2 className="text-base font-semibold leading-snug mb-2" style={{ color: 'var(--text-primary)' }}>
              {article.title}
            </h2>
            <p className="text-sm leading-6 flex-1 mb-4" style={{ color: 'var(--text-muted)' }}>
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>{formatDate(article.date)}</span>
              <span>{article.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
