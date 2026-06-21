import VsTreasuriesTool from '@/components/VsTreasuriesTool';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES, VALID_TICKERS, resolveStock } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/vs-treasuries' },
  title: 'Income vs US Treasuries',
  description: 'Compare STRC, SATA and BMNP preferred stock dividends against US Treasuries and bank savings. See how much more income each generates over any time horizon.',
  openGraph: {
    title: 'Preferred Stock Income vs US Treasuries',
    description: 'Compare STRC, SATA and BMNP dividends against US Treasuries and bank savings over your chosen time horizon.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/vs-treasuries',
    images: [{ url: '/og?v=3&title=vs+Treasuries&sub=Compare+income+vs+Treasuries&tag=Comparison' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preferred Stock Income vs US Treasuries',
    description: 'Compare STRC, SATA and BMNP dividends against US Treasuries and bank savings.',
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

export default async function VsTreasuriesPage({ searchParams }) {
  const sp = await searchParams;
  const initialStock = resolveStock(sp?.stock);
  const liveData = await getLiveData();
  const liveYields = Object.fromEntries(Object.entries(liveData).map(([t, d]) => [t, d.yield]));
  const livePrices = Object.fromEntries(Object.entries(liveData).map(([t, d]) => [t, d.price]));
  return <VsTreasuriesTool initialStock={initialStock} liveYields={liveYields} livePrices={livePrices} />;
}
