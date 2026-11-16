'use client';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

// Pages that must not load the AdSense script (thin, quote-style content). Keep in step with the
// auto-ads URL exclusions in the AdSense console, which is the reliable backstop for client-side navigations.
const NO_AD_PATHS = ['/thought-of-the-day'];

export default function AdSenseScript({ clientId }) {
  const pathname = usePathname() || '';
  if (!clientId || NO_AD_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) return null;
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
