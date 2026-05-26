import './globals.css';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

export const metadata = {
  metadataBase: new URL('https://www.digitalcredityield.com'),
  title: 'Digital Credit Yield — STRC & SATA Preferred Stock Tracker',
  description: 'Independent tracker for STRC (Strategy, 11.50% monthly dividend) and SATA (Strive, 13.00% daily dividend) — high-yield preferred stocks on Nasdaq. Live prices, yields, and income projectors.',
  openGraph: {
    title: 'Digital Credit Yield — STRC & SATA Preferred Stock Tracker',
    description: 'Track STRC and SATA high-yield preferred stocks. Live prices, dividend history, and income projectors.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Digital Credit Yield — STRC & SATA Preferred Stock Tracker',
    description: 'Track STRC and SATA high-yield preferred stocks. Live prices, dividend history, and income projectors.',
  },
  other: {
    'google-adsense-account': 'ca-pub-2860789238138317',
    'msvalidate.01': 'D3F294A0F265C1CC2A354FAB6748707D',
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
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
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
