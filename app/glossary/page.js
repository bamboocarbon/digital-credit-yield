import Link from 'next/link';

export const metadata = {
  alternates: { canonical: '/glossary' },
  title: 'Glossary of Key Terms',
  description: 'Plain-English definitions of the terms used across this site: par value, effective yield, perpetual preferred stock, ATM programme, VWAP, cumulative dividends and more.',
  openGraph: {
    title: 'Glossary of Key Terms',
    description: 'Plain-English definitions of the preferred stock terms used across Digital Credit Yield.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/glossary',
    images: [{ url: '/og?v=2&title=Glossary&sub=Key+terms+in+plain+English' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glossary of Key Terms',
    description: 'Plain-English definitions of the preferred stock terms used across Digital Credit Yield.',
  },
};

const terms = [
  {
    term: 'Preferred stock',
    def: 'A hybrid security that sits between bonds and common stock in a company’s capital structure. It pays a fixed dividend with priority over common stock dividends, but ranks below all debt. Usually carries no voting rights.',
    link: { href: '/blog/what-is-preferred-stock', label: 'Full guide' },
  },
  {
    term: 'Par value',
    def: 'The face value of a preferred share — $100 for STRC, SATA and BMNP. The dividend rate is set against par, and the issuers manage their rates to keep the market price trading close to it.',
  },
  {
    term: 'Effective yield',
    def: 'Your actual return based on the price you pay, rather than the stated rate against par. Buy below $100 and your effective yield is higher than the announced rate; buy above and it is lower.',
    link: { href: '/blog/what-is-effective-yield', label: 'Why it matters' },
  },
  {
    term: 'Perpetual preferred stock',
    def: 'Preferred stock with no maturity date. The issuer never has to redeem your shares, so your return comes from the dividend stream and the price at which you eventually sell.',
  },
  {
    term: 'Cumulative dividends',
    def: 'A structure in which missed dividend payments accumulate as an obligation that must be settled in full before common shareholders can receive anything. Non-cumulative structures offer no such protection — a skipped payment is simply gone.',
  },
  {
    term: 'ATM programme (at-the-market)',
    def: 'A standing arrangement allowing an issuer to sell new shares gradually into the open market at prevailing prices, rather than in one large offering. The weekly capital raises tracked on the Money Flow page come mostly from ATM sales.',
    link: { href: '/money-flow', label: 'See it in action' },
  },
  {
    term: 'VWAP (volume-weighted average price)',
    def: 'The average trading price of a security over a period, weighted by volume. STRC’s dividend rate framework uses a five-day VWAP window to decide whether the rate should adjust.',
    link: { href: '/blog/strc-vwap-dividend-mechanism', label: 'The STRC mechanism' },
  },
  {
    term: 'Capital structure / capital stack',
    def: 'The ranking of a company’s obligations: debt is repaid first, then preferred stock, then common stock. Where an instrument sits in the stack determines who gets paid first in stress or liquidation.',
    link: { href: '/blog/strategy-capital-structure', label: 'Strategy’s stack explained' },
  },
  {
    term: 'Record date and payment date',
    def: 'The record date is the cut-off for owning shares to qualify for a dividend; the payment date is when the cash arrives. You must hold the shares on the record date to receive that payment.',
  },
  {
    term: '8-K filing',
    def: 'A report US public companies must file with the SEC to announce material events — dividend declarations, rate changes, and capital raises among them. Most data on this site traces back to 8-K filings.',
  },
  {
    term: 'Dividend frequency',
    def: 'How often payments arrive: STRC pays semi-monthly (24 times a year), SATA pays daily on NYSE business days (~250 times a year, from 16 June 2026), and BMNP pays weekly. Annual yield is unaffected by frequency, but faster payments mean more frequent compounding if you reinvest.',
    link: { href: '/blog/monthly-vs-daily-dividends', label: 'Does frequency matter?' },
  },
  {
    term: 'Bitcoin treasury company',
    def: 'A public company that holds Bitcoin as a core treasury asset and typically raises capital — often via preferred stock — to buy more. Strategy and Strive are the two issuers tracked here.',
    link: { href: '/blog/bitcoin-treasury-companies', label: 'Why they issue preferred equity' },
  },
];

export default function GlossaryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">Glossary</h1>
      <p className="text-base mb-10" style={{ color: 'var(--text-muted)' }}>
        Every term used across this site, in plain English. Each entry links to the article that covers it in depth.
      </p>

      <div className="space-y-5">
        {terms.map(t => (
          <div key={t.term} className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--accent-gold)' }}>{t.term}</h2>
            <p className="text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
              {t.def}
              {t.link && (
                <>
                  {' '}<Link href={t.link.href} style={{ color: 'var(--accent-gold)' }}>{t.link.label} →</Link>
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
