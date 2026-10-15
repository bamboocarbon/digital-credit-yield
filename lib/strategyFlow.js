// Money raised and returned by each Strategy preferred series, week by week, compiled 2026-10-15 from
// Strategy's own 8-Ks: the ATM table ("Net Proceeds"), the repurchase table ("Aggregate Purchase
// Price") and each series' IPO pricing 8-K. $ millions net of sales commissions, except STRE (EUR
// millions). `date` is the Monday of the reporting week; weeks with nothing filed are simply absent.
// Cross-check: STRC IPO + ATM face value less buybacks reconciles to the ~$8.78bn on strategy.com.
// The daily cron (parseStrategyWeek in edgarParser.js) appends newer weeks to the stored blob; this
// seed wins for every week up to SEED_THROUGH.
export const STRATEGY_PRODUCTS = ['STRK', 'STRF', 'STRD', 'STRE', 'STRC'];
export const STRATEGY_IPO = {
  STRK: { date: '2025-01-30', rate: '8.00%' },
  STRF: { date: '2025-03-20', rate: '10.00%' },
  STRD: { date: '2025-06-05', rate: '10.00%' },
  STRC: { date: '2025-07-24', rate: 'Variable (12.00%)' },
  // STRE is a euro security: €608.8M net, shown in USD at the EUR/USD close on the 13 Nov 2025 closing date.
  STRE: { date: '2025-11-06', rate: '10.00%', eur: true, fx: 1.1592 },
};
export const SEED_THROUGH = '2026-10-05';

