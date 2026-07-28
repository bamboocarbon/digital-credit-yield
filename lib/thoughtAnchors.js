// Deterministic per-entry anchor ids for the Thought of the Day archive
// (/thought-of-the-day#2026-07-21). Most dates have exactly one entry, so the
// anchor is just the ISO date; on the rare day with more than one entry the
// extras get a "-2", "-3", ... suffix. Always sorts internally (newest-first,
// same order as the archive itself) so the mapping is identical no matter
// what order the caller's own items happen to be in.
export function computeAnchors(items) {
  const sorted = [...items].sort((a, b) =>
    b.date.localeCompare(a.date) || String(b.id).localeCompare(String(a.id))
  );
  const dateCounts = new Map();
  const anchors = new Map(); // item.id -> anchor string
  for (const item of sorted) {
    const n = (dateCounts.get(item.date) || 0) + 1;
    dateCounts.set(item.date, n);
    anchors.set(item.id, n === 1 ? item.date : `${item.date}-${n}`);
  }
  return anchors;
}
