import { articles } from '@/lib/articles';
import { BMNP_ENABLED } from '@/lib/constants';

export default function sitemap() {
  const base = 'https://www.digitalcredityield.com';
  const now = new Date().toISOString();

  const blogEntries = articles.map(article => ({
    url: `${base}/blog/${article.slug}`,
    lastModified: new Date(article.updated || article.date).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    // Daily — live price data changes every trading day
    { url: base,                          lastModified: now,          changeFrequency: 'daily',   priority: 1   },
    { url: `${base}/strc`,                lastModified: now,          changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/strc/chart`,          lastModified: now,          changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/sata`,                lastModified: now,          changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/sata/chart`,          lastModified: now,          changeFrequency: 'daily',   priority: 0.8 },
    ...(BMNP_ENABLED ? [
      { url: `${base}/bmnp`,                lastModified: now,          changeFrequency: 'daily',   priority: 0.9 },
      { url: `${base}/bmnp/chart`,          lastModified: now,          changeFrequency: 'daily',   priority: 0.8 },
    ] : []),
    // Weekly — money flow and dividend pages update on new payments
    { url: `${base}/money-flow`,          lastModified: now,          changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/strc/dividends`,      lastModified: now,          changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/sata/dividends`,      lastModified: now,          changeFrequency: 'weekly',  priority: 0.7 },
    ...(BMNP_ENABLED ? [
      { url: `${base}/bmnp/dividends`,      lastModified: now,          changeFrequency: 'weekly',  priority: 0.7 },
    ] : []),
    { url: `${base}/blog`,                lastModified: now,          changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/thought-of-the-day`,  lastModified: now,          changeFrequency: 'daily',   priority: 0.6 },
    { url: `${base}/quiz`,                lastModified: now,          changeFrequency: 'daily',   priority: 0.6 },
    // Static tools — content doesn't change between deployments
    { url: `${base}/strc/projector`,      lastModified: '2026-06-08', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/strc/differentiator`, lastModified: '2026-06-08', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/sata/projector`,      lastModified: '2026-06-08', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/sata/differentiator`, lastModified: '2026-06-08', changeFrequency: 'monthly', priority: 0.6 },
    ...(BMNP_ENABLED ? [
      { url: `${base}/bmnp/projector`,      lastModified: '2026-06-08', changeFrequency: 'monthly', priority: 0.7 },
      { url: `${base}/bmnp/differentiator`, lastModified: '2026-06-08', changeFrequency: 'monthly', priority: 0.6 },
    ] : []),
    // Rarely-changing pages — fix dates, update manually when content changes
    { url: `${base}/faq`,                 lastModified: '2026-06-11', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/risks`,               lastModified: '2026-06-11', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/glossary`,            lastModified: '2026-06-11', changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/about`,               lastModified: '2026-06-10', changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`,             lastModified: '2026-06-10', changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${base}/privacy-policy`,      lastModified: '2026-06-10', changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,               lastModified: '2026-06-08', changeFrequency: 'yearly',  priority: 0.3 },
    ...blogEntries,
  ];
}
