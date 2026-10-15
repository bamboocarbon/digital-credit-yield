'use client';

import { useEffect, useState } from 'react';
import { SEED_STRATEGY_WEEKLY, STRATEGY_IPO, mergeStrategyWeekly, strategyTotals } from '@/lib/strategyFlow';
import { FlowLegend, FlowStackedChart, fmtMoney as fmt, monthYear } from '@/components/FlowChartParts';

// Strategy's five preferred series on one weekly axis: net cash raised stacked by product (IPOs
// included), with buybacks drawn as negative bars. STRE is a euro security, converted to dollars at the
// EUR/USD rate on its IPO closing date so it sits on the same axis and in the same total.
const USD = ['STRK', 'STRF', 'STRD', 'STRE', 'STRC'];
const COLOURS = { STRK: '#a3e635', STRF: '#2dd4bf', STRD: '#60a5fa', STRC: '#15803d', STRE: '#f472b6', BUYBACK: '#ef4444' };
const SERIES = [
  ...USD.map(k => ({ key: k, label: k, colour: COLOURS[k], value: r => (r.net?.[k] ?? 0) * (STRATEGY_IPO[k].fx ?? 1) })),
  { key: 'BUYBACK', label: 'STRC buybacks', colour: COLOURS.BUYBACK, value: r => -(r.bb?.STRC ?? 0) },
];

export default function StrategyFlowView() {
  const [weekly, setWeekly] = useState(SEED_STRATEGY_WEEKLY);
  const [range, setRange] = useState('all');
  const [off, setOff] = useState(() => new Set());
  const toggle = k => setOff(prev => { const n = new Set(prev); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  useEffect(() => {
    fetch('/api/money-flow-data')
      .then(r => r.json())
      .then(d => { if (d?.strategyWeekly?.length) setWeekly(mergeStrategyWeekly(d.strategyWeekly)); })
      .catch(() => {});
  }, []);

  const rows = strategyTotals(weekly);
  const sum = k => rows.reduce((s, r) => s + r.usd[k], 0);
  const th = 'text-right font-medium px-3 py-2 whitespace-nowrap';
  const td = 'text-right px-3 py-2 whitespace-nowrap';

  return (
    <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold text-lg" style={{ color: 'var(--accent-gold)' }}>Strategy</span>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>all preferred products</span>
      </div>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        Net cash raised each week by STRK, STRF, STRD, STRE and STRC, from Strategy&apos;s own 8-K tables. Red bars below zero are STRC buybacks. Click a ticker to hide or show it.
      </p>

      <FlowLegend series={SERIES} off={off} toggle={toggle} range={range} setRange={setRange} />
      <FlowStackedChart rows={weekly} series={SERIES} off={off} range={range}
        ariaLabel="Strategy weekly capital raised by product, stacked, with STRC buybacks below zero" />

      <div className="overflow-x-auto mt-5">
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
              <th className="text-left font-medium px-3 py-2">Product</th>
              <th className={th}>Rate</th>
              <th className={th}>IPO</th>
              <th className={th}>ATM raised</th>
              <th className={th}>Buybacks</th>
              <th className={th}>Net total</th>
              <th className={th}>Last ATM sale</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const unit = r.eur ? '€' : '$';
              return (
                <tr key={r.ticker} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="text-left px-3 py-2 font-bold">{r.ticker}</td>
                  <td className={td} style={{ color: 'var(--text-muted)' }}>{r.rate}</td>
                  <td className={td}>{fmt(r.ipoNet, unit)}{r.eur && <span style={{ color: 'var(--text-muted)' }}> ≈ {fmt(r.usd.ipoNet)}</span>} <span style={{ color: 'var(--text-muted)' }}>· {monthYear(r.date)}</span></td>
                  <td className={td}>{r.atmNet ? fmt(r.atmNet, unit) : '—'}</td>
                  <td className={td}>{r.buyback ? `−${fmt(r.buyback, unit)}` : '—'}</td>
                  <td className={`${td} font-semibold`}>{fmt(r.total, unit)}{r.eur && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> ≈ {fmt(r.usd.total)}</span>}</td>
                  <td className={td} style={{ color: 'var(--text-muted)' }}>{monthYear(r.lastAtm)}</td>
                </tr>
              );
            })}
            <tr>
              <td className="text-left px-3 py-2 font-bold">Total (USD)</td>
              <td className={td} />
              <td className={td}>{fmt(sum('ipoNet'))}</td>
              <td className={td}>{fmt(sum('atmNet'))}</td>
              <td className={td}>−{fmt(sum('buyback'))}</td>
              <td className={`${td} font-bold`}>{fmt(sum('total'))}</td>
              <td className={td} />
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
        Table totals are since each IPO, whatever range the chart shows. All figures net of sales commissions, so STRC&apos;s IPO shows as $2.47B (the $2.52B gross less fees). STRE is a euro security (IPO only, no ATM): €608.8M converted at 1.1592 USD per EUR, the rate on its 13 Nov 2025 closing date, and included in the chart and the total.
        STRC buybacks began in July 2026.
      </p>
    </div>
  );
}
