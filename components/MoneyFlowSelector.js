'use client';

import { useState, useEffect } from 'react';
import { STRCMoneyFlowChart, SATAMoneyFlowChart, BMNPMoneyFlowChart, CHADMoneyFlowChart, MOREMoneyFlowChart } from '@/components/MoneyFlowChart';
import { BMNP_ENABLED } from '@/lib/constants';

const TICKERS = [
  { ticker: 'STRC', label: 'Strategy Preferred', color: '#4ade80', meta: 'IPO Jul 2025 · 12.00% · $4.2B ATM programme', dataKey: 'strcWeekly', Chart: STRCMoneyFlowChart },
  { ticker: 'SATA', label: 'Strive Preferred', color: '#3b82f6', meta: 'IPO Nov 2025 · 13.00% · $500M ATM programme', dataKey: 'sataWeekly', Chart: SATAMoneyFlowChart },
  ...(BMNP_ENABLED ? [{ ticker: 'BMNP', label: 'Bitmine Preferred', color: '#fde047', meta: 'IPO Jun 2026 · 9.50% · ATM programme TBC', dataKey: 'bmnpWeekly', Chart: BMNPMoneyFlowChart, pendingNote: 'Listed Jun 16, 2026 — capital flow data pending' }] : []),
  { ticker: 'CHAD', label: 'DeFi Development Preferred', color: '#7f1d1d', meta: 'IPO Sep 2026 · 13.00% · $10 par', dataKey: 'chadWeekly', Chart: CHADMoneyFlowChart, pendingNote: 'Listed Sep 8, 2026 — capital flow data pending' },
  { ticker: 'MORE', label: 'Smarter Web Preferred', color: '#a855f7', meta: 'IPO Oct 2026 · 12.00% · £ sterling · LSE', dataKey: 'moreWeekly', Chart: MOREMoneyFlowChart, unit: '£', pendingNote: 'Admitted Oct 14, 2026 — capital flow data pending' },
];

function fmt(v, unit = '$') {
  if (v >= 1000) return `${unit}${(v / 1000).toFixed(2)}B`;
  return `${unit}${v}M`;
}

// month from a 'YYYY-MM-DD' string, e.g. '2025-07-28' -> 'Jul 2025' — avoids
// a Date() parse (its local-timezone rounding can shift a date-only string
// onto the wrong day/month near midnight UTC).
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function monthYear(dateStr) {
  const [y, m] = dateStr.split('-');
  return `${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

// Derives the headline total and "since" range from the full weekly array rather than
// hand-editing them, so they can't go stale independently of the underlying weekly data
// (found stale 2026-09-08 when this lived as hardcoded strings in a separate component).
function deriveStats(weekly) {
  if (!weekly?.length) return null;
  return {
    total: weekly.reduce((sum, w) => sum + w.value, 0),
    latest: weekly[weekly.length - 1],
    rangeStart: monthYear(weekly[0].date),
  };
}

export default function MoneyFlowSelector() {
  const [selected, setSelected] = useState('STRC');
  const [flowData, setFlowData] = useState(null);

  useEffect(() => {
    fetch('/api/money-flow-data')
      .then(r => r.json())
      .then(setFlowData)
      .catch(() => {});
  }, []);

  const active = TICKERS.find(t => t.ticker === selected) ?? TICKERS[0];

  return (
    <>
      <div className={`grid grid-cols-1 gap-4 mb-6 ${TICKERS.length >= 5 ? 'sm:grid-cols-2 lg:grid-cols-5' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
        {TICKERS.map(t => {
          const isActive = t.ticker === selected;
          const stats = t.dataKey ? deriveStats(flowData?.[t.dataKey]) : null;
          return (
            <button
              key={t.ticker}
              type="button"
              onClick={() => setSelected(t.ticker)}
              className="text-left rounded-2xl p-5 transition-colors cursor-pointer"
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${isActive ? t.color : 'var(--border)'}`,
                boxShadow: isActive ? `0 0 0 1px ${t.color}` : 'none',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg">{t.ticker}</span>
                <span className="text-xs font-medium" style={{ color: t.color }}>{t.label}</span>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{t.meta}</p>
              {stats ? (
                <>
                  <p className="text-2xl font-bold">{fmt(stats.total, t.unit)}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stats.rangeStart} – present</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: t.color }}>
                    Latest: {stats.latest.week} &middot; {fmt(stats.latest.value, t.unit)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold">—</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{t.pendingNote ?? 'Capital flow data pending'}</p>
                </>
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-lg" style={{ color: active.color }}>{active.ticker}</span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{active.label}</span>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{active.meta}</p>
        <active.Chart />
      </div>
    </>
  );
}
