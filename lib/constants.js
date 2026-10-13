import { getRateForDate } from './yieldRateHistory.js';

// Announced annual dividend rate as both a % yield and $ per share (equal because par = $100).
// Derived from yieldRateHistory.js for today's date — the single source of truth for rate
// changes, updated by hand or by the daily rate-check routine. Do not hardcode these values
// directly; add the new rate to YIELD_RATE_HISTORY instead.
const FALLBACK_RATES = { STRC: 12.00, SATA: 13.00, BMNP: 9.50, CHAD: 13.00, MORE: 12.00 };
const TODAY = new Date().toISOString().split('T')[0];
export const ASSET_RATES = Object.fromEntries(
  Object.keys(FALLBACK_RATES).map(t => [t, getRateForDate(t, TODAY) ?? FALLBACK_RATES[t]])
);

// Stated/liquidation value per share — $100 for STRC/SATA/BMNP, but CHAD (DeFi
// Development Corp.'s Series C Preferred) has a $10 stated value instead. Every
// $-per-share calculation elsewhere (effective yield, per-payment amount, shares
// mode in the projector/differentiator) must scale off this, not assume $100.
export const PAR_VALUE = { STRC: 100, SATA: 100, BMNP: 100, CHAD: 10, MORE: 100 };

// Trading currency per ticker. MORE (The Smarter Web Company) is a sterling preferred on the
// London Stock Exchange; everything else is USD. Use lib/currency.js for the symbol/formatting
// rather than hardcoding "$" — a £ ticker run through a "$" label is the exact bug this prevents.
// MORE's £100 is the *reference value* the dividend is calculated on (nominal value is £0.001);
// the retail offer price was £90.
export const CURRENCY = { STRC: 'USD', SATA: 'USD', BMNP: 'USD', CHAD: 'USD', MORE: 'GBP' };

// Yahoo Finance symbol where it differs from the display ticker (London listings carry ".L").
// Yahoo quotes .L securities in pence (currency "GBp") — fetchStockData.js divides by 100.
export const YAHOO_SYMBOL = { MORE: 'MORE.L' };

export const BMNP_ENABLED = process.env.NEXT_PUBLIC_BMNP_ENABLED === 'true';

export const VALID_TICKERS = ['STRC', 'SATA', 'BMNP', 'CHAD', 'MORE'];

// Resolve a ?stock= query param to a valid, currently-visible ticker.
// Falls back to STRC for anything unknown, or for BMNP while the flag is off.
export function resolveStock(param) {
  const t = String(param || '').toUpperCase();
  if (t === 'BMNP' && !BMNP_ENABLED) return 'STRC';
  return VALID_TICKERS.includes(t) ? t : 'STRC';
}

// Tickers that have been announced but are not yet trading — show pre-IPO state instead of live price.
// BMNP began trading June 16, 2026, so nothing currently belongs here.
// MORE is admitted to the LSE Main Market on 14 Oct 2026; Yahoo has no MORE.L quote until
// then. Remove it from this list once the live price appears.
export const PRE_LISTING_TICKERS = ['MORE'];

// First trading day of MORE (LSE admission 8:00 BST, 14 Oct 2026). The daily/evening emails and
// the rocket video only start featuring MORE in their ticker rotation and snapshot strip from
// this date — before it there is no price to show. Their orange "Tracking …" header mentions MORE
// straight away, matching the website home page.
export const MORE_LIVE_FROM = '2026-10-14';
export const PRE_LISTING_NOTE = { MORE: 'Trading starts on the London Stock Exchange on 14 October 2026 — the live price will appear here once it does.' };

// Each issuer's total treasury holdings of its underlying crypto asset — disclosed via 8-K
// or press release, kept in sync by the regulatory scan's daily Treasury & Holdings step
// (see project_dcy_regulatory_scan memory / the routine's own prompt). Update by hand if the
// scan ever misses one; these are the single source of truth every consumer imports from,
// found stale independently in three separate files before 2026-09-25 (STRC was hardcoded at
// 880,000 when Strategy actually held 846,000).
export const STRIVE_BTC_HOLDINGS = '29,462';
export const STRATEGY_BTC_HOLDINGS = '848,250';
export const BITMINE_ETH_HOLDINGS = '6,028,946';
export const DFDV_SOL_HOLDINGS = '2,586,282';
// The Smarter Web Company (LSE: SWC, parent of MORE) — total BTC held, from its RNS bitcoin-purchase
// announcements. Seeded from the 3 Aug 2026 RNS; the daily scan keeps it current (Step 9).
export const SMARTER_WEB_BTC_HOLDINGS = '2,712';

