import AssetHub from '@/components/AssetHub';

export const metadata = {
  alternates: { canonical: '/strc' },
  title: "STRC Stock — Strategy Preferred Stock | 11.50% Annual Dividend",
  description: "Track STRC live price, dividend yield, and history. Strategy's perpetual preferred stock pays 11.50% annually in monthly cash dividends, listed on Nasdaq. Backed by 800,000+ Bitcoin. Available on all major brokerages.",
  openGraph: {
    title: "STRC Stock — Strategy Preferred Stock | 11.50% Annual Dividend",
    description: "Strategy's preferred stock paying 11.50% annually in monthly cash dividends. Track live price, yield, and dividend history.",
    type: 'website',
    url: 'https://digitalcredityield.com/strc',
  },
  twitter: {
    card: 'summary',
    title: "STRC Stock — Strategy Preferred Stock | 11.50% Annual Dividend",
    description: "Strategy's preferred stock paying 11.50% annually in monthly cash dividends.",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'STRC — Strategy Perpetual Preferred Stock',
  description: "Strategy's perpetual preferred stock listed on Nasdaq, paying an 11.50% annual dividend distributed monthly in cash.",
  url: 'https://digitalcredityield.com/strc',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'Strategy (formerly MicroStrategy)',
    url: 'https://www.strategy.com',
  },
  annualPercentageRate: 11.50,
};

export default function STRCPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="STRC" name="Strategy's Perpetual Preferred Stock" />
    </>
  );
}
