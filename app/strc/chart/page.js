import AssetChartPage from '@/components/AssetChartPage';

export const metadata = {
  title: 'STRC Chart — Digital Credit Yield',
  description: 'Live STRC candlestick price chart and effective yield history. Select a timeframe to explore how STRC has traded relative to its $100 par value.',
};

export default function STRCChart() {
  return <AssetChartPage ticker="STRC" />;
}
