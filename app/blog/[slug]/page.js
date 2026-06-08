import { notFound } from 'next/navigation';
import Link from 'next/link';
import { articles, getArticle } from '@/lib/articles';
import AadsAd from '@/components/AadsAd';

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
    openGraph: {
      title: article.title,
      description: desc,
      type: 'article',
      url: `https://www.digitalcredityield.com/blog/${slug}`,
      publishedTime: article.date,
      images: [{ url: `/api/og?title=${encodeURIComponent(article.title)}&sub=${encodeURIComponent(article.category)}&tag=Blog` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: desc,
    },
  };
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

const tickerColour = {
  STRC: '#4ade80',
  SATA: '#3b82f6',
  BMNP: '#fde047',
};

function categoryStyle(category) {
  const c = tickerColour[category];
  return c
    ? { color: c }
    : { color: '#9ca3af' };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { Content } = article;

  const desc = article.excerpt.length > 155
    ? article.excerpt.slice(0, 152).replace(/\s\S*$/, '') + '...'
    : article.excerpt;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: desc,
    datePublished: article.date,
    dateModified: article.date,
    image: `https://www.digitalcredityield.com/api/og?title=${encodeURIComponent(article.title)}&sub=${encodeURIComponent(article.category)}&tag=Blog`,
    url: `https://www.digitalcredityield.com/blog/${slug}`,
    author: {
      '@type': 'Person',
      name: 'Robin Gillingham',
      url: 'https://www.digitalcredityield.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Digital Credit Yield',
      url: 'https://www.digitalcredityield.com',
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm mb-8 transition-opacity hover:opacity-75"
        style={{ color: 'var(--text-muted)' }}
      >
        ← Back to Blog
      </Link>

      <span
        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-4"
        style={categoryStyle(article.category)}
      >
        {article.category}
      </span>

      <h1 className="text-3xl font-bold leading-tight mb-4">{article.title}</h1>

      <div className="flex items-center gap-3 text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
        <span>{formatDate(article.date)}</span>
        <span style={{ color: 'var(--border)' }}>·</span>
        <span>{article.readTime}</span>
        <span style={{ color: 'var(--border)' }}>·</span>
        <span>By <Link href="/about" className="transition-opacity hover:opacity-75" style={{ color: 'var(--accent-gold)' }}>Robin Gillingham</Link></span>
      </div>

      <div className="article-prose">
        <Content />
      </div>

      <div className="mt-12 p-5 rounded-xl flex items-start gap-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <img
          src="/about-photo.jpg?v=2"
          alt="Robin Gillingham, founder of Digital Credit Yield"
          className="rounded-full object-cover"
          style={{ width: 56, height: 56, flexShrink: 0 }}
        />
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>About the author</p>
          <p className="text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
            <strong>Robin Gillingham</strong> is the founder of Digital Credit Yield. After a career in
            aircraft engineering, he moved into full-time trading in 2019 and now builds programs to track and
            visualise high-yield preferred stocks such as STRC, SATA and BMNP.{' '}
            <Link href="/about" className="transition-opacity hover:opacity-75" style={{ color: 'var(--accent-gold)' }}>Read more →</Link>
          </p>
        </div>
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

      <AadsAd />
    </div>
  );
}
