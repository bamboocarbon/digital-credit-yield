import AssetProjectorPage from '@/components/AssetProjectorPage';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/strc/projector' },
  title: 'STRC Income Calculator — Strategy Preferred Stock Projector',
  description: "Model STRC income and portfolio growth. Compare Strategy's 11.50% preferred stock against US Treasuries and bank savings over 1–20 years.",
  openGraph: {
    title: 'STRC Income Calculator — Strategy Preferred Stock Projector',
    description: "Model your STRC income and compare Strategy's 11.50% preferred stock against US Treasuries and bank savings.",
    type: 'website',
    url: 'https://digitalcredityield.com/strc/projector',
    images: [{ url: '/api/og?title=STRC+Income+Calculator&sub=Model+your+dividend+income&tag=Income+Tool' }],
  },
};

export default async function STRCProjector() {
  const q = await getStockQuote('STRC').catch(() => null);
  const liveYield = q?.dividendYield ?? ASSET_RATES['STRC'];
  return <AssetProjectorPage ticker="STRC" liveYield={liveYield} />;
}
