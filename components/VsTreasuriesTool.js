'use client';

import { useState } from 'react';
import SubNav from '@/components/SubNav';
import StockSelector from '@/components/StockSelector';
import Differentiator from '@/components/Differentiator';
import GoogleAd from '@/components/GoogleAd';
import AadsAd from '@/components/AadsAd';

export default function VsTreasuriesTool({ initialStock, liveYields, livePrices }) {
  const [stock, setStock] = useState(initialStock);

  function selectStock(next) {
    setStock(next);
    window.history.replaceState(null, '', `/vs-treasuries?stock=${next.toLowerCase()}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SubNav ticker={stock} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">vs Treasuries — How Does It Compare?</h1>
      <StockSelector selected={stock} onSelect={selectStock} />
      <p className="mb-3 text-sm leading-6 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
        Enter your investment details to see how {stock}&apos;s distribution yield stacks up against US
        Treasuries and an ordinary savings account over your chosen time horizon. The comparison is built
        on effective yield — the return measured against the price you actually pay — not just the headline
        rate, so it reflects a realistic entry today.
      </p>
      <p className="mb-8 text-sm leading-6 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
        Seeing the income difference in dollar terms is the clearest way to weigh the extra yield against
        the extra risk these instruments carry.{' '}
        <a href="/blog/what-is-effective-yield" style={{ color: 'var(--accent-gold)' }}>What effective yield means &rarr;</a>
      </p>
      <Differentiator ticker={stock} liveYield={liveYields[stock]} livePrice={livePrices?.[stock]} />
      <GoogleAd slot="vs-treasuries" />
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
