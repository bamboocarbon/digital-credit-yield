import { put, list } from '@vercel/blob';

const BLOB_FILENAME = 'money-flow-data.json';

// ── Seed / fallback data ────────────────────────────────────────────────────

export const SEED_STRC_WEEKLY = [
  { week: 'Jul 28', date: '2025-07-28', value: 2521, ipo: true },
  { week: 'Aug 4',  date: '2025-08-04', value: 3 },
  { week: 'Aug 11', date: '2025-08-11', value: 5 },
  { week: 'Aug 18', date: '2025-08-18', value: 8 },
  { week: 'Aug 25', date: '2025-08-25', value: 6 },
  { week: 'Sep 1',  date: '2025-09-01', value: 9 },
  { week: 'Sep 8',  date: '2025-09-08', value: 11 },
  { week: 'Sep 15', date: '2025-09-15', value: 8 },
  { week: 'Sep 22', date: '2025-09-22', value: 10 },
  { week: 'Sep 29', date: '2025-09-29', value: 8 },
  { week: 'Oct 6',  date: '2025-10-06', value: 27 },
  { week: 'Oct 13', date: '2025-10-13', value: 16 },
  { week: 'Oct 20', date: '2025-10-20', value: 12 },
  { week: 'Oct 27', date: '2025-10-27', value: 10 },
  { week: 'Nov 3',  date: '2025-11-03', value: 11 },
  { week: 'Nov 10', date: '2025-11-10', value: 13 },
  { week: 'Nov 17', date: '2025-11-17', value: 11 },
  { week: 'Nov 24', date: '2025-11-24', value: 8 },
  { week: 'Dec 1',  date: '2025-12-01', value: 10 },
  { week: 'Dec 8',  date: '2025-12-08', value: 12 },
  { week: 'Dec 15', date: '2025-12-15', value: 9 },
  { week: 'Dec 22', date: '2025-12-22', value: 7 },
  { week: 'Dec 29', date: '2025-12-29', value: 11 },
  { week: 'Jan 5',  date: '2026-01-05', value: 100 },
  { week: 'Jan 12', date: '2026-01-12', value: 150 },
  { week: 'Jan 19', date: '2026-01-19', value: 200 },
  { week: 'Jan 26', date: '2026-01-26', value: 250 },
  { week: 'Feb 2',  date: '2026-02-02', value: 150 },
  { week: 'Feb 9',  date: '2026-02-09', value: 130 },
  { week: 'Feb 16', date: '2026-02-16', value: 160 },
  { week: 'Feb 23', date: '2026-02-23', value: 200 },
  { week: 'Mar 2',  date: '2026-03-02', value: 200 },
  { week: 'Mar 9',  date: '2026-03-09', value: 1180 },
  { week: 'Mar 16', date: '2026-03-16', value: 280 },
  { week: 'Mar 23', date: '2026-03-23', value: 300 },
  { week: 'Mar 30', date: '2026-03-30', value: 200 },
  { week: 'Apr 6',  date: '2026-04-06', value: 1000 },
  { week: 'Apr 13', date: '2026-04-13', value: 300 },
  { week: 'Apr 20', date: '2026-04-20', value: 400 },
  { week: 'Apr 27', date: '2026-04-27', value: 250 },
  { week: 'May 4',  date: '2026-05-04', value: 130 },
  { week: 'May 11', date: '2026-05-11', value: 200 },
  { week: 'May 18', date: '2026-05-18', value: 400 },
  { week: 'May 25', date: '2026-05-25', value: 2000 },
];

export const SEED_SATA_WEEKLY = [
  { week: 'Nov 10', date: '2025-11-10', value: 160, ipo: true },
  { week: 'Nov 17', date: '2025-11-17', value: 6 },
  { week: 'Nov 24', date: '2025-11-24', value: 8 },
  { week: 'Dec 1',  date: '2025-12-01', value: 12 },
  { week: 'Dec 8',  date: '2025-12-08', value: 15 },
  { week: 'Dec 15', date: '2025-12-15', value: 18 },
  { week: 'Dec 22', date: '2025-12-22', value: 10 },
  { week: 'Dec 29', date: '2025-12-29', value: 14 },
  { week: 'Jan 5',  date: '2026-01-05', value: 20 },
  { week: 'Jan 12', date: '2026-01-12', value: 25 },
  { week: 'Jan 19', date: '2026-01-19', value: 28 },
  { week: 'Jan 26', date: '2026-01-26', value: 225, ipo: true },
  { week: 'Feb 2',  date: '2026-02-02', value: 35 },
  { week: 'Feb 9',  date: '2026-02-09', value: 32 },
  { week: 'Feb 16', date: '2026-02-16', value: 38 },
  { week: 'Feb 23', date: '2026-02-23', value: 42 },
  { week: 'Mar 2',  date: '2026-03-02', value: 45 },
  { week: 'Mar 9',  date: '2026-03-09', value: 18 },
  { week: 'Mar 16', date: '2026-03-16', value: 50 },
  { week: 'Mar 23', date: '2026-03-23', value: 55 },
  { week: 'Mar 30', date: '2026-03-30', value: 48 },
  { week: 'Apr 6',  date: '2026-04-06', value: 60 },
  { week: 'Apr 13', date: '2026-04-13', value: 65 },
  { week: 'Apr 20', date: '2026-04-20', value: 70 },
  { week: 'Apr 27', date: '2026-04-27', value: 75 },
  { week: 'May 4',  date: '2026-05-04', value: 37 },
  { week: 'May 11', date: '2026-05-11', value: 46 },
  { week: 'May 18', date: '2026-05-18', value: 50 },
  { week: 'May 25', date: '2026-05-25', value: 79 },
];

