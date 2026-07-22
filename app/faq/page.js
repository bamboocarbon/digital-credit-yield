import Link from 'next/link';
import { BMNP_ENABLED } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/faq' },
  title: 'FAQ — Frequently Asked Questions',
  description: 'Answers to common questions about STRC, SATA and BMNP: how to buy, whether dividends are guaranteed, why the price stays near $100 par, tax basics, and more.',
  openGraph: {
    title: 'FAQ — Frequently Asked Questions',
    description: 'Answers to common questions about STRC, SATA and BMNP preferred stocks.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/faq',
    images: [{ url: '/og?v=3&title=FAQ&sub=Frequently+Asked+Questions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ — Frequently Asked Questions',
    description: 'Answers to common questions about STRC, SATA and BMNP preferred stocks.',
  },
};

const faqs = [
  {
    q: 'How do I buy STRC, SATA or BMNP?',
    a: 'STRC and SATA trade on the Nasdaq and BMNP on the NYSE, all like ordinary shares — STRC under the ticker "STRC", SATA under "SATA" and BMNP under "BMNP". Search the ticker in any major brokerage account (Fidelity, Schwab, Interactive Brokers, eToro and most others carry them), choose the number of shares, and place the order during US market hours. There is no minimum investment beyond the price of one share, and no special account type is needed.',
    link: { href: '/blog/what-is-preferred-stock', label: 'New to preferred stock? Start with the basics' },
  },
  {
    q: 'Are the dividends guaranteed?',
    a: 'No. Like all preferred stock dividends, each payment must be declared by the issuer’s board of directors before it is paid. Strategy, Strive and Bitmine all have strong incentives to maintain payments — a missed dividend would severely damage their ability to raise capital — but a dividend is a corporate decision, not a contractual debt obligation like a bond coupon. Always read the issuer’s prospectus for the exact terms.',
    link: { href: '/risks', label: 'Read more on the risks page' },
  },
  {
    q: 'Why does the price stay close to $100?',
    a: 'STRC and SATA are designed to trade near their $100 par value: the issuers review the dividend rate each month, nudging it up if the price drifts below par to attract buyers, or down if it trades above. BMNP works differently — its 9.50% rate is fixed, so instead of a moving rate it leans on a redemption premium (the company can buy shares back above par in the early years) to keep the price from drifting too far. Either way, prices tend to move in cents rather than dollars — and the effective yield you lock in depends on the price you pay.',
    link: { href: '/blog/strc-vwap-dividend-mechanism', label: 'How STRC’s rate mechanism works in detail' },
  },
  {
    q: 'What is the difference between the annual rate and the effective yield?',
    a: 'The annual rate (for example 12.00% for STRC) is set against the $100 par value. The effective yield is what you actually earn based on the price you pay. Buy at $99 and your effective yield is slightly higher than the stated rate; buy at $101 and it is slightly lower. The live charts on this site track both in real time.',
    link: { href: '/blog/what-is-effective-yield', label: 'Effective yield explained' },
  },
  {
    q: 'What happens if Bitcoin or Ethereum crashes?',
    a: 'The dividends are paid in cash by the issuing companies, not in crypto — but the issuers’ treasuries are crypto, so a severe, sustained fall would shrink the asset base that supports their capital raising. Strategy and Strive hold Bitcoin, and Strive also keeps a cash reserve covering more than 18 months of SATA dividends as a buffer. Bitmine, the company behind BMNP, holds Ethereum and funds its dividend largely from staking income, so its exposure is to ETH rather than Bitcoin. A crypto drawdown does not automatically affect the dividend, but it increases the risk around future payments and the share price.',
    link: { href: '/risks', label: 'Understand the full risk picture' },
  },
  {
    q: 'How are the dividends taxed?',
    a: 'Tax treatment depends on where you live and what account you hold the shares in. In the US, preferred dividends may or may not be "qualified" for the lower dividend tax rate. In the UK, US preferred dividends are typically subject to a 15% US withholding tax (with a W-8BEN filed) and then UK dividend tax rules apply. This site does not provide tax advice — speak to a tax professional about your situation.',
  },
  {
    q: 'Can I lose money on these?',
    a: 'Yes. The price can fall below what you paid — particularly if the issuer’s credit profile weakens, the dividend is reduced or missed, or market interest rates rise sharply. The par-anchoring mechanism is a design goal, not a guarantee. These carry real risk and should be sized accordingly within a portfolio.',
    link: { href: '/risks', label: 'Read the risks page before investing' },
  },
  {
    q: 'Is this site affiliated with Strategy, Strive or Bitmine?',
    a: 'No. Digital Credit Yield is an independent research and tracking site. I hold positions in MSTR and ASST (the common stock of Strategy and Strive) but have no relationship with any of the three companies and am not compensated by them. Nothing here is financial advice.',
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
