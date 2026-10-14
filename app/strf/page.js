import AssetHub from '@/components/AssetHub';
import { ASSET_RATES } from '@/lib/constants';

export const revalidate = 3600; // refresh the live-priced capital-structure pyramid hourly

const rate = ASSET_RATES.STRF.toFixed(2);

export const metadata = {
  alternates: { canonical: '/strf' },
  title: `STRF — Strategy STRF Preferred Stock`,
  description: `Track STRF: Strategy Inc.’s 10.00% Series A Perpetual Strife Preferred Stock, paying ${rate}% annually in quarterly cash. Listed on Nasdaq.`,
  openGraph: {
    title: `STRF — Strategy STRF Preferred Stock Tracker`,
    description: `Strategy Inc.’s 10.00% Series A Perpetual Strife Preferred Stock, paying ${rate}% annually. Track the live price, effective yield and dividend history.`,
    type: 'website',
    url: 'https://www.digitalcredityield.com/strf',
    images: [{ url: `/og?v=3&title=STRF+Stock&sub=Strategy+Senior+Preferred&rate=${rate}%25` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `STRF — Strategy STRF Preferred Stock Tracker`,
    description: `Strategy Inc.’s 10.00% Series A Perpetual Strife Preferred Stock, paying ${rate}% annually.`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'STRF — Strategy Inc.’s 10.00% Series A Perpetual Strife Preferred Stock',
  description: `Strategy Inc.’s 10.00% Series A Perpetual Strife Preferred Stock, paying a ${rate}% annual dividend in quarterly cash.`,
  url: 'https://www.digitalcredityield.com/strf',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'Strategy Inc.',
    url: 'https://www.strategy.com',
  },
  interestRate: ASSET_RATES.STRF,
};

export default function STRFPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="STRF" name="Strategy STRF Preferred Stock" />
    </>
  );
}
