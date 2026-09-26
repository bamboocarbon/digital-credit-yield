import './globals.css';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';

export const metadata = {
  metadataBase: new URL('https://www.digitalcredityield.com'),
  title: {
    default: 'Digital Credit Yield — STRC, SATA, BMNP & CHAD Tracker',
    template: '%s — Digital Credit Yield',
  },
  description: 'Independent tracker for STRC, SATA, BMNP and CHAD preferred stocks. Live prices, dividend history, and income projectors.',
  openGraph: {
    title: 'Digital Credit Yield — STRC, SATA, BMNP & CHAD Preferred Stock Tracker',
    description: 'Independent tracker for STRC, SATA, BMNP and CHAD preferred stocks. Live prices, dividend history, and income projectors.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Credit Yield — STRC, SATA, BMNP & CHAD Preferred Stock Tracker',
    description: 'Independent tracker for STRC, SATA, BMNP and CHAD preferred stocks. Live prices, dividend history, and income projectors.',
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
  description: 'Independent tracker for STRC, SATA, BMNP and CHAD preferred stocks — live prices, dividend history, and income projectors.',
  sameAs: ['https://x.com/DCYieldHub'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
          var granted = false;
          try {
            var stored = localStorage.getItem('cookieConsent');
            if (stored === 'accepted') {
              granted = true;
            } else if (stored !== 'declined') {
              // No explicit choice yet — outside the EEA/UK (see proxy.js:
              // regionFor / REGULATED_COUNTRIES) cookies default on with no
              // prompt; inside it, default off until the banner is accepted.
              var m = document.cookie.match(/(?:^|; )consent_region=([^;]*)/);
              granted = m ? decodeURIComponent(m[1]) === 'open' : false;
            }
          } catch(e) {}
          gtag('consent', 'default', {
            ad_storage: granted ? 'granted' : 'denied',
            analytics_storage: granted ? 'granted' : 'denied',
            ad_user_data: granted ? 'granted' : 'denied',
            ad_personalization: granted ? 'granted' : 'denied',
            wait_for_update: granted ? 0 : 500
          });
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
        <VercelAnalytics />
      </body>
    </html>
  );
}
