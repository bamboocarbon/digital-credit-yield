import AssetChartPage from '@/components/AssetChartPage';

export const metadata = {
  alternates: { canonical: '/sata/chart' },
  title: 'SATA Chart — Digital Credit Yield',
  description: 'Live SATA candlestick price chart and effective yield history. Select a timeframe to explore how SATA has traded relative to its $100 par value.',
};

export default function SATAChart() {
  return <AssetChartPage ticker="SATA" />;
}
