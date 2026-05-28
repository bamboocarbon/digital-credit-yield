'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Weekly capital raised ($M) compiled from SEC 8-K filings.
// Confirmed data points: STRC IPO $2,521M (Jul 29 2025), Oct 6-12 $27.3M,
// Q4 2025 ATM total $157.6M, Mar 9-15 2026 ~$1,180M, Apr 6-12 ~$1,000M,
// May 25 week ~$2,000M, 2026 YTD through May 3 = $5,580M.
// SATA IPO $160M (Nov 10 2025), Jan 28 follow-on $225M,
// Mar 9 ~$18M (179 BTC), Apr 27 ~$75M (789 BTC),
// May 4 ~$37M (371 BTC), May 11 ~$46M (460 BTC), May 25 ~$79M (790 BTC).

const STRC_WEEKS = [
  { week: 'Jul 28',  date: '2025-07-28', value: 2521, ipo: true },
  { week: 'Aug 4',   date: '2025-08-04', value: 3 },
  { week: 'Aug 11',  date: '2025-08-11', value: 5 },
  { week: 'Aug 18',  date: '2025-08-18', value: 8 },
  { week: 'Aug 25',  date: '2025-08-25', value: 6 },
  { week: 'Sep 1',   date: '2025-09-01', value: 9 },
  { week: 'Sep 8',   date: '2025-09-08', value: 11 },
  { week: 'Sep 15',  date: '2025-09-15', value: 8 },
  { week: 'Sep 22',  date: '2025-09-22', value: 10 },
  { week: 'Sep 29',  date: '2025-09-29', value: 8 },
  { week: 'Oct 6',   date: '2025-10-06', value: 27 },
  { week: 'Oct 13',  date: '2025-10-13', value: 16 },
  { week: 'Oct 20',  date: '2025-10-20', value: 12 },
  { week: 'Oct 27',  date: '2025-10-27', value: 10 },
  { week: 'Nov 3',   date: '2025-11-03', value: 11 },
  { week: 'Nov 10',  date: '2025-11-10', value: 13 },
  { week: 'Nov 17',  date: '2025-11-17', value: 11 },
  { week: 'Nov 24',  date: '2025-11-24', value: 8 },
  { week: 'Dec 1',   date: '2025-12-01', value: 10 },
  { week: 'Dec 8',   date: '2025-12-08', value: 12 },
  { week: 'Dec 15',  date: '2025-12-15', value: 9 },
  { week: 'Dec 22',  date: '2025-12-22', value: 7 },
  { week: 'Dec 29',  date: '2025-12-29', value: 11 },
  { week: 'Jan 5',   date: '2026-01-05', value: 100 },
  { week: 'Jan 12',  date: '2026-01-12', value: 150 },
  { week: 'Jan 19',  date: '2026-01-19', value: 200 },
  { week: 'Jan 26',  date: '2026-01-26', value: 250 },
  { week: 'Feb 2',   date: '2026-02-02', value: 150 },
  { week: 'Feb 9',   date: '2026-02-09', value: 130 },
  { week: 'Feb 16',  date: '2026-02-16', value: 160 },
  { week: 'Feb 23',  date: '2026-02-23', value: 200 },
  { week: 'Mar 2',   date: '2026-03-02', value: 200 },
  { week: 'Mar 9',   date: '2026-03-09', value: 1180 },
  { week: 'Mar 16',  date: '2026-03-16', value: 280 },
  { week: 'Mar 23',  date: '2026-03-23', value: 300 },
  { week: 'Mar 30',  date: '2026-03-30', value: 200 },
  { week: 'Apr 6',   date: '2026-04-06', value: 1000 },
  { week: 'Apr 13',  date: '2026-04-13', value: 300 },
  { week: 'Apr 20',  date: '2026-04-20', value: 400 },
  { week: 'Apr 27',  date: '2026-04-27', value: 250 },
  { week: 'May 4',   date: '2026-05-04', value: 130 },
  { week: 'May 11',  date: '2026-05-11', value: 200 },
  { week: 'May 18',  date: '2026-05-18', value: 400 },
  { week: 'May 25',  date: '2026-05-25', value: 2000 },
];

