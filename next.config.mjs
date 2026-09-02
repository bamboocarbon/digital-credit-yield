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
  serverExternalPackages: ['yahoo-finance2', 'sharp', '@napi-rs/canvas', 'ffmpeg-static', 'resend', 'tesseract.js'],
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
  //
  // tesseract.js's own worker-script (src/worker-script/node/index.js) does
  // `require('..')` to reach its package root — a bare parent-directory
  // require Next's output-file-tracer can't follow statically, so even with
  // serverExternalPackages set, the traced bundle was missing files and
  // threw "Cannot find module '..'" at runtime (2026-09-02, confirmed via
  // Vercel's own runtime-error logs — the OCR backfill on /api/thoughts
  // would then hang instead of failing cleanly, eventually killed by the
  // platform's 60s function timeout). Force-including the whole package
  // sidesteps the tracer's static-analysis limit the same way the font
  // glob above does.
  outputFileTracingIncludes: {
    '/api/cron/daily-email': ['./public/fonts/**'],
    '/api/thoughts': ['./node_modules/tesseract.js/**'],
  },
};

export default nextConfig;
