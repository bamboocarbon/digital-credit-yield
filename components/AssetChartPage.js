import SubNav from '@/components/SubNav';
import AssetChartContent from '@/components/AssetChartContent';

export default function AssetChartPage({ ticker }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SubNav ticker={ticker} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{ticker} Effective Yield &amp; Price Chart</h1>
      <AssetChartContent ticker={ticker} />
    </div>
  );
}
