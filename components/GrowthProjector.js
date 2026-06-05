'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { saveProjectorState, loadProjectorState, defaultProjectorState } from '@/lib/projectorState';
import { runProjection, computeAPY, HORIZON_MONTHS as horizonMonths, HORIZON_LABELS as horizonLabels, fmt, fmtNum, stripNum } from '@/lib/projectorEngine';
import NumericInput from '@/components/NumericInput';

const MONO = { fontFamily: "'Roboto Mono', 'Courier New', monospace" };
const inputStyle = { ...MONO, background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' };
const inputClass = 'w-full px-3 py-2 rounded-lg text-sm font-mono-data text-center';

export default function GrowthProjector({ ticker, liveYield }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const [form, setForm] = useState(() => ({
    ...defaultProjectorState,
    annualYield: liveYield ?? defaultProjectorState.annualYield,
  }));

  useEffect(() => {
    const saved = loadProjectorState(ticker);
    if (saved) setForm(prev => ({ ...prev, ...saved }));
    else if (liveYield != null) setForm(prev => ({ ...prev, annualYield: liveYield }));
  }, [ticker, liveYield]);

  function update(field, value) {
    const next = { ...form, [field]: value };
    setForm(next);
    saveProjectorState(ticker, next);
  }

  const months = horizonMonths[form.horizon] || 60;

  const rawAmount = Number(String(form.investmentAmount || 0).replace(/,/g, ''));
  const rawShares = Number(String(form.numShares || 0).replace(/,/g, ''));
  const startValue = form.inputMode === 'shares'
    ? rawShares * Number(form.pricePerShare || 100)
    : rawAmount;

  const priceForYield = form.inputMode === 'shares' ? Number(form.pricePerShare || 100) : 100;
  const effectiveYield = priceForYield > 0 ? Number(form.annualYield) * (100 / priceForYield) : Number(form.annualYield);

  const paymentsPerYear = ticker === 'SATA' ? 250 : ticker === 'BMNP' ? 52 : 12;

  const history = useMemo(
    () => runProjection(startValue, effectiveYield, Number(form.monthlyContribution), Number(form.reinvestmentPct), months, paymentsPerYear),
    [startValue, effectiveYield, form.monthlyContribution, form.reinvestmentPct, months, paymentsPerYear]
  );

  const final = history[history.length - 1];
  const totalInvested = startValue + Number(form.monthlyContribution) * months;
  const totalGenerated = final.totalDistributions;
  const totalCash = final.cashDistributions;
  const portfolioValue = final.portfolio;
  const totalReturn = ((portfolioValue + totalCash - totalInvested) / totalInvested) * 100;

  const step = months <= 24 ? 1 : 12;
  const tableRows = [];
  for (let m = step; m <= months; m += step) {
    const row = history[m];
    const label = step === 1 ? `Month ${m}` : `Year ${m / 12}`;
    tableRows.push({ label, portfolio: row.portfolio, dist: row.totalDistributions });
  }

  useEffect(() => {
    let destroyed = false;
    async function drawChart() {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      if (destroyed) return;
      const ctx = chartRef.current?.getContext('2d');
      if (!ctx) return;

      if (chartInstanceRef.current) chartInstanceRef.current.destroy();

      const labels = history.filter((_, i) => i % step === 0).map((_, i) => {
        return step === 1 ? `M${i}` : `Y${i}`;
      });

      const portfolioData = history.filter((_, i) => i % step === 0).map(h => h.portfolio);
      const cumDistData = history.filter((_, i) => i % step === 0).map(h => h.totalDistributions);

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Portfolio Value',
              data: portfolioData,
              borderColor: '#c8893a',
              backgroundColor: 'rgba(200,137,58,0.1)',
              tension: 0.3,
              fill: true,
            },
            {
              label: 'Cumulative Distributions',
              data: cumDistData,
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34,197,94,0.1)',
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              titleFont: { size: 12 },
              bodyFont: { size: 11 },
              callbacks: { label: ctx => `${ctx.dataset.label}: ${fmt(ctx.raw)}` },
            },
          },
          scales: {
            x: { ticks: { color: '#6b7280', maxTicksLimit: 8 }, grid: { color: '#1f2937' } },
            y: { ticks: { color: '#6b7280', callback: v => fmt(v) }, grid: { color: '#1f2937' } },
          },
        },
      });
    }
    drawChart();
    return () => { destroyed = true; };
  }, [history, step]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 max-w-5xl mx-auto w-full">
        {/* Input panel — 3 cols × 2 rows */}
        <div className="card p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4">Investment Details</h2>

          <div className="space-y-3">

            {/* Row 1 — 3 columns: Amount/Shares | Price per Share | Annual Yield */}
            <div className="grid grid-cols-3 gap-x-3 gap-y-1">
              {/* label row — grid makes all three cells the same height */}
              <div className="flex items-center justify-between">
                <label className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {form.inputMode === 'shares' ? '# Shares' : 'Amount ($)'}
                </label>
                <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border)', fontSize: '10px' }}>
                  {[{ key: 'dollars', label: '$' }, { key: 'shares', label: '#' }].map(({ key, label }) => (
                    <button key={key} type="button" onClick={() => update('inputMode', key)}
                      aria-label={key === 'dollars' ? 'Enter investment as dollar amount' : 'Enter investment as number of shares'}
                      className="px-2 py-0.5 font-medium"
                      style={{
                        background: form.inputMode === key ? 'var(--accent-gold)' : 'var(--bg-card-hover)',
                        color: form.inputMode === key ? 'var(--text-primary)' : 'var(--text-muted)',
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center" style={{ opacity: form.inputMode === 'shares' ? 1 : 0.35, transition: 'opacity 0.2s' }}>
                <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Price per Share ($)</label>
              </div>
              <div className="flex items-center">
                <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Annual Yield (%)</label>
              </div>

              {/* input row */}
              <div>
                {form.inputMode !== 'shares' ? (
                  <input type="text" inputMode="numeric" value={fmtNum(form.investmentAmount)}
                    onChange={e => update('investmentAmount', stripNum(e.target.value))}
                    aria-label="Investment amount in dollars"
                    className={inputClass} style={inputStyle} />
                ) : (
                  <input type="text" inputMode="numeric" placeholder="e.g. 1,000" value={fmtNum(form.numShares)}
                    onChange={e => update('numShares', stripNum(e.target.value))}
                    aria-label="Number of shares"
                    className={inputClass} style={inputStyle} />
                )}
              </div>
              <div style={{ opacity: form.inputMode === 'shares' ? 1 : 0.35, transition: 'opacity 0.2s' }}>
                <NumericInput value={form.pricePerShare} step={0.01} min={0}
                  onChange={val => update('pricePerShare', val)}
                  disabled={form.inputMode !== 'shares'}
                  aria-label="Price per share in dollars"
                  className={inputClass} style={inputStyle} />
              </div>
              <div>
                <NumericInput value={form.annualYield} step={0.1} min={0}
                  onChange={val => update('annualYield', val)}
                  aria-label="Annual yield percentage"
                  className={inputClass} style={inputStyle} />
              </div>
            </div>

            {/* Row 2 — 2 columns: Time Horizon | Monthly */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Time Horizon</label>
                <select value={form.horizon} onChange={e => update('horizon', e.target.value)}
                  aria-label="Time horizon"
                  className="w-full px-3 py-2 rounded-lg text-sm text-center"
                  style={{ ...inputStyle, textAlignLast: 'center', WebkitAppearance: 'none', appearance: 'none' }}>
                  {Object.keys(horizonMonths).map(h => (
                    <option key={h} value={h}>{horizonLabels[h]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Monthly ($)</label>
                <input type="text" inputMode="numeric" value={fmtNum(form.monthlyContribution)}
                  onChange={e => update('monthlyContribution', stripNum(e.target.value))}
                  aria-label="Monthly contribution in dollars"
                  className={inputClass} style={inputStyle} />
              </div>
            </div>

            {/* Row 3 — Reinvestment slider full width */}
            <div>
              <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                Reinvestment: <span style={{ color: 'var(--accent-gold)' }}>{form.reinvestmentPct}%</span>
              </label>
              <input type="range" min="0" max="100" value={form.reinvestmentPct}
                onChange={e => update('reinvestmentPct', e.target.value)}
                aria-label={`Reinvestment percentage: ${form.reinvestmentPct}%`}
                className="w-full" style={{ accentColor: 'var(--accent-gold)' }} />
              {ticker === 'SATA' && Number(form.reinvestmentPct) > 0 && (
                <p className="text-xs mt-1" style={{ color: 'var(--accent-gold)' }}>
                  Daily compounding: {computeAPY(effectiveYield, 250).toFixed(4)}% APY
                  <span style={{ color: 'var(--text-muted)' }}>
                    {' '}(+{((computeAPY(effectiveYield, 250) - computeAPY(effectiveYield, 12)) * 100).toFixed(1)} bps vs monthly)
                  </span>
                </p>
              )}
              {ticker === 'BMNP' && Number(form.reinvestmentPct) > 0 && (
                <p className="text-xs mt-1" style={{ color: 'var(--accent-gold)' }}>
                  Weekly compounding: {computeAPY(effectiveYield, 52).toFixed(4)}% APY
                  <span style={{ color: 'var(--text-muted)' }}>
                    {' '}(+{((computeAPY(effectiveYield, 52) - computeAPY(effectiveYield, 12)) * 100).toFixed(1)} bps vs monthly)
                  </span>
                </p>
              )}
            </div>

          </div>

          {form.inputMode === 'shares' && rawShares > 0 && (
            <div className="mt-3 text-center space-y-1">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                ≈ {fmt(rawShares * Number(form.pricePerShare || 100))} total investment
              </p>
              {Number(form.pricePerShare || 100) !== 100 && (
                <p className="text-xs" style={{ color: 'var(--accent-gold)' }}>
                  Effective yield on cost: {effectiveYield.toFixed(2)}<span style={{ fontFamily: "'DM Sans', sans-serif" }}>%</span>
                  {Number(form.pricePerShare) < 100 ? ' ↑' : ' ↓'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Summary stats */}
        <div className="card p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4">Projection Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Invested', value: fmt(totalInvested) },
              { label: 'Income Generated', value: fmt(totalGenerated), gold: true },
              { label: 'Portfolio Value', value: fmt(portfolioValue), gold: true },
              { label: 'Total Return', value: `${totalReturn.toFixed(1)}%`, gold: true },
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-xl" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                <p className="font-mono-data text-xl font-medium" style={{ ...MONO, color: stat.gold ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                  {typeof stat.value === 'string' && stat.value.endsWith('%')
                    ? <>{stat.value.slice(0, -1)}<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8em' }}>%</span></>
                    : stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card p-6 rounded-xl mb-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-lg font-semibold mb-4">Portfolio Growth Over Time</h2>
        <div style={{ position: 'relative', height: '300px' }} className="md:h-96">
          <canvas ref={chartRef} aria-label="Portfolio growth chart" role="img" />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:justify-center gap-2 sm:gap-6 mt-3 px-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ background: '#c8893a' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Portfolio Value</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ background: '#22c55e' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Cumulative Distributions</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-lg font-semibold mb-4">Projection Table</h2>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-2">
          {tableRows.map((row, i) => (
            <div key={i} className="p-3 rounded-lg" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}>
              <p className="text-sm font-semibold mb-2">{row.label}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>Portfolio Value</p>
                  <p className="font-mono-data" style={{ ...MONO, color: 'var(--accent-gold)' }}>{fmt(row.portfolio)}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>Distributions</p>
                  <p className="font-mono-data" style={{ ...MONO, color: 'var(--accent-green)' }}>{fmt(row.dist)}</p>
                </div>
                <div className="col-span-2 mt-1 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Total Value</p>
                  <p className="font-mono-data font-bold" style={MONO}>{fmt(row.portfolio + row.dist)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto -mx-2 px-2">
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Period', 'Portfolio Value', 'Cumulative Distributions', 'Total Value'].map(h => (
                  <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="py-2 px-3 font-medium">{row.label}</td>
                  <td className="py-2 px-3 font-mono-data" style={{ ...MONO, color: 'var(--accent-gold)' }}>{fmt(row.portfolio)}</td>
                  <td className="py-2 px-3 font-mono-data" style={{ ...MONO, color: 'var(--accent-green)' }}>{fmt(row.dist)}</td>
                  <td className="py-2 px-3 font-mono-data font-bold" style={MONO}>{fmt(row.portfolio + row.dist)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
