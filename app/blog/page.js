import { articles } from '@/lib/articles';
import AadsAd from '@/components/AadsAd';
import BlogIndex from '@/components/BlogIndex';

export const metadata = {
  alternates: { canonical: '/blog' },
  title: 'Blog & Insights',
  description: 'Educational articles on preferred equity, high-yield income assets, STRC, SATA, dividend investing, and the Bitcoin treasury model.',
  openGraph: {
    title: 'Blog & Insights — Digital Credit Yield',
    description: 'Educational articles on STRC, SATA, preferred equity, dividend investing strategies, and the Bitcoin treasury model.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/blog',
    images: [{ url: '/og?v=2&title=Blog+%26+Insights&sub=Preferred+equity+education&tag=Blog' }],
  },
};

export default function BlogPage() {
  const sorted = [...articles]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(({ slug, title, date, excerpt, readTime, category }) => ({ slug, title, date, excerpt, readTime, category }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-3">Blog &amp; Insights</h1>
      <p className="text-base mb-6" style={{ color: 'var(--text-muted)' }}>
        Educational articles on preferred equity, dividend income, and the assets we track.
      </p>

      <BlogIndex articles={sorted} />

      <AadsAd />

      <div className="mt-8 p-5 rounded-xl" style={{ background: 'rgba(200,137,58,0.08)', border: '1px solid var(--accent-gold)' }}>
        <p className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>Important Disclaimer</p>
        <p className="text-sm mt-2 leading-6" style={{ color: 'var(--text-muted)' }}>
          Digital Credit Yield is not a financial advisor. All content is provided for educational
          and research purposes only. Nothing on this site constitutes financial advice, investment
          advice, or a solicitation to buy or sell any financial instrument. Always consult a qualified
          financial adviser before making investment decisions.
        </p>
      </div>
    </div>
  );
}
