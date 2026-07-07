// scripts/generateMp4.js
// Renders the DCY daily card as an H.264 MP4 via ffmpeg: a short NASA launch
// clip (7-day rotation, see daily-email-v2-rocket-race/rocketClipRotation.mjs)
// followed by the vertical rocket-race chart (STRC/SATA/BMNP daily rotation
// vs US Treasuries vs Bank Savings). v1 (the old single-chart design with no
// intro clip) is preserved as the git tag daily-email-v1-classic-chart.
//
// The actual chart-rendering logic lives in daily-email-v2-rocket-race/
// renderVerticalRaceFrame.mjs and is imported here rather than duplicated, so
// that folder's preview build stays a true preview of what production runs.

import { execFile, spawn } from 'child_process';
import { promisify }       from 'util';
import os                  from 'os';
import path                from 'path';
import fs                  from 'fs';
import crypto               from 'crypto';
import ffmpegPath          from 'ffmpeg-static';
import { getDailyTicker }  from './insightEngine.js';
import { getDailyRocketClip } from './daily-email-v2-rocket-race/rocketClipRotation.mjs';
import {
  PW, PH, TOTAL_FRAMES, buildLanes, renderFrame, createRaceCanvas,
} from './daily-email-v2-rocket-race/renderVerticalRaceFrame.mjs';

// Bundled binary on Vercel (no system ffmpeg there); falls back to PATH locally
const FFMPEG = ffmpegPath || 'ffmpeg';
const FPS = 25;

// Clip files are served from public/ (not scripts/) so Vercel's serverless
// function bundler reliably includes them — mirrors how public/fonts/ is
// used for the Inter font files elsewhere in this pipeline.
const CLIP_PATHS = {
  launch1_ixpe: 'launch1_ixpe.mp4',
  launch2_blueghost: 'launch2_blueghost.mp4',
};

function run(cmd, args) {
  return promisify(execFile)(cmd, args, { maxBuffer: 1024 * 1024 * 256 });
}

function moneyFmt(v) {
  return `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

// ── Public entry point ────────────────────────────────────────────────────────
export async function generateMp4(insight, quotes, date) {
  const tmpId = crypto.randomBytes(6).toString('hex');
  const tmpDir = os.tmpdir();
  const chartMp4 = path.join(tmpDir, `dcy-chart-${tmpId}.mp4`);
  const introTs  = path.join(tmpDir, `dcy-intro-${tmpId}.ts`);
  const chartTs  = path.join(tmpDir, `dcy-chart-${tmpId}.ts`);
  const finalMp4 = path.join(tmpDir, `dcy-final-${tmpId}.mp4`);

  try {
    const ticker = getDailyTicker(0);
    const lanes = buildLanes(ticker);
    const featured = lanes.find(l => l.key === ticker);
    const others   = lanes.filter(l => l.key !== ticker);
    const insightText = `${ticker} is on track to turn $10,000 into ${moneyFmt(featured.finalVal)} over 5 years at its ${featured.rateLabel} rate — well ahead of ${others.map(o => `${o.label} (${moneyFmt(o.finalVal)})`).join(' or ')}.`;
    const ctxInfo = { title: `${ticker} vs US Treasuries vs Bank Savings`, date, insightText, quotes };

    // Render chart segment
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn(FFMPEG, [
        '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', `${PW}x${PH}`,
        '-framerate', String(FPS), '-i', 'pipe:0',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p',
        '-movflags', 'faststart',
        '-y', chartMp4,
      ]);
      ffmpeg.on('error', reject);
      ffmpeg.on('close', code => code === 0 ? resolve() : reject(new Error(`ffmpeg (chart) exited ${code}`)));
      ffmpeg.stderr.on('data', () => {});

      (async () => {
        const { ctx } = createRaceCanvas();
        const LOOPS = 3;
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
            const imageData = ctx.getImageData(0, 0, PW, PH);
            await writeFrame(Buffer.from(imageData.data.buffer));
          }
        }
        ffmpeg.stdin.end();
      })().catch(err => { ffmpeg.stdin.destroy(); reject(err); });
    });

    // Pick today's rocket clip and concat: intro + chart
    const clip = getDailyRocketClip(0);
    const introMp4 = path.join(process.cwd(), 'public', 'rocket-clips', CLIP_PATHS[clip.key]);

    await run(FFMPEG, ['-y', '-i', introMp4, '-c', 'copy', '-bsf:v', 'h264_mp4toannexb', '-f', 'mpegts', introTs]);
    await run(FFMPEG, ['-y', '-i', chartMp4, '-c', 'copy', '-bsf:v', 'h264_mp4toannexb', '-f', 'mpegts', chartTs]);
    await run(FFMPEG, ['-y', '-i', `concat:${introTs}|${chartTs}`, '-c', 'copy', '-movflags', '+faststart', finalMp4]);

    return fs.readFileSync(finalMp4);
  } finally {
    for (const f of [chartMp4, introTs, chartTs, finalMp4]) {
      fs.rm(f, { force: true }, () => {});
    }
  }
}
