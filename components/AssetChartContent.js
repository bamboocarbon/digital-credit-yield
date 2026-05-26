'use client';

import { useState } from 'react';
import EffectiveYieldChart from '@/components/EffectiveYieldChart';
import TradingViewChart from '@/components/TradingViewChart';

export default function AssetChartContent({ ticker }) {
  const [linked, setLinked]           = useState(true);
  const [sharedPeriod, setSharedPeriod] = useState('6mo');

  return (
    <>
      <div className="flex items-center justify-end mb-2">
        <button
          onClick={() => setLinked(l => !l)}
          className="px-3 py-1.5 text-xs rounded-lg font-medium transition-colors"
          style={{
            background: linked ? 'rgba(200,137,58,0.15)' : 'var(--bg-card)',
            color:      linked ? 'var(--accent-gold)' : 'var(--text-muted)',
            border:     `1px solid ${linked ? 'var(--accent-gold)' : 'var(--border)'}`,
          }}
        >
          {linked ? 'Charts linked' : 'Charts unlinked'}
        </button>
      </div>

      <EffectiveYieldChart
        ticker={ticker}
        externalPeriod={linked ? sharedPeriod : undefined}
        onPeriodChange={linked ? setSharedPeriod : undefined}
      />

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
          {ticker} Price Chart
        </h2>
        <TradingViewChart
          ticker={ticker}
          externalPeriod={linked ? sharedPeriod : undefined}
          onPeriodChange={linked ? setSharedPeriod : undefined}
        />
      </div>
    </>
  );
}
