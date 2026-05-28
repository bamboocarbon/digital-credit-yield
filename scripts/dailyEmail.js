// scripts/dailyEmail.js
// Sends a daily tweet preview email with a contextual chart
// Run via: node scripts/dailyEmail.js

import fs from 'fs';
import sharp from 'sharp';
import { Resend } from 'resend';
import { put, list } from '@vercel/blob';
import { generateDailyInsight } from './insightEngine.js';
import { NOTO_400 } from './fontData.js';

function cleanForApp(text) {
  return text
    .replace(/[\u{1F300}-\u{1FBFF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/#\w+/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const FONTS_DIR = '/tmp/dcy-fonts';

function setupFonts() {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
  const ttfPath = `${FONTS_DIR}/Geist-Regular.ttf`;
  if (!fs.existsSync(ttfPath)) {
    fs.writeFileSync(ttfPath, Buffer.from(NOTO_400, 'base64'));
  }
  fs.writeFileSync(`${FONTS_DIR}/fonts.conf`, `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${FONTS_DIR}</dir>
  <cachedir>/tmp/dcy-fonts-cache</cachedir>
</fontconfig>`);
  process.env.FONTCONFIG_PATH = FONTS_DIR;
}

const RECIPIENT = 'robin.gillingham@hotmail.co.uk';
const SITE_URL  = (process.env.SITE_URL || 'https://digitalcredityield.com').replace(/\/$/, '');

const W = 900, H = 800;
const pad = { top: 165, right: 30, bottom: 100, left: 120 };
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

function wrapTitle(text, fontSize) {
  const maxChars = Math.floor((W - 60) / (fontSize * 0.6));
  if (text.length <= maxChars) return [text];
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) { current = next; }
    else { if (current) lines.push(current); current = word; }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function renderTitle(text, fontSize) {
  const lines = wrapTitle(text, fontSize);
  const lineH = Math.round(fontSize * 1.28);
  return lines.map((line, i) =>
    `<text x="${W / 2}" y="${48 + i * lineH}" text-anchor="middle" fill="#e5e7eb" font-size="${fontSize}" font-family="Geist" font-weight="600">${line}</text>`
  ).join('\n  ');
}

function chartFooter(y) {
  return `<text x="${W / 2}" y="${y}" text-anchor="middle" fill="#ffffff" font-size="36" font-family="Geist">digitalcredityield.com</text>`;
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
      return `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="#4b5563" stroke-width="2"/>
              <text x="${pad.left - 8}" y="${(+y + 4).toFixed(1)}" text-anchor="end" fill="#d1d5db" font-size="26" font-family="Geist">$${p.toFixed(2)}</text>`;
    }).join('');

    const xLabels = Array.from({ length: 6 }, (_, i) => {
      const idx  = Math.round(i * (candles.length - 1) / 5);
      const date = new Date(times[idx]).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
      return `<text x="${xS(idx).toFixed(1)}" y="${H - 10}" text-anchor="middle" fill="#d1d5db" font-size="26" font-family="Geist">${date}</text>`;
    }).join('');

    const svg = `<svg width="${W}" height="${H + 100}" xmlns="http://www.w3.org/2000/svg">
<rect width="${W}" height="${H + 100}" fill="#111827" rx="8"/>
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f5a623" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#f5a623" stop-opacity="0.02"/>
  </linearGradient></defs>
  ${yLines}
  <path d="${area}" fill="url(#g)"/>
  <path d="${line}" fill="none" stroke="#f5a623" stroke-width="7"/>
  ${xLabels}
  ${renderTitle(`${ticker} — 6 Month Price`, 36)}
  <text x="${W - pad.right}" y="48" text-anchor="end" fill="#f5a623" font-size="32" font-family="Geist" font-weight="700">$${closes.at(-1).toFixed(2)}</text>
  ${chartFooter(H + 65)}
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
      return `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="#4b5563" stroke-width="2"/>
              <text x="${pad.left - 8}" y="${(+y + 4).toFixed(1)}" text-anchor="end" fill="#d1d5db" font-size="26" font-family="Geist">${fmtMoney(v)}</text>`;
    }).join('');

    // X axis labels
    const step = months <= 12 ? 3 : months <= 60 ? 12 : 24;
    const xLabels = [];
    for (let m = 0; m <= months; m += step) {
      const idx = Math.min(m, len - 1);
      const x   = xS(idx).toFixed(1);
      const lbl = m === 0 ? 'Now' : months <= 12 ? `${m}m` : `${m / 12}yr`;
      xLabels.push(`<text x="${x}" y="${H - 10}" text-anchor="middle" fill="#d1d5db" font-size="26" font-family="Geist">${lbl}</text>`);
    }

    // Draw each series line
    const lines = series.map(s => {
      const d = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${xS(i).toFixed(1)},${yS(v).toFixed(1)}`).join(' ');
      return `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="7"/>`;
    }).join('');

    // Inline labels — sit above each line's right endpoint
    const legend = series.map((s) => {
      const lastVal = s.values[s.values.length - 1];
      const x = xS(len - 1) - 8;
      const y = yS(lastVal) - 14;
      return `<text x="${x}" y="${y}" text-anchor="end" fill="${s.color}" font-size="26" font-family="Geist" font-weight="600">${s.label}</text>`;
    }).join('');

    const svg = `<svg width="${W}" height="${H + 100}" xmlns="http://www.w3.org/2000/svg">
<rect width="${W}" height="${H + 100}" fill="#111827" rx="8"/>
  ${yLines}
  ${lines}
  ${xLabels.join('')}
  ${legend}
  ${renderTitle(title, 36)}
  ${chartFooter(H + 65)}
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
  setupFonts();
  if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');

  console.log('Fetching market data...');
  const { insight, tweetText, header } = await generateDailyInsight();

  const ticker   = insight.path.startsWith('/sata') ? 'SATA' : 'STRC';
  const chartUrl = `${SITE_URL}/${ticker.toLowerCase()}/chart`;

  console.log(`Building chart (type: ${insight.chartData?.type ?? 'none'})...`);
  const chartImg = await buildChart(insight.chartData);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const cleanPrices     = cleanForApp(header);
  const cleanInsight    = cleanForApp(insight.text);

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,Helvetica,sans-serif;color:#fff;">
  <div style="max-width:600px;margin:0 auto;padding:28px 20px;">

    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
      <div style="width:10px;height:10px;background:#f5a623;border-radius:2px;flex-shrink:0;"></div>
      <span style="font-size:15px;color:#6b7280;">Digital Credit Yield &middot; ${today}</span>
    </div>

    <div style="text-align:center;margin-bottom:20px;">
      <span style="display:inline-block;color:#f5a623;border:1px solid #f5a623;border-radius:12px;padding:10px 24px;font-size:18px;font-weight:700;">Tracking STRC and SATA for growth</span>
    </div>

    <div style="background:#111827;border:1px solid #1e2a3a;border-radius:12px;padding:28px 24px;margin-bottom:16px;text-align:center;">
      <div style="font-size:16px;font-weight:700;color:#9ca3af;margin-bottom:18px;">Snapshot</div>
      <div style="font-size:20px;font-weight:700;line-height:1.5;color:#ffffff;margin-bottom:18px;">${cleanPrices}</div>
      <div style="font-size:15px;line-height:1.7;color:#9ca3af;text-align:left;">${cleanInsight}</div>
    </div>

    <div style="text-align:center;margin-top:20px;">
      <a href="https://digitalcredityield.com" style="font-size:13px;color:#ffffff;text-decoration:none;">digitalcredityield.com</a>
    </div>

  </div>
</body>
</html>`;

  const resend = new Resend(process.env.RESEND_API_KEY);

  // Email 1 — text only
  const { error } = await resend.emails.send({
    from: 'Digital Credit Yield <contact@digitalcredityield.com>',
    to: RECIPIENT,
    subject: `Snapshot — ${today}`,
    html,
  });
  if (error) throw new Error(`Resend error (text): ${JSON.stringify(error)}`);
  console.log(`Text email sent to ${RECIPIENT}`);

  // Email 2 — chart only
  if (chartImg) {
    const chartHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:28px 20px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
      <div style="width:10px;height:10px;background:#f5a623;border-radius:2px;flex-shrink:0;"></div>
      <span style="font-size:15px;color:#6b7280;">Digital Credit Yield &middot; ${today}</span>
    </div>
    <div style="text-align:center;margin-bottom:20px;">
      <span style="display:inline-block;color:#f5a623;border:1px solid #f5a623;border-radius:12px;padding:10px 24px;font-size:18px;font-weight:700;">Tracking STRC and SATA for growth</span>
    </div>
    <img src="data:image/png;base64,${chartImg.toString('base64')}" alt="chart" style="width:100%;border-radius:10px;display:block;">
  </div>
</body>
</html>`;

    const { error: chartError } = await resend.emails.send({
      from: 'Digital Credit Yield <contact@digitalcredityield.com>',
      to: RECIPIENT,
      subject: `Chart — ${today}`,
      html: chartHtml,
    });
    if (chartError) console.warn(`Chart email failed: ${JSON.stringify(chartError)}`);
    else console.log(`Chart email sent to ${RECIPIENT}`);
  }

  // Save daily card to Blob for DCY app
  const updatedAt = new Date().toISOString();
  const cardPayload = JSON.stringify({
    box1: 'Snapshot',
    box2: cleanForApp(header),
    box3: cleanForApp(insight.text),
    hasChart: !!chartImg,
    updatedAt,
  });
  await put('dcy-daily-card.json', cardPayload, {
    access: 'private', contentType: 'application/json', allowOverwrite: true,
  });
  if (chartImg) {
    await put('dcy-daily-chart.png', chartImg, {
      access: 'private', contentType: 'image/png', allowOverwrite: true,
    });
  }
  console.log('DCY card saved to Blob');
}

export { run };

// Only auto-run when invoked directly (not when imported as a module)
if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch(err => {
    console.error('Failed:', err.message || err);
    process.exit(1);
  });
}
