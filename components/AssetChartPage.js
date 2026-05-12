'use client';

import { useState } from 'react';
import SubNav from '@/components/SubNav';
import EffectiveYieldChart from '@/components/EffectiveYieldChart';
import TradingViewChart from '@/components/TradingViewChart';

export default function AssetChartPage({ ticker }) {
  const [linked, setLinked] = useState(true);
  const [sharedPeriod, setSharedPeriod] = useState('6mo');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SubNav ticker={ticker} />
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold">{ticker} Effective Yield</h1>
        <button
          onClick={() => setLinked(l => !l)}
          className="px-3 py-1.5 text-xs rounded-lg font-medium transition-colors"
          style={{
            background: linked ? 'rgba(200,137,58,0.15)' : 'var(--bg-card)',
            color: linked ? 'var(--accent-gold)' : 'var(--text-muted)',
            border: `1px solid ${linked ? 'var(--accent-gold)' : 'var(--border)'}`,
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
    </div>
  );
}
