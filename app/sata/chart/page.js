import AssetChartPage from '@/components/AssetChartPage';

export const metadata = {
  alternates: { canonical: '/sata/chart' },
  title: 'SATA Live Price Chart — Strive Preferred Stock Price & Yield',
  description: "Live SATA candlestick chart for Strive's preferred stock. Track the price relative to $100 par value and see how the effective 13.00% daily dividend yield changes with the market price.",
  openGraph: {
    title: 'SATA Live Price Chart — Strive Preferred Stock Price & Yield',
    description: "Live SATA price chart. Track Strive's preferred stock relative to $100 par and see the effective yield.",
    type: 'website',
    url: 'https://digitalcredityield.com/sata/chart',
  },
};

export default function SATAChart() {
  return <AssetChartPage ticker="SATA" />;
}
