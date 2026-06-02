import AssetCard from '@/components/AssetCard';
import GoogleAd from '@/components/GoogleAd';
import AadsAd from '@/components/AadsAd';

export const metadata = {
  alternates: { canonical: '/' },
  title: 'STRC & SATA Preferred Stock Tracker — Up to 13% Annual Dividend',
  description: 'Track STRC (11.50%) and SATA (13.00%) — preferred stocks on Nasdaq paying monthly dividends. Live prices, dividend history, and income projectors.',
  openGraph: {
    title: 'STRC & SATA Preferred Stock Tracker — Up to 13% Annual Dividend',
    description: 'Track STRC and SATA — two high-yield preferred stocks paying 11.50%–13.00% annually. Live prices, dividend history, and income projectors.',
    type: 'website',
    url: 'https://digitalcredityield.com',
    images: [{ url: '/api/og?title=STRC+%26+SATA+Tracker&sub=Up+to+13%25+Annual+Dividend' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STRC & SATA Preferred Stock Tracker — Up to 13% Annual Dividend',
    description: 'Track STRC and SATA — two high-yield preferred stocks paying 11.50%–13.00% annually.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Digital Credit Yield',
  url: 'https://digitalcredityield.com',
  description: 'Independent tracker for STRC and SATA high-yield preferred stocks. Live prices, dividend history, and income projectors.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://digitalcredityield.com/{search_term_string}',
    'query-input': 'required name=search_term_string',
  },
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
          Tracking STRC and SATA for growth
        </div>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Track, analyse and project the growth of next-generation income assets
        </p>
      </div>

      {/* Asset selector cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <AssetCard ticker="STRC" />
        <AssetCard ticker="SATA" />
      </div>

      <GoogleAd slot="home-banner" />
      <AadsAd />

      {/* About section */}
      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">About Digital Credit Yield</h2>
        <p className="text-base leading-7 mb-6" style={{ color: 'var(--text-muted)' }}>
          Digital Credit Yield is an independent financial research and tracking tool built for
          investors in high-yield digital credit instruments. The focus is specifically on STRC and
          SATA — two preferred equity instruments that pay high-yield cash dividends far above
          traditional savings — both paying monthly cash dividends.
          The tools help you track live pricing, understand current and effective yields, and model
          long-term portfolio growth.
        </p>
        <p className="text-base leading-7 mb-6" style={{ color: 'var(--text-muted)' }}>
          These are relatively new products, with STRC launching in July 2025 and SATA in November
          2025. As the market digests these innovative products and sees the demand that exists, I am
          sure more companies will decide to enter this space. Through Digital Credit Yield I will monitor
          and update the website as the landscape evolves.
        </p>
        <p className="text-base leading-7 mb-8" style={{ color: 'var(--text-muted)' }}>
          I built this site because I believe retail investors need clear, accessible data on
          emerging income assets — without the noise, paywalls, or complexity of institutional
          platforms. Whether you're evaluating STRC or SATA for the first time or actively tracking
          your existing position, my Growth Projector and Differentiator tools give you the clarity
          to make informed decisions.
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
