import { notFound } from 'next/navigation';
import Link from 'next/link';
import { articles, getArticle } from '@/lib/articles';

export async function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const desc = article.excerpt.length > 155
    ? article.excerpt.slice(0, 152).replace(/\s\S*$/, '') + '...'
    : article.excerpt;
  return {
    title: article.title,
    description: desc,
    alternates: { canonical: `/blog/${slug}` },
  };
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

const categoryColour = {
  Education: '#6366f1',
  STRC: '#f5a623',
  SATA: '#22c55e',
  Comparison: '#3b82f6',
  Guide: '#8b5cf6',
};

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { Content } = article;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm mb-8 transition-opacity hover:opacity-75"
        style={{ color: 'var(--text-muted)' }}
      >
        ← Back to Blog
      </Link>

      <span
        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-4"
        style={{
          background: (categoryColour[article.category] ?? '#6b7280') + '22',
          color: categoryColour[article.category] ?? '#6b7280',
        }}
      >
        {article.category}
      </span>

      <h1 className="text-3xl font-bold leading-tight mb-4">{article.title}</h1>

      <div className="flex items-center gap-3 text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
        <span>{formatDate(article.date)}</span>
        <span style={{ color: 'var(--border)' }}>·</span>
        <span>{article.readTime}</span>
      </div>

      <div className="article-prose">
        <Content />
      </div>

      <div className="mt-10 p-5 rounded-xl" style={{ background: 'rgba(200,137,58,0.08)', border: '1px solid var(--accent-gold)' }}>
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
