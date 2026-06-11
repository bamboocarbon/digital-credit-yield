/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['yahoo-finance2', 'sharp', '@napi-rs/canvas', 'ffmpeg-static', 'resend'],
  allowedDevOrigins: ['192.168.1.70'],
};

export default nextConfig;
