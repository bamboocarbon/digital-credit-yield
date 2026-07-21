// scripts/motivationEmail.js
// Sends two Thought for the Day emails at 5pm so you can pick the better one.

import { Resend } from 'resend';
import { generateDailyInsight } from './insightEngine.js';
import { alreadySentToday, markSentToday } from '../lib/sendGuard.js';

const RECIPIENT = 'robin.gillingham@hotmail.co.uk';
const SITE_URL  = (process.env.SITE_URL || 'https://www.digitalcredityield.com').replace(/\/$/, '');

// Weekend variant runs Sat/Sun UK time; kill switch via env var (default on).
// Checked in the exchange's own timezone (same pattern as lib/marketDays.js)
// so a late-UTC cron run doesn't roll over to the wrong weekday.
function isUkWeekend(date = new Date()) {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/London', weekday: 'short',
  }).format(date);
  return weekday === 'Sat' || weekday === 'Sun';
}

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

// Lighter weekend variant: hero image up top, same thought content, decorative
// stars around the quote. Kept fully separate from buildHtml so the weekday
// template is never at risk of a weekend styling regression.
function buildWeekendHtml(thought, today) {
  const heroUrl = `${SITE_URL}/email/weekend-thought-spaceman.jpg`;
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#2E3A46;">
  <div style="max-width:480px;margin:0 auto;padding:0;">

    <div style="background:#F4F1EA;">
      <img src="${heroUrl}" width="480" alt="An astronaut reading, relaxed, with Earth in view" style="display:block;width:100%;height:auto;border:0;">

      <div style="background:#F4F1EA;padding:20px 20px 32px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
          <div style="width:16px;height:16px;background:#f5a623;border-radius:3px;flex-shrink:0;margin-top:-3px;"></div>
          <span style="font-size:16px;font-weight:700;color:#000000;line-height:16px;">Digital Credit Yield &middot; ${today}</span>
        </div>

        <div style="text-align:center;margin-bottom:12px;">
          <span style="display:inline-block;color:#f5a623;border:2px solid #f5a623;border-radius:14px;padding:14px 22px;font-size:26px;font-weight:700;line-height:1.3;">Tracking STRC, SATA<br>and BMNP for growth</span>
        </div>

        <div style="text-align:center;">
          <div style="font-size:20px;font-weight:700;color:#2E3A46;margin-bottom:16px;">Thought for the Day</div>
          <div style="color:#f5a623;font-size:22px;font-weight:700;margin-bottom:14px;">&#9733;&nbsp;&nbsp;&#9733;&nbsp;&nbsp;&#9733;</div>
          <div style="font-size:28px;font-weight:700;line-height:1.4;color:#4A5560;">${thought}</div>
          <div style="color:#f5a623;font-size:22px;font-weight:700;margin-top:18px;">&#9733;&nbsp;&nbsp;&#9733;&nbsp;&nbsp;&#9733;</div>
        </div>

        <div style="text-align:center;margin-top:20px;padding:0 12px;">
          <p style="font-size:11px;color:#8A8F94;margin:0 0 10px;">Not financial advice. For informational purposes only. Always do your own research before making any investment decisions.</p>
          <a href="${SITE_URL}" style="font-size:13px;color:#2E3A46;text-decoration:none;">digitalcredityield.com</a>
        </div>
      </div>
    </div>

  </div>
</body>
</html>`;
}

export async function run() {
  if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');

  if (await alreadySentToday('motivation-email')) {
    console.log('motivation-email already sent today — skipping');
    return;
  }

  const { motivation, motivationB } = await generateDailyInsight();

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const resend = new Resend(process.env.RESEND_API_KEY);

  const useWeekendTheme = isUkWeekend() && process.env.WEEKEND_THOUGHT_THEME_ENABLED !== 'false';
  const render = useWeekendTheme ? buildWeekendHtml : buildHtml;

  await Promise.all([
    resend.emails.send({
      from: 'Digital Credit Yield <contact@digitalcredityield.com>',
      to: RECIPIENT,
      subject: `Thought A — ${today}`,
      html: render(motivation, today),
    }),
    resend.emails.send({
      from: 'Digital Credit Yield <contact@digitalcredityield.com>',
      to: RECIPIENT,
      subject: `Thought B — ${today}`,
      html: render(motivationB, today),
    }),
  ]);

  await markSentToday('motivation-email');
  console.log(`Thought A & B sent to ${RECIPIENT}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch(err => {
    console.error('Failed:', err.message || err);
    process.exit(1);
  });
}
