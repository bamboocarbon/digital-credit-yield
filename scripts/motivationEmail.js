// scripts/motivationEmail.js
// Sends a short daily encouragement phrase at 5pm.
// Run via: node scripts/motivationEmail.js

import { Resend } from 'resend';
import { generateDailyInsight } from './insightEngine.js';

const RECIPIENT = 'robin.gillingham@hotmail.co.uk';
const SITE_URL  = (process.env.SITE_URL || 'https://www.digitalcredityield.com').replace(/\/$/, '');

export async function run() {
  if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');

  const { motivation } = await generateDailyInsight();

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,Helvetica,sans-serif;color:#fff;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">

    <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
      <div style="width:10px;height:10px;background:#f5a623;border-radius:2px;flex-shrink:0;"></div>
      <span style="font-size:16px;color:#888;">Digital Credit Yield &middot; ${today}</span>
    </div>

    <div style="background:#111827;border:1px solid #1e2a3a;border-radius:16px;padding:36px 28px;text-align:center;">
      <div style="font-size:18px;color:#f5a623;font-weight:700;margin-bottom:24px;">Thought for the Day</div>
      <h1 style="font-size:24px;line-height:1.5;font-weight:700;margin:0;color:#fff;">${motivation}</h1>
    </div>

    <p style="text-align:center;font-size:16px;color:#ffffff;margin-top:24px;">
      <a href="${SITE_URL}" style="color:#ffffff;text-decoration:none;">digitalcredityield.com</a>
    </p>

  </div>
</body>
</html>`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'Digital Credit Yield <contact@digitalcredityield.com>',
    to: RECIPIENT,
    subject: motivation,
    html,
  });

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
  console.log(`Motivation email sent to ${RECIPIENT}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch(err => {
    console.error('Failed:', err.message || err);
    process.exit(1);
  });
}
