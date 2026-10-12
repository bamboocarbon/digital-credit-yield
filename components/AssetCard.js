'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRE_LISTING_TICKERS, PRE_LISTING_NOTE, ASSET_RATES, PAR_VALUE } from '@/lib/constants';
import { COMPANY } from '@/lib/tickerDisplay';
import { formatMoney } from '@/lib/currency';

const INCOME_BADGE = {
  STRC: 'Semi-Monthly Income',
  SATA: 'Daily Income',
  BMNP: 'Weekly Income',
  CHAD: 'Daily Income',
  MORE: 'Weekly Income',
};


export default function AssetCard({ ticker, mock, company, incomeBadge, rate, par, href: hrefOverride }) {
  const [data, setData] = useState(mock ?? null);
  const [error, setError] = useState(false);
  const isPreListing = PRE_LISTING_TICKERS.includes(ticker);

  useEffect(() => {
    if (mock) return; // layout-test cards supply static data, skip the live fetch
    fetch(`/api/quote/${ticker}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(true);
        else setData(d);
      })
      .catch(() => setError(true));
  }, [ticker, mock]);

  const effectiveRate = rate ?? ASSET_RATES[ticker];
  const effectivePar = par ?? PAR_VALUE[ticker] ?? 100;
  const href = hrefOverride ?? `/${ticker.toLowerCase()}`;

  return (
    <div className="card p-6 flex flex-col items-center text-center gap-4 hover:bg-[var(--bg-card-hover)] transition-colors rounded-xl"
      style={{ border: '1px solid var(--border)' }}>
      <div className="flex flex-col items-center gap-1 w-full">
        <h2 className="text-xl font-bold">{ticker}</h2>
        <span className="text-xs font-medium" style={{ color: 'var(--accent-gold)' }}>
          {incomeBadge ?? INCOME_BADGE[ticker]}
        </span>
        {/* min-h + line-clamp reserve two lines' worth of height on every card, matching CHAD's
            "DeFi Development Corp." — the longest company name — so the price/change/yield rows
            below always start at the same y position regardless of a shorter name on other cards. */}
        <div className="text-sm min-h-[2.5rem] line-clamp-2 text-center" style={{ color: 'var(--text-muted)' }}>
          {company ?? COMPANY[ticker]}
        </div>
      </div>

      {error ? (
        isPreListing
          ? <p className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>{PRE_LISTING_NOTE[ticker] ?? 'Just listed — live price data will appear here shortly.'}</p>
          : <p className="text-sm" style={{ color: 'var(--accent-red)' }}>Price data temporarily unavailable — please refresh</p>
      ) : !data ? (
        <div className="animate-pulse space-y-2 w-full">
          <div className="h-8 rounded w-full" style={{ background: 'var(--bg-card-hover)' }} />
          <div className="h-4 w-1/2 rounded mx-auto" style={{ background: 'var(--bg-card-hover)' }} />
        </div>
      ) : (
        /* Price/change and effective yield are stacked, not side by side — a side-by-side flex
           row here kept squeezing whichever piece had less natural width (the price on a card
           with a short number like CHAD's "$9.01", or the change line on a card with a longer
           one), wrapping it and knocking that card's numbers out of line with its neighbours.
           Stacking gives each line the card's full width, so nothing has to fight for room. */
        <div className="flex flex-col items-center gap-2 w-full">
          {/* Latest price */}
          <div>
            <div className="font-mono-data text-3xl font-bold" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
              {formatMoney(ticker, data.price)}
            </div>
            <div className="text-sm font-mono-data mt-1 whitespace-nowrap" style={{ fontFamily: "Arial, Helvetica, sans-serif", color: data.change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              <span style={{marginRight:'2px'}}>{data.change >= 0 ? '+' : '-'}</span>{Math.abs(data.change)?.toFixed(2)} (<span style={{marginRight:'2px'}}>{data.changePercent >= 0 ? '+' : '-'}</span>{Math.abs(data.changePercent)?.toFixed(2)}<span style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>%</span>)
            </div>
          </div>

          {/* Effective yield — annual dividend ÷ current price, scaled by the ticker's par value */}
          {data.price > 0 && effectiveRate != null && (
            <div className="flex flex-col items-center w-full pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="text-xs uppercase whitespace-nowrap" style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}>Effective Yield</span>
              <span className="font-mono-data text-xl font-bold whitespace-nowrap" style={{ fontFamily: "Arial, Helvetica, sans-serif", color: 'var(--accent-gold)' }}>
                {((effectiveRate * effectivePar / 100 / data.price) * 100).toFixed(2)}<span style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: '0.8em' }}>%</span>
              </span>
            </div>
          )}
        </div>
      )}

      <Link
        href={href}
        prefetch={false}
        className="mt-auto inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium min-h-[44px] transition-opacity hover:opacity-80"
        style={{ background: 'var(--accent-gold)', color: '#000' }}
      >
        Explore {ticker} →
      </Link>
    </div>
  );
}
