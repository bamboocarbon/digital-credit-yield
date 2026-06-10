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

// DCY website brand colours — match the ticker tag colours on digitalcredityield.com
const TICKER_COLOUR = { STRC: '#4ade80', SATA: '#3b82f6', BMNP: '#fde047' };

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

    const c = TICKER_COLOUR[ticker] || '#f5a623';
    const svg = `<svg width="${W}" height="${H + 100}" xmlns="http://www.w3.org/2000/svg">
<rect width="${W}" height="${H + 100}" fill="#111827" rx="8"/>
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${c}" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="${c}" stop-opacity="0.02"/>
  </linearGradient></defs>
  ${yLines}
  <path d="${area}" fill="url(#g)"/>
  <path d="${line}" fill="none" stroke="${c}" stroke-width="7"/>
  ${xLabels}
  ${renderTitle(`${ticker} — 6 Month Price`, 36)}
  <text x="${W - pad.right}" y="48" text-anchor="end" fill="${c}" font-size="32" font-family="Geist" font-weight="700">$${closes.at(-1).toFixed(2)}</text>
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
  const { insight, quotes } = await generateDailyInsight();

  console.log(`Building chart (type: ${insight.chartData?.type ?? 'none'})...`);
  const chartImg = await buildChart(insight.chartData);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const cleanInsight = cleanForApp(insight.text);

  // ── Snapshot cells ─────────────────────────────────────────────────────────
  function snapCell(t) {
    const colour = TICKER_COLOUR[t] || '#ffffff';
    const q = quotes[t];
    let priceLine, changeLine;
    if (q?.price != null) {
      const up = (q.changePercent ?? 0) >= 0;
      priceLine  = `<div style="font-size:13px;font-weight:700;color:#e4eaf5;margin-top:3px;">$${q.price.toFixed(2)}</div>`;
      changeLine = `<div style="font-size:11px;margin-top:2px;color:${up ? '#4ade80' : '#ef4444'};">${up ? '▲' : '▼'} ${Math.abs(q.changePercent ?? 0).toFixed(2)}%</div>`;
    } else {
      const rates = { STRC: '11.5%', SATA: '13.0%', BMNP: '9.5%' };
      priceLine  = `<div style="font-size:11px;font-weight:600;color:#8a9ab5;margin-top:3px;">Listing soon</div>`;
      changeLine = `<div style="font-size:11px;margin-top:2px;color:#8a9ab5;">${rates[t] || ''} fixed</div>`;
    }
    return `<div style="flex:1;background:#0b1422;border-radius:10px;padding:8px 10px;border:1px solid #1a2740;">` +
      `<div style="font-size:15px;font-weight:700;color:${colour};letter-spacing:0.05em;">${t}</div>` +
      priceLine + changeLine + `</div>`;
  }

  // ── Chart subtitle + legend ────────────────────────────────────────────────
  const chartTitle = insight.chartData?.title
    ?? (insight.chartData?.type === 'price' ? `${insight.chartData.ticker} — 6-month price` : '');

  const series = insight.chartData?.series ?? [];
  const legendHtml = series.map(s =>
    `<span style="display:inline-flex;align-items:center;gap:5px;font-size:10px;color:#8a9ab5;">` +
    `<span style="display:inline-block;width:16px;height:3px;border-radius:2px;background:${s.color};"></span>${s.label}` +
    `</span>`
  ).join('<span style="color:#1e2a3a;margin:0 6px;">·</span>');

  const chartB64 = chartImg ? chartImg.toString('base64') : null;

  // ── Combined card email ────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,Helvetica,sans-serif;color:#fff;">
  <div style="max-width:520px;margin:0 auto;padding:20px 16px;">
    <div style="background:linear-gradient(160deg,#151b27 0%,#0e1520 100%);border-radius:18px;padding:20px 22px 16px;border:1px solid #1e2a3a;box-shadow:0 20px 60px rgba(0,0,0,0.8);">

      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <div style="width:10px;height:10px;background:#f5a623;border-radius:2px;flex-shrink:0;"></div>
        <span style="font-size:12px;color:#8a9ab5;">Digital Credit Yield &middot; ${today}</span>
      </div>

      <div style="border:1.5px solid #f5a623;border-radius:12px;padding:10px 18px;text-align:center;margin-bottom:16px;background:rgba(245,166,35,0.03);">
        <span style="font-size:20px;font-weight:700;color:#f5a623;letter-spacing:0.04em;">Tracking STRC, SATA &amp; BMNP for Growth</span>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:14px;">
        ${snapCell('STRC')}
        ${snapCell('SATA')}
        ${snapCell('BMNP')}
      </div>

      ${chartTitle ? `<div style="text-align:center;font-size:11px;font-weight:600;color:#e4eaf5;padding:4px 4px 8px;">${chartTitle}</div>` : ''}
      ${chartB64 ? `<div style="background:#08101e;border-radius:14px;padding:4px 4px 0;margin-bottom:12px;border:1px solid #111d2e;"><img src="data:image/png;base64,${chartB64}" alt="chart" style="width:100%;border-radius:10px;display:block;"></div>` : ''}

      <div style="background:#0b1422;border-radius:10px;border-left:3px solid #f5a623;padding:10px 14px;margin-bottom:${legendHtml ? '10px' : '12px'};font-size:12px;color:#c8d4e8;line-height:1.55;">${cleanInsight}</div>

      ${legendHtml ? `<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:12px;">${legendHtml}</div>` : ''}

      <div style="text-align:center;font-size:12px;font-weight:600;color:#8a9ab5;letter-spacing:0.05em;margin-bottom:4px;">digitalcredityield.com</div>
      <div style="text-align:center;font-size:10px;color:#3a4a62;line-height:1.5;">Not financial advice. For informational purposes only. Always do your own research before making any investment decisions.</div>

    </div>
  </div>
</body>
</html>`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'Digital Credit Yield <contact@digitalcredityield.com>',
    to: RECIPIENT,
    subject: `Daily — ${today}`,
    html,
  });
  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
  console.log(`Email sent to ${RECIPIENT}`);

  // Save daily card to Blob for DCY app
  const displayTickers = ['STRC', 'SATA', ...(quotes['BMNP']?.price != null ? ['BMNP'] : [])];
  const cardBox2 = displayTickers.map(t => {
    const q = quotes[t];
    const arrow = (q.changePercent ?? 0) >= 0 ? '▲' : '▼';
    return `${t} $${q.price.toFixed(2)} ${arrow} ${Math.abs(q.changePercent ?? 0).toFixed(2)}%`;
  }).join(' | ');
  await put('dcy-daily-card.json', JSON.stringify({
    box1: 'Snapshot', box2: cardBox2, box3: cleanForApp(insight.text),
    hasChart: !!chartImg, updatedAt: new Date().toISOString(),
  }), { access: 'private', contentType: 'application/json', allowOverwrite: true });
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
