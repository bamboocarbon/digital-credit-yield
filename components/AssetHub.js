import Link from 'next/link';
import { STRIVE_BTC_HOLDINGS, STRATEGY_BTC_HOLDINGS, BITMINE_ETH_HOLDINGS, DFDV_SOL_HOLDINGS, SMARTER_WEB_BTC_HOLDINGS } from '@/lib/constants';
import { PENDING_RATE_CHANGES } from '@/lib/pendingRateChanges';
import SubNav from '@/components/SubNav';
import AadsAd from '@/components/AadsAd';
import AssetHubLive from '@/components/AssetHubLive';
import IssuerCards from '@/components/IssuerCards';
import CapitalStructure from '@/components/CapitalStructure';

function PendingRateNote({ ticker }) {
  const pending = PENDING_RATE_CHANGES[ticker];
  if (!pending) return null;
  const effectiveDate = new Date(pending.effectiveFrom + 'T00:00:00Z')
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="text-sm mb-4 px-4 py-2.5 rounded-lg" style={{ background: 'var(--accent-gold-dim, rgba(212,175,55,0.1))', border: '1px solid var(--accent-gold)', color: 'var(--text)' }}>
      Rate rising to <strong>{pending.newRate.toFixed(2)}%</strong> from {effectiveDate} (announced {new Date(pending.announcedDate + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}).{' '}
      {pending.source && <a href={pending.source} target="_blank" rel="noopener noreferrer" className="underline">Source</a>}
    </div>
  );
}

// Strategy's proposal (8-K 5 Oct 2026 / DEFA14A) to pay STRC, STRF, STRK and STRD every calendar day.
// STRE is not part of it. Shown while the vote is pending — UPDATE OR REMOVE after the 28 Oct 2026
// special meeting: if approved, change these tickers' PAYMENT_FREQUENCY and dividend files and drop
// the "proposed" wording; if rejected, remove the note.
const DAILY_PROPOSAL = {
  STRC: 'If approved, the first daily dividend is expected on 2 November 2026 (record date 1 November).',
  STRF: 'If approved, STRF stays quarterly until the first daily payment, expected on 4 January 2027.',
  STRK: 'If approved, STRK stays quarterly until the first daily payment, expected on 4 January 2027.',
  STRD: 'If approved, STRD stays quarterly until the first daily payment, expected on 4 January 2027.',
};

function DailyProposalNote({ ticker }) {
  const when = DAILY_PROPOSAL[ticker];
  if (!when) return null;
  return (
    <div className="text-sm mb-4 px-4 py-2.5 rounded-lg" style={{ background: 'var(--accent-gold-dim, rgba(212,175,55,0.1))', border: '1px solid var(--accent-gold)', color: 'var(--text)' }}>
      <strong>Proposed:</strong> Strategy has proposed paying {ticker}&apos;s dividend every calendar day, with the same rate and annual total, subject to a shareholder vote on 28 October 2026. {when}{' '}
      <Link href="/blog/strc-365-day-calendar-dividends-proposal" prefetch={false} className="underline">Read more</Link>
    </div>
  );
}

