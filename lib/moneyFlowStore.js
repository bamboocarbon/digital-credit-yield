import { put } from '@vercel/blob';
import { blobUrl } from './blobUrl.js';
import { SEED_STRATEGY_WEEKLY, deriveStrcWeekly } from './strategyFlow.js';

const BLOB_FILENAME = 'money-flow-data.json';

// ── Seed / fallback data ────────────────────────────────────────────────────

// STRC weekly capital raised (IPO + ATM net proceeds, $M) is derived from Strategy's own 8-Ks — see
// lib/strategyFlow.js. Rebuilt 2026-10-15: the old hand-entered series summed to $10.9bn against
// $10.05bn actually filed, with several weeks wrong by $1-2bn (e.g. w/c 13 Apr 2026 $300M vs $2.18bn
// filed) and a bogus $250M week in Aug 2026 from the regex parser misreading a buyback.
export const SEED_STRC_WEEKLY = deriveStrcWeekly(SEED_STRATEGY_WEEKLY);

// SATA capital raised, rebuilt 2026-10-14 from Strive's own 8-K share counts (change in SATA shares
// outstanding x the price paid/trading price). The previous hand-entered seed summed to $1,386m by
// 25 May 2026 against only 5.76m shares (~$0.5bn) actually outstanding — overstated by ~$0.85bn.
//   Nov 10: IPO 2.0m shares @ $80.   Jan 26: follow-on 1.32m @ $90 (8-K 28 Jan).
//   Feb 9:  the rest of the Jan 5 -> Feb 11 increase (0.93m shares @ ~$90) — notes-exchange and
//           other issuance around the January deal, not all of it new cash.
//   Mar 9 -> May 25: weekly change in shares outstanding (8-Ks) x Yahoo close that week.
// From 1 Jun 2026 the daily cron (8-K parser) takes over and was already consistent with the filings.
export const SEED_SATA_WEEKLY = [
  { week: 'Nov 10', date: '2025-11-10', value: 160, ipo: true },
  { week: 'Jan 26', date: '2026-01-26', value: 118.8, ipo: true },
  { week: 'Feb 9',  date: '2026-02-09', value: 84 },
  { week: 'Mar 9',  date: '2026-03-09', value: 0.9 },
  { week: 'Mar 30', date: '2026-03-30', value: 9.5 },
  { week: 'Apr 20', date: '2026-04-20', value: 20 },
  { week: 'Apr 27', date: '2026-04-27', value: 38.3 },
  { week: 'May 18', date: '2026-05-18', value: 28.5 },
  { week: 'May 25', date: '2026-05-25', value: 51.5 },
];

// SATS (Strive's 15.00% Series A Perpetual Preferred, Nasdaq): 7,000,000 shares at $90.00 = $630M gross (upsized
// from 5,000,000; stated amount $100), priced 15 Oct 2026, settled 20 Oct 2026 (8-K 16 Oct, 424B5). Net of the $21.0M
// underwriting discount and estimated expenses ≈ $608.15M (424B5 use of proceeds), shown here net like the other
// issuers. $1bn ATM programme (Cantor et al., up to 2% commission) filed 26 Oct 2026; no ATM shares sold as of the
// 23 Oct count (7,000,000 outstanding = the IPO exactly). `shares` is what the cron compares the 8-K's SATS share count
// against to spot ATM sales.
export const SEED_SATS_WEEKLY = [
  { week: 'Oct 19', date: '2026-10-19', value: 608.2, ipo: true, shares: 7000000 },
];

// Seed IPO row always wins over a stored one on the same date; ATM rows the cron appended carry through.
export function mergeSatsWeekly(stored) {
  const seedDates = new Set(SEED_SATS_WEEKLY.map(r => r.date));
  const rest = (stored ?? []).filter(r => !seedDates.has(r.date));
  return [...SEED_SATS_WEEKLY, ...rest].sort((a, b) => a.date.localeCompare(b.date));
}

