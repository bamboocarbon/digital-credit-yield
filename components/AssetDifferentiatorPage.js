import SubNav from '@/components/SubNav';
import Differentiator from '@/components/Differentiator';
import GoogleAd from '@/components/GoogleAd';

export default function AssetDifferentiatorPage({ ticker, liveYield }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SubNav ticker={ticker} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        The Differentiator — How Does {ticker} Compare?
      </h1>
      <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
        Enter your investment details below to see how {ticker}'s high distribution yield compares
        to traditional savings and fixed income options over your chosen time horizon.
      </p>
      <Differentiator ticker={ticker} liveYield={liveYield} />
      <GoogleAd slot={`${ticker.toLowerCase()}-differentiator`} />
    </div>
  );
}
