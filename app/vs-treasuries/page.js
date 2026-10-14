import VsTreasuriesTool from '@/components/VsTreasuriesTool';
import { getStockQuote } from '@/lib/fetchStockData';
import { ASSET_RATES, VALID_TICKERS, resolveStock } from '@/lib/constants';

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const more = resolveStock(sp?.stock) === 'MORE';
  const bench = more ? 'UK Gilts' : 'US Treasuries';
  const short = more ? 'Gilts' : 'Treasuries';
  const description = more
    ? 'Compare MORE preferred share distributions against UK gilts and bank savings. See how much more income MORE generates over any time horizon.'
    : 'Compare STRC, SATA, BMNP and CHAD preferred stock dividends against US Treasuries and bank savings. See how much more income each generates over any time horizon.';
  return {
    alternates: { canonical: more ? '/vs-treasuries?stock=more' : '/vs-treasuries' },
    title: `Income vs ${bench}`,
    description,
    openGraph: {
      title: `Preferred Stock Income vs ${bench}`,
      description: `Compare ${more ? 'MORE' : 'STRC, SATA, BMNP and CHAD'} dividends against ${bench} and bank savings over your chosen time horizon.`,
      type: 'website',
      url: `https://www.digitalcredityield.com/vs-treasuries${more ? '?stock=more' : ''}`,
      images: [{ url: `/og?v=3&title=vs+${short}&sub=Compare+income+vs+${short}&tag=Comparison` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Preferred Stock Income vs ${bench}`,
      description: `Compare ${more ? 'MORE' : 'STRC, SATA, BMNP and CHAD'} dividends against ${bench} and bank savings.`,
    },
  };
}

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
  return <VsTreasuriesTool key={initialStock} initialStock={initialStock} liveYields={liveYields} livePrices={livePrices} />;
}
