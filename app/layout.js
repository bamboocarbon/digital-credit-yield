import './globals.css';
import { DM_Sans, Roboto_Mono } from 'next/font/google';
import Script from 'next/script';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-roboto-mono',
  display: 'swap',
});
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

export const metadata = {
  metadataBase: new URL('https://www.digitalcredityield.com'),
  title: {
    default: 'Digital Credit Yield — STRC, SATA & BMNP Tracker',
    template: '%s — Digital Credit Yield',
  },
  description: 'Independent tracker for STRC, SATA and BMNP preferred stocks. Live prices, dividend history, and income projectors.',
  openGraph: {
    title: 'Digital Credit Yield — STRC, SATA & BMNP Preferred Stock Tracker',
    description: 'Independent tracker for STRC, SATA and BMNP preferred stocks. Live prices, dividend history, and income projectors.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Credit Yield — STRC, SATA & BMNP Preferred Stock Tracker',
    description: 'Independent tracker for STRC, SATA and BMNP preferred stocks. Live prices, dividend history, and income projectors.',
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
  description: 'Independent tracker for STRC, SATA and BMNP preferred stocks — live prices, dividend history, and income projectors.',
  sameAs: ['https://x.com/DCYieldHub'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${robotoMono.variable}`}>
      <body className="flex flex-col min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Navbar />
        <main className="flex-1 pt-16 md:pt-24">
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
        {/* Ahrefs Web Analytics (cookieless) */}
        <Script
          async
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="l8CSokM5avw7elCQq1DfMA"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
