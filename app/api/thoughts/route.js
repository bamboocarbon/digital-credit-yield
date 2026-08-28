import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { createWorker } from 'tesseract.js';
import { blobUrl } from '@/lib/blobUrl';
import { fetchTweetImage, ocrThought } from '@/lib/thoughtBackfill';

export const revalidate = 0;
export const maxDuration = 60;

// Fills in `text` (OCR'd off the quote-card) and `image` (our own Blob copy
// of it — see scripts/backfillThoughtText.js for why) straight from the
// source tweet at save time, so the admin doesn't need to separately run the
// backfill script after adding/editing an entry. Best-effort: any failure
// here (tweet gone, OCR mismatch, X/vxtwitter hiccup) just leaves the fields
// blank exactly as before this existed — the manual script is still there as
// a fallback sweep.
async function backfillFromTweet(item) {
  const needsText = !item.text.trim();
  const needsImage = !(item.image || '').trim();
  if (!item.url || (!needsText && !needsImage)) return item;

  try {
    const media = await fetchTweetImage(item.url);
    if (!media) return item;

    let text = item.text;
    if (needsText) {
      const worker = await createWorker('eng', undefined, { cachePath: '/tmp' });
      try {
        text = (await ocrThought(worker, media.buffer)) || item.text;
      } finally {
        await worker.terminate();
      }
    }

    let image = item.image || '';
    if (needsImage) {
      const pathname = `thought-images/${item.id}${media.ext}`;
      await put(pathname, media.buffer, {
        access: 'private', contentType: media.contentType, addRandomSuffix: false, allowOverwrite: true,
      });
      image = pathname;
    }

    return { ...item, text, image };
  } catch {
    return item;
  }
}

// Two collections share this route: daily thoughts and quiz posts. Each lives
// in its own Blob; quiz items additionally carry an `answer`.
const BLOBS = { thoughts: 'dcy-thoughts.json', quiz: 'dcy-quiz.json' };
function blobName(kind) { return BLOBS[kind] || BLOBS.thoughts; }

async function loadItems(kind) {
  try {
    const res = await fetch(blobUrl(blobName(kind)), {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function saveItems(kind, items) {
  await put(blobName(kind), JSON.stringify(items), {
    access: 'private', contentType: 'application/json', allowOverwrite: true,
  });
}

function isAuthorised(request) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  return token === process.env.NEWS_ADMIN_PASSWORD;
}

export async function GET(request) {
  const kind = new URL(request.url).searchParams.get('kind') || 'thoughts';
  const items = await loadItems(kind);
  return NextResponse.json(items);
}

export async function POST(request) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const body = await request.json();
  const { kind = 'thoughts', date, text, url, answer } = body;
  if ((!text || !text.trim()) && (!url || !url.trim())) {
    return NextResponse.json({ error: 'a text or an X post URL is required' }, { status: 400 });
  }

  const items = await loadItems(kind);
  let item = {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    date: date || new Date().toISOString().split('T')[0],
    text: (text || '').trim(),
    url: (url || '').trim(),
    answer: (answer || '').trim(),
  };
  if (kind === 'thoughts') item = await backfillFromTweet(item);

  // Newest first; keep a generous archive.
  const updated = [item, ...items].slice(0, 800);
  await saveItems(kind, updated);
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(request) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const body = await request.json();
  const { kind = 'thoughts', id, date, text, url, answer } = body;
  if (!id || ((!text || !text.trim()) && (!url || !url.trim()))) {
    return NextResponse.json({ error: 'id and either text or an X post URL are required' }, { status: 400 });
  }

  const items = await loadItems(kind);
  const existing = items.find(i => i.id === id);
  let item = {
    ...existing,
    id, date, text: (text || '').trim(), url: (url || '').trim(), answer: (answer || '').trim(),
  };
  if (kind === 'thoughts') item = await backfillFromTweet(item);

  const updated = items.map(i => i.id === id ? item : i);
  await saveItems(kind, updated);
  return NextResponse.json(item);
}

export async function DELETE(request) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { kind = 'thoughts', id } = await request.json();
  const items = await loadItems(kind);
  const updated = items.filter(i => i.id !== id);
  await saveItems(kind, updated);
  return NextResponse.json({ ok: true });
}
