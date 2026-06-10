'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRE_LISTING_TICKERS, STRIVE_BTC_HOLDINGS, ASSET_RATES } from '@/lib/constants';

const DESCRIPTIONS = {
  STRC: `Strategy's perpetual preferred stock paying ${ASSET_RATES.STRC.toFixed(2)}% annual dividends in semi-monthly cash (~$0.479/share twice a month). Dividend rate adjusts monthly to maintain trading near its $100 par value.`,
  SATA: `Strive's publicly traded preferred equity paying ${ASSET_RATES.SATA.toFixed(2)}% annualised in daily cash dividends (~$0.052/share/day, from 16 June 2026). Targets a $99–$101 trading range, backed by 18+ months of cash reserves and over ${STRIVE_BTC_HOLDINGS} Bitcoin.`,
  BMNP: `BitMine Immersion Technologies' Series A perpetual preferred stock paying ${ASSET_RATES.BMNP.toFixed(2)}% annually in weekly cash dividends. Expected to list on the NYSE in June 2026. Backed by Ethereum staking via the MAVAN platform.`,
};

const INCOME_BADGE = {
  STRC: 'Semi-Monthly Income',
  SATA: 'Daily Income',
  BMNP: 'Weekly Income',
};


export default function AssetCard({ ticker }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const isPreListing = PRE_LISTING_TICKERS.includes(ticker);

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
          {INCOME_BADGE[ticker]}
        </span>
      </div>

      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{DESCRIPTIONS[ticker]}</p>

      {error ? (
        isPreListing
          ? <p className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>Pending launch — live price data will appear here once trading begins.</p>
          : <p className="text-sm" style={{ color: 'var(--accent-red)' }}>Price data temporarily unavailable — please refresh</p>
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
            <span style={{marginRight:'2px'}}>{data.change >= 0 ? '+' : '-'}</span>{Math.abs(data.change)?.toFixed(2)} (<span style={{marginRight:'2px'}}>{data.changePercent >= 0 ? '+' : '-'}</span>{Math.abs(data.changePercent)?.toFixed(2)}<span style={{ fontFamily: "'DM Sans', sans-serif" }}>%</span>)
          </div>
          {data.dividendYield != null && (
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Yield: <span className="font-bold" style={{ color: 'var(--accent-gold)' }}>
                {data.dividendYield.toFixed(2)}<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8em' }}>%</span>
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
