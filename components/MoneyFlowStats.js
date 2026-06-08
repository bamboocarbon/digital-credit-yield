'use client';

import { useEffect, useState } from 'react';

function fmt(v) {
  if (v >= 1000) return `$${(v / 1000).toFixed(2)}B`;
  return `$${v}M`;
}

export default function MoneyFlowStats() {
  const [lastStrc, setLastStrc] = useState(null);
  const [lastSata, setLastSata] = useState(null);
  const [lastBmnp, setLastBmnp] = useState(null);

  useEffect(() => {
    fetch('/api/money-flow-data')
      .then(r => r.json())
      .then(d => {
        const strc = d?.strcWeekly;
        const sata = d?.sataWeekly;
        const bmnp = d?.bmnpWeekly;
        if (strc?.length) setLastStrc(strc[strc.length - 1]);
        if (sata?.length) setLastSata(sata[sata.length - 1]);
        if (bmnp?.length) setLastBmnp(bmnp[bmnp.length - 1]);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '1px solid rgba(21,128,61,0.3)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#15803d' }}>STRC Total Raised</p>
        <p className="text-3xl font-bold">~$10.9B</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Jul 2025 – May 2026</p>
        {lastStrc && (
          <p className="text-xs mt-2 font-medium" style={{ color: '#15803d' }}>
            Latest: {lastStrc.week} &middot; {fmt(lastStrc.value)}
          </p>
        )}
      </div>
      <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '1px solid rgba(37,99,235,0.3)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#2563eb' }}>SATA Total Raised</p>
        <p className="text-3xl font-bold">~$1.4B</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Nov 2025 – May 2026</p>
        {lastSata && (
          <p className="text-xs mt-2 font-medium" style={{ color: '#2563eb' }}>
            Latest: {lastSata.week} &middot; {fmt(lastSata.value)}
          </p>
        )}
      </div>
      <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '1px solid rgba(253,224,71,0.3)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#fde047' }}>BMNP Total Raised</p>
        {lastBmnp ? (
          <>
            <p className="text-3xl font-bold">{fmt(lastBmnp.value)}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Jun 2026 – present</p>
            <p className="text-xs mt-2 font-medium" style={{ color: '#fde047' }}>
              Latest: {lastBmnp.week} &middot; {fmt(lastBmnp.value)}
            </p>
          </>
        ) : (
          <>
            <p className="text-3xl font-bold">—</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>IPO expected late June 2026</p>
          </>
        )}
      </div>
    </div>
  );
}
