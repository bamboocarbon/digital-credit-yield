import AssetProjectorPage from '@/components/AssetProjectorPage';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES } from '@/lib/constants';

export const metadata = {
  title: 'SATA Growth Projector — Digital Credit Yield',
  description: 'Model your future income and portfolio growth from holding SATA. Adjust yield, investment amount, and time horizon to project returns over 1–10 years.',
};

export default async function SATAProjector() {
  const q = await getStockQuote('SATA').catch(() => null);
  const liveYield = q?.dividendYield ?? ASSET_RATES['SATA'];
  return <AssetProjectorPage ticker="SATA" liveYield={liveYield} />;
}
