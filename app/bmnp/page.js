import AssetHub from '@/components/AssetHub';
import { ASSET_RATES } from '@/lib/constants';

const rate = ASSET_RATES.BMNP.toFixed(2);

export const metadata = {
  alternates: { canonical: '/bmnp' },
  title: `BMNP — Bitmine Preferred Stock`,
  description: `Track BMNP live price and yield. Bitmine's preferred stock pays ${rate}% annually in weekly cash, trading on the NYSE since June 16, 2026.`,
  openGraph: {
    title: `BMNP — Bitmine Preferred Stock Tracker`,
    description: `Bitmine's preferred stock paying ${rate}% annually in weekly cash dividends. Track live price, yield, and dividend history.`,
    type: 'website',
    url: 'https://www.digitalcredityield.com/bmnp',
    images: [{ url: `/og?v=3&title=BMNP+Stock&sub=Bitmine+Preferred+Stock&rate=${rate}%25` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `BMNP — Bitmine Preferred Stock Tracker`,
    description: `Bitmine's preferred stock paying ${rate}% annually in weekly cash dividends.`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'BMNP — Bitmine Immersion Technologies Series A Perpetual Preferred Stock',
  description: `Bitmine Immersion Technologies' perpetual preferred stock, trading on the NYSE since June 16, 2026, paying a ${rate}% annual dividend distributed weekly in cash.`,
  url: 'https://www.digitalcredityield.com/bmnp',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'Bitmine Immersion Technologies',
    url: 'https://www.bitminetech.io',
  },
  interestRate: ASSET_RATES.BMNP,
};

export default function BMNPPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="BMNP" name="Bitmine Immersion Technologies Preferred Stock" />
    </>
  );
}
