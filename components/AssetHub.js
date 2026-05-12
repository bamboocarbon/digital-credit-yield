'use client';

import { useState, useEffect } from 'react';
import SubNav from '@/components/SubNav';
import GoogleAd from '@/components/GoogleAd';
import { ASSET_RATES } from '@/lib/constants';


const DESCRIPTIONS = {
  STRC: (
    <div className="space-y-3">
      <p>STRC is Strategy's perpetual preferred stock, listed on the Nasdaq. It pays an 11.50% annual dividend distributed monthly in cash, with the rate adjusted each month to encourage trading close to its $100 par value — making it a predictable income instrument with low price volatility. STRC is available on most major brokerage platforms.</p>
      <p>As preferred stock, STRC sits below debt but above common equity in Strategy's capital structure. In the event of liquidation, preferred stockholders are paid before common shareholders, giving STRC a degree of protection that pure equity does not offer. Strategy's holdings of over 800,000 Bitcoin provide a substantial asset base underpinning the instrument.</p>
      <p>Strategy (formerly MicroStrategy) is a Nasdaq-listed business intelligence and Bitcoin treasury company, founded in 1989. Under executive chairman Michael Saylor — one of the world's most prominent Bitcoin advocates — Strategy has made Bitcoin accumulation central to its corporate model, positioning itself as the world's largest corporate holder of Bitcoin.</p>
      <a href="https://www.strategy.com" target="_blank" rel="noopener noreferrer"
        className="inline-block text-sm underline mt-1" style={{ color: 'var(--accent-gold)' }}>
        Visit Strategy.com
      </a>
    </div>
  ),
  SATA: (
    <div className="space-y-3">
      <p>SATA is Strive's perpetual preferred equity instrument, listed on the Nasdaq. It pays a 13.00% annual dividend distributed monthly in cash, with Strive targeting a $99–$101 trading range to minimise price volatility and provide a predictable income stream. SATA is available on most major brokerage platforms.</p>
      <p>As preferred equity, SATA sits below debt but above common equity in Strive's capital structure. In the event of liquidation, preferred stockholders are paid before common shareholders, giving SATA a meaningful layer of protection relative to pure equity. Strive backs the instrument with over 13,000 Bitcoin in reserve assets and maintains 18 months of pre-funded cash reserves — providing the capacity to cover dividend payments for over 19 years.</p>
      <p>Strive is a Nasdaq-listed financial services and Bitcoin treasury company, founded in 2022 by Vivek Ramaswamy. Strive has positioned itself as a Bitcoin-first asset manager, rejecting the ESG investment model in favour of a returns-focused approach it calls excellence capitalism. The company has made Bitcoin a cornerstone of both its treasury strategy and its financial product offering.</p>
      <a href="https://www.strive.com" target="_blank" rel="noopener noreferrer"
        className="inline-block text-sm underline mt-1" style={{ color: 'var(--accent-gold)' }}>
        Visit Strive.com
      </a>
    </div>
  ),
};

export default function AssetHub({ ticker, name }) {
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

  const displayYield = data?.dividendYield ?? ASSET_RATES[ticker];
  const yieldIsLive = data?.dividendYield != null;

  // Annual dividend $ amount is fixed at par ($100), e.g. 11.50% × $100 = $11.50/year
  const annualDividendDollars = ASSET_RATES[ticker];
  // Effective yield = what you actually earn on your purchase price
  const effectiveYield = data?.price != null
    ? (annualDividendDollars / data.price) * 100
    : ASSET_RATES[ticker];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SubNav ticker={ticker} />

      {/* Asset header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {ticker} — {name}
        </h1>
        {error ? (
          <p className="text-sm" style={{ color: 'var(--accent-red)' }}>
            Price data temporarily unavailable — please refresh
          </p>
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
              <span style={{marginRight:'2px'}}>{data.change >= 0 ? '+' : '-'}</span>{Math.abs(data.change)?.toFixed(2)} (<span style={{marginRight:'2px'}}>{data.changePercent >= 0 ? '+' : '-'}</span>{Math.abs(data.changePercent)?.toFixed(2)}%)
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
            {displayYield.toFixed(2)}%
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {yieldIsLive ? 'Trailing 12-month (Yahoo Finance)' : 'Announced rate (issuer disclosed)'}
          </p>
        </div>

        <div className="card p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Effective Yield at Current Price</p>
          <p className="font-mono-data text-2xl font-bold" style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace", color: 'var(--accent-gold)' }}>
            {effectiveYield.toFixed(2)}%
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
          <p className="text-2xl font-bold">Monthly</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            ~{(annualDividendDollars / 12).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} per share/month
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-lg font-semibold mb-3">About {ticker}</h2>
        <div className="text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{DESCRIPTIONS[ticker]}</div>
      </div>

      <GoogleAd slot={`${ticker.toLowerCase()}-hub`} />
    </div>
  );
}
