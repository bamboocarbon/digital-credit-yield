// scripts/rocket-intro-preview/buildPreview.mjs
//
// STANDALONE PREVIEW — does not modify any existing DCY scripts.
// Imports the real generateMp4() (unchanged) to render the chart segment exactly
// as production does, then prepends a muted NASA launch clip in front of it.
//
// Usage: node scripts/rocket-intro-preview/buildPreview.mjs
// Output: scripts/rocket-intro-preview/output/rocket_intro_preview.mp4 (auto-opens)

import { spawn } from 'child_process';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import ffmpegPath from 'ffmpeg-static';
import { generateMp4 } from '../generateMp4.js'; // <-- unmodified import, not edited

const execFileP = promisify(execFile);
const FFMPEG = ffmpegPath || 'ffmpeg';

const DIR       = path.dirname(new URL(import.meta.url).pathname);
const ASSETS    = path.join(DIR, 'assets');
const OUT       = path.join(DIR, 'output');
const NASA_SRC  = path.join(ASSETS, 'nasa_new_horizons_launch_source.mp4');

const INTRO_MP4 = path.join(OUT, '01_nasa_intro.mp4');
const CHART_MP4 = path.join(OUT, '02_chart.mp4');
const INTRO_TS  = path.join(OUT, '01_nasa_intro.ts');
const CHART_TS  = path.join(OUT, '02_chart.ts');
const FINAL_MP4 = path.join(OUT, 'rocket_intro_preview.mp4');

// Must match generateMp4.js's canvas output exactly (920x976 @ 25fps)
const W = 920, H = 976, FPS = 25;

// The 0:44-0:52 window confirmed to show a tight rocket/flame close-up
const CLIP_START = 44;
const CLIP_END   = 52;

fs.mkdirSync(OUT, { recursive: true });

function run(cmd, args) {
  return execFileP(cmd, args, { maxBuffer: 1024 * 1024 * 256 });
}

async function buildNasaIntro() {
  console.log('1/4  Cropping + scaling + muting NASA clip...');
  // Crop to the chart's portrait aspect (W:H), scale up, sharpen slightly to
  // offset the 2006-era source resolution, strip audio entirely.
  const cropW = Math.round(450 * (W / H)); // crop from source's 450px height
  await run(FFMPEG, [
    '-y', '-ss', String(CLIP_START), '-to', String(CLIP_END), '-i', NASA_SRC,
    '-an',
    '-vf', `crop=${cropW}:450:(in_w-${cropW})/2:0,scale=${W}:${H}:flags=lanczos,unsharp=5:5:0.6:5:5:0.0`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    INTRO_MP4,
  ]);
}

async function buildChartSegment() {
  console.log('2/4  Rendering chart segment via the real generateMp4()...');

  function sampleSeries(start, end, color, label) {
    const values = Array.from({ length: 60 }, (_, i) =>
      start + (end - start) * (i / 59) + (Math.random() - 0.5) * 0.5);
    return { values, color, label };
  }

  const insight = {
    text: 'STRC continues to lead on yield stability while BMNP shows the sharpest growth trajectory this quarter, driven by steady weekly BTC accumulation and strong coupon coverage.',
    chartData: {
      type: 'comparison',
      title: 'STRC vs SATA vs BMNP — 5yr Growth of $10,000',
      months: 60,
      series: [
        sampleSeries(10000, 24500, '#fde047', 'BMNP'),
        sampleSeries(10000, 21200, '#3b82f6', 'SATA'),
        sampleSeries(10000, 19800, '#4ade80', 'STRC'),
      ],
    },
  };
  const quotes = {
    STRC: { price: 24.85, changePercent: 0.32 },
    SATA: { price: 24.60, changePercent: -0.15 },
    BMNP: { price: 22.10, changePercent: 1.05 },
  };

  const buf = await generateMp4(insight, quotes, 'Jul 7, 2026');
  fs.writeFileSync(CHART_MP4, buf);
}

async function concat() {
  console.log('3/4  Concatenating (via intermediate .ts to avoid re-encode artifacts)...');
  // mpeg-ts intermediates let ffmpeg concat two mp4s with matching codec/res/fps
  // via simple stream copy, since both are already H.264/yuv420p/25fps.
  await run(FFMPEG, ['-y', '-i', INTRO_MP4, '-c', 'copy', '-bsf:v', 'h264_mp4toannexb', '-f', 'mpegts', INTRO_TS]);
  await run(FFMPEG, ['-y', '-i', CHART_MP4, '-c', 'copy', '-bsf:v', 'h264_mp4toannexb', '-f', 'mpegts', CHART_TS]);
  await run(FFMPEG, [
    '-y', '-i', `concat:${INTRO_TS}|${CHART_TS}`,
    '-c', 'copy', '-movflags', '+faststart', FINAL_MP4,
  ]);
  fs.unlinkSync(INTRO_TS);
  fs.unlinkSync(CHART_TS);
}

async function report() {
  const stat = fs.statSync(FINAL_MP4);
  const { stdout } = await run('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', FINAL_MP4,
  ]);
  console.log('4/4  Done.');
  console.log(`     File:     ${FINAL_MP4}`);
  console.log(`     Size:     ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`     Duration: ${parseFloat(stdout).toFixed(1)}s`);
}

async function main() {
  await buildNasaIntro();
  await buildChartSegment();
  await concat();
  await report();

  if (process.platform === 'darwin') {
    spawn('open', [FINAL_MP4], { detached: true, stdio: 'ignore' }).unref();
  }
}

main().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
