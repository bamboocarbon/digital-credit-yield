import { readFile } from 'fs/promises';
import { join } from 'path';
import DividendHistoryPage from '@/components/DividendHistoryPage';

export const metadata = {
  alternates: { canonical: '/sata/dividends' },
  title: 'SATA Dividend History — Strive Daily Dividend Payments',
  description: "Complete SATA dividend history. Strive's preferred stock pays 13.00% annually in daily cash (~$0.052/share/day). Track per-share amounts and payment dates.",
  openGraph: {
    title: 'SATA Dividend History — Strive Daily Dividend Payments',
    description: "Complete record of every SATA daily dividend payment from Strive's preferred stock.",
    type: 'website',
    url: 'https://www.digitalcredityield.com/sata/dividends',
    images: [{ url: '/api/og?title=SATA+Dividend+History&sub=Daily+payment+records&rate=13.00%25' }],
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

export default async function SATADividends() {
  const dividends = await getDividends('SATA');
  return <DividendHistoryPage ticker="SATA" dividends={dividends} />;
}
