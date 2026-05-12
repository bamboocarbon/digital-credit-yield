import './globals.css';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

export const metadata = {
  title: 'Digital Credit Yield — Track STRC & SATA Income Assets',
  description: 'Track, analyse and project the growth of next-generation income assets. Live prices, yields, and growth projections for STRC and SATA.',
  openGraph: {
    title: 'Digital Credit Yield — Track STRC & SATA Income Assets',
    description: 'Track, analyse and project the growth of next-generation income assets. Live prices, yields, and growth projections for STRC and SATA.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Digital Credit Yield — Track STRC & SATA Income Assets',
    description: 'Track, analyse and project the growth of next-generation income assets. Live prices, yields, and growth projections for STRC and SATA.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <CookieBanner />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
