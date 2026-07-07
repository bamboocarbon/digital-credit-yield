// scripts/vertical-rocket-chart-preview/renderVerticalRaceFrame.mjs
//
// STANDALONE PREVIEW — new chart concept, does not modify generateMp4.js.
// Values below (colors, rates) are copied from generateMp4.js / Differentiator.js
// on 2026-07-07 and must be kept in sync manually since this is an isolated
// experiment, not a shared import.

import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import path from 'path';
import { ASSET_RATES } from '../../lib/constants.js'; // read-only import: STRC 11.50 / SATA 13.00 / BMNP 9.50

for (const file of ['inter-400.ttf', 'inter-700.ttf']) {
  try {
    GlobalFonts.registerFromPath(
      path.join(process.cwd(), 'public', 'fonts', file), 'Inter'
    );
  } catch { /* local dev falls back to system Arial */ }
}

// H raised from 488: the insight box + legend + domain + disclaimer were
// actually being laid out down to y=541 (DC_Y below), well past the old
// canvas edge at 488 — that's why the last line of text looked clipped.
// The extra height here both fixes that and leaves genuine blank space
// under the disclaimer.
export const W = 460, H = 565, SCALE = 2, PW = W * SCALE, PH = H * SCALE;
const PX = 22;

const TB_Y = 30, TL_Y0 = 44, TL_Y1 = 88, SN_Y0 = 102, SN_Y1 = 166;
const CW_Y0 = 180, CS_Y = 204, CI_Y0 = 216, CI_H = 195, CI_Y1 = CI_Y0 + CI_H; // 411 — CI_Y0 pushed down a touch to clear the larger title
const XL_Y = CI_Y1 + 16, CW_Y1 = XL_Y + 6, IN_Y0 = CW_Y1 + 14, IN_H = 52;
const LG_Y = IN_Y0 + IN_H + 16, DM_Y = LG_Y + 13, DC_Y = DM_Y + 13;
const ML = 30, MR = 14;

export const TICKER_COLOUR = { STRC: '#4ade80', SATA: '#3b82f6', BMNP: '#fde047' };
export const FIXED_RATE    = ASSET_RATES; // { STRC: 11.5, SATA: 13.0, BMNP: 9.5 }
const C_TREASURY = '#d1d5db';
const C_BANK     = '#9ca3af';
const TREASURY_RATE = 4.5; // insightEngine.js BENCHMARKS.TREASURY_5Y
const BANK_RATE     = 0.5; // insightEngine.js BENCHMARKS.BANK
const YEARS = 5;

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
    if (ctx.measureText(test).width <= maxWidth) { line = test; }
    else { if (line) lines.push(line); line = word; if (lines.length >= maxLines) break; }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}
function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
function fmtVal(v) { return v >= 1000 ? `$${(v/1000).toFixed(1)}k` : `$${Math.round(v)}`; }
function compound(rate, years) { return 10000 * Math.pow(1 + rate / 100, years); }

export const TICKER_ORDER = ['STRC', 'SATA', 'BMNP'];

// Lane position now mirrors the featured ticker's own snapshot box above it:
// STRC featured -> left lane, SATA -> middle, BMNP -> right. Treasury/Bank
// fill whichever two slots are left, in that order.
export function buildLanes(featuredTicker) {
  const featuredVal  = compound(FIXED_RATE[featuredTicker], YEARS);
  const treasuryVal  = compound(TREASURY_RATE, YEARS);
  const bankVal      = compound(BANK_RATE, YEARS);
  const maxGain      = featuredVal - 10000;

  const treasuryLane = { key: 'treasury', label: 'US Treasuries', rateLabel: `~${TREASURY_RATE.toFixed(1)}%`, color: C_TREASURY, finalVal: treasuryVal, heightFrac: (treasuryVal - 10000) / maxGain, flame: false };
  const bankLane     = { key: 'bank',     label: 'Bank Savings',  rateLabel: `~${BANK_RATE.toFixed(1)}%`,     color: C_BANK,     finalVal: bankVal,     heightFrac: (bankVal - 10000) / maxGain,     flame: false };
  const featuredLane = { key: featuredTicker, label: featuredTicker, rateLabel: `${FIXED_RATE[featuredTicker].toFixed(1)}% fixed`, color: TICKER_COLOUR[featuredTicker], finalVal: featuredVal, heightFrac: 1, flame: true };

  const slots = [null, null, null];
  slots[TICKER_ORDER.indexOf(featuredTicker)] = featuredLane;
  const remaining = [treasuryLane, bankLane];
  let ri = 0;
  for (let i = 0; i < 3; i++) if (!slots[i]) slots[i] = remaining[ri++];
  return slots;
}

