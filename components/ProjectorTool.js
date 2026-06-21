'use client';

import { useState } from 'react';
import SubNav from '@/components/SubNav';
import StockSelector from '@/components/StockSelector';
import GrowthProjector from '@/components/GrowthProjector';
import GoogleAd from '@/components/GoogleAd';
import AadsAd from '@/components/AadsAd';

export default function ProjectorTool({ initialStock, liveYields, livePrices }) {
  const [stock, setStock] = useState(initialStock);

  function selectStock(next) {
    setStock(next);
    // Keep the URL shareable/refreshable without triggering a navigation or refetch.
    window.history.replaceState(null, '', `/projector?stock=${next.toLowerCase()}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SubNav ticker={stock} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Growth Projector</h1>
      <StockSelector selected={stock} onSelect={selectStock} />
      <p className="mb-3 text-sm leading-6 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
        Model your future income and portfolio growth from holding {stock}. The yield is pre-filled from
        live market data, so just set an investment amount and a time horizon — every input recalculates
        instantly. Switch reinvestment on to see how compounding the dividends changes the outcome over
        longer periods, and compare the result against US Treasuries and a savings account side by side.
      </p>
      <p className="mb-3 text-sm leading-6 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
        In my experience the single biggest driver of the long-run figure isn&apos;t the headline rate at
        all — it&apos;s whether you reinvest the dividends or take them as cash.{' '}
        <a href="/blog/how-to-use-the-growth-projector" style={{ color: 'var(--accent-gold)' }}>How to use this tool &rarr;</a>
      </p>
      <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
        All projections are hypothetical illustrations only. They assume a constant dividend yield
        and do not account for price fluctuation, reinvestment risk, tax, or changes in the dividend
        rate. Past performance is not indicative of future results.
      </p>
      <GrowthProjector ticker={stock} liveYield={liveYields[stock]} livePrice={livePrices?.[stock]} />
      <GoogleAd slot="projector" />
      <AadsAd />

      <div className="mt-8 p-5 rounded-xl" style={{ background: 'rgba(200,137,58,0.08)', border: '1px solid var(--accent-gold)' }}>
        <p className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>Important Disclaimer</p>
        <p className="text-sm mt-2 leading-6" style={{ color: 'var(--text-muted)' }}>
          Digital Credit Yield is not a financial advisor. All content is provided for educational
          and research purposes only. Nothing on this site constitutes financial advice, investment
          advice, or a solicitation to buy or sell any financial instrument. Always consult a qualified
          financial adviser before making investment decisions.
        </p>
      </div>
    </div>
  );
}
