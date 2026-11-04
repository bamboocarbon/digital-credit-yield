'use client';

import { useEffect, useState } from 'react';
import { monthYear } from '@/components/FlowChartParts';

// Product / rate / IPO / ATM summary under a single-product bar chart (BMNP, CHAD, MORE) — the same columns as
// the Strive table. Reads the same weekly rows as the chart: rows flagged `ipo` are the IPO and follow-ons, the
// rest count as ATM. Starts with just the IPO; the ATM column fills in as sales appear in the weekly data.
function fmt(v, unit) {
  if (v >= 1000) return `${unit}${(v / 1000).toFixed(2)}B`;
  if (v >= 10) return `${unit}${Math.round(v)}M`;
  if (v >= 1) return `${unit}${v.toFixed(1)}M`;
  return `${unit}${Math.round(v * 1000)}k`; // a first few ATM sales can be well under £1M
}

function totalsOf(weekly) {
  let offerings = 0, atm = 0, lastAtm = null;
  for (const r of weekly) {
    if (!(r.value > 0)) continue;
    if (r.ipo) offerings += r.value; else { atm += r.value; lastAtm = r.date; }
  }
  return { offerings, atm, total: offerings + atm, first: weekly[0]?.date ?? null, lastAtm };
}

export default function IssuerFlowTable({ ticker, dataKey, rate, unit = '$', buybackKey }) {
  const [weekly, setWeekly] = useState(null);
  const [buybacks, setBuybacks] = useState(null);
  useEffect(() => {
    fetch('/api/money-flow-data').then(r => r.json()).then(d => {
      setWeekly(d?.[dataKey] ?? []);
      setBuybacks(buybackKey ? (d?.[buybackKey] ?? []) : []);
    }).catch(() => {});
  }, [dataKey, buybackKey]);

  const t = totalsOf(weekly ?? []);
  const buyback = (buybacks ?? []).reduce((sum, r) => sum + r.value, 0);
  const netTotal = t.total - buyback;
  const th = 'text-right font-medium px-3 py-2 whitespace-nowrap';
  const td = 'text-right px-3 py-2 whitespace-nowrap';
  const dash = '—';
  return (
    <div className="overflow-x-auto mt-5">
      <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
            <th className="text-left font-medium px-3 py-2">Product</th>
            <th className={th}>Rate</th>
            <th className={th}>IPO &amp; follow-on</th>
            <th className={th}>ATM raised</th>
            <th className={th}>Buybacks</th>
            <th className={th}>Net total</th>
            <th className={th}>Last ATM sale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-left px-3 py-2 font-bold">{ticker}</td>
            <td className={td} style={{ color: 'var(--text-muted)' }}>{rate}</td>
            <td className={td}>{t.offerings ? fmt(t.offerings, unit) : dash} {t.first && t.offerings > 0 && <span style={{ color: 'var(--text-muted)' }}>· {monthYear(t.first)}</span>}</td>
            <td className={td}>{t.atm ? fmt(t.atm, unit) : dash}</td>
            <td className={td}>{buyback ? `−${fmt(buyback, unit)}` : dash}</td>
            <td className={`${td} font-semibold`}>{netTotal ? fmt(netTotal, unit) : dash}</td>
            <td className={td} style={{ color: 'var(--text-muted)' }}>{monthYear(t.lastAtm)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
