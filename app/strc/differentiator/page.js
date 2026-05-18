import AssetDifferentiatorPage from '@/components/AssetDifferentiatorPage';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES } from '@/lib/constants';

export const metadata = {
  title: 'STRC Differentiator — Digital Credit Yield',
  description: 'See how STRC\'s 11.50% annual dividend compares against US Treasuries, high-yield savings, and bank accounts over your chosen time horizon.',
};

export default async function STRCDifferentiator() {
  let liveYield = ASSET_RATES.STRC;
  try {
    const data = await getStockQuote('STRC');
    if (data.dividendYield != null) liveYield = data.dividendYield;
  } catch {}
  return <AssetDifferentiatorPage ticker="STRC" liveYield={liveYield} />;
}
