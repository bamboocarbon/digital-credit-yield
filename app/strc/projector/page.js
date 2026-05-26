import AssetProjectorPage from '@/components/AssetProjectorPage';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/strc/projector' },
  title: 'STRC Income Calculator — Strategy Preferred Stock Returns Projector',
  description: "Calculate your STRC income and model long-term portfolio growth. Compare Strategy's 11.50% preferred stock against US Treasuries and bank savings over 1–10 years. Adjust investment size, reinvestment rate, and time horizon.",
  openGraph: {
    title: 'STRC Income Calculator — Strategy Preferred Stock Returns Projector',
    description: "Model your STRC income and compare Strategy's 11.50% preferred stock against US Treasuries and bank savings.",
    type: 'website',
    url: 'https://digitalcredityield.com/strc/projector',
  },
};

export default async function STRCProjector() {
  const q = await getStockQuote('STRC').catch(() => null);
  const liveYield = q?.dividendYield ?? ASSET_RATES['STRC'];
  return <AssetProjectorPage ticker="STRC" liveYield={liveYield} />;
}
