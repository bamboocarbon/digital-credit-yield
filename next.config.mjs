/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['yahoo-finance2', 'sharp', '@napi-rs/canvas', 'ffmpeg-static', 'resend'],
  allowedDevOrigins: ['192.168.1.70'],
  // Social cards are served from /og rather than /api/og: X cached our old
  // robots.txt (which disallowed /api/) and kept refusing the image fetch.
  async rewrites() {
    return [{ source: '/og', destination: '/api/og' }];
  },
  // Ezoic manages ads.txt centrally; 301 /ads.txt to its hosted manager so the
  // authorized-seller list stays current without redeploys. Redirects run
  // before the public/ filesystem, so no static ads.txt file is needed.
  async redirects() {
    return [{
      source: '/ads.txt',
      destination: 'https://srv.adstxtmanager.com/19390/digitalcredityield.com',
      statusCode: 301,
    }];
  },
  // generateMp4.js registers these with @napi-rs/canvas at runtime
  // (Vercel lambdas have no system fonts); the dynamic path isn't traceable.
  outputFileTracingIncludes: {
    '/api/cron/daily-email': ['./public/fonts/**'],
  },
};

export default nextConfig;