export const SEED_BMNP_WEEKLY = [];

export const SEED_CUMULATIVE = [
  { period: 'Jul 25',  strc: 2521,  sata: null },
  { period: 'Aug 25',  strc: 2543,  sata: null },
  { period: 'Sep 25',  strc: 2589,  sata: null },
  { period: 'Oct 25',  strc: 2654,  sata: null },
  { period: 'Nov 25',  strc: 2697,  sata: 174 },
  { period: 'Dec 25',  strc: 2746,  sata: 243 },
  { period: 'Jan 26',  strc: 3446,  sata: 541 },
  { period: 'Feb 26',  strc: 4086,  sata: 688 },
  { period: 'Mar wk1', strc: 4286,  sata: 733 },
  { period: 'Mar wk2', strc: 5466,  sata: 751 },
  { period: 'Mar wk3', strc: 6046,  sata: 856 },
  { period: 'Apr wk1', strc: 7246,  sata: 964 },
  { period: 'Apr wk2', strc: 7546,  sata: 1029 },
  { period: 'Apr wk3', strc: 7946,  sata: 1099 },
  { period: 'Apr wk4', strc: 8196,  sata: 1174 },
  { period: 'May wk1', strc: 8326,  sata: 1211 },
  { period: 'May wk2', strc: 8526,  sata: 1257 },
  { period: 'May wk3', strc: 8926,  sata: 1307 },
  { period: 'May wk4', strc: 10926, sata: 1386 },
];

// ── Blob helpers ────────────────────────────────────────────────────────────

export async function getMoneyFlowData() {
  try {
    const { blobs } = await list({ prefix: BLOB_FILENAME });
    if (!blobs.length) return null;
    const res = await fetch(blobs[0].downloadUrl, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveMoneyFlowData({ strcWeekly, sataWeekly, bmnpWeekly, cumulative }) {
  const payload = JSON.stringify({
    strcWeekly,
    sataWeekly,
    bmnpWeekly: bmnpWeekly ?? [],
    cumulative,
    lastUpdated: new Date().toISOString(),
  });
  await put(BLOB_FILENAME, payload, {
    access: 'private',
    contentType: 'application/json',
    allowOverwrite: true,
  });
}

// ── Utilities ───────────────────────────────────────────────────────────────

export function buildCumulative(strcWeekly, sataWeekly, bmnpWeekly = []) {
  const strcByDate = Object.fromEntries(strcWeekly.map(d => [d.date, d.value]));
  const sataByDate = Object.fromEntries(sataWeekly.map(d => [d.date, d.value]));
  const bmnpByDate = Object.fromEntries(bmnpWeekly.map(d => [d.date, d.value]));

  const allDates = [...new Set([
    ...strcWeekly.map(d => d.date),
    ...sataWeekly.map(d => d.date),
    ...bmnpWeekly.map(d => d.date),
  ])].sort();

  let strcTotal = 0;
  let sataTotal = 0;
  let bmnpTotal = 0;
  const result = [];

  for (const date of allDates) {
    if (strcByDate[date]) strcTotal += strcByDate[date];
    if (sataByDate[date]) sataTotal += sataByDate[date];
    if (bmnpByDate[date]) bmnpTotal += bmnpByDate[date];

    const d = new Date(date + 'T12:00:00Z');
    const mon = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
    const day = d.getUTCDate();
    const yr  = String(d.getUTCFullYear()).slice(2);

    result.push({
      period: `${mon} ${day} '${yr}`,
      strc:   strcTotal > 0 ? Math.round(strcTotal) : null,
      sata:   sataTotal > 0 ? Math.round(sataTotal) : null,
      bmnp:   bmnpTotal > 0 ? Math.round(bmnpTotal) : null,
    });
  }

  return result;
}
