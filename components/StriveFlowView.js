'use client';

import { useEffect, useMemo, useState } from 'react';
import { FlowLegend, FlowStackedChart, fmtMoney as fmt, monthYear } from '@/components/FlowChartParts';

// Strive's two preferreds on one weekly axis, same style as the Strategy view. SATA has been raising
// since Nov 2025; SATS priced its IPO on 15 Oct 2026 and has raised through `satsWeekly` (same row shape as
// sataWeekly) since.
const COLOURS = { SATA: '#3b82f6', SATS: '#38bdf8' };
// Buybacks (sataBuybacks / satsBuybacks from the API, kept in lib/moneyFlowStore.js) stack below zero in red,
// like STRC's in the Strategy view. A buyback button only appears once that product has a buyback.
const BUYBACK_COLOURS = { SATA: '#ef4444', SATS: '#f87171' };
function seriesFor(bbSata, bbSats) {
  return [
    { key: 'SATA', label: 'SATA', colour: COLOURS.SATA, value: r => r.SATA ?? 0 },
    { key: 'SATS', label: 'SATS', colour: COLOURS.SATS, value: r => r.SATS ?? 0 },
    ...(bbSata.length ? [{ key: 'BB_SATA', label: 'SATA buybacks', colour: BUYBACK_COLOURS.SATA, value: r => -(r.BB_SATA ?? 0) }] : []),
    ...(bbSats.length ? [{ key: 'BB_SATS', label: 'SATS buybacks', colour: BUYBACK_COLOURS.SATS, value: r => -(r.BB_SATS ?? 0) }] : []),
  ];
}

function mergeRows(sata, sats, bbSata = [], bbSats = []) {
  const by = new Map();
  const add = (rows, key) => { for (const r of rows) by.set(r.date, { ...(by.get(r.date) ?? { date: r.date }), [key]: (by.get(r.date)?.[key] ?? 0) + r.value }); };
  add(sata, 'SATA');
  add(sats, 'SATS');
  add(bbSata, 'BB_SATA');
  add(bbSats, 'BB_SATS');
  return [...by.values()].sort((a, b) => a.date.localeCompare(b.date));
}
const sumOf = rows => rows.reduce((n, r) => n + r.value, 0);

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
  const [bbSata, setBbSata] = useState([]);
  const [bbSats, setBbSats] = useState([]);
  const [range, setRange] = useState('all');
  const [off, setOff] = useState(() => new Set());
  const toggle = k => setOff(prev => { const n = new Set(prev); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  useEffect(() => {
    fetch('/api/money-flow-data')
      .then(r => r.json())
      .then(d => { setSata(d?.sataWeekly ?? []); setSats(d?.satsWeekly ?? []); setBbSata(d?.sataBuybacks ?? []); setBbSats(d?.satsBuybacks ?? []); })
      .catch(() => {});
  }, []);

  const rows = useMemo(() => mergeRows(sata ?? [], sats, bbSata, bbSats), [sata, sats, bbSata, bbSats]);
  const series = useMemo(() => seriesFor(bbSata, bbSats), [bbSata, bbSats]);
  const a = totalsOf(sata ?? []);
  const s = totalsOf(sats);
  const bbA = sumOf(bbSata);
  const bbS = sumOf(bbSats);
  const anyBb = bbA > 0 || bbS > 0;
  const bbCell = v => (v ? `−${fmt(v)}` : '—');
  const th = 'text-right font-medium px-3 py-2 whitespace-nowrap';
  const td = 'text-right px-3 py-2 whitespace-nowrap';

  return (
    <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold text-lg" style={{ color: COLOURS.SATA }}>Strive</span>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>SATA and SATS</span>
      </div>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        Weekly capital raised by Strive&apos;s preferreds, from its 8-K filings. SATS priced its IPO on 15 October 2026 and has a $1bn ATM programme.
        {' '}{anyBb ? 'Red bars below zero are buybacks. ' : ''}Click a ticker to hide or show it.
      </p>

      <FlowLegend series={series} off={off} toggle={toggle} range={range} setRange={setRange} />
      {rows.length ? (
        <FlowStackedChart rows={rows} series={series} off={off} range={range}
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
              {anyBb && <th className={th}>Buybacks</th>}
              <th className={th}>{anyBb ? 'Net total' : 'Total raised'}</th>
              <th className={th}>Last ATM sale</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td className="text-left px-3 py-2 font-bold">SATA</td>
              <td className={td} style={{ color: 'var(--text-muted)' }}>13.00%</td>
              <td className={td}>{a.offerings ? fmt(a.offerings) : '—'} {a.first && <span style={{ color: 'var(--text-muted)' }}>· {monthYear(a.first)}</span>}</td>
              <td className={td}>{a.atm ? fmt(a.atm) : '—'}</td>
              {anyBb && <td className={td}>{bbCell(bbA)}</td>}
              <td className={`${td} font-semibold`}>{a.total - bbA ? fmt(a.total - bbA) : '—'}</td>
              <td className={td} style={{ color: 'var(--text-muted)' }}>{monthYear(a.lastAtm)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td className="text-left px-3 py-2 font-bold">SATS</td>
              <td className={td} style={{ color: 'var(--text-muted)' }}>15.00%</td>
              <td className={td}>{s.offerings ? fmt(s.offerings) : '—'}</td>
              <td className={td}>{s.atm ? fmt(s.atm) : '—'}</td>
              {anyBb && <td className={td}>{bbCell(bbS)}</td>}
              <td className={`${td} font-semibold`}>{s.total - bbS ? fmt(s.total - bbS) : '—'}</td>
              <td className={td} style={{ color: 'var(--text-muted)' }}>{monthYear(s.lastAtm)}</td>
            </tr>
            <tr>
              <td className="text-left px-3 py-2 font-bold">Total</td>
              <td className={td} />
              <td className={td}>{fmt(a.offerings + s.offerings)}</td>
              <td className={td}>{fmt(a.atm + s.atm)}</td>
              {anyBb && <td className={td}>{bbCell(bbA + bbS)}</td>}
              <td className={`${td} font-bold`}>{fmt(a.total + s.total - bbA - bbS)}</td>
              <td className={td} />
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
        SATA&apos;s IPO was $160M in November 2025 and a $118.8M follow-on in January 2026; the rest is its ATM programme. SATS is junior to SATA and
        pays 15%: its IPO was 7,000,000 shares at $90 ($630M gross, $608M net of fees; settled 20 October 2026). Its $1bn ATM programme was filed on 26 October. Figures are net.
      </p>
    </div>
  );
}