// Frame timing — same choreography budget as generateMp4.js
const DRAW_START = 22, DRAW_FRAMES = 100, END_START = DRAW_START + DRAW_FRAMES; // 122
const TEXT_START = END_START + 4;                                              // 126
export const TOTAL_FRAMES = TEXT_START + 125;                                  // 251 ≈ 10s @ 25fps

const BAR_W = 26;

// Gradient anchored to the full chart height (CI_Y0..CI_Y1), not to the bar's
// own current top — so a short bar is pure dark orange, and only once it
// climbs high enough does its upper portion reach the paler/near-white end.
function gradientBarFill(ctx, chartTopY, chartBottomY) {
  const g = ctx.createLinearGradient(0, chartTopY, 0, chartBottomY);
  g.addColorStop(0,   '#fff7ed'); // near-white at the very top of the screen
  g.addColorStop(0.55,'#f5a623'); // brand gold-orange midway
  g.addColorStop(1,   '#c2410c'); // dark orange, constant at the bottom
  return g;
}

function drawBar(ctx, x, topY, bottomY, fillStyle) {
  const h = bottomY - topY;
  if (h <= 0) return;
  ctx.fillStyle = fillStyle;
  // Radius scales down for very short/early bars so they still read as
  // rounded pills rather than snapping to square corners.
  const r = Math.min(5, h / 2, BAR_W / 2);
  roundRect(ctx, x - BAR_W/2, topY, BAR_W, h, r);
  ctx.fill();
}

