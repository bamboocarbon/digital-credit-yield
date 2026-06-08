// Announced annual dividend rate as both a % yield and $ per share (equal because par = $100)
export const ASSET_RATES = { STRC: 11.50, SATA: 13.00, BMNP: 9.50 };

export const VALID_TICKERS = ['STRC', 'SATA', 'BMNP'];

// Tickers that have been announced but are not yet trading — show pre-IPO state instead of live price
export const PRE_LISTING_TICKERS = [];

// Dividend payment frequency per ticker
export const PAYMENT_FREQUENCY = {
  STRC: { label: 'Monthly', perYear: 12, perPeriod: 'month' },
  SATA: { label: 'Monthly', perYear: 12, perPeriod: 'month' },
  BMNP: { label: 'Weekly',  perYear: 52, perPeriod: 'week'  },
};

export const CHART_PERIODS = [
  { label: '1M', value: '1mo' },
  { label: '3M', value: '3mo' },
  { label: '6M', value: '6mo' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: '2y' },
];
