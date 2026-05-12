'use client';

import { useState, useEffect } from 'react';
import SubNav from '@/components/SubNav';
import GrowthProjector from '@/components/GrowthProjector';
import GoogleAd from '@/components/GoogleAd';
import { ASSET_RATES } from '@/lib/constants';

export default function AssetProjectorPage({ ticker }) {
  const [liveYield, setLiveYield] = useState(ASSET_RATES[ticker]);

  useEffect(() => {
    fetch(`/api/quote/${ticker}`)
      .then(r => r.json())
      .then(d => { if (d.dividendYield != null) setLiveYield(d.dividendYield); })
      .catch(() => {});
  }, [ticker]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SubNav ticker={ticker} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{ticker} Growth Projector</h1>
      <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
        Model your future income and portfolio growth from holding {ticker}.
        Yield is pre-filled from live data — adjust any input to recalculate instantly.
      </p>
      <GrowthProjector ticker={ticker} liveYield={liveYield} />
      <GoogleAd slot={`${ticker.toLowerCase()}-projector`} />
    </div>
  );
}
