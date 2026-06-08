import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

export const revalidate = 0;

async function loadNews() {
  try {
    const { blobs } = await list({ prefix: 'dcy-news' });
    const blob = blobs.find(b => b.pathname === 'dcy-news.json');
    if (!blob) return [];
    const res = await fetch(blob.url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function saveNews(items) {
  await put('dcy-news.json', JSON.stringify(items), {
    access: 'private', contentType: 'application/json', allowOverwrite: true,
  });
}

function isAuthorised(request) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  return token === process.env.NEWS_ADMIN_PASSWORD;
}

export async function GET() {
  const items = await loadNews();
  return NextResponse.json(items);
}

export async function POST(request) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const body = await request.json();
  const { date, tag, headline, description, url } = body;
  if (!headline || !tag) return NextResponse.json({ error: 'headline and tag are required' }, { status: 400 });

  const items = await loadNews();
  const item = {
    id: Date.now().toString(),
    date: date || new Date().toISOString().split('T')[0],
    tag,
    headline,
    description: description || '',
    url: url || '',
  };
  const updated = [item, ...items].slice(0, 20); // keep max 20
  await saveNews(updated);
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(request) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const body = await request.json();
  const { id, date, tag, headline, description, url } = body;
  if (!id || !headline || !tag) return NextResponse.json({ error: 'id, headline and tag are required' }, { status: 400 });

  const items = await loadNews();
  const updated = items.map(i => i.id === id ? { id, date, tag, headline, description: description || '', url: url || '' } : i);
  await saveNews(updated);
  return NextResponse.json(updated.find(i => i.id === id));
}

export async function DELETE(request) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await request.json();
  const items = await loadNews();
  const updated = items.filter(i => i.id !== id);
  await saveNews(updated);
  return NextResponse.json({ ok: true });
}
