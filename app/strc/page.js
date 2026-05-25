import AssetHub from '@/components/AssetHub';

export const metadata = {
  alternates: { canonical: '/strc' },
  title: 'STRC Hub — Digital Credit Yield',
  description: "Live price, yield, and data for Strategy's STRC perpetual preferred stock.",
};

export default function STRCPage() {
  return <AssetHub ticker="STRC" name="Strategy's Perpetual Preferred Stock" />;
}
