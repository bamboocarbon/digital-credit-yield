'use client';

import { useState, useEffect } from 'react';
import TweetEmbed, { tweetIdFromUrl } from './TweetEmbed';
import { computeAnchors } from '@/lib/thoughtAnchors';

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

// The thoughts archive's primary card: our own hosted copy of the exact
// image posted to X (uploaded by the backfill script alongside the OCR'd
// text), rendered full and uncropped — X's own embed widget was silently
// cropping the top off the taller "Weekend Thought" cards and there's no way
// to fix that from our side (it happens inside X's cross-origin iframe).
// The heart/reply/copy-link/view-on-X row mimics the old embed's footer
// using X's public intent links, so it stays functional without API access.
function ThoughtCard({ item }) {
  const tweetId = tweetIdFromUrl(item.url);
  const [copied, setCopied] = useState(false);

  function copyTweetLink() {
    if (!item.url) return;
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="card rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element -- proxied Blob asset, not a local one
        <img
          src={`/api/thought-image?path=${encodeURIComponent(item.image)}`}
          alt={item.text || 'Thought of the Day'}
          className="w-full block"
          loading="lazy"
        />
      )}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span
            aria-hidden="true"
            style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--accent-gold)', borderRadius: 2, flexShrink: 0 }}
          />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(item.date)}</span>
        </div>
        {item.text && (
          // Visually hidden, not removed — the image already shows this text,
          // but it stays in the DOM (screen readers + crawlers) since that's
          // the whole reason `text` gets backfilled in the first place.
          <p className="sr-only">{item.text}</p>
        )}
        {item.url && (
          <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            {tweetId && (
              <a
                href={`https://twitter.com/intent/like?tweet_id=${tweetId}`}
                target="_blank" rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                ♥ Like
              </a>
            )}
            {tweetId && (
              <a
                href={`https://twitter.com/intent/tweet?in_reply_to=${tweetId}`}
                target="_blank" rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                💬 Reply
              </a>
            )}
            <button
              type="button" onClick={copyTweetLink}
              className="transition-colors hover:text-white"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}
            >
              🔗 {copied ? 'Copied!' : 'Copy link'}
            </button>
            <a
              href={item.url}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
              View on X
            </a>
          </div>
        )}
      </div>
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

  // Stable per-entry anchors (#2026-07-21) for direct links from X, email or
  // search — only meaningful for the dated thoughts archive, not quiz posts.
  const anchors = isQuiz ? null : computeAnchors(items);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {items.map(item => {
        let post;
        if (isQuiz) {
          const tweetId = tweetIdFromUrl(item.url);
          post = tweetId
            ? <TweetEmbed tweetId={tweetId} fallback={<TextCard item={item} />} />
            : <TextCard item={item} />;
        } else {
          post = <ThoughtCard item={item} />;
        }
        return (
          <div key={item.id} id={anchors?.get(item.id)} className={anchors ? 'scroll-mt-28' : undefined}>
            {post}
            {isQuiz && item.answer && <AnswerReveal answer={item.answer} />}
          </div>
        );
      })}
      {trailing}
    </div>
  );
}
