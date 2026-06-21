// scripts/quizVideo.js
// Quiz Converter — takes a DCY quiz card image and renders a 10s H.264 MP4 with:
//   • "QUIZ !" revealed one letter at a time over the existing "Quiz" label
//   • a chasing orange-dot border around the quiz block (Quiz → answers),
//     each dot lighting up then fading so the lights appear to rotate with a tail
//
// Reuses the same canvas → ffmpeg pipeline as generateMp4.js.
// Usage:
//   node scripts/quizVideo.js <image>            → writes <image>.mp4 next to it
//   node scripts/quizVideo.js <image> --debug    → writes a single PNG preview frame

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { spawn } from 'child_process';
import { writeFile } from 'fs/promises';
import path from 'path';
import ffmpegPath from 'ffmpeg-static';

const FFMPEG = ffmpegPath || 'ffmpeg';

// Register the site's bundled Inter (so the QUIZ overlay matches the card's look
// and renders even where there are no system fonts).
for (const [file, name] of [['inter-400.ttf', 'Inter'], ['inter-700.ttf', 'Inter']]) {
  try { GlobalFonts.registerFromPath(path.join(process.cwd(), 'public', 'fonts', file), name); } catch {}
}

// ── Video parameters ──────────────────────────────────────────────────────────
const FPS = 25;
const SECONDS = 10;
const FRAMES = FPS * SECONDS;          // 250
const MAX_W = 1200;                    // cap render width for sane memory/encode

// ── Small helpers ───────────────────────────────────────────────────────────--
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const isOrange = (r, g, b) => r > 150 && g > 80 && g < 205 && b < 120 && r > b + 55 && r >= g - 10;

