'use client';

import { useState, useEffect } from 'react';
import { formatMoney, currencySymbol } from '@/lib/currency';
import { ASSET_RATES, PAYMENT_FREQUENCY, DIVIDEND_RESERVE, PAR_VALUE } from '@/lib/constants';

export default function AssetHubLive({ ticker }) {
  const [data, setData]   = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/quote/${ticker}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(true); else setData(d); })
      .catch(() => setError(true));
  }, [ticker]);

  const par = PAR_VALUE[ticker] ?? 100;
  const annualDividendDollars = ASSET_RATES[ticker] * (par / 100);
  const displayYield   = data?.dividendYield ?? ASSET_RATES[ticker];
  const yieldIsLive    = data?.dividendYield != null;
  const effectiveYield = data?.price != null
    ? (annualDividendDollars / data.price) * 100
    : ASSET_RATES[ticker];
  const freq = PAYMENT_FREQUENCY[ticker] ?? { label: 'Monthly', perYear: 12, perPeriod: 'month' };
  const reserve = DIVIDEND_RESERVE[ticker];
  const cur = currencySymbol(ticker);

  return (
    <>
      {/* Data cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${reserve ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 mb-8`}>
        <div className="card p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Annual Dividend Rate</p>
          <p className="font-mono-data text-2xl font-bold" style={{ fontFamily: "Arial, Helvetica, sans-serif", color: 'var(--accent-gold)' }}>
            {displayYield.toFixed(2)}<span style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: '0.8em' }}>%</span>
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {yieldIsLive ? 'Trailing 12-month (Yahoo Finance)' : 'Announced rate (issuer disclosed)'}
          </p>
        </div>

        <div className="card p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Effective Yield at Current Price</p>
          <p className="font-mono-data text-2xl font-bold" style={{ fontFamily: "Arial, Helvetica, sans-serif", color: 'var(--accent-gold)' }}>
            {effectiveYield.toFixed(2)}<span style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: '0.8em' }}>%</span>
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {data?.price != null
              ? data.price < par
                ? `Buying at ${cur}${data.price.toFixed(2)} earns you more than the ${ASSET_RATES[ticker]}% par rate`
                : `Based on current price of ${cur}${data.price.toFixed(2)} vs ${cur}${annualDividendDollars.toFixed(2)} annual dividend`
              : `Based on ${cur}${annualDividendDollars.toFixed(2)} annual dividend at ${cur}${par} ${ticker === 'MORE' ? 'reference value' : 'par'}`}
          </p>
        </div>

        <div className="card p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Distribution Frequency</p>
          <p className="text-2xl font-bold">{freq.label}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            ~{formatMoney(ticker, annualDividendDollars / freq.perYear)} per share/{freq.perPeriod}
          </p>
        </div>

        {reserve && (
          <div className="card p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{reserve.label}</p>
            <p className="font-mono-data text-2xl font-bold" style={{ fontFamily: "Arial, Helvetica, sans-serif", color: 'var(--accent-gold)' }}>
              {reserve.display}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{reserve.note}</p>
          </div>
        )}
      </div>
    </>
  );
}