const TOOLS = {
  STRC: [
    {
      href: '/chart?stock=strc',
      label: 'Live Price Chart',
      description: 'Track the STRC market price in real time against its $100 par value. As the price moves, the effective yield changes — use the chart to spot when STRC is trading at a premium or discount and understand what that means for your entry yield.',
    },
    {
      href: '/projector?stock=strc',
      label: 'Growth Projector',
      description: 'Enter an investment amount and time horizon to model your projected income and portfolio growth from holding STRC. Adjust the reinvestment rate to see the compounding effect, and compare returns against US Treasuries and bank savings side by side.',
    },
    {
      href: '/vs-treasuries?stock=strc',
      label: 'vs Treasuries',
      description: "Compare the income from STRC's dividend against US Treasuries and bank savings over any time period. Enter your investment amount and the tool shows the difference in dollar terms.",
    },
    {
      href: '/dividends?stock=strc',
      label: 'Dividend History',
      description: 'A complete record of every STRC dividend payment — per-share amount, payment date, and record date. Enter your holding size to calculate exactly how much you received or will receive from each distribution.',
    },
  ],
  SATA: [
    {
      href: '/chart?stock=sata',
      label: 'Live Price Chart',
      description: 'Track the SATA market price in real time against its $100 par value. As the price moves, the effective yield changes — use the chart to spot when SATA is trading at a premium or discount and understand what that means for your entry yield.',
    },
    {
      href: '/projector?stock=sata',
      label: 'Growth Projector',
      description: 'Enter an investment amount and time horizon to model your projected income and portfolio growth from holding SATA. Adjust the reinvestment rate to see the compounding effect, and compare returns against US Treasuries and bank savings side by side.',
    },
    {
      href: '/vs-treasuries?stock=sata',
      label: 'vs Treasuries',
      description: "Compare the income from SATA's dividend against US Treasuries and bank savings over any time period. Enter your investment amount and the tool shows the difference in dollar terms.",
    },
    {
      href: '/dividends?stock=sata',
      label: 'Dividend History',
      description: 'A complete record of every SATA dividend payment — per-share amount, payment date, and record date. Enter your holding size to calculate exactly how much you received or will receive from each distribution.',
    },
  ],
  BMNP: [
    {
      href: '/chart?stock=bmnp',
      label: 'Live Price Chart',
      description: 'Track the BMNP market price in real time against its $100 par value. As the price moves, the effective yield changes — use the chart to spot when BMNP is trading at a premium or discount and understand what that means for your entry yield.',
    },
    {
      href: '/projector?stock=bmnp',
      label: 'Growth Projector',
      description: 'Enter an investment amount and time horizon to model your projected income and portfolio growth from holding BMNP. Adjust the reinvestment rate to see the compounding effect of weekly dividends, and compare returns against US Treasuries and bank savings.',
    },
    {
      href: '/vs-treasuries?stock=bmnp',
      label: 'vs Treasuries',
      description: "Compare the income from BMNP's dividend against US Treasuries and bank savings over any time period. Enter your investment amount and the tool shows the difference in dollar terms.",
    },
    {
      href: '/dividends?stock=bmnp',
      label: 'Dividend History',
      description: 'A complete record of every BMNP dividend payment — per-share amount, payment date, and record date. Enter your holding size to calculate exactly how much you received or will receive from each weekly distribution.',
    },
  ],
  CHAD: [
    {
      href: '/chart?stock=chad',
      label: 'Live Price Chart',
      description: 'Track the CHAD market price in real time against its $10 stated value. As the price moves, the effective yield changes — use the chart to spot when CHAD is trading at a premium or discount and understand what that means for your entry yield.',
    },
    {
      href: '/projector?stock=chad',
      label: 'Growth Projector',
      description: 'Enter an investment amount and time horizon to model your projected income and portfolio growth from holding CHAD. Adjust the reinvestment rate to see the compounding effect of daily dividends, and compare returns against US Treasuries and bank savings.',
    },
    {
      href: '/vs-treasuries?stock=chad',
      label: 'vs Treasuries',
      description: "Compare the income from CHAD's dividend against US Treasuries and bank savings over any time period. Enter your investment amount and the tool shows the difference in dollar terms.",
    },
    {
      href: '/dividends?stock=chad',
      label: 'Dividend History',
      description: 'A complete record of every CHAD dividend payment — per-share amount, payment date, and record date. Enter your holding size to calculate exactly how much you received or will receive from each daily distribution.',
    },
  ],
  MORE: [
    {
      href: '/chart?stock=more',
      label: 'Live Price Chart',
      description: 'Track the MORE market price in pounds against its £100 reference value. As the price moves, the effective yield changes — use the chart to spot when MORE is trading at a premium or discount and understand what that means for your entry yield.',
    },
    {
      href: '/projector?stock=more',
      label: 'Growth Projector',
      description: 'Enter an investment amount and time horizon to model your projected income and portfolio growth from holding MORE. Adjust the reinvestment rate to see the compounding effect of weekly dividends, and compare returns against UK gilts and bank savings.',
    },
    {
      href: '/vs-treasuries?stock=more',
      label: 'vs Gilts',
      description: "Compare the income from MORE's dividend against UK gilts and bank savings over any time period. Enter your investment amount and the tool shows the difference in pound terms.",
    },
    {
      href: '/dividends?stock=more',
      label: 'Dividend History',
      description: 'A complete record of every MORE dividend payment — per-share amount, payment date, and record date. Enter your holding size to calculate exactly how much you received or will receive from each weekly distribution.',
    },
  ],
};

