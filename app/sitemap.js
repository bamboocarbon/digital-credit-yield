export default function sitemap() {
  const base = 'https://www.digitalcredityield.com';
  const now = new Date().toISOString();

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
    { url: `${base}/money-flow`, lastModified: '2026-05-28', changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/blog/what-is-preferred-stock`, lastModified: '2026-03-10', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog/how-strc-works`, lastModified: '2026-03-17', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog/bitcoin-treasury-companies`, lastModified: '2026-03-25', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog/what-is-effective-yield`, lastModified: '2026-04-04', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog/strc-vs-sata`, lastModified: '2026-05-05', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog/how-to-use-the-growth-projector`, lastModified: '2026-05-14', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog/monthly-vs-daily-dividends`, lastModified: '2026-05-20', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog/how-sata-works`, lastModified: '2026-05-23', changeFrequency: 'monthly', priority: 0.6 },
  ];
}
