import YahooFinance from 'yahoo-finance2';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getStockQuote } from './fetchStockData.js';
import { CAPITAL_STACKS } from './capitalStacks.js';

// Turns a stack's `live` row specs into market values: shares x last closing price (see capitalStacks.js).
// Closes rather than intraday prices so the ticker pages only need rebuilding once a day (Fluid CPU,
// 2026-10-30): /api/cron/refresh-pyramids marks them stale after the US close.
// Every failure falls back to the row's static `mcap`, so a Yahoo hiccup never blanks a pyramid.
const yahoo = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
const TTL = 10 * 60 * 1000;
const cache = new Map();
const memo = async (key, fn) => {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < TTL) return hit.v;
  const v = await fn();
  cache.set(key, { t: Date.now(), v });
  return v;
};

// Common-stock last close in the stock's own currency units (pence -> pounds for London listings).
// During trading the last close is previousClose; otherwise regularMarketPrice still holds it.
const equityPrice = symbol => memo(`eq:${symbol}`, async () => {
  const q = await yahoo.quote(symbol);
  const k = q.currency === 'GBp' || q.currency === 'GBX' ? 0.01 : 1;
  const close = q.marketState === 'REGULAR' ? (q.regularMarketPreviousClose ?? q.regularMarketPrice) : q.regularMarketPrice;
  return close * k;
});
const tickerPrice = ticker => memo(`tk:${ticker}`, async () => (await getStockQuote(ticker)).lastClose);

async function readCounts() {
  try { return JSON.parse(await readFile(join(process.cwd(), 'data', 'capital-stack-counts.json'), 'utf8')); } catch { return null; }
}
const dig = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

async function resolveRow(row, counts) {
  if (!row.live) return row;
  try {
    const shareSpec = row.live.shares;
    const shares = shareSpec.startsWith('counts:') ? dig(counts, shareSpec.slice(7)) : Number(shareSpec.slice(6));
    const [pxSpec, fx = '1'] = row.live.price.split('@');
    const price = pxSpec.startsWith('eq:') ? await equityPrice(pxSpec.slice(3)) : await tickerPrice(pxSpec);
    const mcap = (shares * price * Number(fx)) / 1e6;
    if (!Number.isFinite(mcap) || mcap <= 0) return row;
    return { ...row, mcap, liveValue: true };
  } catch { return row; }
}

export async function resolveStack(ticker) {
  const stack = CAPITAL_STACKS[ticker];
  if (!stack) return null;
  const counts = await readCounts();
  const rows = await Promise.all(stack.rows.map(r => resolveRow(r, counts)));
  const asOf = [counts?.strategy && ticker === 'STRC' && `Strategy ${counts.strategy.asOf}`,
    counts?.strive && (ticker === 'SATA' || ticker === 'SATS') && `Strive ${counts.strive.asOf}`,
    counts?.swc?.ordinary && ticker === 'MORE' && `Smarter Web ${counts.swc.ordinary.asOf}`].filter(Boolean);
  return { ...stack, rows, countsAsOf: asOf, anyLive: rows.some(r => r.liveValue) };
}
