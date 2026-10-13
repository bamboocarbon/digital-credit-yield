import { NextResponse } from 'next/server';
import { getMoneyFlowData, buildCumulative, SEED_STRC_WEEKLY, SEED_SATA_WEEKLY, SEED_BMNP_WEEKLY, SEED_CHAD_WEEKLY, SEED_MORE_WEEKLY, SEED_CUMULATIVE, mergeMoreWeekly } from '@/lib/moneyFlowStore';

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  const data = await getMoneyFlowData();

  if (data) {
    // MORE's weekly figures are hand/scan-maintained in the seed (no EDGAR feed), so merge the seed
    // over the stored blob on every read and rebuild the cumulative series when it differs.
    const moreWeekly = mergeMoreWeekly(data.moreWeekly);
    if (JSON.stringify(moreWeekly) !== JSON.stringify(data.moreWeekly)) {
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
