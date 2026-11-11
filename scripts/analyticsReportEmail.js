// scripts/analyticsReportEmail.js
// Daily analytics email for both sites: our own cookie-free pageview counter (Redis) side by side with Cloudflare
// Web Analytics (page views + visits), plus top-10 pages (all-time, and last week from both sources).
// Cloudflare numbers need CF_API_TOKEN + CF_ACCOUNT_ID on the server and a Web Analytics site tag per site (see
// lib/cloudflareAnalytics.js); without them each card says so and still shows our own counter.
// polkadotbike's counter is a Cloudflare Worker (worker/pageviews.js in that repo) writing the same Redis keys.
// Run via: node scripts/analyticsReportEmail.js

import { Resend } from 'resend';
import { getOwnPeriodStats } from '../lib/pageviewPeriods.js';
import { cloudflareConfigured, getCloudflareTotals, getCloudflareTopPages } from '../lib/cloudflareAnalytics.js';

const RECIPIENT = 'robin.gillingham@hotmail.co.uk';

// cfSiteTag = the Cloudflare Web Analytics site tag (the token in the site's beacon snippet; public in page source).
const SITES = [
  { name: 'Digital Credit Yield', ns: 'dcy:pv', url: 'https://digitalcredityield.com', cfSiteTag: null },
  { name: 'Polka Dot Bike', ns: 'pdb:pv', url: 'https://polkadotbike.com', cfSiteTag: 'ec15959bd14441ac80d8d0593e3ba1e7' },
];

// Per-site numbers from the latest run, returned by run() so the cron endpoint can report them (handy for checking
// both counters are alive without opening the email).
let summaries = [];

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

function statRow(label, ourCount, cf) {
  const cell = 'padding:6px 10px;border-bottom:1px solid #1c2842;text-align:right;';
  return `<tr>
    <td style="padding:6px 10px;border-bottom:1px solid #1c2842;color:#8a9ab5;">${label}</td>
    <td style="${cell}">${fmt(ourCount)}</td>${cf ? `
    <td style="${cell}">${fmt(cf.pageviews)}</td>
    <td style="${cell}color:#5fd3a0;">${fmt(cf.visits)}</td>` : ''}
  </tr>`;
}

function topPagesTable(title, pages, emptyNote = 'no data') {
  if (!pages?.length) return `<div style="font-size:12px;color:#8a9ab5;margin:14px 0 4px;">${title}</div><div style="font-size:11px;color:#5a6a8a;margin:0 0 6px;">${emptyNote}</div>`;
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
  const lastWeekStart = new Date(`${own.lastWeek.start}T00:00:00Z`);
  const lastWeekEnd = new Date(thisMonday.getTime() - 86400000);

  // Cloudflare Web Analytics — never lets a failure stop the email.
  let cf = null;
  let cfNote = null;
  let cfError = null;
  if (!cloudflareConfigured()) {
    cfNote = 'Cloudflare figures appear here once CF_API_TOKEN and CF_ACCOUNT_ID are set on the server.';
  } else if (!site.cfSiteTag) {
    cfNote = "Cloudflare Web Analytics isn't set up for this site yet.";
  } else {
    try {
      const [y, w, m, lastWeekTop] = await Promise.all([
        getCloudflareTotals(site.cfSiteTag, yesterday, yesterdayEnd),
        getCloudflareTotals(site.cfSiteTag, thisMonday, now),
        getCloudflareTotals(site.cfSiteTag, thisMonth, now),
        getCloudflareTopPages(site.cfSiteTag, lastWeekStart, thisMonday, 10),
      ]);
      cf = { yesterday: y, week: w, month: m, lastWeekTop };
    } catch (err) {
      cfError = err.message;
      cfNote = 'Cloudflare data unavailable today.';
      console.error('Cloudflare analytics unavailable for', site.name, '-', err.message);
    }
  }

  summaries.push({
    site: site.name,
    latestView: own.latestView,
    yesterday: own.yesterday.count,
    weekToDate: own.weekToDate.count,
    monthToDate: own.monthToDate.count,
    totalRecorded: own.totalRecorded,
    lastWeekTopOwn: own.lastWeek.topPages.length,
    cloudflare: cf ? { yesterday: cf.yesterday, week: cf.week, month: cf.month, lastWeekTop: cf.lastWeekTop.length } : { unavailable: cfNote, error: cfError },
  });

  const weeksRows = own.lastFourWeeks
    .map((w) => `<tr>
        <td style="padding:4px 10px;color:#8a9ab5;font-size:12px;">${w.label}</td>
        <td style="padding:4px 10px;text-align:right;font-size:12px;">${fmt(w.count)}</td>
      </tr>`)
    .join('');

  const lastWeekLabel = `${own.lastWeek.start} – ${lastWeekEnd.toISOString().slice(0, 10)}`;
  const ownLastWeekNote = own.lastWeek.start <= '2026-11-09'
    ? 'Weekly page counts started on 11 Nov 2026, so this first week is partial (Wed–Sun).'
    : 'No views recorded for that week.';

  return `
  <div style="background:#0f1830;border:1px solid #1c2842;border-radius:12px;padding:18px 18px 8px;margin-bottom:18px;">
    <div style="font-size:16px;font-weight:bold;margin-bottom:2px;">${site.name}</div>
    <div style="font-size:11px;color:#5a6a8a;margin-bottom:12px;"><a href="${site.url}" style="color:#5a6a8a;text-decoration:none;">${site.url.replace(/^https?:\/\//, '')}</a></div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
      <tr>
        <td style="padding:6px 10px;font-size:11px;color:#5a6a8a;">Period</td>
        <td style="padding:6px 10px;font-size:11px;color:#5a6a8a;text-align:right;">Our counter</td>${cf ? `
        <td style="padding:6px 10px;font-size:11px;color:#5a6a8a;text-align:right;">Cloudflare views</td>
        <td style="padding:6px 10px;font-size:11px;color:#5a6a8a;text-align:right;">Cloudflare visits</td>` : ''}
      </tr>
      ${statRow(`Yesterday (${yesterday.toISOString().slice(0, 10)})`, own.yesterday.count, cf?.yesterday)}
      ${statRow(`This week (since ${own.weekToDate.since})`, own.weekToDate.count, cf?.week)}
      ${statRow(`This month (${own.monthToDate.month})`, own.monthToDate.count, cf?.month)}
    </table>
    <div style="font-size:10px;color:#3a4a62;margin:8px 10px 0;">Latest recorded view: ${own.latestView ? own.latestView.replace('T', ' ').slice(0, 16) + ' UTC' : 'none yet'}. "Our counter" = raw pageview hits, cookie-free, bots filtered.${cf ? ' Cloudflare = real browsers running its cookie-free beacon: views = page views, visits = sessions.' : ''}${cfNote ? ` ${cfNote}` : ''}</div>

    <div style="font-size:12px;color:#8a9ab5;margin:16px 0 4px;">Last 4 completed weeks (our counter)</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">${weeksRows}</table>

    ${topPagesTable('Top 10 pages — all time (our counter)', own.topPages)}
    ${topPagesTable(`Top 10 pages — last week, ${lastWeekLabel} (our counter)`, own.lastWeek.topPages, ownLastWeekNote)}
    ${cf ? topPagesTable(`Top 10 pages — last week, ${lastWeekLabel} (Cloudflare)`, cf.lastWeekTop, 'no data') : ''}
  </div>`;
}

export async function run() {
  if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');

  summaries = [];
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
  return { sites: summaries };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().then(() => console.log('Sent.')).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
