import { NextResponse } from 'next/server';

export const maxDuration = 30;

// GitHub Actions' own `schedule:` trigger on scan-feed.yml has proven unreliable (confirmed
// 2026-10-15 and again 2026-10-16: it fired on time zero times across both days, and only once
// at all, 4.5 hours late). Same root cause as the email crons (see email-crons.yml) — GitHub's
// scheduled triggers are best-effort and get delayed/dropped under platform load, especially at
// popular round-number minutes. This endpoint lets an external, reliable scheduler (cron-job.org,
// same as daily-email/motivation-email/evening-email) kick the workflow via GitHub's REST API
// instead, while the workflow itself still does the actual work (checkout, fetch, commit, push) —
// this just replaces *how it's launched*, not what it does. scan-feed.yml's own schedule entries
// are left in place as a free backup.
const OWNER = 'bamboocarbon';
const REPO = 'digital-credit-yield';
const WORKFLOW = 'scan-feed.yml';

async function handler(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = process.env.GITHUB_DISPATCH_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'GITHUB_DISPATCH_TOKEN not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({ ref: 'main' }),
      }
    );
    if (res.status !== 204) {
      const body = await res.text().catch(() => '');
      throw new Error(`GitHub dispatch failed: HTTP ${res.status} ${body}`);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Scan feed dispatch cron failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
