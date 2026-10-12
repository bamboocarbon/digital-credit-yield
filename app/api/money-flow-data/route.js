import { NextResponse } from 'next/server';
import { getMoneyFlowData, buildCumulative, SEED_STRC_WEEKLY, SEED_SATA_WEEKLY, SEED_BMNP_WEEKLY, SEED_CHAD_WEEKLY, SEED_MORE_WEEKLY, SEED_CUMULATIVE } from '@/lib/moneyFlowStore';

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  const data = await getMoneyFlowData();

  if (data) {
    // A stored blob that predates MORE has no moreWeekly key (the cron only rewrites it daily and
    // would otherwise leave the new ticker missing until its next run) — fold the seed in so the
    // page shows MORE immediately, with the cumulative series rebuilt to include it.
    if (!data.moreWeekly) {
      const moreWeekly = SEED_MORE_WEEKLY;
      return NextResponse.json({
        ...data,
        moreWeekly,
        cumulative: buildCumulative(data.strcWeekly ?? [], data.sataWeekly ?? [], data.bmnpWeekly ?? [], data.chadWeekly ?? [], moreWeekly),
      });
    }
    return NextResponse.json(data);
  }

  // Fallback to hardcoded seed data if KV not yet populated
  return NextResponse.json({
    strcWeekly:  SEED_STRC_WEEKLY,
    sataWeekly:  SEED_SATA_WEEKLY,
    bmnpWeekly:  SEED_BMNP_WEEKLY,
    chadWeekly:  SEED_CHAD_WEEKLY,
    moreWeekly:  SEED_MORE_WEEKLY,
    cumulative:  SEED_CUMULATIVE,
    lastUpdated: null,
  });
}
