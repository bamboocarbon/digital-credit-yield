import { NextResponse } from 'next/server';
import { VALID_TICKERS } from '@/lib/constants';
import { fetchDividendEvents, fetchNextPaymentDate } from '@/lib/fetchStockData';
import { readDividends, writeDividends, mergeDividends } from '@/lib/dividendStore';

const STRC_SEMI_MONTHLY_FINAL = '2026-10-31'; // first record date NOT merged from Yahoo (superseded; see below)

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

  // BMNP: Yahoo's dividend feed for this newly-listed, non-standard-cadence security has been
  // found unreliable — it reports dates that match neither Bitmine's record nor payment dates,
  // and amounts that don't correspond to any dividend Bitmine has actually declared (verified
  // against its own 8-K filings). Serve the manually-verified stored record directly rather than
  // merging in bad data on every request. CHAD gets the same treatment pre-emptively — it's an
  // even newer, non-standard-cadence security with no established Yahoo dividend history yet.
  // STRK/STRF/STRD/STRE: hand-kept from strategy.com's dividend tables so every row is a payout date
  // (Yahoo returns record dates for the Nasdaq ones, and nothing for STRE).
  if (upper === 'BMNP' || upper === 'CHAD' || upper === 'MORE' || upper === 'STRK' || upper === 'STRF' || upper === 'STRD' || upper === 'STRE' || upper === 'SATS') {
    return NextResponse.json({ history: stored, nextPaymentDate: null }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300' },
    });
  }

  try {
    const [live, nextPaymentDate] = await Promise.all([
      fetchDividendEvents(upper),
      fetchNextPaymentDate(upper),
    ]);
    // STRC's calendar-day era (record dates from STRC_DAILY_START) is hand-kept from Strategy's 8-K
    // tables: Yahoo's feed has no payDate, and the gap+amount de-dupe in mergeDividends would collapse
    // consecutive same-amount daily rows. So only pre-daily Yahoo events are merged in — and the 31 Oct
    // semi-monthly dividend (declared 30 Sep, payable 15 Nov) is superseded by the November daily
    // dividends once the daily amendments take effect (8-K 15 Oct, "Conditional Dividends"), so it must
    // not be merged back in from Yahoo either.
    const liveForMerge = upper === 'STRC' ? live.filter(e => e.date < STRC_SEMI_MONTHLY_FINAL) : live;
    const merged = mergeDividends(stored, liveForMerge, upper);

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
