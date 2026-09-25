import AssetHub from '@/components/AssetHub';
import { ASSET_RATES } from '@/lib/constants';

const rate = ASSET_RATES.CHAD.toFixed(2);

export const metadata = {
  alternates: { canonical: '/chad' },
  title: `CHAD — DeFi Development Corp. Preferred Stock`,
  description: `Track CHAD live price and yield. DeFi Development Corp.'s Solana-backed preferred stock pays ${rate}% annually in daily cash, trading on the Nasdaq since September 8, 2026.`,
  openGraph: {
    title: `CHAD — DeFi Development Corp. Preferred Stock Tracker`,
    description: `DeFi Development Corp.'s Solana-backed preferred stock paying ${rate}% annually in daily cash dividends. Track live price, yield, and dividend history.`,
    type: 'website',
    url: 'https://www.digitalcredityield.com/chad',
    images: [{ url: `/og?v=3&title=CHAD+Stock&sub=DeFi+Development+Preferred+Stock&rate=${rate}%25` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `CHAD — DeFi Development Corp. Preferred Stock Tracker`,
    description: `DeFi Development Corp.'s Solana-backed preferred stock paying ${rate}% annually in daily cash dividends.`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'CHAD — DeFi Development Corp. Variable Rate Series C Perpetual Preferred Stock',
  description: `DeFi Development Corp.'s Solana-backed perpetual preferred stock listed on Nasdaq, paying a ${rate}% annual dividend distributed daily in cash.`,
  url: 'https://www.digitalcredityield.com/chad',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'DeFi Development Corp.',
    url: 'https://www.defidevcorp.com',
  },
  interestRate: ASSET_RATES.CHAD,
};

export default function CHADPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="CHAD" name="DeFi Development Corp. Preferred Stock" />
    </>
  );
}
