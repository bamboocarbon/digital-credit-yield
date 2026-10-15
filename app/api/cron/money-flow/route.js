import { NextResponse } from 'next/server';
import { getMoneyFlowData, saveMoneyFlowData, buildCumulative, SEED_SATA_WEEKLY, SEED_BMNP_WEEKLY, SEED_CHAD_WEEKLY, SEED_MORE_WEEKLY, mergeMoreWeekly } from '@/lib/moneyFlowStore';
import { getRecentFilings, parseProceeds, parseStrategyWeek, weekLabel, weekDate } from '@/lib/edgarParser';
import { mergeStrategyWeekly, deriveStrcWeekly, deriveStrategyRaisedWeekly, SEED_THROUGH } from '@/lib/strategyFlow';

export const maxDuration = 60;

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Load existing data or seed from hardcoded baseline
    let existing = await getMoneyFlowData();
    // Strategy (STRK/STRF/STRD/STRC/STRE): seed + any weeks the cron added after it; STRC's series is derived.
    let strategyWeekly = mergeStrategyWeekly(existing?.strategyWeekly);
    let sataWeekly = existing?.sataWeekly ?? [...SEED_SATA_WEEKLY];
    let bmnpWeekly = existing?.bmnpWeekly ?? [...SEED_BMNP_WEEKLY];
    let chadWeekly = existing?.chadWeekly ?? [...SEED_CHAD_WEEKLY];
    // MORE is an LSE-listed sterling instrument with no SEC filings to parse — its weekly
    // figures are maintained by hand (see moneyFlowStore.js), so the cron only carries them through.
    // Seed it in too if the stored blob predates MORE.
    let moreWeekly = mergeMoreWeekly(existing?.moreWeekly);

    // The seed already covers the 8-K filed 13 Oct 2026 (w/c 5 Oct); only look at filings after that.
    const strategyLastFiled = strategyWeekly.map(r => r.filed).filter(Boolean).sort().at(-1) ?? '2026-10-13';
    const sataLastDate = sataWeekly.at(-1)?.date ?? '2026-05-25';
    const bmnpLastDate = bmnpWeekly.at(-1)?.date ?? '2026-06-01';
    const chadLastDate = chadWeekly.at(-1)?.date ?? '2026-09-01';

    const results = { strcAdded: 0, sataAdded: 0, bmnpAdded: 0, chadAdded: 0, errors: [] };

    // Fetch new Strategy 8-Ks — parses the weekly ATM + repurchase tables for every series at once
    try {
      const filings = await getRecentFilings('STRC', strategyLastFiled);
      for (const filing of filings.reverse()) { // oldest-first
        const week = await parseStrategyWeek(filing);
        if (!week) continue;
        const i = strategyWeekly.findIndex(r => r.date === week.date);
        if (i >= 0) {
          // A second 8-K for the same week (e.g. a correction): add its products on top
          strategyWeekly[i] = { ...strategyWeekly[i], filed: week.filed, net: { ...strategyWeekly[i].net, ...week.net }, bb: { ...strategyWeekly[i].bb, ...week.bb } };
        } else {
          strategyWeekly.push(week);
        }
        results.strcAdded++;
      }
      strategyWeekly.sort((a, b) => a.date.localeCompare(b.date));
    } catch (err) {
      results.errors.push(`STRC: ${err.message}`);
    }
    const strcWeekly = deriveStrcWeekly(strategyWeekly);

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

    // Fetch new BMNP 8-Ks
    try {
      const filings = await getRecentFilings('BMNP', bmnpLastDate);
      for (const filing of filings.reverse()) {
        const proceeds = await parseProceeds('BMNP', filing);
        if (!proceeds) continue;
        const date = weekDate(filing.date);
        if (bmnpWeekly.some(d => d.date === date)) continue;
        bmnpWeekly.push({ week: weekLabel(filing.date), date, value: proceeds });
        results.bmnpAdded++;
      }
    } catch (err) {
      results.errors.push(`BMNP: ${err.message}`);
    }

    // Fetch new CHAD 8-Ks
    try {
      const filings = await getRecentFilings('CHAD', chadLastDate);
      for (const filing of filings.reverse()) {
        const proceeds = await parseProceeds('CHAD', filing);
        if (!proceeds) continue;
        const date = weekDate(filing.date);
        if (chadWeekly.some(d => d.date === date)) continue;
        chadWeekly.push({ week: weekLabel(filing.date), date, value: proceeds });
        results.chadAdded++;
      }
    } catch (err) {
      results.errors.push(`CHAD: ${err.message}`);
    }

    // Rebuild cumulative and save
    const cumulative = buildCumulative(deriveStrategyRaisedWeekly(strategyWeekly), sataWeekly, bmnpWeekly, chadWeekly, moreWeekly);
    await saveMoneyFlowData({ strcWeekly, strategyWeekly: strategyWeekly.filter(r => r.date > SEED_THROUGH), sataWeekly, bmnpWeekly, chadWeekly, moreWeekly, cumulative });

    return NextResponse.json({ ok: true, ...results });
  } catch (err) {
    console.error('Money flow cron failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
