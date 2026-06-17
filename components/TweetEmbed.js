'use client';

import { useEffect, useRef, useState } from 'react';

// Loads X's widgets.js exactly once and resolves with the global `twttr` object.
let widgetsPromise = null;
function loadWidgets() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.twttr?.widgets) return Promise.resolve(window.twttr);
  if (widgetsPromise) return widgetsPromise;
  widgetsPromise = new Promise(resolve => {
    const s = document.createElement('script');
    s.id = 'twitter-wjs';
    s.src = 'https://platform.twitter.com/widgets.js';
    s.async = true;
    s.onload = () => resolve(window.twttr);
    s.onerror = () => resolve(null);
    document.body.appendChild(s);
  });
  return widgetsPromise;
}

// Pull the numeric status id out of any x.com / twitter.com status URL.
export function tweetIdFromUrl(url) {
  if (!url) return null;
  const m = String(url).match(/status(?:es)?\/(\d+)/);
  return m ? m[1] : null;
}

export default function TweetEmbed({ tweetId, fallback }) {
  const containerRef = useRef(null);
  const tweetRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | done | failed

  // Only start loading the embed once it scrolls near the viewport.
  useEffect(() => {
    if (inView) return;
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' } // begin loading a little before it enters view
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  // Render the tweet once it's in view.
  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    setStatus('loading');
    loadWidgets().then(twttr => {
      if (cancelled || !tweetRef.current || !twttr?.widgets) { if (!cancelled) setStatus('failed'); return; }
      tweetRef.current.innerHTML = '';
      twttr.widgets
        .createTweet(tweetId, tweetRef.current, { theme: 'dark', dnt: true, align: 'center', conversation: 'none' })
        .then(el => { if (!cancelled) setStatus(el ? 'done' : 'failed'); })
        .catch(() => { if (!cancelled) setStatus('failed'); });
    });
    return () => { cancelled = true; };
  }, [inView, tweetId]);

  // The text fallback is shown server-side and until the live embed renders,
  // then it is replaced by the embed. This keeps the thought text in the
  // server HTML (visible to crawlers) while users still get the rich X post.
  return (
    <div ref={containerRef}>
      <div ref={tweetRef} />
      {status !== 'done' && fallback}
    </div>
  );
}
