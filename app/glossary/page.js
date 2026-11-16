import Link from 'next/link';

export const metadata = {
  alternates: { canonical: '/glossary' },
  title: 'Glossary of Key Terms',
  description: 'Clear definitions of the terms used across this site: par value, effective yield, perpetual preferred stock, ATM programme, VWAP, cumulative dividends and more.',
  openGraph: {
    title: 'Glossary of Key Terms',
    description: 'Clear definitions of the preferred stock terms used across Digital Credit Yield.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/glossary',
    images: [{ url: '/og?v=4&title=Glossary&sub=Key+terms+explained' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glossary of Key Terms',
    description: 'Clear definitions of the preferred stock terms used across Digital Credit Yield.',
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
    def: 'The face (stated) value of a preferred share — $100 for STRC, STRF, STRK, STRD, SATA, SATS and BMNP, €100 for STRE, $10 for CHAD, and a £100 reference value for MORE (its nominal value is only £0.001, but the dividend is calculated on £100). The dividend rate is set against par. Some issuers (STRC, SATA, CHAD) adjust the rate to try to keep the market price close to it; the fixed-rate ones don’t, and their prices can sit well above or below par.',
  },
  {
    term: 'Effective yield',
    def: 'Your actual return based on the price you pay, rather than the stated rate against par. Buy below par and your effective yield is higher than the announced rate; buy above and it is lower.',
    link: { href: '/blog/what-is-effective-yield', label: 'Why it matters' },
  },
  {
    term: 'Perpetual preferred stock',
    def: 'Preferred stock with no maturity date. The issuer never has to redeem your shares, so your return comes from the dividend stream and the price at which you eventually sell.',
  },
  {
    term: 'Cumulative dividends',
    def: 'A structure in which missed dividend payments accumulate as an obligation that must be settled in full before common shareholders can receive anything. Non-cumulative structures, like STRD, offer no such protection — a skipped payment is simply gone. BMNP goes a step further: its dividend accumulates whether or not it is declared, and a missed payment obliges Bitmine to try to raise the cash within 30 days.',
  },
  {
    term: 'ATM programme (at-the-market)',
    def: 'A standing arrangement allowing an issuer to sell new shares gradually into the open market at prevailing prices, rather than in one large offering. The weekly capital raises tracked on the Money Flow page come mostly from ATM sales.',
    link: { href: '/money-flow', label: 'See it in action' },
  },
  {
    term: 'VWAP (volume-weighted average price)',
    def: 'The average trading price of a security over a period, weighted by volume. STRC’s published dividend rate framework uses a five-day VWAP window to decide whether the rate should adjust — though since July 2026 Strategy has been holding the rate flat by discretion rather than following the bands mechanically.',
    link: { href: '/blog/strc-vwap-dividend-mechanism', label: 'The STRC mechanism' },
  },
  {
    term: 'USD Reserve',
    def: 'Strategy’s ring-fenced cash reserve, usable only to pay preferred dividends and debt interest — any other use needs a separate board vote. Introduced as part of the June 2026 Digital Credit Capital Framework alongside the move to a 12.00% STRC rate; a board-set floor requires fresh authorisation if coverage ever drops below 12 months of expected payments. The current disclosed figure is shown on the STRC hub page.',
    link: { href: '/blog/strategy-transforms', label: 'How the framework works' },
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
    def: 'How often payments arrive: STRC pays semi-monthly (24 times a year) until October 2026 and every calendar day (365 times a year) from 1 November 2026, STRK, STRF and STRD move from quarterly to every calendar day on 1 January 2027, SATA, SATS and CHAD pay daily on US market business days (~250 times a year), BMNP and MORE pay weekly, and STRE pays quarterly. Annual yield is unaffected by frequency, but faster payments mean more frequent compounding if you reinvest.',
    link: { href: '/blog/monthly-vs-daily-dividends', label: 'Does frequency matter?' },
  },
  {
    term: 'Bitcoin treasury company',
    def: 'A public company that holds Bitcoin as a core treasury asset and typically raises capital — often via preferred stock — to buy more. Strategy (STRC, STRF, STRK, STRD, STRE), Strive (SATA, SATS) and The Smarter Web Company (MORE) are the Bitcoin-treasury issuers tracked here; Bitmine (BMNP) follows the same playbook with Ethereum, and DeFi Development Corp. (CHAD) with Solana.',
    link: { href: '/blog/bitcoin-treasury-companies', label: 'Why they issue preferred equity' },
  },
  {
    term: 'Staking (proof-of-stake)',
    def: 'Locking up cryptocurrency to help run a proof-of-stake network like Ethereum, earning rewards in return. Bitmine stakes its Ethereum through its MAVAN validator network, and Bitmine expects to fund BMNP’s dividend mainly from the yield on that Ethereum — unlike STRC and SATA, whose Bitcoin earns nothing and simply has to hold its value.',
    link: { href: '/blog/bmnp-dividend-rate-mechanism', label: 'How BMNP is funded' },
  },
  {
    term: 'Convertible preferred',
    def: 'A preferred share that can be exchanged for common stock at a fixed ratio. STRK is the convertible one in the Strategy range: each share can convert into 0.1 share of MSTR, an initial conversion price of $1,000 per MSTR share. When the common stock trades far below that price, as it does now, the option has little value and the share trades mainly on its dividend.',
    link: { href: '/strk', label: 'See the STRK hub' },
  },
  {
    term: 'Redemption premium',
    def: 'An above-par price an issuer must pay to buy its preferred shares back early. BMNP can be bought back at 110% of par ($110) until 10 December 2027, then 105% until 10 June 2029, then par (plus unpaid dividends) — which helps anchor its price near term, the job STRC and SATA hand to their adjustable rate instead. CHAD carries one too: DeFi Development Corp. can buy it back at $11.00, 110% of its $10 stated value, at any time since it listed, with no step-down. For CHAD it sits alongside the variable rate rather than replacing it. MORE is redeemable by its company at £110. All of these are the issuer’s option, not a right for holders to sell back.',
    link: { href: '/blog/bmnp-dividend-rate-mechanism', label: 'BMNP’s price anchor' },
  },
];

export default function GlossaryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">Glossary</h1>
      <p className="text-base mb-10" style={{ color: 'var(--text-muted)' }}>
        Every term used across this site, explained simply. Each entry links to the article that covers it in depth.
      </p>

      <div className="space-y-5">
        {terms.map(t => (
          <div key={t.term} className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--accent-gold)' }}>{t.term}</h2>
            <p className="text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
              {t.def}
              {t.link && (
                <>
                  {' '}<Link prefetch={false} href={t.link.href} style={{ color: 'var(--accent-gold)' }}>{t.link.label} →</Link>
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
