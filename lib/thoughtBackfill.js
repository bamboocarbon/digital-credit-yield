// Shared "fill text + image in from the source tweet" logic for a Thought of
// the Day entry — used both by the admin API route (auto-runs on save) and
// by scripts/backfillThoughtText.js (a manual sweep over the whole archive,
// e.g. for entries added before this existed, or a one-off retry).

export const EXT_BY_CONTENT_TYPE = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

export function tweetIdFromUrl(url) {
  if (!url) return null;
  const m = String(url).match(/status(?:es)?\/(\d+)/);
  return m ? m[1] : null;
}

// x.com used to serve an old lightweight SSR snapshot with an og:image tag to
// the Twitterbot UA roughly 1 in 8 tries (vs. a JS-app shell with no image tag
// the rest of the time) — as of 2026-08-25 it stopped doing this entirely, so
// we go via vxtwitter.com's read-only mirror API instead, which returns the
// quote-card's real pbs.twimg.com media URL directly as JSON.
export async function fetchTweetImageUrl(tweetId) {
  const handle = process.env.DCY_X_HANDLE || 'DCYieldHub';
  const res = await fetch(`https://api.vxtwitter.com/${handle}/status/${tweetId}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.mediaURLs?.[0] || null;
}

// Downloads the quote-card image for a tweet URL. Returns null if the URL
// has no tweet id, the tweet/media lookup fails, or the image itself 404s.
export async function fetchTweetImage(url) {
  const tweetId = tweetIdFromUrl(url);
  if (!tweetId) return null;

  const imageUrl = await fetchTweetImageUrl(tweetId);
  if (!imageUrl) return null;

  const imgRes = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!imgRes.ok) return null;

  const buffer = Buffer.from(await imgRes.arrayBuffer());
  const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
  const ext = EXT_BY_CONTENT_TYPE[contentType] || '.jpg';
  return { buffer, contentType, ext };
}

// The quote-card template is fixed: brand/date header, "Tracking STRC..."
// pill, a "Thought for/of the Day" label, then the thought itself (the only
// part we want), then a disclaimer paragraph and the site domain. We pull
// out just the lines between the label and whichever trailing marker OCRs
// first. The cream "Weekend Thought" variant (Sat/Sun) uses a different
// label and adds a photo + decorative star row above and below the thought.
export function extractThought(rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const startIdx = lines.findIndex(l => /(thoughts?\s+(for|of)\s+the\s+day)|(weekend\s+thought)/i.test(l));
  if (startIdx === -1) return null;

  let endIdx = lines.findIndex((l, i) => i > startIdx && /digitalcredityield\.com/i.test(l));
  if (endIdx === -1) endIdx = lines.findIndex((l, i) => i > startIdx && /not financial advice/i.test(l));
  const body = lines.slice(startIdx + 1, endIdx === -1 ? undefined : endIdx);

  const cleaned = body
    .filter(l => {
      // Drop the editor's own placeholder hint if it ever gets baked into an export.
      if (/double-tap to edit/i.test(l)) return false;
      // Drop the weekend card's decorative star row (OCRs as noise like "* kk").
      const letters = l.replace(/[^a-zA-Z]/g, '');
      return letters.length >= 3;
    })
    // Flanking emoji (e.g. the rocket either side of "Blast Off !") OCR as
    // short garbage tokens like "s#" / ";#" rather than their own line —
    // "#" never appears in real card text, so it's a safe tell.
    .map(l => l.split(' ').filter(w => !w.includes('#')).join(' '));
  const text = cleaned.join(' ').replace(/\s+/g, ' ').trim();
  return text || null;
}

export async function ocrThought(worker, imageBuffer) {
  const { data: { text: rawText } } = await worker.recognize(imageBuffer);
  return extractThought(rawText);
}
