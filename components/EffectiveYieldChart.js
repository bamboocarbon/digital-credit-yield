'use client';

import { useEffect, useRef, useState } from 'react';
import { CHART_PERIODS } from '@/lib/constants';

function lookupRate(history, dateStr) {
  let rate = null;
  for (const entry of history) {
    if (entry.from <= dateStr) rate = entry.annualRate;
  }
  return rate;
}

export default function EffectiveYieldChart({ ticker, externalPeriod, onPeriodChange }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const effectiveSeriesRef = useRef(null);
  const announcedSeriesRef = useRef(null);
  const roRef = useRef(null);
  const [internalPeriod, setInternalPeriod] = useState('6mo');
  const period = externalPeriod ?? internalPeriod;

  function setPeriod(p) {
    setInternalPeriod(p);
    onPeriodChange?.(p);
  }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const [yieldHistory, setYieldHistory] = useState([]);

  // Fetch yield history (hardcoded + any new Yahoo Finance dividend events)
  useEffect(() => {
    fetch(`/api/yield-history/${ticker}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setYieldHistory(data); })
      .catch(() => {});
  }, [ticker]);

  // Init chart with two series
  useEffect(() => {
    let destroyed = false;

    async function init() {
      const { createChart, LineSeries, LineStyle } = await import('lightweight-charts');
      if (destroyed || !chartContainerRef.current) return;

      const chart = createChart(chartContainerRef.current, {
        layout: { background: { color: '#111827' }, textColor: '#6b7280' },
        grid: { vertLines: { color: '#1f2937' }, horzLines: { color: '#1f2937' } },
        crosshair: { mode: 1 },
        rightPriceScale: { borderColor: '#1f2937' },
        timeScale: { borderColor: '#1f2937', timeVisible: true },
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });

      // Announced rate at par — dotted pale blue step line
      const announcedSeries = chart.addSeries(LineSeries, {
        color: 'rgba(147, 197, 253, 0.65)',
        lineWidth: 3,
        lineStyle: LineStyle.Dotted,
        priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
      });

      // Effective yield from market price — solid gold line
      const effectiveSeries = chart.addSeries(LineSeries, {
        color: '#c8893a',
        lineWidth: 2,
        priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
      });

      chartRef.current = chart;
      effectiveSeriesRef.current = effectiveSeries;
      announcedSeriesRef.current = announcedSeries;
      setChartReady(true);

      roRef.current = new ResizeObserver(() => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      });
      roRef.current.observe(chartContainerRef.current);
    }

    init();
    return () => {
      destroyed = true;
      roRef.current?.disconnect();
    };
  }, []);

  // Fetch price data and compute both series
  useEffect(() => {
    if (!chartReady || yieldHistory.length === 0) return;
    setLoading(true);
    setError(false);

    fetch(`/api/chart/${ticker}?period=${period}`)
      .then(r => r.json())
      .then(data => {
        if (!data || data.error || !Array.isArray(data)) { setError(true); setLoading(false); return; }

        const effectivePoints = [];
        const announcedPoints = [];

        for (const d of data) {
          if (!d.close || !d.time) continue;
          const annualRate = lookupRate(yieldHistory, d.time);
          if (!annualRate) continue;
          effectivePoints.push({ time: d.time, value: parseFloat(((annualRate / d.close) * 100).toFixed(4)) });
          announcedPoints.push({ time: d.time, value: annualRate });
        }

        if (effectivePoints.length === 0) { setError(true); setLoading(false); return; }

        effectiveSeriesRef.current?.setData(effectivePoints);
        announcedSeriesRef.current?.setData(announcedPoints);
        chartRef.current?.timeScale().fitContent();
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [ticker, period, chartReady, yieldHistory]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1.5">
            <span style={{ display: 'inline-block', width: 20, height: 2, background: '#c8893a', borderRadius: 1 }} />
            Effective yield at market price
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ display: 'inline-block', width: 20, borderTop: '3px dotted rgba(147,197,253,0.65)' }} />
            Announced rate at par
          </span>
        </div>
        <div className="flex gap-2 ml-auto">
          {CHART_PERIODS.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className="px-3 py-2 text-sm rounded-lg font-medium min-h-[44px] transition-colors"
              style={{
                background: period === p.value ? 'var(--accent-gold)' : 'var(--bg-card)',
                color: period === p.value ? '#000' : 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10"
            style={{ background: 'var(--bg-card)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Loading chart...</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10"
            style={{ background: 'var(--bg-card)' }}>
            <span style={{ color: 'var(--accent-red)' }}>Chart data unavailable — please refresh</span>
          </div>
        )}
        <div ref={chartContainerRef} style={{ height: '400px', width: '100%' }} role="img" aria-label={`${ticker} effective yield chart`} />
      </div>

      <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
        When the gold line rises above the blue, the stock is trading below its $100 par value. Hover to see exact values.
      </p>
    </div>
  );
}
