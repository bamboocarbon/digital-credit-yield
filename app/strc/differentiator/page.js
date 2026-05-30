import AssetDifferentiatorPage from '@/components/AssetDifferentiatorPage';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/strc/differentiator' },
  title: 'STRC vs US Treasuries — Strategy Preferred Stock Income Compared',
  description: "Compare STRC's 11.50% dividend against US Treasuries and bank savings. See how much more income Strategy's preferred stock generates over any time horizon.",
  openGraph: {
    title: 'STRC vs US Treasuries — Strategy Preferred Stock Income Compared',
    description: "Compare STRC's 11.50% annual dividend against US Treasuries and bank savings.",
    type: 'website',
    url: 'https://digitalcredityield.com/strc/differentiator',
    images: [{ url: '/api/og?title=STRC+vs+Treasuries&sub=Compare+income+vs+Treasuries&tag=Comparison' }],
  },
};

export default async function STRCDifferentiator() {
  let liveYield = ASSET_RATES.STRC;
  try {
    const data = await getStockQuote('STRC');
    if (data.dividendYield != null) liveYield = data.dividendYield;
  } catch {}
  return <AssetDifferentiatorPage ticker="STRC" liveYield={liveYield} />;
}
