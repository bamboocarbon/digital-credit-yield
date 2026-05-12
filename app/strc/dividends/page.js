import DividendHistoryPage from '@/components/DividendHistoryPage';

export const metadata = {
  title: 'STRC Dividend History — Digital Credit Yield',
  description: 'Full dividend payment history for STRC. Track every monthly distribution, per-share amounts, and calculate your income based on the shares you hold.',
};

export default function STRCDividends() {
  return <DividendHistoryPage ticker="STRC" />;
}
