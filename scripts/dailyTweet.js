// scripts/dailyTweet.js
// Run via: node scripts/dailyTweet.js
// Cron (Hostinger, 17:00 UTC daily): 0 17 * * * /usr/bin/node /path/to/scripts/dailyTweet.js

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';
import { getStockQuote, fetchNextPaymentDate } from '../lib/fetchStockData.js';
import { runProjection } from '../lib/projectorEngine.js';
import { ASSET_RATES } from '../lib/constants.js';

const __dir = dirname(fileURLToPath(import.meta.url));

// Load .env.local (does not override existing env vars)
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

const TICKERS = ['STRC', 'SATA'];

const BENCHMARKS = {
  TREASURY_1Y: 4.2,
  TREASURY_5Y: 4.5,
  HIGH_YIELD: 4.5,
  BANK: 0.5,
};

const HORIZONS = [
  { label: '1 year',   months: 12  },
  { label: '3 years',  months: 36  },
  { label: '5 years',  months: 60  },
  { label: '10 years', months: 120 },
];

const AMOUNTS = [1_000, 5_000, 10_000, 25_000, 50_000, 100_000];

function effYield(ticker, price) {
  return ASSET_RATES[ticker] * (100 / price);
}

function dirArrow(pct) {
  return pct >= 0 ? '▲' : '▼';
}

function amtStr(amount) {
  return `$${amount.toLocaleString('en-US')}`;
}

function buildHeader(quotes) {
  return '📊 ' + TICKERS.map(t => {
    const { price, changePercent } = quotes[t];
    return `${t} $${price.toFixed(2)} ${dirArrow(changePercent)} ${Math.abs(changePercent).toFixed(2)}%`;
  }).join(' | ');
}

function buildInsightPool(quotes, nextDates) {
  const today = new Date().toISOString().split('T')[0];
  const priority = [];
  const normal = [];

  // Shorthand: push a normal insight with its relevant page path
  const add = (text, path) => normal.push({ text, path });

  for (const t of TICKERS) {
    const price = quotes[t].price;
    const ey = effYield(t, price);
    const slug = t.toLowerCase();

    // Priority: upcoming dividend within 7 days → dividends page
    const nd = nextDates[t];
    if (nd) {
      const daysUntil = Math.round((new Date(nd) - new Date(today)) / 86400000);
      if (daysUntil >= 0 && daysUntil <= 7) {
        const perShare = (price * (ey / 100)) / 12;
        const dayStr = daysUntil === 0 ? 'today' : `${daysUntil} day${daysUntil === 1 ? '' : 's'}`;
        priority.push({
          text: `💰 ${t} pays its next dividend in ${dayStr} — ~$${perShare.toFixed(3)}/share at ${ey.toFixed(2)}% effective yield.`,
          path: `/${slug}/dividends`,
        });
      }
    }

    // Monthly income at various investment sizes → projector page
    for (const amount of AMOUNTS) {
      const monthly = (amount * (ey / 100)) / 12;
      add(
        `💵 ${amtStr(amount)} in ${t} at today's price earns ~$${monthly.toFixed(2)}/mo in dividends — $${(monthly * 12).toFixed(0)}/yr.`,
        `/${slug}/projector`
      );
    }

    // Beats US Treasuries 1Y (income, no reinvestment) → differentiator page
    const income1y = 10000 * (ey / 100);
    const treasury1y = 10000 * (BENCHMARKS.TREASURY_1Y / 100);
    if (income1y > treasury1y) {
      add(
        `📈 $10k in ${t} earns ~$${income1y.toFixed(0)}/yr in dividends vs ~$${treasury1y.toFixed(0)} from US Treasuries — $${(income1y - treasury1y).toFixed(0)} more per year.`,
        `/${slug}/differentiator`
      );
    }

    // Beats US Treasuries 5Y (reinvested) → differentiator page
    const asset5y = runProjection(10000, ey, 0, 100, 60).at(-1).portfolio;
    const tsy5y   = runProjection(10000, BENCHMARKS.TREASURY_5Y, 0, 100, 60).at(-1).portfolio;
    if (asset5y > tsy5y) {
      add(
        `📈 $10k in ${t} reinvested over 5 years: ~$${(asset5y / 1000).toFixed(1)}k vs ~$${(tsy5y / 1000).toFixed(1)}k in US Treasuries — $${((asset5y - tsy5y) / 1000).toFixed(1)}k more.`,
        `/${slug}/differentiator`
      );
    }

    // Beats high-yield savings 5Y (reinvested) → differentiator page
    const hys5y = runProjection(10000, BENCHMARKS.HIGH_YIELD, 0, 100, 60).at(-1).portfolio;
    if (asset5y > hys5y) {
      add(
        `💰 $10k in ${t} reinvested over 5 years: ~$${(asset5y / 1000).toFixed(1)}k vs ~$${(hys5y / 1000).toFixed(1)}k in a high-yield savings account. $${((asset5y - hys5y) / 1000).toFixed(1)}k more.`,
        `/${slug}/differentiator`
      );
    }

    // Beats bank savings 5Y (reinvested) → differentiator page
    const bank5y = runProjection(10000, BENCHMARKS.BANK, 0, 100, 60).at(-1).portfolio;
    add(
      `🏦 $10k in ${t} vs a typical bank savings account over 5 years: ~$${(asset5y / 1000).toFixed(1)}k vs ~$${(bank5y / 1000).toFixed(1)}k. The difference: $${((asset5y - bank5y) / 1000).toFixed(1)}k.`,
      `/${slug}/differentiator`
    );

    // Total portfolio return % across investment sizes and time horizons → projector page
    for (const { label, months } of HORIZONS) {
      for (const amount of AMOUNTS) {
        const finalValue = runProjection(amount, ey, 0, 100, months).at(-1).portfolio;
        const returnPct  = ((finalValue - amount) / amount) * 100;
        const finalStr   = `$${(finalValue / 1000).toFixed(1)}k`;
        add(
          `📊 ${amtStr(amount)} in ${t} with dividends reinvested over ${label} grows to ~${finalStr} — a ${returnPct.toFixed(0)}% total return.`,
          `/${slug}/projector`
        );
      }
    }

    // Monthly income growth through reinvestment → projector page
    for (const { label, months } of HORIZONS) {
      for (const amount of AMOUNTS) {
        const initialMonthly = (amount * (ey / 100)) / 12;
        const finalPortfolio = runProjection(amount, ey, 0, 100, months).at(-1).portfolio;
        const finalMonthly   = (finalPortfolio * (ey / 100)) / 12;
        add(
          `💸 ${amtStr(amount)} in ${t} pays ~$${initialMonthly.toFixed(0)}/mo today. Reinvest for ${label} and that grows to ~$${finalMonthly.toFixed(0)}/mo.`,
          `/${slug}/projector`
        );
      }
    }

    // Price below par — effective yield above stated rate → chart page
    if (price < 100) {
      add(
        `🔍 ${t} is trading at $${price.toFixed(2)} — below its $100 par value. Today's effective yield: ${ey.toFixed(2)}%, above the stated ${ASSET_RATES[t]}%.`,
        `/${slug}/chart`
      );
    }
  }

  return { priority, normal };
}

