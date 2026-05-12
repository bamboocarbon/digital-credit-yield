import { NextResponse } from 'next/server';
import { getChartData } from '@/lib/fetchStockData';
import { VALID_TICKERS } from '@/lib/constants';

export async function GET(request, { params }) {
  const { ticker } = await params;
  const upper = ticker.toUpperCase();
  if (!VALID_TICKERS.includes(upper)) {
    return NextResponse.json({ error: 'Invalid ticker' }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '6mo';
  const interval = searchParams.get('interval') || '1d';
  try {
    const data = await getChartData(upper, period, interval);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  } catch (err) {
    console.error(`Chart fetch failed for ${ticker}:`, err);
    return NextResponse.json({ error: 'Data unavailable' }, { status: 500 });
  }
}
