import { blobUrl } from '@/lib/blobUrl';

// The Blob store backing dcy-thoughts.json is configured private-only (no
// public access level available), so the per-entry quote-card images
// uploaded by scripts/backfillThoughtText.js are stored privately too. This
// route proxies them through with the auth header attached, so a plain
// <img src="/api/thought-image?path=..."> tag on the client can still load
// them without exposing the Blob token.

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  if (!path || !path.startsWith('thought-images/')) {
    return new Response('Not found', { status: 404 });
  }

  const res = await fetch(blobUrl(path), {
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
  });
  if (!res.ok) return new Response('Not found', { status: 404 });

  const buf = await res.arrayBuffer();
  return new Response(buf, {
    headers: {
      'Content-Type': res.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
