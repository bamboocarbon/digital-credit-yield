import { NextResponse } from 'next/server';
import { getMoneyFlowData, buildCumulative, SEED_SATA_WEEKLY, SEED_BMNP_WEEKLY, SEED_CHAD_WEEKLY, SEED_MORE_WEEKLY, mergeMoreWeekly } from '@/lib/moneyFlowStore';
import { mergeStrategyWeekly, deriveStrcWeekly, deriveStrategyRaisedWeekly } from '@/lib/strategyFlow';

export const revalidate = 3600; // cache for 1 hour

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
  const moreWeekly = data ? mergeMoreWeekly(data.moreWeekly) : SEED_MORE_WEEKLY;

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
