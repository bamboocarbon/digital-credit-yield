// Per-day idempotency guard for scheduled email sends.
//
// Prevents duplicate emails if a job is triggered more than once on the same
// day — e.g. a backup scheduler firing alongside the primary, a manual retry,
// or cron-job.org retrying after a slow response. A small marker blob is written
// after a successful send; subsequent runs the same UK day are skipped.
//
// Fail-open by design: if the Blob check itself errors we proceed with the send,
// because silently skipping a legitimate daily email is worse than a rare dupe.

import { put } from '@vercel/blob';
import { blobUrl } from './blobUrl.js';

function todayKey() {
  // UK calendar day, matching the Europe/London send schedule (YYYY-MM-DD).
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/London' });
}

function markerPath(job) {
  return `send-guard/${job}-${todayKey()}.txt`;
}

// Returns true if `job` has already been marked sent for today's UK date.
export async function alreadySentToday(job) {
  const path = markerPath(job);
  try {
    const res = await fetch(blobUrl(path), {
      method: 'HEAD',
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    return res.ok;
  } catch (err) {
    console.warn(`sendGuard: check failed for ${job}, proceeding with send: ${err.message}`);
    return false;
  }
}

// Records that `job` has been sent today. Best-effort — never throws.
export async function markSentToday(job) {
  try {
    await put(markerPath(job), new Date().toISOString(), {
      access: 'private', addRandomSuffix: false, allowOverwrite: true,
    });
  } catch (err) {
    console.warn(`sendGuard: failed to write marker for ${job}: ${err.message}`);
  }
}