const DESCRIPTIONS = {
  STRC: (
    <div className="space-y-3">
      <p>STRC is Strategy&apos;s perpetual preferred stock, listed on the Nasdaq. It pays a 12.00% annual dividend distributed semi-monthly in cash (~$0.50 per share twice a month). Strategy publishes a four-band framework tying the rate to STRC&apos;s five-day VWAP against $100 par, but since the rate rose to 12.00% in July 2026 management has said each month it will recommend holding the rate flat there until STRC shows sustained, healthy trading near par — a discretionary override of what the published bands would otherwise trigger, confirmed again in Strategy&apos;s own filings through at least August 2026. The rate rise and the ring-fenced <strong>USD Reserve</strong> shown below both came out of the same June 2026 <Link href="/blog/strategy-transforms" style={{ color: 'var(--accent-gold)' }}>Digital Credit Capital Framework</Link> announcement, after STRC&apos;s price fell well below par. Semi-monthly payments approved by shareholders on 8 June 2026; first semi-monthly payment on 15 July 2026. STRC is available on most major brokerage platforms.</p>
      <p>As preferred stock, STRC sits below debt but above common equity in Strategy&apos;s capital structure. In the event of liquidation, preferred stockholders are paid before common shareholders, giving STRC a degree of protection that pure equity does not offer. Strategy&apos;s holdings of over {STRATEGY_BTC_HOLDINGS} Bitcoin provide a substantial asset base underpinning the instrument.</p>
      <p>Strategy (formerly MicroStrategy) is a Nasdaq-listed business intelligence and Bitcoin treasury company, founded in 1989. Under executive chairman Michael Saylor — one of the world&apos;s most prominent Bitcoin advocates — Strategy has made Bitcoin accumulation central to its corporate model, positioning itself as the world&apos;s largest corporate holder of Bitcoin.</p>
      <p>The one number I watch on STRC is how close it&apos;s trading to $100 — buy near or below par and the effective yield works in your favour; pay a premium and your real yield comes in under the headline rate. Worth knowing: the published VWAP bands aren&apos;t currently driving the rate month to month — management is holding it flat by choice while the price recovers, so don&apos;t assume the next print automatically follows the band table.</p>
      <a href="https://www.strategy.com" target="_blank" rel="noopener noreferrer"
        className="inline-block text-sm underline mt-1" style={{ color: 'var(--accent-gold)' }}>
        Visit Strategy.com
      </a>
    </div>
  ),
  SATA: (
    <div className="space-y-3">
      <p>SATA is Strive&apos;s perpetual preferred equity instrument, listed on the Nasdaq. It pays a 13.00% annual dividend distributed daily in cash (~$0.052 per share per day), with Strive aiming to hold it in a $99–$101 trading range. SATA is available on most major brokerage platforms.</p>
      <p>As preferred equity, SATA sits below debt but above common equity in Strive&apos;s capital structure. In the event of liquidation, preferred stockholders are paid before common shareholders, giving SATA a meaningful layer of protection relative to pure equity. Strive backs the instrument with over {STRIVE_BTC_HOLDINGS} Bitcoin in reserve assets and maintains 18 months of pre-funded cash reserves to cover dividend payments.</p>
      <p>Strive is a Nasdaq-listed financial services and Bitcoin treasury company, founded in 2022 by Vivek Ramaswamy. It positions itself as a Bitcoin-first asset manager focused on financial returns rather than ESG objectives, and has made Bitcoin a cornerstone of both its treasury strategy and its financial product offering.</p>
      <p>What I find reassuring about SATA is that 18-month cash buffer — the near-term dividend isn&apos;t riding directly on the Bitcoin price. What I&apos;d keep an eye on is that the rate is set at the board&apos;s discretion rather than by a published formula.</p>
      <a href="https://strive.com" target="_blank" rel="noopener noreferrer"
        className="inline-block text-sm underline mt-1" style={{ color: 'var(--accent-gold)' }}>
        Visit Strive.com
      </a>
    </div>
  ),
  BMNP: (
    <div className="space-y-3">
      <p>BMNP is Bitmine Immersion Technologies&apos; Series A Perpetual Preferred Stock, listed on the NYSE in June 2026. It pays a 9.50% annual dividend distributed weekly in cash — an unusually frequent schedule for a listed preferred. Dividends are cumulative: any unpaid amount accumulates and must be settled before common dividends can be declared.</p>
      <p>As preferred stock, BMNP sits above common equity in Bitmine&apos;s capital structure. The instrument includes call provisions allowing the company to redeem shares at 110% of the $100 par value in the first 18 months, stepping down to 105% between 18 months and 3 years, then at par thereafter. These premiums are designed to compensate holders for early redemption risk. Unpaid dividends compound weekly at the stated rate plus a 5 basis point step-up per missed period, capped at 15% per annum.</p>
      <p>Bitmine Immersion Technologies (common stock: BMNR) is an Ethereum-focused digital asset company, holding over {BITMINE_ETH_HOLDINGS} ETH — the largest corporate Ethereum treasury in the world. Through its MAVAN staking infrastructure platform, Bitmine operates Ethereum validators and staking nodes, generating yield from network validation rewards. The company plans to deploy proceeds from the BMNP offering into ETH acquisition and expanded staking infrastructure, positioning itself as an Ethereum treasury company.</p>
      <p>What makes BMNP genuinely different, to my mind, is that the Ethereum behind it actively earns the dividend through staking rather than simply needing to rise in value. The trade-off is a newer, more complex asset and a fixed rate with no published mechanism to adjust it.</p>
      <a href="https://www.bitminetech.io" target="_blank" rel="noopener noreferrer"
        className="inline-block text-sm underline mt-1" style={{ color: 'var(--accent-gold)' }}>
        Visit Bitminetech.io
      </a>
    </div>
  ),
  CHAD: (
    <div className="space-y-3">
      <p>CHAD is DeFi Development Corp.&apos;s Variable Rate Series C Perpetual Preferred Stock, listed on the Nasdaq. It pays a 13.00% annual dividend distributed daily in cash, cumulative if ever missed, with a <strong>$10 stated value</strong> rather than the $100 the other three instruments here share — a real structural difference, not just a smaller number on the label. Management intends to manage the rate to keep the price within a long-term range, reviewed monthly or more often. CHAD closed its initial offering on 8 September 2026 and is available on most major brokerage platforms.</p>
      <p>As preferred stock, CHAD ranks senior to DeFi Development Corp.&apos;s common stock, and junior to the company&apos;s existing and future indebtedness. Net proceeds are earmarked for general corporate purposes, chiefly buying more Solana for the company&apos;s treasury, alongside other digital-asset investments and growth initiatives.</p>
      <p>DeFi Development Corp. (Nasdaq: DFDV) describes itself as the first public Digital Asset Treasury company focused on Solana — the same playbook Strategy popularised for Bitcoin, applied to SOL instead. It holds over {DFDV_SOL_HOLDINGS} SOL, the second-largest corporate Solana treasury after Forward Industries, and raises capital — much of it now through CHAD — to keep growing it, positioning the stock as a proxy for Solana accumulation with a preferred-dividend layer on top.</p>
      <p>What I&apos;d flag plainly: CHAD is the newest and smallest instrument on this site by some distance, with barely a month of trading history and no published rate-adjustment formula the way STRC has — the $10 stated value and daily cadence make it feel closest to SATA in mechanics, but it hasn&apos;t built the track record the other three have yet. I&apos;m watching how consistently the daily dividend actually lands before I&apos;d call it proven.</p>
      <a href="https://defidevcorp.com" target="_blank" rel="noopener noreferrer"
        className="inline-block text-sm underline mt-1" style={{ color: 'var(--accent-gold)' }}>
        Visit DefiDevCorp.com
      </a>
    </div>
  ),
  MORE: (
    <div className="space-y-3">
      <p>MORE is The Smarter Web Company&apos;s cumulative, variable-rate preferred share, admitted to the London Stock Exchange Main Market on <strong>14 October 2026</strong>. It pays an initial <strong>12% a year on a £100 reference value</strong> — £12 a share — distributed <strong>weekly</strong> in sterling. The retail offer priced the shares at <strong>£90</strong>, which is why the headline yield on the offer price works out nearer 13.3%. The board can vary the rate, but only within the prospectus limits: a 20% cap, a floor of Bank of England base rate plus 1%, and cuts of no more than 0.5% in any four weeks. It can also suspend any weekly payment. Dividends are cumulative, so a missed payment builds up as a non-interest-bearing balance that is paid only when the board resolves to pay it, and while anything is owed no dividend can be paid on the ordinary shares. The company can redeem the shares at any time at £110 plus any unpaid dividends, and holders are non-voting.</p>
      <p>As preferred equity, MORE ranks ahead of the ordinary shares but behind creditors in a winding-up, with a liquidation entitlement of £100 a share plus any unpaid dividends. The initial raise came in at about £10M gross (111,112 shares at £90), below the £15–25M the company first targeted, with a further 100,000 shares held back for sale into the market through Tennyson Capital Partners. Of the net proceeds, £4M is earmarked for additional bitcoin and about £3.85M for working capital and general corporate purposes, including dividend cash reserves. The first dividend is £0.2301 a share, with an ex-dividend date of 22 October and a record date of 23 October.</p>
      <p>The Smarter Web Company is a UK web-services business that also runs a bitcoin treasury: bitcoin is its primary treasury reserve asset, with a stated aim of growing bitcoin per ordinary share over time. It currently holds {SMARTER_WEB_BTC_HOLDINGS} BTC. Its own website is blunt that an investment in the company is not an investment in bitcoin, directly or by proxy. That is worth taking at face value for a preferred share, where the dividend is a corporate obligation rather than a bitcoin price bet. The prospectus does warn, though, that a big fall in bitcoin could eat into the profits the company is legally allowed to pay dividends from.</p>
      <p>What matters most to me about MORE is the currency, not the yield. Every other instrument on this site is priced in dollars, so a UK saver pays a foreign-exchange toll in and out before the dividend does any work. MORE is the first one I can buy in pounds, on a London screen, with no currency conversion at all. The trade-off is a brand-new issuer, a small raise and no track record — I&apos;d want to see the weekly dividend land on time before calling it proven.</p>
      <a href="https://www.smarterwebcompany.co.uk" target="_blank" rel="noopener noreferrer"
        className="inline-block text-sm underline mt-1" style={{ color: 'var(--accent-gold)' }}>
        Visit SmarterWebCompany.co.uk
      </a>
    </div>
  ),
};

