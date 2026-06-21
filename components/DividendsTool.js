'use client';

import { useState } from 'react';
import SubNav from '@/components/SubNav';
import StockSelector from '@/components/StockSelector';
import DividendHistoryPage from '@/components/DividendHistoryPage';

export default function DividendsTool({ initialStock, dividendsByStock }) {
  const [stock, setStock] = useState(initialStock);

  function selectStock(next) {
    setStock(next);
    window.history.replaceState(null, '', `/dividends?stock=${next.toLowerCase()}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SubNav ticker={stock} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Dividend History</h1>
      <StockSelector selected={stock} onSelect={selectStock} />
      <p className="mb-6 mt-2 text-sm leading-6 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
        A complete record of every {stock} dividend — the per-share amount, the record date you need to
        own the shares by, and the date the cash actually lands. Enter a holding size to see what each
        payment is worth to you. The three instruments pay on different rhythms — STRC semi-monthly, SATA
        daily, BMNP weekly — but the annual yield is the same however often it arrives.{' '}
        <a href="/blog/monthly-vs-daily-dividends" style={{ color: 'var(--accent-gold)' }}>Does payment frequency matter? &rarr;</a>
      </p>
      <DividendHistoryPage ticker={stock} dividends={dividendsByStock[stock] || []} />
    </div>
  );
}
