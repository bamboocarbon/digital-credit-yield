import Link from 'next/link';
import { articles } from '@/lib/articles';

export const metadata = {
  alternates: { canonical: '/blog' },
  title: 'Blog & Insights — Digital Credit Yield',
  description: 'Educational articles on preferred equity, high-yield income assets, STRC, SATA, dividend investing, and the Bitcoin treasury model.',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

const categoryColour = {
  Education: '#6366f1',
  STRC: '#f5a623',
  SATA: '#22c55e',
  Comparison: '#3b82f6',
  Guide: '#8b5cf6',
};

export default function BlogPage() {
  const sorted = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-3">Blog &amp; Insights</h1>
      <p className="text-base mb-10" style={{ color: 'var(--text-muted)' }}>
        Educational articles on preferred equity, dividend income, and the assets we track.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map(article => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="flex flex-col rounded-xl p-5 transition-colors"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full mb-3 self-start"
              style={{
                background: (categoryColour[article.category] ?? '#6b7280') + '22',
                color: categoryColour[article.category] ?? '#6b7280',
              }}
            >
              {article.category}
            </span>
            <h2 className="text-base font-semibold leading-snug mb-2" style={{ color: 'var(--text-primary)' }}>
              {article.title}
            </h2>
            <p className="text-sm leading-6 flex-1 mb-4" style={{ color: 'var(--text-muted)' }}>
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>{formatDate(article.date)}</span>
              <span>{article.readTime}</span>
            </div>
          </Link>
        ))}
      </div>

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
