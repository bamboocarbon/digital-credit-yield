import AssetChartPage from '@/components/AssetChartPage';

export const metadata = {
  alternates: { canonical: '/strc/chart' },
  title: 'STRC Live Price Chart',
  description: "Live STRC price chart for Strategy's preferred stock. Track the price vs $100 par and see how the effective 11.50% yield changes with the market price.",
  openGraph: {
    title: 'STRC Live Price Chart — Strategy Preferred Stock Price & Yield',
    description: "Live STRC price chart. Track Strategy's preferred stock relative to $100 par and see the effective yield.",
    type: 'website',
    url: 'https://www.digitalcredityield.com/strc/chart',
    images: [{ url: '/api/og?title=STRC+Price+Chart&sub=Strategy+Preferred+Stock&tag=Live+Chart' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "STRC Live Price Chart — Strategy Preferred Stock Price & Yield",
    description: "Live STRC price chart. Track Strategy's preferred stock relative to $100 par and see the effective yield.",
  },
};

export default function STRCChart() {
  return <AssetChartPage ticker="STRC" />;
}
