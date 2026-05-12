// Historical annual dividend rates (% of $100 par = $ per share per year)
// Add a new entry each month when issuers announce rate updates.
// Each entry's rate applies from its `from` date until the next entry.
export const YIELD_RATE_HISTORY = {
  // Source: Strategy IR / Nasdaq dividend history
  // Add a new entry each month when Strategy announces the next rate.
  STRC: [
    { from: '2025-07-30', annualRate:  9.00 }, // IPO date
    { from: '2025-09-01', annualRate: 10.00 },
    { from: '2025-10-01', annualRate: 10.25 },
    { from: '2025-11-01', annualRate: 10.50 },
    { from: '2026-01-01', annualRate: 11.00 },
    { from: '2026-02-01', annualRate: 11.25 },
    { from: '2026-03-01', annualRate: 11.50 },
  ],
  // Source: Strive IR / Nasdaq dividend history
  SATA: [
    { from: '2025-11-10', annualRate: 12.00 }, // IPO date
    { from: '2026-01-01', annualRate: 12.25 }, // announced Dec 15 2025, effective Jan payment
    { from: '2026-03-11', annualRate: 12.75 }, // announced Mar 11 2026
    { from: '2026-04-15', annualRate: 13.00 }, // announced Apr 15 2026
  ],
};

export function getRateForDate(ticker, dateStr) {
  const history = YIELD_RATE_HISTORY[ticker];
  if (!history || history.length === 0) return null;
  let rate = null;
  for (const entry of history) {
    if (entry.from <= dateStr) rate = entry.annualRate;
  }
  return rate;
}
