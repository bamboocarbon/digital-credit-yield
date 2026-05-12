import AssetDifferentiatorPage from '@/components/AssetDifferentiatorPage';

export const metadata = {
  title: 'SATA Differentiator — Digital Credit Yield',
  description: 'See how SATA\'s 13.00% annual dividend compares against US Treasuries, high-yield savings, and bank accounts over your chosen time horizon.',
};

export default function SATADifferentiator() {
  return <AssetDifferentiatorPage ticker="SATA" />;
}
