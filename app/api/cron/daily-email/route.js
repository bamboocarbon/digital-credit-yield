import { NextResponse } from 'next/server';
import { run } from '../../../../scripts/dailyEmail.js';

export const maxDuration = 60;

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await run();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Daily email cron failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
