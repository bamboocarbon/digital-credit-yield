import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// The ticker pages' capital pyramids are priced at the last close, so they only need rebuilding once a
// day. Fired after the US close (22:15 UTC, weekdays); each page rebuilds on its next visit with that
// day's closes. The pages' own revalidate = 86400 is the fallback if a scheduled run gets dropped.
const TICKER_PAGES = ['/strc', '/strk', '/strf', '/strd', '/stre', '/sata', '/sats', '/bmnp', '/chad', '/more'];

async function handler(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  for (const path of TICKER_PAGES) revalidatePath(path);
  return NextResponse.json({ ok: true, revalidated: TICKER_PAGES });
}

export const GET = handler;
export const POST = handler;
