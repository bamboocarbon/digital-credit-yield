import AssetHub from '@/components/AssetHub';
import { ASSET_RATES } from '@/lib/constants';

const rate = ASSET_RATES.STRD.toFixed(2);

export const metadata = {
  alternates: { canonical: '/strd' },
  title: `STRD — Strategy STRD Preferred Stock`,
  description: `Track STRD: Strategy Inc.’s 10.00% Series A Perpetual Stride Preferred Stock, paying ${rate}% annually in quarterly cash. Listed on Nasdaq.`,
  openGraph: {
    title: `STRD — Strategy STRD Preferred Stock Tracker`,
    description: `Strategy Inc.’s 10.00% Series A Perpetual Stride Preferred Stock, paying ${rate}% annually. Track the live price, effective yield and dividend history.`,
    type: 'website',
    url: 'https://www.digitalcredityield.com/strd',
    images: [{ url: `/og?v=3&title=STRD+Stock&sub=Strategy+Junior+Preferred&rate=${rate}%25` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `STRD — Strategy STRD Preferred Stock Tracker`,
    description: `Strategy Inc.’s 10.00% Series A Perpetual Stride Preferred Stock, paying ${rate}% annually.`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'STRD — Strategy Inc.’s 10.00% Series A Perpetual Stride Preferred Stock',
  description: `Strategy Inc.’s 10.00% Series A Perpetual Stride Preferred Stock, paying a ${rate}% annual dividend in quarterly cash.`,
  url: 'https://www.digitalcredityield.com/strd',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'Strategy Inc.',
    url: 'https://www.strategy.com',
  },
  interestRate: ASSET_RATES.STRD,
};

export default function STRDPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="STRD" name="Strategy STRD Preferred Stock" />
    </>
  );
}