// ── Strategy's other preferreds and Strive's SATS ─────────────────────────────────────────────
// Reference-tier hubs: same tools as the main tickers, generated from one helper rather than
// five hand-written blocks. Copy is factual (terms from each issuer's filings); no personal-voice
// closing line — that's Robin's to write.
const toolsFor = (t, { govt = 'US Treasuries', money = 'dollar', cadence = 'quarterly', par = '$100' } = {}) => {
  const low = t.toLowerCase();
  return [
    { href: `/chart?stock=${low}`, label: 'Live Price Chart', description: `Track the ${t} market price against its ${par} stated value. As the price moves, the effective yield changes — use the chart to spot when ${t} trades at a premium or discount and what that means for your entry yield.` },
    { href: `/projector?stock=${low}`, label: 'Growth Projector', description: `Enter an investment amount and time horizon to model projected income and portfolio growth from holding ${t}. Adjust the reinvestment rate to see the compounding effect of ${cadence} dividends, and compare returns against ${govt} and bank savings.` },
    { href: `/vs-treasuries?stock=${low}`, label: govt === 'UK gilts' ? 'vs Gilts' : 'vs Treasuries', description: `Compare the income from ${t}'s dividend against ${govt} and bank savings over any time period. Enter your investment amount and the tool shows the difference in ${money} terms.` },
    { href: `/dividends?stock=${low}`, label: 'Dividend History', description: `A record of every ${t} dividend payment — per-share amount and payment date. Enter your holding size to calculate what you received or will receive from each ${cadence} distribution.` },
  ];
};
TOOLS.STRK = toolsFor('STRK');
TOOLS.STRF = toolsFor('STRF');
TOOLS.STRD = toolsFor('STRD');
TOOLS.STRE = toolsFor('STRE', { money: 'euro', par: '€100' });
TOOLS.SATS = toolsFor('SATS', { cadence: 'daily' });

