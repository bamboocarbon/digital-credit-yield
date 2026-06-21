'use client';

import { BMNP_ENABLED } from '@/lib/constants';

// Brand colours — must stay in sync with Differentiator.js, insightEngine.js and generateMp4.js
const TICKER_COLOUR = { STRC: '#4ade80', SATA: '#3b82f6', BMNP: '#fde047' };
const COMPANY = { STRC: 'Strategy', SATA: 'Strive', BMNP: 'Bitmine' };

const ALL = ['STRC', 'SATA', 'BMNP'];

// Visible tickers respect the BMNP feature flag.
export const SELECTABLE_TICKERS = ALL.filter(t => t !== 'BMNP' || BMNP_ENABLED);

export default function StockSelector({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Choose a stock">
      {SELECTABLE_TICKERS.map(ticker => {
        const active = ticker === selected;
        const colour = TICKER_COLOUR[ticker];
        return (
          <button
            key={ticker}
            type="button"
            onClick={() => onSelect(ticker)}
            aria-pressed={active}
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
          </button>
        );
      })}
    </div>
  );
}
