import { readFile } from 'fs/promises';
import { join } from 'path';
import DividendHistoryPage from '@/components/DividendHistoryPage';

export const metadata = {
  alternates: { canonical: '/bmnp/dividends' },
  title: 'BMNP Dividend History — BitMine Preferred Stock Weekly Payments',
  description: "Complete BMNP dividend history. BitMine's preferred stock pays 9.50% annually in weekly cash. Track per-share amounts and payment dates.",
  openGraph: {
    title: 'BMNP Dividend History — BitMine Preferred Stock Weekly Payments',
    description: "Complete record of every BMNP weekly dividend payment from BitMine's preferred stock.",
    type: 'website',
    url: 'https://digitalcredityield.com/bmnp/dividends',
    images: [{ url: '/api/og?title=BMNP+Dividend+History&sub=Weekly+payment+records&rate=9.50%25' }],
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

export default async function BMNPDividends() {
  const dividends = await getDividends('BMNP');
  return <DividendHistoryPage ticker="BMNP" dividends={dividends} />;
}
