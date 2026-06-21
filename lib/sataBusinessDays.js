// Source: Strive May 2026 Investor Update
// Formula: dailyDividend = $100 × (annualRate / 100) / 12 / businessDaysInMonth

import { isNyseMarketDay } from './marketDays.js';

export const SATA_DAILY_START = '2026-06-16';

// Per Strive's Amended and Restated Certificate of Designation (filed as an 8-K around
// June 15, 2026), the June 16-30 stub period is explicitly prorated at half a regular
// monthly dividend ("required dividend payments due for such period equal to half a
// month of regular dividend payments") — not a full month compressed into fewer business
// days. From July 2026 onward, dividends revert to a full month's total subdivided across
// that month's business days.
const SATA_STUB_YM = '2026-06';
const SATA_STUB_FRACTION = 0.5;

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

// Returns the expected monthly total per share (always annual/12, regardless of business day count)
export function getSataMonthlyTotal(annualRate) {
  return (100 * (annualRate / 100)) / 12;
}

// Returns the expected dividend total for a given dividend period — half a month for the
// June 2026 stub, a full month for every period before or after it.
export function getSataExpectedPeriodAmount(yearMonth, annualRate) {
  const monthlyTotal = getSataMonthlyTotal(annualRate);
  return yearMonth === SATA_STUB_YM ? monthlyTotal * SATA_STUB_FRACTION : monthlyTotal;
}

// Returns the daily dividend per share at $100 par
// annualRate: e.g. 13.00 (as a percentage)
export function getSataDailyDividend(annualRate, yearMonth) {
  const days = getBusinessDaysInMonth(yearMonth);
  if (!days) return null;
  return getSataExpectedPeriodAmount(yearMonth, annualRate) / days;
}

// June 2026 is a hybrid month: the final monthly payment (already paid in full on June 15)
// and the new daily-dividend stub period (June 16-30, still accumulating) both land in the
// same calendar month. Treating "paid so far" against the combined expected total — the
// already-complete monthly leg plus the half-month stub total — means the month reads as
// genuinely partial instead of "done" the instant either leg completes. For any pure daily
// month (no monthly leg), this reduces to the familiar paid-days / total-days ratio.
export function getSataMonthProgress({ monthlyPaid = 0, dailyPaid = 0, annualRate, yearMonth }) {
  const monthlyExpected = monthlyPaid > 0 ? monthlyPaid : 0;
  const dailyExpected   = getSataExpectedPeriodAmount(yearMonth, annualRate);
  const expected = monthlyExpected + dailyExpected;
  const paid     = monthlyPaid + dailyPaid;
  return { paid, expected, fillPct: expected > 0 ? Math.min(paid / expected, 1) : 0 };
}

// Number of NYSE business days in a month's daily-dividend window that have elapsed
// on or before `asOfYmd` (a 'YYYY-MM-DD' string), capped at the month's published total.
// SATA pays every business day, so this is the reliable count of payments made to date —
// Yahoo's event feed lags by a few days, so counting recorded events understates reality.
// The June 2026 stub window starts at SATA_DAILY_START; every other month starts on the 1st.
export function getSataDailyPaymentsToDate(yearMonth, asOfYmd) {
  const total = getBusinessDaysInMonth(yearMonth);
  if (!total) return 0;
  const startStr = yearMonth === SATA_STUB_YM ? SATA_DAILY_START : `${yearMonth}-01`;
  if (asOfYmd < startStr) return 0;
  const [y, m] = yearMonth.split('-').map(Number);
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const endStr = `${yearMonth}-${String(lastDay).padStart(2, '0')}`;
  const cap = asOfYmd < endStr ? asOfYmd : endStr;
  let count = 0;
  for (let d = new Date(`${startStr}T12:00:00Z`); d.toISOString().slice(0, 10) <= cap; d.setUTCDate(d.getUTCDate() + 1)) {
    if (isNyseMarketDay(d)) count++;
  }
  return Math.min(count, total);
}
