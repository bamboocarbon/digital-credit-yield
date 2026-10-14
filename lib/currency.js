import { CURRENCY } from './constants.js';

// Currency symbol/formatting per ticker. MORE trades in sterling on the LSE; the rest are USD.
const SYMBOL = { USD: '$', GBP: '£', EUR: '€' };

// en-US keeps dollar amounts as "$1.00" (en-GB would render "US$1.00"); sterling reads naturally in en-GB.
export const localeFor = ticker => ({ GBP: 'en-GB', EUR: 'en-IE' }[currencyCode(ticker)] ?? 'en-US');
export const currencyCode = ticker => CURRENCY[ticker] ?? 'USD';
export const currencySymbol = ticker => SYMBOL[currencyCode(ticker)] ?? '$';

// "$1,234.50" / "£1,234.50"
export function formatMoney(ticker, value, digits = 2) {
  if (value == null || Number.isNaN(value)) return '—';
  return value.toLocaleString(localeFor(ticker), {
    style: 'currency',
    currency: currencyCode(ticker),
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
