import AssetHub from '@/components/AssetHub';
import { ASSET_RATES } from '@/lib/constants';

const rate = ASSET_RATES.SATA.toFixed(2);

export const metadata = {
  alternates: { canonical: '/sata' },
  title: `SATA Stock — ${rate}% Daily Dividend`,
  description: `Track SATA live price and yield. Strive's preferred stock pays ${rate}% annually in daily cash (~$0.052/share/day, from 16 June 2026). Listed on Nasdaq, backed by 18+ months cash reserves.`,
  openGraph: {
    title: `SATA Stock — Strive Preferred Stock | ${rate}% Daily Dividend`,
    description: `Strive's preferred stock paying ${rate}% annually in daily cash dividends. Track live price, yield, and dividend history.`,
    type: 'website',
    url: 'https://www.digitalcredityield.com/sata',
    images: [{ url: `/api/og?title=SATA+Stock&sub=Strive+Preferred+Stock&rate=${rate}%25` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `SATA Stock — Strive Preferred Stock | ${rate}% Daily Dividend`,
    description: `Strive's preferred stock paying ${rate}% annually in daily cash dividends.`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'SATA — Strive Perpetual Preferred Equity',
  description: `Strive's perpetual preferred equity listed on Nasdaq, paying a ${rate}% annual dividend distributed as daily cash dividends.`,
  url: 'https://www.digitalcredityield.com/sata',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'Strive',
    url: 'https://strive.com',
  },
  interestRate: ASSET_RATES.SATA,
};

export default function SATAPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="SATA" name="Strive's Preferred Equity Instrument" />
    </>
  );
}
