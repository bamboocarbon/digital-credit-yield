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

    // Best-effort persistence only — production's filesystem is read-only at
    // request time, so this throws (EROFS) on every call there. The merged
    // result above is still correct and must be served regardless; only a
    // manual edit + redeploy actually grows the permanent on-disk record.
    try {
      await writeDividends(upper, merged);
    } catch {}

    return NextResponse.json({ history: merged, nextPaymentDate }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300' },
    });
  } catch (err) {
    console.error(`Dividend fetch failed for ${upper}:`, err);
    return NextResponse.json({ history: stored, nextPaymentDate: null });
  }
}
