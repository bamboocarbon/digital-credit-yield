// scripts/generateAnimatedGif.js
// Generates an animated GIF of the daily comparison chart for attaching to X posts
// Packages: @napi-rs/canvas (no native deps), gif-encoder-2

import { createCanvas } from '@napi-rs/canvas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const GIFEncoder = require('gif-encoder-2');

const W = 460, H = 285;
const ML = 48, MR = 16, MT = 54, MB = 38;
const CW = W - ML - MR;
const CH = H - MT - MB;

function xPx(t)          { return ML + t * CW; }
function yPx(v, lo, hi)  { return MT + CH * (1 - (v - lo) / (hi - lo)); }
function lerp(a, b, t)   { return a + (b - a) * t; }
function easeInOut(t)    { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

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
  const years = months / 12;
  const step  = years <= 5 ? 1 : years <= 20 ? 5 : 10;
  const pts   = [];
  for (let y = 0; y <= years; y += step) {
    pts.push({ t: y / years, label: y === 0 ? 'Now' : `${y}yr` });
  }
  return pts;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawRocket(ctx, x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(0.42, 0.42);

  const body = ctx.createLinearGradient(-7, -20, 7, 14);
  body.addColorStop(0, '#eceff1');
  body.addColorStop(0.5, '#b0bec5');
  body.addColorStop(1, '#78909c');
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.bezierCurveTo(8, -15, 8, 0, 6, 13);
  ctx.lineTo(-6, 13);
  ctx.bezierCurveTo(-8, 0, -8, -15, 0, -22);
  ctx.fillStyle = body;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -22); ctx.bezierCurveTo(5, -18, 5, -12, 4, -8);
  ctx.lineTo(-4, -8); ctx.bezierCurveTo(-5, -12, -5, -18, 0, -22);
  ctx.fillStyle = '#f5a623';
  ctx.fill();

  ctx.beginPath(); ctx.arc(0, -5, 4.5, 0, Math.PI * 2);
  const win = ctx.createRadialGradient(-1, -6, 1, 0, -5, 4.5);
  win.addColorStop(0, '#81d4fa'); win.addColorStop(1, '#01579b');
  ctx.fillStyle = win; ctx.fill();

  ctx.beginPath(); ctx.moveTo(-6, 8); ctx.lineTo(-15, 17); ctx.lineTo(-6, 13);
  ctx.fillStyle = '#ef5350'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(6, 8); ctx.lineTo(15, 17); ctx.lineTo(6, 13);
  ctx.fillStyle = '#ef5350'; ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-5, 13); ctx.bezierCurveTo(-9, 23, -4, 30, 0, 34);
  ctx.bezierCurveTo(4, 30, 9, 23, 5, 13); ctx.closePath();
  const flame = ctx.createLinearGradient(0, 13, 0, 34);
  flame.addColorStop(0, 'rgba(255,180,0,0.95)');
  flame.addColorStop(0.5, 'rgba(255,80,20,0.8)');
  flame.addColorStop(1, 'rgba(255,50,0,0)');
  ctx.fillStyle = flame; ctx.fill();

  ctx.restore();
}

