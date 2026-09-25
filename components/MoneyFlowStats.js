'use client';

import { useEffect, useState } from 'react';
import { BMNP_ENABLED } from '@/lib/constants';

function fmt(v) {
  if (v >= 1000) return `$${(v / 1000).toFixed(2)}B`;
  return `$${v}M`;
}

// month from a 'YYYY-MM-DD' string, e.g. '2025-07-28' -> 'Jul 2025' — avoids
// a Date() parse (its local-timezone rounding can shift a date-only string
// onto the wrong day/month near midnight UTC).
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function monthYear(dateStr) {
  const [y, m] = dateStr.split('-');
  return `${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

// Both the headline total and the "Jul 2025 – present" range used to be
// hardcoded strings, frozen at whatever was true in May 2026 when this
// component was last hand-edited — found 2026-09-08 (Robin) still showing
// stale STRC/SATA totals days after the underlying weekly data had moved on.
// Derives both from the full weekly array instead, so they can't drift again.
function deriveStats(weekly) {
  if (!weekly?.length) return null;
  return {
    total: weekly.reduce((sum, w) => sum + w.value, 0),
    latest: weekly[weekly.length - 1],
    rangeStart: monthYear(weekly[0].date),
  };
}

export default function MoneyFlowStats() {
  const [strcStats, setStrcStats] = useState(null);
  const [sataStats, setSataStats] = useState(null);
  const [bmnpStats, setBmnpStats] = useState(null);
  const [chadStats, setChadStats] = useState(null);

  useEffect(() => {
    fetch('/api/money-flow-data')
      .then(r => r.json())
      .then(d => {
        setStrcStats(deriveStats(d?.strcWeekly));
        setSataStats(deriveStats(d?.sataWeekly));
        setBmnpStats(deriveStats(d?.bmnpWeekly));
        setChadStats(deriveStats(d?.chadWeekly));
      })
      .catch(() => {});
  }, []);

  return (
    <div className={`grid grid-cols-1 gap-4 mb-6 ${BMNP_ENABLED ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
      <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#4ade80' }}>STRC Total Raised</p>
        <p className="text-3xl font-bold">{strcStats ? `~${fmt(strcStats.total)}` : '—'}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{strcStats ? `${strcStats.rangeStart} – present` : ' '}</p>
        {strcStats && (
          <p className="text-xs mt-2 font-medium" style={{ color: '#4ade80' }}>
            Latest: {strcStats.latest.week} &middot; {fmt(strcStats.latest.value)}
          </p>
        )}
      </div>
      <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#3b82f6' }}>SATA Total Raised</p>
        <p className="text-3xl font-bold">{sataStats ? `~${fmt(sataStats.total)}` : '—'}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{sataStats ? `${sataStats.rangeStart} – present` : ' '}</p>
        {sataStats && (
          <p className="text-xs mt-2 font-medium" style={{ color: '#3b82f6' }}>
            Latest: {sataStats.latest.week} &middot; {fmt(sataStats.latest.value)}
          </p>
        )}
      </div>
      {BMNP_ENABLED && (
        <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#fde047' }}>BMNP Total Raised</p>
          {bmnpStats ? (
            <>
              <p className="text-3xl font-bold">{fmt(bmnpStats.total)}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{bmnpStats.rangeStart} – present</p>
              <p className="text-xs mt-2 font-medium" style={{ color: '#fde047' }}>
                Latest: {bmnpStats.latest.week} &middot; {fmt(bmnpStats.latest.value)}
              </p>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold">—</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Listed Jun 16, 2026 — capital flow data pending</p>
            </>
          )}
        </div>
      )}
      <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#b91c1c' }}>CHAD Total Raised</p>
        {chadStats ? (
          <>
            <p className="text-3xl font-bold">{fmt(chadStats.total)}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{chadStats.rangeStart} – present</p>
            <p className="text-xs mt-2 font-medium" style={{ color: '#b91c1c' }}>
              Latest: {chadStats.latest.week} &middot; {fmt(chadStats.latest.value)}
            </p>
          </>
        ) : (
          <>
            <p className="text-3xl font-bold">—</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Listed Sep 8, 2026 — capital flow data pending</p>
          </>
        )}
      </div>
    </div>
  );
}