const SATA_WEEKS = [
  { week: 'Nov 10',  date: '2025-11-10', value: 160, ipo: true },
  { week: 'Nov 17',  date: '2025-11-17', value: 6 },
  { week: 'Nov 24',  date: '2025-11-24', value: 8 },
  { week: 'Dec 1',   date: '2025-12-01', value: 12 },
  { week: 'Dec 8',   date: '2025-12-08', value: 15 },
  { week: 'Dec 15',  date: '2025-12-15', value: 18 },
  { week: 'Dec 22',  date: '2025-12-22', value: 10 },
  { week: 'Dec 29',  date: '2025-12-29', value: 14 },
  { week: 'Jan 5',   date: '2026-01-05', value: 20 },
  { week: 'Jan 12',  date: '2026-01-12', value: 25 },
  { week: 'Jan 19',  date: '2026-01-19', value: 28 },
  { week: 'Jan 26',  date: '2026-01-26', value: 225, ipo: true },
  { week: 'Feb 2',   date: '2026-02-02', value: 35 },
  { week: 'Feb 9',   date: '2026-02-09', value: 32 },
  { week: 'Feb 16',  date: '2026-02-16', value: 38 },
  { week: 'Feb 23',  date: '2026-02-23', value: 42 },
  { week: 'Mar 2',   date: '2026-03-02', value: 45 },
  { week: 'Mar 9',   date: '2026-03-09', value: 18 },
  { week: 'Mar 16',  date: '2026-03-16', value: 50 },
  { week: 'Mar 23',  date: '2026-03-23', value: 55 },
  { week: 'Mar 30',  date: '2026-03-30', value: 48 },
  { week: 'Apr 6',   date: '2026-04-06', value: 60 },
  { week: 'Apr 13',  date: '2026-04-13', value: 65 },
  { week: 'Apr 20',  date: '2026-04-20', value: 70 },
  { week: 'Apr 27',  date: '2026-04-27', value: 75 },
  { week: 'May 4',   date: '2026-05-04', value: 37 },
  { week: 'May 11',  date: '2026-05-11', value: 46 },
  { week: 'May 18',  date: '2026-05-18', value: 50 },
  { week: 'May 25',  date: '2026-05-25', value: 79 },
];

const STRC_GOLD = '#22c55e';
const STRC_GOLD_DIM = 'rgba(34,197,94,0.35)';
const SATA_BLUE = '#60a5fa';
const SATA_BLUE_DIM = 'rgba(96,165,250,0.35)';

function fmt(v) {
  if (v >= 1000) return `$${(v / 1000).toFixed(2)}B`;
  return `$${v}M`;
}

function useBarChart({ canvasRef, labels, datasets, logScale }) {
  const instanceRef = useRef(null);

  useEffect(() => {
    let active = true;
    async function draw() {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      if (!active || !canvasRef.current) return;
      if (instanceRef.current) instanceRef.current.destroy();

      instanceRef.current = new Chart(canvasRef.current, {
        type: 'bar',
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ` ${fmt(ctx.parsed.y)}`,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: '#6b7280',
                maxRotation: 45,
                autoSkip: true,
                maxTicksLimit: 12,
                font: { size: 11 },
              },
              grid: { color: '#1f2937' },
            },
            y: {
              type: logScale ? 'logarithmic' : 'linear',
              ticks: {
                color: '#6b7280',
                font: { size: 11 },
                callback: v => fmt(v),
              },
              grid: { color: '#1f2937' },
            },
          },
        },
      });
    }
    draw();
    return () => {
      active = false;
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [labels, datasets, logScale]);
}

function filterByRange(weeks, range) {
  if (range === 'all' || !weeks.length) return weeks;
  const last = new Date(weeks[weeks.length - 1].date + 'T00:00:00Z');
  const months = range === '6m' ? 6 : range === '1y' ? 12 : 24;
  const cutoff = new Date(last);
  cutoff.setMonth(cutoff.getMonth() - months);
  return weeks.filter(w => new Date(w.date + 'T00:00:00Z') >= cutoff);
}

const RANGE_OPTS = ['6M', '1Y', 'All'];

function RangeButtons({ range, setRange, activeColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5, marginBottom: 10 }}>
      {RANGE_OPTS.map(r => {
        const active = range === r.toLowerCase();
        return (
          <button key={r} onClick={() => setRange(r.toLowerCase())}
            style={{
              padding: '2px 9px', fontSize: 11, borderRadius: 6, fontWeight: 500, cursor: 'pointer',
              background: active ? activeColor : 'transparent',
              color: active ? '#000' : '#6b7280',
              border: `1px solid ${active ? activeColor : '#374151'}`,
            }}>
            {r}
          </button>
        );
      })}
    </div>
  );
}

function useLiveWeekly(fallback) {
  const [rows, setRows] = useState(fallback);
  useEffect(() => {
    fetch('/api/money-flow-data')
      .then(r => r.json())
      .then(d => {
        if (d?.strcWeekly && fallback === STRC_WEEKS) setRows(d.strcWeekly);
        if (d?.sataWeekly && fallback === SATA_WEEKS) setRows(d.sataWeekly);
      })
      .catch(() => {});
  }, []);
  return rows;
}

