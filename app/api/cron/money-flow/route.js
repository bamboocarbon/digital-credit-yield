import { NextResponse } from 'next/server';
import { getMoneyFlowData, saveMoneyFlowData, buildCumulative, SEED_STRC_WEEKLY, SEED_SATA_WEEKLY } from '@/lib/moneyFlowStore';
import { getRecentFilings, parseProceeds, weekLabel, weekDate } from '@/lib/edgarParser';

export const maxDuration = 60;

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Load existing data or seed from hardcoded baseline
    let existing = await getMoneyFlowData();
    let strcWeekly = existing?.strcWeekly ?? [...SEED_STRC_WEEKLY];
    let sataWeekly = existing?.sataWeekly ?? [...SEED_SATA_WEEKLY];

    const strcLastDate = strcWeekly.at(-1)?.date ?? '2026-05-25';
    const sataLastDate = sataWeekly.at(-1)?.date ?? '2026-05-25';

    const results = { strcAdded: 0, sataAdded: 0, errors: [] };

    // Fetch new STRC 8-Ks
    try {
      const filings = await getRecentFilings('STRC', strcLastDate);
      for (const filing of filings.reverse()) { // oldest-first
        const proceeds = await parseProceeds('STRC', filing);
        if (!proceeds) continue;
        const date = weekDate(filing.date);
        // Skip if we already have this week
        if (strcWeekly.some(d => d.date === date)) continue;
        strcWeekly.push({ week: weekLabel(filing.date), date, value: proceeds });
        results.strcAdded++;
      }
    } catch (err) {
      results.errors.push(`STRC: ${err.message}`);
    }

    // Fetch new SATA 8-Ks
    try {
      const filings = await getRecentFilings('SATA', sataLastDate);
      for (const filing of filings.reverse()) {
        const proceeds = await parseProceeds('SATA', filing);
        if (!proceeds) continue;
        const date = weekDate(filing.date);
        if (sataWeekly.some(d => d.date === date)) continue;
        sataWeekly.push({ week: weekLabel(filing.date), date, value: proceeds });
        results.sataAdded++;
      }
    } catch (err) {
      results.errors.push(`SATA: ${err.message}`);
    }

    // Rebuild cumulative and save
    const cumulative = buildCumulative(strcWeekly, sataWeekly);
    await saveMoneyFlowData({ strcWeekly, sataWeekly, cumulative });

    return NextResponse.json({ ok: true, ...results });
  } catch (err) {
    console.error('Money flow cron failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
