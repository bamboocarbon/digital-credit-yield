import { NextResponse } from 'next/server';
import { getYieldHistory } from '@/lib/fetchStockData';
import { VALID_TICKERS } from '@/lib/constants';

export async function GET(request, { params }) {
  const { ticker } = await params;
  const upper = ticker.toUpperCase();
  if (!VALID_TICKERS.includes(upper)) {
    return NextResponse.json([], { status: 400 });
  }
  try {
    const history = await getYieldHistory(upper);
    return NextResponse.json(history, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  } catch (err) {
    console.error(`Yield history fetch failed for ${ticker}:`, err);
    return NextResponse.json([], { status: 500 });
  }
}