export const SEED_BMNP_WEEKLY = [
  // IPO: 3.5M shares of 9.50% Series A Perpetual Preferred at $80.00 (upsized
  // from 3M), priced 4 Jun 2026, initial issue date 10 Jun 2026; net proceeds
  // ≈ $273.8M. NYSE trading as BMNP began 16 Jun 2026.
  { week: 'Jun 8', date: '2026-06-08', value: 274, ipo: true },
];

export const SEED_CHAD_WEEKLY = [
  // IPO: 1,375,000 shares of 13.00% Variable Rate Series C Perpetual Preferred at
  // $8.00 (stated value $10.00), priced 3 Sep 2026, closed 8 Sep 2026; gross
  // proceeds ≈ $11.0M. Nasdaq trading as CHAD began the same day.
  { week: 'Sep 7', date: '2026-09-07', value: 11, ipo: true },
];

// MORE (The Smarter Web Company, London Stock Exchange) is a sterling instrument and files
// RNS announcements rather than SEC 8-Ks, so there is no EDGAR cron for it — add weekly
// figures by hand. Values here are in £M (the MORE bar chart and selector card show £);
// buildCumulative() converts them to $M at MORE_GBPUSD so the shared cumulative chart stays
// in one currency.
export const MORE_GBPUSD = 1.32;
export const SEED_MORE_WEEKLY = [
  // IPO: 111,112 MORE preferred shares at £90.00 (offer results RNS, 12 Oct 2026) — about
  // £10.0M gross (£2.4M institutional, £7.6M retail), ≈£8.3M net. A further 100,000 shares
  // sit in a market-sales (ATM) facility with Tennyson Capital Partners; add each week's
  // sales as they are disclosed. Admission to the LSE Main Market: 14 Oct 2026.
  { week: 'Oct 12', date: '2026-10-12', value: 10, ipo: true },
  // First Preferred Shares ATM Facility update (RNS 22 Oct 2026): 25 MORE shares sold since
  // 14 Oct 2026 at an average £100/share — £2,500 gross (£2,475 net).
  { week: 'Oct 19', date: '2026-10-19', value: 0.003 },
];

