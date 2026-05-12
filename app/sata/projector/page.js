import AssetProjectorPage from '@/components/AssetProjectorPage';

export const metadata = {
  title: 'SATA Growth Projector — Digital Credit Yield',
  description: 'Model your future income and portfolio growth from holding SATA. Adjust yield, investment amount, and time horizon to project returns over 1–10 years.',
};

export default function SATAProjector() {
  return <AssetProjectorPage ticker="SATA" />;
}
