import AssetDifferentiatorPage from '@/components/AssetDifferentiatorPage';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/bmnp/differentiator' },
  title: 'BMNP vs US Treasuries',
  description: "Compare BMNP's 9.50% weekly dividend against US Treasuries and bank savings. See how much more income BitMine's preferred stock generates over any time horizon.",
  openGraph: {
    title: 'BMNP vs US Treasuries — BitMine Preferred Stock Income Compared',
    description: "Compare BMNP's 9.50% annual dividend against US Treasuries and bank savings.",
    type: 'website',
    url: 'https://www.digitalcredityield.com/bmnp/differentiator',
    images: [{ url: '/api/og?title=BMNP+vs+Treasuries&sub=Compare+income+vs+Treasuries&tag=Comparison' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "BMNP vs US Treasuries — BitMine Preferred Stock Income Compared",
    description: "Compare BMNP's 9.50% annual dividend against US Treasuries and bank savings.",
  },
};

export default async function BMNPDifferentiator() {
  let liveYield = ASSET_RATES.BMNP;
  try {
    const data = await getStockQuote('BMNP');
    if (data.dividendYield != null) liveYield = data.dividendYield;
  } catch {}
  return <AssetDifferentiatorPage ticker="BMNP" liveYield={liveYield} />;
}