const Visit = ({ href, label }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="inline-block text-sm underline mt-1" style={{ color: 'var(--accent-gold)' }}>
    {label}
  </a>
);

DESCRIPTIONS.STRK = (
  <div className="space-y-3">
    <p>STRK is Strategy&apos;s 8.00% Series A Perpetual Strike Preferred Stock, listed on the Nasdaq. It pays a fixed 8.00% annual dividend on a $100 stated value ($8.00 a share a year, $2.00 a quarter), in cash, cumulative if ever missed. Unlike STRC and STRF, it is <strong>convertible</strong>: each share can convert into 0.1 share of MSTR common stock, so holders get an equity option alongside the income.</p>
    <p>STRK ranks below Strategy&apos;s debt, STRF, STRC and STRE, and above STRD and the common stock. The conversion feature is why it trades well below its $100 stated value at times: part of what you hold is an option on MSTR, and the headline 8% is lower than the other fixed-rate series as a result. When STRK trades below $100, the effective yield — the dividend measured against the price you actually pay — is higher than 8%.</p>
    <p>Strategy (formerly MicroStrategy) is a Nasdaq-listed Bitcoin treasury company and the world&apos;s largest corporate holder of Bitcoin, with over {STRATEGY_BTC_HOLDINGS} BTC.</p>
    <Visit href="https://www.strategy.com" label="Visit Strategy.com" />
  </div>
);
DESCRIPTIONS.STRF = (
  <div className="space-y-3">
    <p>STRF is Strategy&apos;s 10.00% Series A Perpetual Strife Preferred Stock, listed on the Nasdaq. It pays a fixed 10.00% annual dividend on a $100 stated value ($10.00 a share a year, $2.50 a quarter), in cash, cumulative if ever missed.</p>
    <p>STRF is the most senior of Strategy&apos;s preferred series: only Strategy&apos;s debt ranks ahead of it, and it ranks ahead of STRC, STRE, STRK and STRD. Because the rate is fixed and the instrument trades close to its stated value, STRF behaves most like conventional preferred income of the Strategy range.</p>
    <p>Strategy (formerly MicroStrategy) is a Nasdaq-listed Bitcoin treasury company and the world&apos;s largest corporate holder of Bitcoin, with over {STRATEGY_BTC_HOLDINGS} BTC.</p>
    <Visit href="https://www.strategy.com" label="Visit Strategy.com" />
  </div>
);
DESCRIPTIONS.STRD = (
  <div className="space-y-3">
    <p>STRD is Strategy&apos;s 10.00% Series A Perpetual Stride Preferred Stock, listed on the Nasdaq. It pays a stated 10.00% annual dividend on a $100 stated value ($10.00 a share a year, $2.50 a quarter), in cash. Unlike STRF, STRK and STRC, STRD&apos;s dividend is <strong>non-cumulative</strong>: a payment that isn&apos;t declared doesn&apos;t build up as an amount owed.</p>
    <p>STRD is the most junior of Strategy&apos;s preferred series, ranking just above the common stock. That position, together with the non-cumulative dividend, is why it trades well below its $100 stated value, and why its effective yield — the dividend against the price you actually pay — is well above the 10% headline rate.</p>
    <p>Strategy (formerly MicroStrategy) is a Nasdaq-listed Bitcoin treasury company and the world&apos;s largest corporate holder of Bitcoin, with over {STRATEGY_BTC_HOLDINGS} BTC.</p>
    <Visit href="https://www.strategy.com" label="Visit Strategy.com" />
  </div>
);
DESCRIPTIONS.STRE = (
  <div className="space-y-3">
    <p>STRE is Strategy&apos;s 10.00% Series A Perpetual Stream Preferred Stock — its only <strong>euro-denominated</strong> preferred. It has a €100 stated value and pays a fixed 10.00% a year (€10.00 a share, €2.50 a quarter) in euros, cumulative if ever missed. It is listed on the Luxembourg Stock Exchange&apos;s Euro MTF market, not on Nasdaq, and is available only to professional and institutional investors in the European Economic Area — not to retail investors, and not in the UK.</p>
    <p>STRE ranks below Strategy&apos;s debt, STRF and STRC, and above STRK, STRD and the common stock.</p>
    <p>STRE has no standard market-data feed: the price shown here is the indicative mid-point of bid and ask as reported by a market maker, taken from Strategy&apos;s own STRE page and updated by hand, so it may lag the market.</p>
    <Visit href="https://www.strategy.com/stre/learn" label="Visit Strategy.com/stre" />
  </div>
);
DESCRIPTIONS.SATS = (
  <div className="space-y-3">
    <p>SATS is Strive&apos;s proposed 15.00% Series A Perpetual SATS Preferred Stock. On 13 October 2026 Strive announced an initial public offering of 5,000,000 shares at a $100 stated value (about $500 million), with a Nasdaq listing applied for. It would pay a 15.00% annual dividend ($15.00 a share a year) in cash on each business day, cumulative if ever missed, beginning 9 November 2026.</p>
    <p>At closing Strive intends to set aside a dividend reserve of $22.50 per SATS share — 18 months of dividends. SATS would rank below Strive&apos;s SATA preferred, so it carries more risk than SATA, which is the trade-off for the higher rate. SATS has not priced or begun trading yet: <strong>everything on this page is based on the announced terms, not a live market</strong>, and will be updated once the offering prices.</p>
    <p>Strive is a Nasdaq-listed Bitcoin treasury and asset management company, with over {STRIVE_BTC_HOLDINGS} Bitcoin.</p>
    <Visit href="https://strive.com" label="Visit Strive.com" />
  </div>
);

