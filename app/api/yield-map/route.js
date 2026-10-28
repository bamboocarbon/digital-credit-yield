import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { getStockQuote } from '@/lib/fetchStockData';
import { resolveStack } from '@/lib/capitalStacksLive';
import { ASSET_RATES, PAR_VALUE, PRE_LISTING_TICKERS } from '@/lib/constants';

// Feeds the home-page yield map: one point per preferred, with effective yield (annual dividend /
// current price, same sum as the price cards), the stated rate, and market cap in USD for dot size.
// Prices reuse getStockQuote's 5-minute cache and market caps reuse the capital-stack resolver's
// 10-minute cache, so this adds no extra Yahoo traffic beyond what the cards already cause.
// CDN-cached for 15 min (was 5, 2026-10-28) to cut Fluid Active CPU; same as /api/quote so the map and cards agree.
export const revalidate = 0;

const yahoo = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const MAP_TICKERS = ['STRC', 'SATA', 'BMNP', 'CHAD', 'MORE', 'STRK', 'STRF', 'STRD', 'STRE', 'SATS'];
// Which capital-stack page holds each ticker's market-cap row, and its currency.
const STACK_FOR = { STRC: 'STRC', STRK: 'STRC', STRF: 'STRC', STRD: 'STRC', STRE: 'STRC', SATA: 'SATA', SATS: 'SATS', BMNP: 'BMNP', CHAD: 'CHAD', MORE: 'MORE' };

let fxCache = null;
async function gbpUsd() {
  if (fxCache && Date.now() - fxCache.t < 10 * 60 * 1000) return fxCache.v;
  try {
    const v = (await yahoo.quote('GBPUSD=X')).regularMarketPrice;
    if (v > 0) { fxCache = { t: Date.now(), v }; return v; }
  } catch {}
  return fxCache?.v ?? 1.33;
}

// Latest value of a FRED series. Only public-domain series belong here: DGS10 (Federal Reserve H.15, daily)
// and HQMCB10YRP (US Treasury high-quality corporate curve, monthly). ICE BofA and Moody's series are
// copyrighted and must not be republished.
async function fred(id) {
  try {
    const res = await fetch(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const rows = (await res.text()).trim().split('\n').slice(1).map(l => l.split(','));
    for (let i = rows.length - 1; i >= 0; i--) {
      const v = parseFloat(rows[i][1]);
      if (Number.isFinite(v)) return { value: v, date: rows[i][0] };
    }
  } catch {}
  return null;
}

export async function GET() {
  const stacks = {};
  await Promise.all([...new Set(Object.values(STACK_FOR))].map(async s => { stacks[s] = await resolveStack(s).catch(() => null); }));
  const fx = await gbpUsd();

  const points = (await Promise.all(MAP_TICKERS.map(async t => {
    if (PRE_LISTING_TICKERS.includes(t)) return null; // never query a ticker that isn't trading yet
    try {
      const { price } = await getStockQuote(t);
      const stated = ASSET_RATES[t];
      if (!(price > 0) || stated == null) return null;
      const row = stacks[STACK_FOR[t]]?.rows.find(r => r.id === t);
      const mcap = row?.mcap != null ? row.mcap * (t === 'MORE' ? fx : 1) : null; // $m
      return { ticker: t, stated, effective: (stated * (PAR_VALUE[t] ?? 100) / 100 / price) * 100, mcap };
    } catch { return null; }
  }))).filter(Boolean);

  const [treasury, corporate] = await Promise.all([fred('DGS10'), fred('HQMCB10YRP')]);

  return NextResponse.json({ points, refs: { treasury, corporate }, asOf: new Date().toISOString() }, {
    headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60' },
  });
}
