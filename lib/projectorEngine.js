export const HORIZON_MONTHS = { '1Y': 12, '2Y': 24, '3Y': 36, '5Y': 60, '10Y': 120 };
export const HORIZON_LABELS = { '1Y': '1 Year', '2Y': '2 Years', '3Y': '3 Years', '5Y': '5 Years', '10Y': '10 Years' };

export const fmt = v => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function fmtNum(v) {
  if (v === '' || v == null) return '';
  const n = Number(String(v).replace(/,/g, ''));
  return isNaN(n) ? '' : n.toLocaleString('en-US');
}

export function stripNum(v) {
  return String(v).replace(/[^0-9]/g, '');
}

// Returns history entries: { month, portfolio, totalDistributions, cashDistributions }
// totalDistributions = all income (reinvested + cash); cashDistributions = income taken as cash only
export function runProjection(startValue, annualYieldPct, monthlyContribution, reinvestmentPct, months) {
  let portfolio = startValue;
  let totalDistributions = 0;
  let cashDistributions = 0;
  const history = [{ month: 0, portfolio, totalDistributions: 0, cashDistributions: 0 }];

  for (let m = 1; m <= months; m++) {
    const monthlyDist = (portfolio * (annualYieldPct / 100)) / 12;
    const reinvested = monthlyDist * (reinvestmentPct / 100);
    portfolio += reinvested + monthlyContribution;
    totalDistributions += monthlyDist;
    cashDistributions += monthlyDist - reinvested;
    history.push({ month: m, portfolio, totalDistributions, cashDistributions });
  }
  return history;
}
