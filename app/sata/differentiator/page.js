import AssetDifferentiatorPage from '@/components/AssetDifferentiatorPage';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/sata/differentiator' },
  title: 'SATA vs US Treasuries',
  description: "Compare SATA's 13.00% dividend against US Treasuries and bank savings. See how much more income Strive's preferred stock generates over any time horizon.",
  openGraph: {
    title: 'SATA vs US Treasuries — Strive Preferred Stock Income Compared',
    description: "Compare SATA's 13.00% daily dividend against US Treasuries and bank savings.",
    type: 'website',
    url: 'https://www.digitalcredityield.com/sata/differentiator',
    images: [{ url: '/og?v=3&title=SATA+vs+Treasuries&sub=Compare+income+vs+Treasuries&tag=Comparison' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "SATA vs US Treasuries — Strive Preferred Stock Income Compared",
    description: "Compare SATA's 13.00% daily dividend against US Treasuries and bank savings.",
  },
};

export default async function SATADifferentiator() {
  let liveYield = ASSET_RATES.SATA;
  try {
    const data = await getStockQuote('SATA');
    if (data.dividendYield != null) liveYield = data.dividendYield;
  } catch {}
  return <AssetDifferentiatorPage ticker="SATA" liveYield={liveYield} />;
}