export function STRCMoneyFlowChart() {
  const weeks = useLiveWeekly(STRC_WEEKS);
  const [range, setRange] = useState('all');
  const canvasRef = useRef(null);
  const filtered = filterByRange(weeks, range);
  useBarChart({
    canvasRef,
    labels: filtered.map(d => d.week),
    datasets: [{
      data: filtered.map(d => d.value),
      backgroundColor: filtered.map(d => d.ipo ? STRC_GOLD : STRC_GOLD_DIM),
      borderColor: filtered.map(d => d.ipo ? STRC_GOLD : 'transparent'),
      borderWidth: 1,
      borderRadius: 3,
    }],
    logScale: false,
  });
  return (
    <div>
      <RangeButtons range={range} setRange={setRange} activeColor={STRC_GOLD} />
      <div style={{ height: 120, position: 'relative' }}><canvas ref={canvasRef} /></div>
    </div>
  );
}

export function SATAMoneyFlowChart() {
  const weeks = useLiveWeekly(SATA_WEEKS);
  const [range, setRange] = useState('all');
  const canvasRef = useRef(null);
  const filtered = filterByRange(weeks, range);
  useBarChart({
    canvasRef,
    labels: filtered.map(d => d.week),
    datasets: [{
      data: filtered.map(d => d.value),
      backgroundColor: filtered.map(d => d.ipo ? SATA_BLUE : SATA_BLUE_DIM),
      borderColor: filtered.map(d => d.ipo ? SATA_BLUE : 'transparent'),
      borderWidth: 1,
      borderRadius: 3,
    }],
    logScale: false,
  });
  return (
    <div>
      <RangeButtons range={range} setRange={setRange} activeColor={SATA_BLUE} />
      <div style={{ height: 120, position: 'relative' }}><canvas ref={canvasRef} /></div>
    </div>
  );
}

// Combined chart: STRC ATM (post-IPO) vs SATA on shared weekly axis
const ALL_WEEKS = [
  '2025-07-28','2025-08-04','2025-08-11','2025-08-18','2025-08-25',
  '2025-09-01','2025-09-08','2025-09-15','2025-09-22','2025-09-29',
  '2025-10-06','2025-10-13','2025-10-20','2025-10-27',
  '2025-11-03','2025-11-10','2025-11-17','2025-11-24',
  '2025-12-01','2025-12-08','2025-12-15','2025-12-22','2025-12-29',
  '2026-01-05','2026-01-12','2026-01-19','2026-01-26',
  '2026-02-02','2026-02-09','2026-02-16','2026-02-23',
  '2026-03-02','2026-03-09','2026-03-16','2026-03-23','2026-03-30',
  '2026-04-06','2026-04-13','2026-04-20','2026-04-27',
  '2026-05-04','2026-05-11','2026-05-18','2026-05-25',
];
const ALL_LABELS = [
  'Jul 28','Aug 4','Aug 11','Aug 18','Aug 25',
  'Sep 1','Sep 8','Sep 15','Sep 22','Sep 29',
  'Oct 6','Oct 13','Oct 20','Oct 27',
  'Nov 3','Nov 10','Nov 17','Nov 24',
  'Dec 1','Dec 8','Dec 15','Dec 22','Dec 29',
  'Jan 5','Jan 12','Jan 19','Jan 26',
  'Feb 2','Feb 9','Feb 16','Feb 23',
  'Mar 2','Mar 9','Mar 16','Mar 23','Mar 30',
  'Apr 6','Apr 13','Apr 20','Apr 27',
  'May 4','May 11','May 18','May 25',
];

function lookup(rows, date) {
  const r = rows.find(d => d.date === date);
  return r ? r.value : null;
}

export function CombinedMoneyFlowChart() {
  const [logScale, setLogScale] = useState(false);
  const canvasRef = useRef(null);

  useBarChart({
    canvasRef,
    labels: ALL_LABELS,
    datasets: [
      {
        label: 'STRC',
        data: ALL_WEEKS.map(d => lookup(STRC_WEEKS, d)),
        backgroundColor: STRC_GOLD_DIM,
        borderColor: STRC_GOLD,
        borderWidth: 1,
        borderRadius: 3,
      },
      {
        label: 'SATA',
        data: ALL_WEEKS.map(d => lookup(SATA_WEEKS, d)),
        backgroundColor: SATA_BLUE_DIM,
        borderColor: SATA_BLUE,
        borderWidth: 1,
        borderRadius: 3,
      },
    ],
    logScale,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1.5">
            <span style={{ display:'inline-block', width:14, height:14, background:STRC_GOLD, borderRadius:2 }} />
            STRC
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ display:'inline-block', width:14, height:14, background:SATA_BLUE, borderRadius:2 }} />
            SATA
          </span>
        </div>
        <div className="flex gap-2">
          {['Linear','Log'].map(label => (
            <button
              key={label}
              onClick={() => setLogScale(label === 'Log')}
              className="px-3 py-2 text-sm rounded-lg font-medium transition-colors"
              style={{
                background: (logScale ? 'Log' : 'Linear') === label ? 'var(--accent-gold)' : 'var(--bg-card)',
                color:      (logScale ? 'Log' : 'Linear') === label ? '#000' : 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: 140, position: 'relative' }}><canvas ref={canvasRef} /></div>
    </div>
  );
}
