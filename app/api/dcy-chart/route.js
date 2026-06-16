import { blobUrl } from '@/lib/blobUrl';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Cache-Control': 'public, max-age=3600',
};

export async function GET() {
  try {
    const res = await fetch(blobUrl('dcy-daily-chart.png'), {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (res.status === 404) return new Response('Not found', { status: 404, headers: CORS });
    if (!res.ok) return new Response('Fetch failed', { status: 502, headers: CORS });
    const buffer = await res.arrayBuffer();
    return new Response(buffer, {
      headers: { ...CORS, 'Content-Type': 'image/png' },
    });
  } catch (err) {
    return new Response(err.message, { status: 500, headers: CORS });
  }
}
