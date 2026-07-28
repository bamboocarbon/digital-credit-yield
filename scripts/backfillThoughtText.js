// scripts/backfillThoughtText.js
//
// Finds "Thought of the Day" entries in the dcy-thoughts.json Blob that have
// an X post URL but no text (the pattern that broke crawlability/AdSense
// visibility on /thought-of-the-day from 2026-06-18 onward — see the archive
// bug fix), OCRs the quote-card image attached to each tweet with a local,
// offline Tesseract worker (no API key, no credits), and fills the `text`
// field back in from the card's fixed template.
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
// first.
function extractThought(rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const startIdx = lines.findIndex(l => /thoughts?\s+(for|of)\s+the\s+day/i.test(l));
  if (startIdx === -1) return null;

  let endIdx = lines.findIndex((l, i) => i > startIdx && /digitalcredityield\.com/i.test(l));
  if (endIdx === -1) endIdx = lines.findIndex((l, i) => i > startIdx && /not financial advice/i.test(l));
  const body = lines.slice(startIdx + 1, endIdx === -1 ? undefined : endIdx);

  // Drop the editor's own placeholder hint if it ever gets baked into an export.
  const cleaned = body.filter(l => !/double-tap to edit/i.test(l));
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

  const targets = items.filter(i => !(i.text || '').trim() && (i.url || '').trim());
  if (targets.length === 0) {
    console.log('Nothing to backfill — every entry already has text.');
    return;
  }

  console.log(`${APPLY ? 'APPLY' : 'DRY RUN'} — ${targets.length} entr${targets.length === 1 ? 'y' : 'ies'} missing text:\n`);

  const worker = await createWorker('eng');
  const results = new Map(); // id -> transcribed text
  try {
    for (const item of targets) {
      const tweetId = tweetIdFromUrl(item.url);
      if (!tweetId) { console.log(`${item.date}  SKIP (no tweet id in url: ${item.url})`); continue; }
      try {
        const imageUrl = await fetchOgImage(tweetId);
        if (!imageUrl) { console.log(`${item.date}  SKIP (no og:image found for tweet ${tweetId})`); continue; }
        const imgRes = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!imgRes.ok) throw new Error(`image fetch failed: ${imgRes.status}`);
        const buf = Buffer.from(await imgRes.arrayBuffer());

        const { data: { text: rawText } } = await worker.recognize(buf);
        const text = extractThought(rawText);
        if (!text) { console.log(`${item.date}  SKIP (couldn't isolate thought text from OCR)`); continue; }

        console.log(`${item.date}  "${text}"`);
        results.set(item.id, text);
      } catch (err) {
        console.log(`${item.date}  ERROR (${err.message})`);
      }
    }
  } finally {
    await worker.terminate();
  }

  if (results.size === 0) {
    console.log('\nNothing transcribed successfully — nothing to write.');
    return;
  }

  if (!APPLY) {
    console.log(`\n${results.size} entr${results.size === 1 ? 'y' : 'ies'} ready — review the text above.`);
    console.log('Re-run with --apply to write these to the live store.');
    return;
  }

  const updated = items.map(i => results.has(i.id) ? { ...i, text: results.get(i.id) } : i);
  await put(BLOB_NAME, JSON.stringify(updated), {
    access: 'private', contentType: 'application/json', allowOverwrite: true,
  });
  console.log(`\nWrote ${results.size} entries to the live store.`);
}

main().catch(err => { console.error('FAILED:', err.message); process.exit(1); });
