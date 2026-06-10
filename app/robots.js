export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/news-admin', '/api/'] },
    sitemap: 'https://www.digitalcredityield.com/sitemap.xml',
  };
}
