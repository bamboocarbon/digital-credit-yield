import Link from 'next/link';
import { STRIVE_BTC_HOLDINGS } from '@/lib/constants';
import SubNav from '@/components/SubNav';
import GoogleAd from '@/components/GoogleAd';
import AadsAd from '@/components/AadsAd';
import AssetHubLive from '@/components/AssetHubLive';

const TOOLS = {
  STRC: [
    {
      href: '/chart?stock=strc',
      label: 'Live Price Chart',
      description: 'Track the STRC market price in real time against its $100 par value. As the price moves, the effective yield changes — use the chart to spot when STRC is trading at a premium or discount and understand what that means for your entry yield.',
    },
    {
      href: '/projector?stock=strc',
      label: 'Growth Projector',
      description: 'Enter an investment amount and time horizon to model your projected income and portfolio growth from holding STRC. Adjust the reinvestment rate to see the compounding effect, and compare returns against US Treasuries and bank savings side by side.',
    },
    {
      href: '/vs-treasuries?stock=strc',
      label: 'vs Treasuries',
      description: "Compare the income from STRC's dividend against US Treasuries and bank savings over any time period. Enter your investment amount and the tool shows the difference in dollar terms.",
    },
    {
      href: '/dividends?stock=strc',
      label: 'Dividend History',
      description: 'A complete record of every STRC dividend payment — per-share amount, payment date, and record date. Enter your holding size to calculate exactly how much you received or will receive from each distribution.',
    },
  ],
  SATA: [
    {
      href: '/chart?stock=sata',
      label: 'Live Price Chart',
      description: 'Track the SATA market price in real time against its $100 par value. As the price moves, the effective yield changes — use the chart to spot when SATA is trading at a premium or discount and understand what that means for your entry yield.',
    },
    {
      href: '/projector?stock=sata',
      label: 'Growth Projector',
      description: 'Enter an investment amount and time horizon to model your projected income and portfolio growth from holding SATA. Adjust the reinvestment rate to see the compounding effect, and compare returns against US Treasuries and bank savings side by side.',
    },
    {
      href: '/vs-treasuries?stock=sata',
      label: 'vs Treasuries',
      description: "Compare the income from SATA's dividend against US Treasuries and bank savings over any time period. Enter your investment amount and the tool shows the difference in dollar terms.",
    },
    {
      href: '/dividends?stock=sata',
      label: 'Dividend History',
      description: 'A complete record of every SATA dividend payment — per-share amount, payment date, and record date. Enter your holding size to calculate exactly how much you received or will receive from each distribution.',
    },
  ],
  BMNP: [
    {
      href: '/chart?stock=bmnp',
      label: 'Live Price Chart',
      description: 'Track the BMNP market price in real time against its $100 par value. As the price moves, the effective yield changes — use the chart to spot when BMNP is trading at a premium or discount and understand what that means for your entry yield.',
    },
    {
      href: '/projector?stock=bmnp',
      label: 'Growth Projector',
      description: 'Enter an investment amount and time horizon to model your projected income and portfolio growth from holding BMNP. Adjust the reinvestment rate to see the compounding effect of weekly dividends, and compare returns against US Treasuries and bank savings.',
    },
    {
      href: '/vs-treasuries?stock=bmnp',
      label: 'vs Treasuries',
      description: "Compare the income from BMNP's dividend against US Treasuries and bank savings over any time period. Enter your investment amount and the tool shows the difference in dollar terms.",
    },
    {
      href: '/dividends?stock=bmnp',
      label: 'Dividend History',
      description: 'A complete record of every BMNP dividend payment — per-share amount, payment date, and record date. Enter your holding size to calculate exactly how much you received or will receive from each weekly distribution.',
    },
  ],
};

