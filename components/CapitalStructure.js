import Link from 'next/link';
import CapitalPyramid from '@/components/CapitalPyramid';
import StrategyCashPotsDiagram from '@/components/StrategyCashPotsDiagram';
import { DIVIDEND_RESERVE, STRATEGY_BTC_HOLDINGS, STRIVE_BTC_HOLDINGS, BITMINE_ETH_HOLDINGS, DFDV_SOL_HOLDINGS } from '@/lib/constants';

const gold = { color: 'var(--accent-gold)' };

function Panel({ title, children }) {
  return (
    <div className="rounded-lg p-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
      <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

const CONTENT = {
  STRC: {
    blog: [
      ['strategy-capital-structure', "Strategy's capital structure"],
      ['strategy-usd-cash-second-pot-strc-buybacks', 'The two cash pots and $1.28bn of buybacks'],
      ['strategy-transforms', 'Strategy Transforms'],
    ],
    diagram: (
      <>
        <CapitalPyramid ticker="STRC" />
        <p className="mb-1">Where the money for dividends sits, and where it flows (Strategy&apos;s 8-K, 27 September 2026):</p>
        <StrategyCashPotsDiagram />
      </>
    ),
    above: (
      <>
        <p><strong>~$6.7bn of convertible senior notes.</strong> Debt is paid first in every scenario, ahead of all preferred and common, including a claim on the {STRATEGY_BTC_HOLDINGS} Bitcoin. Many pay 0% interest; holders are in it for the option to convert into MSTR common.</p>
        <p><strong>STRF</strong> (10% fixed, quarterly) is the only preferred series that ranks above STRC. Strategy&apos;s prospectus says so directly: STRC is senior to common, STRE, STRK and STRD, but &quot;the company&apos;s indebtedness and STRF Stock rank senior&quot;.</p>
      </>
    ),
    below: (
      <>
        <p><strong>STRE</strong> (euro, 10% fixed, EEA professional investors only), <strong>STRK</strong> (the convertible, into MSTR) and <strong>STRD</strong> (10% stated, most junior preferred) all rank below STRC.</p>
        <p><strong>MSTR common stock</strong> sits at the bottom: it absorbs losses first, gets paid last, and keeps the uncapped upside.</p>
      </>
    ),
    financing: (
      <>
        <p>Bitcoin earns no yield, so the dividend isn&apos;t paid by the coins. It is paid from two dollar pots, which is the most complex part of the structure:</p>
        <p><strong>USD Reserve ({DIVIDEND_RESERVE.STRC.display}).</strong> Ring-fenced for preferred dividends and debt interest only; any other use needs a board vote. Strategy&apos;s own figures imply an annual bill of about $1.76bn across all its preferreds and interest, so the Reserve covers roughly 34 months against a board floor of 12 (my arithmetic on the 27 September figures). It was built mainly by selling MSTR common stock.</p>
        <p><strong>USD Cash ($1.00bn).</strong> The flexible pot, created 24 August 2026. It can buy Bitcoin, buy back stock, pay dividends and interest, repay convertibles or top up the Reserve. Since early September it has funded the STRC buybacks.</p>
        <p><strong>Backstops.</strong> Strategy can also sell Bitcoin under its monetisation programme (up to $1.25bn authorised) and raise new money in the capital markets. STRC itself can&apos;t be used to buy Bitcoin at the moment, because it trades below par. Strategy has spent $1.28bn buying STRC back, and has proposed paying STRC&apos;s dividend every calendar day, subject to a shareholder vote.</p>
      </>
    ),
  },
  SATA: {
    blog: [
      ['strive-capital-structure', "Strive's capital structure"],
      ['how-sata-works', 'How SATA works'],
    ],
    diagram: <CapitalPyramid ticker="SATA" />,
    above: (
      <>
        <p><strong>Nothing, today.</strong> Strive cleared the last of its inherited debt (the $120m of convertible notes that came with the Semler Scientific acquisition) in early 2026 and has committed to staying debt-free. SATA is the most senior security Strive has.</p>
        <p>That is a policy, not a guarantee. The prospectus says SATA is &quot;junior to Strive&apos;s existing and future indebtedness and structurally junior to the liabilities of Strive&apos;s subsidiaries&quot;, so any debt Strive takes on later would rank ahead.</p>
      </>
    ),
    below: (
      <p><strong>ASST common stock</strong> (Class A and Class B). It absorbs losses first, is paid last and keeps the uncapped upside from Bitcoin. SATA is Strive&apos;s only preferred series, so there is no junior preferred in between.</p>
    ),
    financing: (
      <>
        <p>Strive&apos;s {STRIVE_BTC_HOLDINGS} Bitcoin is the long-term backing, but it doesn&apos;t pay the dividend. A dedicated, ring-fenced cash reserve does.</p>
        <p>At the time of my capital-structure article in June 2026 the reserve was about $137m, sized to cover roughly <strong>18 months</strong> of SATA dividends without selling a coin. Strive&apos;s latest disclosed cash and equivalents are <strong>{DIVIDEND_RESERVE.SATA.display}</strong> (25 September 2026).</p>
        <p>With no debt ahead of SATA, the reserve doesn&apos;t have to cover interest first. Longer term, Strive funds growth through preferred and common equity, and has committed not to issue new SATA below $100 through its at-the-market programme.</p>
      </>
    ),
  },
  BMNP: {
    blog: [
      ['bmnp-dividend-rate-mechanism', "How BMNP's dividend is set and funded"],
      ['bmnp-vs-strc-sata', 'BMNP vs STRC and SATA'],
    ],
    diagram: <CapitalPyramid ticker="BMNP" />,
    above: (
      <>
        <p><strong>No borrowings today.</strong> Bitmine&apos;s 10-Q for the quarter to 31 May 2026 shows no notes, loans, convertible notes or credit facilities. Total liabilities were about $30m (accrued liabilities, a lease, warrant liability and other items) against roughly $11.6bn of assets.</p>
        <p>That could change. The prospectus says BMNP is &quot;junior to any existing and future indebtedness&quot; and structurally junior to the liabilities of Bitmine&apos;s subsidiaries, and Bitmine says it may issue debt or equity to buy more digital assets. Any debt added later would rank ahead of BMNP.</p>
      </>
    ),
    below: (
      <>
        <p><strong>BMNR common stock.</strong> It absorbs losses first and is paid last. Because BMNP dividends are <strong>cumulative</strong>, common dividends can&apos;t be declared until any unpaid BMNP amounts are cleared.</p>
        <p>A missed payment compounds at the regular rate plus 5 basis points, rising 5 bps every week to a cap of 15% a year. Two consecutive misses let preferred holders appoint extra board members.</p>
      </>
    ),
    financing: (
      <>
        <p>BMNP is the one where the underlying asset earns the dividend. Bitmine&apos;s prospectus says it expects to fund the dividend &quot;primarily through the yield generated on our ETH holdings from staking, option strategies on Ethereum and additional capital raising activities&quot;.</p>
        <p>It holds {BITMINE_ETH_HOLDINGS} ETH, most of it staked through its MAVAN platform, and writes options against the rest. Current annualised staking revenue is about <strong>{DIVIDEND_RESERVE.BMNP.display}</strong> (disclosed 20 September 2026).</p>
        <p>At launch the dividend bill was about $33m a year against roughly $276m of projected staking revenue, around eight times cover. Staking yield moves with the ETH price and network conditions, and the dividend isn&apos;t the only call on that cash. There is no separate cash reserve like STRC&apos;s or SATA&apos;s.</p>
      </>
    ),
  },
  CHAD: {
    blog: [
      ['how-chad-works', 'How CHAD works'],
    ],
    diagram: <CapitalPyramid ticker="CHAD" />,
    above: (
      <>
        <p><strong>About $216m of debt.</strong> At 30 June 2026 DeFi Development Corp. had approximately $215.8m of consolidated indebtedness, per the CHAD prospectus. The balance sheet splits it into $120.6m of long-term debt, which includes the April and July 2030 convertible notes, and $89.8m of digital asset financing arrangements, which are borrowings secured by pledged digital assets.</p>
        <p>The prospectus says CHAD ranks &quot;junior to our existing and future indebtedness&quot; and structurally junior to the liabilities of its subsidiaries. That debt is paid before CHAD holders in a wind-up, and any new debt would rank ahead too.</p>
        <p>For scale, the same filing shows total assets of about $203m, cash of $4.3m and a stockholders&apos; deficit of about $12m, all before the CHAD raise. This is a much more leveraged balance sheet than Strive&apos;s or Bitmine&apos;s.</p>
      </>
    ),
    below: (
      <p><strong>DFDV common stock.</strong> It absorbs losses first and is paid last. CHAD dividends are cumulative, so a missed payment accrues and has to be cleared before common holders are paid. CHAD is the only preferred series in the stack.</p>
    ),
    financing: (
      <>
        <p>DFDV describes a &quot;capital flywheel&quot;: raise money through CHAD, buy SOL, earn staking yield, repeat. It holds {DFDV_SOL_HOLDINGS} SOL and discloses staking yields of 7–8% in 2025. The filings are careful <em>not</em> to promise that staking income will fund the dividend directly.</p>
        <p>CHAD proceeds and the $300m ATM programme are earmarked mainly for buying more SOL. Dividends are paid from whatever capital is legally available at the time.</p>
        <p>The dedicated cushion is a <strong>12-month dividend reserve</strong>: <strong>{DIVIDEND_RESERVE.CHAD.display}</strong> put aside at closing, enough for a full year at 13%. It isn&apos;t topped up if the rate rises or more shares are sold, and in an insolvency creditors could still reach it.</p>
      </>
    ),
  },
  MORE: {
    blog: [
      ['more-preferred-uk-investor-fx', 'MORE for UK investors: the currency angle'],
    ],
    diagram: <CapitalPyramid ticker="MORE" />,
    above: (
      <>
        <p><strong>A bitcoin-secured credit facility with Coinbase.</strong> The prospectus describes a US$30m facility, secured against the bitcoin Smarter Web holds at Coinbase, with £20.8m drawn at the prospectus date (an approximate leverage ratio of 11.8%). It carries a variable 6.25% interest rate, has no fixed maturity and is marked to market daily, so a fall in bitcoin can trigger a call for more collateral. On default, Coinbase can sell the collateral. The company says it may seek to reduce or repay the facility in future.</p>
        <p>The prospectus says plainly that MORE &quot;will rank behind the claims of creditors&quot; on a winding-up, and that debt service ranks ahead of dividends. The company can take on more debt, and can&apos;t create senior share capital without the preferred holders&apos; consent as a class.</p>
      </>
    ),
    below: (
      <>
        <p><strong>SWC ordinary shares.</strong> They absorb losses first and are paid last. On a winding-up, MORE holders get £100 a share plus any accrued unpaid dividends out of surplus assets, ahead of ordinary shareholders and behind creditors.</p>
        <p><strong>Dividend stopper.</strong> While any MORE dividend is unpaid, the company can&apos;t pay ordinary or junior dividends, can&apos;t pay equal-ranking dividends unless MORE holders are paid too, and can&apos;t buy back ordinary shares beyond small exceptions (such as under 2.2% in aggregate).</p>
        <p>MORE holders are non-voting and have no conversion rights. MORE is the only preferred series Smarter Web has issued, though it can issue more of equal or junior rank.</p>
      </>
    ),
    financing: (
      <>
        <p>The prospectus says the dividend will be paid from recurring operating cash flow, cash reserves, the bitcoin treasury and access to the capital markets. Unlike Strategy or Bitmine, there is no staking or similar income stream behind it, and bitcoin itself pays nothing.</p>
        <p>The IPO raised about £10m gross, of which about <strong>{DIVIDEND_RESERVE.MORE.display}</strong> is earmarked for working capital and general purposes, including dividend cash reserves. That money is shared with other uses, so it isn&apos;t a ring-fenced dividend fund. The annual dividend on the IPO shares is about £1.33m.</p>
        <p><strong>The rate is variable.</strong> The 12% start can move up to a 20% cap, down to a floor of Bank of England base rate plus 1%, and falls are limited to 0.5% a year in any four weeks. The rate can&apos;t be cut while any dividend is unpaid. The company says the initial rate may not be maintained.</p>
        <p><strong>Payments can be suspended.</strong> The board can suspend any weekly payment, at its sole discretion and without giving a reason. Unpaid amounts build up as a non-interest-bearing balance, paid only when the board resolves to pay it. While anything is unpaid the rate can&apos;t be cut and no ordinary dividend can be paid.</p>
        <p><strong>Dividends must come from distributable profits.</strong> Under the Companies Act the company can only pay out of profits available for distribution, and the prospectus warns that a fall in bitcoin&apos;s value can erode those reserves and legally block the dividend.</p>
        <p><strong>The company can call it.</strong> It can redeem some or all shares at any time at £110 plus any unpaid dividends, on 10 working days&apos; notice. Holders can&apos;t require redemption and there is no maturity date.</p>
      </>
    ),
  },
};

export default function CapitalStructure({ ticker }) {
  const c = CONTENT[ticker];
  if (!c) return null;
  return (
    <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
      <h3 className="text-base font-semibold mb-1">How {ticker} is structured</h3>
      <p className="text-sm mb-2">Who ranks ahead of it, who ranks behind it, and where the dividend money comes from.</p>
      {c.diagram}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Panel title="What ranks above it">{c.above}</Panel>
        <Panel title="What ranks below it">{c.below}</Panel>
        <Panel title="How the dividend is financed">{c.financing}</Panel>
      </div>
      <p className="text-sm mt-4">
        Read more:{' '}
        {c.blog.map(([slug, label], i) => (
          <span key={slug}>
            {i > 0 && ' · '}
            <Link href={`/blog/${slug}`} style={gold}>{label}</Link>
          </span>
        ))}
      </p>
    </div>
  );
}
