import AssetProjectorPage from '@/components/AssetProjectorPage';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/strc/projector' },
  title: 'STRC Growth Projector — Digital Credit Yield',
  description: 'Model your future income and portfolio growth from holding STRC. Adjust yield, investment amount, and time horizon to project returns over 1–10 years.',
};

export default async function STRCProjector() {
  const q = await getStockQuote('STRC').catch(() => null);
  const liveYield = q?.dividendYield ?? ASSET_RATES['STRC'];
  return <AssetProjectorPage ticker="STRC" liveYield={liveYield} />;
}
