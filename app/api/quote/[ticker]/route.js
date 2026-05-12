import { NextResponse } from 'next/server';
import { getStockQuote } from '@/lib/fetchStockData';
import { VALID_TICKERS } from '@/lib/constants';

export async function GET(request, { params }) {
  const { ticker } = await params;
  const upper = ticker.toUpperCase();
  if (!VALID_TICKERS.includes(upper)) {
    return NextResponse.json({ error: 'Invalid ticker' }, { status: 400 });
  }
  try {
    const data = await getStockQuote(upper);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  } catch (err) {
    console.error(`Quote fetch failed for ${ticker}:`, err);
    return NextResponse.json({ error: 'Data unavailable' }, { status: 500 });
  }
}
