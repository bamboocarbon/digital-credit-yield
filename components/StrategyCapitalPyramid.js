'use client';

import { useState } from 'react';
import { STRATEGY_STACK, STRATEGY_STACK_ASOF } from '@/lib/strategyStack';

const COLOURS = {
  debt: { bg: 'rgba(75,85,99,0.55)', border: '#6b7280', text: '#d1d5db' },
  pref: { bg: 'rgba(55,65,81,0.55)', border: '#4b5563', text: '#e5e7eb' },
  common: { bg: 'rgba(17,24,39,0.9)', border: '#374151', text: '#e5e7eb' },
  highlight: { bg: 'rgba(200,137,58,0.22)', border: '#c8893a', text: '#c8893a' },
};

const fmtBn = n => `$${n >= 10 ? n.toFixed(1) : n.toFixed(2).replace(/0$/, '')}bn`;

// Block width scales with the SQUARE ROOT of market cap, relative to the largest block (MSTR
// common). A linear scale would shrink every preferred to a sliver beside ~$60bn of common
// equity; sqrt keeps them legible while still showing the credit layer is small relative to the base.
export default function StrategyCapitalPyramid({ data = STRATEGY_STACK }) {
  const [order, setOrder] = useState('seniority');
  const max = Math.max(...data.map(d => d.mcap));
  const rows = order === 'size'
    ? [...data].sort((a, b) => a.mcap - b.mcap)
    : [...data].sort((a, b) => a.rank - b.rank);

  return (
    <div style={{ margin: '2rem auto', maxWidth: '720px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.75em', fontWeight: 600, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase' }}>
          {order === 'size' ? 'Smallest at top' : 'Most senior at top'}
        </span>
        <div role="group" aria-label="Order blocks by" style={{ display: 'flex', gap: '4px' }}>
          {[['seniority', 'By seniority'], ['size', 'By size']].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setOrder(key)}
              aria-pressed={order === key}
              style={{
                fontSize: '0.75em', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
                border: `1px solid ${order === key ? '#c8893a' : '#374151'}`,
                background: order === key ? 'rgba(200,137,58,0.15)' : 'transparent',
                color: order === key ? '#c8893a' : '#9ca3af',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {rows.map(d => {
          const c = d.highlight ? COLOURS.highlight : COLOURS[d.kind];
          const pct = Math.max(14, Math.sqrt(d.mcap / max) * 100);
          return (
            <div key={d.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(70px, 110px) 1fr minmax(56px, 80px)', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ textAlign: 'right', lineHeight: 1.25 }}>
                <div style={{ fontWeight: 700, fontSize: '0.85em', color: c.text }}>{d.label}</div>
                {d.rate && <div style={{ fontSize: '0.68em', color: '#6b7280' }}>{d.rate}</div>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  title={`${d.label}: ${fmtBn(d.mcap)}${d.note ? ' · ' + d.note : ''}`}
                  style={{
                    width: `${pct}%`, height: '40px', background: c.bg, border: `1px solid ${c.border}`,
                    borderRadius: '6px', boxShadow: d.highlight ? '0 0 0 1px rgba(200,137,58,0.3)' : 'none',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: '0.8em', fontWeight: 600, color: '#9ca3af', fontVariantNumeric: 'tabular-nums' }}>
                {fmtBn(d.mcap)}
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ margin: '0.9rem 0 0', fontSize: '0.72em', color: '#4b5563', textAlign: 'center', lineHeight: 1.5 }}>
        Width shows market value on a square-root scale (not linear) so the smaller layers stay visible.
        Labels show the actual dollar figure. As of {STRATEGY_STACK_ASOF}.
      </p>
    </div>
  );
}
