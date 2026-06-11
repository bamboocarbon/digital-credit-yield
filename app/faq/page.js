import Link from 'next/link';
import { BMNP_ENABLED } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/faq' },
  title: 'FAQ — Frequently Asked Questions',
  description: 'Answers to common questions about STRC and SATA: how to buy, whether dividends are guaranteed, why the price stays near $100 par, tax basics, and more.',
  openGraph: {
    title: 'FAQ — Frequently Asked Questions',
    description: 'Answers to common questions about STRC and SATA preferred stocks.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/faq',
    images: [{ url: '/api/og?title=FAQ&sub=Frequently+Asked+Questions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ — Frequently Asked Questions',
    description: 'Answers to common questions about STRC and SATA preferred stocks.',
  },
};

const faqs = [
  {
    q: 'How do I buy STRC or SATA?',
    a: 'Both trade on the Nasdaq like ordinary stocks — STRC under the ticker "STRC" and SATA under "SATA". Search the ticker in any major brokerage account (Fidelity, Schwab, Interactive Brokers, eToro and most others carry them), choose the number of shares, and place the order during US market hours. There is no minimum investment beyond the price of one share, and no special account type is needed.',
    link: { href: '/blog/what-is-preferred-stock', label: 'New to preferred stock? Start with the plain English guide' },
  },
  {
    q: 'Are the dividends guaranteed?',
    a: 'No. Like all preferred stock dividends, each payment must be declared by the issuer’s board of directors before it is paid. Both Strategy and Strive have strong incentives to maintain payments — a missed dividend would severely damage their ability to raise capital — but a dividend is a corporate decision, not a contractual debt obligation like a bond coupon. Always read the issuer’s prospectus for the exact terms.',
    link: { href: '/risks', label: 'Read more on the risks page' },
  },
  {
    q: 'Why does the price stay close to $100?',
    a: 'Both instruments are designed to trade near their $100 par value. The issuers review the dividend rate every month: if the share price drifts below par, the rate is nudged up to attract buyers; if it trades above par, the rate can come down. This anchoring mechanism is why prices typically move in cents rather than dollars — and why the effective yield you lock in depends on the price you pay.',
    link: { href: '/blog/strc-vwap-dividend-mechanism', label: 'How STRC’s rate mechanism works in detail' },
  },
  {
    q: 'What is the difference between the annual rate and the effective yield?',
    a: 'The annual rate (for example 11.50% for STRC) is set against the $100 par value. The effective yield is what you actually earn based on the price you pay. Buy at $99 and your effective yield is slightly higher than the stated rate; buy at $101 and it is slightly lower. The live charts on this site track both in real time.',
    link: { href: '/blog/what-is-effective-yield', label: 'Effective yield explained' },
  },
  {
    q: 'What happens if Bitcoin crashes?',
    a: 'The dividends are paid in cash by the issuing companies, not in Bitcoin — but both issuers hold large Bitcoin treasuries, so a severe and sustained fall in Bitcoin would shrink the asset base that supports their capital raising. Strive also maintains a cash reserve covering more than 18 months of SATA dividends as a buffer. A Bitcoin drawdown does not automatically affect the dividend, but it increases the risk around future payments and the share price.',
    link: { href: '/risks', label: 'Understand the full risk picture' },
  },
  {
    q: 'How are the dividends taxed?',
    a: 'Tax treatment depends on where you live and what account you hold the shares in. In the US, preferred dividends may or may not be "qualified" for the lower dividend tax rate. In the UK, US preferred dividends are typically subject to a 15% US withholding tax (with a W-8BEN filed) and then UK dividend tax rules apply. This site does not provide tax advice — speak to a tax professional about your situation.',
  },
  {
    q: 'Can I lose money on these?',
    a: 'Yes. The price can fall below what you paid — particularly if the issuer’s credit profile weakens, the dividend is reduced or missed, or market interest rates rise sharply. The par-anchoring mechanism is a design goal, not a guarantee. These are higher-risk, higher-yield instruments and should be sized accordingly within a portfolio.',
    link: { href: '/risks', label: 'Read the risks page before investing' },
  },
  {
    q: 'Is this site affiliated with Strategy or Strive?',
    a: 'No. Digital Credit Yield is an independent research and tracking site. I hold positions in MSTR and ASST (the issuers’ common stock) but have no relationship with either company and am not compensated by them. Nothing here is financial advice.',
    link: { href: '/about', label: 'More about who runs this site' },
  },
];

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">Frequently Asked Questions</h1>
      <p className="text-base mb-10" style={{ color: 'var(--text-muted)' }}>
        Straight answers to the questions readers ask most about STRC{BMNP_ENABLED ? ', SATA and BMNP' : ' and SATA'}.
      </p>

      <div className="space-y-8">
        {faqs.map(f => (
          <div key={f.q} className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-lg font-semibold mb-3">{f.q}</h2>
            <p className="text-base leading-7" style={{ color: 'var(--text-muted)' }}>{f.a}</p>
            {f.link && (
              <p className="text-sm mt-3">
                <Link href={f.link.href} style={{ color: 'var(--accent-gold)' }}>{f.link.label} →</Link>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 p-5 rounded-xl" style={{ background: 'rgba(200,137,58,0.08)', border: '1px solid var(--accent-gold)' }}>
        <p className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>Important Disclaimer</p>
        <p className="text-sm mt-2 leading-6" style={{ color: 'var(--text-muted)' }}>
          Digital Credit Yield is not a financial advisor. All content is provided for educational
          and research purposes only. Nothing on this site constitutes financial advice, investment
          advice, or a solicitation to buy or sell any financial instrument. Always consult a qualified
          financial adviser before making investment decisions.
        </p>
      </div>
    </div>
  );
}
