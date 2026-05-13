import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getStockQuote, fetchNextPaymentDate } from '../lib/fetchStockData.js';
import { runProjection } from '../lib/projectorEngine.js';
import { ASSET_RATES } from '../lib/constants.js';

const __dir = dirname(fileURLToPath(import.meta.url));

try {
  const env = readFileSync(join(__dir, '..', '.env.local'), 'utf8');
  for (const line of env.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    process.env[t.slice(0, i).trim()] ??= t.slice(i + 1).trim();
  }
} catch { /* .env.local is optional on the server */ }

export const TICKERS = ['STRC', 'SATA'];

const BENCHMARKS = {
  TREASURY_1Y: 4.2,
  TREASURY_5Y: 4.5,
  HIGH_YIELD:  4.5,
  BANK:        0.5,
};

const HORIZONS = [
  { label: '1 year',   months: 12  },
  { label: '3 years',  months: 36  },
  { label: '5 years',  months: 60  },
  { label: '10 years', months: 120 },
];

const AMOUNTS = [1_000, 5_000, 10_000, 25_000, 50_000, 100_000];

export function effYield(ticker, price) {
  return ASSET_RATES[ticker] * (100 / price);
}

function dirArrow(pct) { return pct >= 0 ? '▲' : '▼'; }
function amtStr(amount) { return `$${amount.toLocaleString('en-US')}`; }

export function buildHeader(quotes) {
  return '📊 ' + TICKERS.map(t => {
    const { price, changePercent } = quotes[t];
    return `${t} $${price.toFixed(2)} ${dirArrow(changePercent)} ${Math.abs(changePercent).toFixed(2)}%`;
  }).join(' | ');
}

