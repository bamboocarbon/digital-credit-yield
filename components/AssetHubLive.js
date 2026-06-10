'use client';

import { useState, useEffect } from 'react';
import { ASSET_RATES, PAYMENT_FREQUENCY, PRE_LISTING_TICKERS } from '@/lib/constants';

export default function AssetHubLive({ ticker }) {
  const [data, setData]   = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/quote/${ticker}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(true); else setData(d); })
      .catch(() => setError(true));
  }, [ticker]);

  const annualDividendDollars = ASSET_RATES[ticker];
  const displayYield   = data?.dividendYield ?? ASSET_RATES[ticker];
  const yieldIsLive    = data?.dividendYield != null;
  const effectiveYield = data?.price != null
    ? (annualDividendDollars / data.price) * 100
    : ASSET_RATES[ticker];
  const freq = PAYMENT_FREQUENCY[ticker] ?? { label: 'Monthly', perYear: 12, perPeriod: 'month' };
  const isPreListing = PRE_LISTING_TICKERS.includes(ticker);

  return (
    <>
      {/* Live price header */}
      <div className="mb-8">
        {error ? (
          isPreListing
            ? <p className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>Pending launch — live price data will appear here once trading begins.</p>
            : <p className="text-sm" style={{ color: 'var(--accent-red)' }}>Price data temporarily unavailable — please refresh</p>
        ) : !data ? (
          <div className="animate-pulse space-y-2 mt-4">
            <div className="h-10 w-48 rounded" style={{ background: 'var(--bg-card)' }} />
            <div className="h-5 w-32 rounded" style={{ background: 'var(--bg-card)' }} />
          </div>
        ) : (
          <div className="flex flex-wrap items-baseline gap-3 mt-2">
            <span className="font-mono-data text-4xl font-bold" style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace" }}>
              {data.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </span>
            <span className="font-mono-data text-lg"
              style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace", color: data.change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              <span style={{ marginRight: '2px' }}>{data.change >= 0 ? '+' : '-'}</span>
              {Math.abs(data.change)?.toFixed(2)} (<span style={{ marginRight: '2px' }}>{data.changePercent >= 0 ? '+' : '-'}</span>{Math.abs(data.changePercent)?.toFixed(2)}<span style={{ fontFamily: "'DM Sans', sans-serif" }}>%</span>)
            </span>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      {/* Data cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Annual Dividend Rate</p>
          <p className="font-mono-data text-2xl font-bold" style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace", color: 'var(--accent-gold)' }}>
            {displayYield.toFixed(2)}<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8em' }}>%</span>
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {yieldIsLive ? 'Trailing 12-month (Yahoo Finance)' : 'Announced rate (issuer disclosed)'}
          </p>
        </div>

        <div className="card p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Effective Yield at Current Price</p>
          <p className="font-mono-data text-2xl font-bold" style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace", color: 'var(--accent-gold)' }}>
            {effectiveYield.toFixed(2)}<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8em' }}>%</span>
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {data?.price != null
              ? data.price < 100
                ? `Buying at $${data.price.toFixed(2)} earns you more than the ${ASSET_RATES[ticker]}% par rate`
                : `Based on current price of $${data.price.toFixed(2)} vs $${annualDividendDollars.toFixed(2)} annual dividend`
              : `Based on $${annualDividendDollars.toFixed(2)} annual dividend at $100 par`}
          </p>
        </div>

        <div className="card p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Distribution Frequency</p>
          <p className="text-2xl font-bold">{freq.label}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            ~{(annualDividendDollars / freq.perYear).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} per share/{freq.perPeriod}
          </p>
        </div>
      </div>
    </>
  );
}
