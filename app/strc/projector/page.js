import AssetProjectorPage from '@/components/AssetProjectorPage';

export const metadata = {
  title: 'STRC Growth Projector — Digital Credit Yield',
  description: 'Model your future income and portfolio growth from holding STRC. Adjust yield, investment amount, and time horizon to project returns over 1–10 years.',
};

export default function STRCProjector() {
  return <AssetProjectorPage ticker="STRC" />;
}
