'use client';

import { useEffect, useRef } from 'react';

function buildData(rate, years, reinvest) {
  return Array.from({ length: years + 1 }, (_, i) =>
    reinvest
      ? Math.round(10000 * Math.pow(1 + rate / 12, i * 12))
      : Math.round(10000 + 10000 * rate * i)
  );
}

export default function CompoundingChart() {
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    let active = true;
    async function draw() {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      if (!active || !canvasRef.current) return;
      if (instanceRef.current) instanceRef.current.destroy();

      const years = 20;
      const labels = Array.from({ length: years + 1 }, (_, i) => i === 0 ? 'Start' : `Yr ${i}`);

      instanceRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'SATA Reinvested (13%)',
              data: buildData(0.13, years, true),
              borderColor: '#2563eb',
              fill: false,
              tension: 0.4,
              borderWidth: 2.5,
              pointRadius: 0,
              pointHoverRadius: 5,
            },
            {
              label: 'STRC Reinvested (11.50%)',
              data: buildData(0.115, years, true),
              borderColor: '#15803d',
              fill: false,
              tension: 0.4,
              borderWidth: 2.5,
              pointRadius: 0,
              pointHoverRadius: 5,
            },
            {
              label: 'SATA Cash Out',
              data: buildData(0.13, years, false),
              borderColor: '#2563eb',
              borderDash: [6, 4],
              fill: false,
              tension: 0,
              borderWidth: 1.5,
              pointRadius: 0,
              pointHoverRadius: 4,
            },
            {
              label: 'STRC Cash Out',
              data: buildData(0.115, years, false),
              borderColor: '#15803d',
              borderDash: [6, 4],
              fill: false,
              tension: 0,
              borderWidth: 1.5,
              pointRadius: 0,
              pointHoverRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                color: '#9ca3af',
                font: { size: 12 },
                usePointStyle: true,
                padding: 20,
              },
            },
            tooltip: {
              callbacks: {
                label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`,
              },
            },
          },
          scales: {
            x: {
              ticks: { color: '#6b7280', font: { size: 11 }, maxTicksLimit: 11 },
              grid: { color: '#1f2937' },
            },
            y: {
              ticks: {
                color: '#6b7280',
                font: { size: 11 },
                callback: v => '$' + (v >= 1000 ? Math.round(v / 1000) + 'k' : v),
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
  }, []);

  return (
    <div style={{ margin: '2rem 0', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
      <p style={{ margin: '0 0 1.25rem', fontSize: '0.85em', color: 'var(--text-muted)', textAlign: 'center' }}>
        $10,000 starting investment — reinvested vs cash out over 20 years (assumes constant rate)
      </p>
      <div style={{ position: 'relative', height: '320px' }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Compounding growth chart comparing reinvested vs cash-out dividends for STRC and SATA over 20 years"
        />
      </div>
    </div>
  );
}
