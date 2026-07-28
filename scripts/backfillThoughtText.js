// scripts/backfillThoughtText.js
//
// Finds "Thought of the Day" entries in the dcy-thoughts.json Blob that have
// an X post URL but are missing their `text` and/or `image` field, and fills
// both back in from the tweet itself:
//   - text  : OCR'd off the quote-card image with a local, offline Tesseract
//             worker (no API key, no credits) — see the archive bug fix this
//             was originally built for.
//   - image : our own public copy of the same quote-card image, uploaded to
//             Blob storage. The archive renders this directly instead of
//             embedding the live tweet, because X's own embed widget silently
//             crops the top off the taller "Weekend Thought" cards and there
//             is no way to fix that from our side.
//
// Dry-run by default — prints what it would change. Pass --apply to write.
//
// Run via: node scripts/backfillThoughtText.js [--apply]

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env.local manually without dotenv
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../.env.local');
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key && rest.length && !key.startsWith('#')) {
    process.env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
  }
}

import { put } from '@vercel/blob';
import { createWorker } from 'tesseract.js';
import { blobUrl } from '../lib/blobUrl.js';

const BLOB_NAME = 'dcy-thoughts.json';
const APPLY = process.argv.includes('--apply');
const SKIP_ARG = process.argv.find(a => a.startsWith('--skip='));
// Entries deliberately left incomplete (e.g. an entry whose only source tweet
// is a mistaken/glitched post) — exclude by id so re-running this tool
// doesn't keep trying to "fix" them from that same bad image.
const SKIP_IDS = new Set(SKIP_ARG ? SKIP_ARG.slice('--skip='.length).split(',').filter(Boolean) : []);

const EXT_BY_CONTENT_TYPE = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

function tweetIdFromUrl(url) {
  if (!url) return null;
  const m = String(url).match(/status(?:es)?\/(\d+)/);
  return m ? m[1] : null;
}

async function fetchOgImage(tweetId) {
  const html = await fetch(`https://x.com/DCYieldHub/status/${tweetId}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Twitterbot/1.0)' },
  }).then(r => r.text());
  const m = html.match(/<meta content="([^"]+)" property="og:image" ?\/?>/);
  return m ? m[1] : null;
}

// The quote-card template is fixed: brand/date header, "Tracking STRC..."
// pill, a "Thought for/of the Day" label, then the thought itself (the only
// part we want), then a disclaimer paragraph and the site domain. We pull
// out just the lines between the label and whichever trailing marker OCRs
// first. The cream "Weekend Thought" variant (Sat/Sun) uses a different
// label and adds a photo + decorative star row above and below the thought.
function extractThought(rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const startIdx = lines.findIndex(l => /(thoughts?\s+(for|of)\s+the\s+day)|(weekend\s+thought)/i.test(l));
  if (startIdx === -1) return null;

  let endIdx = lines.findIndex((l, i) => i > startIdx && /digitalcredityield\.com/i.test(l));
  if (endIdx === -1) endIdx = lines.findIndex((l, i) => i > startIdx && /not financial advice/i.test(l));
  const body = lines.slice(startIdx + 1, endIdx === -1 ? undefined : endIdx);

  const cleaned = body.filter(l => {
    // Drop the editor's own placeholder hint if it ever gets baked into an export.
    if (/double-tap to edit/i.test(l)) return false;
    // Drop the weekend card's decorative star row (OCRs as noise like "* kk").
    const letters = l.replace(/[^a-zA-Z]/g, '');
    return letters.length >= 3;
  });
  const text = cleaned.join(' ').replace(/\s+/g, ' ').trim();
  return text || null;
}

async function main() {
  const res = await fetch(blobUrl(BLOB_NAME), {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
  });
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const items = await res.json();

  const targets = items.filter(i =>
    !SKIP_IDS.has(i.id) && (i.url || '').trim() && (!(i.text || '').trim() || !(i.image || '').trim())
  );
  if (targets.length === 0) {
    console.log('Nothing to backfill — every entry already has text and an image.');
    return;
  }

  console.log(`${APPLY ? 'APPLY' : 'DRY RUN'} — ${targets.length} entr${targets.length === 1 ? 'y' : 'ies'} missing text and/or image:\n`);

  const worker = await createWorker('eng');
  const prepared = []; // { item, text?, imageBuffer?, imageExt? }
  try {
    for (const item of targets) {
      const needsText = !(item.text || '').trim();
      const needsImage = !(item.image || '').trim();
      const tweetId = tweetIdFromUrl(item.url);
      if (!tweetId) { console.log(`${item.date}  SKIP (no tweet id in url: ${item.url})`); continue; }

      try {
        const imageUrl = await fetchOgImage(tweetId);
        if (!imageUrl) { console.log(`${item.date}  SKIP (no og:image found for tweet ${tweetId})`); continue; }
        const imgRes = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!imgRes.ok) throw new Error(`image fetch failed: ${imgRes.status}`);
        const buf = Buffer.from(await imgRes.arrayBuffer());
        const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
        const ext = EXT_BY_CONTENT_TYPE[contentType] || '.jpg';

        let text;
        if (needsText) {
          const { data: { text: rawText } } = await worker.recognize(buf);
          text = extractThought(rawText);
          if (!text) { console.log(`${item.date}  SKIP (couldn't isolate thought text from OCR)`); continue; }
        }

        const parts = [];
        if (text) parts.push(`text: "${text}"`);
        if (needsImage) parts.push('image: will upload');
        console.log(`${item.date}  ${parts.join('  ')}`);

        prepared.push({ item, text, imageBuffer: needsImage ? buf : null, imageExt: ext, imageContentType: contentType });
      } catch (err) {
        console.log(`${item.date}  ERROR (${err.message})`);
      }
    }
  } finally {
    await worker.terminate();
  }

  if (prepared.length === 0) {
    console.log('\nNothing recovered successfully — nothing to write.');
    return;
  }

  if (!APPLY) {
    console.log(`\n${prepared.length} entr${prepared.length === 1 ? 'y' : 'ies'} ready — review above.`);
    console.log('Re-run with --apply to write these to the live store.');
    return;
  }

  const byId = new Map(prepared.map(p => [p.item.id, p]));
  const updated = [];
  for (const item of items) {
    const p = byId.get(item.id);
    if (!p) { updated.push(item); continue; }

    let next = item;
    if (p.text) next = { ...next, text: p.text };
    if (p.imageBuffer) {
      // Store the pathname, not the raw Blob URL — this store is private-only,
      // so the site fetches it through /api/thought-image?path=... instead.
      const pathname = `thought-images/${item.id}${p.imageExt}`;
      await put(pathname, p.imageBuffer, {
        access: 'private', contentType: p.imageContentType, addRandomSuffix: false, allowOverwrite: true,
      });
      next = { ...next, image: pathname };
    }
    updated.push(next);
  }

  await put(BLOB_NAME, JSON.stringify(updated), {
    access: 'private', contentType: 'application/json', allowOverwrite: true,
  });
  console.log(`\nWrote ${prepared.length} entries to the live store.`);
}

main().catch(err => { console.error('FAILED:', err.message); process.exit(1); });
