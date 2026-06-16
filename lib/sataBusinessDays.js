// Source: Strive May 2026 Investor Update
// Formula: dailyDividend = $100 × (annualRate / 100) / 12 / businessDaysInMonth

export const SATA_DAILY_START = '2026-06-16';

// Yahoo Finance sometimes dates a dividend event by its ex-dividend date rather
// than its payment date, which can land a daily payment one day before
// SATA_DAILY_START. Daily payments (~$0.04-0.06/share) are an order of magnitude
// smaller than monthly ones (~$1+/share), so amount is a reliable second signal
// for classifying a dividend as "daily" even when its date is ambiguous.
const DAILY_AMOUNT_THRESHOLD = 0.5;

export function isSataDailyDividend(d) {
  return d.date >= SATA_DAILY_START || d.amount < DAILY_AMOUNT_THRESHOLD;
}

// NYSE business days per month as published by Strive
// Jun 2026 is a stub period (June 16–30 only)
const BUSINESS_DAYS = {
  '2026-06': 10,
  '2026-07': 22,
  '2026-08': 21,
  '2026-09': 21,
  '2026-10': 21,
  '2026-11': 19,
  '2026-12': 22,
  '2027-01': 19,
  '2027-02': 19,
  '2027-03': 22,
  '2027-04': 22,
  '2027-05': 20,
  '2027-06': 21,
  '2027-07': 21,
  '2027-08': 22,
  '2027-09': 21,
  '2027-10': 20,
  '2027-11': 20,
  '2027-12': 21,
  '2028-01': 20,
  '2028-02': 20,
  '2028-03': 23,
  '2028-04': 21,
  '2028-05': 22,
  '2028-06': 21,
  '2028-07': 20,
  '2028-08': 23,
  '2028-09': 20,
  '2028-10': 21,
  '2028-11': 20,
  '2028-12': 20,
};

export function getBusinessDaysInMonth(yearMonth) {
  return BUSINESS_DAYS[yearMonth] ?? null;
}

// Returns the daily dividend per share at $100 par
// annualRate: e.g. 13.00 (as a percentage)
export function getSataDailyDividend(annualRate, yearMonth) {
  const days = getBusinessDaysInMonth(yearMonth);
  if (!days) return null;
  return (100 * (annualRate / 100)) / 12 / days;
}

// Returns the expected monthly total per share (always annual/12, regardless of business day count)
export function getSataMonthlyTotal(annualRate) {
  return (100 * (annualRate / 100)) / 12;
}

// June 2026 is a hybrid month: the final monthly payment (already paid in full on June 15)
// and the new daily-dividend stub period (June 16-30, still accumulating) both land in the
// same calendar month. Treating "paid so far" against the combined expected total — the
// already-complete monthly leg plus a full month's worth of daily payments — means the month
// reads as genuinely partial instead of "done" the instant either leg completes. For any pure
// daily month (no monthly leg), this reduces to the familiar paid-days / total-days ratio.
export function getSataMonthProgress({ monthlyPaid = 0, dailyPaid = 0, annualRate }) {
  const monthlyExpected = monthlyPaid > 0 ? monthlyPaid : 0;
  const dailyExpected   = getSataMonthlyTotal(annualRate);
  const expected = monthlyExpected + dailyExpected;
  const paid     = monthlyPaid + dailyPaid;
  return { paid, expected, fillPct: expected > 0 ? Math.min(paid / expected, 1) : 0 };
}
