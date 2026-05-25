import SubNav from '@/components/SubNav';
import GoogleAd from '@/components/GoogleAd';
import AssetHubLive from '@/components/AssetHubLive';

const DESCRIPTIONS = {
  STRC: (
    <div className="space-y-3">
      <p>STRC is Strategy&apos;s perpetual preferred stock, listed on the Nasdaq. It pays an 11.50% annual dividend distributed monthly in cash, with the rate adjusted each month to encourage trading close to its $100 par value — making it a predictable income instrument with low price volatility. STRC is available on most major brokerage platforms.</p>
      <p>As preferred stock, STRC sits below debt but above common equity in Strategy&apos;s capital structure. In the event of liquidation, preferred stockholders are paid before common shareholders, giving STRC a degree of protection that pure equity does not offer. Strategy&apos;s holdings of over 800,000 Bitcoin provide a substantial asset base underpinning the instrument.</p>
      <p>Strategy (formerly MicroStrategy) is a Nasdaq-listed business intelligence and Bitcoin treasury company, founded in 1989. Under executive chairman Michael Saylor — one of the world&apos;s most prominent Bitcoin advocates — Strategy has made Bitcoin accumulation central to its corporate model, positioning itself as the world&apos;s largest corporate holder of Bitcoin.</p>
      <a href="https://www.strategy.com" target="_blank" rel="noopener noreferrer"
        className="inline-block text-sm underline mt-1" style={{ color: 'var(--accent-gold)' }}>
        Visit Strategy.com
      </a>
    </div>
  ),
  SATA: (
    <div className="space-y-3">
      <p>SATA is Strive&apos;s perpetual preferred equity instrument, listed on the Nasdaq. It pays a 13.00% annual dividend distributed monthly in cash, with Strive targeting a $99–$101 trading range to minimise price volatility and provide a predictable income stream. SATA is available on most major brokerage platforms.</p>
      <p>As preferred equity, SATA sits below debt but above common equity in Strive&apos;s capital structure. In the event of liquidation, preferred stockholders are paid before common shareholders, giving SATA a meaningful layer of protection relative to pure equity. Strive backs the instrument with over 13,000 Bitcoin in reserve assets and maintains 18 months of pre-funded cash reserves — providing the capacity to cover dividend payments for over 19 years.</p>
      <p>Strive is a Nasdaq-listed financial services and Bitcoin treasury company, founded in 2022 by Vivek Ramaswamy. Strive has positioned itself as a Bitcoin-first asset manager, rejecting the ESG investment model in favour of a returns-focused approach it calls excellence capitalism. The company has made Bitcoin a cornerstone of both its treasury strategy and its financial product offering.</p>
      <a href="https://www.strive.com" target="_blank" rel="noopener noreferrer"
        className="inline-block text-sm underline mt-1" style={{ color: 'var(--accent-gold)' }}>
        Visit Strive.com
      </a>
    </div>
  ),
};

export default function AssetHub({ ticker, name }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SubNav ticker={ticker} />

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        {ticker} — {name}
      </h1>

      {/* Live price + data cards (client-rendered) */}
      <AssetHubLive ticker={ticker} />

      {/* About section — server-rendered for SEO */}
      <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-lg font-semibold mb-3">About {ticker}</h2>
        <div className="text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{DESCRIPTIONS[ticker]}</div>
      </div>

      <GoogleAd slot={`${ticker.toLowerCase()}-hub`} />

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
