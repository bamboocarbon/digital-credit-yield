import AssetHub from '@/components/AssetHub';

export const metadata = {
  title: 'SATA Hub — Digital Credit Yield',
  description: "Live price, yield, and data for Strive's SATA preferred equity instrument.",
};

export default function SATAPage() {
  return <AssetHub ticker="SATA" name="Strive's Preferred Equity Instrument" />;
}
