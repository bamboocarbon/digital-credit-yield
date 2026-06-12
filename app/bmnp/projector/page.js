import AssetProjectorPage from '@/components/AssetProjectorPage';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/bmnp/projector' },
  title: 'BMNP Income Calculator',
  description: "Model BMNP income and portfolio growth. Compare BitMine's 9.50% preferred stock against US Treasuries and bank savings over 1–20 years.",
  openGraph: {
    title: 'BMNP Income Calculator — BitMine Preferred Stock Returns Projector',
    description: "Model your BMNP income and compare BitMine's 9.50% preferred stock against US Treasuries and bank savings.",
    type: 'website',
    url: 'https://www.digitalcredityield.com/bmnp/projector',
    images: [{ url: '/api/og?v=2&title=BMNP+Income+Calculator&sub=Model+your+dividend+income&tag=Income+Tool' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "BMNP Income Calculator — BitMine Preferred Stock Returns Projector",
    description: "Model your BMNP income and compare BitMine's 9.50% preferred stock against US Treasuries and bank savings.",
  },
};

export default async function BMNPProjector() {
  const q = await getStockQuote('BMNP').catch(() => null);
  const liveYield = q?.dividendYield ?? ASSET_RATES['BMNP'];
  return <AssetProjectorPage ticker="BMNP" liveYield={liveYield} />;
}
