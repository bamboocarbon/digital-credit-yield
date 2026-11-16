import Link from 'next/link';

export const metadata = {
  alternates: { canonical: '/risks' },
  title: 'Understanding the Risks',
  description: 'A clear guide to the risks of the Bitcoin- and crypto-treasury preferred stocks tracked here: board discretion over dividends, rate changes, interest-rate and call risk, crypto volatility, liquidity, currency and perpetual structure.',
  openGraph: {
    title: 'Understanding the Risks',
    description: 'A clear guide to the risks of crypto-treasury preferred stocks.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/risks',
    images: [{ url: '/og?v=4&title=Understanding+the+Risks&sub=Read+before+you+invest' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Understanding the Risks',
    description: 'A clear guide to the risks of crypto-treasury preferred stocks.',
  },
};

const risks = [
  {
    title: 'Dividends are declared, not promised',
    body: 'Every payment requires a decision by the issuer’s board of directors. Unlike bond interest, a preferred dividend is not a contractual debt — it can be reduced, deferred, or suspended without triggering a default. All of the issuers (Strategy, Strive, Bitmine, DeFi Development Corp. and The Smarter Web Company) have strong commercial reasons to keep paying, since their capital-raising model depends on it, but "strong incentive" is not the same as "guarantee". Check whether the instrument is cumulative — meaning missed payments accrue and must be settled before common shareholders receive anything — in each prospectus. Most of those tracked here are cumulative, but STRD is not: a STRD dividend that isn’t declared is simply lost.',
  },
  {
    title: 'The dividend rate can change',
    body: 'STRC has a published rules-based framework (a four-band VWAP rulebook against $100 par), but management has overridden it every month since July 2026 to hold the rate flat at 12.00% rather than follow the bands mechanically — a reminder that even a "rules-based" mechanism can be discretionary in practice. SATA’s and CHAD’s reviews are at the issuer’s discretion outright; all three permit downward adjustments in defined circumstances, even though rates have only moved upward so far. MORE’s board can vary its rate within prospectus limits and can suspend any weekly payment, while STRF, STRK, STRD and SATS carry fixed rates that can’t be adjusted to defend the price. BMNP’s 9.50% is fixed at issue, so it has no monthly reset — but its board could still adjust it under the terms of the security. Either way, the yield you see today is not locked in for life: your income from these instruments can fall as well as rise, and a framework being "published" is no guarantee it will be followed to the letter.',
  },
  {
    title: 'Crypto-collateral volatility',
    body: 'The issuers’ balance sheets are concentrated in one crypto asset: Bitcoin for Strategy, Strive and The Smarter Web Company, Ethereum for Bitmine and Solana for DeFi Development Corp. A deep, sustained crypto bear market would shrink the asset base supporting their capital structures, raise their cost of capital, and could pressure their ability to sustain dividends. These instruments pay cash, but their credit quality is tied to crypto markets in a way traditional preferred stock is not.',
  },
  {
    title: 'Price can deviate from par',
    body: 'Keeping the price near par is a design objective, not a guarantee — STRC, SATA and CHAD pursue it through periodic rate adjustments, while BMNP leans on a redemption premium instead. None of these is a peg, a floor, or a right for you to redeem at par. In a stressed market the price can fall well below what you paid and stay there, and if you need to sell during such a period you may realise a capital loss that outweighs the income received.',
  },
  {
    title: 'No maturity date',
    body: 'These are perpetual instruments: there is no date at which the issuer must return your stated value. Your exit is selling on the open market at the prevailing price. Total return therefore depends almost entirely on the income stream and the price at the time you choose (or need) to sell.',
  },
  {
    title: 'Interest-rate risk',
    body: 'A fixed-rate perpetual is priced against what else the market pays. If yields on Treasuries and other income investments rise, the price of an instrument with a fixed dividend tends to fall, and with no maturity date it has no pull back to par to offset that. This applies most to the fixed-rate instruments (STRF, STRK, STRD, STRE, BMNP and SATS), since they cannot raise their dividend in response.',
  },
  {
    title: 'The issuer can call or redeem',
    body: 'Some of these can be redeemed by the company, which can end the income stream early and cap how far the price can rise. BMNP can be redeemed at 110% of par in the first 18 months, then 105%, then par; MORE is redeemable by the company at £110. Check each prospectus for the exact redemption terms before you buy above the call price.',
  },
  {
    title: 'Currency risk',
    body: 'MORE is priced and pays in pounds sterling and STRE in euros; the others are in US dollars. If you hold an instrument outside your own currency, exchange-rate moves change both your income and your capital, and conversion costs apply on the way in and out.',
  },
  {
    title: 'Liquidity is still developing',
    body: 'These are new instruments with shorter trading histories and thinner order books than established preferred stocks — SATS (priced in October 2026), MORE (listed 14 October 2026) and CHAD (September 2026) have the shortest track records of all. In calm markets, spreads are tight; in volatile periods, large orders can move the price. Limit orders are advisable, particularly for bigger positions.',
  },
  {
    title: 'Position in the capital structure',
    body: 'Preferred stock ranks below all debt. STRC sits beneath Strategy’s senior debt and STRF preferred in priority of payment; SATA benefits from Strive being debt-free but is still equity, not a deposit or a bond; BMNP and CHAD both sit above their issuer’s common stock with cumulative dividends, but are likewise equity rather than debt, and each is junior to its own company’s existing and future indebtedness. In a worst-case liquidation, preferred holders are paid only after every creditor.',
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
        The yields on these preferred stocks are high because the risks are real.
        This page sets them out plainly — read it alongside the projectors and charts, not instead of them.
      </p>
      <p className="text-base mb-10" style={{ color: 'var(--text-muted)' }}>
        None of this is a recommendation either way; it is the context in which an informed decision gets made.
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
        <Link prefetch={false} href="/blog/strategy-capital-structure" style={{ color: 'var(--accent-gold)' }}>Strategy&rsquo;s capital structure</Link>,{' '}
        <Link prefetch={false} href="/blog/strive-capital-structure" style={{ color: 'var(--accent-gold)' }}>Strive&rsquo;s capital structure</Link>, and{' '}
        <Link prefetch={false} href="/faq" style={{ color: 'var(--accent-gold)' }}>the FAQ</Link>.
      </p>

      <p className="text-sm mt-10 leading-6 italic" style={{ color: 'var(--text-muted)' }}>
        I hold positions in MSTR and ASST, the common stock of Strategy and Strive, and I have no relationship with, or payment from, any of the issuers covered here.
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
