'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const DESCRIPTIONS = {
  STRC: "Strategy's perpetual preferred stock paying 11.50% annual dividends in monthly cash. Dividend rate adjusts monthly to maintain trading near its $100 par value.",
  SATA: "Strive's publicly traded preferred equity paying 13.00% annualised in monthly dividends. Targets a $99–$101 trading range, backed by 18+ months of cash reserves and over 13,000 Bitcoin.",
};


export default function AssetCard({ ticker }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/quote/${ticker}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(true);
        else setData(d);
      })
      .catch(() => setError(true));
  }, [ticker]);

  const href = `/${ticker.toLowerCase()}`;

  return (
    <div className="card p-6 flex flex-col gap-4 hover:bg-[var(--bg-card-hover)] transition-colors rounded-xl"
      style={{ border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{ticker}</h2>
        <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-card-hover)', color: 'var(--accent-gold)' }}>
          Monthly Income
        </span>
      </div>

      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{DESCRIPTIONS[ticker]}</p>

      {error ? (
        <p className="text-sm" style={{ color: 'var(--accent-red)' }}>Price data temporarily unavailable — please refresh</p>
      ) : !data ? (
        <div className="animate-pulse space-y-2">
          <div className="h-8 rounded" style={{ background: 'var(--bg-card-hover)' }} />
          <div className="h-4 w-1/2 rounded" style={{ background: 'var(--bg-card-hover)' }} />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="font-mono-data text-3xl font-bold" style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace" }}>
            {data.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </div>
          <div className="text-sm font-mono-data" style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace", color: data.change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            <span style={{marginRight:'2px'}}>{data.change >= 0 ? '+' : '-'}</span>{Math.abs(data.change)?.toFixed(2)} (<span style={{marginRight:'2px'}}>{data.changePercent >= 0 ? '+' : '-'}</span>{Math.abs(data.changePercent)?.toFixed(2)}%)
          </div>
          {data.dividendYield != null && (
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Yield: <span className="font-bold" style={{ color: 'var(--accent-gold)' }}>
                {data.dividendYield.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      )}

      <Link
        href={href}
        className="mt-auto inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium min-h-[44px] transition-opacity hover:opacity-80"
        style={{ background: 'var(--accent-gold)', color: '#000' }}
      >
        Explore {ticker} →
      </Link>
    </div>
  );
}
