import AssetChartPage from '@/components/AssetChartPage';

export const metadata = {
  alternates: { canonical: '/strc/chart' },
  title: 'STRC Live Price Chart — Strategy Preferred Stock Price & Yield',
  description: "Live STRC candlestick chart for Strategy's preferred stock. Track the price relative to $100 par value and see how the effective 11.50% dividend yield changes as the market price moves.",
  openGraph: {
    title: 'STRC Live Price Chart — Strategy Preferred Stock Price & Yield',
    description: "Live STRC price chart. Track Strategy's preferred stock relative to $100 par and see the effective yield.",
    type: 'website',
    url: 'https://digitalcredityield.com/strc/chart',
  },
};

export default function STRCChart() {
  return <AssetChartPage ticker="STRC" />;
}
