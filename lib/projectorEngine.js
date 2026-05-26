export const HORIZON_MONTHS = { '1Y': 12, '2Y': 24, '3Y': 36, '5Y': 60, '10Y': 120, '20Y': 240 };
export const HORIZON_LABELS = { '1Y': '1 Year', '2Y': '2 Years', '3Y': '3 Years', '5Y': '5 Years', '10Y': '10 Years', '20Y': '20 Years' };

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
// paymentsPerYear: 12 for monthly instruments, 250 for SATA daily (NYSE business days)
export function runProjection(startValue, annualYieldPct, monthlyContribution, reinvestmentPct, months, paymentsPerYear = 12) {
  let portfolio = startValue;
  let totalDistributions = 0;
  let cashDistributions = 0;
  const history = [{ month: 0, portfolio, totalDistributions: 0, cashDistributions: 0 }];

  // Accounts for intra-month compounding when paymentsPerYear > 12
  // For n=12: resolves to annualYieldPct/100/12 (identical to old formula)
  const monthlyRate = Math.pow(1 + (annualYieldPct / 100) / paymentsPerYear, paymentsPerYear / 12) - 1;

  for (let m = 1; m <= months; m++) {
    const monthlyDist = portfolio * monthlyRate;
    const reinvested = monthlyDist * (reinvestmentPct / 100);
    portfolio += reinvested + monthlyContribution;
    totalDistributions += monthlyDist;
    cashDistributions += monthlyDist - reinvested;
    history.push({ month: m, portfolio, totalDistributions, cashDistributions });
  }
  return history;
}

// Effective APY for a given nominal rate and payment frequency
export function computeAPY(annualYieldPct, paymentsPerYear) {
  return (Math.pow(1 + (annualYieldPct / 100) / paymentsPerYear, paymentsPerYear) - 1) * 100;
}
