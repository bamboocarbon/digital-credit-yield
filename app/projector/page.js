import ProjectorTool from '@/components/ProjectorTool';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES, VALID_TICKERS, resolveStock } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/projector' },
  title: 'Income & Growth Projector',
  description: 'Model income and portfolio growth from STRC, SATA or BMNP preferred stock. Compare against US Treasuries and bank savings over 1–20 years.',
  openGraph: {
    title: 'Income & Growth Projector — STRC, SATA & BMNP',
    description: 'Model your dividend income and portfolio growth from Strategy, Strive and Bitmine preferred stock over any time horizon.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/projector',
    images: [{ url: '/og?v=3&title=Income+Calculator&sub=Model+your+dividend+income&tag=Income+Tool' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Income & Growth Projector — STRC, SATA & BMNP',
    description: 'Model your dividend income and portfolio growth from Strategy, Strive and Bitmine preferred stock.',
  },
};

async function getLiveData() {
  const entries = await Promise.all(VALID_TICKERS.map(async ticker => {
    const q = await getStockQuote(ticker).catch(() => null);
    return [ticker, {
      yield: q?.dividendYield ?? ASSET_RATES[ticker],
      price: q?.price ?? null,
    }];
  }));
  return Object.fromEntries(entries);
}

export default async function ProjectorPage({ searchParams }) {
  const sp = await searchParams;
  const initialStock = resolveStock(sp?.stock);
  const liveData = await getLiveData();
  const liveYields = Object.fromEntries(Object.entries(liveData).map(([t, d]) => [t, d.yield]));
  const livePrices = Object.fromEntries(Object.entries(liveData).map(([t, d]) => [t, d.price]));
  return <ProjectorTool initialStock={initialStock} liveYields={liveYields} livePrices={livePrices} />;
}