async function run() {
  const missing = [
    'TWITTER_API_KEY', 'TWITTER_API_SECRET',
    'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_TOKEN_SECRET',
  ].filter(k => !process.env[k]);
  if (missing.length > 0) throw new Error(`Missing env vars: ${missing.join(', ')}`);

  console.log('Fetching market data...');
  const [strc, sata, strc_nd, sata_nd] = await Promise.all([
    getStockQuote('STRC'),
    getStockQuote('SATA'),
    fetchNextPaymentDate('STRC'),
    fetchNextPaymentDate('SATA'),
  ]);

  const quotes    = { STRC: strc, SATA: sata };
  const nextDates = { STRC: strc_nd, SATA: sata_nd };

  const { priority, normal } = buildInsightPool(quotes, nextDates);

  // Priority insights first; otherwise rotate through normal pool by day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const insight = priority.length > 0
    ? priority[dayOfYear % priority.length]
    : normal[dayOfYear % normal.length];

  const tweet = [
    buildHeader(quotes),
    '',
    insight.text,
    '',
    '#STRC #SATA #PassiveIncome #Dividends',
  ].join('\n');

  console.log('\n--- Tweet preview ---');
  console.log(tweet);
  console.log(`\nString length: ${tweet.length} chars (Twitter counts URLs as 23)`);

  const client = new TwitterApi({
    appKey:       process.env.TWITTER_API_KEY,
    appSecret:    process.env.TWITTER_API_SECRET,
    accessToken:  process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  const logoPath = join(__dir, '..', 'public', 'logo-tweet.png');
  let mediaId;
  if (existsSync(logoPath)) {
    mediaId = await client.v1.uploadMedia(logoPath, { mimeType: 'image/png' });
    console.log(`\nUploaded logo, media ID: ${mediaId}`);
  }

  const tweetParams = mediaId ? { media: { media_ids: [mediaId] } } : {};
  const { data } = await client.v2.tweet(tweet, tweetParams);
  console.log(`\nPosted! Tweet ID: ${data.id}`);
}

run().catch(err => {
  console.error('\nFailed to post tweet:', err.message || err);
  process.exit(1);
});
