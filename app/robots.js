import { BMNP_ENABLED } from '@/lib/constants';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/news-admin', '/api/', ...(!BMNP_ENABLED ? ['/bmnp'] : [])] },
    sitemap: 'https://www.digitalcredityield.com/sitemap.xml',
  };
}