const DESCRIPTIONS = {
  STRC: (
    <div className="space-y-3">
      <p>STRC is Strategy&apos;s perpetual preferred stock, listed on the Nasdaq. It pays an 11.50% annual dividend distributed semi-monthly in cash (~$0.479 per share twice a month), with the rate adjusted monthly to encourage trading close to its $100 par value, which has historically kept its day-to-day price movement small. Semi-monthly payments approved by shareholders on 8 June 2026; first semi-monthly payment on 15 July 2026. STRC is available on most major brokerage platforms.</p>
      <p>As preferred stock, STRC sits below debt but above common equity in Strategy&apos;s capital structure. In the event of liquidation, preferred stockholders are paid before common shareholders, giving STRC a degree of protection that pure equity does not offer. Strategy&apos;s holdings of over 880,000 Bitcoin provide a substantial asset base underpinning the instrument.</p>
      <p>Strategy (formerly MicroStrategy) is a Nasdaq-listed business intelligence and Bitcoin treasury company, founded in 1989. Under executive chairman Michael Saylor — one of the world&apos;s most prominent Bitcoin advocates — Strategy has made Bitcoin accumulation central to its corporate model, positioning itself as the world&apos;s largest corporate holder of Bitcoin.</p>
      <p>The one number I watch on STRC is how close it&apos;s trading to $100 — buy near or below par and the effective yield works in your favour; pay a premium and your real yield comes in under the headline rate.</p>
      <a href="https://www.strategy.com" target="_blank" rel="noopener noreferrer"
        className="inline-block text-sm underline mt-1" style={{ color: 'var(--accent-gold)' }}>
        Visit Strategy.com
      </a>
    </div>
  ),
  SATA: (
    <div className="space-y-3">
      <p>SATA is Strive&apos;s perpetual preferred equity instrument, listed on the Nasdaq. It pays a 13.00% annual dividend distributed daily in cash (~$0.052 per share per day), with Strive aiming to hold it in a $99–$101 trading range. SATA is available on most major brokerage platforms.</p>
      <p>As preferred equity, SATA sits below debt but above common equity in Strive&apos;s capital structure. In the event of liquidation, preferred stockholders are paid before common shareholders, giving SATA a meaningful layer of protection relative to pure equity. Strive backs the instrument with over {STRIVE_BTC_HOLDINGS} Bitcoin in reserve assets and maintains 18 months of pre-funded cash reserves to cover dividend payments.</p>
      <p>Strive is a Nasdaq-listed financial services and Bitcoin treasury company, founded in 2022 by Vivek Ramaswamy. It positions itself as a Bitcoin-first asset manager focused on financial returns rather than ESG objectives, and has made Bitcoin a cornerstone of both its treasury strategy and its financial product offering.</p>
      <p>What I find reassuring about SATA is that 18-month cash buffer — the near-term dividend isn&apos;t riding directly on the Bitcoin price. What I&apos;d keep an eye on is that the rate is set at the board&apos;s discretion rather than by a published formula.</p>
      <a href="https://strive.com" target="_blank" rel="noopener noreferrer"
        className="inline-block text-sm underline mt-1" style={{ color: 'var(--accent-gold)' }}>
        Visit Strive.com
      </a>
    </div>
  ),
  BMNP: (
    <div className="space-y-3">
      <p>BMNP is Bitmine Immersion Technologies&apos; Series A Perpetual Preferred Stock, listed on the NYSE in June 2026. It pays a 9.50% annual dividend distributed weekly in cash — an unusually frequent schedule for a listed preferred. Dividends are cumulative: any unpaid amount accumulates and must be settled before common dividends can be declared.</p>
      <p>As preferred stock, BMNP sits above common equity in Bitmine&apos;s capital structure. The instrument includes call provisions allowing the company to redeem shares at 110% of the $100 par value in the first 18 months, stepping down to 105% between 18 months and 3 years, then at par thereafter. These premiums are designed to compensate holders for early redemption risk. Unpaid dividends compound weekly at the stated rate plus a 5 basis point step-up per missed period, capped at 15% per annum.</p>
      <p>Bitmine Immersion Technologies (common stock: BMNR) is an Ethereum-focused digital asset company. Through its MAVAN staking infrastructure platform, Bitmine operates Ethereum validators and staking nodes, generating yield from network validation rewards. The company plans to deploy proceeds from the BMNP offering into ETH acquisition and expanded staking infrastructure, positioning itself as an Ethereum treasury company.</p>
      <p>What makes BMNP genuinely different, to my mind, is that the Ethereum behind it actively earns the dividend through staking rather than simply needing to rise in value. The trade-off is a newer, more complex asset and a fixed rate with no published mechanism to adjust it.</p>
      <a href="https://www.bitminetech.io" target="_blank" rel="noopener noreferrer"
        className="inline-block text-sm underline mt-1" style={{ color: 'var(--accent-gold)' }}>
        Visit Bitminetech.io
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

      {/* Tools section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS[ticker].map(tool => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block p-5 rounded-xl transition-opacity hover:opacity-80"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p className="font-semibold text-sm mb-2" style={{ color: 'var(--accent-gold)' }}>{tool.label}</p>
              <p className="text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-6 p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
          A yield like this always comes with risk — board discretion over dividends, rate changes, and crypto-collateral volatility among them.{' '}
          <Link href="/risks" style={{ color: 'var(--accent-gold)' }}>Read the full risk guide →</Link>
        </p>
      </div>

      <GoogleAd slot={`${ticker.toLowerCase()}-hub`} />
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
