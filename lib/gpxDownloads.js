import { redis } from './redisClient.js';

// Reads polkadotbike's GPX download counter (written by worker/gpx.js in that repo, same Upstash Redis, `pdb:gpx`
// namespace): per-day hashes slug→count (70-day TTL), an all-time slug hash, a total and the date counting began.
// Used by the daily analytics report. Returns null if nothing has ever been recorded.

const NS = 'pdb:gpx';

function ymd(d) {
  return d.toISOString().slice(0, 10);
}

function mondayOnOrBefore(d) {
  const out = new Date(d);
  out.setUTCHours(0, 0, 0, 0);
  out.setUTCDate(out.getUTCDate() - ((out.getUTCDay() + 6) % 7));
  return out;
}

const sum = (h) => Object.values(h || {}).reduce((t, n) => t + (Number(n) || 0), 0);

function topOf(counts, n = 10) {
  return Object.entries(counts)
    .map(([slug, count]) => ({ path: slug, count: Number(count) }))
    .sort((a, b) => b.count - a.count || a.path.localeCompare(b.path))
    .slice(0, n);
}

export async function getGpxDownloadStats() {
  const [totalRaw, since] = await Promise.all([redis.get(`${NS}:total`), redis.get(`${NS}:since`)]);
  const total = Number(totalRaw) || 0;
  if (!total && !since) return null;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  // Last 30 days of day-hashes (today first) — covers yesterday, week-to-date, month-to-date and the 30-day top list.
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    return d;
  });
  const hashes = await Promise.all(days.map((d) => redis.hgetall(`${NS}:day:${ymd(d)}`)));
  const byDay = new Map(days.map((d, i) => [ymd(d), hashes[i] || {}]));

  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const monday = mondayOnOrBefore(today);
  const monthStart = ymd(today).slice(0, 7);

  let weekToDate = 0;
  let monthToDate = 0;
  const last30 = {};
  for (const [day, h] of byDay) {
    const n = sum(h);
    if (new Date(`${day}T00:00:00Z`) >= monday) weekToDate += n;
    if (day.startsWith(monthStart)) monthToDate += n;
    for (const [slug, c] of Object.entries(h)) last30[slug] = (last30[slug] || 0) + (Number(c) || 0);
  }

  const allTime = (await redis.hgetall(`${NS}:slugs`)) || {};
  return {
    since: since || null,
    total,
    yesterday: { date: ymd(yesterday), count: sum(byDay.get(ymd(yesterday))) },
    weekToDate: { since: ymd(monday), count: weekToDate },
    monthToDate: { month: monthStart, count: monthToDate },
    topLast30: topOf(last30),
    topAllTime: topOf(allTime),
  };
}
