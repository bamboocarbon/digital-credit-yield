// scripts/dailyEmail.js
// Sends a daily tweet preview email with a contextual chart
// Run via: node scripts/dailyEmail.js

import sharp from 'sharp';
import { Resend } from 'resend';
import { generateDailyInsight } from './insightEngine.js';

const RECIPIENT = 'robin.gillingham@hotmail.co.uk';
const SITE_URL  = (process.env.SITE_URL || 'https://digitalcredityield.com').replace(/\/$/, '');

const W = 1160, H = 360;
const pad = { top: 40, right: 100, bottom: 44, left: 80 };
const cW  = W - pad.left - pad.right;
const cH  = H - pad.top  - pad.bottom;

function xScale(i, len)    { return pad.left + (i / (len - 1)) * cW; }
function yScale(v, mn, mx) { return pad.top  + cH - ((v - mn) / (mx - mn)) * cH; }

function fmtMoney(v) {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

function svgToPng(svg) {
  return sharp(Buffer.from(svg)).png().toBuffer();
}

function chartFooter(y) {
  return `<text x="${W / 2}" y="${y}" text-anchor="middle" fill="#555" font-size="12" font-family="Arial">digitalcredityield.com</text>`;
}

// Price chart — fetches 6-month OHLC from the live API
async function buildPriceChart(ticker) {
  try {
    const res  = await fetch(`${SITE_URL}/api/chart/${ticker}?period=6mo`);
    const data = await res.json();
    if (!data || data.error || !Array.isArray(data) || data.length < 2) return null;

    const candles = data.filter(d => d.close);
    const closes  = candles.map(d => d.close);
    const times   = candles.map(d => d.time);
    const minP    = Math.min(...closes) * 0.999;
    const maxP    = Math.max(...closes) * 1.001;

    const xS = i => xScale(i, candles.length);
    const yS = v => yScale(v, minP, maxP);

    const line = closes.map((c, i) => `${i === 0 ? 'M' : 'L'}${xS(i).toFixed(1)},${yS(c).toFixed(1)}`).join(' ');
    const area = `${line} L${xS(closes.length - 1).toFixed(1)},${(pad.top + cH).toFixed(1)} L${pad.left},${(pad.top + cH).toFixed(1)} Z`;

    const yLines = Array.from({ length: 5 }, (_, i) => {
      const p = minP + ((maxP - minP) * i / 4);
      const y = yS(p).toFixed(1);
      return `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="#1f2937" stroke-width="1"/>
              <text x="${pad.left - 8}" y="${(+y + 4).toFixed(1)}" text-anchor="end" fill="#6b7280" font-size="11" font-family="Arial">$${p.toFixed(2)}</text>`;
    }).join('');

    const xLabels = Array.from({ length: 6 }, (_, i) => {
      const idx  = Math.round(i * (candles.length - 1) / 5);
      const date = new Date(times[idx]).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
      return `<text x="${xS(idx).toFixed(1)}" y="${H - 10}" text-anchor="middle" fill="#6b7280" font-size="11" font-family="Arial">${date}</text>`;
    }).join('');

    const svg = `<svg width="${W}" height="${H + 28}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H + 28}" fill="#111827" rx="8"/>
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f5a623" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#f5a623" stop-opacity="0.02"/>
  </linearGradient></defs>
  ${yLines}
  <path d="${area}" fill="url(#g)"/>
  <path d="${line}" fill="none" stroke="#f5a623" stroke-width="2.5"/>
  ${xLabels}
  <text x="${pad.left}" y="24" fill="#9ca3af" font-size="12" font-family="Arial" font-weight="600">${ticker} — 6 Month Price</text>
  <text x="${W - pad.right}" y="24" text-anchor="end" fill="#f5a623" font-size="14" font-family="Arial" font-weight="700">$${closes.at(-1).toFixed(2)}</text>
  ${chartFooter(H + 20)}
</svg>`;

    return svgToPng(svg);
  } catch (err) {
    console.warn(`Price chart failed (${ticker}): ${err.message}`);
    return null;
  }
}

// Series chart — comparison, projection, or income-growth
function buildSeriesChart({ title, series, months }) {
  try {
    const allValues = series.flatMap(s => s.values);
    const minV = Math.min(...allValues) * 0.98;
    const maxV = Math.max(...allValues) * 1.02;
    const len  = series[0].values.length;

    const yS = v => yScale(v, minV, maxV);
    const xS = i => xScale(i, len);

    const yLines = Array.from({ length: 5 }, (_, i) => {
      const v = minV + ((maxV - minV) * i / 4);
      const y = yS(v).toFixed(1);
      return `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="#1f2937" stroke-width="1"/>
              <text x="${pad.left - 8}" y="${(+y + 4).toFixed(1)}" text-anchor="end" fill="#6b7280" font-size="11" font-family="Arial">${fmtMoney(v)}</text>`;
    }).join('');

    // X axis labels — show year markers
    const yearStep = months <= 12 ? 1 : months <= 60 ? 12 : 24;
    const xLabels = [];
    for (let m = 0; m <= months; m += yearStep) {
      const idx = Math.min(m, len - 1);
      const x   = xS(idx).toFixed(1);
      const lbl = m === 0 ? 'Now' : `${m / 12}yr`;
      xLabels.push(`<text x="${x}" y="${H - 10}" text-anchor="middle" fill="#6b7280" font-size="11" font-family="Arial">${lbl}</text>`);
    }

    // Draw each series line
    const lines = series.map(s => {
      const d = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${xS(i).toFixed(1)},${yS(v).toFixed(1)}`).join(' ');
      return `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.5"/>`;
    }).join('');

    // Legend (top right)
    const legend = series.map((s, i) => {
      const x = W - pad.right + 8;
      const y = pad.top + 16 + i * 22;
      return `<rect x="${x}" y="${y - 8}" width="12" height="12" rx="2" fill="${s.color}"/>
              <text x="${x + 16}" y="${y + 2}" fill="#9ca3af" font-size="11" font-family="Arial">${s.label}</text>`;
    }).join('');

    const svg = `<svg width="${W}" height="${H + 28}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H + 28}" fill="#111827" rx="8"/>
  ${yLines}
  ${lines}
  ${xLabels.join('')}
  ${legend}
  <text x="${pad.left}" y="24" fill="#9ca3af" font-size="12" font-family="Arial" font-weight="600">${title}</text>
  ${chartFooter(H + 20)}
</svg>`;

    return svgToPng(svg);
  } catch (err) {
    console.warn(`Series chart failed: ${err.message}`);
    return null;
  }
}

async function buildChart(chartData) {
  if (!chartData) return null;
  if (chartData.type === 'price') return buildPriceChart(chartData.ticker);
  return buildSeriesChart(chartData);
}

function tweetToHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

async function run() {
  if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');

  console.log('Fetching market data...');
  const { insight, tweetText } = await generateDailyInsight();

  const ticker   = insight.path.startsWith('/sata') ? 'SATA' : 'STRC';
  const chartUrl = `${SITE_URL}/${ticker.toLowerCase()}/chart`;

  console.log(`Building chart (type: ${insight.chartData?.type ?? 'none'})...`);
  const chartImg = await buildChart(insight.chartData);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const chartSection = chartImg
    ? `<img src="data:image/png;base64,${chartImg.toString('base64')}" alt="chart" style="width:100%;border-radius:8px;display:block;">`
    : `<div style="font-size:13px;color:#888;">Chart unavailable — <a href="${chartUrl}" style="color:#f5a623;">view on site</a></div>`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,sans-serif;color:#fff;">
  <div style="max-width:640px;margin:0 auto;padding:24px 16px 16px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
      <div style="width:10px;height:10px;background:#f5a623;border-radius:2px;flex-shrink:0;"></div>
      <span style="font-size:18px;font-weight:700;letter-spacing:-0.5px;">Digital Credit Yield</span>
      <span style="font-size:13px;color:#888;margin-left:auto;">${today}</span>
    </div>
    <div style="background:#111827;border:1px solid #1e2a3a;border-radius:12px;padding:20px;margin-bottom:16px;">
      <div style="font-size:15px;line-height:1.6;">${tweetToHtml(tweetText)}</div>
    </div>
    <div style="border-radius:12px;overflow:hidden;">${chartSection}</div>
  </div>
</body>
</html>`;

  const attachments = chartImg
    ? [{ filename: `${ticker}-chart.png`, content: chartImg.toString('base64') }]
    : [];

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'Digital Credit Yield <contact@digitalcredityield.com>',
    to: RECIPIENT,
    subject: `📊 Daily Tweet Preview — ${today}`,
    html,
    attachments,
  });

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
  console.log(`Email sent to ${RECIPIENT}`);
}

export { run };

// Only auto-run when invoked directly (not when imported as a module)
if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch(err => {
    console.error('Failed:', err.message || err);
    process.exit(1);
  });
}
