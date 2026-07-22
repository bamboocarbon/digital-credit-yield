// scripts/generateAnimatedGif.js
// Animated GIF replicating the full strc-animation.html card layout
// Sections: topbar · title-box · 3× snapshot cells · chart-wrap (subtitle + animated chart) · insight · legend · domain · disclaimer

import { createCanvas } from '@napi-rs/canvas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const GIFEncoder = require('gif-encoder-2');

// ── Canvas dimensions ─────────────────────────────────────────────────────────
const W  = 460;
const H  = 488;
const PX = 22;   // horizontal inner padding (mirrors card's 24px side padding)

// ── Y layout — derived from the original HTML CSS measurements ────────────────
// Card padding-top = 20px
const TB_Y  = 30;   // topbar text baseline   (20px top pad + ~10px text descent)
const TL_Y0 = 44;   // title-box top          (TB_Y + ~14)
const TL_Y1 = 88;   // title-box bottom       (44px: 10px pad + 24px font + 10px pad)
const SN_Y0 = 102;  // snapshot top           (TL_Y1 + 14px margin)
const SN_Y1 = 166;  // snapshot bottom        (64px: 9px pad + 16+3+13+3+11 + 9px)
const CW_Y0 = 180;  // chart-wrap top         (SN_Y1 + 14px margin)
const CS_Y  = 205;  // chart-subtitle baseline (CW_Y0 + 4 top-pad + 10 text-pad + 11 font)
const CI_Y0 = 211;  // chart canvas top       (CW_Y0 + 4 + 27subtitle)
const CI_H  = 140;  // chart canvas height    (compressed from 200 for file-size)
const CI_Y1 = 351;  // chart canvas bottom
const XL_Y  = 363;  // x-labels baseline      (CI_Y1 + 4pad + 10font - 2)
const CW_Y1 = 373;  // chart-wrap bottom      (XL_Y + 8bottom-pad + ~2)
const IN_Y0 = 385;  // insight box top        (CW_Y1 + 12px margin)
const IN_H  = 52;   // insight box height     (10px pad + ~2 lines 11.5px×1.55 + 10px)
const LG_Y  = 449;  // legend text baseline   (IN_Y0 + IN_H + 12px margin)
const DM_Y  = 462;  // domain text baseline   (LG_Y + 13)
const DC_Y  = 475;  // disclaimer baseline    (DM_Y + 13)
// Bottom: DC_Y + 9 + 13 bottom-pad ≈ 488 = H ✓

// ── Chart margins within CI area ─────────────────────────────────────────────
const ML = 52;  // left margin (room for y-axis dollar labels)
const MR = 14;  // right margin
const CW_DRAW = W - ML - MR;  // 394px chart draw width

// ── Brand colours ─────────────────────────────────────────────────────────────
const TICKER_COLOUR = { STRC: '#4ade80', SATA: '#3b82f6', BMNP: '#fde047' };

// ── Helpers ───────────────────────────────────────────────────────────────────
function xPx(t)         { return ML + t * CW_DRAW; }
function yPx(v, lo, hi) { return CI_Y0 + CI_H * (1 - (v - lo) / (hi - lo)); }
function lerp(a, b, t)  { return a + (b - a) * t; }
function easeInOut(t)   { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

function getAt(values, t) {
  const idx = t * (values.length - 1);
  const lo  = Math.floor(idx);
  const hi  = Math.min(lo + 1, values.length - 1);
  return lerp(values[lo], values[hi], idx - lo);
}

function fmtVal(v) {
  if (v >= 10000) return `$${(v / 1000).toFixed(0)}k`;
  if (v >= 1000)  return `$${(v / 1000).toFixed(1)}k`;
  return `$${Math.round(v)}`;
}

function buildXLabels(months) {
  if (months <= 12) {
    return [0, 3, 6, 9, months].map(m => ({ t: m / months, label: m === 0 ? 'Now' : `${m}m` }));
  }
  const yrs  = months / 12;
  const step = yrs <= 5 ? 1 : yrs <= 20 ? 5 : 10;
  const pts  = [];
  for (let y = 0; y <= yrs; y += step) pts.push({ t: y / yrs, label: y === 0 ? 'Now' : `${y}yr` });
  return pts;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);          ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, maxWidth, maxLines) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word;
      if (lines.length >= maxLines) break;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

