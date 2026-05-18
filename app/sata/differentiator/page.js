import AssetDifferentiatorPage from '@/components/AssetDifferentiatorPage';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES } from '@/lib/constants';

export const metadata = {
  title: 'SATA Differentiator — Digital Credit Yield',
  description: 'See how SATA\'s 13.00% annual dividend compares against US Treasuries, high-yield savings, and bank accounts over your chosen time horizon.',
};

export default async function SATADifferentiator() {
  let liveYield = ASSET_RATES.SATA;
  try {
    const data = await getStockQuote('SATA');
    if (data.dividendYield != null) liveYield = data.dividendYield;
  } catch {}
  return <AssetDifferentiatorPage ticker="SATA" liveYield={liveYield} />;
}
