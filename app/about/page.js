import { ASSET_RATES } from '@/lib/constants';

// Every rate on this page is read from ASSET_RATES (lib/yieldRateHistory.js), so a rate change added by
// the daily scan shows here automatically — never hardcode a % in the cards below. Revalidates daily so a
// rate with a future effective date goes live without waiting for a redeploy.
export const revalidate = 86400;

export const metadata = {
  alternates: { canonical: '/about' },
  title: 'About',
  description: 'The story behind Digital Credit Yield — from aircraft engineering to full-time trading and building tools for retail investors in STRC, SATA, BMNP, CHAD and MORE.',
  openGraph: {
    title: 'About',
    description: 'From aircraft engineering to full-time trading — the story behind Digital Credit Yield and its STRC, SATA, BMNP, CHAD and MORE tracking tools.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/about',
    images: [{ url: '/og?v=4&title=About&sub=Digital+Credit+Yield' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About',
    description: 'From aircraft engineering to full-time trading — the story behind Digital Credit Yield and its STRC, SATA, BMNP, CHAD and MORE tracking tools.',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

      <h1 className="text-xl font-semibold mb-8">About Me</h1>

      <p className="text-base leading-7 mb-6" style={{ color: 'var(--text-muted)' }}>
        I&rsquo;ve been a full-time independent investor for seven years, and Digital Credit Yield is the
        research and tracking platform I built to support this work.
      </p>

      <div style={{ overflow: 'hidden' }}>
        <div className="rounded-2xl overflow-hidden mb-2 mr-6" style={{ border: '1px solid var(--border)', maxWidth: '160px', float: 'left' }}>
          <img
            src="/about-photo.jpg?v=2"
            alt="Robin Gillingham, creator of Digital Credit Yield"
            className="w-full object-cover"
          />
        </div>

        <p className="text-base leading-7 mb-6" style={{ color: 'var(--text-muted)' }}>
          I studied Aircraft Engineering which led me to have a career working abroad for many years.
          Being responsible for a team working on large cargo and passenger aircraft, which I enjoyed. Weirdly I thrived on the pressure and challenges.
        </p>

      <p className="text-base leading-7 mb-6" style={{ color: 'var(--text-muted)' }}>
        Through the engineering I knew the process — how individual components worked, how they
        integrated into the system and how this ultimately got the plane airborne. It was this
        structure I applied to my trading.
      </p>

      </div>

      <p className="text-base leading-7 mb-6" style={{ color: 'var(--text-muted)' }}>
        I amassed a &lsquo;pot&rsquo; with the perk of an increased salary from working abroad. I wanted to see
        how this money could better serve me and my family which led me to the financial markets.
        Working you could say — two jobs.
      </p>

      <p className="text-base leading-7 mb-6" style={{ color: 'var(--text-muted)' }}>
        I studied — watched — listened — learnt.
      </p>

      <p className="text-base leading-7 mb-6" style={{ color: 'var(--text-muted)' }}>
        I was hooked, fascinated by this incredible world and made the decision in 2019 to trade
        full time based back in the UK.
      </p>

      <p className="text-base leading-7 mb-6" style={{ color: 'var(--text-muted)' }}>
        Through research, trading and accounting I created spreadsheets and developed projections
        and forecast charts. As new preferred equity instruments emerged offering yields far above
        traditional savings, I found myself building more and more tools to analyse them. Digital
        Credit Yield grew from those spreadsheets — a way of sharing the same clarity I was building
        for myself with other retail investors navigating these products.
      </p>

      <p className="text-base leading-7 mb-12" style={{ color: 'var(--text-muted)' }}>
        Away from the markets, I enjoy family life and also find inspiration and revitalisation
        whilst cycling hard through the country roads. Always great to travel too.
      </p>

      <h2 className="text-xl font-semibold mb-4">What I Track</h2>
      <div className="space-y-4 mb-4">
        {[
          {
            name: 'Strategy Perpetual Preferred Stock',
            items: [
              { ticker: 'STRC', desc: `Pays ${ASSET_RATES.STRC.toFixed(2)}% annual dividends in cash, paid every calendar day since 1 November 2026, having been semi-monthly until October 2026. Dividend rate adjusts to maintain trading near its $100 par value.` },
              { ticker: 'STRF', desc: `Pays a fixed ${ASSET_RATES.STRF.toFixed(2)}% annual dividend. The most senior of Strategy's preferreds. Quarterly until 31 December 2026, daily from 1 January 2027.` },
              { ticker: 'STRK', desc: `Pays a fixed ${ASSET_RATES.STRK.toFixed(2)}% annual dividend and is convertible into MSTR common stock. Quarterly until 31 December 2026, daily from 1 January 2027.` },
              { ticker: 'STRD', desc: `Pays a ${ASSET_RATES.STRD.toFixed(2)}% annual dividend, non-cumulative, and ranks below the other series. Quarterly until 31 December 2026, daily from 1 January 2027.` },
              { ticker: 'STRE', desc: `Pays a fixed ${ASSET_RATES.STRE.toFixed(2)}% annual dividend quarterly, in euros. Listed in Luxembourg for professional and institutional investors in the EEA.` },
            ],
          },
          {
            name: 'Strive Preferred Equity',
            items: [
              { ticker: 'SATA', desc: `Pays ${ASSET_RATES.SATA.toFixed(2)}% annualised in daily cash dividends. Targets a $99–$101 trading range. Strive holds a dividend reserve of 18 months of dividends, in cash and marketable securities, and 43,124 bitcoin (as of 30 October 2026, per its latest 10-Q).` },
              { ticker: 'SATS', desc: `Pays a fixed ${ASSET_RATES.SATS.toFixed(2)}% annual dividend on a $100 base, in daily cash dividends. Ranks below SATA and above Strive common stock.` },
            ],
          },
        ].map(group => (
          <div key={group.name} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="font-semibold mb-3">{group.name}</p>
            <div className="space-y-3">
              {group.items.map(item => (
                <p key={item.ticker} className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text)' }}>{item.ticker}</strong> — {item.desc}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4 mb-8">
        {[
          { ticker: 'BMNP', name: "Bitmine's Preferred Equity Instrument", desc: `Pays ${ASSET_RATES.BMNP.toFixed(2)}% annualised in weekly cash dividends. Bitmine's Ethereum treasury preferred equity instrument, funded by ETH staking rewards via the MAVAN validator network. Began trading on the NYSE June 16, 2026.` },
          { ticker: 'CHAD', name: "DeFi Development Corp.'s Preferred Stock", desc: `Pays ${ASSET_RATES.CHAD.toFixed(2)}% annualised in daily cash dividends. DeFi Development Corp.'s Solana treasury preferred stock, with a $10 stated value rather than the usual $100. Began trading on the Nasdaq September 8, 2026.` },
          { ticker: 'MORE', name: "The Smarter Web Company's Preferred Shares", desc: `Pays ${ASSET_RATES.MORE.toFixed(2)}% annualised on a £100 reference value in weekly cash dividends, in pounds sterling. A UK bitcoin treasury company's cumulative variable-rate preferred, admitted to the London Stock Exchange Main Market on October 14, 2026.` },
        ].map(asset => (
          <div key={asset.ticker} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="font-semibold mb-1">{asset.ticker} — {asset.name}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{asset.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-xl mb-8" style={{ background: 'rgba(200,137,58,0.08)', border: '1px solid var(--accent-gold)' }}>
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
