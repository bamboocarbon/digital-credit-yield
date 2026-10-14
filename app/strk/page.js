import AssetHub from '@/components/AssetHub';
import { ASSET_RATES } from '@/lib/constants';

const rate = ASSET_RATES.STRK.toFixed(2);

export const metadata = {
  alternates: { canonical: '/strk' },
  title: `STRK — Strategy STRK Preferred Stock`,
  description: `Track STRK: Strategy Inc.’s 8.00% Series A Perpetual Strike Preferred Stock, paying ${rate}% annually in quarterly cash. Listed on Nasdaq.`,
  openGraph: {
    title: `STRK — Strategy STRK Preferred Stock Tracker`,
    description: `Strategy Inc.’s 8.00% Series A Perpetual Strike Preferred Stock, paying ${rate}% annually. Track the live price, effective yield and dividend history.`,
    type: 'website',
    url: 'https://www.digitalcredityield.com/strk',
    images: [{ url: `/og?v=3&title=STRK+Stock&sub=Strategy+Convertible+Preferred&rate=${rate}%25` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `STRK — Strategy STRK Preferred Stock Tracker`,
    description: `Strategy Inc.’s 8.00% Series A Perpetual Strike Preferred Stock, paying ${rate}% annually.`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'STRK — Strategy Inc.’s 8.00% Series A Perpetual Strike Preferred Stock',
  description: `Strategy Inc.’s 8.00% Series A Perpetual Strike Preferred Stock, paying a ${rate}% annual dividend in quarterly cash.`,
  url: 'https://www.digitalcredityield.com/strk',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'Strategy Inc.',
    url: 'https://www.strategy.com',
  },
  interestRate: ASSET_RATES.STRK,
};

export default function STRKPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="STRK" name="Strategy STRK Preferred Stock" />
    </>
  );
}
