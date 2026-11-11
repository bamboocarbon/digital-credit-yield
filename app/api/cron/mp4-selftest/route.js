import { NextResponse } from 'next/server';
import { generateDailyInsight, getDailyTicker } from '../../../../scripts/insightEngine.js';
import { generateMp4 } from '../../../../scripts/generateMp4.js';

// Diagnostic only: builds the daily email's rocket MP4 exactly as dailyEmail.js does, but sends nothing and
// writes nothing — answers "does video generation work on this host?" without waiting for a daily send
// (the daily email's once-a-day guard makes retries impossible). Added 2026-11-11 after ffmpeg segfaulted
// (signal 11) in Cloud Run's default sandbox. Trigger via the "Site crons" workflow (mp4-selftest).
export const maxDuration = 120;

async function handler(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
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
