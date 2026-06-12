import { BMNP_ENABLED } from '@/lib/constants';

export default function robots() {
  return {
    // No '/api/' disallow — it blocks X/Twitter from fetching the /api/og card images
    rules: { userAgent: '*', allow: '/', disallow: ['/news-admin', ...(!BMNP_ENABLED ? ['/bmnp'] : [])] },
    sitemap: 'https://www.digitalcredityield.com/sitemap.xml',
  };
}
