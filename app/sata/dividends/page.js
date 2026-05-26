import { readFile } from 'fs/promises';
import { join } from 'path';
import DividendHistoryPage from '@/components/DividendHistoryPage';

export const metadata = {
  alternates: { canonical: '/sata/dividends' },
  title: 'SATA Dividend History — Strive Daily Dividend Payments Record',
  description: "Complete SATA dividend payment history. Strive's preferred stock pays 13.00% annually — monthly through June 2026, then as a daily cash payment on every NYSE business day. Track every payment and calculate your income.",
  openGraph: {
    title: 'SATA Dividend History — Strive Daily Dividend Payments Record',
    description: "Complete record of every SATA dividend payment from Strive's preferred stock — including daily business-day payments from June 2026.",
    type: 'website',
    url: 'https://digitalcredityield.com/sata/dividends',
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
