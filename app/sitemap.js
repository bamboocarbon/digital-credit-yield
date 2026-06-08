import { articles } from '@/lib/articles';

export default function sitemap() {
  const base = 'https://www.digitalcredityield.com';
  const now = new Date().toISOString();

  const blogEntries = articles.map(article => ({
    url: `${base}/blog/${article.slug}`,
    lastModified: new Date(article.date).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/strc`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/strc/chart`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/strc/dividends`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/strc/projector`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/strc/differentiator`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/sata`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/sata/chart`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/sata/dividends`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/sata/projector`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/sata/differentiator`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/bmnp`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/bmnp/chart`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/bmnp/dividends`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/bmnp/projector`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/bmnp/differentiator`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/money-flow`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...blogEntries,
  ];
}
