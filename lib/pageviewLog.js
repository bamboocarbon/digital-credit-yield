import { redis } from './redisClient.js';

// Namespaced because this Redis instance is shared with polkadotbike (single
// free-tier Upstash database — Marketplace only grants one free DB per
// account, see project_pageview_counter_pattern memory 2026-09-02).
const NS = 'dcy:pv';

function decodePath(encoded) {
  if (encoded === '_home') return '/';
  return '/' + encoded.replace(/--/g, '/');
}

function ymd(d) {
  return d.toISOString().slice(0, 10);
}

/**
 * Reads the day/month/path/total counters proxy.js increments on every real
 * pageview. Replaces the original list()-over-full-history design (one Blob
 * "Advanced Operation" per write AND per read) — that put both sites over
 * Vercel Blob's 2,000/month Hobby cap within ~3 days at normal traffic
 * (~400 combined real pageviews/day). Counters cost a handful of Redis
 * commands per event, comfortably inside Upstash's 500K/month free tier.
 */
export async function getPageviewStats() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // 28 days covers both the 7-day "daily" view and the 4-week "weekly"
  // view — fetch them all in one round trip and derive both from it.
  const dayDates = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    dayDates.push(d);
  }
  const dayKeys = dayDates.map((d) => `${NS}:day:${ymd(d)}`);
  const dayCountsRaw = await redis.mget(...dayKeys);
  const dayCounts = new Map(dayDates.map((d, i) => [ymd(d), Number(dayCountsRaw[i]) || 0]));

  const daily = dayDates.slice(-7).map((d) => ({ date: ymd(d), count: dayCounts.get(ymd(d)) || 0 }));

  const weekly = [];
  for (let i = 3; i >= 0; i--) {
    const end = new Date(today);
    end.setUTCDate(end.getUTCDate() - i * 7 + 1);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 7);
    let count = 0;
    for (const d of dayDates) {
      if (d >= start && d < end) count += dayCounts.get(ymd(d)) || 0;
    }
    const label = `${start.toISOString().slice(5, 10)}–${new Date(end.getTime() - 86400000).toISOString().slice(5, 10)}`;
    weekly.push({ label, count });
  }

  const months = await redis.smembers(`${NS}:months`);
  let monthly = [];
  if (months.length) {
    const monthKeys = months.map((m) => `${NS}:month:${m}`);
    const monthCountsRaw = await redis.mget(...monthKeys);
    monthly = months
      .map((month, i) => ({ month, count: Number(monthCountsRaw[i]) || 0 }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  const pathCounts = (await redis.hgetall(`${NS}:paths`)) || {};
  const topPages = Object.entries(pathCounts)
    .map(([path, count]) => ({ path: decodePath(path), count: Number(count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const totalRecorded = Number(await redis.get(`${NS}:total`)) || 0;

  return { daily, weekly, monthly, topPages, totalRecorded };
}
