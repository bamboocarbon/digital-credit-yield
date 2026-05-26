import { NextResponse } from 'next/server';
import { run } from '../../../../scripts/motivationEmail.js';

export const maxDuration = 60;

async function handler(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await run();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Motivation email cron failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