export const SEED_STRATEGY_WEEKLY = [
  { date: '2025-02-03', net: {STRK: 563.4}, ipo: ['STRK'] },
  { date: '2025-03-24', net: {STRK: 18.5, STRF: 711.2}, ipo: ['STRF'] },
  { date: '2025-04-14', net: {STRK: 7.8} },
  { date: '2025-04-21', net: {STRK: 37.5} },
  { date: '2025-04-28', net: {STRK: 51.8} },
  { date: '2025-05-05', net: {STRK: 25.1} },
  { date: '2025-05-12', net: {STRK: 59.7} },
  { date: '2025-05-19', net: {STRK: 67.9, STRF: 10.4} },
  { date: '2025-05-26', net: {STRK: 36.2, STRF: 38.4} },
  { date: '2025-06-02', net: {STRK: 66.4, STRF: 45.8} },
  { date: '2025-06-09', net: {STRK: 48.4, STRF: 30.0, STRD: 979.7}, ipo: ['STRD'] },
  { date: '2025-06-16', net: {STRK: 17.4, STRF: 8.7} },
  { date: '2025-06-23', net: {STRK: 28.9, STRF: 29.7} },
  { date: '2025-07-07', net: {STRK: 71.1, STRF: 55.3, STRD: 15.0} },
  { date: '2025-07-14', net: {STRK: 0.7, STRF: 0.2, STRD: 3.0} },
  { date: '2025-07-28', net: {STRC: 2474.0}, ipo: ['STRC'] },
  { date: '2025-08-04', net: {STRF: 13.6} },
  { date: '2025-08-11', net: {STRK: 19.3, STRF: 19.0, STRD: 12.1} },
  { date: '2025-08-18', net: {STRK: 20.4, STRF: 26.6, STRD: 0.1} },
  { date: '2025-08-25', net: {STRK: 19.0, STRF: 26.5, STRD: 1.0} },
  { date: '2025-09-01', net: {STRK: 5.2, STRF: 11.6} },
  { date: '2025-09-08', net: {STRK: 17.3, STRF: 34.0, STRD: 16.9} },
  { date: '2025-09-15', net: {STRF: 19.4} },
  { date: '2025-09-22', net: {STRF: 11.3, STRD: 0.4} },
  { date: '2025-10-06', net: {STRK: 1.7, STRF: 19.8, STRD: 5.8} },
  { date: '2025-10-13', net: {STRK: 5.1, STRF: 11.2, STRD: 2.6} },
  { date: '2025-10-20', net: {STRK: 17.0, STRF: 19.4, STRD: 7.0} },
  { date: '2025-10-27', net: {STRK: 4.4, STRF: 8.4, STRD: 2.3} },
  { date: '2025-11-03', net: {STRK: 4.5, STRF: 18.3, STRD: 1.0, STRC: 26.2} },
  { date: '2025-11-10', net: {STRK: 0.5, STRF: 4.4, STRC: 131.2, STRE: 608.8}, ipo: ['STRE'] },
  { date: '2025-12-01', net: {STRD: 34.9} },
  { date: '2025-12-08', net: {STRK: 0.6, STRF: 18.0, STRD: 82.2} },
  { date: '2026-01-05', net: {STRC: 119.1} },
  { date: '2026-01-12', net: {STRK: 3.4, STRC: 294.3} },
  { date: '2026-01-19', net: {STRC: 7.0} },
  { date: '2026-02-09', net: {STRC: 78.4} },
  { date: '2026-02-23', net: {STRC: 7.1} },
  { date: '2026-03-02', net: {STRC: 377.1} },
  { date: '2026-03-09', net: {STRC: 1180.4} },
  { date: '2026-03-30', net: {STRC: 227.3} },
  { date: '2026-04-06', net: {STRC: 1001.3} },
  { date: '2026-04-13', net: {STRC: 2176.3} },
  { date: '2026-05-04', net: {STRC: 0.1} },
  { date: '2026-05-11', net: {STRC: 1949.0} },
  { date: '2026-07-20', net: {}, bb: {STRC: 25.0} },
  { date: '2026-07-27', net: {}, bb: {STRC: 81.2} },
  { date: '2026-08-03', net: {}, bb: {STRC: 108.6} },
  { date: '2026-08-10', net: {}, bb: {STRC: 132.2} },
  { date: '2026-08-17', net: {}, bb: {STRC: 136.4} },
  { date: '2026-08-24', net: {}, bb: {STRC: 151.8} },
  { date: '2026-08-31', net: {}, bb: {STRC: 176.3} },
  { date: '2026-09-07', net: {}, bb: {STRC: 139.3} },
  { date: '2026-09-14', net: {}, bb: {STRC: 174.0} },
  { date: '2026-09-21', net: {}, bb: {STRC: 151.7} },
  { date: '2026-09-28', net: {}, bb: {STRC: 102.6} },
  { date: '2026-10-05', net: {}, bb: {STRC: 192.4} },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function weekLabelOf(date) {
  const [, m, d] = date.split('-');
  return `${MONTHS[parseInt(m, 10) - 1]} ${parseInt(d, 10)}`;
}

// Seed wins up to SEED_THROUGH; stored (cron-added) weeks after it are kept.
export function mergeStrategyWeekly(stored) {
  const later = (stored ?? []).filter(r => r.date > SEED_THROUGH);
  return [...SEED_STRATEGY_WEEKLY, ...later].sort((a, b) => a.date.localeCompare(b.date));
}

// The existing STRC bar-chart / cumulative series: IPO + ATM net proceeds per week (buybacks are
// shown separately, not netted off "capital raised").
export function deriveStrcWeekly(strategyWeekly) {
  return strategyWeekly
    .filter(r => r.net?.STRC > 0)
    .map(r => ({
      week: weekLabelOf(r.date),
      date: r.date,
      value: Math.round(r.net.STRC * 10) / 10,
      ...(r.ipo?.includes('STRC') ? { ipo: true } : {}),
    }));
}

// All five Strategy series on one line: net cash raised per week in USD (STRE converted at its
// closing-date rate), IPOs included, buybacks NOT netted off — this is "capital raised", for the card and
// the cumulative chart. Same row shape as the other issuers' weekly series.
export function deriveStrategyRaisedWeekly(strategyWeekly) {
  const out = [];
  for (const r of strategyWeekly) {
    let value = 0;
    for (const [k, v] of Object.entries(r.net ?? {})) value += v * (STRATEGY_IPO[k]?.fx ?? 1);
    if (value <= 0) continue;
    out.push({ week: weekLabelOf(r.date), date: r.date, value: Math.round(value * 10) / 10, ...(r.ipo?.length ? { ipo: true } : {}) });
  }
  return out;
}

// Per-product totals for the table: native currency, plus `usd` (STRE converted at its closing-date rate).
export function strategyTotals(strategyWeekly) {
  return STRATEGY_PRODUCTS.map(k => {
    let ipoNet = 0, atmNet = 0, buyback = 0, lastAtm = null;
    for (const r of strategyWeekly) {
      const n = r.net?.[k] ?? 0;
      if (n > 0) {
        if (r.ipo?.includes(k)) ipoNet += n;
        else { atmNet += n; lastAtm = r.date; }
      }
      buyback += r.bb?.[k] ?? 0;
    }
    const fx = STRATEGY_IPO[k].fx ?? 1;
    const total = ipoNet + atmNet - buyback;
    return { ticker: k, ...STRATEGY_IPO[k], ipoNet, atmNet, buyback, lastAtm, total, usd: { ipoNet: ipoNet * fx, atmNet: atmNet * fx, buyback: buyback * fx, total: total * fx } };
  });
}