// Dividend payment frequency per ticker
export const PAYMENT_FREQUENCY = {
  STRC: { label: 'Semi-Monthly', perYear: 24, perPeriod: 'semi-month' },
  SATA: { label: 'Daily', perYear: 250, perPeriod: 'day' },
  BMNP: { label: 'Weekly',  perYear: 52, perPeriod: 'week'  },
  CHAD: { label: 'Daily', perYear: 250, perPeriod: 'day' },
  MORE: { label: 'Weekly', perYear: 52, perPeriod: 'week' },
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
  { recordDate: '2026-08-25', paymentDate: '2026-09-04', amount: 0.1583 },
  { recordDate: '2026-09-01', paymentDate: '2026-09-11', amount: 0.1847 },
  { recordDate: '2026-09-08', paymentDate: '2026-09-18', amount: 0.1847 },
  { recordDate: '2026-09-15', paymentDate: '2026-09-25', amount: 0.1847 },
  { recordDate: '2026-09-22', paymentDate: '2026-10-02', amount: 0.1847 },
  { recordDate: '2026-09-29', paymentDate: '2026-10-09', amount: 0.1847 },
  { recordDate: '2026-10-06', paymentDate: '2026-10-16', amount: 0.1847 },
  { recordDate: '2026-10-13', paymentDate: '2026-10-23', amount: 0.1847 },
  { recordDate: '2026-10-20', paymentDate: '2026-10-30', amount: 0.1847 },
  { recordDate: '2026-10-27', paymentDate: '2026-11-06', amount: 0.1583 },
  { recordDate: '2026-11-03', paymentDate: '2026-11-13', amount: 0.1847 },
  { recordDate: '2026-11-10', paymentDate: '2026-11-20', amount: 0.1847 },
  { recordDate: '2026-11-17', paymentDate: '2026-11-27', amount: 0.1847 },
  { recordDate: '2026-11-24', paymentDate: '2026-12-04', amount: 0.1847 },
  { recordDate: '2026-12-01', paymentDate: '2026-12-11', amount: 0.1847 },
  { recordDate: '2026-12-08', paymentDate: '2026-12-18', amount: 0.1847 },
  { recordDate: '2026-12-18', paymentDate: '2026-12-28', amount: 0.2639 },
];

// What each issuer discloses as backing its preferred dividend — a cash reserve for
// STRC/SATA, or (for BMNP, which has no equivalent reserve) the ETH staking income that
// funds it directly. Update by hand as each issuer discloses a new figure (Strategy
// monthly-ish, Strive with quarterly earnings/8-Ks, Bitmine with its ETH holdings updates).
export const DIVIDEND_RESERVE = {
  STRC: {
    label: 'USD Reserve',
    display: '$4.88B',
    note: 'USD Cash component $640.5M, used to fund STRC buybacks and preferred dividends · disclosed Oct 12, 2026',
    source: 'https://assets.contentstack.io/v3/assets/bltf8d808d9b8cebd37/blte419037cd092e319/6acc004404e85227007cf7c7/strategy-acquires-250-btc-and-repurchases-192-million-of-strc_10-12-2026.pdf',
  },
  SATA: {
    label: 'Cash & Equivalents',
    display: '$284.7M',
    note: 'Pure cash figure (excludes STRC shares held) · disclosed Oct 5, 2026',
    source: 'https://www.stocktitan.net/sec-filings/ASST/8-k-strive-inc-reports-material-event-442c19a0dfac.html',
  },
  BMNP: {
    label: 'ETH Staking Revenue',
    display: '$336M/yr',
    // Frozen to its own disclosure date on purpose — 5,067,309 staked = 84% of
    // 6,028,946 was true specifically as of Oct 11, 2026, and would go arithmetically
    // inconsistent if the total were swapped for BITMINE_ETH_HOLDINGS' latest figure
    // without also updating the staked amount and % from the same later disclosure.
    note: 'Staking payouts fuel the dividend — current-rate annualized from 5,067,309 ETH staked (84% of 6,028,946 ETH holdings) via MAVAN, 2.61% 7-day yield · disclosed Oct 12, 2026',
    source: 'https://www.cryptotimes.io/2026/10/12/bitmine-buys-12532-eth-holdings-hit-6-03-million-as-5-ethereum-cap-nears/',
  },
  CHAD: {
    label: 'Dividend Reserve',
    display: '$1.30/share',
    note: "12 months of projected dividend payments set aside at each closing, per DeFi Development Corp.'s prospectus · disclosed Sep 8, 2026",
    source: 'https://www.sec.gov/Archives/edgar/data/0001805526/000180552626000080/dfdvchadfwp.htm',
  },
  MORE: {
    label: 'Working Capital & Dividend Reserve',
    display: '£3.85M',
    note: "Net IPO proceeds earmarked for working capital and general corporate purposes, including dividend cash reserves — shared with other uses, so not a ring-fenced dividend fund. Annual dividend on the 111,112 IPO shares is about £1.33M · per the 12 Oct 2026 offer results",
    source: 'https://mugglehead.com/the-smarter-web-company-plc-more-preferred-offer-results/',
  },
};

export const CHART_PERIODS = [
  { label: '1M', value: '1mo' },
  { label: '3M', value: '3mo' },
  { label: '6M', value: '6mo' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: '2y' },
];
