// scripts/analyticsReportEmail.js
// Daily analytics comparison email — our own cookie-free pageview counter
// vs Vercel's real Web Analytics (pageviews + unique visitors), for both
// digital-credit-yield and polkadotbike, with top-10 pages per site.
// Run via: node scripts/analyticsReportEmail.js

import { Resend } from 'resend';
import { getOwnPeriodStats } from '../lib/pageviewPeriods.js';
import { getVercelTotals, getVercelTopPages } from '../lib/vercelAnalytics.js';

const RECIPIENT = 'robin.gillingham@hotmail.co.uk';

const SITES = [
  { name: 'Digital Credit Yield', ns: 'dcy:pv', projectId: 'prj_s1iAt31nYu5VzUyua5MxAfhamnPL', url: 'https://digitalcredityield.com' },
  { name: 'Polka Dot Bike', ns: 'pdb:pv', projectId: 'prj_AcbBsCJMha4owF3heq2gzNP2VxD1', url: 'https://polkadotbike.com' },
];

function fmt(n) {
  return Number(n).toLocaleString('en-GB');
}

function wrapEmail(inner) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body bgcolor="#0a0f1e" style="margin:0;padding:0;background-color:#0a0f1e;font-family:Arial,Helvetica,sans-serif;color:#fff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0f1e" style="width:100%;background-color:#0a0f1e;"><tr><td align="center" style="padding:20px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;"><tr><td>
    ${inner}
  </td></tr></table>
  </td></tr></table>
</body>
</html>`;
}

function statRow(label, ourCount, vercelPageviews, vercelPeople) {
  return `<tr>
    <td style="padding:6px 10px;border-bottom:1px solid #1c2842;color:#8a9ab5;">${label}</td>
    <td style="padding:6px 10px;border-bottom:1px solid #1c2842;text-align:right;">${fmt(ourCount)}</td>
    <td style="padding:6px 10px;border-bottom:1px solid #1c2842;text-align:right;">${fmt(vercelPageviews)}</td>
    <td style="padding:6px 10px;border-bottom:1px solid #1c2842;text-align:right;color:#5fd3a0;">${fmt(vercelPeople)}</td>
  </tr>`;
}

function topPagesTable(title, pages) {
  if (!pages.length) return `<div style="font-size:12px;color:#8a9ab5;margin:6px 0 14px;">${title}: no data</div>`;
  const rows = pages
    .map(
      (p, i) => `<tr>
      <td style="padding:4px 8px;color:#5a6a8a;font-size:11px;">${i + 1}</td>
      <td style="padding:4px 8px;font-size:12px;">${p.path}</td>
      <td style="padding:4px 8px;text-align:right;font-size:12px;">${fmt(p.count)}</td>
    </tr>`
    )
    .join('');
  return `<div style="font-size:12px;color:#8a9ab5;margin:14px 0 4px;">${title}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">${rows}</table>`;
}

async function buildSiteSection(site) {
  const own = await getOwnPeriodStats(site.ns);
  const { yesterday, thisMonday, thisMonth, now } = own.periodBounds;
  const yesterdayEnd = new Date(yesterday);
  yesterdayEnd.setUTCDate(yesterdayEnd.getUTCDate() + 1);

  const [vYesterday, vWeek, vMonth, vTop30d] = await Promise.all([
    getVercelTotals(site.projectId, yesterday, yesterdayEnd),
    getVercelTotals(site.projectId, thisMonday, now),
    getVercelTotals(site.projectId, thisMonth, now),
    getVercelTopPages(site.projectId, new Date(now.getTime() - 30 * 86400000), now, 10),
  ]);

  const weeksRows = own.lastFourWeeks
    .map((w, i) => {
      // We don't have per-week Vercel totals cheaply without 4 more round
      // trips per site — shown for our own counter only, labeled as such.
      return `<tr>
        <td style="padding:4px 10px;color:#8a9ab5;font-size:12px;">${w.label}</td>
        <td style="padding:4px 10px;text-align:right;font-size:12px;">${fmt(w.count)}</td>
      </tr>`;
    })
    .join('');

  return `
  <div style="background:#0f1830;border:1px solid #1c2842;border-radius:12px;padding:18px 18px 8px;margin-bottom:18px;">
    <div style="font-size:16px;font-weight:bold;margin-bottom:2px;">${site.name}</div>
    <div style="font-size:11px;color:#5a6a8a;margin-bottom:12px;"><a href="${site.url}" style="color:#5a6a8a;text-decoration:none;">${site.url.replace(/^https?:\/\//, '')}</a></div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
      <tr>
        <td style="padding:6px 10px;font-size:11px;color:#5a6a8a;">Period</td>
        <td style="padding:6px 10px;font-size:11px;color:#5a6a8a;text-align:right;">Our counter</td>
        <td style="padding:6px 10px;font-size:11px;color:#5a6a8a;text-align:right;">Vercel pageviews</td>
        <td style="padding:6px 10px;font-size:11px;color:#5a6a8a;text-align:right;">Vercel people</td>
      </tr>
      ${statRow(`Yesterday (${yesterday.toISOString().slice(0, 10)})`, own.yesterday.count, vYesterday.pageviews, vYesterday.people)}
      ${statRow(`This week (since ${own.weekToDate.since})`, own.weekToDate.count, vWeek.pageviews, vWeek.people)}
      ${statRow(`This month (${own.monthToDate.month})`, own.monthToDate.count, vMonth.pageviews, vMonth.people)}
    </table>
    <div style="font-size:10px;color:#3a4a62;margin:8px 10px 0;">"Our counter" = raw pageview hits, cookie-free, no bots. "Vercel people" = unique visitors — the closest true "number of people" figure, since our counter can't distinguish individuals.</div>

    <div style="font-size:12px;color:#8a9ab5;margin:16px 0 4px;">Last 4 completed weeks (our counter)</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">${weeksRows}</table>

    ${topPagesTable('Top 10 pages — our counter (all-time)', own.topPages)}
    ${topPagesTable('Top 10 pages — Vercel Analytics (last 30 days)', vTop30d)}
  </div>`;
}

export async function run() {
  if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');
  if (!process.env.VERCEL_API_TOKEN || !process.env.VERCEL_TEAM_ID) {
    throw new Error('Missing VERCEL_API_TOKEN or VERCEL_TEAM_ID');
  }

  const sections = await Promise.all(SITES.map(buildSiteSection));
  const today = new Date().toISOString().slice(0, 10);

  const html = wrapEmail(`
    <div style="font-size:20px;font-weight:bold;margin-bottom:4px;">Daily analytics — ${today}</div>
    <div style="font-size:12px;color:#5a6a8a;margin-bottom:18px;">Digital Credit Yield + Polka Dot Bike</div>
    ${sections.join('')}
  `);

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'Digital Credit Yield <contact@digitalcredityield.com>',
    to: RECIPIENT,
    subject: `Analytics report — ${today}`,
    html,
  });
  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().then(() => console.log('Sent.')).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
