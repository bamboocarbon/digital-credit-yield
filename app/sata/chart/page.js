import AssetChartPage from '@/components/AssetChartPage';

export const metadata = {
  alternates: { canonical: '/sata/chart' },
  title: 'SATA Live Price Chart',
  description: "Live SATA price chart for Strive's preferred stock. Track the price vs $100 par and see how the effective 13.00% yield changes with the market price.",
  openGraph: {
    title: 'SATA Live Price Chart — Strive Preferred Stock Price & Yield',
    description: "Live SATA price chart. Track Strive's preferred stock relative to $100 par and see the effective yield.",
    type: 'website',
    url: 'https://www.digitalcredityield.com/sata/chart',
    images: [{ url: '/api/og?title=SATA+Price+Chart&sub=Strive+Preferred+Stock&tag=Live+Chart' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "SATA Live Price Chart — Strive Preferred Stock Price & Yield",
    description: "Live SATA price chart. Track Strive's preferred stock relative to $100 par and see the effective yield.",
  },
};

export default function SATAChart() {
  return <AssetChartPage ticker="SATA" />;
}