// Analyse the card to locate the quiz block, the "Quiz" label, and the brand orange.
// Works on the already-drawn canvas at render resolution.
function analyzeCard(ctx, W, H) {
  const data = ctx.getImageData(0, 0, W, H).data;
  const at = (x, y) => { const i = (y * W + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };

  // Card horizontal edges: scan a mid row out from centre until we leave the
  // (lighter) card onto the near-black outer margin.
  const midY = Math.floor(H * 0.5);
  const [br] = [at(Math.floor(W / 2), midY)];
  const cardLumMin = 14; // outer margin is ~[7,8,10] → lum ≈ 8
  let cardLeft = 0, cardRight = W - 1;
  for (let x = Math.floor(W / 2); x >= 0; x--) { const [r, g, b] = at(x, midY); if (lum(r, g, b) < cardLumMin) { cardLeft = x + 1; break; } }
  for (let x = Math.floor(W / 2); x < W; x++) { const [r, g, b] = at(x, midY); if (lum(r, g, b) < cardLumMin) { cardRight = x - 1; break; } }

  // Per-row profile of bright (text) and orange pixels within the card.
  const xL = cardLeft + Math.floor((cardRight - cardLeft) * 0.04);
  const xR = cardRight - Math.floor((cardRight - cardLeft) * 0.04);
  const bright = new Array(H).fill(0);
  const orange = new Array(H).fill(0);
  const cardGrey = new Array(H).fill(0);   // pixels that look like the card body (not black margin, not bright text)
  let orangeMinX = W, orangeMaxX = 0, orangeSample = null;
  let sampleN = 0;
  for (let y = 0; y < H; y++) {
    for (let x = xL; x < xR; x += 2) {
      if (y === 0) sampleN++;
      const [r, g, b] = at(x, y);
      const l = lum(r, g, b);
      if (l > 120) bright[y]++;
      if (l >= 14 && l <= 90) cardGrey[y]++;
      if (isOrange(r, g, b)) {
        orange[y]++;
        if (x < orangeMinX) orangeMinX = x;
        if (x > orangeMaxX) orangeMaxX = x;
        if (!orangeSample) orangeSample = [r, g, b];
      }
    }
  }

  // Card vertical extent = the longest run of mostly card-coloured rows (the phone
  // status bar / EDIT button / black margins are not). Bridge thin bright bands
  // (header, title box, "Quiz" label) so they don't split the card into pieces.
  let cardTop = 0, cardBottom = H - 1, bestLen = 0;
  const cardRowMin = sampleN * 0.30;
  const gapTol = Math.round(H * 0.03);
  let runStart = -1, lastCard = -1;
  for (let y = 0; y < H; y++) {
    if (cardGrey[y] > cardRowMin) {
      if (runStart < 0) runStart = y;
      lastCard = y;
    } else if (runStart >= 0 && y - lastCard > gapTol) {
      if (lastCard - runStart > bestLen) { bestLen = lastCard - runStart; cardTop = runStart; cardBottom = lastCard; }
      runStart = -1;
    }
  }
  if (runStart >= 0 && lastCard - runStart > bestLen) { bestLen = lastCard - runStart; cardTop = runStart; cardBottom = lastCard; }

  // Bright text bands.
  const TH = 5;
  const bands = [];
  let inBand = false, start = 0;
  for (let y = 0; y < H; y++) {
    if (bright[y] > TH && !inBand) { inBand = true; start = y; }
    else if (bright[y] <= TH && inBand) { inBand = false; if (y - start > 5) bands.push([start, y]); }
  }
  if (inBand) bands.push([start, H - 1]);

  // Orange title box bottom (lowest row that still has a run of orange border/text).
  let orangeBottom = 0;
  for (let y = 0; y < H; y++) if (orange[y] > 15) orangeBottom = y;

  // "Quiz" label = first bright band starting below the title box.
  const quizBand = bands.find(([a]) => a > orangeBottom + 4) || bands[0];

  // The footer (digitalcredityield.com) is the last bright band, separated from
  // the answers line by a large gap (the dim, undetected disclaimer). Walk up from
  // the bottom and take the band just above that gap as the answers. This is robust
  // to extra black margin below the card, which shifts any fixed fraction.
  let answersBand = bands[bands.length - 1] || quizBand;
  for (let i = bands.length - 1; i > 0; i--) {
    if (bands[i][0] - bands[i - 1][1] > H * 0.035) { answersBand = bands[i - 1]; break; }
  }

  const orangeColour = orangeSample
    ? `rgb(${orangeSample[0]},${orangeSample[1]},${orangeSample[2]})`
    : '#f0a830';

  // Box width: span most of the card (wider than the text) so the side dots sit
  // clear of the question text on both sides.
  const sideInset = Math.round(W * 0.022);
  const bx = cardLeft + sideInset;
  const bw = (cardRight - cardLeft) - sideInset * 2;

  // Top row of dots sits midway between the title box and the label band, so it
  // has a clear gap on both sides. Bottom is below the answers line.
  const botPad = Math.round(H * 0.032);
  const by = Math.round((orangeBottom + quizBand[0]) / 2);
  const bh = (answersBand[1] + botPad) - by;

  const cardBg = at(Math.floor(W / 2), Math.floor(H * 0.30));
  const bgLum = lum(cardBg[0], cardBg[1], cardBg[2]);

  // ── Label glyphs (Quiz / Thought of the Day / Reply / anything — or none) ──
  // Copy whatever text sits in the label band, recoloured orange and split into
  // letters for the appear/disappear animation. `label` stays null if empty.
  const [orR, orG, orB] = [255, 171, 31];   // orange for the label glyphs
  let lx0 = cardRight, lx1 = cardLeft;
  const colInk = new Int32Array(W);
  for (let x = cardLeft; x <= cardRight; x++) {
    let cnt = 0;
    for (let y = quizBand[0]; y <= quizBand[1]; y++) {
      const [r, g, b] = at(x, y);
      if (lum(r, g, b) > bgLum + 30) cnt++;
    }
    colInk[x] = cnt;
    if (cnt > 0) { if (x < lx0) lx0 = x; if (x > lx1) lx1 = x; }
  }
  let label = null;
  if (lx1 > lx0) {
    const pad = 2;
    const lx = Math.max(0, lx0 - pad), ly = Math.max(0, quizBand[0] - pad);
    const lw = Math.min(W, lx1 + pad) - lx, lh = Math.min(H, quizBand[1] + pad) - ly;
    // Letter segments: runs of inked columns, split where the gap exceeds a few px.
    const gapPx = Math.max(2, Math.round((quizBand[1] - quizBand[0]) * 0.06));
    const segments = [];
    let segStart = -1, gap = 0;
    for (let x = lx0; x <= lx1 + 1; x++) {
      if (x <= lx1 && colInk[x] > 0) { if (segStart < 0) segStart = x; gap = 0; }
      else { gap++; if (segStart >= 0 && (gap >= gapPx || x > lx1)) { segments.push([segStart, x - gap]); segStart = -1; } }
    }
    // Orange bitmap of the label (alpha ∝ how much brighter than the card bg).
    const od = ctx.createImageData(lw, lh);
    for (let yy = 0; yy < lh; yy++) for (let xx = 0; xx < lw; xx++) {
      const [r, g, b] = at(lx + xx, ly + yy);
      const a = clamp((lum(r, g, b) - bgLum - 10) / 90, 0, 1);
      const i = (yy * lw + xx) * 4;
      od.data[i] = orR; od.data[i + 1] = orG; od.data[i + 2] = orB; od.data[i + 3] = Math.round(a * 255);
    }
    label = { x: lx, y: ly, w: lw, h: lh, segments, imageData: od };
  }

  // Crop the output to just outside the card box, leaving a thin black margin —
  // drops the phone status bar, EDIT button and black space above/below the card.
  const marginX = Math.round((cardRight - cardLeft) * 0.025);
  const marginY = Math.round((cardBottom - cardTop) * 0.022);
  const crX = Math.max(0, cardLeft - marginX);
  const crY = Math.max(0, cardTop - marginY);
  let crW = Math.min(W, cardRight + marginX) - crX;
  let crH = Math.min(H, cardBottom + marginY) - crY;
  crW -= crW % 2; crH -= crH % 2;       // even dims for yuv420p

  return {
    box: { x: bx, y: by, w: bw, h: bh },
    label,
    cardBg,
    orange: orangeColour,
    crop: { x: crX, y: crY, w: crW, h: crH },
  };
}

// Even number ≥ given value (libx264 yuv420p needs even dimensions).
const even = n => (n % 2 === 0 ? n : n + 1);

// Build the rounded-rectangle perimeter as a list of evenly-spaced points.
function roundRectPoints(x, y, w, h, r, spacing) {
  // Build a dense polyline of the rounded rect, then resample at fixed spacing.
  const pts = [];
  const arc = (cx, cy, a0, a1) => {
    const steps = Math.max(4, Math.round((Math.abs(a1 - a0) * r) / 4));
    for (let i = 0; i <= steps; i++) { const a = a0 + (a1 - a0) * (i / steps); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  };
  // top edge L→R, then corners clockwise
  pts.push([x + r, y]); pts.push([x + w - r, y]);
  arc(x + w - r, y + r, -Math.PI / 2, 0);
  pts.push([x + w, y + r]); pts.push([x + w, y + h - r]);
  arc(x + w - r, y + h - r, 0, Math.PI / 2);
  pts.push([x + w - r, y + h]); pts.push([x + r, y + h]);
  arc(x + r, y + h - r, Math.PI / 2, Math.PI);
  pts.push([x, y + h - r]); pts.push([x, y + r]);
  arc(x + r, y + r, Math.PI, Math.PI * 1.5);

  // cumulative length + resample
  const seg = [];
  let total = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    seg.push({ a, b, d, acc: total }); total += d;
  }
  const n = Math.max(24, Math.round(total / spacing));
  const out = [];
  for (let i = 0; i < n; i++) {
    const target = (i / n) * total;
    const s = seg.find(s => target >= s.acc && target < s.acc + s.d) || seg[seg.length - 1];
    const f = s.d ? (target - s.acc) / s.d : 0;
    out.push([s.a[0] + (s.b[0] - s.a[0]) * f, s.a[1] + (s.b[1] - s.a[1]) * f]);
  }
  return out;
}

const DOT_COLOUR = '#ff7a00';   // vivid, saturated orange for the border lights

// Draw one frame (progress t in 0..1) onto ctx over the base image (already drawn).
function drawFrame(ctx, t, layout, img, W, H) {
  ctx.drawImage(img, 0, 0, W, H);

  const { cardBg } = layout;
  const dots = layout._dots;
  const N = dots.length;

  // ── Label glyphs (copied from the card, recoloured orange) ─────────────────
  // Appear one letter at a time, hold, then disappear one at a time, looping.
  // Drawn before the dots so the cover never paints over a lit dot. Skipped
  // entirely when the label band had no text.
  const L = layout.label;
  if (L && layout._labelCanvas) {
    ctx.fillStyle = `rgb(${cardBg[0]},${cardBg[1]},${cardBg[2]})`;
    ctx.fillRect(L.x - 2, L.y - 2, L.w + 4, L.h + 4);   // hide the original (grey) label
    const CYCLES = 2;
    const cycleT = (t * CYCLES) % 1;
    const n = L.segments.length;
    const stag = n > 0 ? 0.42 / n : 0;      // spread the reveal across all letters
    const fade = 0.04;
    for (let i = 0; i < n; i++) {
      const [sx0, sx1] = L.segments[i];
      const onAt = 0.02 + i * stag;
      const offAt = 0.58 + i * stag;
      const a = clamp((cycleT - onAt) / fade, 0, 1) * (1 - clamp((cycleT - offAt) / fade, 0, 1));
      if (a <= 0) continue;
      const segW = sx1 - sx0 + 1;
      ctx.globalAlpha = a;
      ctx.drawImage(layout._labelCanvas, sx0 - L.x, 0, segW, L.h, sx0, L.y, segW, L.h);
    }
    ctx.globalAlpha = 1;
  }

  // ── Border lights: the whole track is lit; two dark gaps rotate around it ───
  // (Inverse of a chaser — the OFF positions move, on opposite sides.)
  const dotR = Math.max(6, Math.round(W * 0.011));
  const LOOPS = 3;                        // rotations of the dark gaps over the 10s
  const head = (t * LOOPS) % 1;
  const offIdx = new Set([Math.round(head * N) % N, Math.round(((head + 0.5) % 1) * N) % N]);
  ctx.save();
  ctx.fillStyle = DOT_COLOUR;
  ctx.shadowColor = DOT_COLOUR;
  ctx.globalAlpha = 1;
  for (let i = 0; i < N; i++) {
    if (offIdx.has(i)) continue;          // these two are the rotating dark gaps
    const [x, y] = dots[i];
    ctx.shadowBlur = dotR * 0.9;          // modest glow so the dark gaps still read
    ctx.beginPath(); ctx.arc(x, y, dotR, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;                    // crisp core
    ctx.beginPath(); ctx.arc(x, y, dotR * 0.92, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

export async function generateQuizVideo(imagePath) {
  const img = await loadImage(imagePath);
  let W = img.width, H = img.height;
  if (W > MAX_W) { const s = MAX_W / W; W = Math.round(W * s); H = Math.round(H * s); }
  W = even(W); H = even(H);

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, W, H);
  const layout = analyzeCard(ctx, W, H);
  const r = Math.round(Math.min(layout.box.w, layout.box.h) * 0.06);
  layout._dots = roundRectPoints(layout.box.x, layout.box.y, layout.box.w, layout.box.h, r, Math.round(W * 0.05));
  buildLabelCanvas(layout);

  return await encode(ctx, canvas, layout, img, W, H);
}

// Turn the extracted orange label bitmap into a canvas we can blit per letter.
function buildLabelCanvas(layout) {
  if (!layout.label) return;
  const lc = createCanvas(layout.label.w, layout.label.h);
  lc.getContext('2d').putImageData(layout.label.imageData, 0, 0);
  layout._labelCanvas = lc;
}

function encode(ctx, canvas, layout, img, W, H) {
  const crop = layout.crop;
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(FFMPEG, [
      '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${crop.w}x${crop.h}`, '-r', String(FPS),
      '-i', 'pipe:0',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
      '-pix_fmt', 'yuv420p',
      '-movflags', 'frag_keyframe+empty_moov+faststart',
      '-f', 'mp4',
      'pipe:1',
    ]);
    const chunks = [];
    ffmpeg.stdout.on('data', c => chunks.push(c));
    ffmpeg.stdout.on('end', () => resolve(Buffer.concat(chunks)));
    ffmpeg.on('error', reject);
    ffmpeg.stderr.on('data', () => {});

    (async () => {
      ffmpeg.stdin.setMaxListeners(0);
      for (let f = 0; f < FRAMES; f++) {
        const t = f / (FRAMES - 1);
        drawFrame(ctx, t, layout, img, W, H);
        const buf = Buffer.from(ctx.getImageData(crop.x, crop.y, crop.w, crop.h).data);
        const ok = ffmpeg.stdin.write(buf);
        if (!ok) await new Promise((res, rej) => {
          const onDrain = () => { ffmpeg.stdin.removeListener('error', onErr); res(); };
          const onErr = e => { ffmpeg.stdin.removeListener('drain', onDrain); rej(e); };
          ffmpeg.stdin.once('drain', onDrain);
          ffmpeg.stdin.once('error', onErr);
        });
      }
      ffmpeg.stdin.end();
    })().catch(err => { ffmpeg.stdin.destroy(); reject(err); });
  });
}

// ── CLI ─────────────────────────────────────────────────────────────────────--
const isMain = process.argv[1] && process.argv[1].endsWith('quizVideo.js');
if (isMain) {
  const file = process.argv[2];
  const debug = process.argv.includes('--debug');
  if (!file) { console.error('Usage: node scripts/quizVideo.js <image> [--debug]'); process.exit(1); }
  (async () => {
    if (debug) {
      const img = await loadImage(file);
      let W = img.width, H = img.height;
      if (W > MAX_W) { const s = MAX_W / W; W = Math.round(W * s); H = Math.round(H * s); }
      W = even(W); H = even(H);
      const canvas = createCanvas(W, H);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, W, H);
      const layout = analyzeCard(ctx, W, H);
      const r = Math.round(Math.min(layout.box.w, layout.box.h) * 0.06);
      layout._dots = roundRectPoints(layout.box.x, layout.box.y, layout.box.w, layout.box.h, r, Math.round(W * 0.05));
      buildLabelCanvas(layout);
      console.log('layout', JSON.stringify({ box: layout.box, label: layout.label && { x: layout.label.x, y: layout.label.y, w: layout.label.w, h: layout.label.h, letters: layout.label.segments.length }, crop: layout.crop }));
      drawFrame(ctx, 0.25, layout, img, W, H);
      // Crop to the card region for an accurate preview of the final framing.
      const { x, y, w, h } = layout.crop;
      const cc = createCanvas(w, h);
      cc.getContext('2d').drawImage(canvas, x, y, w, h, 0, 0, w, h);
      const out = file.replace(/\.[^.]+$/, '') + '-preview.png';
      await writeFile(out, cc.toBuffer('image/png'));
      console.log('preview →', out);
    } else {
      const buf = await generateQuizVideo(file);
      const out = file.replace(/\.[^.]+$/, '') + '.mp4';
      await writeFile(out, buf);
      console.log(`mp4 → ${out} (${(buf.length / 1e6).toFixed(2)} MB)`);
    }
  })().catch(e => { console.error(e); process.exit(1); });
}
