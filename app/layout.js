import './globals.css';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

export const metadata = {
  metadataBase: new URL('https://www.digitalcredityield.com'),
  title: 'Digital Credit Yield — STRC & SATA Preferred Stock Tracker',
  description: 'Independent tracker for STRC (11.50%) and SATA (13.00%) — high-yield preferred stocks on Nasdaq. Live prices, yields, and income projectors.',
  openGraph: {
    title: 'Digital Credit Yield — STRC & SATA Preferred Stock Tracker',
    description: 'Track STRC and SATA high-yield preferred stocks. Live prices, dividend history, and income projectors.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Credit Yield — STRC & SATA Preferred Stock Tracker',
    description: 'Track STRC and SATA high-yield preferred stocks. Live prices, dividend history, and income projectors.',
  },
  other: {
    'google-adsense-account': 'ca-pub-2860789238138317',
    'msvalidate.01': 'D3F294A0F265C1CC2A354FAB6748707D',
    'coinzilla': '01cc6e2f7dcde56670e079017e741dd1',
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Digital Credit Yield',
  url: 'https://www.digitalcredityield.com',
  logo: 'https://www.digitalcredityield.com/logo-tweet.png',
  description: 'Independent tracker for STRC and SATA high-yield preferred stocks — live prices, dividend history, and income projectors.',
  sameAs: ['https://x.com/DCYieldHub'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <CookieBanner />
        <Script id="consent-init" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
          try {
            if (localStorage.getItem('cookieConsent') === 'accepted') {
              gtag('consent', 'update', {
                ad_storage: 'granted',
                analytics_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
              });
            }
          } catch(e) {}
        `}</Script>
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
