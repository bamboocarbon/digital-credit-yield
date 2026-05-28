import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export const revalidate = 0;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
};

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'dcy-daily-card.json' });
    if (!blobs.length) return NextResponse.json({ error: 'No data' }, { status: 404, headers: CORS });
    const res = await fetch(blobs[0].downloadUrl, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'Fetch failed' }, { status: 502, headers: CORS });
    const data = await res.json();
    return NextResponse.json(data, { headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: CORS });
  }
}
