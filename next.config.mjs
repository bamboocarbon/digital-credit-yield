/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['yahoo-finance2', 'sharp', '@napi-rs/canvas', 'ffmpeg-static', 'resend'],
  allowedDevOrigins: ['192.168.1.70'],
  // Social cards are served from /og rather than /api/og: X cached our old
  // robots.txt (which disallowed /api/) and kept refusing the image fetch.
  async rewrites() {
    return [{ source: '/og', destination: '/api/og' }];
  },
};

export default nextConfig;
