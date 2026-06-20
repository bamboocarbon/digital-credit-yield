'use client';

import { useState, useEffect } from 'react';
import TweetEmbed, { tweetIdFromUrl } from './TweetEmbed';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function TextCard({ item }) {
  return (
    <div
      className="card p-5 rounded-xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span
          aria-hidden="true"
          style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--accent-gold)', borderRadius: 2, flexShrink: 0 }}
        />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(item.date)}</span>
      </div>
      {item.text && (
        <p
          className="text-base"
          style={{ color: 'var(--text-primary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}
        >
          {item.text}
        </p>
      )}
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs mt-4 transition-colors hover:text-white"
          style={{ color: 'var(--text-muted)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
          </svg>
          View on X
        </a>
      )}
    </div>
  );
}

function AnswerReveal({ answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full text-sm font-semibold rounded-lg py-2.5 transition-colors"
        style={{
          background: open ? 'transparent' : 'var(--accent-gold)',
          color: open ? 'var(--accent-gold)' : '#0a0f1e',
          border: open ? '1px solid var(--accent-gold)' : 'none',
          cursor: 'pointer',
        }}
        aria-expanded={open}
      >
        {open ? 'Hide answer' : 'Reveal answer'}
      </button>
      {/* Rendered in the DOM always (so the answer text is in the server HTML /
          crawlable), just visually hidden until revealed. */}
      <div
        className="mt-2 p-4 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--accent-gold)', display: open ? 'block' : 'none' }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Answer</p>
        <p className="text-base" style={{ color: 'var(--text-primary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{answer}</p>
      </div>
    </div>
  );
}

export default function XPostGrid({ kind = 'thoughts', initialItems = null, trailing = null }) {
  const [items, setItems] = useState(initialItems);
  const isQuiz = kind === 'quiz';

  useEffect(() => {
    // When the server already provided the list (SSR), use it as-is — the page
    // is rendered fresh per request, so no client refetch is needed.
    if (initialItems) return;
    fetch(`/api/thoughts?kind=${kind}`)
      .then(r => r.json())
      .then(data => setItems(
        [...data].sort((a, b) => (b.date.localeCompare(a.date)) || (b.id.localeCompare(a.id)))
      ))
      .catch(() => setItems([]));
  }, [kind, initialItems]);

  if (items === null) {
    return <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Nothing posted yet. Check back soon, or follow{' '}
        <a href="https://x.com/DCYieldHub" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>@DCYieldHub</a> on X.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {items.map(item => {
        const tweetId = tweetIdFromUrl(item.url);
        const post = tweetId
          ? <TweetEmbed tweetId={tweetId} fallback={<TextCard item={item} />} />
          : <TextCard item={item} />;
        return (
          <div key={item.id}>
            {post}
            {isQuiz && item.answer && <AnswerReveal answer={item.answer} />}
          </div>
        );
      })}
      {trailing}
    </div>
  );
}
