import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { blobUrl } from '@/lib/blobUrl';

export const revalidate = 0;

// News lives in one Blob file. Each admin save is read-modify-write, and Blob reads can be
// served from an edge cache for up to ~a minute after a write, so rapid-fire saves used to
// read a stale list and silently drop the item saved just before. Every write is now
// conditional on the ETag of the list it was built from (ifMatch): a stale read makes the
// write fail, and we re-read and retry instead of overwriting.
async function loadNews() {
  const res = await fetch(`${blobUrl('dcy-news.json')}?t=${Date.now()}`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
  });
  if (res.status === 404) return { items: [], etag: null };
  // Anything else unreadable must NOT look like "no news": a write built on an empty list
  // would wipe the real one. Throw so the caller retries (or fails the request).
  if (!res.ok) throw new Error(`news read failed: ${res.status}`);
  return { items: await res.json(), etag: res.headers.get('etag') };
}

async function saveNews(items, etag) {
  await put('dcy-news.json', JSON.stringify(items), {
    access: 'private', contentType: 'application/json', allowOverwrite: true,
    cacheControlMaxAge: 60,
    ...(etag ? { ifMatch: etag } : {}),
  });
}

// Apply `change(items)` to the latest list and save it. `change` may return null to abort
// (nothing is written). Retries when the list changed or the read was stale.
async function updateNews(change) {
  for (let attempt = 0; attempt < 8; attempt++) {
    let items, etag;
    try {
      ({ items, etag } = await loadNews());
    } catch (err) {
      if (attempt === 7) throw err;
      await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
      continue;
    }
    const updated = change(items);
    if (updated === null) return { items, saved: false };
    try {
      // one rolling backup of the list as it was before this change
      if (items.length) {
        await put('dcy-news-prev.json', JSON.stringify(items), {
          access: 'private', contentType: 'application/json', allowOverwrite: true, cacheControlMaxAge: 60,
        });
      }
      await saveNews(updated, etag);
      return { items: updated, saved: true };
    } catch (err) {
      const stale = err?.name === 'BlobPreconditionFailedError' || err?.constructor?.name === 'BlobPreconditionFailedError' || /precondition|etag/i.test(String(err?.message));
      if (!stale || attempt === 7) throw err;
      await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
    }
  }
}

function isAuthorised(request) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  return token === process.env.NEWS_ADMIN_PASSWORD;
}

export async function GET() {
  let items = [];
  try { ({ items } = await loadNews()); } catch {}
  // CDN-cached so page views don't each cost a function run + Blob read
  // (Hobby Fluid Active CPU was at 75%, 2026-10-16; cut from 5 min to 1 min so a batch of
  // admin saves shows up quickly). The admin list adds a
  // cache-busting query param so edits show immediately there.
  return NextResponse.json(items, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60' },
  });
}

export async function POST(request) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const body = await request.json();
  const { date, tag, headline, description, url } = body;
  if (!headline || !tag) return NextResponse.json({ error: 'headline and tag are required' }, { status: 400 });

  const item = {
    id: Date.now().toString(),
    date: date || new Date().toISOString().split('T')[0],
    tag,
    headline,
    description: description || '',
    url: url || '',
  };
  await updateNews(items => [item, ...items].slice(0, 20)); // keep max 20
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(request) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const body = await request.json();
  const { id, date, tag, headline, description, url } = body;
  if (!id || !headline || !tag) return NextResponse.json({ error: 'id, headline and tag are required' }, { status: 400 });

  let updatedItem = null;
  const { saved } = await updateNews(items => {
    if (!items.some(i => i.id === id)) return null;
    updatedItem = { id, date, tag, headline, description: description || '', url: url || '' };
    return items.map(i => i.id === id ? updatedItem : i);
  });
  if (!saved) return NextResponse.json({ error: 'Item not found — it may have aged off the 20-item list' }, { status: 404 });
  return NextResponse.json(updatedItem);
}

export async function DELETE(request) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await request.json();
  await updateNews(items => items.filter(i => i.id !== id));
  return NextResponse.json({ ok: true });
}
