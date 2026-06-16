import YahooFinance from 'yahoo-finance2';
import { ASSET_RATES } from './constants.js';

// Possible dividend payment frequencies seen across tickers (monthly, semi-monthly, weekly, daily).
// A ticker's frequency can change over time (e.g. SATA: monthly -> daily), so rather than trust a
// single static "current" frequency for every historical event, pick whichever frequency makes the
// back-calculated annual rate land closest to the currently announced rate.
const POSSIBLE_FREQUENCIES = [12, 24, 52, 250];

function bestPerYear(amount, announcedRate) {
  if (!announcedRate) return 12;
  let best = POSSIBLE_FREQUENCIES[0];
  let bestDiff = Infinity;
  for (const perYear of POSSIBLE_FREQUENCIES) {
    const diff = Math.abs(amount * perYear - announcedRate);
    if (diff < bestDiff) { bestDiff = diff; best = perYear; }
  }
  return best;
}

const yahooFinance = new YahooFinance();

export async function getStockQuote(ticker) {
  const quote = await yahooFinance.quote(ticker);
  return {
    price: quote.regularMarketPrice,
    change: quote.regularMarketChange,
    changePercent: quote.regularMarketChangePercent,
    previousClose: quote.regularMarketPreviousClose,
    dividendYield: (quote.trailingAnnualDividendYield != null && quote.trailingAnnualDividendYield > 0)
      ? quote.trailingAnnualDividendYield * 100
      : null,
    dividendRate: (quote.trailingAnnualDividendRate && quote.trailingAnnualDividendRate > 0)
      ? quote.trailingAnnualDividendRate
      : null,
  };
}

function getStartDate(period) {
  const now = new Date();
  const map = {
    '1mo': 1, '3mo': 3, '6mo': 6, '1y': 12, '2y': 24, '5y': 60,
  };
  const months = map[period] ?? 6;
  now.setMonth(now.getMonth() - months);
  return now;
}

export async function getChartData(ticker, period = '6mo', interval = '1d') {
  const result = await yahooFinance.chart(ticker, {
    period1: getStartDate(period),
    interval,
  });
  const quotes = result.quotes;

  // Yahoo's chart endpoint occasionally returns a null close for the most recent
  // bar before it finalises the day's data, even though the live quote already
  // has the correct price. Backfill with the live price rather than `open` so
  // the chart's last point matches what the rest of the site shows.
  let livePrice = null;
  if (quotes.some(q => q.close == null)) {
    try {
      const quote = await yahooFinance.quote(ticker);
      livePrice = quote.regularMarketPrice ?? null;
    } catch {}
  }

  return quotes.map(q => ({
    time: q.date instanceof Date
      ? q.date.toISOString().split('T')[0]
      : String(q.date).split('T')[0],
    open: q.open,
    high: q.high,
    low: q.low,
    close: q.close ?? livePrice ?? q.open,
    volume: q.volume,
  }));
}

export function getEffectiveYield(annualDividendRate, targetPrice = 100) {
  if (!annualDividendRate) return null;
  return (annualDividendRate / targetPrice) * 100;
}

export async function fetchNextPaymentDate(ticker) {
  try {
    const quote = await yahooFinance.quote(ticker);
    const d = quote.dividendDate;
    if (!d) return null;
    const date = d instanceof Date ? d : new Date(d);
    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

export async function fetchDividendEvents(ticker) {
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  const result = await yahooFinance.chart(ticker, {
    period1: twoYearsAgo,
    interval: '1d',
    events: 'div',
  });

  const dividendEvents = result.events?.dividends;
  if (!dividendEvents || Object.keys(dividendEvents).length === 0) return [];

  return Object.values(dividendEvents)
    .map(d => ({
      date: (d.date instanceof Date ? d.date : new Date(d.date * 1000)).toISOString().split('T')[0],
      amount: parseFloat(d.amount.toFixed(6)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getYieldHistory(ticker) {
  const { YIELD_RATE_HISTORY } = await import('./yieldRateHistory.js');
  const hardcoded = (YIELD_RATE_HISTORY[ticker] || []).slice();

  try {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const result = await yahooFinance.chart(ticker, {
      period1: twoYearsAgo,
      interval: '1d',
      events: 'div',
    });

    const dividendEvents = result.events?.dividends;
    if (!dividendEvents || Object.keys(dividendEvents).length === 0) return hardcoded;

    const latestHardcoded = hardcoded.length > 0 ? hardcoded[hardcoded.length - 1].from : '';

    // Back-calculate annualRate from the per-payment amount — annual $ on $100 par = annual %
    const newEntries = Object.values(dividendEvents)
      .map(d => ({
        from: (d.date instanceof Date ? d.date : new Date(d.date * 1000)).toISOString().split('T')[0],
        annualRate: parseFloat((d.amount * bestPerYear(d.amount, ASSET_RATES[ticker])).toFixed(2)),
      }))
      .filter(d => d.from > latestHardcoded)
      .sort((a, b) => a.from.localeCompare(b.from));

    return [...hardcoded, ...newEntries];
  } catch {
    return hardcoded;
  }
}
