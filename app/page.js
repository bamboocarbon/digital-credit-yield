import AssetCard from '@/components/AssetCard';
import GoogleAd from '@/components/GoogleAd';
import AadsAd from '@/components/AadsAd';
import LatestNews from '@/components/LatestNews';

export const metadata = {
  alternates: { canonical: '/' },
  title: 'STRC, SATA & BMNP Preferred Stock Tracker — Up to 13% Annual Dividend',
  description: 'Track STRC (11.50%), SATA (13.00%) and BMNP (9.50%) — high-yield preferred stocks paying monthly and weekly dividends. Live prices, dividend history, and income projectors.',
  openGraph: {
    title: 'STRC, SATA & BMNP Preferred Stock Tracker — Up to 13% Annual Dividend',
    description: 'Track STRC, SATA and BMNP — high-yield preferred stocks paying 9.50%–13.00% annually. Live prices, dividend history, and income projectors.',
    type: 'website',
    url: 'https://www.digitalcredityield.com',
    images: [{ url: '/api/og?title=Preferred+Stock+Tracker&sub=Up+to+13%25+Annual+Dividend' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STRC, SATA & BMNP Preferred Stock Tracker — Up to 13% Annual Dividend',
    description: 'Track STRC, SATA and BMNP — high-yield preferred stocks paying 9.50%–13.00% annually.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Digital Credit Yield',
  url: 'https://www.digitalcredityield.com',
  description: 'Independent tracker for STRC, SATA and BMNP high-yield preferred stocks. Live prices, dividend history, and income projectors.',
};

export default function HomePage() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
          Digital Credit Yield
        </h1>
        <div style={{
          display: 'inline-block',
          color: '#f5a623',
          border: '1px solid #f5a623',
          borderRadius: '12px',
          padding: '10px 20px',
          fontSize: '20px',
          fontWeight: '700',
          fontFamily: 'Arial, Helvetica, sans-serif',
          marginBottom: '20px',
        }}>
          Tracking STRC, SATA and BMNP for growth
        </div>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Track, analyse and project the growth of next-generation income assets
        </p>
      </div>

      {/* Asset selector cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <AssetCard ticker="STRC" />
        <AssetCard ticker="SATA" />
        <AssetCard ticker="BMNP" />
      </div>

      <GoogleAd slot="home-banner" />
      <AadsAd />

      <div className="max-w-3xl mx-auto">
        <LatestNews />
      </div>

      {/* About section */}
      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">About Digital Credit Yield</h2>

        <h3 className="text-lg font-semibold mb-3">Who&rsquo;s behind this</h3>
        <p className="text-base leading-7 mb-4" style={{ color: 'var(--text-muted)' }}>
          I&rsquo;m Robin Gillingham and I created and run digitalcredityield.com.
        </p>
        <p className="text-base leading-7 mb-4" style={{ color: 'var(--text-muted)' }}>
          Reading my profile you&rsquo;ll see I made an exciting career change and have been an independent retail investor for the last seven years, latterly enjoying developing financial software.
        </p>
        <p className="text-base leading-7 mb-8" style={{ color: 'var(--text-muted)' }}>
          I could see a greater new path to financial gain and I studied hard. Apart from cycling gear for me and the bikes, my Birthday/Christmas list now included books on investing — always reading while travelling on planes and trains.
        </p>

        <h3 className="text-lg font-semibold mb-3">Why I built this site</h3>
        <p className="text-base leading-7 mb-4" style={{ color: 'var(--text-muted)' }}>
          From 2020 my research and interest took me towards cryptocurrency, particularly Bitcoin where I first heard about Michael Saylor&rsquo;s groundbreaking plans for MicroStrategy putting Bitcoin on the company&rsquo;s treasury account.
        </p>
        <p className="text-base leading-7 mb-4" style={{ color: 'var(--text-muted)' }}>
          With the exciting Bitcoin plans from Strategy, launching STRC and later Strive launching SATA, I had the initial idea to build a website to highlight the difference between annual yield and effective yield. From here the website has expanded with growth projectors, differentiators, dividend charts and the latest money flow data. I think the website now brings together all the up to date info an investor would need in calculating preferred equity stocks.
        </p>
        <p className="text-base leading-7 mb-8" style={{ color: 'var(--text-muted)' }}>
          With Bitmine Immersion Technologies having recently launched their own preferred equity stock, BMNP, now listed on the NYSE, I have already updated this website and will in the future cover any more stocks in this category. So making Digital Credit Yield a great place to look for analysing all these products available in one location.
        </p>

        <h3 className="text-lg font-semibold mb-3">How I keep the data accurate</h3>
        <p className="text-base leading-7 mb-4" style={{ color: 'var(--text-muted)' }}>
          Trust starts with sourcing, so here&rsquo;s exactly how the numbers are produced:
        </p>
        <ul className="text-base leading-7 mb-4 space-y-2" style={{ color: 'var(--text-muted)', paddingLeft: '1.25rem', listStyleType: 'disc' }}>
          <li>Pricing and dividend data is fetched from public market sources (Yahoo Finance) and, for dividend rates, cross-checked against the issuers&rsquo; own SEC filings (8-Ks and prospectuses from Strategy, Strive and Bitmine).</li>
          <li>Dividend history is stored and built up over time on my server from public data only — no personal data is ever involved.</li>
          <li>Articles are researched against primary sources and fact-checked before publishing. Where I state a rate, a date, or a structural detail, it traces back to a filing or the issuer&rsquo;s own disclosure.</li>
          <li>Updates: I revise pages as the instruments and the wider market evolves. Each article carries its publish date so you can judge how current it is.</li>
        </ul>
        <p className="text-base leading-7 mb-8" style={{ color: 'var(--text-muted)' }}>
          If you ever spot something that looks wrong, please tell me — corrections are welcome and I&rsquo;d rather fix an error fast than leave it standing.
        </p>

        <h3 className="text-lg font-semibold mb-3">Transparency and independence</h3>
        <p className="text-base leading-7 mb-4" style={{ color: 'var(--text-muted)' }}>
          {/* TODO (post-AdSense approval): change to "Digital Credit Yield is supported by advertising. This never influences which assets I cover or what I say about them." */}
          Digital Credit Yield is not yet funded by advertising. This never influences which assets I cover or what I say about them.
        </p>
        <p className="text-base leading-7 mb-8" style={{ color: 'var(--text-muted)' }}>
          Position disclosure — I currently hold positions in MSTR and ASST the common equity stocks of Strategy and Strive.
          I have no relationship with Strategy Inc. Strive Inc. or Bitmine Immersion Technologies Inc. and am not compensated by them. This is an independent research product.
        </p>

        <h3 className="text-lg font-semibold mb-3">Get in touch</h3>
        <p className="text-base leading-7 mb-8" style={{ color: 'var(--text-muted)' }}>
          Questions, corrections, or feedback are always welcome — reach me at{' '}
          <a href="mailto:contact@digitalcredityield.com" style={{ color: 'var(--accent-gold)' }}>contact@digitalcredityield.com</a>{' '}
          or on X at{' '}
          <a href="https://x.com/DCYieldHub" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>@DCYieldHub</a>.
        </p>

        <div className="p-5 rounded-xl" style={{ background: 'rgba(200,137,58,0.08)', border: '1px solid var(--accent-gold)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>Important Disclaimer</p>
          <p className="text-sm mt-2 leading-6" style={{ color: 'var(--text-muted)' }}>
            Digital Credit Yield is not a financial advisor. All content is provided for educational
            and research purposes only. Nothing on this site constitutes financial advice, investment
            advice, or a solicitation to buy or sell any financial instrument. Always consult a qualified
            financial adviser before making investment decisions.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
