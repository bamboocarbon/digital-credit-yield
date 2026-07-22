import Link from 'next/link';
import { SELECTABLE_TICKERS, TICKER_COLOUR, COMPANY } from '@/components/StockSelector';

// Same look as StockSelector, but for the per-ticker hub pages (/strc, /sata, /bmnp),
// which are separate routes with their own SEO metadata rather than a single page
// driven by client state — so this navigates via <Link> instead of an onSelect callback.
export default function HubStockSelector({ selected }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Choose a stock">
      {SELECTABLE_TICKERS.map(ticker => {
        const active = ticker === selected;
        const colour = TICKER_COLOUR[ticker];
        return (
          <Link
            key={ticker}
            href={`/${ticker.toLowerCase()}`}
            aria-current={active ? 'page' : undefined}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] flex items-center gap-2"
            style={{
              background: active ? 'var(--bg-card-hover)' : 'var(--bg-card)',
              color: active ? colour : 'var(--text-muted)',
              border: `1px solid ${active ? colour : 'var(--border)'}`,
            }}
          >
            <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: colour, flexShrink: 0 }} />
            {ticker}
            <span className="hidden sm:inline font-normal" style={{ color: 'var(--text-muted)' }}>
              {COMPANY[ticker]}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
