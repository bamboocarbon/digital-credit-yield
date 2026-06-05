'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { saveProjectorState, loadProjectorState, defaultProjectorState } from '@/lib/projectorState';
import { runProjection, computeAPY, HORIZON_MONTHS as horizonMonths, HORIZON_LABELS as horizonLabels, fmt, fmtNum, stripNum } from '@/lib/projectorEngine';
import NumericInput from '@/components/NumericInput';

const pct = (a, b) => (((a - b) / b) * 100).toFixed(1);


const defaultBenchmarks = { bank: 0.5, highYield: 4.2, treasury: 5.0 };

export default function Differentiator({ ticker, liveYield }) {
  const mainChartRef = useRef(null);
  const mainChartInstance = useRef(null);
  const diffChartRef = useRef(null);
  const diffChartInstance = useRef(null);

  const [form, setForm] = useState(() => ({
    ...defaultProjectorState,
    annualYield: liveYield ?? defaultProjectorState.annualYield,
  }));
  const [benchmarks, setBenchmarks] = useState(defaultBenchmarks);

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

  const step = months <= 24 ? 1 : 12;

  // SATA uses 250 business-day compounding; BMNP uses 52 weekly; benchmarks stay at 12
  const paymentsPerYear = ticker === 'SATA' ? 250 : ticker === 'BMNP' ? 52 : 12;

  const assetData = useMemo(
    () => runProjection(startValue, effectiveYield, Number(form.monthlyContribution), Number(form.reinvestmentPct), months, paymentsPerYear),
    [startValue, effectiveYield, form.monthlyContribution, form.reinvestmentPct, months, paymentsPerYear]
  );
  const treasuryData = useMemo(
    () => runProjection(startValue, benchmarks.treasury, Number(form.monthlyContribution), Number(form.reinvestmentPct), months),
    [startValue, benchmarks.treasury, form.monthlyContribution, form.reinvestmentPct, months]
  );
  const highYieldData = useMemo(
    () => runProjection(startValue, benchmarks.highYield, Number(form.monthlyContribution), Number(form.reinvestmentPct), months),
    [startValue, benchmarks.highYield, form.monthlyContribution, form.reinvestmentPct, months]
  );
  const bankData = useMemo(
    () => runProjection(startValue, benchmarks.bank, Number(form.monthlyContribution), Number(form.reinvestmentPct), months),
    [startValue, benchmarks.bank, form.monthlyContribution, form.reinvestmentPct, months]
  );
  const indices = useMemo(
    () => Array.from({ length: Math.floor(months / step) + 1 }, (_, i) => i * step),
    [months, step]
  );

  const assetFinal = assetData[months].portfolio + assetData[months].cashDistributions;
  const treasuryFinal = treasuryData[months].portfolio + treasuryData[months].cashDistributions;
  const highYieldFinal = highYieldData[months].portfolio + highYieldData[months].cashDistributions;
  const bankFinal = bankData[months].portfolio + bankData[months].cashDistributions;

  const annualYield = Number(form.annualYield);
  const assetMonthlyStart = startValue > 0 ? (startValue * effectiveYield) / 100 / 12 : 0;
  const treasuryMonthlyStart = startValue > 0 ? (startValue * benchmarks.treasury) / 100 / 12 : 0;
  const highYieldMonthlyStart = startValue > 0 ? (startValue * benchmarks.highYield) / 100 / 12 : 0;
  const bankMonthlyStart = startValue > 0 ? (startValue * benchmarks.bank) / 100 / 12 : 0;

  const assetMonthlyEnd = (assetData[months].portfolio * effectiveYield) / 100 / 12;
  const treasuryMonthlyEnd = (treasuryData[months].portfolio * benchmarks.treasury) / 100 / 12;
  const highYieldMonthlyEnd = (highYieldData[months].portfolio * benchmarks.highYield) / 100 / 12;
  const bankMonthlyEnd = (bankData[months].portfolio * benchmarks.bank) / 100 / 12;

  const reinvesting = Number(form.reinvestmentPct) > 0;

  const horizonLabel = horizonLabels[form.horizon];

  // Main chart
  useEffect(() => {
    let destroyed = false;
    async function drawMain() {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      if (destroyed) return;
      const ctx = mainChartRef.current?.getContext('2d');
      if (!ctx) return;
      if (mainChartInstance.current) mainChartInstance.current.destroy();

      const labels = indices.map(i => step === 1 ? `M${i}` : `Y${i / 12}`);

      mainChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: ticker, data: indices.map(i => assetData[i].portfolio + assetData[i].cashDistributions), borderColor: '#c8893a', backgroundColor: 'rgba(200,137,58,0.05)', tension: 0.3, borderWidth: 2 },
            { label: `US Treasuries (~ ${benchmarks.treasury}%)`, data: indices.map(i => treasuryData[i].portfolio + treasuryData[i].cashDistributions), borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.05)', tension: 0.3, borderWidth: 2 },
            { label: `High-Yield Savings (~ ${benchmarks.highYield}%)`, data: indices.map(i => highYieldData[i].portfolio + highYieldData[i].cashDistributions), borderColor: '#14b8a6', backgroundColor: 'rgba(20,184,166,0.05)', tension: 0.3, borderWidth: 2 },
            { label: `Bank Savings (~ ${benchmarks.bank}%)`, data: indices.map(i => bankData[i].portfolio + bankData[i].cashDistributions), borderColor: '#6b7280', backgroundColor: 'rgba(107,114,128,0.05)', tension: 0.3, borderWidth: 2 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: [`Total Value Over Time (Portfolio + Cash Received)`, `${ticker} vs Traditional Yield Options`], color: '#f9fafb', font: { size: 13 } },
            tooltip: { titleFont: { size: 12 }, bodyFont: { size: 11 }, callbacks: { label: c => `${c.dataset.label}: ${fmt(c.raw)}` } },
          },
          scales: {
            x: { ticks: { color: '#6b7280', maxTicksLimit: 8 }, grid: { color: '#1f2937' } },
            y: { ticks: { color: '#6b7280', callback: v => fmt(v) }, grid: { color: '#1f2937' } },
          },
        },
      });
    }
    drawMain();
    return () => { destroyed = true; };
  }, [assetData, treasuryData, highYieldData, bankData, indices, step, ticker, benchmarks]);

  // Difference chart
  useEffect(() => {
    let destroyed = false;
    async function drawDiff() {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      if (destroyed) return;
      const ctx = diffChartRef.current?.getContext('2d');
      if (!ctx) return;
      if (diffChartInstance.current) diffChartInstance.current.destroy();

      const labels = indices.map(i => step === 1 ? `M${i}` : `Y${i / 12}`);
      const diffData = indices.map(i =>
        (assetData[i].portfolio + assetData[i].cashDistributions) -
        (treasuryData[i].portfolio + treasuryData[i].cashDistributions)
      );

      diffChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: `Advantage over US Treasuries ($)`,
            data: diffData,
            borderColor: '#c8893a',
            backgroundColor: 'rgba(200,137,58,0.15)',
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            segment: {
              borderColor: ctx => ctx.p0.parsed.y < 0 ? '#ef4444' : '#c8893a',
              backgroundColor: ctx => ctx.p0.parsed.y < 0 ? 'rgba(239,68,68,0.1)' : 'rgba(200,137,58,0.15)',
            },
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#6b7280', font: { size: 11 } } },
            tooltip: { titleFont: { size: 12 }, bodyFont: { size: 11 }, callbacks: { label: c => `Advantage: ${fmt(c.raw)}` } },
          },
          scales: {
            x: { ticks: { color: '#6b7280', maxTicksLimit: 8 }, grid: { color: '#1f2937' } },
            y: { ticks: { color: '#6b7280', callback: v => fmt(v) }, grid: { color: '#1f2937' } },
          },
        },
      });
    }
    drawDiff();
    return () => { destroyed = true; };
  }, [assetData, treasuryData, indices, step]);

  const rows = [
    { label: ticker, final: assetFinal, color: 'var(--accent-gold)' },
    { label: `US Treasuries (~ ${benchmarks.treasury}%)`, final: treasuryFinal, color: 'var(--text-primary)' },
    { label: `High-Yield Savings (~ ${benchmarks.highYield}%)`, final: highYieldFinal, color: 'var(--text-primary)' },
    { label: `Bank Savings (~ ${benchmarks.bank}%)`, final: bankFinal, color: 'var(--text-muted)' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Input panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 max-w-5xl mx-auto w-full">

        {/* Investment Details — 2-col × 3-row grid, matching GrowthProjector */}
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
                    className="w-full px-3 py-2 rounded-lg text-sm font-mono-data text-center"
                    style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace", background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                ) : (
                  <input type="text" inputMode="numeric" placeholder="e.g. 1,000" value={fmtNum(form.numShares)}
                    onChange={e => update('numShares', stripNum(e.target.value))}
                    aria-label="Number of shares"
                    className="w-full px-3 py-2 rounded-lg text-sm font-mono-data text-center"
                    style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace", background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                )}
              </div>
              <div style={{ opacity: form.inputMode === 'shares' ? 1 : 0.35, transition: 'opacity 0.2s' }}>
                <NumericInput value={form.pricePerShare} step={0.01} min={0}
                  onChange={val => update('pricePerShare', val)}
                  disabled={form.inputMode !== 'shares'}
                  aria-label="Price per share in dollars"
                  className="w-full px-3 py-2 rounded-lg text-sm font-mono-data text-center"
                  style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <NumericInput value={form.annualYield} step={0.1} min={0}
                  onChange={val => update('annualYield', val)}
                  aria-label="Annual yield percentage"
                  className="w-full px-3 py-2 rounded-lg text-sm font-mono-data text-center"
                  style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>
            </div>

            {/* Row 2 — 2 columns: Time Horizon | Monthly */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Time Horizon</label>
                <select value={form.horizon} onChange={e => update('horizon', e.target.value)}
                  aria-label="Time horizon"
                  className="w-full px-3 py-2 rounded-lg text-sm text-center"
                  style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace", background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)', textAlignLast: 'center', WebkitAppearance: 'none', appearance: 'none' }}>
                  {Object.keys(horizonMonths).map(h => <option key={h} value={h}>{horizonLabels[h]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Monthly ($)</label>
                <input type="text" inputMode="numeric" value={fmtNum(form.monthlyContribution)}
                  onChange={e => update('monthlyContribution', stripNum(e.target.value))}
                  aria-label="Monthly contribution in dollars"
                  className="w-full px-3 py-2 rounded-lg text-sm font-mono-data text-center"
                  style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
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

        {/* Benchmark Rates — always visible, 2-col grid to match height */}
        <div className="card p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4">Benchmark Rates</h2>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Bank Savings (%)', key: 'bank' },
              { label: 'High-Yield / ISA (%)', key: 'highYield' },
              { label: 'US Treasuries / Gilts (%)', key: 'treasury' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</label>
                <NumericInput value={benchmarks[key]} step={0.1} min={0}
                  onChange={val => setBenchmarks(prev => ({ ...prev, [key]: parseFloat(val) || 0 }))}
                  aria-label={`${label} benchmark rate`}
                  className="w-full px-3 py-2 rounded-lg text-sm font-mono-data text-center"
                  style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>
            ))}
          </div>

          <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
            Adjust these rates to reflect current market conditions for an accurate comparison.
          </p>
        </div>
      </div>

      {/* Main chart */}
      <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div style={{ position: 'relative', height: '320px' }} className="md:h-96">
          <canvas ref={mainChartRef} aria-label="Portfolio value comparison chart" role="img" />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 px-1 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2">
          {[
            { color: '#c8893a', name: ticker, rate: null },
            { color: '#3b82f6', name: 'US Treasuries', rate: `~ ${benchmarks.treasury}%` },
            { color: '#14b8a6', name: 'High-Yield Savings', rate: `~ ${benchmarks.highYield}%` },
            { color: '#6b7280', name: 'Bank Savings', rate: `~ ${benchmarks.bank}%` },
          ].map(({ color, name, rate }) => (
            <div key={name} className="flex items-center gap-2 min-w-0">
              <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ background: color }} />
              <span className="text-[10px] sm:text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
                {name}{rate && <span style={{ whiteSpace: 'nowrap' }}> ({rate})</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Difference chart */}
      <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-lg font-semibold mb-4">Advantage over US Treasuries</h2>
        <div style={{ position: 'relative', height: '240px' }} className="md:h-72">
          <canvas ref={diffChartRef} aria-label="Advantage over US Treasuries chart" role="img" />
        </div>
      </div>

      {/* Summary table */}
      <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-lg font-semibold mb-4">End of Period Comparison —{' '}
          <span style={{ whiteSpace: 'nowrap' }}>{horizonLabel.replace(/s$/, '')} Projection</span>
        </h2>
        {/* Mobile cards */}
        <div className="sm:hidden space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="p-3 rounded-lg" style={{ background: 'var(--bg-card-hover)', border: `1px solid ${i === 0 ? 'var(--accent-gold)' : 'var(--border)'}` }}>
              <p className="text-sm font-semibold mb-2" style={{ color: row.color }}>{row.label}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>Final Value</p>
                  <p className="font-mono-data" style={{ fontFamily: "'Roboto Mono','Courier New',monospace", color: row.color }}>{fmt(row.final)}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>Total Gain</p>
                  <p className="font-mono-data" style={{ fontFamily: "'Roboto Mono','Courier New',monospace", color: row.final > startValue ? 'var(--accent-green)' : 'var(--accent-red)' }}>+{fmt(row.final - startValue)}</p>
                </div>
                {i !== rows.length - 1 && (
                  <div className="col-span-2 mt-1 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>vs Bank Savings</p>
                    <p className="font-mono-data" style={{ fontFamily: "'Roboto Mono','Courier New',monospace", color: i === 0 ? 'var(--accent-gold)' : 'var(--text-muted)' }}>+{fmt(row.final - bankFinal)} more</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto -mx-2 px-2">
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Asset', 'Final Value', 'Total Gain', 'vs Bank Savings'].map(h => (
                  <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i === 0 ? 'rgba(200,137,58,0.05)' : 'transparent' }}>
                  <td className="py-2 px-3 font-medium" style={{ color: row.color }}>{row.label}</td>
                  <td className="py-2 px-3 font-mono-data" style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace", color: row.color }}>{fmt(row.final)}</td>
                  <td className="py-2 px-3 font-mono-data" style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace", color: row.final > startValue ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                    <span style={{marginRight:'2px'}}>+</span>{fmt(row.final - startValue)}
                  </td>
                  <td className="py-2 px-3 font-mono-data" style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace", color: i === 0 ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                    {i === rows.length - 1 ? '—' : <><span style={{marginRight:'2px'}}>+</span>{fmt(row.final - bankFinal)} more</>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly income comparison */}
      {startValue > 0 && (
        <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-1">Monthly Income Comparison</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            {reinvesting
              ? `Monthly cash income at start vs end of ${horizonLabel.toLowerCase()} — grows as ${form.reinvestmentPct}% reinvestment compounds the portfolio.`
              : `Cash distributions per month on ${fmt(startValue)} with 0% reinvestment.`}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* ETF — highlighted */}
            <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'rgba(200,137,58,0.12)', border: '2px solid var(--accent-gold)' }}>
              <p className="text-xs font-semibold" style={{ color: 'var(--accent-gold)' }}>{ticker} — {annualYield.toFixed(1)}<span style={{ fontFamily: "'DM Sans', sans-serif" }}>%</span></p>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Start</p>
                <p className="font-mono-data text-lg font-bold" style={{ fontFamily: "'PercentFix','Roboto Mono','Courier New',monospace", color: 'var(--accent-gold)' }}>
                  {fmt(assetMonthlyStart)}<span className="text-xs font-normal">/mo</span>
                </p>
              </div>
              {reinvesting && (
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>End of {horizonLabel}</p>
                  <p className="font-mono-data text-lg font-bold" style={{ fontFamily: "'PercentFix','Roboto Mono','Courier New',monospace", color: 'var(--accent-gold)' }}>
                    {fmt(assetMonthlyEnd)}<span className="text-xs font-normal">/mo</span>
                  </p>
                </div>
              )}
            </div>

            {/* Benchmarks */}
            {[
              { label: 'US Treasuries', start: treasuryMonthlyStart, end: treasuryMonthlyEnd, rate: benchmarks.treasury },
              { label: 'High-Yield / ISA', start: highYieldMonthlyStart, end: highYieldMonthlyEnd, rate: benchmarks.highYield },
              { label: 'Bank Savings', start: bankMonthlyStart, end: bankMonthlyEnd, rate: benchmarks.bank },
            ].map(({ label, start, end, rate }) => (
              <div key={label} className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{label} — {rate.toFixed(1)}<span style={{ fontFamily: "'DM Sans', sans-serif" }}>%</span></p>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Start</p>
                  <p className="font-mono-data text-lg font-medium" style={{ fontFamily: "'PercentFix','Roboto Mono','Courier New',monospace", color: 'var(--text-primary)' }}>
                    {fmt(start)}<span className="text-xs font-normal">/mo</span>
                  </p>
                </div>
                {reinvesting && (
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>End of {horizonLabel}</p>
                    <p className="font-mono-data text-lg font-medium" style={{ fontFamily: "'PercentFix','Roboto Mono','Courier New',monospace", color: 'var(--text-primary)' }}>
                      {fmt(end)}<span className="text-xs font-normal">/mo</span>
                    </p>
                  </div>
                )}
                {assetMonthlyEnd > end && (
                  <p className="text-xs font-semibold mt-1 pt-1" style={{ color: 'var(--accent-gold)', borderTop: '1px solid var(--border)' }}>
                    +{fmt(assetMonthlyEnd - end)}/mo more with {ticker} by end
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic callout */}
      <div className="card p-6 rounded-xl mb-6 text-center"
        style={{ background: 'rgba(200,137,58,0.1)', border: '1px solid var(--accent-gold)' }}>
        <p className="text-base font-semibold leading-7">
          Over {horizonLabel}, {ticker} delivers{' '}
          <span style={{ color: 'var(--accent-gold)' }}>{fmt(assetFinal - treasuryFinal)} more</span> than US Treasuries and{' '}
          <span style={{ color: 'var(--accent-gold)' }}>{fmt(assetFinal - bankFinal)} more</span> than a standard bank account — on the same{' '}
          <span style={{ color: 'var(--accent-gold)' }}>{fmt(startValue)}</span> investment.
        </p>
        {startValue > 0 && assetMonthlyEnd > bankMonthlyEnd && (
          <p className="text-sm mt-2 leading-6" style={{ color: 'var(--text-muted)' }}>
            {reinvesting ? `By end of ${horizonLabel}, monthly income grows to ` : 'That is '}
            <span style={{ color: 'var(--accent-gold)' }}>{fmt(assetMonthlyEnd)}/month</span> with {ticker} — vs{' '}
            <span style={{ color: 'var(--text-primary)' }}>{fmt(treasuryMonthlyEnd)}/month</span> from Treasuries and{' '}
            <span style={{ color: 'var(--text-primary)' }}>{fmt(bankMonthlyEnd)}/month</span> from a bank account.
          </p>
        )}
      </div>

      {/* Outperformance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: `${ticker} vs Bank`, diff: pct(assetFinal, bankFinal) },
          { label: `${ticker} vs High-Yield`, diff: pct(assetFinal, highYieldFinal) },
          { label: `${ticker} vs Treasuries`, diff: pct(assetFinal, treasuryFinal) },
        ].map(({ label, diff }) => (
          <div key={label} className="card p-5 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="font-mono-data text-2xl font-bold" style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace", color: 'var(--accent-gold)' }}>
              <span style={{marginRight:'2px'}}>+</span>{diff}% more
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-center pb-4" style={{ color: 'var(--text-muted)' }}>
        Projections are illustrative only and do not constitute financial advice. Past performance is not a guarantee of future results.
        Benchmark rates are user-defined and should be verified against current market rates.
      </p>
    </div>
  );
}
