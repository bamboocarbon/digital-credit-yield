import AssetHub from '@/components/AssetHub';

export const metadata = {
  alternates: { canonical: '/sata' },
  title: "SATA Stock — Strive Preferred Stock | 13% Daily Dividend",
  description: "Track SATA live price, dividend yield, and history. Strive's preferred equity pays 13.00% annually as a daily cash payment on every NYSE business day — the first listed security to pay daily dividends. Listed on Nasdaq.",
  openGraph: {
    title: "SATA Stock — Strive Preferred Stock | 13% Daily Dividend",
    description: "Strive's preferred equity paying 13.00% annually as a daily cash payment on every NYSE business day. Track live price, yield, and dividend history.",
    type: 'website',
    url: 'https://digitalcredityield.com/sata',
  },
  twitter: {
    card: 'summary',
    title: "SATA Stock — Strive Preferred Stock | 13% Daily Dividend",
    description: "Strive's preferred equity paying 13.00% annually as a daily cash payment every NYSE business day.",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'SATA — Strive Perpetual Preferred Equity',
  description: "Strive's perpetual preferred equity listed on Nasdaq, paying a 13.00% annual dividend distributed as a daily cash payment on every NYSE business day — approximately 21 payments per month.",
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
