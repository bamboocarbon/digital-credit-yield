'use client';

import { useEffect, useRef, useState } from 'react';
import { CHART_PERIODS } from '@/lib/constants';

export default function TradingViewChart({ ticker, externalPeriod, onPeriodChange }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
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

  useEffect(() => {
    let destroyed = false;

    async function init() {
      const { createChart, CandlestickSeries } = await import('lightweight-charts');
      if (destroyed || !chartContainerRef.current) return;

      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: '#111827' },
          textColor: '#6b7280',
        },
        grid: {
          vertLines: { color: '#1f2937' },
          horzLines: { color: '#1f2937' },
        },
        crosshair: { mode: 1 },
        rightPriceScale: { borderColor: '#1f2937' },
        timeScale: { borderColor: '#1f2937', timeVisible: true },
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });

      const series = chart.addSeries(CandlestickSeries, {
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });

      chartRef.current = chart;
      seriesRef.current = series;
      setChartReady(true);

      roRef.current = new ResizeObserver(() => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
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

  useEffect(() => {
    if (!seriesRef.current) return;
    setLoading(true);
    setError(false);

    fetch(`/api/chart/${ticker}?period=${period}`)
      .then(r => r.json())
      .then(data => {
        if (!data || data.error || !Array.isArray(data)) { setError(true); return; }
        const candles = data
          .filter(d => d.open && d.high && d.low && d.close)
          .map(d => ({ time: d.time, open: d.open, high: d.high, low: d.low, close: d.close }));
        seriesRef.current?.setData(candles);
        chartRef.current?.timeScale().fitContent();
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [ticker, period, chartReady]);

  return (
    <div>
      {/* Timeframe selector */}
      <div className="flex justify-end gap-2 mb-4">
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

      {/* Chart */}
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
        <div ref={chartContainerRef} style={{ height: '400px', width: '100%' }} role="img" aria-label={`${ticker} price chart`} />
      </div>
    </div>
  );
}
