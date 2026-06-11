import { readFile } from 'fs/promises';
import { join } from 'path';
import DividendHistoryPage from '@/components/DividendHistoryPage';

export const metadata = {
  alternates: { canonical: '/strc/dividends' },
  title: 'STRC Dividend History',
  description: "Complete STRC dividend history. Strategy's preferred stock pays 11.50% annually in semi-monthly cash. Track per-share amounts and payment dates.",
  openGraph: {
    title: 'STRC Dividend History — Strategy Preferred Stock Semi-Monthly Payments',
    description: "Complete record of every STRC monthly dividend payment from Strategy's preferred stock.",
    type: 'website',
    url: 'https://www.digitalcredityield.com/strc/dividends',
    images: [{ url: '/api/og?title=STRC+Dividend+History&sub=Semi-monthly+payment+records&rate=11.50%25' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "STRC Dividend History — Strategy Preferred Stock Semi-Monthly Payments",
    description: "Complete record of every STRC monthly dividend payment from Strategy's preferred stock.",
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

export default async function STRCDividends() {
  const dividends = await getDividends('STRC');
  return <DividendHistoryPage ticker="STRC" dividends={dividends} />;
}
