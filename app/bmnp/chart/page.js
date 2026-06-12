import AssetChartPage from '@/components/AssetChartPage';

export const metadata = {
  alternates: { canonical: '/bmnp/chart' },
  title: 'BMNP Live Price Chart',
  description: "Live BMNP price chart for BitMine's preferred stock. Track the price vs $100 par and see how the effective 9.50% yield changes with the market price.",
  openGraph: {
    title: 'BMNP Live Price Chart — BitMine Preferred Stock Price & Yield',
    description: "Live BMNP price chart. Track BitMine's preferred stock relative to $100 par and see the effective yield.",
    type: 'website',
    url: 'https://www.digitalcredityield.com/bmnp/chart',
    images: [{ url: '/api/og?v=2&title=BMNP+Price+Chart&sub=BitMine+Preferred+Stock&tag=Live+Chart' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "BMNP Live Price Chart — BitMine Preferred Stock Price & Yield",
    description: "Live BMNP price chart. Track BitMine's preferred stock relative to $100 par and see the effective yield.",
  },
};

export default function BMNPChart() {
  return <AssetChartPage ticker="BMNP" />;
}
