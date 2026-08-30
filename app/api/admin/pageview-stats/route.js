import { NextResponse } from 'next/server';
import { getPageviewStats } from '@/lib/pageviewLog';

export const revalidate = 0;

function isAuthorised(request) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  return !!process.env.NEWS_ADMIN_PASSWORD && token === process.env.NEWS_ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const stats = await getPageviewStats();
  return NextResponse.json(stats);
}