// Tennyson's weekly ATM sales of MORE (announced each Thursday by SWC), as parsed into the share-count ledger
// (scripts/capitalCounts.mjs -> data/capital-stack-counts.json swc.preferred.atmSalesLedger.entries) become weekly
// bars here: £M, dated to the Monday of the announcement's week. The gross £ proceeds stated in the RNS are used
// when there are any; otherwise shares x the current MORE price, flagged `est: true`.
function mondayOf(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
const WEEK_FMT = { month: 'short', day: 'numeric', timeZone: 'UTC' };
export function moreAtmRows(entries, price) {
  const byWeek = new Map();
  for (const e of entries ?? []) {
    const gbp = e.proceeds != null ? e.proceeds : e.shares * (price ?? 90);
    if (!(gbp > 0)) continue;
    const date = mondayOf(e.date);
    const row = byWeek.get(date) ?? { week: new Date(date + 'T12:00:00Z').toLocaleDateString('en-GB', WEEK_FMT).replace(/^(\d+) (\w+)$/, '$2 $1'), date, value: 0 };
    row.value += gbp / 1e6;
    if (e.proceeds == null) row.est = true;
    byWeek.set(date, row);
  }
  return [...byWeek.values()].map(r => ({ ...r, value: Math.round(r.value * 100) / 100 })).sort((a, b) => a.date.localeCompare(b.date));
}

// MORE has no EDGAR feed, so SEED_MORE_WEEKLY (edited by hand, or by the daily regulatory scan)
// is the source of truth. Merge it over whatever the stored blob carries — by date, seed wins —
// so edits to the seed show up even after the cron has already written moreWeekly to the blob.
// `atmRows` (from moreAtmRows) are added on top: a week that already has a hand-entered seed row keeps it.
export function mergeMoreWeekly(stored, atmRows = []) {
  const byDate = new Map((stored ?? []).filter(r => !r.atm).map(r => [r.date, r]));
  for (const r of atmRows) if (!byDate.has(r.date)) byDate.set(r.date, { ...r, atm: true });
  for (const r of SEED_MORE_WEEKLY) byDate.set(r.date, r);
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

// ── Preferred-share buybacks (shown as red bars below zero, netted off "capital raised") ─────────
// Strategy's buybacks (all five series) are parsed automatically from its weekly 8-K repurchase
// table — see lib/strategyFlow.js `bb`. Every other issuer's buybacks live here, in the same row
// shape as the weekly series: { week: 'Nov 2', date: '<Monday, YYYY-MM-DD>', value: <millions> }.
// $M for SATA/SATS/BMNP/CHAD, £M for MORE. Keyed to the MONDAY of the week the shares were bought.
// The daily regulatory scan adds rows here when an issuer's 8-K / press release discloses a
// repurchase of its preferred with an amount; a week that already has a row gets its value updated.

// MORE — SWC began repurchasing MORE shares into treasury under its 28 Sep 2026 GM authority.
// MORE buybacks are ALSO picked up automatically from each "MORE Preferred Shares Buyback" RNS by
// scripts/capitalCounts.mjs (data/capital-stack-counts.json swc.preferred.buybackLedger), so rows
// here are only needed if that parser misses one (it logs a warning when it does). Seed wins by date.
export const SEED_MORE_BUYBACKS = [
  // Preferred Shares Buyback RNS, 4 Nov 2026: 1,775 MORE shares bought back on 3 Nov 2026 at
  // £80.354/share (£142,985 total consideration), from existing cash — a ~10.7% discount to the
  // £90 offer price. 209,337 MORE shares remain in issue (ex the 1,775 held in treasury).
  { week: 'Nov 2', date: '2026-11-02', value: 0.143 },
];
export const SEED_SATA_BUYBACKS = []; // Strive's SATA ($M)
export const SEED_SATS_BUYBACKS = []; // Strive's SATS ($M)
export const SEED_BMNP_BUYBACKS = []; // Bitmine's BMNP ($M)
export const SEED_CHAD_BUYBACKS = []; // DeFi Development's CHAD ($M)

// Stored blob rows, then automatically parsed rows, then the hand-kept seed — later wins by date.
export function mergeBuybacks(seed, stored, parsed = []) {
  const byDate = new Map((stored ?? []).map(r => [r.date, r]));
  for (const r of parsed) byDate.set(r.date, r);
  for (const r of seed) byDate.set(r.date, r);
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

// MORE buyback ledger entries ({ date: <trade date>, shares, consideration: £ }) -> weekly £M rows.
export function moreBuybackRows(entries) {
  const byWeek = new Map();
  for (const e of entries ?? []) {
    if (!(e.consideration > 0)) continue;
    const date = mondayOf(e.tradeDate ?? e.date);
    const row = byWeek.get(date) ?? { week: new Date(date + 'T12:00:00Z').toLocaleDateString('en-GB', WEEK_FMT).replace(/^(\d+) (\w+)$/, '$2 $1'), date, value: 0 };
    row.value += e.consideration / 1e6;
    byWeek.set(date, row);
  }
  return [...byWeek.values()].map(r => ({ ...r, value: Math.round(r.value * 1000) / 1000 })).sort((a, b) => a.date.localeCompare(b.date));
}

export function mergeMoreBuybacks(stored, parsed = []) {
  return mergeBuybacks(SEED_MORE_BUYBACKS, stored, parsed);
}

export const SEED_CUMULATIVE = [
  { period: 'Jul 25',  strc: 2521,  sata: null },
  { period: 'Aug 25',  strc: 2543,  sata: null },
  { period: 'Sep 25',  strc: 2589,  sata: null },
  { period: 'Oct 25',  strc: 2654,  sata: null },
  { period: 'Nov 25',  strc: 2697,  sata: 160 },
  { period: 'Dec 25',  strc: 2746,  sata: 160 },
  { period: 'Jan 26',  strc: 3446,  sata: 279 },
  { period: 'Feb 26',  strc: 4086,  sata: 363 },
  { period: 'Mar wk1', strc: 4286,  sata: 363 },
  { period: 'Mar wk2', strc: 5466,  sata: 364 },
  { period: 'Mar wk3', strc: 6046,  sata: 364 },
  { period: 'Apr wk1', strc: 7246,  sata: 373 },
  { period: 'Apr wk2', strc: 7546,  sata: 373 },
  { period: 'Apr wk3', strc: 7946,  sata: 393 },
  { period: 'Apr wk4', strc: 8196,  sata: 432 },
  { period: 'May wk1', strc: 8326,  sata: 432 },
  { period: 'May wk2', strc: 8526,  sata: 432 },
  { period: 'May wk3', strc: 8926,  sata: 460 },
  { period: 'May wk4', strc: 10926, sata: 512 },
];

// ── Blob helpers ────────────────────────────────────────────────────────────

export async function getMoneyFlowData() {
  try {
    const res = await fetch(blobUrl(BLOB_FILENAME), {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveMoneyFlowData({ strcWeekly, strategyWeekly, sataWeekly, satsWeekly, bmnpWeekly, chadWeekly, moreWeekly, cumulative }) {
  const payload = JSON.stringify({
    strcWeekly,
    strategyWeekly: strategyWeekly ?? [], // cron-added weeks after SEED_THROUGH only
    sataWeekly,
    satsWeekly: satsWeekly ?? [],
    bmnpWeekly: bmnpWeekly ?? [],
    chadWeekly: chadWeekly ?? [],
    moreWeekly: moreWeekly ?? [],
    cumulative,
    lastUpdated: new Date().toISOString(),
  });
  await put(BLOB_FILENAME, payload, {
    access: 'private',
    contentType: 'application/json',
    allowOverwrite: true,
  });
}

// ── Utilities ───────────────────────────────────────────────────────────────

export function buildCumulative(strcWeekly, sataWeekly, bmnpWeekly = [], chadWeekly = [], moreWeekly = [], satsWeekly = []) {
  const strcByDate = Object.fromEntries(strcWeekly.map(d => [d.date, d.value]));
  // The cumulative chart's Strive line is SATA + SATS, summed per week
  const sataByDate = {};
  for (const d of [...sataWeekly, ...satsWeekly]) sataByDate[d.date] = (sataByDate[d.date] ?? 0) + d.value;
  const bmnpByDate = Object.fromEntries(bmnpWeekly.map(d => [d.date, d.value]));
  const chadByDate = Object.fromEntries(chadWeekly.map(d => [d.date, d.value]));
  // £M -> $M so the shared cumulative chart stays in a single currency
  const moreByDate = Object.fromEntries(moreWeekly.map(d => [d.date, d.value * MORE_GBPUSD]));

  const allDates = [...new Set([
    ...strcWeekly.map(d => d.date),
    ...sataWeekly.map(d => d.date),
    ...satsWeekly.map(d => d.date),
    ...bmnpWeekly.map(d => d.date),
    ...chadWeekly.map(d => d.date),
    ...moreWeekly.map(d => d.date),
  ])].sort();

  let strcTotal = 0;
  let sataTotal = 0;
  let bmnpTotal = 0;
  let chadTotal = 0;
  let moreTotal = 0;
  const result = [];

  for (const date of allDates) {
    if (strcByDate[date]) strcTotal += strcByDate[date];
    if (sataByDate[date]) sataTotal += sataByDate[date];
    if (bmnpByDate[date]) bmnpTotal += bmnpByDate[date];
    if (chadByDate[date]) chadTotal += chadByDate[date];
    if (moreByDate[date]) moreTotal += moreByDate[date];

    const d = new Date(date + 'T12:00:00Z');
    const mon = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
    const day = d.getUTCDate();
    const yr  = String(d.getUTCFullYear()).slice(2);

    result.push({
      period: `${mon} ${day} '${yr}`,
      strc:   strcTotal > 0 ? Math.round(strcTotal) : null,
      sata:   sataTotal > 0 ? Math.round(sataTotal) : null,
      bmnp:   bmnpTotal > 0 ? Math.round(bmnpTotal) : null,
      chad:   chadTotal > 0 ? Math.round(chadTotal) : null,
      more:   moreTotal > 0 ? Math.round(moreTotal) : null,
    });
  }

  return result;
}
