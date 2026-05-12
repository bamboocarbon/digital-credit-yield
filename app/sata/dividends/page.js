import DividendHistoryPage from '@/components/DividendHistoryPage';

export const metadata = {
  title: 'SATA Dividend History — Digital Credit Yield',
  description: 'Full dividend payment history for SATA. Track every monthly distribution, per-share amounts, and calculate your income based on the shares you hold.',
};

export default function SATADividends() {
  return <DividendHistoryPage ticker="SATA" />;
}
