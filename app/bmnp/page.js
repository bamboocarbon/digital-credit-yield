import AssetHub from '@/components/AssetHub';

export const metadata = {
  alternates: { canonical: '/bmnp' },
  title: "BMNP Stock — BitMine Preferred Stock | 9.50% Annual Weekly Dividend",
  description: "Track BMNP live price and yield. BitMine Immersion Technologies' preferred stock pays 9.50% annually in weekly cash dividends. NYSE listed, backed by Ethereum staking via MAVAN.",
  openGraph: {
    title: "BMNP Stock — BitMine Preferred Stock | 9.50% Annual Weekly Dividend",
    description: "BitMine's preferred stock paying 9.50% annually in weekly cash dividends. Track live price, yield, and dividend history.",
    type: 'website',
    url: 'https://www.digitalcredityield.com/bmnp',
    images: [{ url: '/api/og?title=BMNP+Stock&sub=BitMine+Preferred+Stock&rate=9.50%25' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "BMNP Stock — BitMine Preferred Stock | 9.50% Annual Weekly Dividend",
    description: "BitMine's preferred stock paying 9.50% annually in weekly cash dividends.",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'BMNP — BitMine Immersion Technologies Series A Perpetual Preferred Stock',
  description: "BitMine Immersion Technologies' perpetual preferred stock listed on the NYSE, paying a 9.50% annual dividend distributed weekly in cash.",
  url: 'https://www.digitalcredityield.com/bmnp',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'BitMine Immersion Technologies',
    url: 'https://www.bitmine.com',
  },
  annualPercentageRate: 9.50,
};

export default function BMNPPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="BMNP" name="BitMine Immersion Technologies Preferred Stock" />
    </>
  );
}
