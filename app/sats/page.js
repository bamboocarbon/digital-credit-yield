import AssetHub from '@/components/AssetHub';
import { ASSET_RATES } from '@/lib/constants';

export const revalidate = 86400; // pyramid uses last closes; /api/cron/refresh-pyramids refreshes it after the US close

const rate = ASSET_RATES.SATS.toFixed(2);

export const metadata = {
  alternates: { canonical: '/sats' },
  title: `SATS — Strive's 15% Preferred Stock`,
  description: `Track SATS: Strive, Inc.’s 15.00% Series A Perpetual SATS Preferred Stock, paying ${rate}% annually in daily cash. Listed on Nasdaq.`,
  openGraph: {
    title: `SATS — Strive's 15% Preferred Stock Tracker`,
    description: `Strive, Inc.’s 15.00% Series A Perpetual SATS Preferred Stock, paying ${rate}% annually. Track the live price, effective yield and dividend history.`,
    type: 'website',
    url: 'https://www.digitalcredityield.com/sats',
    images: [{ url: `/og?v=4&title=SATS+Stock&sub=Strive+Preferred+Stock&rate=${rate}%25` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `SATS — Strive's 15% Preferred Stock Tracker`,
    description: `Strive, Inc.’s 15.00% Series A Perpetual SATS Preferred Stock, paying ${rate}% annually.`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'SATS — Strive, Inc.’s 15.00% Series A Perpetual SATS Preferred Stock',
  description: `Strive, Inc.’s 15.00% Series A Perpetual SATS Preferred Stock, paying a ${rate}% annual dividend in daily cash.`,
  url: 'https://www.digitalcredityield.com/sats',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'Strive, Inc.',
    url: 'https://www.strive.com',
  },
  interestRate: ASSET_RATES.SATS,
};

export default function SATSPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="SATS" name="Strive's 15% Preferred Stock" />
    </>
  );
}
