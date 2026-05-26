import AssetProjectorPage from '@/components/AssetProjectorPage';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/sata/projector' },
  title: 'SATA Income Calculator — Strive Daily Dividend Returns Projector',
  description: "Calculate your SATA income and model long-term portfolio growth. Compare Strive's 13.00% daily-dividend preferred stock against US Treasuries and bank savings over 1–10 years.",
  openGraph: {
    title: 'SATA Income Calculator — Strive Daily Dividend Returns Projector',
    description: "Model your SATA income and compare Strive's 13.00% daily-dividend preferred stock against US Treasuries and bank savings.",
    type: 'website',
    url: 'https://digitalcredityield.com/sata/projector',
  },
};

export default async function SATAProjector() {
  const q = await getStockQuote('SATA').catch(() => null);
  const liveYield = q?.dividendYield ?? ASSET_RATES['SATA'];
  return <AssetProjectorPage ticker="SATA" liveYield={liveYield} />;
}
