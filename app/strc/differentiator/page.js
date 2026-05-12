import AssetDifferentiatorPage from '@/components/AssetDifferentiatorPage';

export const metadata = {
  title: 'STRC Differentiator — Digital Credit Yield',
  description: 'See how STRC\'s 11.50% annual dividend compares against US Treasuries, high-yield savings, and bank accounts over your chosen time horizon.',
};

export default function STRCDifferentiator() {
  return <AssetDifferentiatorPage ticker="STRC" />;
}
