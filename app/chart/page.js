import ChartTool from '@/components/ChartTool';
import { resolveStock } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/chart' },
  title: 'Live Price & Yield Charts',
  description: 'Live price charts for STRC, SATA, BMNP and CHAD preferred stock. Track each price against its par value and see how the effective yield changes with the market.',
  openGraph: {
    title: 'Live Price & Yield Charts — STRC, SATA, BMNP & CHAD',
    description: 'Live price charts for Strategy, Strive, Bitmine and DeFi Development Corp. preferred stock. Track price vs par and effective yield.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/chart',
    images: [{ url: '/og?v=3&title=Price+%26+Yield+Charts&sub=STRC+SATA+BMNP+%26+CHAD&tag=Live+Chart' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Price & Yield Charts — STRC, SATA, BMNP & CHAD',
    description: 'Live price charts for Strategy, Strive, Bitmine and DeFi Development Corp. preferred stock.',
  },
};

export default async function ChartPage({ searchParams }) {
  const sp = await searchParams;
  const initialStock = resolveStock(sp?.stock);
  return <ChartTool initialStock={initialStock} />;
}
