import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getMoneyFlowData, buildCumulative, SEED_SATA_WEEKLY, SEED_BMNP_WEEKLY, SEED_CHAD_WEEKLY, mergeMoreWeekly, moreAtmRows } from '@/lib/moneyFlowStore';
import { getStockQuote } from '@/lib/fetchStockData';
import { mergeStrategyWeekly, deriveStrcWeekly, deriveStrategyRaisedWeekly } from '@/lib/strategyFlow';

export const revalidate = 3600; // cache for 1 hour

// MORE's weekly ATM sales, from the share-count ledger the daily scan-feed job maintains.
async function moreAtm() {
  try {
    const counts = JSON.parse(await readFile(join(process.cwd(), 'data', 'capital-stack-counts.json'), 'utf8'));
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
  // MORE's weekly figures are hand/scan-maintained in the seed (no EDGAR feed), so merge the seed
  // over the stored blob on every read.
  const moreWeekly = mergeMoreWeekly(data?.moreWeekly, await moreAtm());

  return NextResponse.json({
    ...(data ?? {}),
    strcWeekly,
    strategyWeekly,
    strategyRaisedWeekly,
    sataWeekly,
    satsWeekly: data?.satsWeekly ?? [], // Strive's SATS — not priced yet, so empty
    bmnpWeekly,
    chadWeekly,
    moreWeekly,
    cumulative: buildCumulative(strategyRaisedWeekly, sataWeekly, bmnpWeekly, chadWeekly, moreWeekly),
    lastUpdated: data?.lastUpdated ?? null,
  });
}
