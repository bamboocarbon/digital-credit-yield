import SubNav from '@/components/SubNav';
import GrowthProjector from '@/components/GrowthProjector';
import GoogleAd from '@/components/GoogleAd';
import AadsAd from '@/components/AadsAd';

export default function AssetProjectorPage({ ticker, liveYield }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SubNav ticker={ticker} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{ticker} Growth Projector</h1>
      <p className="mb-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        Model your future income and portfolio growth from holding {ticker}.
        Yield is pre-filled from live data — adjust any input to recalculate instantly.
      </p>
      <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
        All projections are hypothetical illustrations only. They assume a constant dividend yield
        and do not account for price fluctuation, reinvestment risk, tax, or changes in the dividend
        rate. Past performance is not indicative of future results.
      </p>
      <GrowthProjector ticker={ticker} liveYield={liveYield} />
      <GoogleAd slot={`${ticker.toLowerCase()}-projector`} />
      <AadsAd />

      <div className="mt-8 p-5 rounded-xl" style={{ background: 'rgba(200,137,58,0.08)', border: '1px solid var(--accent-gold)' }}>
        <p className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>Important Disclaimer</p>
        <p className="text-sm mt-2 leading-6" style={{ color: 'var(--text-muted)' }}>
          Digital Credit Yield is not a financial advisor. All content is provided for educational
          and research purposes only. Nothing on this site constitutes financial advice, investment
          advice, or a solicitation to buy or sell any financial instrument. Always consult a qualified
          financial adviser before making investment decisions.
        </p>
      </div>
    </div>
  );
}
