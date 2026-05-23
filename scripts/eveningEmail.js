// scripts/eveningEmail.js
// Sends a nightly engagement question email linking to a relevant site page.
// Run via: node scripts/eveningEmail.js

import { Resend } from 'resend';

const RECIPIENT = 'robin.gillingham@hotmail.co.uk';
const SITE_URL  = (process.env.SITE_URL || 'https://www.digitalcredityield.com').replace(/\/$/, '');

const QUESTIONS = [
  // STRC — Projector
  {
    question: "How can I earn $500 interest in a year on a $10,000 investment?",
    teaser: "With STRC currently yielding over 11%, the math could work in your favor. See your exact 12-month income projection.",
    cta: "Run the numbers",
    path: "/strc/projector",
  },
  {
    question: "What monthly income would $50,000 invested in STRC generate?",
    teaser: "At today's rate, that's potentially over $450 every single month. See a full income breakdown.",
    cta: "See my projection",
    path: "/strc/projector",
  },
  {
    question: "How much do you need to invest to earn $1,000 a month in passive income?",
    teaser: "It's less than you might think. Use the STRC projector to find your magic number.",
    cta: "Find my number",
    path: "/strc/projector",
  },
  {
    question: "Could a $20,000 investment in STRC cover your monthly bills?",
    teaser: "See exactly how much monthly income $20,000 would generate — and whether reinvesting dividends grows it faster.",
    cta: "Calculate it",
    path: "/strc/projector",
  },
  {
    question: "What would $100,000 in STRC earn you each month?",
    teaser: "At an 11.5% annual rate paid monthly, the income adds up quickly. Model your own scenario.",
    cta: "See the projection",
    path: "/strc/projector",
  },
  {
    question: "How much would you need to invest to cover a $500 monthly shortfall in retirement?",
    teaser: "Use the STRC income projector to model exactly how much capital generates the income you need.",
    cta: "Model my retirement income",
    path: "/strc/projector",
  },
  {
    question: "How long would it take to earn back 10% of your STRC investment in income alone?",
    teaser: "At STRC's current yield, the answer might surprise you. Run the projection and see.",
    cta: "Model it now",
    path: "/strc/projector",
  },
  {
    question: "What would $75,000 invested in STRC pay out over 3 years?",
    teaser: "See a full 3-year income projection, with and without dividend reinvestment.",
    cta: "See the 3-year view",
    path: "/strc/projector",
  },
  // STRC — Differentiator
  {
    question: "How does STRC compare to a high-yield savings account?",
    teaser: "Most high-yield savings accounts offer under 5% APY. See side-by-side how STRC stacks up over 1, 3, and 5 years.",
    cta: "Compare now",
    path: "/strc/differentiator",
  },
  {
    question: "Is STRC a better income option than US Treasuries?",
    teaser: "Treasury yields sit around 4–5%. STRC targets 11.5%. See the real income difference over time.",
    cta: "See the comparison",
    path: "/strc/differentiator",
  },
  {
    question: "What's the income gap between STRC and a typical savings account over 5 years?",
    teaser: "The compounding effect of a higher yield is significant. See the numbers side by side.",
    cta: "Compare the yields",
    path: "/strc/differentiator",
  },
  {
    question: "What's the real annual yield on STRC after monthly compounding?",
    teaser: "The headline rate is 11.5% — but reinvesting dividends monthly pushes your effective return even higher.",
    cta: "See the yield chart",
    path: "/strc/chart",
  },
  // SATA — Projector
  {
    question: "What would £10,000 in SATA earn you — paid every single business day?",
    teaser: "SATA is set to become the world's first listed security paying daily dividends from June 2026. See your daily income.",
    cta: "See daily income",
    path: "/sata/projector",
  },
  {
    question: "How much passive income could $30,000 in SATA generate each month?",
    teaser: "At 13% annual yield paid every business day, SATA compounds faster than monthly payers. See how it adds up.",
    cta: "Run the projection",
    path: "/sata/projector",
  },
  {
    question: "Could SATA's daily dividends help you build wealth faster than monthly income?",
    teaser: "Daily compounding at 13% gives an effective APY of 13.88%. See what that means for your money.",
    cta: "Find out",
    path: "/sata/projector",
  },
  {
    question: "How much would $75,000 in SATA earn you over the next 12 months?",
    teaser: "At 13% annual yield paid daily, the income adds up every NYSE business day. See the full projection.",
    cta: "Calculate my income",
    path: "/sata/projector",
  },
  // SATA — Differentiator
  {
    question: "How does SATA's 13% daily dividend compare to a high-yield savings account?",
    teaser: "Most high-yield savings accounts offer 4–5% APY. See how SATA's daily income stacks up side by side.",
    cta: "Compare now",
    path: "/sata/differentiator",
  },
  {
    question: "Is SATA's yield worth it compared to Treasuries or a savings account?",
    teaser: "At 13% paid every business day, the income gap is significant. See a full side-by-side comparison.",
    cta: "See the comparison",
    path: "/sata/differentiator",
  },
];

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

export async function run() {
  if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');

  const q = QUESTIONS[getDayOfYear() % QUESTIONS.length];
  const url = `${SITE_URL}${q.path}`;
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
      <div style="font-size:18px;color:#f5a623;font-weight:700;margin-bottom:24px;">Question</div>
      <h1 style="font-size:24px;line-height:1.45;font-weight:700;margin:0 0 20px;color:#fff;">${q.question}</h1>
      <p style="font-size:15px;line-height:1.75;color:#9ca3af;margin:0;">${q.teaser}</p>
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
    subject: `${q.question}`,
    html,
  });

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
  console.log(`Evening email sent to ${RECIPIENT}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch(err => {
    console.error('Failed:', err.message || err);
    process.exit(1);
  });
}
