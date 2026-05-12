import { NextResponse } from 'next/server';
import { VALID_TICKERS } from '@/lib/constants';
import { fetchDividendEvents, fetchNextPaymentDate } from '@/lib/fetchStockData';
import { readDividends, writeDividends, mergeDividends } from '@/lib/dividendStore';

export async function GET(request, { params }) {
  const { ticker } = await params;
  const upper = ticker.toUpperCase();
  if (!VALID_TICKERS.includes(upper)) {
    return NextResponse.json({ history: [], nextPaymentDate: null }, { status: 400 });
  }

  let stored = [];
  try {
    stored = await readDividends(upper);
  } catch {
    // continue with empty stored data
  }

  try {
    const [live, nextPaymentDate] = await Promise.all([
      fetchDividendEvents(upper),
      fetchNextPaymentDate(upper),
    ]);
    const merged = mergeDividends(stored, live);
    await writeDividends(upper, merged);
    return NextResponse.json({ history: merged, nextPaymentDate }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300' },
    });
  } catch (err) {
    console.error(`Dividend fetch failed for ${upper}:`, err);
    return NextResponse.json({ history: stored, nextPaymentDate: null });
  }
}
