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
  BANK:        0.5,
};

// Colors — consistent across all charts
const COLOR = {
  STRC:       '#f5a623',
  SATA:       '#10b981',
  TREASURIES: '#60a5fa',
  BANK:       '#9ca3af',
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
function tsyRate(months) { return months <= 12 ? BENCHMARKS.TREASURY_1Y : BENCHMARKS.TREASURY_5Y; }

// 3-line comparison series: asset vs Treasuries vs Bank
function compSeries(ticker, assetData, tsyData, bankData) {
  return [
    { label: ticker,       color: COLOR[ticker],      values: assetData.map(d => d.portfolio) },
    { label: 'Treasuries', color: COLOR.TREASURIES,   values: tsyData.map(d => d.portfolio)  },
    { label: 'Bank',       color: COLOR.BANK,         values: bankData.map(d => d.portfolio)  },
  ];
}

// 4-line comparison series: STRC vs SATA vs Treasuries vs Bank
function comp4Series(strcData, sataData, tsyData, bankData) {
  return [
    { label: 'STRC',       color: COLOR.STRC,        values: strcData.map(d => d.portfolio) },
    { label: 'SATA',       color: COLOR.SATA,        values: sataData.map(d => d.portfolio) },
    { label: 'Treasuries', color: COLOR.TREASURIES,  values: tsyData.map(d => d.portfolio)  },
    { label: 'Bank',       color: COLOR.BANK,        values: bankData.map(d => d.portfolio)  },
  ];
}

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

  const eYields = {};
  for (const t of TICKERS) eYields[t] = effYield(t, quotes[t].price);

  // ── Per-ticker insights ──────────────────────────────────────────────────
  for (const t of TICKERS) {
    const price = quotes[t].price;
    const ey    = eYields[t];
    const slug  = t.toLowerCase();

    // Dividend upcoming → price chart (no comparison needed; it's a date event)
    const nd = nextDates[t];
    if (nd) {
      const daysUntil = Math.round((new Date(nd) - new Date(today)) / 86400000);
      if (daysUntil >= 0 && daysUntil <= 2) {
        const perShare = (price * (ey / 100)) / 12;
        const dayStr   = daysUntil === 0 ? 'today' : `${daysUntil} day${daysUntil === 1 ? '' : 's'}`;
        priority.push({
          text: `💰 ${t} pays its next dividend in ${dayStr} — ~$${perShare.toFixed(3)}/share at ${ey.toFixed(2)}% effective yield.`,
          path: `/${slug}/dividends`,
          chartData: { type: 'price', ticker: t },
        });
      }
    }

    // Monthly income at various sizes — chart shows 1yr reinvested vs alternatives
    for (const amount of AMOUNTS) {
      const monthly    = (amount * (ey / 100)) / 12;
      const bankMonthly = (amount * (BENCHMARKS.BANK / 100)) / 12;
      const tsyMonthly  = (amount * (BENCHMARKS.TREASURY_1Y / 100)) / 12;
      const assetData  = runProjection(amount, ey, 0, 100, 12);
      const tsyData    = runProjection(amount, BENCHMARKS.TREASURY_1Y, 0, 100, 12);
      const bankData   = runProjection(amount, BENCHMARKS.BANK, 0, 100, 12);
      add(
        `💵 ${amtStr(amount)} in ${t} earns ~$${monthly.toFixed(2)}/mo — vs ~$${tsyMonthly.toFixed(2)}/mo in Treasuries and ~$${bankMonthly.toFixed(2)}/mo in a bank account.`,
        `/${slug}/projector`,
        { type: 'comparison',
          title: `${amtStr(amount)} in ${t} vs alternatives (1yr, reinvested)`, months: 12,
          series: compSeries(t, assetData, tsyData, bankData),
        },
      );
    }

    // 5Y comparisons — 3 lines
    const asset5y = runProjection(10000, ey, 0, 100, 60);
    const tsy5y   = runProjection(10000, BENCHMARKS.TREASURY_5Y, 0, 100, 60);
    const bank5y  = runProjection(10000, BENCHMARKS.BANK, 0, 100, 60);
    const a5f = asset5y.at(-1).portfolio;
    const t5f = tsy5y.at(-1).portfolio;
    const b5f = bank5y.at(-1).portfolio;

    if (a5f > t5f) {
      add(
        `📈 $10k in ${t} reinvested over 5 years: ~$${(a5f / 1000).toFixed(1)}k vs ~$${(t5f / 1000).toFixed(1)}k in Treasuries and ~$${(b5f / 1000).toFixed(1)}k in a bank — $${((a5f - t5f) / 1000).toFixed(1)}k ahead of Treasuries.`,
        `/${slug}/differentiator`,
        { type: 'comparison', title: `$10k: ${t} vs Treasuries vs Bank (5yr)`, months: 60,
          series: compSeries(t, asset5y, tsy5y, bank5y),
        },
      );
    }

    add(
      `🏦 $10k in ${t} vs a bank account over 5 years: ~$${(a5f / 1000).toFixed(1)}k vs ~$${(b5f / 1000).toFixed(1)}k. That's $${((a5f - b5f) / 1000).toFixed(1)}k more — a difference that compounds every month.`,
      `/${slug}/differentiator`,
      { type: 'comparison', title: `$10k: ${t} vs Treasuries vs Bank (5yr)`, months: 60,
        series: compSeries(t, asset5y, tsy5y, bank5y),
      },
    );

    // Portfolio growth for various horizons — 3 lines each
    for (const { label, months } of HORIZONS) {
      const rate = tsyRate(months);
      for (const amount of AMOUNTS) {
        const assetData  = runProjection(amount, ey, 0, 100, months);
        const tsyData    = runProjection(amount, rate, 0, 100, months);
        const bankData   = runProjection(amount, BENCHMARKS.BANK, 0, 100, months);
        const finalValue = assetData.at(-1).portfolio;
        const tsyFinal   = tsyData.at(-1).portfolio;
        const bankFinal  = bankData.at(-1).portfolio;
        const returnPct  = ((finalValue - amount) / amount) * 100;

        add(
          `📊 ${amtStr(amount)} in ${t} reinvested over ${label}: ~$${(finalValue / 1000).toFixed(1)}k vs ~$${(tsyFinal / 1000).toFixed(1)}k in Treasuries and ~$${(bankFinal / 1000).toFixed(1)}k in a bank — ${returnPct.toFixed(0)}% total return.`,
          `/${slug}/projector`,
          { type: 'comparison',
            title: `${amtStr(amount)} in ${t}: reinvested vs alternatives (${label})`, months,
            series: compSeries(t, assetData, tsyData, bankData),
          },
        );

        // Monthly income growth — compare income streams, not portfolio totals
        const incomeVals = assetData.map(d => (d.portfolio * (ey / 100)) / 12);
        const tsyIncome  = tsyData.map(d => (d.portfolio * (rate / 100)) / 12);
        const bankIncome = bankData.map(d => (d.portfolio * (BENCHMARKS.BANK / 100)) / 12);
        add(
          `💸 ${amtStr(amount)} in ${t} pays ~$${incomeVals[0].toFixed(0)}/mo today — reinvest for ${label} and that grows to ~$${incomeVals.at(-1).toFixed(0)}/mo vs ~$${tsyIncome.at(-1).toFixed(0)}/mo from Treasuries.`,
          `/${slug}/projector`,
          { type: 'comparison',
            title: `Monthly income: ${amtStr(amount)} in ${t} vs alternatives (${label})`, months,
            series: [
              { label: `${t} Income`,   color: COLOR[t],          values: incomeVals },
              { label: 'Tsy Income',    color: COLOR.TREASURIES,  values: tsyIncome  },
              { label: 'Bank Income',   color: COLOR.BANK,        values: bankIncome },
            ],
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

  // ── Cross-asset 4-line comparisons: STRC vs SATA vs Treasuries vs Bank ──
  const strc_ey = eYields['STRC'];
  const sata_ey = eYields['SATA'];

  for (const { label, months } of HORIZONS) {
    const rate = tsyRate(months);
    for (const amount of [5_000, 10_000, 25_000, 50_000]) {
      const strcData  = runProjection(amount, strc_ey, 0, 100, months);
      const sataData  = runProjection(amount, sata_ey, 0, 100, months);
      const tsyData   = runProjection(amount, rate, 0, 100, months);
      const bankData  = runProjection(amount, BENCHMARKS.BANK, 0, 100, months);
      const strcFinal = strcData.at(-1).portfolio;
      const sataFinal = sataData.at(-1).portfolio;
      const tsyFinal  = tsyData.at(-1).portfolio;
      const bankFinal = bankData.at(-1).portfolio;
      add(
        `📊 ${amtStr(amount)} reinvested over ${label}: STRC ~$${(strcFinal / 1000).toFixed(1)}k, SATA ~$${(sataFinal / 1000).toFixed(1)}k vs ~$${(tsyFinal / 1000).toFixed(1)}k in Treasuries and ~$${(bankFinal / 1000).toFixed(1)}k in a bank account.`,
        `/strc/differentiator`,
        { type: 'comparison',
          title: `${amtStr(amount)}: STRC vs SATA vs Treasuries vs Bank (${label})`, months,
          series: comp4Series(strcData, sataData, tsyData, bankData),
        },
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
  const pool      = [...priority, ...normal];
  const insight   = pool[dayOfYear % pool.length];

  const MOTIVATIONAL = [
    'Stay invested. Compound income builds real wealth.',
    'Monthly income. Reinvest. Repeat. It works.',
    'Time in the market beats timing the market.',
    'Every dividend reinvested is future income.',
    'Patience and income — a powerful combination.',
    'Your money is working for you right now.',
    'Consistent income compounds into lasting wealth.',
    'Another month, another dividend. Keep going.',
    'Income today becomes wealth tomorrow.',
    'The strategy is simple. Stick to it.',
    'High yield, monthly income, long-term growth.',
    'Stay the course. The income keeps arriving.',
    'Small steps and steady income win the race.',
    'The market moves. Your income strategy doesn\'t.',
    'Reinvest every dividend. Watch it compound.',
  ];

  const header    = buildHeader(quotes);
  const siteBase  = (process.env.SITE_URL || 'https://digitalcredityield.com').replace(/\/$/, '');
  const pageUrl   = `${siteBase}${insight.path}`;
  const motivation = MOTIVATIONAL[dayOfYear % MOTIVATIONAL.length];
  const tweetText  = [header, insight.text, pageUrl, '#STRC #SATA #PassiveIncome #Dividends', motivation].join('\n');

  return { quotes, nextDates, insight, header, tweetText, motivation };
}
