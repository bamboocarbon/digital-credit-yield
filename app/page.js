import AssetCard from '@/components/AssetCard';
import GoogleAd from '@/components/GoogleAd';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
          Digital Credit Yield
        </h1>
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

      {/* About section */}
      <div className="mt-12 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">What is Digital Credit Yield?</h2>
        <p className="text-base leading-7" style={{ color: 'var(--text-muted)' }}>
          Digital Credit Yield is an independent research and tracking tool built for investors
          high-yield digital credit instruments. We focus on STRC and SATA — two preferred equity
          instruments that pay monthly cash dividends at rates far above traditional savings. Use our tools
          to track live pricing, understand yields, and model long-term portfolio growth.
        </p>
        <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
          For information purposes only. Not financial advice.
        </p>
      </div>
    </div>
  );
}
