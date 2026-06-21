import { readFile } from 'fs/promises';
import { join } from 'path';
import DividendsTool from '@/components/DividendsTool';
import { VALID_TICKERS, resolveStock } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/dividends' },
  title: 'Dividend History',
  description: 'Complete dividend payment history for STRC, SATA and BMNP preferred stock. Track per-share amounts and payment dates as the record grows over time.',
  openGraph: {
    title: 'Dividend History — STRC, SATA & BMNP',
    description: 'Complete record of every dividend payment from Strategy, Strive and Bitmine preferred stock.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/dividends',
    images: [{ url: '/og?v=3&title=Dividend+History&sub=STRC+SATA+%26+BMNP&tag=Payment+Records' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dividend History — STRC, SATA & BMNP',
    description: 'Complete record of every dividend payment from Strategy, Strive and Bitmine preferred stock.',
  },
};

async function getDividends(ticker) {
  try {
    const data = await readFile(join(process.cwd(), 'data', `dividends-${ticker}.json`), 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export default async function DividendsPage({ searchParams }) {
  const sp = await searchParams;
  const initialStock = resolveStock(sp?.stock);
  const entries = await Promise.all(VALID_TICKERS.map(async ticker => [ticker, await getDividends(ticker)]));
  const dividendsByStock = Object.fromEntries(entries);
  return <DividendsTool initialStock={initialStock} dividendsByStock={dividendsByStock} />;
}
