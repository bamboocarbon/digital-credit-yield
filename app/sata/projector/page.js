import AssetProjectorPage from '@/components/AssetProjectorPage';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/sata/projector' },
  title: 'SATA Income Calculator',
  description: "Model SATA income and portfolio growth. Compare Strive's 13.00% preferred stock against US Treasuries and bank savings over 1–20 years.",
  openGraph: {
    title: 'SATA Income Calculator — Strive Preferred Stock Returns Projector',
    description: "Model your SATA income and compare Strive's 13.00% preferred stock against US Treasuries and bank savings.",
    type: 'website',
    url: 'https://www.digitalcredityield.com/sata/projector',
    images: [{ url: '/og?v=2&title=SATA+Income+Calculator&sub=Model+your+dividend+income&tag=Income+Tool' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "SATA Income Calculator — Strive Preferred Stock Returns Projector",
    description: "Model your SATA income and compare Strive's 13.00% preferred stock against US Treasuries and bank savings.",
  },
};

export default async function SATAProjector() {
  const q = await getStockQuote('SATA').catch(() => null);
  const liveYield = q?.dividendYield ?? ASSET_RATES['SATA'];
  return <AssetProjectorPage ticker="SATA" liveYield={liveYield} />;
}
