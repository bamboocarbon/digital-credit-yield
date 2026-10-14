'use client';

import { useState } from 'react';
import SubNav from '@/components/SubNav';
import StockSelector from '@/components/StockSelector';
import AssetChartContent from '@/components/AssetChartContent';
import AadsAd from '@/components/AadsAd';
import { PAR_VALUE } from '@/lib/constants';
import { currencySymbol } from '@/lib/currency';

export default function ChartTool({ initialStock }) {
  const [stock, setStock] = useState(initialStock);
  const par = PAR_VALUE[stock] ?? 100;
  const cur = currencySymbol(stock);
  const parWord = stock === 'MORE' ? 'reference value' : 'par value';

  function selectStock(next) {
    setStock(next);
    window.history.replaceState(null, '', `/chart?stock=${next.toLowerCase()}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SubNav ticker={stock} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Effective Yield &amp; Price Chart</h1>
      <StockSelector selected={stock} onSelect={selectStock} />
      <p className="mb-3 mt-2 text-sm leading-6 max-w-3xl mx-auto text-center" style={{ color: 'var(--text-muted)' }}>
        This chart tracks {stock}&apos;s live market price against its {cur}{par} {parWord}, alongside the
        effective yield that price implies. Because the dividend rate is set against par, the yield you
        actually lock in depends on what you pay: buy below {cur}{par} and your effective yield runs above the
        headline rate; buy above par and it runs below.
      </p>
      <p className="mb-6 text-sm leading-6 max-w-3xl mx-auto text-center" style={{ color: 'var(--text-muted)' }}>
        Watching where the price sits relative to par is the quickest way to judge whether {stock} is
        on offer at a premium or a discount today.{' '}
        <a href="/blog/what-is-effective-yield" style={{ color: 'var(--accent-gold)' }}>More on effective yield &rarr;</a>
      </p>
      {stock === 'STRE' && (
        <div className="max-w-3xl mx-auto mb-4 px-4 py-2.5 rounded-lg text-sm text-center" style={{ background: 'var(--accent-gold-dim, rgba(212,175,55,0.1))', border: '1px solid var(--accent-gold)', color: 'var(--text)' }}>
          <strong>Read this chart with care:</strong> STRE trades on the Luxembourg Euro MTF only a handful of days a year. The line is Yahoo
          Finance&apos;s last traded price carried forward, so it can sit above or below the market maker&apos;s indicative price
          (€79.00 on Strategy&apos;s own STRE page, which is what the hub shows). Treat the effective yield here as indicative.
        </div>
      )}
      {stock === 'SATS' && (
        <div className="max-w-3xl mx-auto mb-4 px-4 py-2.5 rounded-lg text-sm text-center" style={{ background: 'var(--accent-gold-dim, rgba(212,175,55,0.1))', border: '1px solid var(--accent-gold)', color: 'var(--text)' }}>
          SATS has been announced but has not priced or started trading, so there is no price history yet. The chart will appear once it lists.
        </div>
      )}
      {/* key forces a clean remount of the chart instances when the stock changes */}
      <AssetChartContent key={stock} ticker={stock} />

      <AadsAd />

      <div className="mt-8 p-5 rounded-xl" style={{ background: 'rgba(200,137,58,0.08)', border: '1px solid var(--accent-gold)' }}>
        <p className="text-sm font-medium text-center" style={{ color: 'var(--accent-gold)' }}>Important Disclaimer</p>
        <p className="text-sm mt-2 leading-6 text-center" style={{ color: 'var(--text-muted)' }}>
          Digital Credit Yield is not a financial advisor. All content is provided for educational
          and research purposes only. Nothing on this site constitutes financial advice, investment
          advice, or a solicitation to buy or sell any financial instrument. Always consult a qualified
          financial adviser before making investment decisions.
        </p>
      </div>
    </div>
  );
}
