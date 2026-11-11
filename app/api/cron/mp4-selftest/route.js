import { NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import os from 'os';
import path from 'path';
import ffmpegPath from 'ffmpeg-static';
import { generateDailyInsight, getDailyTicker } from '../../../../scripts/insightEngine.js';
import { generateMp4 } from '../../../../scripts/generateMp4.js';

// Diagnostic only: builds the daily email's rocket MP4 exactly as dailyEmail.js does, but sends nothing and
// writes nothing — answers "does video generation work on this host?" without waiting for a daily send
// (the daily email's once-a-day guard makes retries impossible). Added 2026-11-11 after ffmpeg segfaulted
// (signal 11) in Cloud Run's default sandbox. Trigger via the "Site crons" workflow (mp4-selftest).
export const maxDuration = 120;

// ?mode=matrix: tiny synthetic clips, several ways of joining them, so we can see which ffmpeg invocations crash on
// this host (cheap — a few seconds) and what kind of sandbox it is.
async function matrix() {
  const FF = ffmpegPath || 'ffmpeg';
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mp4m-'));
  const f = (n) => path.join(dir, n);
  const ff = (args) => promisify(execFile)(FF, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { timeout: 60000 });
  const out = { host: { platform: process.platform, release: os.release(), node: process.version, kernel: (() => { try { return fs.readFileSync('/proc/version', 'utf8').trim().slice(0, 120); } catch { return null; } })() } };
  const attempt = async (name, args) => {
    try { await ff(args); out[name] = 'ok'; } catch (e) { out[name] = `FAIL signal=${e.signal ?? 'none'} code=${e.code ?? 'none'} ${String(e.stderr || '').trim().slice(-160)}`; }
  };
  await attempt('make_clip', ['-f', 'lavfi', '-i', 'testsrc=size=320x240:rate=25', '-t', '2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', f('a.mp4')]);
  await attempt('to_ts', ['-i', f('a.mp4'), '-c', 'copy', '-bsf:v', 'h264_mp4toannexb', '-f', 'mpegts', f('a.ts')]);
  fs.writeFileSync(f('list.txt'), `file '${f('a.ts')}'\nfile '${f('a.ts')}'\n`);
  await attempt('concat_protocol_faststart', ['-i', `concat:${f('a.ts')}|${f('a.ts')}`, '-c', 'copy', '-movflags', '+faststart', f('o1.mp4')]);
  await attempt('concat_protocol_nofaststart', ['-i', `concat:${f('a.ts')}|${f('a.ts')}`, '-c', 'copy', f('o2.mp4')]);
  await attempt('concat_demuxer_faststart', ['-f', 'concat', '-safe', '0', '-i', f('list.txt'), '-c', 'copy', '-movflags', '+faststart', f('o3.mp4')]);
  await attempt('concat_demuxer_nofaststart', ['-f', 'concat', '-safe', '0', '-i', f('list.txt'), '-c', 'copy', f('o4.mp4')]);
  await attempt('concat_protocol_fragmented', ['-i', `concat:${f('a.ts')}|${f('a.ts')}`, '-c', 'copy', '-movflags', 'frag_keyframe+empty_moov', f('o5.mp4')]);
  // Is it the MPEG-TS *reader*, or concat in general? And which alternative works?
  await attempt('read_ts_to_null', ['-i', f('a.ts'), '-f', 'null', '-']);
  await attempt('read_ts_single_to_mp4', ['-i', f('a.ts'), '-c', 'copy', f('s.mp4')]);
  await attempt('mp4_copy_faststart', ['-i', f('a.mp4'), '-c', 'copy', '-movflags', '+faststart', f('m.mp4')]);
  fs.writeFileSync(f('list2.txt'), `file '${f('a.mp4')}'\nfile '${f('a.mp4')}'\n`);
  await attempt('concat_demuxer_mp4_inputs', ['-f', 'concat', '-safe', '0', '-i', f('list2.txt'), '-c', 'copy', '-movflags', '+faststart', f('c1.mp4')]);
  await attempt('concat_filter_reencode', ['-i', f('a.mp4'), '-i', f('a.mp4'), '-filter_complex', '[0:v][1:v]concat=n=2:v=1:a=0[v]', '-map', '[v]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', f('c2.mp4')]);
  await attempt('concat_demuxer_mp4_reencode', ['-f', 'concat', '-safe', '0', '-i', f('list2.txt'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', f('c3.mp4')]);
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
  return out;
}

async function handler(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (new URL(request.url).searchParams.get('mode') === 'matrix') return NextResponse.json(await matrix());
  const started = Date.now();
  try {
    const { insight, quotes } = await generateDailyInsight(getDailyTicker(0));
    const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const mp4 = await generateMp4(insight, quotes, today);
    return NextResponse.json({ ok: true, bytes: mp4.length, seconds: Math.round((Date.now() - started) / 100) / 10 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message, seconds: Math.round((Date.now() - started) / 100) / 10 }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
