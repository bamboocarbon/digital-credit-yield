'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ISSUERS, TICKER_COLOUR } from '@/lib/tickerDisplay';

// Issuer row shown under the main header on every page except Home. One chip per issuer; each
// maps to that issuer's ticker for now (Strategy will later expand to its other series).
const ISSUER_LIST = ISSUERS.map(i => ({ name: i.name, ticker: i.tickers[0], tickers: i.tickers }));

// The consolidated tool pages carry the active stock in ?stock=; everything else is a per-ticker hub.
const TOOL_PATHS = ['/chart', '/projector', '/vs-treasuries', '/dividends'];
const hubPath = t => `/${t.toLowerCase()}`;

function Bar() {
  const pathname = usePathname();
  const params = useSearchParams();
  if (pathname === '/') return null;

  const isTool = TOOL_PATHS.includes(pathname);
  const hubTicker = ISSUER_LIST.find(i => i.tickers.some(x => hubPath(x) === pathname))?.tickers.find(x => hubPath(x) === pathname);
  const fromParam = (params.get('stock') || 'strc').toUpperCase();
  const active = isTool ? fromParam : hubTicker;

  const hrefFor = ticker => (isTool ? `${pathname}?stock=${ticker.toLowerCase()}` : hubPath(ticker));

  return (
    <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
      <nav aria-label="Issuers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex gap-2 overflow-x-auto">
        {ISSUER_LIST.map(({ name, ticker, tickers }) => {
          const isActive = tickers.includes(active);
          const colour = TICKER_COLOUR[ticker];
          return (
            <Link
              key={ticker}
              href={hrefFor(ticker)}
              prefetch={false}
              aria-current={isActive ? 'page' : undefined}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold min-h-[36px] flex items-center gap-2 whitespace-nowrap flex-shrink-0 transition-colors"
              style={{
                background: isActive ? 'var(--bg-card-hover)' : 'transparent',
                color: isActive ? colour : 'var(--text-muted)',
                border: `1px solid ${isActive ? colour : 'transparent'}`,
              }}
            >
              <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: colour, flexShrink: 0 }} />
              {name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function IssuerBar() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}
