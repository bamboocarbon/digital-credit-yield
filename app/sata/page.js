import AssetHub from '@/components/AssetHub';

export const metadata = {
  alternates: { canonical: '/sata' },
  title: "SATA Stock — Strive Preferred Stock | 13% Monthly Dividend",
  description: "Track SATA live price and yield. Strive's preferred stock pays 13.00% annually in monthly cash. Listed on Nasdaq, backed by 18+ months cash reserves.",
  openGraph: {
    title: "SATA Stock — Strive Preferred Stock | 13% Monthly Dividend",
    description: "Strive's preferred stock paying 13.00% annually in monthly cash dividends. Track live price, yield, and dividend history.",
    type: 'website',
    url: 'https://digitalcredityield.com/sata',
    images: [{ url: '/api/og?title=SATA+Stock&sub=Strive+Preferred+Stock&rate=13.00%25' }],
  },
  twitter: {
    card: 'summary',
    title: "SATA Stock — Strive Preferred Stock | 13% Monthly Dividend",
    description: "Strive's preferred stock paying 13.00% annually in monthly cash dividends.",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'SATA — Strive Perpetual Preferred Equity',
  description: "Strive's perpetual preferred equity listed on Nasdaq, paying a 13.00% annual dividend distributed as monthly cash dividends.",
  url: 'https://digitalcredityield.com/sata',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'Strive',
    url: 'https://www.strive.com',
  },
  annualPercentageRate: 13.00,
};

export default function SATAPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="SATA" name="Strive's Preferred Equity Instrument" />
    </>
  );
}
