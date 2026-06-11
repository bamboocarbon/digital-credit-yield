import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { Resend } from 'resend';

export const revalidate = 0;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SITE_URL = 'https://www.digitalcredityield.com';

async function loadSubscribers() {
  try {
    const { blobs } = await list({ prefix: 'dcy-subscribers' });
    const blob = blobs.find(b => b.pathname === 'dcy-subscribers.json');
    if (!blob) return [];
    const res = await fetch(blob.url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function saveSubscribers(items) {
  await put('dcy-subscribers.json', JSON.stringify(items), {
    access: 'private', contentType: 'application/json', allowOverwrite: true,
  });
}

function welcomeHtml() {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,Helvetica,sans-serif;color:#fff;">
  <div style="max-width:520px;margin:0 auto;padding:20px 16px;">
    <div style="background:linear-gradient(160deg,#151b27 0%,#0e1520 100%);border-radius:18px;padding:24px 22px;border:1px solid #1e2a3a;">

      <div style="border:1.5px solid #f5a623;border-radius:12px;padding:10px 18px;text-align:center;margin-bottom:18px;background:rgba(245,166,35,0.03);">
        <span style="font-size:20px;font-weight:700;color:#f5a623;letter-spacing:0.04em;">Welcome to the Daily Snapshot</span>
      </div>

      <p style="font-size:14px;color:#c8d4e8;line-height:1.7;margin:0 0 14px;">
        You're subscribed. Every day the US markets are open, you'll receive a snapshot of
        STRC and SATA — live prices, the day's move, a dividend insight, and the daily chart —
        shortly after 4pm UK time.
      </p>
      <p style="font-size:14px;color:#c8d4e8;line-height:1.7;margin:0 0 18px;">
        In the meantime, the live trackers, growth projectors and dividend history are always at
        <a href="${SITE_URL}" style="color:#f5a623;text-decoration:none;">digitalcredityield.com</a>.
      </p>

      <div style="text-align:center;font-size:10px;color:#3a4a62;line-height:1.6;">
        Not financial advice. For informational purposes only.<br>
        Changed your mind? <a href="${SITE_URL}/unsubscribe" style="color:#8a9ab5;">Unsubscribe</a> any time.
      </div>

    </div>
  </div>
</body>
</html>`;
}

async function sendWelcomeEmail(email) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Digital Credit Yield <contact@digitalcredityield.com>',
      to: email,
      subject: 'Welcome — your Daily Snapshot starts on the next market day',
      html: welcomeHtml(),
    });
  } catch {
    // Best-effort — a failed welcome email must not fail the signup
  }
}

// Authenticated subscriber count/list — same admin password as the news admin
export async function GET(request) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token || token !== process.env.NEWS_ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const subscribers = await loadSubscribers();
  return NextResponse.json({ count: subscribers.length, subscribers });
}

export async function POST(request) {
  const body = await request.json();
  const email = (body.email || '').trim().toLowerCase();
  const action = body.action || 'subscribe';

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
  }

  const subscribers = await loadSubscribers();

  if (action === 'unsubscribe') {
    const updated = subscribers.filter(s => s.email !== email);
    if (updated.length !== subscribers.length) await saveSubscribers(updated);
    // Always succeed — don't reveal whether the address was on the list
    return NextResponse.json({ success: true });
  }

  if (!subscribers.some(s => s.email === email)) {
    subscribers.push({ email, subscribedAt: new Date().toISOString() });
    await saveSubscribers(subscribers);
    await sendWelcomeEmail(email);
  }
  return NextResponse.json({ success: true });
}
