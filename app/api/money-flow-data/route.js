import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getMoneyFlowData, buildCumulative, SEED_SATA_WEEKLY, SEED_BMNP_WEEKLY, SEED_CHAD_WEEKLY, mergeSatsWeekly, mergeMoreWeekly, mergeMoreBuybacks, moreAtmRows, moreBuybackRows, mergeBuybacks, SEED_SATA_BUYBACKS, SEED_SATS_BUYBACKS, SEED_BMNP_BUYBACKS, SEED_CHAD_BUYBACKS } from '@/lib/moneyFlowStore';
import { getStockQuote } from '@/lib/fetchStockData';
import { mergeStrategyWeekly, deriveStrcWeekly, deriveStrategyRaisedWeekly } from '@/lib/strategyFlow';

// Read the stored Blob at request time. A static/ISR route would be prerendered during the Docker build, which has no
// BLOB_READ_WRITE_TOKEN, baking in the seed-only data (which stops at SEED_THROUGH) — found 2026-11-11. The response's
// own Cache-Control header below still lets browsers/CDNs cache it for an hour.
export const dynamic = 'force-dynamic';

async function readCounts() {
  try {
    return JSON.parse(await readFile(join(process.cwd(), 'data', 'capital-stack-counts.json'), 'utf8'));
  } catch {
    return null;
  }
}

// MORE's weekly ATM sales, from the share-count ledger the daily scan-feed job maintains.
async function moreAtm(counts) {
  try {
    const entries = counts?.swc?.preferred?.atmSalesLedger?.entries ?? [];
    if (!entries.length) return [];
    // Price only matters for entries whose RNS stated no £ proceeds
    const price = entries.some(e => e.proceeds == null) ? await getStockQuote('MORE').then(q => q.price).catch(() => null) : null;
    return moreAtmRows(entries, price);
  } catch {
    return [];
  }
}

export async function GET() {
  const data = await getMoneyFlowData();

  // Strategy's weekly figures come from the filed 8-K tables (lib/strategyFlow.js seed + cron-added weeks).
  // STRC's series and the all-Strategy total are derived from them, so everything agrees with the
  // all-products view, and the cumulative series (its `strc` key is the whole Strategy line) is rebuilt
  // from it rather than trusted from the stored blob.
  const strategyWeekly = mergeStrategyWeekly(data?.strategyWeekly);
  const strcWeekly = deriveStrcWeekly(strategyWeekly);
  const strategyRaisedWeekly = deriveStrategyRaisedWeekly(strategyWeekly); // all five series, USD — the Strategy card and cumulative line
  const sataWeekly = data?.sataWeekly ?? SEED_SATA_WEEKLY;
  const bmnpWeekly = data?.bmnpWeekly ?? SEED_BMNP_WEEKLY;
  const chadWeekly = data?.chadWeekly ?? SEED_CHAD_WEEKLY;
  const satsWeekly = mergeSatsWeekly(data?.satsWeekly);
  // MORE's weekly figures are hand/scan-maintained in the seed (no EDGAR feed), so merge the seed
  // over the stored blob on every read.
  const counts = await readCounts();
  const moreWeekly = mergeMoreWeekly(data?.moreWeekly, await moreAtm(counts));
  // Preferred buybacks for the non-Strategy issuers — shown on each chart as negative bars and netted off
  // its "capital raised" total, the same way STRC's buybacks are. MORE's are parsed from SWC's buyback RNS
  // (the share-count ledger) with SEED_MORE_BUYBACKS as a hand override; the rest are hand/scan-kept seeds.
  const moreBuybacks = mergeMoreBuybacks(data?.moreBuybacks, moreBuybackRows(counts?.swc?.preferred?.buybackLedger?.entries));
  const sataBuybacks = mergeBuybacks(SEED_SATA_BUYBACKS, data?.sataBuybacks);
  const satsBuybacks = mergeBuybacks(SEED_SATS_BUYBACKS, data?.satsBuybacks);
  const bmnpBuybacks = mergeBuybacks(SEED_BMNP_BUYBACKS, data?.bmnpBuybacks);
  const chadBuybacks = mergeBuybacks(SEED_CHAD_BUYBACKS, data?.chadBuybacks);

  return NextResponse.json({
    ...(data ?? {}),
    strcWeekly,
    strategyWeekly,
    strategyRaisedWeekly,
    sataWeekly,
    satsWeekly,
    bmnpWeekly,
    chadWeekly,
    moreWeekly,
    moreBuybacks,
    sataBuybacks,
    satsBuybacks,
    bmnpBuybacks,
    chadBuybacks,
    cumulative: buildCumulative(strategyRaisedWeekly, sataWeekly, bmnpWeekly, chadWeekly, moreWeekly, satsWeekly),
    lastUpdated: data?.lastUpdated ?? null,
  }, {
    // The Blob read makes this route dynamic, so `revalidate` above is ignored — cache at the CDN
    // instead. /money-flow fires five of these per visit.
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' },
  });
}
