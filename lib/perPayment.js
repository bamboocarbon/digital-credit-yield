// Per-payment dividend figures read from data/dividends-*.json, which the daily scan (and the hand-kept
// STRC/STRK/STRF/STRD files) keep current. Used by the compare table and the SATA hub so neither has a typed number.
import SATA from '@/data/dividends-SATA.json';
import STRC from '@/data/dividends-STRC.json';
import BMNP from '@/data/dividends-BMNP.json';
import CHAD from '@/data/dividends-CHAD.json';
import MORE from '@/data/dividends-MORE.json';

const FILES = { SATA, STRC, BMNP, CHAD, MORE };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ym = d => String(d.date).slice(0, 7);
const prevYm = k => { const [y, m] = k.split('-').map(Number); return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`; };
const today = () => new Date().toISOString().slice(0, 10);

// Rows for one calendar month, ignoring the odd first-period stub (a payment more than 50% off the month's median).
function monthRows(ticker, key) {
  const rows = (FILES[ticker] || []).filter(d => ym(d) === key);
  if (rows.length < 3) return rows;
  const s = rows.map(r => r.amount).sort((a, b) => a - b);
  const med = s[Math.floor(s.length / 2)];
  return rows.filter(r => Math.abs(r.amount - med) <= med * 0.5);
}

// The month to describe: this month if the file has rows for it, otherwise the latest month with rows.
function currentKey(ticker) {
  const rows = FILES[ticker] || [];
  const now = today().slice(0, 7);
  if (rows.some(d => ym(d) === now)) return now;
  const past = rows.filter(d => d.date <= today());
  return past.length ? ym(past[past.length - 1]) : rows.length ? ym(rows[0]) : null;
}

export function monthSummary(ticker, key = currentKey(ticker)) {
  if (!key) return null;
  const all = (FILES[ticker] || []).filter(d => ym(d) === key);
  const rows = monthRows(ticker, key);
  if (!rows.length) return null;
  const total = all.reduce((a, r) => a + r.amount, 0);
  const amounts = rows.map(r => r.amount).sort((a, b) => a - b);
  const median = amounts[Math.floor(amounts.length / 2)];
  const mean = rows.reduce((a, r) => a + r.amount, 0) / rows.length;
  return { key, month: MONTHS[Number(key.slice(5)) - 1], days: all.length, total, mean, median };
}
export const previousMonthSummary = ticker => { const k = currentKey(ticker); return k ? monthSummary(ticker, prevYm(k)) : null; };

const fmt = (n, sym) => `${sym}${n >= 0.1 ? n.toFixed(3) : n.toPrecision(2)}`;
// "~$0.057/share (Nov)" for daily payers (mean of the month, since the amount shifts month to month),
// "~$0.185/share" for weekly payers (median, so an odd stub week doesn't skew it).
export function perPaymentLabel(ticker, sym, fallback) {
  const s = monthSummary(ticker);
  if (!s) return fallback;
  const daily = ticker !== 'BMNP' && ticker !== 'MORE';
  return `~${fmt(daily ? s.mean : s.median, sym)}/share${daily ? ` (${s.month.slice(0, 3)})` : ''}`;
}
