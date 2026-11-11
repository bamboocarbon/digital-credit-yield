
export default function robots() {
  return {
    // No '/api/' disallow — it blocks X/Twitter from fetching the /api/og card images
    rules: { userAgent: '*', allow: '/', disallow: ['/admin'] },
    sitemap: 'https://www.digitalcredityield.com/sitemap.xml',
  };
}
