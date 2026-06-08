import { NextResponse } from 'next/server';
import { getMoneyFlowData, SEED_STRC_WEEKLY, SEED_SATA_WEEKLY, SEED_BMNP_WEEKLY, SEED_CUMULATIVE } from '@/lib/moneyFlowStore';

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  const data = await getMoneyFlowData();

  if (data) {
    return NextResponse.json(data);
  }

  // Fallback to hardcoded seed data if KV not yet populated
  return NextResponse.json({
    strcWeekly:  SEED_STRC_WEEKLY,
    sataWeekly:  SEED_SATA_WEEKLY,
    bmnpWeekly:  SEED_BMNP_WEEKLY,
    cumulative:  SEED_CUMULATIVE,
    lastUpdated: null,
  });
}
