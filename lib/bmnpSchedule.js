import { BMNP_DIVIDEND_SCHEDULE } from './constants';

// Returns the weekly dividend per share at $100 par (annualRate as a percentage)
export function getBmnpWeeklyAmount(annualRate) {
  return (100 * (annualRate / 100)) / 52;
}

// Bitmine has only announced specific amounts for the first two stub payments
// (see BMNP_DIVIDEND_SCHEDULE). Beyond that, dividends are projected to land
// every 7 days at the regular weekly rate so we can show an "expected this
// month" ghost total before Yahoo Finance has any real payment data to report.
export function getBmnpExpectedMonthlyTotal(yearMonth, annualRate) {
  const weeklyAmount = getBmnpWeeklyAmount(annualRate);
  const [y, m] = yearMonth.split('-').map(Number);
  const monthStart = new Date(Date.UTC(y, m - 1, 1));
  const monthEnd   = new Date(Date.UTC(y, m, 0));

  let total = 0;
  BMNP_DIVIDEND_SCHEDULE.forEach(p => {
    if (p.paymentDate.slice(0, 7) === yearMonth) total += p.amount;
  });

  const lastAnnounced = BMNP_DIVIDEND_SCHEDULE[BMNP_DIVIDEND_SCHEDULE.length - 1].paymentDate;
  let next = new Date(`${lastAnnounced}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 7);
  while (next <= monthEnd) {
    if (next >= monthStart) total += weeklyAmount;
    next = new Date(next.getTime() + 7 * 86400000);
  }
  return total;
}
