import { redis } from './redisClient.js';

// Reads our own cookie-free pageview counters for explicit calendar periods
// (yesterday / week-to-date / last 4 completed weeks / month-to-date). Both
// digital-credit-yield and polkadotbike write into the SAME Upstash Redis
// instance under 'dcy:pv' / 'pdb:pv' namespaces (single free-tier DB, see
// project_pageview_counter_pattern memory) — so this can read either site's
// counters directly, no cross-site HTTP call needed.

function ymd(d) {
  return d.toISOString().slice(0, 10);
}

function decodePath(encoded) {
  if (encoded === '_home') return '/';
  return '/' + encoded.replace(/--/g, '/');
}

// Most recent Monday 00:00 UTC on/before `d`.
function mondayOnOrBefore(d) {
  const out = new Date(d);
  out.setUTCHours(0, 0, 0, 0);
  const dow = out.getUTCDay(); // 0=Sun..6=Sat
  const back = dow === 0 ? 6 : dow - 1;
  out.setUTCDate(out.getUTCDate() - back);
  return out;
}

/**
 * @param {string} ns 'dcy:pv' or 'pdb:pv'
 */
export async function getOwnPeriodStats(ns) {
  const now = new Date();
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  const thisMonday = mondayOnOrBefore(today);

  // Last 4 *completed* Mon-Sun weeks, most recent first not included in
  // "this week" below — i.e. weeks strictly before thisMonday.
  const weeks = [];
  for (let i = 1; i <= 4; i++) {
    const end = new Date(thisMonday);
    end.setUTCDate(end.getUTCDate() - (i - 1) * 7);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 7);
    weeks.push({ start, end });
  }

  const earliestNeeded = weeks[weeks.length - 1].start;
  const dayDates = [];
  for (let d = new Date(earliestNeeded); d < now; d.setUTCDate(d.getUTCDate() + 1)) {
    dayDates.push(new Date(d));
  }
  // include today so week-to-date/month-to-date totals are complete
  if (!dayDates.length || ymd(dayDates[dayDates.length - 1]) !== ymd(today)) dayDates.push(new Date(today));

  const dayKeys = dayDates.map((d) => `${ns}:day:${ymd(d)}`);
  const dayCountsRaw = await redis.mget(...dayKeys);
  const dayCounts = new Map(dayDates.map((d, i) => [ymd(d), Number(dayCountsRaw[i]) || 0]));

  const sumRange = (start, end) => {
    let total = 0;
    for (const d of dayDates) if (d >= start && d < end) total += dayCounts.get(ymd(d)) || 0;
    return total;
  };

  const yesterdayCount = dayCounts.get(ymd(yesterday)) || 0;
  const weekToDateCount = sumRange(thisMonday, new Date(now));
  const lastFourWeeks = weeks.map(({ start, end }) => ({
    label: `${start.toISOString().slice(5, 10)}–${new Date(end.getTime() - 86400000).toISOString().slice(5, 10)}`,
    count: sumRange(start, end),
  }));

  const thisMonthKey = ymd(today).slice(0, 7);
  const monthToDateCount = Number(await redis.get(`${ns}:month:${thisMonthKey}`)) || 0;

  const pathCounts = (await redis.hgetall(`${ns}:paths`)) || {};
  const topPages = Object.entries(pathCounts)
    .map(([path, count]) => ({ path: decodePath(path), count: Number(count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const totalRecorded = Number(await redis.get(`${ns}:total`)) || 0;

  return {
    yesterday: { date: ymd(yesterday), count: yesterdayCount },
    weekToDate: { since: ymd(thisMonday), count: weekToDateCount },
    lastFourWeeks,
    monthToDate: { month: thisMonthKey, count: monthToDateCount },
    topPages,
    totalRecorded,
    periodBounds: { yesterday, thisMonday, thisMonth: new Date(`${thisMonthKey}-01T00:00:00.000Z`), now },
  };
}
