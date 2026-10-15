'use client';

import { useEffect, useRef } from 'react';
import { weekLabelOf } from '@/lib/strategyFlow';

// Shared pieces of the issuer-level money-flow views (Strategy, Strive): a toggleable legend with the
// 6M / 1Y / All buttons on its right (same look as the Cumulative chart's), and a weekly stacked bar
// chart. Each series is { key, label, colour, value: row => signed $M } — negative values (buybacks)
// stack below zero.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = 86400000;
const RANGES = ['6M', '1Y', 'All'];

export function fmtMoney(v, unit = '$') {
  const a = Math.abs(v);
  return a >= 1000 ? `${unit}${(a / 1000).toFixed(2)}B` : `${unit}${Math.round(a)}M`;
}

export function monthYear(d) {
  if (!d) return '—';
  const [y, m] = d.split('-');
  return `${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

function mondayNow() {
  const n = new Date();
  const d = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.getTime();
}

// Continuous weekly buckets from the first filed week to now, so quiet weeks show as gaps not jumps.
function buildWeeks(rows) {
  const byDate = new Map(rows.map(r => [r.date, r]));
  const start = new Date(rows[0].date + 'T00:00:00Z').getTime();
  const end = Math.max(mondayNow(), new Date(rows[rows.length - 1].date + 'T00:00:00Z').getTime());
  const out = [];
  for (let t = start; t <= end; t += 7 * DAY) {
    const date = new Date(t).toISOString().slice(0, 10);
    out.push({ date, label: weekLabelOf(date), row: byDate.get(date) });
  }
  return out;
}

// Same rule as the single-ticker charts: the window ends at the latest week, not today.
function filterByRange(weeks, range) {
  if (range === 'all' || !weeks.length) return weeks;
  const cutoff = new Date(weeks[weeks.length - 1].date + 'T00:00:00Z');
  cutoff.setUTCMonth(cutoff.getUTCMonth() - (range === '6m' ? 6 : 12));
  const iso = cutoff.toISOString().slice(0, 10);
  return weeks.filter(w => w.date >= iso);
}

function RangeButtons({ range, setRange }) {
  return (
    <div className="flex gap-1.5">
      {RANGES.map(r => {
        const active = range === r.toLowerCase();
        return (
          <button key={r} type="button" onClick={() => setRange(r.toLowerCase())}
            className="text-sm font-medium transition-colors"
            style={{
              padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
              background: active ? 'var(--accent-gold)' : 'var(--bg-card)',
              color: active ? '#000' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}>
            {r}
          </button>
        );
      })}
    </div>
  );
}

export function FlowLegend({ series, off, toggle, range, setRange }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-x-6 gap-y-3 mb-4">
      <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        {series.map(s => {
          const on = !off.has(s.key);
          return (
            <button key={s.key} type="button" onClick={() => toggle(s.key)} aria-pressed={on}
              title={`${on ? 'Hide' : 'Show'} ${s.label}`}
              className="flex items-center gap-2 transition-opacity"
              style={{
                padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                background: 'var(--bg-card)',
                border: `1px solid ${on ? s.colour : 'var(--border)'}`,
                opacity: on ? 1 : 0.45,
              }}>
              <div style={{ width: 24, height: 2, background: s.colour, borderRadius: 2 }} />
              <p style={{ margin: 0, color: '#e5e7eb', textDecoration: on ? 'none' : 'line-through' }}>{s.label}</p>
            </button>
          );
        })}
      </div>
      <RangeButtons range={range} setRange={setRange} />
    </div>
  );
}

export function FlowStackedChart({ rows, series, off, range, ariaLabel }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!rows.length) return undefined;
    let active = true;
    let chart;
    (async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      if (!active || !canvasRef.current) return;
      const weeks = filterByRange(buildWeeks(rows), range);
      const datasets = series.filter(s => !off.has(s.key)).map(s => ({
        label: s.label,
        data: weeks.map(w => (w.row ? s.value(w.row) : 0)),
        backgroundColor: s.colour,
        borderRadius: 2,
        stack: 'flow',
      }));
      chart = new Chart(canvasRef.current, {
        type: 'bar',
        data: { labels: weeks.map(w => w.label), datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index',
              callbacks: {
                label: c => (c.parsed.y === 0 ? null : ` ${c.dataset.label}: ${c.parsed.y < 0 ? '−' : ''}${fmtMoney(c.parsed.y)}`),
              },
            },
          },
          scales: {
            x: { stacked: true, ticks: { color: '#6b7280', maxRotation: 45, autoSkip: true, maxTicksLimit: 14, font: { size: 11 } }, grid: { color: '#1f2937' } },
            y: { stacked: true, ticks: { color: '#6b7280', font: { size: 11 }, callback: v => (v < 0 ? '−' : '') + fmtMoney(v) }, grid: { color: '#1f2937' } },
          },
        },
      });
    })();
    return () => { active = false; chart?.destroy(); };
  }, [rows, series, off, range]);
  return <div role="img" aria-label={ariaLabel} style={{ height: 240, position: 'relative' }}><canvas ref={canvasRef} /></div>;
}
