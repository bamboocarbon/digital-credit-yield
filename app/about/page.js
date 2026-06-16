export const metadata = {
  alternates: { canonical: '/about' },
  title: 'About',
  description: 'The story behind Digital Credit Yield — from aircraft engineering to full-time trading and building tools for retail investors in STRC, SATA and BMNP.',
  openGraph: {
    title: 'About',
    description: 'From aircraft engineering to full-time trading — the story behind Digital Credit Yield and its STRC, SATA and BMNP tracking tools.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/about',
    images: [{ url: '/og?v=3&title=About&sub=Digital+Credit+Yield' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About',
    description: 'From aircraft engineering to full-time trading — the story behind Digital Credit Yield and its STRC, SATA and BMNP tracking tools.',
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
      <div className="space-y-4 mb-8">
        {[
          { ticker: 'STRC', name: "Strategy's Perpetual Preferred Stock", desc: "Pays 11.50% annual dividends in semi-monthly cash payments. Dividend rate adjusts monthly to maintain trading near its $100 par value." },
          { ticker: 'SATA', name: "Strive's Preferred Equity Instrument", desc: "Pays 13.00% annualised in daily cash dividends. Targets a $99–$101 trading range, backed by 18+ months of cash reserves and over 19,000 Bitcoin." },
          { ticker: 'BMNP', name: "Bitmine's Preferred Equity Instrument", desc: "Pays 9.50% annualised in weekly cash dividends. Bitmine's Ethereum treasury preferred equity instrument, funded by ETH staking rewards via the MAVAN validator network. Began trading on the NYSE June 16, 2026." },
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