function stripEmoji(text) {
  return text
    .replace(/[\u{1F300}-\u{1FBFF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Rocket ────────────────────────────────────────────────────────────────────
function drawRocket(ctx, x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(0.44, 0.44);

  const body = ctx.createLinearGradient(-7, -20, 7, 14);
  body.addColorStop(0, '#eceff1'); body.addColorStop(0.5, '#b0bec5'); body.addColorStop(1, '#78909c');
  ctx.beginPath();
  ctx.moveTo(0, -22); ctx.bezierCurveTo(8, -15, 8, 0, 6, 13);
  ctx.lineTo(-6, 13); ctx.bezierCurveTo(-8, 0, -8, -15, 0, -22);
  ctx.fillStyle = body; ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 0.6; ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -22); ctx.bezierCurveTo(5, -18, 5, -12, 4, -8);
  ctx.lineTo(-4, -8); ctx.bezierCurveTo(-5, -12, -5, -18, 0, -22);
  ctx.fillStyle = '#f5a623'; ctx.fill();

  ctx.beginPath(); ctx.arc(0, -5, 4.5, 0, Math.PI * 2);
  const win = ctx.createRadialGradient(-1, -6, 1, 0, -5, 4.5);
  win.addColorStop(0, '#81d4fa'); win.addColorStop(1, '#01579b');
  ctx.fillStyle = win; ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 0.7; ctx.stroke();

  ctx.beginPath(); ctx.moveTo(-6, 8); ctx.lineTo(-15, 17); ctx.lineTo(-6, 13);
  ctx.fillStyle = '#ef5350'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(6, 8); ctx.lineTo(15, 17); ctx.lineTo(6, 13);
  ctx.fillStyle = '#ef5350'; ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-5, 13); ctx.bezierCurveTo(-9, 23, -4, 30, 0, 34);
  ctx.bezierCurveTo(4, 30, 9, 23, 5, 13); ctx.closePath();
  const fl = ctx.createLinearGradient(0, 13, 0, 34);
  fl.addColorStop(0, 'rgba(255,180,0,0.95)');
  fl.addColorStop(0.5, 'rgba(255,80,20,0.8)');
  fl.addColorStop(1, 'rgba(255,50,0,0)');
  ctx.fillStyle = fl; ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-3, 13); ctx.bezierCurveTo(-4, 21, -1, 26, 0, 29);
  ctx.bezierCurveTo(1, 26, 4, 21, 3, 13); ctx.closePath();
  const fl2 = ctx.createLinearGradient(0, 13, 0, 29);
  fl2.addColorStop(0, 'rgba(255,255,210,1)'); fl2.addColorStop(1, 'rgba(255,210,50,0)');
  ctx.fillStyle = fl2; ctx.fill();

  ctx.restore();
}

// ── Frame renderer ────────────────────────────────────────────────────────────
function renderFrame(ctx, frame, series, yMin, yMax, title, date, months, quotes, insightText) {
  // Staged reveal — mirrors the original animation timings
  // 80ms per frame → frame 0 = 0ms, frame 4 = 320ms, frame 7 = 560ms ...
  const showTopbar   = frame >= 0;
  const showTitle    = frame >= 4;
  const showSnapshot = frame >= 7;
  const showChart    = frame >= 10;
  const DRAW_START   = 12;
  const DRAW_FRAMES  = 52;
  const END_START    = DRAW_START + DRAW_FRAMES;  // frame 64
  const showEndLabels = frame >= END_START;
  const showText     = frame >= END_START + 2;    // frame 66: insight, legend, domain, disc

  const STEPS = 120;
  let drawProgress = 0;
  if (frame >= DRAW_START && frame < END_START) {
    drawProgress = easeInOut((frame - DRAW_START) / DRAW_FRAMES);
  } else if (frame >= END_START) {
    drawProgress = 1;
  }
  const pts = Math.floor(drawProgress * STEPS);

  // ── Background ──────────────────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#151b27'); bg.addColorStop(1, '#0e1520');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Topbar ──────────────────────────────────────────────────────────────────
  if (showTopbar) {
    ctx.fillStyle = '#f5a623';
    roundRect(ctx, PX, TB_Y - 9, 11, 11, 2); ctx.fill();

    ctx.fillStyle = '#8a9ab5';
    ctx.font = '11px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Digital Credit Yield  ·  ${date}`, PX + 16, TB_Y);
  }

  // ── Title box ───────────────────────────────────────────────────────────────
  if (showTitle) {
    ctx.strokeStyle = '#f5a623'; ctx.lineWidth = 1.5;
    ctx.fillStyle = 'rgba(245,166,35,0.035)';
    roundRect(ctx, PX, TL_Y0, W - 2*PX, TL_Y1 - TL_Y0, 12);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#f5a623';
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.04em';
    ctx.fillText('Tracking STRC, SATA & BMNP for Growth', W / 2, (TL_Y0 + TL_Y1) / 2 + 5);
    ctx.letterSpacing = '0';
  }

  // ── Snapshot strip ──────────────────────────────────────────────────────────
  if (showSnapshot) {
    const gapBetween = 10;
    const cellW = (W - 2*PX - 2*gapBetween) / 3; // ~132px

    ['STRC', 'SATA', 'BMNP'].forEach((t, i) => {
      const cx = PX + i * (cellW + gapBetween);
      ctx.fillStyle = '#0b1422';
      roundRect(ctx, cx, SN_Y0, cellW, SN_Y1 - SN_Y0, 10);
      ctx.fill();
      ctx.strokeStyle = '#1a2740'; ctx.lineWidth = 1; ctx.stroke();

      const col = TICKER_COLOUR[t];
      const q   = quotes[t];
      const innerX = cx + 10;
      const lineGap = 16;

      // Ticker label
      ctx.fillStyle = col;
      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(t, innerX, SN_Y0 + 20);

      if (q?.price != null) {
        const up = (q.changePercent ?? 0) >= 0;
        ctx.fillStyle = '#e4eaf5';
        ctx.font = 'bold 12px Arial, sans-serif';
        ctx.fillText(`$${q.price.toFixed(2)}`, innerX, SN_Y0 + 20 + lineGap);
        ctx.fillStyle = up ? '#4ade80' : '#e05555';
        ctx.font = '11px Arial, sans-serif';
        ctx.fillText(`${up ? '▲' : '▼'} ${Math.abs(q.changePercent ?? 0).toFixed(2)}%`, innerX, SN_Y0 + 20 + lineGap * 2);
      } else {
        const RATES = { STRC: '12.0%', SATA: '13.0%', BMNP: '9.5%' };
        ctx.fillStyle = '#8a9ab5';
        ctx.font = '11px Arial, sans-serif';
        ctx.fillText('Listing soon', innerX, SN_Y0 + 20 + lineGap);
        ctx.fillText(`${RATES[t] || ''} fixed`, innerX, SN_Y0 + 20 + lineGap * 2);
      }
    });
  }

  // ── Chart wrap ──────────────────────────────────────────────────────────────
  if (showChart) {
    ctx.fillStyle = '#08101e';
    roundRect(ctx, PX - 4, CW_Y0, W - 2*(PX - 4), CW_Y1 - CW_Y0, 14);
    ctx.fill();
    ctx.strokeStyle = '#111d2e'; ctx.lineWidth = 1; ctx.stroke();

    // Chart subtitle
    ctx.fillStyle = '#e4eaf5';
    ctx.font = 'bold 11px Arial, sans-serif';
    ctx.textAlign = 'center';
    let sub = title;
    const maxSubW = W - 2*PX - 16;
    if (ctx.measureText(sub).width > maxSubW) {
      while (ctx.measureText(sub + '…').width > maxSubW && sub.length > 6) sub = sub.slice(0, -1);
      sub += '…';
    }
    ctx.fillText(sub, W / 2, CS_Y);

    // Grid lines + Y-axis labels
    const GRID_STEPS = 5;
    ctx.font = '9px Arial, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= GRID_STEPS; i++) {
      const v = yMin + (yMax - yMin) * (i / GRID_STEPS);
      const y = yPx(v, yMin, yMax);
      ctx.strokeStyle = '#1a2740'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ML, y); ctx.lineTo(W - MR, y); ctx.stroke();
      if (i > 0) {
        ctx.fillStyle = '#8a9ab5';
        ctx.fillText(fmtVal(v), ML - 6, y + 3);
      }
    }

    // Vertical grid lines at 25% intervals
    [0, 0.25, 0.5, 0.75, 1].forEach(t => {
      ctx.strokeStyle = '#111e2f'; ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(xPx(t), CI_Y0); ctx.lineTo(xPx(t), CI_Y1); ctx.stroke();
    });

    // X-axis labels
    const xLbls = buildXLabels(months);
    ctx.fillStyle = '#8a9ab5';
    ctx.font = '9px Arial, sans-serif';
    ctx.textAlign = 'center';
    xLbls.forEach(({ t, label }) => ctx.fillText(label, xPx(t), XL_Y));
  }

  // ── Area fill under featured series ─────────────────────────────────────────
  if (pts > 1) {
    ctx.beginPath();
    ctx.moveTo(xPx(0), yPx(getAt(series[0].values, 0), yMin, yMax));
    for (let i = 1; i <= pts; i++) {
      ctx.lineTo(xPx(i / STEPS), yPx(getAt(series[0].values, i / STEPS), yMin, yMax));
    }
    ctx.lineTo(xPx(pts / STEPS), CI_Y1);
    ctx.lineTo(xPx(0), CI_Y1);
    ctx.closePath();
    const fill = ctx.createLinearGradient(0, CI_Y0, 0, CI_Y1);
    fill.addColorStop(0, series[0].color + '35');
    fill.addColorStop(1, series[0].color + '00');
    ctx.fillStyle = fill; ctx.fill();
  }

  // ── Series lines — non-featured drawn first so featured sits on top ───────
  if (pts >= 1) {
    [...series].reverse().forEach((s, ri) => {
      const isFeatured = ri === series.length - 1;
      ctx.beginPath();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = isFeatured ? 2.4 : 1.8;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (isFeatured) { ctx.shadowColor = s.color + 'aa'; ctx.shadowBlur = 5; }
      ctx.moveTo(xPx(0), yPx(getAt(s.values, 0), yMin, yMax));
      for (let i = 1; i <= pts; i++) {
        ctx.lineTo(xPx(i / STEPS), yPx(getAt(s.values, i / STEPS), yMin, yMax));
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  // ── Rocket at featured line tip ──────────────────────────────────────────
  if (pts > 4) {
    const tipT  = pts / STEPS;
    const prevT = Math.max(0, (pts - 6) / STEPS);
    const tipX  = xPx(tipT);
    const tipY  = yPx(getAt(series[0].values, tipT), yMin, yMax);
    const angle = Math.atan2(
      tipY - yPx(getAt(series[0].values, prevT), yMin, yMax),
      tipX - xPx(prevT),
    ) + Math.PI / 2;

    // Glow halo
    const glow = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 20);
    glow.addColorStop(0, series[0].color + '44');
    glow.addColorStop(1, series[0].color + '00');
    ctx.beginPath(); ctx.arc(tipX, tipY, 20, 0, Math.PI * 2);
    ctx.fillStyle = glow; ctx.fill();

    drawRocket(ctx, tipX, tipY, angle);

    // Live value label beside rocket
    ctx.font = 'bold 10px Arial, sans-serif';
    ctx.fillStyle = series[0].color;
    ctx.textAlign = 'left';
    ctx.shadowColor = series[0].color; ctx.shadowBlur = 6;
    ctx.fillText(fmtVal(getAt(series[0].values, tipT)), tipX + 16, tipY - 8);
    ctx.shadowBlur = 0;
  }

  // ── End-state labels (appear once drawing completes) ────────────────────
  if (showEndLabels) {
    series.forEach(s => {
      const endX = xPx(1);
      const endY = yPx(s.values.at(-1), yMin, yMax);
      ctx.beginPath(); ctx.arc(endX, endY, 4, 0, Math.PI * 2);
      ctx.fillStyle = s.color; ctx.fill();
      ctx.font = 'bold 9px Arial, sans-serif';
      ctx.fillStyle = s.color;
      ctx.textAlign = 'right';
      ctx.fillText(`${s.label}  ${fmtVal(s.values.at(-1))}`, endX - 6, endY - 6);
    });
  }

  // ── Insight box ─────────────────────────────────────────────────────────
  if (showText) {
    // Box background
    ctx.fillStyle = '#0b1422';
    roundRect(ctx, PX, IN_Y0, W - 2*PX, IN_H, 10);
    ctx.fill();
    // Gold left border
    ctx.fillStyle = '#f5a623';
    roundRect(ctx, PX, IN_Y0, 3, IN_H, 1);
    ctx.fill();

    // Insight text — 2 lines max
    const insightMaxW = W - 2*PX - 3 - 14 - 10;
    ctx.fillStyle = '#c8d4e8';
    ctx.font = '11px Arial, sans-serif';
    ctx.textAlign = 'left';
    const lines = wrapText(ctx, insightText, insightMaxW, 3);
    lines.forEach((line, idx) => {
      ctx.fillText(line, PX + 16, IN_Y0 + 13 + idx * 14);
    });
  }

  // ── Legend ──────────────────────────────────────────────────────────────
  if (showText) {
    // Centre the legend items
    ctx.font = '10px Arial, sans-serif';
    const itemWidths = series.map(s => 18 + 5 + ctx.measureText(s.label).width);
    const totalW = itemWidths.reduce((a, b) => a + b, 0) + (series.length - 1) * 14;
    let lx = (W - totalW) / 2;
    series.forEach((s, i) => {
      // Swatch
      ctx.fillStyle = s.color;
      roundRect(ctx, lx, LG_Y - 4, 16, 3, 1);
      ctx.fill();
      // Label
      ctx.fillStyle = '#8a9ab5';
      ctx.textAlign = 'left';
      ctx.fillText(s.label, lx + 21, LG_Y);
      lx += itemWidths[i] + 14;
    });
  }

  // ── Domain ──────────────────────────────────────────────────────────────
  if (showText) {
    ctx.fillStyle = '#8a9ab5';
    ctx.font = 'bold 11px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('digitalcredityield.com', W / 2, DM_Y);
  }

  // ── Disclaimer ──────────────────────────────────────────────────────────
  if (showText) {
    ctx.fillStyle = '#3a4a62';
    ctx.font = '9px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Not financial advice. For information purposes only. Always do your own research.', W / 2, DC_Y);
  }
}

// ── Public entry point ────────────────────────────────────────────────────────
export async function generateAnimatedGif(insight, quotes, date) {
  const chartData = insight?.chartData;
  if (!chartData || chartData.type !== 'comparison' || !chartData.series?.length) return null;

  const { series, title, months } = chartData;
  const allVals = series.flatMap(s => s.values);
  const rawMin  = Math.min(...allVals);
  const rawMax  = Math.max(...allVals);
  const range   = Math.max(rawMax - rawMin, 10);
  // Zoom in: start just below the lowest value so lines spread visibly apart
  const yPad = range * 0.22;
  const yMin = Math.max(0, Math.floor((rawMin - yPad) / 5) * 5);
  const yMax = Math.ceil((rawMax + yPad * 0.4) / 5) * 5;

  const insightText = stripEmoji(insight.text);

  const ANIM_FRAMES = 66;  // staged reveal + chart draw + text appears  (~5.3s @ 80ms)
  const HOLD_FRAMES = 42;  // full card visible hold                      (~5.0s @ 120ms)
  const TOTAL       = ANIM_FRAMES + HOLD_FRAMES;

  const canvas  = createCanvas(W, H);
  const ctx     = canvas.getContext('2d');
  const encoder = new GIFEncoder(W, H, 'neuquant', true);
  encoder.setRepeat(0);
  encoder.setQuality(15);
  encoder.start();

  for (let f = 0; f < TOTAL; f++) {
    encoder.setDelay(f < ANIM_FRAMES ? 80 : 120);
    renderFrame(ctx, f, series, yMin, yMax, title, date, months, quotes, insightText);
    encoder.addFrame(ctx);
  }

  encoder.finish();
  return encoder.out.getData();
}
