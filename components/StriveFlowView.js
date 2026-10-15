'use client';

import { useEffect, useMemo, useState } from 'react';
import { FlowLegend, FlowStackedChart, fmtMoney as fmt, monthYear } from '@/components/FlowChartParts';

// Strive's two preferreds on one weekly axis, same style as the Strategy view. SATA has been raising
// since Nov 2025; SATS was only proposed on 13 Oct 2026 and isn't priced yet, so its series is empty
// until `satsWeekly` (same row shape as sataWeekly) starts to fill.
const COLOURS = { SATA: '#3b82f6', SATS: '#38bdf8' };
const SERIES = [
  { key: 'SATA', label: 'SATA', colour: COLOURS.SATA, value: r => r.SATA ?? 0 },
  { key: 'SATS', label: 'SATS', colour: COLOURS.SATS, value: r => r.SATS ?? 0 },
];

function mergeRows(sata, sats) {
  const by = new Map();
  for (const r of sata) by.set(r.date, { date: r.date, SATA: r.value });
  for (const r of sats) by.set(r.date, { ...(by.get(r.date) ?? { date: r.date }), SATS: r.value });
  return [...by.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function totalsOf(weekly) {
  let offerings = 0, atm = 0, last = null, lastAtm = null;
  for (const r of weekly) {
    if (!(r.value > 0)) continue;
    if (r.ipo) offerings += r.value; else { atm += r.value; lastAtm = r.date; }
    last = r.date;
  }
  return { offerings, atm, total: offerings + atm, first: weekly[0]?.date ?? null, lastAtm };
}

export default function StriveFlowView() {
  const [sata, setSata] = useState(null);
  const [sats, setSats] = useState([]);
  const [range, setRange] = useState('all');
  const [off, setOff] = useState(() => new Set());
  const toggle = k => setOff(prev => { const n = new Set(prev); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  useEffect(() => {
    fetch('/api/money-flow-data')
      .then(r => r.json())
      .then(d => { setSata(d?.sataWeekly ?? []); setSats(d?.satsWeekly ?? []); })
      .catch(() => {});
  }, []);

  const rows = useMemo(() => mergeRows(sata ?? [], sats), [sata, sats]);
  const a = totalsOf(sata ?? []);
  const s = totalsOf(sats);
  const th = 'text-right font-medium px-3 py-2 whitespace-nowrap';
  const td = 'text-right px-3 py-2 whitespace-nowrap';

  return (
    <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold text-lg" style={{ color: COLOURS.SATA }}>Strive</span>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>SATA and SATS</span>
      </div>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        Weekly capital raised by Strive&apos;s preferreds, from its 8-K filings. SATS was proposed on 13 October 2026 and isn&apos;t priced yet, so it has no bars until it raises.
        Click a ticker to hide or show it.
      </p>

      <FlowLegend series={SERIES} off={off} toggle={toggle} range={range} setRange={setRange} />
      {rows.length ? (
        <FlowStackedChart rows={rows} series={SERIES} off={off} range={range}
          ariaLabel="Strive weekly capital raised by product, SATA and SATS, stacked" />
      ) : (
        <div style={{ height: 240 }} />
      )}

      <div className="overflow-x-auto mt-5">
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
              <th className="text-left font-medium px-3 py-2">Product</th>
              <th className={th}>Rate</th>
              <th className={th}>IPO &amp; follow-on</th>
              <th className={th}>ATM raised</th>
              <th className={th}>Total raised</th>
              <th className={th}>Last ATM sale</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td className="text-left px-3 py-2 font-bold">SATA</td>
              <td className={td} style={{ color: 'var(--text-muted)' }}>13.00%</td>
              <td className={td}>{a.offerings ? fmt(a.offerings) : '—'} {a.first && <span style={{ color: 'var(--text-muted)' }}>· {monthYear(a.first)}</span>}</td>
              <td className={td}>{a.atm ? fmt(a.atm) : '—'}</td>
              <td className={`${td} font-semibold`}>{a.total ? fmt(a.total) : '—'}</td>
              <td className={td} style={{ color: 'var(--text-muted)' }}>{monthYear(a.lastAtm)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td className="text-left px-3 py-2 font-bold">SATS</td>
              <td className={td} style={{ color: 'var(--text-muted)' }}>15.00%</td>
              <td className={td}>{s.offerings ? fmt(s.offerings) : <span style={{ color: 'var(--text-muted)' }}>$500M proposed</span>}</td>
              <td className={td}>{s.atm ? fmt(s.atm) : '—'}</td>
              <td className={`${td} font-semibold`}>{s.total ? fmt(s.total) : '—'}</td>
              <td className={td} style={{ color: 'var(--text-muted)' }}>{monthYear(s.lastAtm)}</td>
            </tr>
            <tr>
              <td className="text-left px-3 py-2 font-bold">Total</td>
              <td className={td} />
              <td className={td}>{fmt(a.offerings + s.offerings)}</td>
              <td className={td}>{fmt(a.atm + s.atm)}</td>
              <td className={`${td} font-bold`}>{fmt(a.total + s.total)}</td>
              <td className={td} />
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
        SATA&apos;s IPO was $160M in November 2025 and a $118.8M follow-on in January 2026; the rest is its ATM programme. SATS is junior to SATA and
        pays 15% daily; its $500M is the announced IPO size, not money raised.
      </p>
    </div>
  );
}
