import Link from 'next/link';
import { BMNP_ENABLED } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/risks' },
  title: 'Understanding the Risks',
  description: 'A plain-English guide to the risks of STRC and SATA: board discretion over dividends, rate changes, crypto-collateral volatility, liquidity, and perpetual structure.',
  openGraph: {
    title: 'Understanding the Risks',
    description: 'A plain-English guide to the risks of preferred stocks like STRC and SATA.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/risks',
    images: [{ url: '/og?v=3&title=Understanding+the+Risks&sub=Read+before+you+invest' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Understanding the Risks',
    description: 'A plain-English guide to the risks of preferred stocks like STRC and SATA.',
  },
};

const risks = [
  {
    title: 'Dividends are declared, not promised',
    body: 'Every payment requires a decision by the issuer’s board of directors. Unlike bond interest, a preferred dividend is not a contractual debt — it can be reduced, deferred, or suspended without triggering a default. Both issuers have strong commercial reasons to keep paying (their entire capital-raising model depends on it), but "strong incentive" is not the same as "guarantee". Check whether the instrument is cumulative — meaning missed payments accrue and must be settled before common shareholders receive anything — in each prospectus.',
  },
  {
    title: 'The dividend rate can change',
    body: 'STRC’s rate is reviewed monthly under a rules-based framework; SATA’s is reviewed monthly at the issuer’s discretion. Rates have only moved upward so far, but both mechanisms permit downward adjustments in defined circumstances. The yield you see today is not locked in for life — your income from these instruments can fall as well as rise.',
  },
  {
    title: 'Crypto-collateral volatility',
    body: 'The issuers’ balance sheets are concentrated in Bitcoin (and, for Bitmine, Ethereum). A deep, sustained crypto bear market would shrink the asset base supporting their capital structures, raise their cost of capital, and could pressure their ability to sustain dividends. These instruments pay cash, but their credit quality is tied to crypto markets in a way traditional preferred stock is not.',
  },
  {
    title: 'Price can deviate from par',
    body: 'The $99–$101 trading range is a design objective achieved through rate adjustments — not a peg, a floor, or a redemption right. In a stressed market, the price can fall well below $100 and stay there. If you need to sell during such a period, you may realise a capital loss that outweighs the income received.',
  },
  {
    title: 'No maturity date',
    body: 'These are perpetual instruments: there is no date at which the issuer must return your $100. Your exit is selling on the open market at the prevailing price. Total return therefore depends almost entirely on the income stream and the price at the time you choose (or need) to sell.',
  },
  {
    title: 'Liquidity is still developing',
    body: 'These are new instruments with shorter trading histories and thinner order books than established preferred stocks. In calm markets, spreads are tight; in volatile periods, large orders can move the price. Limit orders are advisable, particularly for bigger positions.',
  },
  {
    title: 'Position in the capital structure',
    body: 'Preferred stock ranks below all debt. STRC sits beneath Strategy’s senior debt and STRF preferred in priority of payment; SATA benefits from Strive being debt-free but is still equity, not a deposit or a bond. In a worst-case liquidation, preferred holders are paid only after every creditor.',
  },
  {
    title: 'Concentration and single-issuer risk',
    body: 'Each instrument is exposed to one company’s management decisions, regulatory environment, and execution. An SEC action, a leadership change, or a strategic shift at the issuer affects the instrument regardless of what the broader market is doing. Spreading across issuers reduces — but does not remove — this risk.',
  },
];

export default function RisksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">Understanding the Risks</h1>
      <p className="text-base mb-4" style={{ color: 'var(--text-muted)' }}>
        The yields on STRC{BMNP_ENABLED ? ', SATA and BMNP' : ' and SATA'} are high because the risks are real.
        This page sets them out plainly — read it alongside the projectors and charts, not instead of them.
      </p>
      <p className="text-base mb-10" style={{ color: 'var(--text-muted)' }}>
        None of this is a reason not to invest; it is the context in which an informed decision gets made.
      </p>

      <div className="space-y-6">
        {risks.map((r, i) => (
          <div key={r.title} className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-lg font-semibold mb-3">
              <span style={{ color: 'var(--accent-gold)' }}>{i + 1}.</span> {r.title}
            </h2>
            <p className="text-base leading-7" style={{ color: 'var(--text-muted)' }}>{r.body}</p>
          </div>
        ))}
      </div>

      <p className="text-base mt-10 leading-7" style={{ color: 'var(--text-muted)' }}>
        For the structural detail behind these points, see{' '}
        <Link href="/blog/strategy-capital-structure" style={{ color: 'var(--accent-gold)' }}>Strategy&rsquo;s capital structure</Link>,{' '}
        <Link href="/blog/strive-capital-structure" style={{ color: 'var(--accent-gold)' }}>Strive&rsquo;s capital structure</Link>, and{' '}
        <Link href="/faq" style={{ color: 'var(--accent-gold)' }}>the FAQ</Link>.
      </p>

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
