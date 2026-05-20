import { readFile } from 'fs/promises';
import { join } from 'path';
import DividendHistoryPage from '@/components/DividendHistoryPage';

export const metadata = {
  title: 'SATA Dividend History — Digital Credit Yield',
  description: 'Full dividend payment history for SATA. Track every monthly distribution, per-share amounts, and calculate your income based on the shares you hold.',
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
