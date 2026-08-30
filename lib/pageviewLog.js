import { list } from '@vercel/blob';

function decodePath(encoded) {
  if (encoded === '_home') return '/';
  return '/' + encoded.replace(/--/g, '/');
}

function ymd(d) {
  return d.toISOString().slice(0, 10);
}

/**
 * Aggregates the one-marker-blob-per-pageview log written by proxy.js into
 * day/week/month buckets and a top-pages breakdown. No database and no
 * per-visitor cookie — each blob just records that some page loaded at some
 * time. Ported from the polkadotbike site's proven pattern. list() is Blob's
 * rate-limited "Advanced Operation" tier, but this only runs when an admin
 * opens /admin/pageviews, and traffic here is modest — if that ever stops
 * being true, this should move to periodic compaction or a real counter
 * store instead of re-listing full history on every read.
 */
export async function getPageviewStats() {
  const events = [];
  let cursor;
  do {
    const page = await list({ prefix: 'pageviews/', cursor, limit: 1000 });
    for (const blob of page.blobs) {
      // pageviews/<encodedPath>/<timestamp>-<uuid>
      const parts = blob.pathname.split('/');
      if (parts.length < 3) continue;
      events.push({ date: new Date(blob.uploadedAt), path: decodePath(parts[1]) });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const daily = [];
  for (let i = 6; i >= 0; i--) {
    const start = new Date(today); start.setUTCDate(start.getUTCDate() - i);
    const end = new Date(start); end.setUTCDate(end.getUTCDate() + 1);
    daily.push({ date: ymd(start), count: events.filter((e) => e.date >= start && e.date < end).length });
  }

  const weekly = [];
  for (let i = 3; i >= 0; i--) {
    const end = new Date(today); end.setUTCDate(end.getUTCDate() - i * 7 + 1);
    const start = new Date(end); start.setUTCDate(start.getUTCDate() - 7);
    const count = events.filter((e) => e.date >= start && e.date < end).length;
    const label = `${start.toISOString().slice(5, 10)}–${new Date(end.getTime() - 86400000).toISOString().slice(5, 10)}`;
    weekly.push({ label, count });
  }

  const monthCounts = new Map();
  for (const e of events) {
    const key = e.date.toISOString().slice(0, 7);
    monthCounts.set(key, (monthCounts.get(key) || 0) + 1);
  }
  const monthly = [...monthCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  const pathCounts = new Map();
  for (const e of events) pathCounts.set(e.path, (pathCounts.get(e.path) || 0) + 1);
  const topPages = [...pathCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  return { daily, weekly, monthly, topPages, totalRecorded: events.length };
}
