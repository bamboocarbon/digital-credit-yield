// scripts/dailyEmail.js
// Sends a daily tweet preview email with a contextual chart
// Run via: node scripts/dailyEmail.js

import fs from 'fs';
import sharp from 'sharp';
import { Resend } from 'resend';
import { put } from '@vercel/blob';
import { blobUrl } from '../lib/blobUrl.js';
import { generateDailyInsight } from './insightEngine.js';
import { generateMp4 } from './generateMp4.js';
import { NOTO_400 } from './fontData.js';
import { isNyseMarketDay } from '../lib/marketDays.js';
import { alreadySentToday, markSentToday } from '../lib/sendGuard.js';
import { ASSET_RATES } from '../lib/constants.js';

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

// News items added via the news admin in the last `days` — item.id is its creation timestamp
async function loadRecentNews(days = 5) {
  try {
    const res = await fetch(blobUrl('dcy-news.json'), {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!res.ok) return [];
    const items = await res.json();
    const cutoff = Date.now() - days * 86400000;
    return items
      .filter(i => {
        const ts = Number(i.id);
        if (Number.isFinite(ts) && ts > 0) return ts >= cutoff;
        return new Date(i.date).getTime() >= cutoff - 86400000; // legacy items without timestamp ids
      })
      .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
  } catch {
    return [];
  }
}

// Blog metadata (slug/title/date/excerpt/category) — fetched from the live site
// rather than imported directly, since lib/articles.js contains JSX that this
// plain-Node script can't parse.
async function loadBlogs() {
  try {
    const res = await fetch(`${SITE_URL}/api/blogs`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Blogs published in the last `days`; if none qualify, fall back to 3 random posts
// so the email always has something to link to.
function pickBlogsForEmail(blogs, days = 7) {
  const cutoff = Date.now() - days * 86400000;
  const recent = blogs
    .filter(b => new Date(b.date).getTime() >= cutoff)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  if (recent.length > 0) return { items: recent, isRandom: false };
  const shuffled = [...blogs].sort(() => Math.random() - 0.5);
  return { items: shuffled.slice(0, 3), isRandom: true };
}

async function loadSubscribers() {
  try {
    const res = await fetch(blobUrl('dcy-subscribers.json'), {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// DCY website brand colours — match the ticker tag colours on digitalcredityield.com
const TICKER_COLOUR = { STRC: '#4ade80', SATA: '#3b82f6', BMNP: '#fde047' };

// Matches the category tag colours used on /blog (components/BlogIndex.js)
const BLOG_CATEGORY_COLOUR = { STRC: '#4ade80', SATA: '#3b82f6', BMNP: '#fde047', SOL: '#a78bfa', Metaplanet: '#7dd3fc' };

const CARD_BG = '#131a28';

// Wraps inner HTML in a single-cell table with a solid background/border — some mail
// clients (e.g. Spark on macOS) strip background-color/border styling from plain
// <div>s but reliably honour it on table cells, so every "box" in the email body
// is built with this instead of a styled div.
function box(inner, { bg = '#0b1422', border = '#1a2740', borderLeft, padding = '10px 14px', marginBottom = '0' } = {}) {
  const borderStyle = borderLeft ? `border-left:3px solid ${borderLeft};` : `border:1px solid ${border};`;
  const bgcolorAttr = bg.startsWith('#') ? ` bgcolor="${bg}"` : '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:${marginBottom};"><tr><td${bgcolorAttr} style="background-color:${bg};${borderStyle}padding:${padding};border-radius:10px;">${inner}</td></tr></table>`;
}

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

async function run() {
  setupFonts();
  if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');

  if (await alreadySentToday('daily-email')) {
    console.log('daily-email already sent today — skipping');
    return;
  }

  console.log('Fetching market data...');
  const { insight, quotes } = await generateDailyInsight();

  console.log(`Building chart (type: ${insight.chartData?.type ?? 'none'})...`);
  const chartImg = await buildChart(insight.chartData);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  console.log('Building MP4 video...');
  const mp4Buffer = await generateMp4(insight, quotes, today).catch(err => {
    console.warn(`MP4 generation failed: ${err.message}`);
    return null;
  });

  const cleanInsight = cleanForApp(insight.text);

  // ── Snapshot cells ─────────────────────────────────────────────────────────
  function snapCell(t) {
    const colour = TICKER_COLOUR[t] || '#ffffff';
    const q = quotes[t];
    let priceLine, changeLine, yieldLine;
    if (q?.price != null) {
      const up = (q.changePercent ?? 0) >= 0;
      const effYield = ASSET_RATES[t] != null ? (ASSET_RATES[t] / q.price) * 100 : null;
      priceLine  = `<div style="font-size:13px;font-weight:700;color:#e4eaf5;margin-top:3px;">$${q.price.toFixed(2)}</div>`;
      changeLine = `<div style="font-size:11px;margin-top:2px;color:${up ? '#4ade80' : '#ef4444'};">${up ? '▲' : '▼'} ${Math.abs(q.changePercent ?? 0).toFixed(2)}%</div>`;
      yieldLine  = effYield != null ? `<div style="font-size:11px;margin-top:2px;color:#8a9ab5;">${effYield.toFixed(2)}% yield</div>` : '';
    } else {
      const rates = { STRC: '11.5%', SATA: '13.0%', BMNP: '9.5%' };
      priceLine  = `<div style="font-size:11px;font-weight:600;color:#8a9ab5;margin-top:3px;">Listing soon</div>`;
      changeLine = `<div style="font-size:11px;margin-top:2px;color:#8a9ab5;">${rates[t] || ''} fixed</div>`;
      yieldLine  = '';
    }
    return `<td width="33%" valign="top" bgcolor="#0b1422" style="background-color:#0b1422;border:1px solid #1a2740;border-radius:10px;padding:8px 10px;">` +
      `<div style="font-size:15px;font-weight:700;color:${colour};letter-spacing:0.05em;">${t}</div>` +
      priceLine + changeLine + yieldLine + `</td>`;
  }

  // ── Chart subtitle + legend ────────────────────────────────────────────────
  const chartTitle = insight.chartData?.title
    ?? (insight.chartData?.type === 'price' ? `${insight.chartData.ticker} — 6-month price` : '');

  const series = insight.chartData?.series ?? [];
  const legendHtml = series.map(s =>
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;vertical-align:middle;margin:0 6px;"><tr>` +
    `<td width="16" height="3" bgcolor="${s.color}" style="background-color:${s.color};font-size:1px;line-height:3px;">&nbsp;</td>` +
    `<td style="padding-left:5px;font-size:10px;color:#8a9ab5;white-space:nowrap;">${s.label}</td>` +
    `</tr></table>`
  ).join('');

  const chartB64 = chartImg ? chartImg.toString('base64') : null;

  // ── Latest News block (items added via news admin in the last 5 days) ──────
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const newsItems = await loadRecentNews(5);
  const newsHtml = newsItems.length ? box(`
        <div style="font-size:10px;font-weight:600;color:#8a9ab5;letter-spacing:0.08em;margin-bottom:8px;">LATEST NEWS</div>
        ${newsItems.map(n => {
          const colour = TICKER_COLOUR[n.tag] || '#9ca3af';
          const headline = n.url
            ? `<a href="${esc(n.url)}" style="color:#e4eaf5;text-decoration:none;">${esc(n.headline)}</a>`
            : esc(n.headline);
          return `<div style="margin-bottom:6px;font-size:12px;line-height:1.5;">` +
            `<span style="font-weight:700;color:${colour};">${esc(n.tag)}</span>` +
            `<span style="color:#3a4a62;margin:0 5px;">·</span>` +
            `<span style="color:#c8d4e8;">${headline}</span>` +
            (n.description ? `<div style="color:#8a9ab5;font-size:11px;margin-top:2px;line-height:1.4;">${esc(n.description)}</div>` : '') +
            `</div>`;
        }).join('')}
      `, { marginBottom: '12px' }) : '';

  // ── Latest Blogs block (posts from the last 7 days, else 3 random posts) ───
  const allBlogs = await loadBlogs();
  const { items: blogItems, isRandom: blogsAreRandom } = pickBlogsForEmail(allBlogs, 7);
  const blogsHtml = blogItems.length ? box(`
        <div style="font-size:10px;font-weight:600;color:#8a9ab5;letter-spacing:0.08em;margin-bottom:8px;">${blogsAreRandom ? 'FROM THE BLOG' : 'LATEST FROM THE BLOG'}</div>
        ${blogItems.map(b => {
          const cats = Array.isArray(b.category) ? b.category : [b.category];
          const tags = cats.map(c => `<span style="font-weight:700;color:${BLOG_CATEGORY_COLOUR[c] || '#9ca3af'};">${esc(c)}</span>`).join('<span style="color:#3a4a62;margin:0 3px;">/</span>');
          return `<div style="margin-bottom:8px;font-size:12px;line-height:1.5;">` +
            `${tags}<span style="color:#3a4a62;margin:0 5px;">&middot;</span>` +
            `<a href="${SITE_URL}/blog/${esc(b.slug)}" style="color:#e4eaf5;text-decoration:none;font-weight:600;">${esc(b.title)}</a>` +
            `</div>`;
        }).join('')}
      `, { marginBottom: '12px' }) : '';

  // ── Combined card email ────────────────────────────────────────────────────
  const headerHtml = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;"><tr>
        <td width="10" height="10" bgcolor="#f5a623" style="background-color:#f5a623;font-size:1px;line-height:10px;">&nbsp;</td>
        <td style="padding-left:8px;font-size:12px;color:#8a9ab5;">Digital Credit Yield &middot; ${today}</td>
      </tr></table>`;

  const titleHtml = box(
    `<div style="text-align:center;font-size:20px;font-weight:700;color:#f5a623;letter-spacing:0.04em;">Tracking STRC, SATA &amp; BMNP for Growth</div>`,
    { bg: '#181307', border: '#f5a623', padding: '10px 18px', marginBottom: '16px' }
  );

  const snapRow = `<table role="presentation" width="100%" cellpadding="0" cellspacing="8" border="0" bgcolor="${CARD_BG}" style="width:100%;background-color:${CARD_BG};margin-bottom:14px;"><tr>${snapCell('STRC')}${snapCell('SATA')}${snapCell('BMNP')}</tr></table>`;

  const chartHtml = chartB64 ? box(
    `<img src="data:image/png;base64,${chartB64}" alt="chart" style="width:100%;display:block;">`,
    { bg: '#08101e', border: '#111d2e', padding: '4px 4px 0', marginBottom: '12px' }
  ) : '';

  const insightHtml = box(
    `<div style="font-size:12px;color:#c8d4e8;line-height:1.55;">${cleanInsight}</div>`,
    { bg: '#0b1422', borderLeft: '#f5a623', padding: '10px 14px', marginBottom: legendHtml ? '10px' : '12px' }
  );

  const cardHtml = box(`
      ${headerHtml}

      ${titleHtml}

      ${snapRow}

      ${chartTitle ? `<div style="text-align:center;font-size:11px;font-weight:600;color:#e4eaf5;padding:4px 4px 8px;">${chartTitle}</div>` : ''}
      ${chartHtml}

      ${insightHtml}

      ${legendHtml ? `<div style="text-align:center;margin-bottom:12px;">${legendHtml}</div>` : ''}

      ${newsHtml}

      ${blogsHtml}

      <div style="text-align:center;font-size:12px;font-weight:600;color:#8a9ab5;letter-spacing:0.05em;margin-bottom:4px;">digitalcredityield.com</div>
      <div style="text-align:center;font-size:10px;color:#3a4a62;line-height:1.5;">Not financial advice. For informational purposes only. Always do your own research before making any investment decisions.</div>
    `, { bg: CARD_BG, border: '#1e2a3a', padding: '20px 22px 16px', marginBottom: '0' });

  function wrapEmail(inner) {
    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body bgcolor="#0a0f1e" style="margin:0;padding:0;background-color:#0a0f1e;font-family:Arial,Helvetica,sans-serif;color:#fff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0f1e" style="width:100%;background-color:#0a0f1e;"><tr><td align="center" style="padding:20px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:520px;"><tr><td>
    ${inner}
  </td></tr></table>
  </td></tr></table>
</body>
</html>`;
  }

  const subscribers = await loadSubscribers();
  const marketDay = isNyseMarketDay();

  const html = wrapEmail(`${cardHtml}

    <div style="margin-top:10px;text-align:center;font-size:11px;color:#8a9ab5;">
      Newsletter subscribers: ${subscribers.length} · snapshot ${subscribers.length === 0 ? 'not sent (no subscribers)' : marketDay ? 'sent' : 'not sent (market closed)'}
    </div>`);

  const subscriberHtml = wrapEmail(`${cardHtml}

    <div style="margin-top:14px;text-align:center;font-size:10px;color:#3a4a62;line-height:1.6;">
      You're receiving this because you subscribed at <a href="${SITE_URL}" style="color:#8a9ab5;text-decoration:none;">digitalcredityield.com</a>.<br>
      <a href="${SITE_URL}/unsubscribe" style="color:#8a9ab5;">Unsubscribe</a>
    </div>`);

  const resend = new Resend(process.env.RESEND_API_KEY);
  const attachments = mp4Buffer
    ? [{ filename: 'dcy-daily.mp4', content: mp4Buffer.toString('base64') }]
    : [];
  const { error } = await resend.emails.send({
    from: 'Digital Credit Yield <contact@digitalcredityield.com>',
    to: RECIPIENT,
    subject: `Daily — ${today}`,
    html,
    attachments,
  });
  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
  await markSentToday('daily-email');
  console.log(`Email sent to ${RECIPIENT}`);

  // ── Send clean snapshot (no X block, no attachment) to newsletter subscribers ──
  // Market days only — matches the "every market day" promise on the signup box
  if (subscribers.length > 0 && marketDay) {
    // Resend caps recipients per request — send in batches of 49 BCC
    for (let i = 0; i < subscribers.length; i += 49) {
      const batch = subscribers.slice(i, i + 49).map(s => s.email);
      const { error: subError } = await resend.emails.send({
        from: 'Digital Credit Yield <contact@digitalcredityield.com>',
        to: 'contact@digitalcredityield.com',
        bcc: batch,
        subject: `Daily Snapshot — ${today}`,
        html: subscriberHtml,
      });
      if (subError) console.warn(`Subscriber batch failed: ${JSON.stringify(subError)}`);
    }
    console.log(`Snapshot sent to ${subscribers.length} subscriber(s)`);
  } else if (subscribers.length > 0) {
    console.log(`Market closed — skipped snapshot for ${subscribers.length} subscriber(s)`);
  }

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
  if (mp4Buffer) {
    await put('dcy-daily.mp4', mp4Buffer, {
      access: 'private', contentType: 'video/mp4', allowOverwrite: true,
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
