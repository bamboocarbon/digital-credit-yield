import { readFile } from 'fs/promises';
import { join } from 'path';
import DividendHistoryPage from '@/components/DividendHistoryPage';

export const metadata = {
  alternates: { canonical: '/strc/dividends' },
  title: 'STRC Dividend History — Strategy Preferred Stock Monthly Payments',
  description: "Complete STRC dividend payment history. Strategy's preferred stock pays 11.50% annually in monthly cash distributions. Track per-share amounts, payment dates, and calculate income from your holding.",
  openGraph: {
    title: 'STRC Dividend History — Strategy Preferred Stock Monthly Payments',
    description: "Complete record of every STRC monthly dividend payment from Strategy's preferred stock.",
    type: 'website',
    url: 'https://digitalcredityield.com/strc/dividends',
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
