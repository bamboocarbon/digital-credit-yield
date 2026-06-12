import AssetHub from '@/components/AssetHub';
import { ASSET_RATES } from '@/lib/constants';

const rate = ASSET_RATES.BMNP.toFixed(2);

export const metadata = {
  alternates: { canonical: '/bmnp' },
  title: `BMNP Stock — ${rate}% Annual Dividend`,
  description: `Track BMNP live price and yield. BitMine Immersion Technologies' preferred stock pays ${rate}% annually in weekly cash dividends. Expected to list on the NYSE in June 2026, backed by Ethereum staking via MAVAN.`,
  openGraph: {
    title: `BMNP Stock — BitMine Preferred Stock | ${rate}% Annual Weekly Dividend`,
    description: `BitMine's preferred stock paying ${rate}% annually in weekly cash dividends. Track live price, yield, and dividend history.`,
    type: 'website',
    url: 'https://www.digitalcredityield.com/bmnp',
    images: [{ url: `/og?v=2&title=BMNP+Stock&sub=BitMine+Preferred+Stock&rate=${rate}%25` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `BMNP Stock — BitMine Preferred Stock | ${rate}% Annual Weekly Dividend`,
    description: `BitMine's preferred stock paying ${rate}% annually in weekly cash dividends.`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'BMNP — BitMine Immersion Technologies Series A Perpetual Preferred Stock',
  description: `BitMine Immersion Technologies' perpetual preferred stock expected to list on the NYSE in June 2026, paying a ${rate}% annual dividend distributed weekly in cash.`,
  url: 'https://www.digitalcredityield.com/bmnp',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'BitMine Immersion Technologies',
    url: 'https://www.bitminetech.io',
  },
  interestRate: ASSET_RATES.BMNP,
};

export default function BMNPPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="BMNP" name="BitMine Immersion Technologies Preferred Stock" />
    </>
  );
}
