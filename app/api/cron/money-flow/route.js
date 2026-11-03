import { NextResponse } from 'next/server';
import { getMoneyFlowData, saveMoneyFlowData, buildCumulative, SEED_SATA_WEEKLY, SEED_BMNP_WEEKLY, SEED_CHAD_WEEKLY, SEED_MORE_WEEKLY, mergeMoreWeekly, mergeSatsWeekly } from '@/lib/moneyFlowStore';
import { getRecentFilings, parseProceeds, parseSatsShares, parseStrategyWeek, weekLabel, weekDate, periodWeekDate } from '@/lib/edgarParser';
import { getStockQuote } from '@/lib/fetchStockData';
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
    let satsWeekly = mergeSatsWeekly(existing?.satsWeekly);
    // One-off (2026-11-03): Strive rows were dated by the 8-K's filing week; re-date them by the week covered so
    // they line up with Strategy's. Flagged `p` so it only ever runs once per row. Seed/IPO rows and anything
    // before 2 Jun 2026 (hand-built from share counts) are left alone.
    const shiftWeek = (date, days) => new Date(Date.parse(date + 'T12:00:00Z') + days * 864e5).toISOString().slice(0, 10);
    const toPeriod = rows => rows.map(r => {
      if (r.p || r.ipo || r.date < '2026-06-02') return r;
      const date = shiftWeek(r.date, -7);
      return { ...r, date, week: weekLabel(date), p: 1 };
    }).sort((a, b) => a.date.localeCompare(b.date));
    sataWeekly = toPeriod(sataWeekly);
    satsWeekly = toPeriod(satsWeekly);
    let bmnpWeekly = existing?.bmnpWeekly ?? [...SEED_BMNP_WEEKLY];
    let chadWeekly = existing?.chadWeekly ?? [...SEED_CHAD_WEEKLY];
    // MORE is an LSE-listed sterling instrument with no SEC filings to parse — its weekly
    // figures are maintained by hand (see moneyFlowStore.js), so the cron only carries them through.
    // Seed it in too if the stored blob predates MORE.
    let moreWeekly = mergeMoreWeekly(existing?.moreWeekly);

    // The seed already covers the 8-K filed 13 Oct 2026 (w/c 5 Oct); only look at filings after that.
    const strategyLastFiled = strategyWeekly.map(r => r.filed).filter(Boolean).sort().at(-1) ?? '2026-10-13';
    // rows are dated by week covered; filings land one week later, so look for filings after (last row + 7 days)
    const sataLastDate = sataWeekly.at(-1)?.date ? shiftWeek(sataWeekly.at(-1).date, 7) : '2026-05-25';
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
        const date = periodWeekDate(filing.date);
        if (sataWeekly.some(d => d.date === date)) continue;
        sataWeekly.push({ week: weekLabel(date), date, value: proceeds, p: 1 });
        results.sataAdded++;
      }
    } catch (err) {
      results.errors.push(`SATA: ${err.message}`);
    }

    // SATS: the IPO is seeded; any ATM sales show up as growth in the SATS share count in Strive's weekly 8-K
    // table. Value = new shares x the current SATS price, less the ATM's 2% maximum commission (an estimate —
    // Strive doesn't state SATS ATM proceeds in dollars), flagged `est`.
    try {
      const counted = () => satsWeekly.reduce((n, r) => n + (r.shares ?? 0), 0);
      const filings = await getRecentFilings('SATA', '2026-10-25');
      for (const filing of filings.reverse()) {
        const shares = await parseSatsShares(filing);
        if (!shares || shares <= counted()) continue;
        const date = periodWeekDate(filing.date);
        if (satsWeekly.some(d => d.date === date)) continue;
        const price = await getStockQuote('SATS').then(q => q.price).catch(() => null);
        const delta = shares - counted();
        satsWeekly.push({ week: weekLabel(date), date, value: Math.round(delta * (price ?? 90) * 0.98 / 1e5) / 10, shares: delta, est: true, p: 1 });
        results.satsAdded = (results.satsAdded ?? 0) + 1;
      }
    } catch (err) {
      results.errors.push(`SATS: ${err.message}`);
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
    const cumulative = buildCumulative(deriveStrategyRaisedWeekly(strategyWeekly), sataWeekly, bmnpWeekly, chadWeekly, moreWeekly, satsWeekly);
    await saveMoneyFlowData({ strcWeekly, strategyWeekly: strategyWeekly.filter(r => r.date > SEED_THROUGH), sataWeekly, satsWeekly, bmnpWeekly, chadWeekly, moreWeekly, cumulative });

    return NextResponse.json({ ok: true, ...results });
  } catch (err) {
    console.error('Money flow cron failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