function renderFrame(ctx, drawProgress, endAlpha, series, yMin, yMax, title, date, months) {
  const STEPS = 120;
  const pts   = Math.floor(easeInOut(drawProgress) * STEPS);

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#151b27');
  bg.addColorStop(1, '#0e1520');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Gold square + header
  ctx.fillStyle = '#f5a623';
  roundRect(ctx, 14, 10, 8, 8, 2);
  ctx.fill();
  ctx.fillStyle = '#8a9ab5';
  ctx.font = '10px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Digital Credit Yield  ·  ${date}`, 27, 18);

  // Title — truncate to fit
  ctx.font = 'bold 11px Arial, sans-serif';
  ctx.fillStyle = '#e4eaf5';
  ctx.textAlign = 'center';
  let displayTitle = title;
  const maxTitleW = W - 28;
  if (ctx.measureText(displayTitle).width > maxTitleW) {
    while (ctx.measureText(displayTitle + '…').width > maxTitleW && displayTitle.length > 8) {
      displayTitle = displayTitle.slice(0, -1);
    }
    displayTitle += '…';
  }
  ctx.fillText(displayTitle, W / 2, 36);

  // Chart background
  ctx.fillStyle = '#08101e';
  roundRect(ctx, ML - 6, MT - 5, CW + 22, CH + 10, 5);
  ctx.fill();

  // Grid lines + Y labels
  for (let i = 0; i <= 4; i++) {
    const v = yMin + (yMax - yMin) * (i / 4);
    const y = yPx(v, yMin, yMax);
    ctx.strokeStyle = '#1a2740';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(ML, y); ctx.lineTo(W - MR, y); ctx.stroke();
    if (i > 0) {
      ctx.fillStyle = '#8a9ab5';
      ctx.font = '8px Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(fmtVal(v), ML - 4, y + 3);
    }
  }

  // X-axis labels
  const xLbls = buildXLabels(months);
  ctx.fillStyle = '#8a9ab5';
  ctx.font = '8px Arial, sans-serif';
  ctx.textAlign = 'center';
  xLbls.forEach(({ t, label }) => ctx.fillText(label, xPx(t), MT + CH + 13));

  // Area fill under featured (first) series
  if (pts > 1) {
    ctx.beginPath();
    ctx.moveTo(xPx(0), yPx(getAt(series[0].values, 0), yMin, yMax));
    for (let i = 1; i <= pts; i++) {
      ctx.lineTo(xPx(i / STEPS), yPx(getAt(series[0].values, i / STEPS), yMin, yMax));
    }
    ctx.lineTo(xPx(pts / STEPS), yPx(yMin, yMin, yMax));
    ctx.lineTo(xPx(0), yPx(yMin, yMin, yMax));
    ctx.closePath();
    const fill = ctx.createLinearGradient(0, MT, 0, MT + CH);
    fill.addColorStop(0, series[0].color + '44');
    fill.addColorStop(1, series[0].color + '00');
    ctx.fillStyle = fill;
    ctx.fill();
  }

  // Draw series lines — non-featured first so featured renders on top
  [...series].reverse().forEach((s, ri) => {
    if (pts < 1) return;
    const isFeatured = ri === series.length - 1;
    ctx.beginPath();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = isFeatured ? 2.2 : 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(xPx(0), yPx(getAt(s.values, 0), yMin, yMax));
    for (let i = 1; i <= pts; i++) {
      ctx.lineTo(xPx(i / STEPS), yPx(getAt(s.values, i / STEPS), yMin, yMax));
    }
    ctx.stroke();
  });

  // Rocket on featured series tip
  if (pts > 4) {
    const tipT  = pts / STEPS;
    const prevT = Math.max(0, (pts - 6) / STEPS);
    const tipX  = xPx(tipT);
    const tipY  = yPx(getAt(series[0].values, tipT), yMin, yMax);
    const angle = Math.atan2(
      tipY - yPx(getAt(series[0].values, prevT), yMin, yMax),
      tipX - xPx(prevT),
    ) + Math.PI / 2;

    const glow = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 18);
    glow.addColorStop(0, series[0].color + '55');
    glow.addColorStop(1, series[0].color + '00');
    ctx.beginPath(); ctx.arc(tipX, tipY, 18, 0, Math.PI * 2);
    ctx.fillStyle = glow; ctx.fill();

    drawRocket(ctx, tipX, tipY, angle);

    ctx.font = 'bold 9px Arial, sans-serif';
    ctx.fillStyle = series[0].color;
    ctx.textAlign = 'left';
    ctx.fillText(fmtVal(getAt(series[0].values, tipT)), tipX + 14, tipY - 6);
  }

  // End-state labels fade in
  if (endAlpha > 0) {
    ctx.globalAlpha = endAlpha;
    series.forEach(s => {
      const ey = yPx(s.values.at(-1), yMin, yMax);
      ctx.beginPath(); ctx.arc(xPx(1), ey, 3, 0, Math.PI * 2);
      ctx.fillStyle = s.color; ctx.fill();
      ctx.font = 'bold 9px Arial, sans-serif';
      ctx.fillStyle = s.color;
      ctx.textAlign = 'right';
      ctx.fillText(`${s.label}  ${fmtVal(s.values.at(-1))}`, xPx(1) - 5, ey - 5);
    });
    ctx.globalAlpha = 1;
  }

  // Legend row
  let lx = ML;
  ctx.font = '8.5px Arial, sans-serif';
  ctx.textAlign = 'left';
  series.forEach(s => {
    ctx.fillStyle = s.color;
    ctx.fillRect(lx, H - 24, 12, 2);
    ctx.fillStyle = '#8a9ab5';
    ctx.fillText(s.label, lx + 15, H - 21);
    lx += ctx.measureText(s.label).width + 28;
  });

  // Domain
  ctx.fillStyle = '#3a4a62';
  ctx.font = '8px Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('digitalcredityield.com', W - MR, H - 6);
}

export async function generateAnimatedGif(insight, date) {
  const chartData = insight?.chartData;
  if (!chartData || chartData.type !== 'comparison' || !chartData.series?.length) return null;

  const { series, title, months } = chartData;
  const allVals = series.flatMap(s => s.values);
  const rawMax  = Math.max(...allVals);
  const yMin    = 0;
  const yMax    = Math.ceil(rawMax * 1.15 / 5) * 5;

  const canvas  = createCanvas(W, H);
  const ctx     = canvas.getContext('2d');

  const encoder = new GIFEncoder(W, H, 'neuquant', true);
  encoder.setDelay(80);  // ~12.5fps
  encoder.setRepeat(0);  // infinite loop
  encoder.setQuality(15);
  encoder.start();

  // 72 frames: 4 static opening + 54 drawing + 14 hold with end labels
  const TOTAL  = 72;
  const STATIC = 4;
  const DRAW   = 54;

  for (let f = 0; f < TOTAL; f++) {
    let drawProgress = 0;
    let endAlpha     = 0;

    if (f < STATIC) {
      drawProgress = 0;
    } else if (f < STATIC + DRAW) {
      drawProgress = (f - STATIC) / DRAW;
    } else {
      drawProgress = 1;
      endAlpha = Math.min(1, (f - STATIC - DRAW) / 7);
    }

    renderFrame(ctx, drawProgress, endAlpha, series, yMin, yMax, title, date, months);
    encoder.addFrame(ctx);
  }

  encoder.finish();
  return encoder.out.getData();
}