export function renderFrame(ctx, frame, lanes, ctxInfo) {
  const { title, date, insightText, quotes } = ctxInfo;
  const showTopbar    = frame >= 0;
  const showTitle     = frame >= 5;
  const showSnapshot  = frame >= 11;
  const showChart     = frame >= 19;
  const showText      = frame >= TEXT_START;

  let progress = 0;
  if (frame >= DRAW_START && frame < END_START) progress = easeInOut((frame - DRAW_START) / DRAW_FRAMES);
  else if (frame >= END_START) progress = 1;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#151b27'); bg.addColorStop(1, '#0e1520');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  if (showTopbar) {
    ctx.fillStyle = '#f5a623';
    roundRect(ctx, PX, TB_Y - 9, 11, 11, 2); ctx.fill();
    ctx.fillStyle = '#8a9ab5';
    ctx.font = '11px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Digital Credit Yield  ·  ${date}`, PX + 16, TB_Y);
  }

  if (showTitle) {
    ctx.strokeStyle = '#f5a623'; ctx.lineWidth = 1.5;
    ctx.fillStyle = 'rgba(245,166,35,0.035)';
    roundRect(ctx, PX, TL_Y0, W - 2*PX, TL_Y1 - TL_Y0, 12);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f5a623';
    ctx.font = 'bold 14px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, W / 2, (TL_Y0 + TL_Y1) / 2 + 5);
  }

  if (showSnapshot) {
    // Reverted to the original card behaviour: always STRC/SATA/BMNP daily
    // prices, independent of which one is "featured" in the chart below.
    const gap = 10;
    const cellW = (W - 2*PX - 2*gap) / 3;
    TICKER_ORDER.forEach((t, i) => {
      const cx = PX + i * (cellW + gap);
      ctx.fillStyle = '#0b1422';
      roundRect(ctx, cx, SN_Y0, cellW, SN_Y1 - SN_Y0, 10); ctx.fill();
      ctx.strokeStyle = '#1a2740'; ctx.lineWidth = 1; ctx.stroke();
      const centerX = cx + cellW / 2, lineGap = 16;

      ctx.fillStyle = TICKER_COLOUR[t];
      ctx.font = 'bold 14px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t, centerX, SN_Y0 + 20);

      const q = quotes?.[t];
      if (q?.price != null) {
        const up = (q.changePercent ?? 0) >= 0;
        ctx.fillStyle = '#e4eaf5';
        ctx.font = 'bold 12px Inter, Arial, sans-serif';
        ctx.fillText(`$${q.price.toFixed(2)}`, centerX, SN_Y0 + 20 + lineGap);
        ctx.fillStyle = up ? '#4ade80' : '#e05555';
        ctx.font = '11px Inter, Arial, sans-serif';
        ctx.fillText(`${up ? '▲' : '▼'} ${Math.abs(q.changePercent ?? 0).toFixed(2)}%`, centerX, SN_Y0 + 20 + lineGap * 2);
      } else {
        ctx.fillStyle = '#8a9ab5';
        ctx.font = '11px Inter, Arial, sans-serif';
        ctx.fillText('Listing soon', centerX, SN_Y0 + 20 + lineGap);
        ctx.fillText(`${FIXED_RATE[t].toFixed(1)}% fixed`, centerX, SN_Y0 + 20 + lineGap * 2);
      }
    });
  }

  if (showChart) {
    ctx.fillStyle = '#08101e';
    roundRect(ctx, PX - 4, CW_Y0, W - 2*(PX - 4), CW_Y1 - CW_Y0, 14); ctx.fill();
    ctx.strokeStyle = '#111d2e'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#e4eaf5';
    ctx.font = 'bold 15px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`$10,000 over ${YEARS} years — who moves fastest?`, W / 2, CS_Y);

    // Headroom reserved above the tallest possible bar so the tracking label
    // above it never collides with the "$10,000 over 5 years" caption.
    const LABEL_HEADROOM = 22;
    const BAR_MAX_H = CI_H - LABEL_HEADROOM;

    const laneW = (W - ML - MR) / lanes.length;
    lanes.forEach((lane, i) => {
      const laneX = ML + laneW * (i + 0.5);
      const curH  = lane.heightFrac * progress * BAR_MAX_H;
      const barTopY = CI_Y1 - curH;

      // Fixed value readout at the bottom (baseline) — always the same spot.
      if (progress > 0.05) {
        ctx.font = 'bold 10px Inter, Arial, sans-serif';
        ctx.fillStyle = '#e4eaf5';
        ctx.textAlign = 'center';
        ctx.fillText(fmtVal(lane.finalVal), laneX, CI_Y1 + 13);
      }

      if (curH > 1) {
        const fill = lane.flame ? gradientBarFill(ctx, CI_Y0 + LABEL_HEADROOM, CI_Y1) : lane.color;
        drawBar(ctx, laneX, barTopY, CI_Y1, fill);
      }

      // Ticker/label name tracks just above the rising bar's current top.
      if (progress > 0.02) {
        ctx.font = 'bold 10px Inter, Arial, sans-serif';
        ctx.fillStyle = lane.flame ? '#fff7ed' : lane.color;
        ctx.textAlign = 'center';
        if (lane.flame) { ctx.shadowColor = '#f5a623'; ctx.shadowBlur = 5; }
        ctx.fillText(lane.label, laneX, barTopY - 8);
        ctx.shadowBlur = 0;
      }
    });
  }

  if (showText) {
    ctx.fillStyle = '#0b1422';
    roundRect(ctx, PX, IN_Y0, W - 2*PX, IN_H, 10); ctx.fill();
    ctx.fillStyle = '#f5a623';
    roundRect(ctx, PX, IN_Y0, 3, IN_H, 1); ctx.fill();
    const maxW = W - 2*PX - 3 - 14 - 10;
    ctx.fillStyle = '#c8d4e8';
    ctx.font = '11px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    wrapText(ctx, insightText, maxW, 3).forEach((line, idx) =>
      ctx.fillText(line, PX + 16, IN_Y0 + 13 + idx * 14));

    ctx.font = '10px Inter, Arial, sans-serif';
    const items = lanes.map(l => ({ label: l.label, color: l.color }));
    const widths = items.map(it => 18 + 5 + ctx.measureText(it.label).width);
    const totalW = widths.reduce((a,b) => a+b, 0) + (items.length - 1) * 14;
    let lx = (W - totalW) / 2;
    items.forEach((it, i) => {
      ctx.fillStyle = it.color;
      roundRect(ctx, lx, LG_Y - 4, 16, 3, 1); ctx.fill();
      ctx.fillStyle = '#8a9ab5';
      ctx.textAlign = 'left';
      ctx.fillText(it.label, lx + 21, LG_Y);
      lx += widths[i] + 14;
    });

    ctx.fillStyle = '#8a9ab5';
    ctx.font = 'bold 11px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('digitalcredityield.com', W / 2, DM_Y);
    ctx.font = '10px Inter, Arial, sans-serif';
    ctx.fillText('Not financial advice. For information purposes only. Always do your own research.', W / 2, DC_Y);
  }
}

export function createRaceCanvas() {
  const canvas = createCanvas(PW, PH);
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);
  return { canvas, ctx };
}
