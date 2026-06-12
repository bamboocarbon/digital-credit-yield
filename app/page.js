import AssetCard from '@/components/AssetCard';
import GoogleAd from '@/components/GoogleAd';
import AadsAd from '@/components/AadsAd';
import LatestNews from '@/components/LatestNews';
import SubscribeBox from '@/components/SubscribeBox';
import CompareTable from '@/components/CompareTable';
import { BMNP_ENABLED } from '@/lib/constants';

export function generateMetadata() {
  const instruments = BMNP_ENABLED ? 'STRC, SATA & BMNP' : 'STRC & SATA';
  const yieldRange  = BMNP_ENABLED ? '9.50%-13.00%' : '11.50%-13.00%';
  const desc = `Track ${instruments} — high-yield preferred stocks paying ${yieldRange} annually. Live prices, dividend history, and income projectors.`;
  return {
    metadataBase: new URL('https://www.digitalcredityield.com'),
    alternates: { canonical: '/' },
    title: `${instruments} Dividend Tracker`,
    description: desc,
    openGraph: {
      title: `${instruments} Preferred Stock Tracker — Up to 13% Annual Dividend`,
      description: desc,
      type: 'website',
      url: 'https://www.digitalcredityield.com',
      images: [{ url: '/og?v=3&title=Digital+Credit+Yield&sub=Preferred+Stock+Tracker' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${instruments} Preferred Stock Tracker — Up to 13% Annual Dividend`,
      description: desc,
    },
  };
}

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
          Tracking {BMNP_ENABLED ? 'STRC, SATA and BMNP' : 'STRC and SATA'} for growth
        </div>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Live prices, dividend tracking and income projections for next-generation high-yield preferred stocks
        </p>
      </div>

      {/* Asset selector cards */}
      <div className={`grid grid-cols-1 gap-6 mb-12 ${BMNP_ENABLED ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        <AssetCard ticker="STRC" />
        <AssetCard ticker="SATA" />
        {BMNP_ENABLED && <AssetCard ticker="BMNP" />}
      </div>

      <CompareTable />

      <GoogleAd slot="home-banner" />
      <AadsAd />

      <div className="max-w-3xl mx-auto">
        <LatestNews />
      </div>

      <SubscribeBox />

      {/* About section */}
      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">About Digital Credit Yield</h2>

        <h3 className="text-lg font-semibold mb-3">Who&rsquo;s behind this</h3>
        <p className="text-base leading-7 mb-4" style={{ color: 'var(--text-muted)' }}>
          I&rsquo;m Robin Gillingham — a full-time independent investor for seven years. I built this site to highlight the
          difference between annual yield and effective yield on the new generation of high-yield preferred stocks,
          and it has grown into growth projectors, dividend charts, and weekly money flow data{BMNP_ENABLED ? ' across STRC, SATA and BMNP' : ''}.
        </p>
        <p className="text-base leading-7 mb-8" style={{ color: 'var(--text-muted)' }}>
          <a href="/about" style={{ color: 'var(--accent-gold)' }}>Read the full story on the About page →</a>
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
