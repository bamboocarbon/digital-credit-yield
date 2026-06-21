// The per-ticker tool pages (/strc/chart, /sata/projector, …) were consolidated
// into single selectable pages. 301 the old indexed URLs to the new routes,
// preserving which stock was selected via ?stock=.
const TOOL_REDIRECTS = ['strc', 'sata', 'bmnp'].flatMap(t =>
  Object.entries({ chart: 'chart', projector: 'projector', differentiator: 'vs-treasuries', dividends: 'dividends' })
    .map(([oldTool, newRoute]) => ({
      source: `/${t}/${oldTool}`,
      destination: `/${newRoute}?stock=${t}`,
      permanent: true,
    }))
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['yahoo-finance2', 'sharp', '@napi-rs/canvas', 'ffmpeg-static', 'resend'],
  allowedDevOrigins: ['192.168.1.70'],
  // Social cards are served from /og rather than /api/og: X cached our old
  // robots.txt (which disallowed /api/) and kept refusing the image fetch.
  async rewrites() {
    return [{ source: '/og', destination: '/api/og' }];
  },
  async redirects() {
    return [
      // The news + thoughts/quiz admins were merged into a single /admin page.
      { source: '/news-admin', destination: '/admin', permanent: false },
      { source: '/thoughts-admin', destination: '/admin', permanent: false },
      ...TOOL_REDIRECTS,
    ];
  },
  // generateMp4.js registers these with @napi-rs/canvas at runtime
  // (Vercel lambdas have no system fonts); the dynamic path isn't traceable.
  outputFileTracingIncludes: {
    '/api/cron/daily-email': ['./public/fonts/**'],
  },
};

export default nextConfig;
