import AssetHub from '@/components/AssetHub';
import { ASSET_RATES } from '@/lib/constants';

const rate = ASSET_RATES.STRE.toFixed(2);

export const metadata = {
  alternates: { canonical: '/stre' },
  title: `STRE — Strategy STRE Euro Preferred Stock`,
  description: `Track STRE: Strategy Inc.’s 10.00% Series A Perpetual Stream Preferred Stock, paying ${rate}% annually in quarterly cash in euros. Listed on the Luxembourg Stock Exchange (Euro MTF).`,
  openGraph: {
    title: `STRE — Strategy STRE Euro Preferred Stock Tracker`,
    description: `Strategy Inc.’s 10.00% Series A Perpetual Stream Preferred Stock, paying ${rate}% annually. Track the live price, effective yield and dividend history.`,
    type: 'website',
    url: 'https://www.digitalcredityield.com/stre',
    images: [{ url: `/og?v=3&title=STRE+Stock&sub=Strategy+Euro+Preferred&rate=${rate}%25` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `STRE — Strategy STRE Euro Preferred Stock Tracker`,
    description: `Strategy Inc.’s 10.00% Series A Perpetual Stream Preferred Stock, paying ${rate}% annually.`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'STRE — Strategy Inc.’s 10.00% Series A Perpetual Stream Preferred Stock',
  description: `Strategy Inc.’s 10.00% Series A Perpetual Stream Preferred Stock, paying a ${rate}% annual dividend in quarterly cash in euros.`,
  url: 'https://www.digitalcredityield.com/stre',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'Strategy Inc.',
    url: 'https://www.strategy.com/stre/learn',
  },
  interestRate: ASSET_RATES.STRE,
};

export default function STREPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="STRE" name="Strategy STRE Euro Preferred Stock" />
    </>
  );
}