export default function AssetHub({ ticker, name }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
      <SubNav ticker={ticker} />

      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
        {ticker} — {name}
      </h1>

      <IssuerCards selected={ticker} />

      <PendingRateNote ticker={ticker} />
      <DailyProposalNote ticker={ticker} />

      {/* Live price + data cards (client-rendered) */}
      <AssetHubLive ticker={ticker} />

      {/* About section — server-rendered for SEO */}
      <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-lg font-semibold mb-3">About {ticker}</h2>
        <div className="text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
          {DESCRIPTIONS[ticker]}
          <CapitalStructure ticker={ticker} />
        </div>
      </div>

      {/* Tools section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS[ticker].map(tool => (
            <Link
              key={tool.href}
              href={tool.href}
              prefetch={false}
              className="block p-5 rounded-xl transition-opacity hover:opacity-80"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p className="font-semibold text-sm mb-2" style={{ color: 'var(--accent-gold)' }}>{tool.label}</p>
              <p className="text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-6 p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
          A yield like this always comes with risk — board discretion over dividends, rate changes, and crypto-collateral volatility among them.{' '}
          <Link href="/risks" prefetch={false} style={{ color: 'var(--accent-gold)' }}>Read the full risk guide →</Link>
        </p>
      </div>

      <AadsAd />

      <div className="mt-8 p-5 rounded-xl" style={{ background: 'rgba(200,137,58,0.08)', border: '1px solid var(--accent-gold)' }}>
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
