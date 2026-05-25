export const metadata = {
  alternates: { canonical: '/about' },
  title: 'About — Digital Credit Yield',
  description: 'About Digital Credit Yield — independent tracking and research for STRC and SATA preferred equity instruments.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-xl font-semibold mb-6">About Digital Credit Yield</h1>

      <p className="text-base leading-7 mb-6" style={{ color: 'var(--text-muted)' }}>
        Digital Credit Yield is an independent financial research and tracking tool built for
        investors in high-yield digital credit instruments. We focus specifically on STRC and SATA —
        two preferred equity instruments that pay monthly cash dividends at yields far above traditional savings.
        Our tools help you track live pricing, understand current and effective yields, and model
        long-term portfolio growth.
      </p>

      <p className="text-base leading-7 mb-8" style={{ color: 'var(--text-muted)' }}>
        We built this site because we believe retail investors deserve clear, accessible data on
        emerging income assets — without the noise, paywalls, or complexity of institutional
        platforms. Whether you're evaluating STRC or SATA for the first time or actively tracking
        your existing position, our Growth Projector and Differentiator tools give you the
        clarity to make informed decisions.
      </p>

      <div className="p-5 rounded-xl mb-8" style={{ background: 'rgba(200,137,58,0.08)', border: '1px solid var(--accent-gold)' }}>
        <p className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>Important Disclaimer</p>
        <p className="text-sm mt-2 leading-6" style={{ color: 'var(--text-muted)' }}>
          Digital Credit Yield is not a financial advisor. All content is provided for educational
          and research purposes only. Nothing on this site constitutes financial advice, investment
          advice, or a solicitation to buy or sell any financial instrument. Always consult a qualified
          financial adviser before making investment decisions.
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">What We Track</h2>
      <div className="space-y-4 mb-8">
        {[
          { ticker: 'STRC', name: "Strategy's Perpetual Preferred Stock", desc: "Pays 11.50% annual dividends monthly in cash. Dividend rate adjusts monthly to maintain trading near its $100 par value." },
          { ticker: 'SATA', name: "Strive's Preferred Equity Instrument", desc: "Pays 13.00% annualised in monthly dividends. Targets a $99–$101 trading range, backed by 18+ months of cash reserves and over 13,000 Bitcoin." },
        ].map(asset => (
          <div key={asset.ticker} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="font-semibold mb-1">{asset.ticker} — {asset.name}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{asset.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
