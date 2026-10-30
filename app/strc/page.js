import AssetHub from '@/components/AssetHub';
import { ASSET_RATES, STRATEGY_BTC_HOLDINGS } from '@/lib/constants';

export const revalidate = 86400; // pyramid uses last closes; /api/cron/refresh-pyramids refreshes it after the US close

const rate = ASSET_RATES.STRC.toFixed(2);

export const metadata = {
  alternates: { canonical: '/strc' },
  title: `STRC — Strategy Preferred Stock`,
  description: `Track STRC live price and yield. Strategy's preferred stock pays ${rate}% annually in cash, daily from 1 November 2026. Listed on Nasdaq, backed by ${STRATEGY_BTC_HOLDINGS}+ Bitcoin.`,
  openGraph: {
    title: `STRC — Strategy Preferred Stock Tracker`,
    description: `Strategy's preferred stock paying ${rate}% annually in cash dividends, daily from 1 November 2026. Track live price, yield, and dividend history.`,
    type: 'website',
    url: 'https://www.digitalcredityield.com/strc',
    images: [{ url: `/og?v=4&title=STRC+Stock&sub=Strategy+Preferred+Stock&rate=${rate}%25` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `STRC — Strategy Preferred Stock Tracker`,
    description: `Strategy's preferred stock paying ${rate}% annually in cash dividends, daily from 1 November 2026.`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'STRC — Strategy Perpetual Preferred Stock',
  description: `Strategy's perpetual preferred stock listed on Nasdaq, paying a ${rate}% annual dividend in cash, paid daily from 1 November 2026.`,
  url: 'https://www.digitalcredityield.com/strc',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'Strategy (formerly MicroStrategy)',
    url: 'https://www.strategy.com',
  },
  interestRate: ASSET_RATES.STRC,
};

export default function STRCPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="STRC" name="Strategy's Perpetual Preferred Stock" />
    </>
  );
}
