import SubNav from '@/components/SubNav';
import GrowthProjector from '@/components/GrowthProjector';
import GoogleAd from '@/components/GoogleAd';

export default function AssetProjectorPage({ ticker, liveYield }) {
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
