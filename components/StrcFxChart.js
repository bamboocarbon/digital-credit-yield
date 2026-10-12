'use client';

import { useEffect, useRef } from 'react';
import { STRC_FX } from '@/lib/strcFxData';

const WRAP = { margin: '2rem 0', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' };
const CAPTION = { margin: '0 0 1.25rem', fontSize: '0.85em', color: 'var(--text-muted)', textAlign: 'center' };

const GREEN = '#4ade80';
const PURPLE = '#a855f7';
const GREY = '#6b7280';

const labels = STRC_FX.map(([d]) => {
  const [y, m, day] = d.split('-');
  return `${parseInt(day, 10)} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m, 10) - 1]} ${y.slice(2)}`;
});

function useChart(configFn) {
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);
  useEffect(() => {
    let active = true;
    async function draw() {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      if (!active || !canvasRef.current) return;
      instanceRef.current?.destroy();
      instanceRef.current = new Chart(canvasRef.current, configFn());
    }
    draw();
    return () => { active = false; instanceRef.current?.destroy(); instanceRef.current = null; };
  }, []);
  return canvasRef;
}

const baseOptions = (yFmt, yExtra = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: true, position: 'bottom', labels: { color: '#9ca3af', font: { size: 12 }, usePointStyle: true, padding: 20 } },
  },
  scales: {
    x: { ticks: { color: GREY, font: { size: 11 }, maxTicksLimit: 9 }, grid: { color: '#1f2937' } },
    y: { ticks: { color: GREY, font: { size: 11 }, callback: yFmt }, grid: { color: '#1f2937' }, ...yExtra },
  },
});

// STRC's price in dollars next to the same share priced in pounds (price ÷ GBP/USD).
export function StrcPriceChart() {
  const canvasRef = useChart(() => ({
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'STRC in dollars ($)', data: STRC_FX.map(r => r[1]), borderColor: GREEN, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 4, tension: 0.2 },
        { label: 'Same share in pounds (£)', data: STRC_FX.map(r => +(r[1] / r[2]).toFixed(2)), borderColor: PURPLE, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 4, tension: 0.2 },
        { label: '$100 par', data: STRC_FX.map(() => 100), borderColor: GREY, borderDash: [6, 4], borderWidth: 1, pointRadius: 0 },
      ],
    },
    options: {
      ...baseOptions(v => v),
      plugins: {
        ...baseOptions().plugins,
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.dataset.label.includes('£') ? '£' : '$'}${ctx.parsed.y.toFixed(2)}` } },
      },
    },
  }));
  return (
    <div style={WRAP}>
      <p style={CAPTION}>STRC daily closes since the July 2025 IPO — in dollars, and converted to pounds at that day&apos;s GBP/USD rate</p>
      <div style={{ position: 'relative', height: '320px' }}>
        <canvas ref={canvasRef} role="img" aria-label="STRC price in dollars and in pounds sterling from July 2025 to October 2026, falling from about 100 dollars to about 75 dollars in June 2026 before recovering" />
      </div>
    </div>
  );
}

export function GbpUsdChart() {
  const canvasRef = useChart(() => ({
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'GBP/USD (dollars per pound)', data: STRC_FX.map(r => r[2]), borderColor: '#f5a623', borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, tension: 0.2 },
      ],
    },
    options: {
      ...baseOptions(v => v.toFixed(2), { min: 1.28, max: 1.4 }),
      plugins: {
        ...baseOptions().plugins,
        tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y.toFixed(4)}` } },
      },
    },
  }));
  return (
    <div style={WRAP}>
      <p style={CAPTION}>GBP/USD over the same period — low 1.3022 (5 Nov 2025), high 1.3825 (29 Jan 2026)</p>
      <div style={{ position: 'relative', height: '260px' }}>
        <canvas ref={canvasRef} role="img" aria-label="GBP/USD exchange rate from July 2025 to October 2026, ranging between about 1.30 and 1.38" />
      </div>
    </div>
  );
}

// £10,000 held for a year in a dollar preferred paying 12% with the price unchanged. The dividends are
// treated as received in dollars and converted back with the principal at the end — a simplification:
// in reality each payment is its own conversion, so real-world friction is a little higher than this.
const START = 10000;
const DIVIDEND = 0.12;
const outcome = (fxMove, frictionEachWay) =>
  (START * (1 - frictionEachWay) * (1 + DIVIDEND) * (1 - frictionEachWay)) / (1 + fxMove);
const gbp = v => v.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
const pct = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;

export function FxScenarioTable() {
  const moves = [
    { label: 'Pound weakens 6% (GBP/USD 1.32 → 1.24)', x: -0.06 },
    { label: 'Pound unchanged', x: 0 },
    { label: 'Pound strengthens 6% (1.32 → 1.40)', x: 0.06 },
  ];
  const cell = { padding: '0.6rem 1rem', textAlign: 'right' };
  const head = { textAlign: 'right', padding: '0.6rem 1rem', color: 'var(--accent-gold)' };
  return (
    <div style={{ ...WRAP, padding: '1rem', overflowX: 'auto' }}>
      <p style={CAPTION}>£10,000 in a 12% dollar preferred for a year, share price unchanged — what comes back in pounds</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
            <th style={{ ...head, textAlign: 'left' }}>What the pound does</th>
            <th style={head}>No dealing costs</th>
            <th style={head}>1% each way</th>
          </tr>
        </thead>
        <tbody>
          {moves.map(m => {
            const free = outcome(m.x, 0);
            const costly = outcome(m.x, 0.01);
            return (
              <tr key={m.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ ...cell, textAlign: 'left', color: 'var(--text-muted)' }}>{m.label}</td>
                <td style={cell}>{gbp(free)} <span style={{ color: 'var(--text-muted)' }}>({pct((free / START - 1) * 100)})</span></td>
                <td style={cell}>{gbp(costly)} <span style={{ color: 'var(--text-muted)' }}>({pct((costly / START - 1) * 100)})</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ ...CAPTION, margin: '1rem 0 0', textAlign: 'left' }}>
        Illustrative arithmetic, not a forecast. The 1% each-way figure is an assumption — check what your own platform charges to convert pounds to dollars and back.
      </p>
    </div>
  );
}
