// scripts/daily-email-v2-rocket-race/buildPreview.mjs
//
// STANDALONE PREVIEW — "v2" daily email redesign (NASA launch clip intro +
// vertical rocket-race chart). Does not modify generateMp4.js or any
// production file. v1 (the current live daily email) is preserved as the
// git tag daily-email-v1-classic-chart.
//
// Usage:
//   node buildPreview.mjs            → uses today's clip per the 7-day rotation
//   node buildPreview.mjs launch1    → forces the IXPE clip
//   node buildPreview.mjs launch2    → forces the Blue Ghost clip
// Output: output/rocket_intro_plus_vertical_race_<clip>.mp4 (auto-opens)

import { spawn, execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import ffmpegPath from 'ffmpeg-static';
import { getDailyTicker } from '../insightEngine.js'; // read-only import, unchanged
import { getStockQuote } from '../../lib/fetchStockData.js'; // read-only import, unchanged
import { ROCKET_CLIPS, getDailyRocketClip } from './rocketClipRotation.mjs';
import {
  TOTAL_FRAMES, buildLanes, renderFrame, createRaceCanvas,
  PW as CHART_PW, PH as CHART_PH,
} from './renderVerticalRaceFrame.mjs';

const execFileP = promisify(execFile);
const FFMPEG = ffmpegPath || 'ffmpeg';

const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(DIR, 'output');
const FPS = 25;

fs.mkdirSync(OUT, { recursive: true });

function run(cmd, args) {
  return execFileP(cmd, args, { maxBuffer: 1024 * 1024 * 256 });
}
function moneyFmt(v) {
  return `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

const CLIP_FILES = {
  launch1_ixpe: 'assets/launch1_ixpe.mp4',
  launch2_blueghost: 'assets/launch2_blueghost.mp4',
};

function resolveClip(arg) {
  if (arg === 'launch1') return ROCKET_CLIPS[0];
  if (arg === 'launch2') return ROCKET_CLIPS[1];
  return getDailyRocketClip(0); // today's pick per the 7-day rotation
}

async function buildChartSegment(chartMp4) {
  const ticker = getDailyTicker(0);
  console.log(`Rendering vertical race chart for today's featured ticker: ${ticker}...`);

  const lanes = buildLanes(ticker);
  const featured = lanes.find(l => l.key === ticker);
  const others   = lanes.filter(l => l.key !== ticker);
  const insightText = `${ticker} is on track to turn $10,000 into ${moneyFmt(featured.finalVal)} over 5 years at its ${featured.rateLabel} rate — well ahead of ${others.map(o => `${o.label} (${moneyFmt(o.finalVal)})`).join(' or ')}.`;

  const [strcQ, sataQ, bmnpQ] = await Promise.all([
    getStockQuote('STRC').catch(() => null),
    getStockQuote('SATA').catch(() => null),
    getStockQuote('BMNP').catch(() => null),
  ]);
  const quotes = { STRC: strcQ, SATA: sataQ, BMNP: bmnpQ };

  const ctxInfo = {
    title: `${ticker} vs US Treasuries vs Bank Savings`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    insightText,
    featuredTicker: ticker,
    quotes,
  };

  const { ctx } = createRaceCanvas();

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn(FFMPEG, [
      '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', `${CHART_PW}x${CHART_PH}`,
      '-framerate', String(FPS), '-i', 'pipe:0',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p',
      '-movflags', 'faststart',
      '-y', chartMp4,
    ]);
    ffmpeg.on('error', reject);
    ffmpeg.on('close', code => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)));
    ffmpeg.stderr.on('data', () => {});

    (async () => {
      const LOOPS = 3; // match generateMp4.js's baked-loop behaviour
      ffmpeg.stdin.setMaxListeners(0);
      function writeFrame(buf) {
        return new Promise((res, rej) => {
          const ok = ffmpeg.stdin.write(buf);
          if (ok) { res(); return; }
          const onDrain = () => { ffmpeg.stdin.removeListener('error', onErr); res(); };
          const onErr   = (e) => { ffmpeg.stdin.removeListener('drain', onDrain); rej(e); };
          ffmpeg.stdin.once('drain', onDrain);
          ffmpeg.stdin.once('error', onErr);
        });
      }
      for (let loop = 0; loop < LOOPS; loop++) {
        for (let f = 0; f < TOTAL_FRAMES; f++) {
          ctx.setTransform(2, 0, 0, 2, 0, 0);
          renderFrame(ctx, f, lanes, ctxInfo);
          const imageData = ctx.getImageData(0, 0, CHART_PW, CHART_PH);
          await writeFrame(Buffer.from(imageData.data.buffer));
        }
      }
      ffmpeg.stdin.end();
    })().catch(err => { ffmpeg.stdin.destroy(); reject(err); });
  });
}

async function concat(introMp4, chartMp4, finalMp4) {
  const introTs = finalMp4.replace('.mp4', '_intro.ts');
  const chartTs = finalMp4.replace('.mp4', '_chart.ts');
  await run(FFMPEG, ['-y', '-i', introMp4, '-c', 'copy', '-bsf:v', 'h264_mp4toannexb', '-f', 'mpegts', introTs]);
  await run(FFMPEG, ['-y', '-i', chartMp4, '-c', 'copy', '-bsf:v', 'h264_mp4toannexb', '-f', 'mpegts', chartTs]);
  await run(FFMPEG, ['-y', '-i', `concat:${introTs}|${chartTs}`, '-c', 'copy', '-movflags', '+faststart', finalMp4]);
  fs.unlinkSync(introTs);
  fs.unlinkSync(chartTs);
}

async function report(finalMp4) {
  const stat = fs.statSync(finalMp4);
  const { stdout } = await run('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', finalMp4,
  ]);
  console.log(`Done.`);
  console.log(`  File:     ${finalMp4}`);
  console.log(`  Size:     ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Duration: ${parseFloat(stdout).toFixed(1)}s`);
}

async function main() {
  const arg = process.argv[2];
  const clip = resolveClip(arg);
  console.log(`Using intro clip: ${clip.key} (${clip.label})`);

  const introMp4 = path.join(DIR, CLIP_FILES[clip.key]); // already trimmed/cropped/muted at extraction time
  const chartMp4 = path.join(OUT, `_chart_tmp.mp4`);
  const finalMp4 = path.join(OUT, `rocket_intro_plus_vertical_race_${clip.key}.mp4`);

  await buildChartSegment(chartMp4);
  await concat(introMp4, chartMp4, finalMp4);
  fs.unlinkSync(chartMp4);
  await report(finalMp4);

  if (process.platform === 'darwin') {
    spawn('open', [finalMp4], { detached: true, stdio: 'ignore' }).unref();
  }
}

main().catch(err => { console.error('FAILED:', err); process.exit(1); });
