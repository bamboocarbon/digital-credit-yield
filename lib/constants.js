import { getRateForDate } from './yieldRateHistory.js';

// Announced annual dividend rate as both a % yield and $ per share (equal because par = $100).
// Derived from yieldRateHistory.js for today's date — the single source of truth for rate
// changes, updated by hand or by the daily rate-check routine. Do not hardcode these values
// directly; add the new rate to YIELD_RATE_HISTORY instead.
const FALLBACK_RATES = { STRC: 12.00, SATA: 13.00, BMNP: 9.50 };
const TODAY = new Date().toISOString().split('T')[0];
export const ASSET_RATES = Object.fromEntries(
  Object.keys(FALLBACK_RATES).map(t => [t, getRateForDate(t, TODAY) ?? FALLBACK_RATES[t]])
);

export const BMNP_ENABLED = process.env.NEXT_PUBLIC_BMNP_ENABLED === 'true';

export const VALID_TICKERS = ['STRC', 'SATA', 'BMNP'];

// Resolve a ?stock= query param to a valid, currently-visible ticker.
// Falls back to STRC for anything unknown, or for BMNP while the flag is off.
export function resolveStock(param) {
  const t = String(param || '').toUpperCase();
  if (t === 'BMNP' && !BMNP_ENABLED) return 'STRC';
  return VALID_TICKERS.includes(t) ? t : 'STRC';
}

// Tickers that have been announced but are not yet trading — show pre-IPO state instead of live price.
// BMNP began trading June 16, 2026, so nothing currently belongs here.
export const PRE_LISTING_TICKERS = [];

export const STRIVE_BTC_HOLDINGS = '19,921';

// Dividend payment frequency per ticker
export const PAYMENT_FREQUENCY = {
  STRC: { label: 'Semi-Monthly', perYear: 24, perPeriod: 'semi-month' },
  SATA: { label: 'Daily', perYear: 250, perPeriod: 'day' },
  BMNP: { label: 'Weekly',  perYear: 52, perPeriod: 'week'  },
};

// Shareholders approved the move to semi-monthly on 8 June 2026; first actual
// semi-monthly payment is 15 July 2026 — until then STRC still pays monthly.
export const STRC_SEMI_MONTHLY_START = '2026-07-15';

// Per Bitmine's own 8-Ks announcing dividends on the Series A Preferred (BMNP), which
// began trading June 16, 2026 — NOT from Yahoo Finance, whose dividend feed for this
// newly-listed, non-standard-cadence security has been found unreliable (wrong dates and
// amounts that don't match any dividend Bitmine has actually declared). The first two
// payments are stubs covering the initial partial periods; the third (record 06/30,
// paid 07/10, $0.1056) is still below the ~$0.1827/share full weekly rate, so weekly
// payments may not have fully normalized yet — add each new confirmed payment here as
// Bitmine announces it, in both this schedule and data/dividends-BMNP.json.
export const BMNP_DIVIDEND_SCHEDULE = [
  { recordDate: '2026-06-12', paymentDate: '2026-06-22', amount: 0.316667 },
  { recordDate: '2026-06-16', paymentDate: '2026-06-26', amount: 0.105556 },
  { recordDate: '2026-06-30', paymentDate: '2026-07-10', amount: 0.1056 },
  { recordDate: '2026-07-07', paymentDate: '2026-07-17', amount: 0.1847 },
  { recordDate: '2026-07-14', paymentDate: '2026-07-24', amount: 0.1847 },
  { recordDate: '2026-07-21', paymentDate: '2026-07-31', amount: 0.1847 },
  { recordDate: '2026-07-28', paymentDate: '2026-08-07', amount: 0.1847 },
  { recordDate: '2026-08-04', paymentDate: '2026-08-14', amount: 0.1847 },
  { recordDate: '2026-08-11', paymentDate: '2026-08-21', amount: 0.1847 },
  { recordDate: '2026-08-18', paymentDate: '2026-08-28', amount: 0.1847 },
];

// What each issuer discloses as backing its preferred dividend — a cash reserve for
// STRC/SATA, or (for BMNP, which has no equivalent reserve) the ETH staking income that
// funds it directly. Update by hand as each issuer discloses a new figure (Strategy
// monthly-ish, Strive with quarterly earnings/8-Ks, Bitmine with its ETH holdings updates).
export const DIVIDEND_RESERVE = {
  STRC: {
    label: 'USD Reserve',
    display: '$3.2B',
    note: '~20 months of dividend coverage · disclosed Jul 19, 2026',
    source: 'https://www.strategy.com/press/strategy-announces-digital-credit-capital-framework_06-29-2026',
  },
  SATA: {
    label: 'Cash & Equivalents',
    display: '$157.4M',
    note: 'Part of an 18-month reserve (12mo cash + 6mo STRC holdings) · disclosed Jul 17, 2026',
    source: 'https://investors.strive.com',
  },
  BMNP: {
    label: 'ETH Staking Revenue',
    display: '$247M/yr',
    note: 'Staking payouts fuel the dividend — annualized from ~4.9M ETH staked (85% of holdings) via MAVAN · disclosed Jul 20, 2026',
    source: 'https://www.prnewswire.com/news-releases/bitmine-immersion-technologies-bmnr-announces-eth-holdings-reach-5-77-million-tokens-and-total-crypto-and-total-cash-holdings-of-11-3-billion-302823523.html',
  },
};

export const CHART_PERIODS = [
  { label: '1M', value: '1mo' },
  { label: '3M', value: '3mo' },
  { label: '6M', value: '6mo' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: '2y' },
];