function buildInsightPool(quotes, nextDates) {
  const today = new Date().toISOString().split('T')[0];
  const priority = [];
  const normal   = [];
  const add = (text, path, chartData) => normal.push({ text, path, chartData });

  for (const t of TICKERS) {
    const price = quotes[t].price;
    const ey    = effYield(t, price);
    const slug  = t.toLowerCase();

    // Dividend upcoming → price chart
    const nd = nextDates[t];
    if (nd) {
      const daysUntil = Math.round((new Date(nd) - new Date(today)) / 86400000);
      if (daysUntil >= 0 && daysUntil <= 7) {
        const perShare = (price * (ey / 100)) / 12;
        const dayStr   = daysUntil === 0 ? 'today' : `${daysUntil} day${daysUntil === 1 ? '' : 's'}`;
        priority.push({
          text: `💰 ${t} pays its next dividend in ${dayStr} — ~$${perShare.toFixed(3)}/share at ${ey.toFixed(2)}% effective yield.`,
          path: `/${slug}/dividends`,
          chartData: { type: 'price', ticker: t },
        });
      }
    }

    // Monthly income at various sizes → price chart
    for (const amount of AMOUNTS) {
      const monthly = (amount * (ey / 100)) / 12;
      add(
        `💵 ${amtStr(amount)} in ${t} at today's price earns ~$${monthly.toFixed(2)}/mo in dividends — $${(monthly * 12).toFixed(0)}/yr.`,
        `/${slug}/projector`,
        { type: 'price', ticker: t },
      );
    }

    // Beats US Treasuries 1Y (income) → 1-year comparison chart
    const income1y    = 10000 * (ey / 100);
    const treasury1y  = 10000 * (BENCHMARKS.TREASURY_1Y / 100);
    const asset1yData = runProjection(10000, ey, 0, 100, 12);
    const tsy1yData   = runProjection(10000, BENCHMARKS.TREASURY_1Y, 0, 100, 12);
    if (income1y > treasury1y) {
      add(
        `📈 $10k in ${t} earns ~$${income1y.toFixed(0)}/yr in dividends vs ~$${treasury1y.toFixed(0)} from US Treasuries — $${(income1y - treasury1y).toFixed(0)} more per year.`,
        `/${slug}/differentiator`,
        { type: 'comparison', title: `$10k: ${t} vs US Treasuries (1yr)`, months: 12,
          series: [
            { label: t,              color: '#f5a623', values: asset1yData.map(d => d.portfolio) },
            { label: 'US Treasuries', color: '#6b7280', values: tsy1yData.map(d => d.portfolio) },
          ],
        },
      );
    }

    // Reuse 5Y projection data for all three 5Y comparisons
    const asset5yData = runProjection(10000, ey, 0, 100, 60);
    const asset5yFinal = asset5yData.at(-1).portfolio;

    const tsy5yData   = runProjection(10000, BENCHMARKS.TREASURY_5Y, 0, 100, 60);
    const tsy5yFinal  = tsy5yData.at(-1).portfolio;
    if (asset5yFinal > tsy5yFinal) {
      add(
        `📈 $10k in ${t} reinvested over 5 years: ~$${(asset5yFinal / 1000).toFixed(1)}k vs ~$${(tsy5yFinal / 1000).toFixed(1)}k in US Treasuries — $${((asset5yFinal - tsy5yFinal) / 1000).toFixed(1)}k more.`,
        `/${slug}/differentiator`,
        { type: 'comparison', title: `$10k: ${t} vs US Treasuries (5yr)`, months: 60,
          series: [
            { label: t,              color: '#f5a623', values: asset5yData.map(d => d.portfolio) },
            { label: 'US Treasuries', color: '#6b7280', values: tsy5yData.map(d => d.portfolio) },
          ],
        },
      );
    }

    const hys5yData   = runProjection(10000, BENCHMARKS.HIGH_YIELD, 0, 100, 60);
    const hys5yFinal  = hys5yData.at(-1).portfolio;
    if (asset5yFinal > hys5yFinal) {
      add(
        `💰 $10k in ${t} reinvested over 5 years: ~$${(asset5yFinal / 1000).toFixed(1)}k vs ~$${(hys5yFinal / 1000).toFixed(1)}k in a high-yield savings account. $${((asset5yFinal - hys5yFinal) / 1000).toFixed(1)}k more.`,
        `/${slug}/differentiator`,
        { type: 'comparison', title: `$10k: ${t} vs High-Yield Savings (5yr)`, months: 60,
          series: [
            { label: t,                  color: '#f5a623', values: asset5yData.map(d => d.portfolio) },
            { label: 'High-Yield Savings', color: '#6b7280', values: hys5yData.map(d => d.portfolio) },
          ],
        },
      );
    }

    const bank5yData  = runProjection(10000, BENCHMARKS.BANK, 0, 100, 60);
    const bank5yFinal = bank5yData.at(-1).portfolio;
    add(
      `🏦 $10k in ${t} vs a typical bank savings account over 5 years: ~$${(asset5yFinal / 1000).toFixed(1)}k vs ~$${(bank5yFinal / 1000).toFixed(1)}k. The difference: $${((asset5yFinal - bank5yFinal) / 1000).toFixed(1)}k.`,
      `/${slug}/differentiator`,
      { type: 'comparison', title: `$10k: ${t} vs Bank Savings (5yr)`, months: 60,
        series: [
          { label: t,             color: '#f5a623', values: asset5yData.map(d => d.portfolio) },
          { label: 'Bank Savings', color: '#6b7280', values: bank5yData.map(d => d.portfolio) },
        ],
      },
    );

    // Portfolio growth + income growth — share one runProjection call per combination
    for (const { label, months } of HORIZONS) {
      for (const amount of AMOUNTS) {
        const projData     = runProjection(amount, ey, 0, 100, months);
        const finalValue   = projData.at(-1).portfolio;
        const returnPct    = ((finalValue - amount) / amount) * 100;
        const finalStr     = `$${(finalValue / 1000).toFixed(1)}k`;
        const portfolioVals = projData.map(d => d.portfolio);

        add(
          `📊 ${amtStr(amount)} in ${t} with dividends reinvested over ${label} grows to ~${finalStr} — a ${returnPct.toFixed(0)}% total return.`,
          `/${slug}/projector`,
          { type: 'projection', title: `${amtStr(amount)} in ${t} reinvested (${label})`, months,
            series: [{ label: t, color: '#f5a623', values: portfolioVals }],
          },
        );

        const incomeVals    = projData.map(d => (d.portfolio * (ey / 100)) / 12);
        const initialMonthly = incomeVals[0];
        const finalMonthly   = incomeVals.at(-1);
        add(
          `💸 ${amtStr(amount)} in ${t} pays ~$${initialMonthly.toFixed(0)}/mo today. Reinvest for ${label} and that grows to ~$${finalMonthly.toFixed(0)}/mo.`,
          `/${slug}/projector`,
          { type: 'income-growth', title: `Monthly income: ${amtStr(amount)} in ${t} (${label})`, months,
            series: [{ label: 'Monthly Income', color: '#f5a623', values: incomeVals }],
          },
        );
      }
    }

    // Price below par → price chart
    if (price < 100) {
      add(
        `🔍 ${t} is trading at $${price.toFixed(2)} — below its $100 par value. Today's effective yield: ${ey.toFixed(2)}%, above the stated ${ASSET_RATES[t]}%.`,
        `/${slug}/chart`,
        { type: 'price', ticker: t },
      );
    }
  }

  return { priority, normal };
}

export async function generateDailyInsight() {
  const [strc, sata, strc_nd, sata_nd] = await Promise.all([
    getStockQuote('STRC'),
    getStockQuote('SATA'),
    fetchNextPaymentDate('STRC'),
    fetchNextPaymentDate('SATA'),
  ]);

  const quotes    = { STRC: strc, SATA: sata };
  const nextDates = { STRC: strc_nd, SATA: sata_nd };

  const { priority, normal } = buildInsightPool(quotes, nextDates);
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const insight   = priority.length > 0
    ? priority[dayOfYear % priority.length]
    : normal[dayOfYear % normal.length];

  const header   = buildHeader(quotes);
  const siteBase = (process.env.SITE_URL || 'https://digitalcredityield.com').replace(/\/$/, '');
  const pageUrl  = `${siteBase}${insight.path}`;
  const tweetText = [header, insight.text, pageUrl, '#STRC #SATA #PassiveIncome #Dividends'].join('\n');

  return { quotes, nextDates, insight, header, tweetText };
}
