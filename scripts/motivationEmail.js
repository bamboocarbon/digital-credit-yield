// scripts/motivationEmail.js
// Sends two Thought for the Day emails at 5pm so you can pick the better one.

import { Resend } from 'resend';
import { generateDailyInsight } from './insightEngine.js';

const RECIPIENT = 'robin.gillingham@hotmail.co.uk';
const SITE_URL  = (process.env.SITE_URL || 'https://www.digitalcredityield.com').replace(/\/$/, '');

function buildHtml(thought, today) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,Helvetica,sans-serif;color:#fff;">
  <div style="max-width:600px;margin:0 auto;padding:28px 20px;">

    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
      <div style="width:10px;height:10px;background:#f5a623;border-radius:2px;flex-shrink:0;"></div>
      <span style="font-size:15px;color:#6b7280;">Digital Credit Yield &middot; ${today}</span>
    </div>

    <div style="text-align:center;margin-bottom:20px;">
      <span style="display:inline-block;color:#f5a623;border:1px solid #f5a623;border-radius:12px;padding:10px 24px;font-size:18px;font-weight:700;">Tracking STRC, SATA and BMNP for growth</span>
    </div>

    <div style="background:#111827;border:1px solid #1e2a3a;border-radius:12px;padding:28px 24px;text-align:center;">
      <div style="font-size:16px;font-weight:700;color:#9ca3af;margin-bottom:18px;">Thought for the Day</div>
      <div style="font-size:22px;font-weight:700;line-height:1.5;color:#ffffff;">${thought}</div>
    </div>

    <div style="text-align:center;margin-top:20px;padding:0 12px;">
      <p style="font-size:11px;color:#6b7280;margin:0 0 10px;">Not financial advice. For informational purposes only. Always do your own research before making any investment decisions.</p>
      <a href="${SITE_URL}" style="font-size:13px;color:#ffffff;text-decoration:none;">digitalcredityield.com</a>
    </div>

  </div>
</body>
</html>`;
}

export async function run() {
  if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');

  const { motivation, motivationB } = await generateDailyInsight();

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const resend = new Resend(process.env.RESEND_API_KEY);

  await Promise.all([
    resend.emails.send({
      from: 'Digital Credit Yield <contact@digitalcredityield.com>',
      to: RECIPIENT,
      subject: `Thought A — ${today}`,
      html: buildHtml(motivation, today),
    }),
    resend.emails.send({
      from: 'Digital Credit Yield <contact@digitalcredityield.com>',
      to: RECIPIENT,
      subject: `Thought B — ${today}`,
      html: buildHtml(motivationB, today),
    }),
  ]);

  console.log(`Thought A & B sent to ${RECIPIENT}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch(err => {
    console.error('Failed:', err.message || err);
    process.exit(1);
  });
}
