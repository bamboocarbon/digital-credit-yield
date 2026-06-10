import CompoundingChart from '@/components/CompoundingChart';
import StrategyCapitalStack from '@/components/StrategyCapitalStack';
import StriveCapitalStack from '@/components/StriveCapitalStack';

export const articles = [
  {
    slug: 'what-is-preferred-stock',
    title: 'What Is Preferred Stock? A Plain English Guide',
    date: '2026-03-10',
    excerpt: 'Most investors know about common stock and bonds. Preferred stock sits between them — and understanding how it works is the foundation for evaluating any high-yield income asset like STRC or SATA.',
    readTime: '6 min read',
    category: 'Education',
    Content() {
      return (
        <>
          <p>Most investors are familiar with two types of securities: common stock and bonds. Preferred stock is a hybrid that draws features from both. It is widely used by corporations to raise capital and underpins the structure of newer income instruments like STRC and SATA.</p>

          <h2>Where preferred stock sits in the capital structure</h2>
          <p>When a company raises money, it can borrow through bonds, sell ownership through common stock, or issue preferred stock — a middle path. The term "preferred" refers to payment priority. If dividends are paid or the company is liquidated, preferred stockholders receive their payment before common stockholders. Bondholders, however, still rank above preferred stockholders. This places preferred equity firmly in the middle of the capital stack: more protected than common stock, less senior than debt.</p>

          <h2>Fixed dividends and income predictability</h2>
          <p>Preferred stock carries a <strong>fixed dividend</strong> expressed as a percentage of the issue (par) price. This payment is agreed at issuance and does not fluctuate with company profits. Unlike common stock dividends — which can be raised, cut, or eliminated at will — preferred dividends offer a level of consistency that makes them attractive to income-focused investors.</p>
          <p>In most structures, preferred stockholders receive <strong>no voting rights</strong>. They trade governance influence for income stability. For investors primarily interested in reliable cash flow rather than corporate control, this is a straightforward tradeoff.</p>

          <h2>Cumulative versus non-cumulative dividends</h2>
          <p>One critical distinction between preferred stock structures is whether dividends are <strong>cumulative</strong> or <strong>non-cumulative</strong>.</p>
          <p>With cumulative preferred stock, if the issuer misses a dividend payment, the unpaid amount accumulates as an obligation. Before common stockholders receive anything, all back-owed preferred dividends must be settled. Non-cumulative preferred stock offers no such protection: a missed payment is simply gone.</p>
          <p>This distinction matters considerably when assessing downside risk. Non-cumulative structures offer less protection if an issuer encounters financial difficulty.</p>

          <h2>Perpetual versus term preferred stock</h2>
          <p><strong>Perpetual preferred stock</strong> has no maturity date. The issuer pays dividends indefinitely, and the stock does not automatically redeem. Total return depends almost entirely on dividend income — there is no built-in capital return event to anchor pricing.</p>
          <p><strong>Term preferred stock</strong> has a fixed maturity at which the company redeems stock at par value, similar to a bond. This creates a known endpoint that affects both price behaviour and yield calculation.</p>
          <p>STRC, issued by Strategy, is a perpetual preferred stock. This means its <strong>effective yield</strong> — your actual return based on the price you pay — can shift over time even if the dividend itself remains unchanged.</p>

          <h2>How preferred stock compares to bonds</h2>
          <p>Bonds are debt instruments. The issuer is legally obligated to pay interest and return principal. Missing a bond payment triggers a default. Preferred dividends are equity payments — they can theoretically be suspended without triggering a default event. In practice, suspending preferred dividends is severely damaging to an issuer's reputation and its ability to raise future capital, so issuers treat these obligations seriously.</p>
          <p>To compensate investors for bearing slightly more risk than bondholders, preferred stock typically carries a <strong>higher yield</strong> than bonds from the same issuer. This yield premium is the return for accepting a lower position in the capital stack.</p>

          <h2>Adjustable-rate preferred stock</h2>
          <p>Some preferred stock has a variable dividend rate that adjusts periodically in response to market conditions. STRC operates this way — its dividend rate is reviewed monthly to keep the instrument trading close to its $100 par value. When the price drifts below par, the rate adjusts upward to attract buyers; when it drifts above par, the rate adjusts down. This mechanism is designed to reduce price volatility while maintaining a competitive income stream.</p>

          <h2>Why this matters for income investors</h2>
          <p>If you are evaluating STRC or SATA, you are looking at preferred equity instruments. The three metrics that matter most are: the <strong>stated yield</strong> (annual dividend as a percentage of par), the <strong>effective yield</strong> (annual dividend as a percentage of the current market price), and the <strong>par proximity</strong> (how close the instrument trades to its issue price at any given time).</p>
          <p>The <a href="/strc">STRC hub</a> and <a href="/sata">SATA hub</a> show you all three metrics in real time. Understanding the preferred equity framework means you know exactly what you are looking at — and why the price matters as much as the dividend.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Past performance is not indicative of future results. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'how-strc-works',
    title: "How STRC Works: Strategy's Perpetual Preferred Stock Explained",
    date: '2026-03-17',
    excerpt: "STRC is a perpetual preferred stock issued by Strategy — the world's largest corporate Bitcoin holder. Here's how the instrument is structured, what backs the dividend, and how the adjustable-rate mechanism works.",
    readTime: '7 min read',
    category: 'STRC',
    Content() {
      return (
        <>
          <p>STRC is a perpetual preferred stock issued by Strategy — the company led by Michael Saylor that holds more Bitcoin than any other publicly traded corporation. It is designed to generate a consistent, high cash yield for income investors while maintaining a stable price close to its $100 par value.</p>

          <h2>What Strategy is and why it issues preferred stock</h2>
          <p>Strategy (formerly MicroStrategy) began as a business intelligence software company but has repositioned itself primarily as a Bitcoin treasury company. Its core strategy is to accumulate Bitcoin as its principal asset, financing those purchases through a mix of debt instruments, common stock issuance, and preferred equity. STRC is one of those preferred equity instruments — capital raised in exchange for a fixed income stream, with the proceeds used to fund continued Bitcoin acquisition.</p>
          <p>Issuing preferred equity allows Strategy to raise capital without diluting common stockholders through new stock issuance and without creating the hard repayment obligations that come with debt. For investors, STRC offers a fixed, high cash yield from one of the most prominent names in the Bitcoin space.</p>

          <h2>The structure of STRC</h2>
          <p>STRC is perpetual preferred stock with a <strong>$100 par value</strong>. It pays an annual dividend rate that is reviewed monthly and adjusted to keep the instrument trading close to par. The current rate stands at <strong>11.50%</strong> — meaning each share pays approximately <strong>$0.958 per month</strong>, or $11.50 per year, in cash.</p>
          <p>Dividends are paid monthly directly to shareholders. There is no fixed maturity date — the stock continues paying dividends indefinitely, at Strategy's discretion.</p>

          <h2>The adjustable-rate mechanism</h2>
          <p>One of STRC's defining features is its monthly dividend rate adjustment. Unlike traditional fixed-rate preferred stock — which can drift significantly away from par as the interest rate environment changes — STRC's rate is designed to move in response to market conditions.</p>
          <p>If STRC trades below $100, the rate adjusts upward, making the instrument more attractive and pulling the price back toward par. If it trades above $100, the rate adjusts downward. This mechanism is intended to reduce price volatility and keep the instrument appealing to income investors regardless of broader rate movements.</p>

          <h2>Rate history since IPO</h2>
          <p>STRC launched in <strong>July 2025</strong> at an initial dividend rate of <strong>9%</strong>. Since then, the rate has been stepped up progressively:</p>
          <ul>
            <li>July 2025: 9.00%</li>
            <li>August 2025: 10.00%</li>
            <li>September 2025: 10.25%</li>
            <li>October 2025: 10.50%</li>
            <li>November 2025: 11.00%</li>
            <li>December 2025: 11.25%</li>
            <li>March 2026: 11.50%</li>
          </ul>
          <p>These step-ups reflect both the adjustable-rate mechanism responding to market conditions and Strategy's commitment to maintaining a competitive yield for preferred stockholders.</p>

          <h2>Stated yield versus effective yield</h2>
          <p>At exactly $100, the effective yield equals the stated rate of 11.50%. But because STRC trades on the open market, its price fluctuates slightly. If you purchase at $98, your effective yield on that investment is higher (11.50 ÷ 98 × 100 ≈ 11.73%). If you buy at $102, your effective yield is slightly lower.</p>
          <p>This distinction between stated and effective yield is why the <a href="/strc/chart">STRC yield chart</a> is useful — it shows how effective yield has moved over time, giving you historical context for current pricing. The <a href="/strc">STRC hub</a> shows both metrics live.</p>

          <h2>What backs the dividend?</h2>
          <p>Strategy generates revenue from its business intelligence software operations, but the primary asset on its balance sheet is its Bitcoin holdings — over 800,000 BTC as of early 2026. The ability to pay STRC dividends depends on Strategy's overall financial position, its continued ability to raise capital, and its management of its Bitcoin treasury.</p>
          <p>As with any preferred equity instrument, dividends are not legally guaranteed in the same way bond interest is. They represent an equity obligation rather than a debt obligation. However, suspending preferred dividends would be significantly damaging to Strategy's reputation and its ability to raise future capital — a strong practical incentive to maintain payments.</p>

          <h2>Modelling STRC returns</h2>
          <p>The <a href="/strc/projector">STRC Growth Projector</a> lets you model what a given investment amount grows to over 1–20 years, with or without dividend reinvestment. It pre-fills the current live effective yield. The <a href="/strc/differentiator">Differentiator</a> compares STRC against traditional income benchmarks on yield and projected growth, useful for seeing how it fits within a broader income strategy.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. STRC is a speculative investment. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'bitcoin-treasury-companies',
    title: 'Bitcoin Treasury Companies and Why They Issue High-Yield Preferred Equity',
    date: '2026-03-25',
    excerpt: 'A wave of publicly traded companies has adopted Bitcoin as their primary treasury asset. Several now issue preferred equity instruments paying high cash yields. Here is why these instruments exist and what backs them.',
    readTime: '7 min read',
    category: 'Education',
    Content() {
      return (
        <>
          <p>Over the past three years, a growing number of publicly traded companies have repositioned themselves around Bitcoin as their primary treasury asset. Several of these companies — including Strategy and Strive — have issued preferred equity instruments that pay high cash yields. To understand why these instruments exist and what backs them, it helps to understand the Bitcoin treasury model itself.</p>

          <h2>What is a Bitcoin treasury company?</h2>
          <p>A Bitcoin treasury company holds Bitcoin as its dominant balance-sheet asset, often in preference to cash, bonds, or other conventional treasury instruments. The thesis — most famously articulated by Strategy's Michael Saylor — is that Bitcoin's fixed supply and growing institutional adoption make it a superior long-term store of value compared to currencies that can be expanded through monetary policy. These companies raise capital specifically to accumulate Bitcoin, and their corporate value is largely tied to the performance of their holdings.</p>
          <p>This is a genuinely new model. Traditional treasury management aims to preserve capital and maintain liquidity. Bitcoin treasury companies accept higher volatility in exchange for what they believe is a superior long-term asset.</p>

          <h2>How they raise capital</h2>
          <p>Bitcoin treasury companies typically cannot generate enough cash from operations to fund large Bitcoin purchases. Instead, they access capital markets through three main mechanisms:</p>
          <ol>
            <li><strong>Common stock issuance</strong> — raises cash but dilutes existing stockholders</li>
            <li><strong>Convertible debt</strong> — bonds that can convert to equity, providing capital without immediate dilution but creating future obligations</li>
            <li><strong>Preferred equity</strong> — instruments like STRC and SATA that raise capital at a fixed yield without diluting common stockholders and without the hard repayment obligations of debt</li>
          </ol>
          <p>Each method has different costs and implications. Preferred equity is appealing to issuers because it is a flexible, income-based capital raise. It is appealing to investors because it offers a predictable, high cash yield.</p>

          <h2>Why the yields are high</h2>
          <p>The yields on preferred equity from Bitcoin treasury companies — currently 11.5% for STRC and 13% for SATA — are meaningfully higher than those on conventional preferred stock. There are two main reasons.</p>
          <p>First, these companies carry an unusual risk profile. Significant Bitcoin exposure, unconventional business models, and a relatively short track record all mean investors require a meaningful yield premium over conventional preferred equity to be compensated for the additional uncertainty.</p>
          <p>Second, these instruments compete with Bitcoin itself for investor capital. An income investor comparing a 12–13% cash yield from preferred equity against the potential upside of holding Bitcoin directly needs to see a compelling yield to choose the income instrument over direct exposure. The high yields reflect this competitive reality.</p>

          <h2>Bitcoin as balance-sheet backing</h2>
          <p>When companies like Strategy and Strive hold large Bitcoin reserves, those holdings back the value of their balance sheets and, indirectly, their ability to service preferred equity dividends. If Bitcoin appreciates significantly, the backing strengthens. If Bitcoin falls sharply, the backing weakens — though as long as adequate cash reserves exist, the dividend itself does not automatically become impaired.</p>
          <p>This is an important distinction for investors to understand. The <strong>dividend payment</strong> comes from cash and cash flow, not directly from Bitcoin. But the <strong>financial health of the issuer</strong> is tied to the Bitcoin price. A prolonged Bitcoin bear market would put pressure on issuers' balance sheets even if short-term cash reserves remained sufficient to pay dividends.</p>

          <h2>Strategy: the original Bitcoin treasury company</h2>
          <p>Strategy (formerly MicroStrategy) began accumulating Bitcoin in August 2020 under CEO Michael Saylor, becoming the first major publicly traded company to adopt Bitcoin as a primary treasury reserve asset. It now holds over 800,000 BTC — more than any other publicly traded company — and has financed this accumulation through a range of capital market instruments.</p>
          <p>STRC is Strategy's perpetual preferred stock, offering income investors access to a high cash yield backed by the company's financial resources and Bitcoin treasury. It launched in July 2025 and has increased its dividend rate steadily since then.</p>

          <h2>Strive: Bitcoin-focused asset management</h2>
          <p>Strive Asset Management is a newer entrant, founded in 2022, with an investment approach built around direct Bitcoin exposure and maximizing stockholder returns. SATA is its preferred equity instrument, combining a Bitcoin-backed treasury with a conservative cash reserve policy designed to provide dividend security.</p>
          <p>Strive holds 13,000+ Bitcoin at launch alongside 18+ months of cash reserves — a substantial buffer designed to maintain dividend payments through periods of Bitcoin price volatility. This dual-asset approach (Bitcoin for long-term appreciation, cash for near-term income obligations) is central to SATA's income thesis.</p>

          <h2>What this means for investors</h2>
          <p>Investing in STRC or SATA means gaining exposure to a high-yield income stream from companies whose primary strategic asset is Bitcoin. This creates a distinct risk and return profile: higher yields than conventional preferred equity, but with meaningful exposure to Bitcoin's price trajectory and the execution risk of a still-novel business model. These are not equivalents to conventional preferred stock or investment-grade bonds — they are a new category requiring a different analytical framework.</p>
          <p>Understanding this context is essential before treating STRC or SATA purely as income substitutes for traditional preferred equity. They offer higher yields precisely because they carry genuinely higher risk.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'what-is-effective-yield',
    title: 'What Is Effective Yield and Why It Matters for Income Investors',
    date: '2026-04-04',
    excerpt: 'Two investors buy the same income asset. One pays $100 per share, the other pays $95. Both receive the same cash dividend — but their return on capital is different. This is the difference between stated yield and effective yield.',
    readTime: '5 min read',
    category: 'Education',
    Content() {
      return (
        <>
          <p>Two investors buy the same preferred stock. One purchases at $100 per share. The other buys later at $95. Both receive identical cash dividends every month — but their actual return on capital deployed is different. This difference is captured by the concept of <strong>effective yield</strong>, and understanding it is essential for evaluating any publicly traded income instrument.</p>

          <h2>Stated yield versus effective yield</h2>
          <p><strong>Stated yield</strong> (also called nominal yield or coupon rate) is the annual dividend expressed as a percentage of the par value — the price the instrument was originally issued at. If preferred stock has a $100 par value and pays $13 per year in dividends, its stated yield is 13%.</p>
          <p><strong>Effective yield</strong> (also called current yield or running yield) is the annual dividend expressed as a percentage of the <em>current market price</em>. If that same stock is trading at $95, the effective yield is 13 ÷ 95 × 100 = 13.68%. If it is trading at $106, the effective yield is 13 ÷ 106 × 100 = 12.26%.</p>
          <p>Stated yield is fixed at issuance. Effective yield changes continuously as the market price moves.</p>

          <h2>Why the price drifts from par</h2>
          <p>Preferred equity is publicly traded, so its price responds to supply and demand, interest rate expectations, issuer-specific news, and general market sentiment. Even instruments with adjustable rates — like STRC, which reviews its rate monthly — experience short-term price movements around par. For instruments with fixed rates, the price can move significantly in response to changes in the broader rate environment.</p>
          <p>The result is that an income instrument's effective yield is rarely exactly equal to its stated yield. Understanding which you are looking at matters enormously for comparing opportunities.</p>

          <h2>The effective yield is what you actually earn</h2>
          <p>When you buy STRC or SATA in the open market, you are buying at the current price — not at par. Your actual return on the capital you deploy is the effective yield at your purchase price, not the stated rate. If you pay $103 for a share that pays $11.50 per year, your effective yield is 11.17%, not 11.50%. On a large position, that difference is material.</p>
          <p>Conversely, if a price dip takes STRC to $97, a buyer at that price achieves an effective yield of approximately 11.86% — meaningfully above the stated 11.50%. Price dislocations from par can represent genuine opportunities for income investors who understand what they are measuring.</p>

          <h2>Yield on cost: your personal return</h2>
          <p>Once you have purchased, your cost basis is fixed. The <strong>yield on cost</strong> — the annual dividend as a percentage of what you actually paid — does not change as the market price moves. If you bought at $97 and the price later rises to $104, you are still receiving the same cash per share. Your personal yield on cost remains approximately 11.86%. The live effective yield quoted on the site reflects the current market price, which is relevant to new buyers — not to your existing position.</p>

          <h2>The effective yield chart</h2>
          <p>The yield chart on the <a href="/strc/chart">STRC chart page</a> and <a href="/sata/chart">SATA chart page</a> tracks effective yield over time. A rising line means the price has fallen relative to the dividend — the instrument has become better value for new buyers. A falling line means the price has risen above its historical norm. Reviewing this chart over several months gives meaningful context for whether current pricing represents an attractive or expensive entry point.</p>

          <h2>Yield and compounding in the Growth Projector</h2>
          <p>The <a href="/strc/projector">Growth Projector</a> uses effective yield to model portfolio growth. When dividend reinvestment is toggled on, it assumes reinvested dividends purchase additional stock at the current effective yield. This means the compounding model reflects what a buyer at today's price would actually earn — not a theoretical par-based return. Even small differences in effective yield produce meaningfully different outcomes over ten or twenty year horizons, which is why tracking it accurately matters.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'how-sata-works',
    title: 'How SATA Works: High-Yield Income Backed by Bitcoin and Cash Reserves',
    date: '2026-05-23',
    excerpt: "SATA is Strive's preferred equity instrument paying 13% per year — one of the highest yields available in listed preferred equity. Here's how it's structured, what backs the dividend, and why SATA is moving to daily payments from June 2026.",
    readTime: '7 min read',
    category: 'SATA',
    Content() {
      return (
        <>
          <p>SATA is a preferred equity instrument issued by Strive Asset Management. It pays <strong>13% per year</strong> — among the highest yields available in the listed preferred equity space — and is backed by a combination of Bitcoin holdings and a substantial dedicated cash reserve. Understanding how the instrument is structured and what sustains its dividend is essential for evaluating it as an income asset.</p>

          <h2>Who is Strive?</h2>
          <p>Strive Asset Management is a US-based investment firm founded in 2022 with an approach centred on maximizing stockholder returns through direct asset exposure. The firm has positioned itself around Bitcoin as a core long-term asset and manages capital with a focus on clear, outcomes-driven investment. SATA is Strive's preferred equity instrument — a publicly traded security designed to generate high, sustainable cash income for investors seeking monthly (and soon daily) dividends.</p>

          <h2>The SATA structure</h2>
          <p>SATA is publicly traded preferred equity with a <strong>$100 par value</strong>. Its stated annual yield is <strong>13%</strong>, paid monthly as a cash dividend of approximately <strong>$1.083 per share per month</strong>. Strive actively manages the instrument to trade within a $99–$101 range, combining market-making activity with its reserve management policy.</p>
          <p>SATA launched in <strong>November 2025</strong> at an initial rate of 12%. Since then, the rate has increased progressively: 12% → 12.25% (January 2026) → 12.75% (March 2026) → 13% (April 2026). These step-ups reflect Strive's ongoing rate management as the instrument matures and market conditions evolve.</p>

          <h2>What backs the dividend?</h2>
          <p>SATA's ability to sustain its dividend is backed by two distinct assets:</p>
          <ul>
            <li><strong>13,000+ Bitcoin at launch</strong> — Strive holds a significant Bitcoin reserve that forms the long-term strategic backing of the instrument. If Bitcoin appreciates over time, this reserve becomes more valuable, strengthening Strive's overall financial position. Bitcoin's price volatility does not directly change the cash dividend, but it does affect the long-term health of the backing portfolio.</li>
            <li><strong>18+ months of cash reserves</strong> — Strive holds cash equivalent to more than 18 months of dividend payments, held separately from the Bitcoin portfolio. This provides concrete short-to-medium-term security: even in a prolonged period of adverse conditions, Strive can continue paying dividends from cash without needing to liquidate Bitcoin at an unfavourable price.</li>
          </ul>
          <p>This dual-backing structure — Bitcoin for long-term appreciation potential, cash for near-term payment security — is central to SATA's income thesis and differentiates it from many other high-yield preferred instruments.</p>

          <h2>Moving to daily dividends: June 2026</h2>
          <p>From <strong>16 June 2026</strong>, SATA will begin distributing dividends daily — once per NYSE business day. This makes it one of the first listed securities to pay income on a daily basis.</p>
          <p>The total annual income does not change: the 13% yield is unchanged. What changes is the rhythm of payments. Instead of one monthly deposit, investors receive a small payment every NYSE trading day. For investors who reinvest dividends, this marginally improves the compounding rate. For investors taking income as cash, it provides greater payment frequency and flexibility.</p>
          <p>The number of NYSE business days varies by month, so the exact daily payment per share varies slightly from month to month. June 2026 is a partial period (June 16–30), with 10 qualifying business days. You can read more in our article on <a href="/blog/monthly-vs-daily-dividends">monthly versus daily dividends</a>.</p>

          <h2>Effective yield and the par peg</h2>
          <p>Like any publicly traded income instrument, SATA's effective yield depends on the current market price, not just the stated rate. At $100, you earn 13%. If you purchase at $98, your effective yield on that purchase is approximately 13.27%; at $102, approximately 12.75%.</p>
          <p>The <a href="/sata">SATA hub</a> shows live price and effective yield. The <a href="/sata/chart">yield chart</a> tracks effective yield over time, giving context for whether the current price represents a historically attractive or expensive entry point relative to the income on offer.</p>

          <h2>Modelling SATA returns</h2>
          <p>The <a href="/sata/projector">SATA Growth Projector</a> models what a given investment grows to over 1–20 years, with or without dividend reinvestment. From June 2026, the projector accounts for SATA's daily dividend structure, applying a 250-payment-per-year compounding model when reinvestment is enabled. The <a href="/sata/differentiator">Differentiator</a> compares SATA against traditional income benchmarks on yield and projected growth over multiple time horizons.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. SATA is a speculative investment. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'monthly-vs-daily-dividends',
    title: 'Monthly vs Daily Dividends: Does the Frequency Actually Matter?',
    date: '2026-05-20',
    excerpt: 'Most income assets pay dividends quarterly or monthly. SATA is switching to daily payments from June 2026. But does payment frequency actually make a meaningful difference to real-world returns? The answer depends on what you do with the income.',
    readTime: '5 min read',
    category: 'Education',
    Content() {
      return (
        <>
          <p>Most income-focused investors are accustomed to quarterly or monthly dividend payments. SATA is going further — switching to <strong>daily dividend payments</strong> (every NYSE business day) from June 2026, becoming one of the first listed securities to distribute income on a daily basis. But does payment frequency actually change your returns in a meaningful way? The answer depends almost entirely on what you do with the income.</p>

          <h2>If you spend the income: frequency barely matters</h2>
          <p>For investors drawing dividends as cash income to spend, payment frequency has almost no effect on total return. Whether you receive $108 on the first of each month or a few dollars every business day, the total cash you receive over a year is the same. The 13% annual yield is unchanged regardless of how it is sliced across time. Daily payments might offer a minor convenience — income arrives more continuously rather than in one monthly lump — but there is no mathematical return difference for investors who withdraw their dividends.</p>

          <h2>If you reinvest: daily beats monthly</h2>
          <p>This is where frequency starts to matter in a real, quantifiable way. When you reinvest dividends to buy additional shares, those shares immediately begin generating their own dividends. The sooner each payment arrives and is reinvested, the sooner it starts compounding. More frequent payments mean more frequent compounding cycles — and more compounding cycles mean higher total return over time.</p>
          <p>This is the mathematics of compound interest applied to income investing. All else being equal:</p>
          <ul>
            <li>Annual payment (n=1): lowest compounding benefit</li>
            <li>Quarterly payment (n=4): modest improvement</li>
            <li>Monthly payment (n=12): the standard for most preferred equity</li>
            <li>Daily payment (n=250 NYSE business days): maximum compounding within a market-linked instrument</li>
          </ul>

          <h2>The numbers at 13%</h2>
          <p>At SATA's 13% stated annual rate, the difference between monthly and daily compounding is approximately <strong>7.5 basis points</strong> (0.075 percentage points) in annual effective return:</p>
          <ul>
            <li>Monthly reinvestment (n=12): effective APY ≈ <strong>13.80%</strong></li>
            <li>Daily reinvestment (n=250 business days): effective APY ≈ <strong>13.88%</strong></li>
          </ul>
          <p>On a $10,000 investment, that difference is approximately $7.50 per year. On a $100,000 position, it is roughly $75. On a $500,000 position, around $375 per year. The relative impact grows with position size.</p>

          <h2>The long-term compounding effect</h2>
          <p>Because the small annual difference itself compounds over time, the gap between monthly and daily outcomes grows at longer horizons. Over 20 years with full reinvestment, the difference is not transformative — but it is not trivial either. More significantly, daily compounding at any meaningful yield rate dramatically outperforms no reinvestment over longer periods. The frequency debate is somewhat academic compared to the more impactful decision of whether to reinvest at all.</p>
          <p>The <a href="/sata/projector">SATA Growth Projector</a> lets you model this directly. Run the numbers with reinvestment on and off, over different time horizons, to see the compounding effect for your specific investment amount. The difference between reinvesting and not reinvesting a 13% yield over 20 years is far more striking than the difference between monthly and daily compounding.</p>

          <h2>Beyond the maths: why daily dividends matter differently</h2>
          <p>There is a practical dimension to daily income that the pure maths does not capture. For investors who manually reinvest, daily payments create more frequent opportunities to put capital to work at current prices rather than waiting for a monthly lump sum. For investors running income-based strategies who want maximum control over timing, daily income provides greater flexibility.</p>
          <p>There is also a psychological dimension. Watching your portfolio generate income every single NYSE business day creates a different relationship with the investment — a more tangible, continuous sense of income — than waiting for a monthly deposit. Whether that matters to you depends on your investing style.</p>

          <h2>SATA's transition from June 2026</h2>
          <p>SATA's move to daily dividends does not change the total annual yield. The 13% is unchanged. What changes is distribution frequency: one payment per NYSE business day instead of one per month. The monthly total still adds up to approximately 1/12th of the annual yield, distributed across however many business days that month contains. June 2026 is a partial month — qualifying days begin on June 16 — with 10 business days, so the first month's payments reflect this shortened period.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'strc-vs-sata',
    title: 'STRC vs SATA: Comparing Two High-Yield Income Assets',
    date: '2026-05-05',
    excerpt: 'STRC and SATA are both publicly traded preferred equity instruments paying high cash yields. They have real similarities — but differ in yield, structure, backing, and risk profile. Here is a direct comparison to inform your thinking.',
    readTime: '6 min read',
    category: ['STRC', 'SATA'],
    Content() {
      return (
        <>
          <p>STRC and SATA are both publicly traded preferred equity instruments that pay high cash yields to investors on a regular basis. At a surface level they look similar — both trade around $100 par, both come from companies with Bitcoin treasury strategies, and both target income-focused investors. But they differ in meaningful ways: yield, rate structure, backing, income frequency, and risk profile. Here is a direct comparison to help you think through the differences.</p>

          <h2>The headline yield</h2>
          <p>At current rates:</p>
          <ul>
            <li><strong>STRC</strong>: 11.50% annual yield — approximately $0.958 per share per month</li>
            <li><strong>SATA</strong>: 13.00% annual yield — approximately $1.083 per share per month</li>
          </ul>
          <p>SATA's stated yield is 1.5 percentage points higher. On a $50,000 position, that translates to approximately $750 per year in additional income. Over ten years with reinvestment, the compounding difference becomes substantially larger — which is why even small yield differences matter when you are planning an income portfolio for the long term.</p>

          <h2>Who issues each instrument</h2>
          <p><strong>STRC</strong> is issued by <strong>Strategy</strong> (formerly MicroStrategy), led by Michael Saylor. Strategy holds over 800,000 Bitcoin — more than any other publicly traded company — and has built its identity around Bitcoin accumulation as a corporate strategy. STRC is one of several capital-raising instruments Strategy uses to fund continued Bitcoin purchases.</p>
          <p><strong>SATA</strong> is issued by <strong>Strive Asset Management</strong>, a US-based investment firm founded in 2022. Strive held 13,000+ Bitcoin at launch alongside 18+ months of dedicated cash reserves, and has designed SATA specifically as a high-yield income instrument with a conservative reserve policy to support dividend sustainability.</p>

          <h2>Rate mechanism</h2>
          <p>STRC uses a <strong>monthly adjustable rate</strong> designed to keep the instrument trading near its $100 par value. When STRC drifts below par, the rate adjusts upward; when it rises above par, the rate adjusts down. The rate has stepped up progressively since its July 2025 IPO (from 9% to 11.50%).</p>
          <p>SATA does not operate on the same formal monthly adjustment mechanism. Instead, Strive manages the trading range through its reserve policy and market activity. The rate has also increased since SATA's November 2025 IPO: 12% → 12.25% → 12.75% → 13%. Both instruments have demonstrated a pattern of increasing rates as they mature and market conditions evolve.</p>

          <h2>What backs each dividend</h2>
          <p>Both instruments are backed by Bitcoin-connected issuers, but the nature of the backing differs.</p>
          <p>STRC is backed by Strategy's financial resources — including its 800,000+ Bitcoin holdings, business revenues from its software operations, and its ongoing access to capital markets. Strategy is a large, well-established public company with a long track record in the capital markets.</p>
          <p>SATA is backed by Strive's dual-asset structure: 13,000+ Bitcoin at launch for long-term value and <strong>18+ months of dedicated cash reserves</strong> specifically earmarked for dividend payments. This cash reserve provides a tangible, concrete buffer against short-term adversity. For income investors who prioritise near-term dividend security, SATA's explicit reserve policy is a meaningful differentiator.</p>

          <h2>Income frequency</h2>
          <p>Both instruments currently pay <strong>monthly</strong> dividends. From <strong>16 June 2026</strong>, SATA switches to <strong>daily payments</strong> (every NYSE business day) — making it one of the first listed securities to pay income daily. For investors who reinvest dividends, this marginally improves the compounding rate. For those taking income as cash, it primarily changes the payment rhythm without affecting total annual income.</p>
          <p>STRC continues on a monthly payment schedule.</p>

          <h2>Scale and track record</h2>
          <p>Strategy is a significantly larger and more established company than Strive, with a longer Bitcoin acquisition track record and greater access to capital markets. This scale provides certain advantages — more liquidity, more institutional familiarity, a longer operating history as a Bitcoin treasury company.</p>
          <p>SATA is from a newer firm, but Strive's explicit reserve policy and the conservative cash buffer it maintains are designed to compensate for this with greater near-term income security.</p>

          <h2>Risk considerations</h2>
          <p>Both instruments carry risks inherent to preferred equity. Dividends are not legally guaranteed in the way bond interest is, and both issuers are meaningfully exposed to Bitcoin price movements through their respective holdings. A prolonged Bitcoin bear market would put pressure on both issuers' balance sheets, even if their cash reserves remained sufficient to meet near-term dividend obligations.</p>
          <p>Neither instrument should be considered equivalent to investment-grade bonds or conventional preferred stock. Both offer higher yields because they carry genuinely higher risk. The appropriate position size and role in a portfolio depends on your overall income strategy and risk tolerance.</p>

          <h2>Using the Differentiator</h2>
          <p>The <a href="/strc/differentiator">STRC Differentiator</a> and <a href="/sata/differentiator">SATA Differentiator</a> compare each instrument against traditional income benchmarks on effective yield and projected growth over multiple time horizons. They are a useful starting point for understanding how each fits within a broader income portfolio.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'how-to-use-the-growth-projector',
    title: 'How to Use the Growth Projector to Model Your Income Portfolio',
    date: '2026-05-14',
    excerpt: 'The Growth Projector lets you enter an investment amount, set a yield and time horizon, and toggle reinvestment — then shows projected value and total income over time. Here is how to use it effectively and what the numbers actually mean.',
    readTime: '4 min read',
    category: 'Guide',
    Content() {
      return (
        <>
          <p>The Growth Projector is one of the most useful tools on Digital Credit Yield. Enter an investment amount, choose a yield, set a time horizon, and toggle dividend reinvestment — and the projector shows you a chart of projected portfolio value and cumulative income over time. Here is how to use it effectively and what the numbers actually mean.</p>

          <h2>Where to find the projector</h2>
          <p>There are two Growth Projectors — one for each instrument:</p>
          <ul>
            <li><a href="/strc/projector">STRC Growth Projector</a></li>
            <li><a href="/sata/projector">SATA Growth Projector</a></li>
          </ul>
          <p>Both work identically. The projector pre-fills the current live effective yield when it loads, so the default scenario always reflects today's market conditions rather than a static rate. If you return to the page tomorrow, the pre-filled yield may be slightly different as the price moves.</p>

          <h2>The key inputs</h2>
          <p><strong>Investment amount</strong>: the capital you are modelling. This is assumed to be deployed as a lump sum at the start of the projection period. The projector does not model regular additional contributions — it models a single initial investment.</p>
          <p><strong>Yield</strong>: pre-filled with the current live effective yield. You can adjust this manually to test scenarios: what if yield compresses to 10% as the price rises? What if it stays at current levels for five years? Stress-testing the yield assumption is one of the most valuable uses of the projector.</p>
          <p><strong>Time horizon</strong>: 1 to 20 years. Longer horizons make the compounding effect most visible. The difference between reinvesting and not reinvesting becomes dramatic beyond the ten-year mark.</p>
          <p><strong>Reinvestment toggle</strong>: the most impactful single input in the projector. With reinvestment on, dividends buy additional shares each period. With it off, dividends are taken as cash and your share count stays constant.</p>

          <h2>Understanding the output</h2>
          <p>The chart shows <strong>portfolio value over time</strong>. With reinvestment off, the value line stays flat — your share count is constant, so if the price stays near par, so does your portfolio value. Below the chart, the cumulative income figure grows steadily, showing the total cash you have received.</p>
          <p>With reinvestment on, the value line curves upward. As dividends buy more shares and those shares generate more dividends, the growth accelerates over time. This is the visual representation of compound interest at a high yield rate.</p>

          <h2>No reinvestment: modelling an income stream</h2>
          <p>Without reinvestment, you are modelling a simple, predictable income stream. At 11.50% on a $50,000 investment, you receive approximately $5,750 per year. Over ten years, that is $57,500 in total income, with your original $50,000 remaining in shares throughout (assuming the price stays near par). The projector makes it straightforward to assess whether that annual income level meets a specific income target.</p>

          <h2>With reinvestment: compounding in action</h2>
          <p>With reinvestment enabled, each month's dividends purchase additional shares at the current effective yield. Those shares generate their own dividends, which buy more shares, and so on. At 13% with monthly reinvestment, $50,000 grows to approximately $664,000 over 20 years — entirely through dividend reinvestment, assuming yield stays constant. The same $50,000 at 11.50% with reinvestment reaches approximately $493,000 over 20 years.</p>
          <p>The yield assumption has a large impact on long-term outcomes. Running scenarios at the current yield, 2 percentage points below, and 2 percentage points above is a useful way to understand the range of plausible outcomes.</p>

          <h2>What the projector does not model</h2>
          <p>The projector uses a fixed yield for the entire projection period. In reality, yields move as prices change and dividend rates adjust. The model answers "if conditions hold roughly constant, what does this trajectory look like?" — not "what will definitely happen." It is a planning framework, not a forecast.</p>
          <p>It also does not account for tax. Dividend income is typically subject to tax, and your actual net return will depend on your personal tax position. It does not model transaction costs, currency risk, or the impact of price movements on portfolio value beyond the income-driven growth shown in the chart.</p>

          <h2>Saving your settings</h2>
          <p>Your projector inputs are saved automatically in your browser's local storage. When you return to the page, your last scenario is preserved — you do not need to re-enter your numbers each visit. You can use this to keep a specific scenario as your baseline and return to check it against updated live yields over time.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Projections are illustrative and are not a guarantee of future returns. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'dividend-reinvestment-compounding',
    title: 'Reinvesting Dividends: How Compounding Works with STRC and SATA',
    date: '2026-05-16',
    excerpt: 'Taking your monthly dividends as cash is one way to use STRC and SATA. Reinvesting them is another — and over time the difference in outcome is dramatic. Here is how compounding works and how the Growth Projector shows you the numbers for your own scenario.',
    readTime: '6 min read',
    category: 'Education',
    Content() {
      return (
        <>
          <p>STRC and SATA both pay monthly cash dividends — which means every 30 days, investors face a choice: spend the income, hold it as cash, or put it back to work by buying more shares. That third option — reinvestment — is where compounding begins, and over a long enough time horizon the difference between reinvesting and not reinvesting becomes the dominant factor in your total return.</p>

          <h2>What reinvestment actually means</h2>
          <p>When you receive a dividend payment, you have earned income on your original capital. If you take that income as cash and spend it, your share count stays the same and next month's dividend is the same size as this month's. Your income is real and consistent, but it does not grow.</p>
          <p>When you reinvest — using the dividend to purchase additional shares — your share count increases. The following month, you earn dividends on a slightly larger holding. The month after, slightly larger still. Each reinvestment adds a small increment of income-generating capital, and over years those increments accumulate into something significantly larger than the original position.</p>
          <p>This is compounding: earning returns not just on your original capital, but on the returns themselves.</p>

          <h2>The numbers: STRC at 11.50%</h2>
          <p>Take a $10,000 starting investment in STRC at its current 11.50% annual rate. In the first month that pays $95.83 in dividends. What happens to that $10,000 over time depends entirely on what you do with those monthly payments.</p>
          <p><strong>Taking dividends as cash:</strong> your $10,000 of capital stays unchanged and generates $1,150 per year — $23,000 in total income over 20 years. Combined with your original capital, your total position value after 20 years is $33,000.</p>
          <p><strong>Reinvesting every dividend monthly:</strong> your capital base grows each month as dividends are folded back in. After one year you hold the equivalent of $11,213. After five years $17,723. After ten years $31,409. After 20 years your position has grown to approximately <strong>$98,600</strong> — almost three times what the cash-out approach delivers, from the same $10,000 starting point.</p>

          <h2>The numbers: SATA at 13%</h2>
          <p>At SATA's current 13% rate the starting monthly dividend on $10,000 is $108.33. The compounding effect over time is even more pronounced at the higher rate.</p>
          <p><strong>Taking dividends as cash:</strong> $1,300 per year, $26,000 in total income over 20 years, position value of $36,000 at the end.</p>
          <p><strong>Reinvesting every dividend monthly:</strong> after one year $11,380. After five years $19,089. After ten years $36,437. After 20 years approximately <strong>$132,800</strong> — more than 3.5 times the cash-out total, from the same opening investment.</p>

          <CompoundingChart />

          <h2>What compounding does to monthly income</h2>
          <p>One way to understand the power of reinvestment is to look not at the total pot value but at the monthly income it eventually generates. If you begin with $10,000 in STRC and take every dividend as cash, your monthly income is $95.83 today and $95.83 in 20 years — it never moves. If instead you reinvest for 20 years, your grown position of ~$98,600 would then generate approximately <strong>$945 per month</strong> at the same 11.50% rate — nearly ten times the income of someone who started with the same capital but took cash throughout.</p>
          <p>For SATA, the same logic applies. A $10,000 cash-out investor earns $108 per month indefinitely. A $10,000 reinvestor after 20 years holds ~$132,800, generating approximately <strong>$1,438 per month</strong> at 13% — more than thirteen times the original monthly income from an unchanged cash position.</p>
          <p>This is why reinvestment is often described as a long-term strategy rather than an income strategy: in the early years the incremental gains are small. In the later years they are transformative.</p>

          <h2>Monthly payments are a compounding advantage</h2>
          <p>Both STRC and SATA pay monthly rather than quarterly. This matters more than it might seem. Each monthly payment is an opportunity to reinvest 30 days earlier than a quarterly instrument would allow. Over years, that accelerated reinvestment cadence means more compounding periods, and each period adds to the base for the next. An instrument that pays quarterly and then weekly would show the same effect — more frequent payments mean more compounding cycles per year. Monthly preferred equity instruments sit at a practical sweet spot for income investors who want to put dividends back to work quickly.</p>

          <h2>Using the Growth Projector</h2>
          <p>The <a href="/strc/projector">STRC Growth Projector</a> and <a href="/sata/projector">SATA Growth Projector</a> on this site are built specifically to model this. Enter your investment amount and time horizon and the tool shows you the projected income and compounded growth side by side — so you can see both what the cash-out income stream looks like and what the reinvestment scenario delivers over the same period.</p>
          <p>The projector supports time horizons from one year out to 20 years, and uses live yield data where available to keep the projection grounded in current rates. It is the fastest way to run your own scenario with your own numbers rather than relying on a generic example.</p>

          <h2>One important caveat</h2>
          <p>The figures in this article assume a constant dividend rate throughout the period — 11.50% for STRC and 13% for SATA held steady for 20 years. In reality, both rates adjust over time. STRC's rate resets monthly; SATA's rate has also moved since launch. The projector makes the same simplifying assumption and displays a clear disclaimer to that effect. These are illustrative projections to demonstrate the mechanics of compounding, not guaranteed outcomes. Actual returns will differ depending on how rates move, what price you pay per share, and whether you reinvest at par or at the prevailing market price each month.</p>
          <p>The core principle — that reinvestment compounds your income base over time and that monthly payments accelerate that compounding — holds regardless of the exact rate assumptions.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. All projections are hypothetical illustrations assuming a constant dividend yield. They do not account for price fluctuation, reinvestment risk, tax, or changes in the dividend rate. Past performance is not indicative of future results. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'strategy-capital-structure',
    title: "Strategy's Capital Structure: From Senior Debt to Common Stock — and Where STRC Fits",
    date: '2026-06-03',
    excerpt: "Strategy has built a multi-layered financing stack to fund its Bitcoin acquisition model. Understanding where STRC sits — second only to STRF within the preferred tier, above $6.7B of debt, and well above common equity — is fundamental to assessing the investment.",
    readTime: '8 min read',
    category: 'STRC',
    Content() {
      return (
        <>
          <p>Strategy — the company behind STRC — has one of the most complex capital structures of any publicly traded company. It operates not just as a software business but as a leveraged Bitcoin acquisition engine, and it has built a multi-layered financing stack to fund that strategy. Understanding where STRC sits within that stack helps clarify both the instrument's risk profile and why its yield is set at the level it is.</p>

          <h2>What is a capital structure?</h2>
          <p>Every company that raises money creates a hierarchy of claims on its assets and income. At the top sit creditors — who have legally enforceable claims and must be paid first. At the bottom sit common stockholders — who absorb losses first and are paid last. In between, depending on how a company has financed itself, there may be multiple layers of debt and equity at different levels of priority.</p>
          <p>This ordering matters enormously in stress scenarios. If a company encounters financial difficulty, assets are distributed from the top of the stack downward. Those at the bottom receive what is left, if anything. Understanding where an investment sits in this hierarchy is fundamental to assessing its risk.</p>

          <h2>Layer 1 — The debt: convertible senior notes</h2>
          <p>At the top of Strategy's capital stack sits its debt. As of May 2026, Strategy carries approximately $6.7 billion in convertible senior notes — bonds issued to institutional investors across multiple tranches and maturities. Several tranches carry 0% interest, with investor returns coming instead from a conversion feature: the right to convert the bond into MSTR common stock at a pre-set price.</p>
          <p>These notes sit at the very top of the distribution order. Interest payments are processed before any dividend is paid to preferred or common stockholders. In a liquidation scenario, bondholders would have first claim on Strategy's assets — including its 843,000+ Bitcoin — ahead of every equity holder in the stack.</p>
          <p>The low-interest convertible structure is deliberate. Strategy raises cheap capital to accumulate Bitcoin, betting that Bitcoin's appreciation will more than offset any dilution from eventual bond conversions. This high-conviction approach shapes everything below it in the stack.</p>

          <h2>Layer 2 — The preferred equity tier: five series</h2>
          <p>Below the convertible notes, and above MSTR common stock, sits Strategy's preferred equity tier. As of 2026 Strategy has issued five separate preferred stock series totalling approximately $15.5 billion in notional value. Each pays dividends and each ranks ahead of common stockholders in both dividend priority and liquidation preference — but they are not all equal to one another. Within the preferred tier, seniority varies from series to series.</p>

          <p><strong>STRF — most senior preferred (10% fixed, quarterly)</strong><br />STRF sits at the very top of the preferred hierarchy, making it the most protected of the five series. It pays a fixed 10% annual dividend in quarterly cash payments of $2.50 per share. As the most senior preferred, STRF holders have priority over all other preferred stockholders if Strategy were to reduce or suspend dividends, and they rank ahead of the other four series in a liquidation.</p>

          <p><strong>STRC — second most senior preferred (currently 11.50%, monthly)</strong><br />STRC is the preferred stock tracked on this site and the second most senior in Strategy's preferred hierarchy — only STRF ranks above it. It launched in July 2025 at a 9% annual dividend rate and has stepped up monthly since, reaching 11.50% — equivalent to $0.958 per share each month. Its rate adjusts monthly to keep its market price close to its $100 par value: if the price drifts below par, the rate rises to attract buyers; if it drifts above, the rate falls. Dividends are paid monthly in cash, with no conversion feature and no fixed maturity date. Its position as the second most senior preferred, combined with monthly income and an adjustable rate mechanism, has made STRC the dominant instrument in Strategy's preferred lineup.</p>

          <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', margin: '1.5rem 0' }}>
            <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-primary)' }}>"STRC Stock ranks senior to dividend junior stock (which includes class A common stock, class B common stock, STRE Stock, STRK Stock, and STRD Stock) with respect to the payment of dividends and with respect to the distribution of assets upon liquidation. However, the company's indebtedness and STRF Stock rank senior to the STRC Stock."</p>
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.85em', color: 'var(--text-muted)' }}>— Strategy Inc, Form 424B5 Prospectus Supplement, SEC EDGAR</p>
          </div>

          <p><strong>STRE — euro-denominated preferred (10% fixed, quarterly)</strong><br />STRE is Strategy's only non-dollar preferred stock — it is denominated in euros, with a stated value of €100 per share. It was designed specifically to access European capital markets, listing on the Euro MTF market of the Luxembourg Stock Exchange rather than Nasdaq. Its 10% annual dividend is paid quarterly in euros, and the offering raised €620 million — upsized from an initial target of €350 million due to strong institutional demand. STRE is available only to professional and institutional investors within the European Economic Area; it is not available to retail investors in the Euro area or the UK. Within the capital stack, STRE sits below STRC but above STRK and STRD.</p>

          <p><strong>STRK — convertible preferred</strong><br />STRK is the only convertible preferred in Strategy's lineup, sitting below STRE in the hierarchy. Each STRK share can be converted into 0.1 shares of MSTR common stock, giving holders some upside participation in Strategy's Bitcoin-driven equity performance alongside the income stream. This conversion feature makes STRK different in character from the other series — it blends fixed income with equity optionality, at the cost of sitting lower in the preferred stack.</p>

          <p><strong>STRD — most junior preferred (8% stated rate)</strong><br />STRD sits at the bottom of the preferred tier, just above MSTR common stock. It carries an 8% stated dividend rate — the lowest of the five series — which reflects its position as the most junior preferred. Because it is last to receive distributions within the preferred tier, investors require additional yield compensation. STRD often trades below its $100 par value, pushing its effective yield well above its stated 8% rate.</p>

          <h2>Layer 3 — MSTR common stock: the bottom</h2>
          <p>At the very bottom of Strategy's capital structure sits MSTR — the common stock. Common stockholders absorb losses first and are paid last. They have no priority claim on dividends or assets; if Strategy faces financial difficulty, common holders receive only what remains after every creditor and every preferred stockholder has been satisfied.</p>
          <p>What common stockholders do have is uncapped upside. If Strategy's Bitcoin holdings appreciate dramatically and all senior obligations are met, the residual value flows to MSTR holders. This is the fundamental tradeoff in capital structure design: MSTR carries the most risk and the most potential reward; STRC investors sit well above common equity — with a contractual income stream and a stable $100 par reference — but give up that open-ended upside in exchange.</p>

          <h2>The full picture: Strategy's stack at a glance</h2>
          <StrategyCapitalStack />
          <p>From top to bottom, Strategy's capital structure looks like this:</p>
          <ol>
            <li><strong>Convertible Senior Notes</strong> — ~$6.7B in debt; paid first in all scenarios</li>
            <li><strong>STRF</strong> — most senior preferred; 10% fixed rate; quarterly USD payments</li>
            <li><strong>STRC</strong> — second most senior preferred; 11.50% adjustable rate; monthly USD payments</li>
            <li><strong>STRE</strong> — euro-denominated preferred; 10% fixed rate; quarterly EUR payments; EEA professional investors only</li>
            <li><strong>STRK</strong> — convertible preferred; equity upside via MSTR conversion</li>
            <li><strong>STRD</strong> — most junior preferred; 8% stated rate; just above common equity</li>
            <li><strong>MSTR common stock</strong> — absorbs losses first; uncapped upside</li>
          </ol>

          <h2>Why STRC has become the dominant preferred series</h2>
          <p>Of the five preferred series in Strategy's lineup, STRC has grown into the standout instrument by almost every measure. As of mid-2026 it has scaled to a $6.4 billion market cap, with Strategy raising $5.6 billion in STRC proceeds in the first half of 2026 alone. Daily trading volume regularly exceeds $375 million — making it one of the most liquid preferred equity instruments in the US market — while its 30-day historical volatility has fallen to just 1.7%, unusually low for any instrument with Bitcoin exposure.</p>
          <p>Several structural features explain why STRC has attracted this level of capital and attention:</p>
          <ul>
            <li><strong>High seniority with a premium yield</strong> — STRC is the second most senior preferred in the stack, ranked immediately below STRF, yet it yields significantly more. Investors get near-top-tier protection with a rate that has climbed to 11.50%, outpacing every other series on a current income basis.</li>
            <li><strong>Monthly payments</strong> — All other Strategy preferred series pay quarterly. STRC pays every month, which is attractive to income investors who want regular, predictable cash flow rather than waiting 90 days between distributions.</li>
            <li><strong>Adjustable rate mechanism</strong> — The monthly rate reset is designed to keep STRC trading near its $100 par value. This built-in stability mechanism has succeeded in keeping price volatility unusually low and makes STRC behave more like a cash instrument than a typical preferred stock.</li>
            <li><strong>$2.25 billion USD reserve</strong> — Strategy has set aside $2.25 billion in cash reserves specifically to cover dividend and interest obligations, providing approximately 2.5 years of coverage. STRC investors have a concrete, quantified liquidity buffer standing between them and any dividend disruption.</li>
            <li><strong>$413 million distributed to date</strong> — As cumulative distributions have grown, STRC has demonstrated a consistent payment track record since its July 2025 launch, building investor confidence in its income reliability.</li>
          </ul>
          <p>The result is that STRC has established itself not just as the largest of Strategy's preferred series, but as the benchmark for the emerging digital credit asset class. Its combination of structural seniority, monthly income, price stability, and deep liquidity has made it the preferred choice for institutional and retail income investors seeking Bitcoin-adjacent yield.</p>

          <h2>What this means for STRC investors</h2>
          <p>STRC's position in the stack has direct implications for how to think about the investment:</p>
          <ul>
            <li><strong>Second most senior preferred</strong> — Only STRF ranks above STRC within the preferred tier. Four of the five series — including the convertible STRK and the most junior STRD — sit below it. This is a meaningfully protected position within what is a complex and well-capitalised preferred structure.</li>
            <li><strong>Senior to common stock</strong> — STRC dividends must be addressed before MSTR common stockholders receive anything. This provides meaningful income protection relative to holding MSTR directly.</li>
            <li><strong>Junior to all debt</strong> — Strategy's $6.7 billion in convertible notes ranks ahead of STRC in every scenario. If Strategy faced severe financial stress, debt obligations would be serviced before any preferred dividend is paid.</li>
            <li><strong>Bitcoin is the underlying reality</strong> — Across the entire stack, Strategy's ability to service its obligations depends on its 843,000+ Bitcoin treasury. A sustained decline in Bitcoin prices would place increasing pressure on the stack from the bottom up, beginning with MSTR common stock and working toward the preferred tier over time.</li>
          </ul>

          <h2>Why the yield premium makes sense</h2>
          <p>STRC's 11.50% adjustable yield is meaningfully higher than conventional preferred stock, which typically yields 5–7%. That premium exists because of the structure described above. Investors are compensated for accepting exposure to Bitcoin's price trajectory through Strategy's balance sheet, sitting below $6.7 billion of senior debt, and holding a perpetual instrument with no guaranteed return of principal. That said, within the preferred tier itself STRC occupies a strong position — second only to STRF — and its deep liquidity, monthly payments, and $2.25 billion reserve buffer make it the most developed and investor-friendly of the five series. The yield is not a sign of distress; it reflects a deliberate and transparent risk profile that differs from conventional preferred equity. Understanding the capital stack is the foundation for deciding whether that tradeoff suits your income objectives.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Capital structure details are based on publicly available information as of June 2026 and are subject to change. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'strive-capital-structure',
    title: "Strive's Capital Structure: Why Being Debt-Free Changes Everything for SATA Investors",
    date: '2026-06-03',
    excerpt: "Strive has deliberately built one of the simplest capital structures of any publicly traded Bitcoin treasury company — no debt, one preferred series, and common stock. For SATA holders, that means something significant: SATA currently sits at the very top of the equity stack.",
    readTime: '7 min read',
    category: 'SATA',
    Content() {
      return (
        <>
          <p>Strive — the company behind SATA — has taken a fundamentally different approach to financing its Bitcoin treasury than most of its peers. While companies like Strategy have built complex, multi-layered capital structures with billions in convertible debt sitting above their preferred stockholders, Strive has deliberately kept its structure simple: no debt, one preferred stock series, and common stock. For SATA investors, understanding this structure reveals a meaningful structural advantage that is easy to overlook when comparing headline yields.</p>

          <h2>What is a capital structure?</h2>
          <p>Every company that raises money creates a hierarchy of claims on its assets and income. At the top sit creditors — who have legally enforceable claims and must be paid first. At the bottom sit common stockholders — who absorb losses first and are paid last. Preferred stockholders sit between the two: senior to common equity, but typically junior to any debt the company has issued.</p>
          <p>The position of a preferred stock within that hierarchy is not just a technical detail — it has direct implications for how safe the income stream is in a stress scenario. The fewer senior claims sitting above a preferred stock, the stronger its position in the stack.</p>

          <h2>Strive's structure: three layers, no debt</h2>
          <p>Strive's capital structure is deliberately lean. As of June 2026, it consists of just two classes of security above zero debt:</p>
          <ol>
            <li><strong>SATA preferred stock</strong> — Variable Rate Series A Perpetual Preferred Stock; the senior equity security</li>
            <li><strong>ASST common stock</strong> — absorbs losses first; paid last; uncapped upside</li>
          </ol>
          <p>That is the entire stack. There are no convertible notes, no senior secured loans, no bond tranches. Strive retired the last of its inherited debt — $120 million in legacy convertible notes assumed from its acquisition of Semler Scientific — and has committed to maintaining a debt-free balance sheet. It intends to fund all future Bitcoin accumulation exclusively through preferred equity issuance and common stock, not borrowing.</p>

          <h2>SATA: currently the most senior security in the stack</h2>
          <p>Because Strive carries no debt, SATA currently sits at the very top of the company's capital structure. There is no layer of creditors above SATA holders — no bondholders with a prior claim on Strive's Bitcoin treasury, no interest payments that must be serviced before dividends can be paid. In a company with no debt, the preferred stockholder is first in line.</p>
          <p>This is a structurally different position from preferred stocks issued by leveraged companies. At Strategy, for example, STRC holders sit below $6.7 billion in convertible notes — meaning those bondholders have first claim on Strategy's assets in any liquidation scenario. SATA holders face no equivalent senior creditor.</p>
          <p>Strive's own prospectus is explicit about this structure. The exact wording from the Form 424B5 filing on SEC EDGAR states:</p>

          <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', margin: '1.5rem 0' }}>
            <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-primary)' }}>"The SATA Stock ranks senior to Strive's Class A common stock and Class B common stock with respect to the payment of dividends and the distribution of assets upon Strive's liquidation, dissolution or winding up. However, the SATA Stock is junior to Strive's existing and future indebtedness and structurally junior to the liabilities of Strive's subsidiaries."</p>
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.85em', color: 'var(--text-muted)' }}>— Strive Inc, Form 424B5 Prospectus Supplement, SEC EDGAR</p>
          </div>

          <p>The critical phrase here is <strong>"existing and future indebtedness."</strong> Because Strive currently has zero existing indebtedness, SATA's subordination to debt is a theoretical risk rather than a present reality. Should Strive choose to take on debt in the future, that debt would rank above SATA — which is why the company's stated commitment to remaining debt-free is directly relevant to every SATA investor.</p>

          <h2>The Bitcoin treasury backing SATA</h2>
          <p>Sitting behind SATA's income stream is Strive's Bitcoin treasury, which has grown rapidly since the company's public listing. As of June 2026, Strive holds 19,000 BTC — acquired at an average cost that has delivered a year-to-date BTC yield of 36.7%. The total Bitcoin position is valued at approximately $1.35 billion at current prices.</p>
          <p>Alongside its Bitcoin holdings, Strive maintains a dedicated cash reserve specifically sized to cover dividend obligations. As of June 2026 that reserve stands at approximately $137 million — calibrated to provide 18 months of SATA dividend coverage without needing to liquidate any Bitcoin. This cash buffer means SATA dividends are not directly dependent on Bitcoin prices in the short to medium term: even in a sustained Bitcoin downturn, Strive has pre-funded the income stream from cash.</p>

          <h2>The full picture: Strive's stack at a glance</h2>
          <StriveCapitalStack />
          <p>From top to bottom, Strive's capital structure looks like this:</p>
          <ol>
            <li><strong>No debt</strong> — zero existing indebtedness; all legacy debt retired as of Q1 2026</li>
            <li><strong>SATA preferred stock</strong> — 13% variable rate; monthly cash dividends; $100 par value; the most senior security currently outstanding</li>
            <li><strong>ASST common stock</strong> — absorbs losses first; uncapped upside from Bitcoin appreciation</li>
          </ol>
          <p>Compare this to Strategy's seven-layer stack — with $6.7 billion in convertible notes at the top, five preferred series stacked in seniority order beneath them, and MSTR common stock at the bottom. Strive's structure requires no such hierarchy because it has chosen preferred equity over debt as its primary financing tool.</p>

          <h2>What this means for SATA investors</h2>
          <ul>
            <li><strong>No senior creditors</strong> — with zero debt on the balance sheet, there are currently no bondholders or lenders with a prior claim on Strive's assets ahead of SATA. In a liquidation scenario today, SATA holders would be first in line among equity holders.</li>
            <li><strong>The debt-free commitment matters</strong> — Strive has explicitly stated its intention to finance Bitcoin accumulation through preferred equity, not borrowing. If that commitment holds, SATA's top-of-stack position is preserved. Investors should monitor whether this policy remains in place as the company scales.</li>
            <li><strong>18-month cash reserve</strong> — the dedicated dividend reserve provides a concrete, quantified buffer between SATA income and any short-term Bitcoin price pressure. Dividends draw from cash, not from Bitcoin sales.</li>
            <li><strong>Single preferred series</strong> — with only one preferred series outstanding, there is no complexity about relative seniority between preferred classes. Every SATA share holds the same position in the same single tier of preferred equity.</li>
            <li><strong>Bitcoin is the long-term asset</strong> — Strive's 19,000 BTC treasury is the engine of long-term value creation. A sustained Bitcoin decline would reduce the backing behind the common equity and, over time, could constrain Strive's ability to continue raising capital through SATA issuance. The cash reserve addresses the short term; the Bitcoin price determines the long-term financial health of the issuer.</li>
          </ul>

          <h2>Why the yield makes sense in this structure</h2>
          <p>SATA's 13% variable rate is the highest of any Bitcoin-backed preferred equity instrument currently trading. Investors receive that premium because of Strive's genuine risk profile: a smaller, faster-growing company than Strategy with a more concentrated Bitcoin position, a shorter track record, and a stock that reflects the early-stage nature of its Bitcoin accumulation programme. The yield compensates for these risks — not for structural subordination to senior debt, because there is none.</p>
          <p>In that sense SATA offers an unusual combination: a high headline yield from an issuer with no creditor claims sitting above the preferred stock. The risk is not the capital structure — it is the size and stage of the business, and its dependence on Bitcoin's long-term performance. Understanding Strive's simple, debt-free stack is the starting point for deciding whether that tradeoff suits your income objectives.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Capital structure details are based on publicly available information as of June 2026 and are subject to change. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'strc-vwap-dividend-mechanism',
    title: "How STRC's Dividend Rate Is Set: The VWAP Mechanism Explained",
    date: '2026-06-04',
    excerpt: "STRC has raised its rate seven times since IPO — from 9% to 11.50%. That progression follows a formal SEC-filed framework tied to a five-day VWAP window. Here is exactly how the mechanism works, how it evolved, and what the contractual limits actually say.",
    readTime: '7 min read',
    category: 'STRC',
    Content() {
      return (
        <>
          <p>STRC has raised its dividend rate seven times since its July 2025 IPO — from 9% to 11.50%. That progression was not random. It was driven by a formal framework that Strategy published in SEC filings, tying the monthly rate recommendation to STRC's five-day volume-weighted average price relative to its $100 par value. Understanding exactly how this mechanism works — and how it evolved through successive filings — is important for any investor holding or evaluating STRC.</p>

          <h2>What the IPO prospectus actually said</h2>
          <p>When STRC launched in July 2025, Strategy's 424B5 prospectus described the rate adjustment mechanism only in general terms. The company stated its intention to recommend dividend increases when STRC traded below par and decreases when it traded above par, with the goal of keeping the instrument near its $100 stated value. No formal thresholds or step sizes were published at IPO — the original prospectus described a discretionary policy, not a rules-based framework.</p>
          <p>One further detail worth noting: while STRC carries a $100 par value, the IPO issue price was $90.00 per share. That meant investors purchasing at IPO received an effective yield of approximately 10% on their cost basis, even though the stated rate was 9% of par. With the instrument trading 10% below par from day one, the adjustable-rate mechanism was always going to face early pressure to move upward.</p>
          <p>The formal framework that would govern all subsequent rate changes was introduced two months after launch.</p>

          <h2>The August 2025 8-K: a formal framework is introduced</h2>
          <p>On August 28, 2025, Strategy filed an 8-K with the SEC that formally introduced a tiered VWAP-based dividend adjustment framework. This is the filing that first specified the exact price bands and basis point movements that now govern STRC's monthly rate recommendations. The measurement uses a five-day VWAP window — specifically, the five trading days prior to the last trading day of each month — and maps the result to a management recommendation for the following month's rate:</p>

          <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--accent-gold)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--accent-gold)' }}>5-Day VWAP</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--accent-gold)' }}>Management Recommendation</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>Below $95.00</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#22c55e' }}>Increase rate by <strong>+50 bps or more</strong></td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>$95.00 – $98.99</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#86efac' }}>Increase rate by <strong>+25 bps or more</strong></td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>$99.00 – $100.99</td>
                  <td style={{ padding: '0.75rem 1rem' }}>No change; discretionary ±25 bps possible</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 1rem' }}>$101.00 and above</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#ef4444' }}>Decrease rate by <strong>–25 bps or more</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>A common approximation in circulation is that "STRC below $98 triggers a 0.50% rate increase." The actual framework is more nuanced. The $95–$98.99 band triggers only a 25 bps (+0.25%) increase. A 50 bps increase requires the price to fall below $95. Both figures are stated minimums — "or more" — meaning the board can recommend a larger adjustment at its discretion for either band. The September 2025 jump from 9% to 10% (100 bps in a single month) is an example of that discretionary power being exercised.</p>

          <h2>The February 2026 8-K: the framework is reaffirmed</h2>
          <p>On February 5, 2026, Strategy filed a second 8-K re-publishing the same four-band framework as a formal update to the dividend adjustment policy. The thresholds and basis point increments are identical to the August 2025 filing — this is a reaffirmation rather than a change to the terms. Reviewing both filings confirms that the rules governing all rate decisions from September 2025 onward have remained unchanged. The framework that was introduced eight months ago is the same one in effect today.</p>

          <h2>Contractual floors: what the Certificate of Designations requires</h2>
          <p>The VWAP framework represents management's stated intention, not a hard contractual obligation — Strategy has disclosed it can be changed or suspended at any time at the board's sole discretion. However, the Certificate of Designations — the binding legal document that governs STRC's terms — imposes hard contractual limits on how the rate can be reduced:</p>
          <ul>
            <li>Strategy <strong>cannot reduce</strong> the monthly rate by more than 25 basis points per period, plus any excess of the prior month's one-month term SOFR rate over the minimum SOFR during that period.</li>
            <li>Strategy <strong>cannot reduce</strong> the rate below the prevailing one-month term SOFR rate — giving STRC a floating rate floor that tracks short-term interest rates.</li>
            <li>Strategy is <strong>not entitled to reduce</strong> the rate at all unless all previously accrued and unpaid dividends have been settled in full.</li>
          </ul>
          <p>These provisions create an asymmetric ratchet effect: there is no contractual ceiling on rate increases — Strategy can raise the rate by any amount at any time — but rate reductions are structurally constrained to small increments (25 bps at a time), cannot cut below SOFR, and require a clean payment record. A halving of the rate would take many months under this framework. That slow-ratchet constraint is meaningful protection for investors focused on income predictability.</p>

          <h2>The complete rate history</h2>
          <p>Seven consecutive monthly increases from September 2025 through March 2026 reflect STRC trading persistently below par during that period, as Bitcoin prices fell and the instrument struggled to attract buyers above $95–$99:</p>
          <ul>
            <li>August 2025: <strong>9.00%</strong> — first dividend payment at IPO rate ($0.750/share)</li>
            <li>September 2025: <strong>10.00%</strong> — +100 bps; discretionary jump reflecting deep below-par trading ($0.833/share)</li>
            <li>October 2025: <strong>10.25%</strong> — +25 bps ($0.854/share)</li>
            <li>November 2025: <strong>10.50%</strong> — +25 bps ($0.875/share)</li>
            <li>December 2025: <strong>10.75%</strong> — +25 bps ($0.896/share)</li>
            <li>January 2026: <strong>11.00%</strong> — +25 bps ($0.917/share)</li>
            <li>February 2026: <strong>11.25%</strong> — +25 bps ($0.938/share)</li>
            <li>March 2026: <strong>11.50%</strong> — +25 bps ($0.958/share)</li>
            <li>April 2026 onward: <strong>11.50%</strong> — stable; VWAP consistently in the $99–$101 neutral zone</li>
          </ul>
          <p>The September jump — 100 bps in a single month — was more than double the standard 50 bps minimum for sub-$95 trading. It reflects board discretion being used aggressively to stabilise a newly launched instrument that had opened significantly below its $100 par value.</p>

          <h2>Why the rate has held at 11.50% since March 2026</h2>
          <p>STRC's rate has been unchanged for four consecutive months. Under the VWAP framework this signals one thing clearly: the five-day VWAP at the end of each measurement window has been landing in the $99–$101 neutral zone. The successive rate increases attracted buyers, pulled the price back toward $100, and the framework automatically signalled no further change was needed once stability was achieved. In this sense the mechanism has worked exactly as designed — a self-correcting loop that uses the income rate to manage price proximity to par.</p>

          <h2>A proposed change: semi-monthly dividend payments</h2>
          <p>Strategy has proposed switching STRC from monthly to semi-monthly dividend payments. A shareholder vote on the proposal was scheduled for June 8, 2026, but the outcome has not yet been officially confirmed. If approved, investors would receive two payments per month rather than one. The annual yield rate would be unchanged — only payment frequency would increase. For investors who reinvest, more frequent payments offer a marginal compounding advantage; for those taking income as cash, the total annual amount received would be identical.</p>

          <h2>Reading the SEC filings yourself</h2>
          <p>All documents referenced in this article are publicly available on the SEC's EDGAR system. The three most important filings for understanding STRC's rate mechanism are the original 424B5 prospectus supplement (July 2025, which contains the Certificate of Designations and its contractual rate-reduction limits), the 8-K filed August 28, 2025 (which introduced the formal four-band VWAP framework for the first time), and the 8-K filed February 5, 2026 (which reaffirmed the same framework).</p>
          <p>Strategy's complete EDGAR filing history can be accessed at <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001050446&type=&dateb=&owner=include&count=40" target="_blank" rel="noopener noreferrer">SEC EDGAR — Strategy Inc (CIK 0001050446)</a>. Filtering by form type 8-K will surface both framework filings; filtering by 424B5 will surface the original prospectus and any follow-on offering supplements.</p>

          <p>SATA — the preferred stock issued by Strive — uses a different approach to setting its rate: a wholly discretionary board decision with no published price bands and no mandatory step sizes. For a direct comparison of the two mechanisms, see <a href="/blog/sata-dividend-rate-mechanism">How SATA's Dividend Rate Is Set — And Why It Differs from STRC</a>.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Rate framework details are based on publicly available SEC filings as of June 2026. The dividend adjustment framework is management's stated intention and may be changed or suspended at any time. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'sata-dividend-rate-mechanism',
    title: "How SATA's Dividend Rate Is Set — And Why It Differs from STRC",
    date: '2026-06-04',
    excerpt: "Both SATA and STRC adjust their dividend rates monthly to keep their price near $100 par. But the mechanisms behind those decisions are fundamentally different — one is rules-based with published bands, the other is entirely discretionary. Here is exactly how SATA's rate is governed and what the SEC filings actually say.",
    readTime: '8 min read',
    category: 'SATA',
    Content() {
      return (
        <>
          <p>SATA and STRC are both monthly-adjustable preferred equity instruments with a shared goal: keep their trading price close to $100 par by moving the dividend rate in response to market conditions. In practice, however, the mechanisms behind those adjustments are fundamentally different. STRC operates under a formal, published VWAP framework that specifies mandatory minimum step sizes at each price band. SATA operates entirely at the board's discretion, with no equivalent published table and no mandatory step sizes for increases. Both instruments are governed by similar contractual floors in their respective Certificates of Designation — but the day-to-day rate-setting philosophy is distinct in ways that matter for investors.</p>

          <h2>SATA's rate mechanism: purely discretionary</h2>
          <p>The language in Strive's November 2025 424B5 prospectus is explicit about the nature of SATA's rate-setting authority. The governing text states that Strive has "the right, in our sole and absolute discretion, to adjust the monthly regular dividend rate per annum" — and goes further to note that Strive "may, at any time in their sole and absolute discretion, and without the consent of any preferred stockholder, choose to reduce the monthly regular dividend rate per annum to the maximum extent permitted by the terms of the SATA Stock, without regard to the impact that reduction may have on the trading price or value of the SATA Stock."</p>
          <p>That is unusually candid language. Strive is not committing to maintain the rate, not promising to follow any published schedule, and not binding itself to any automatic triggers. Each monthly rate decision is a fresh board determination, constrained only by the contractual limits embedded in the Certificate of Designation.</p>

          <h2>The stated management intention</h2>
          <p>While there is no formal algorithmic framework, Strive has disclosed its general management intention. The prospectus states that Strive's "current intention, which is subject to change in its sole and absolute discretion, is to adjust the monthly regular dividend rate per annum in such manner as Strive believes will maintain SATA Stock's trading price" within a target range. The target range has itself changed since launch:</p>
          <ul>
            <li><strong>At IPO (November 2025):</strong> the stated target range was <strong>$95–$105 per share</strong> — a wide, $10 band around par</li>
            <li><strong>March 2026 onward:</strong> Strive narrowed the target to <strong>$99–$101 per share</strong> — a tighter $2 band, consistent with STRC's operating range</li>
          </ul>
          <p>The tightening of the range in March 2026 accompanied a separate announcement that Strive would not issue new SATA shares below $100 through its ATM program. Together, these moves signal a more precise price-management posture as the instrument matured — but neither represents a binding contractual commitment or a published algorithmic rule of the kind STRC operates under.</p>

          <h2>No VWAP bands: how SATA's measurement differs</h2>
          <p>STRC uses a specific five-day VWAP window — the five trading days prior to the last trading day of the month — to calculate the price measurement that feeds its four-band framework. The result maps directly to a mandatory minimum adjustment: below $95 means at least +50 bps; $95–$98.99 means at least +25 bps; and so on.</p>
          <p>SATA uses no equivalent VWAP calculation. Its Certificate of Designation specifies a <strong>twenty-consecutive-trading-day arithmetic average of last reported sale prices</strong>, but this measurement serves a different purpose: it is used as an eligibility trigger to determine whether rate reductions are permissible before the three-month post-IPO lock-up period expires. It is not used to mandate rate increases, and there is no table mapping price levels to required rate changes.</p>
          <p>In practice, Strive sets the rate by board declaration each period. The measurement window that matters most for reduction eligibility is the <strong>full prior regular dividend period</strong> — if the average sale price during that entire month was below $99, Strive cannot reduce the rate regardless of anything else.</p>

          <h2>Contractual limits: where SATA and STRC converge</h2>
          <p>Despite the different rate-setting philosophies, the contractual protections in SATA's Certificate of Designation closely mirror those in STRC's. Three conditions must all be satisfied before Strive can reduce SATA's rate:</p>
          <ul>
            <li>Either <strong>three months have elapsed</strong> since the November 2025 issue date, or the 20-day arithmetic average of sale prices has exceeded <strong>$100</strong> during the post-issue period — whichever comes first</li>
            <li>All <strong>accumulated dividends</strong> for prior completed periods have been paid in full</li>
            <li>The arithmetic average of sale prices during the <strong>immediately preceding full dividend period</strong> was not below <strong>$99 per share</strong></li>
          </ul>
          <p>Even when all three conditions are met, the size of any reduction is capped. The maximum permissible reduction per period is <strong>25 basis points</strong>, plus any excess of the prior period's one-month term SOFR rate over the minimum SOFR recorded during that period (a small additional allowance in falling-rate environments). The rate can never be reduced below the prevailing one-month term SOFR rate — giving SATA the same floating rate floor as STRC. There are <strong>no contractual caps on rate increases</strong> for either instrument.</p>
          <p>The result is the same asymmetric ratchet that characterises STRC: rates can be raised freely and by any amount, but cuts are limited to small increments, require a full payment record, and are barred entirely if the instrument has been trading below $99.</p>

          <h2>The complete rate history</h2>
          <p>SATA launched at <strong>$80 per share</strong> — 20% below its $100 stated value — with an initial rate of 12%. That deep discount meant the effective yield on cost at IPO was approximately 15%, building in an immediate upward rate bias as the instrument traded below par. Since then, rate movements have been measured and consistent:</p>
          <ul>
            <li>November 2025: <strong>12.00%</strong> — IPO rate; stated value $100, issue price $80 (~$1.000/share/month)</li>
            <li>December 2025: <strong>12.25%</strong> — +25 bps (~$1.021/share/month)</li>
            <li>January 2026: <strong>12.25%</strong> — maintained; no change</li>
            <li>February 2026: <strong>12.50%</strong> — +25 bps (~$1.042/share/month)</li>
            <li>March 2026: <strong>12.75%</strong> — +25 bps; target range narrowed to $99–$101 (~$1.063/share/month)</li>
            <li>April 2026: <strong>13.00%</strong> — +25 bps (~$1.083/share/month)</li>
            <li>May 2026: <strong>13.00%</strong> — maintained; no change</li>
            <li>June 16, 2026 onward: <strong>13.00%</strong> — same annual rate; payment frequency switches to daily (~$0.054/share per business day)</li>
          </ul>
          <p>Three observations stand out. First, every increase has been exactly 25 bps — the maximum permissible reduction size. Strive appears to have adopted 25 bps as its standard step size even for increases, though it is under no obligation to do so. Second, the January 2026 hold — no change despite an active step-up sequence — demonstrates the discretionary nature of the mechanism: Strive paused when it judged no change was needed, without any published threshold having been crossed. Third, the rate stabilised at 13% in May 2026, the same month STRC stabilised at 11.50% — suggesting both instruments reached equilibrium around the same time as Bitcoin prices recovered and each found its par-proximate trading range.</p>

          <h2>How SATA and STRC compare on rate governance</h2>

          <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88em' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--accent-gold)' }}>
                  <th style={{ textAlign: 'left', padding: '0.6rem 0.9rem', color: 'var(--accent-gold)' }}>Feature</th>
                  <th style={{ textAlign: 'left', padding: '0.6rem 0.9rem', color: '#2563eb' }}>SATA</th>
                  <th style={{ textAlign: 'left', padding: '0.6rem 0.9rem', color: '#15803d' }}>STRC</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.6rem 0.9rem', color: 'var(--text-muted)' }}>Rate-setting approach</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>Wholly discretionary board decision</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>Rules-based 4-band VWAP table</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.6rem 0.9rem', color: 'var(--text-muted)' }}>Price measurement</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>20-day arithmetic average of closing prices</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>5-day VWAP</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.6rem 0.9rem', color: 'var(--text-muted)' }}>Published price bands</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>None</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>Below $95 / $95–$98.99 / $99–$100.99 / above $101</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.6rem 0.9rem', color: 'var(--text-muted)' }}>Mandatory increase triggers</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>None — increases are voluntary</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>Below $95: min. +50 bps; $95–$98.99: min. +25 bps</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.6rem 0.9rem', color: 'var(--text-muted)' }}>Reduction cap (per period)</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>25 bps (plus small SOFR adjustment)</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>25 bps (plus small SOFR adjustment)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.6rem 0.9rem', color: 'var(--text-muted)' }}>Absolute rate floor</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>One-month term SOFR</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>One-month term SOFR</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.6rem 0.9rem', color: 'var(--text-muted)' }}>Reduction price condition</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>Prior full period average ≥ $99</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>5-day VWAP in $99–$100.99 band</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.6rem 0.9rem', color: 'var(--text-muted)' }}>Target price range</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>$99–$101 (narrowed from $95–$105 in March 2026)</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>Implied $99–$101 from band structure</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.6rem 0.9rem', color: 'var(--text-muted)' }}>Framework published in 8-K?</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>No standalone framework 8-K filed</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>Yes — Aug 28, 2025; reaffirmed Feb 5, 2026</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.6rem 0.9rem', color: 'var(--text-muted)' }}>IPO issue price</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>$80.00 (20% below $100 par)</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>$90.00 (10% below $100 par)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.6rem 0.9rem', color: 'var(--text-muted)' }}>IPO rate</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>12.00%</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>9.00%</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.6rem 0.9rem', color: 'var(--text-muted)' }}>Payment frequency (current)</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>Daily (every NYSE business day, from June 16, 2026)</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>Monthly (semi-monthly change proposed; outcome not yet confirmed)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>What the IPO discounts reveal about starting conditions</h2>
          <p>Both instruments launched below par, but SATA launched significantly further below. STRC priced at $90 — 10% below par — with an initial 9% stated rate that translated to an effective yield of roughly 10% at cost. SATA priced at $80 — 20% below par — with an initial 12% stated rate that translated to an effective yield of approximately 15% at cost.</p>
          <p>These IPO structures signal different market dynamics at launch. STRC raised roughly $2.5 billion in its IPO; SATA raised around $148 million — a much smaller initial offering from a younger, less-established company. Strive set a higher IPO rate (and deeper discount) to attract buyers willing to take on the additional uncertainty of investing in a newer issuer with a smaller balance sheet and less capital market history. In that sense the 12% SATA IPO rate versus STRC's 9% reflects the market pricing a genuine risk premium, not just a different rate management philosophy.</p>

          <h2>The January 2026 hold: discretion in practice</h2>
          <p>One concrete illustration of the difference between SATA's discretionary approach and STRC's rules-based framework is January 2026. STRC continued stepping up (from 10.50% to 10.75% to 11.00%) throughout the December 2025 – February 2026 window. SATA, by contrast, held its rate flat at 12.25% for the January period despite following a similar trajectory in prior months.</p>
          <p>Under STRC's framework, if the 5-day VWAP was in the $95–$98.99 band at month-end, a minimum +25 bps increase was required. Under SATA's framework, Strive could simply judge that no change was warranted and hold. The January 2026 maintenance decision suggests the board concluded SATA was either already within its target range or that a pause was appropriate — without any published threshold having been triggered. That kind of judgment-based hold is structurally impossible under STRC's rules-based approach.</p>

          <h2>What this means for investors</h2>
          <p>For investors focused on income predictability, the differences in rate governance create two distinct risk profiles. STRC's rules-based framework provides greater transparency about when and by how much the rate will move — if you know where STRC's price is trading, you can predict the likely direction of the next rate change. SATA offers no equivalent predictive framework; Strive's rate decisions are genuinely at management's discretion each month.</p>
          <p>On the downside protection side, both instruments carry the same contractual limits: 25 bps per period maximum reduction, a SOFR floor, and a $99 prior-period price condition that blocks cuts when the instrument is trading near or below par. These structural protections are identical in design, even if the governing documents were drafted independently by two different companies. The practical implication is the same for both: a dramatic rate cut is structurally impossible, and any reduction program would play out slowly over many months.</p>
          <p>The higher yield on SATA — currently 13% versus STRC's 11.50% — reflects a combination of factors: the younger, smaller issuer, a less established capital market track record, and the additional uncertainty that comes with a purely discretionary rate mechanism versus a published algorithmic one. Whether that 150 basis point premium is adequate compensation is a judgment call that depends on your view of Strive's management, its Bitcoin treasury growth, and the 18-month cash reserve that backs the near-term income stream.</p>

          <h2>Reading the SATA filings yourself</h2>
          <p>Strive's complete EDGAR filing history is accessible through the SEC's company search using CIK 0001920406. The most important documents for understanding the rate mechanism are the original 424B5 prospectus supplement filed November 2025 (which contains the initial Certificate of Designation and the prospectus language on rate-setting discretion), the 8-K filed March 11, 2026 (which announced the narrowing of the target range to $99–$101), and the 8-K filed May 13, 2026 (which contains the Amended and Restated Certificate of Designation governing the transition to daily dividend payments).</p>
          <p>Strive's full EDGAR filing history can be browsed at <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001920406&type=&dateb=&owner=include&count=40" target="_blank" rel="noopener noreferrer">SEC EDGAR — Strive Inc (CIK 0001920406)</a>. Filtering by 8-K will surface every monthly dividend rate announcement; filtering by 424B5 will surface the prospectus supplements. For context on STRC's rules-based framework, see our companion article on <a href="/blog/strc-vwap-dividend-mechanism">how STRC's rate is set</a>.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Rate mechanism details are based on publicly available SEC filings as of June 2026. SATA's dividend adjustment mechanism is entirely at management's discretion and may change at any time. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'bmnp-dividend-rate-mechanism',
    title: "How BMNP's Dividend Rate Is Set: Fixed Income, Weekly Payments, and Ethereum Staking",
    date: '2026-06-06',
    excerpt: "BMNP launches with a fixed 9.50% rate and a unique weekly payment structure — backed not by Bitcoin but by Ethereum staking income from Bitmine's MAVAN validator network. Here is exactly how the rate is set, what protects investors if payments are missed, and how this differs from STRC and SATA.",
    readTime: '8 min read',
    category: 'BMNP',
    Content() {
      return (
        <>
          <p>BMNP is the 9.50% Series A Perpetual Preferred Stock issued by Bitmine Immersion Technologies, Inc. — applied to list on the NYSE under the ticker BMNP, with settlement and trading expected to commence on or around June 10, 2026. Its dividend structure departs meaningfully from both STRC and SATA: the rate is fixed at issuance rather than monthly-adjustable, payments are made weekly rather than monthly or daily, and the income is funded primarily by Ethereum staking rewards rather than a Bitcoin treasury. Understanding how the rate is set, how it can change, and what mechanisms protect investors if payments are delayed is essential for evaluating the instrument.</p>

          <h2>About Bitmine Immersion Technologies</h2>
          <p>Bitmine Immersion Technologies, Inc. (NYSE: BMNR) began as a Bitcoin mining company, using immersion-cooling technology to operate high-density mining rigs. Over 2024 and 2025 it executed a strategic pivot — selling down its mining operations and redirecting capital into Ethereum, following a playbook similar to Strategy's accumulation of Bitcoin. By early 2026 it had become the largest corporate holder of Ethereum in the world.</p>
          <p>As of February 28, 2026, Bitmine held over <strong>4,473,459 ETH</strong> — approximately 3.71% of the circulating ETH supply — with a fair value of approximately <strong>$8.8 billion</strong>. Alongside its ETH holdings, the company held 195 BTC, a $180 million stake in Beast Industries, and $880 million in cash, bringing total assets to approximately <strong>$9.9 billion</strong>. Its long-term ambition is to hold approximately 5% of the total ETH supply.</p>
          <p>In March 2026, Bitmine launched <strong>MAVAN</strong> — its <strong style={{color:'#ffffff'}}>M</strong>ade in <strong style={{color:'#ffffff'}}>A</strong>merica <strong style={{color:'#ffffff'}}>VA</strong>lidator <strong style={{color:'#ffffff'}}>N</strong>etwork — a proprietary institutional-grade Ethereum staking platform. By May 2026, MAVAN had over $14 billion in ETH staked globally, with Bitmine's own holdings representing approximately 3.9% of the total ETH supply staked through the network. In the same month, Bitmine acquired <strong>Pier Two Holdings</strong>, an institutional blockchain infrastructure provider, to deepen its validator capabilities.</p>
          <p>Operationally, Bitmine is a growing business: quarterly revenue reached $11 million for the three months ending February 28, 2026 — up from $1.5 million a year earlier — driven primarily by staking income and ETH options strategies. The BMNP preferred stock offering, which raised approximately $274.8 million net of underwriting costs, is expected to fund further ETH acquisitions and MAVAN infrastructure development.</p>

          <h2>A fixed rate, not a monthly adjustment</h2>
          <p>BMNP's most important structural difference from STRC and SATA is that its <strong>9.50% annual rate is fixed at issuance</strong>. There is no formal monthly mechanism — no VWAP price bands, no algorithmic trigger — that automatically adjusts the rate in response to how BMNP trades relative to its $100 stated value.</p>
          <p>STRC operates under a four-band VWAP framework: if the five-day volume-weighted average price falls below certain thresholds, mandatory minimum rate increases are triggered. SATA follows a wholly discretionary board approach, with management stating an intention to keep the price in a $99–$101 range but no binding formula. BMNP is closer to SATA in this respect — the board retains the discretion to adjust the rate in the future — but unlike SATA, no adjustment mechanism or target range was published at launch. The 9.50% rate is the starting point, not a dynamic peg.</p>

          <h2>How the 9.50% rate was set</h2>
          <p>Bitmine launched BMNP at an issue price of <strong>$80.00 per share</strong> — 20% below the $100 stated amount. This is the same structure Strive used for SATA's November 2025 IPO (also at $80, also 20% below par). At the $80 issue price, investors purchasing at IPO receive an <strong>effective yield of approximately 11.875%</strong> on their cost basis (9.50 ÷ 80 × 100), even though the stated rate is 9.50% of the $100 stated amount.</p>
          <p>The 9.50% stated rate — combined with the $80 issue price — was set to attract investors who are also comparing STRC (11.50% at par, ~$0.958/month) and SATA (13% at par, ~$1.083/month). The deeper IPO discount compensates for a lower stated rate. At $80, BMNP's effective IPO yield of ~11.875% sits between STRC and SATA's current effective yields, positioning it as a competitive entrant in the space while offering the differentiated Ethereum backing thesis.</p>

          <h2>Weekly payments: a faster income cadence than monthly</h2>
          <p>BMNP pays dividends <strong>weekly in arrears</strong> — every week, based on a record date 10 days before the payment date. At 9.50% annually on a $100 stated amount, each weekly payment is approximately <strong>$0.183 per share</strong> (9.50 ÷ 52). Bitmine retains the discretion to increase payment frequency beyond weekly should it choose to do so.</p>
          <p>Among the three instruments covered on this site, SATA holds the highest payment frequency — daily, every NYSE business day from June 16, 2026 (approximately 250 payments per year). BMNP is second, paying every week of the calendar year (52 payments), ahead of STRC's current monthly schedule (12 payments per year). For investors who reinvest, BMNP's weekly compounding still provides significantly more cycles per year than a monthly structure. For income investors, it means a steady, regular payment rhythm.</p>
          <p>Unlike SATA's daily payments, which track NYSE business days (approximately 250 per year), BMNP's weekly payments occur regardless of whether a specific day is a NYSE trading day — the 52-week calendar governs the payment schedule.</p>

          <h2>What funds the dividend: ETH staking via MAVAN</h2>
          <p>Bitmine states explicitly in its 424B5 prospectus that it <strong>"expects to fund any dividends paid on the Series A Preferred Stock primarily through the yield generated on our ETH holdings from staking, option strategies on Ethereum and additional capital raising activities."</strong> This sets BMNP apart from the other two instruments covered here: STRC's dividends are funded from Strategy's broader capital structure and cash reserves, while SATA's are drawn from a dedicated 18-month cash reserve backed by Strive's Bitcoin holdings. BMNP's income source is Ethereum — specifically the yield generated by staking it.</p>
          <p>BMNP's income flows from two primary sources:</p>
          <ul>
            <li><strong>ETH staking rewards through MAVAN</strong> — Bitmine's <strong style={{color:'#ffffff'}}>M</strong>ade in <strong style={{color:'#ffffff'}}>A</strong>merica <strong style={{color:'#ffffff'}}>VA</strong>lidator <strong style={{color:'#ffffff'}}>N</strong>etwork, launched in March 2026, operates validator infrastructure on the Ethereum network. As of May 25, 2026, approximately 4.7 million ETH had been staked through MAVAN — representing 87% of Bitmine's total ETH holdings and approximately 3.9% of the entire ETH supply. The gross staking annual percentage rate is approximately 2.5%–4.0%, generating a projected annualized staking revenue of approximately <strong>$276 million</strong>.</li>
            <li><strong>ETH option premium income</strong> — Bitmine runs option strategies on its ETH holdings, generating additional income. This produced $24.1 million in option premium income in the three months ended February 28, 2026 — a meaningful supplementary income stream alongside the base staking yield.</li>
          </ul>
          <p>At 9.50% on 3.5 million shares with a $100 stated amount, BMNP requires approximately <strong>$33.25 million per year in dividend payments</strong>. With projected staking revenue alone at ~$276 million annually, the income coverage ratio is substantial — staking revenue alone is approximately eight times the current BMNP dividend obligation. However, Bitmine's total capital structure obligations (including its common stockholders' interests and operating costs) are larger than the preferred dividend alone, and staking yields fluctuate with ETH price and network conditions.</p>

          <h2>Bitmine's ETH holdings: the asset base</h2>
          <p>As of February 28, 2026, Bitmine held <strong>over 4,473,459 ETH</strong> — making it the largest corporate holder of Ethereum in the world, with a fair value of approximately $8.8 billion. The company's long-term aspiration is to hold approximately 5% of the total ETH supply. At the time of that snapshot, it held 3.71% of the then-circulating supply of approximately 120.7 million ETH.</p>
          <p>Alongside its ETH holdings, Bitmine held 195 BTC, a $180 million stake in Beast Industries, and $880 million in cash — total asset holdings of approximately $9.9 billion as of February 2026. The proceeds from the BMNP offering ($274.8 million net of underwriting costs) are expected to be used to acquire additional ETH and fund MAVAN infrastructure development.</p>

          <h2>The compounding penalty: protection if payments are missed</h2>
          <p>BMNP's dividends are <strong>cumulative</strong> — if any regular dividend is not paid on its scheduled payment date, the unpaid amount does not simply disappear. Instead, compounded dividends begin to accumulate on the unpaid balance, and those compounded dividends carry an <strong>escalating penalty rate</strong>:</p>
          <ul>
            <li>The compounding rate starts at the regular dividend rate <strong>plus 5 basis points</strong> (based on a weekly compounding period)</li>
            <li>It then <strong>increases by 5 basis points per week</strong> until the unpaid dividend, plus compounded dividends, is paid in full</li>
            <li>The compounding rate is <strong>capped at 15% per annum</strong></li>
          </ul>
          <p>In practice, this means Bitmine faces an escalating cost for any payment delay, creating a strong financial incentive to resolve deferred dividends promptly. The cumulative structure also means no payment is simply written off — investors are entitled to receive all accumulated dividends before BMNP stockholders can be passed over in favour of common equity. If Bitmine fails to declare a dividend by the record date, it must immediately begin using commercially reasonable efforts over the following 30 days to raise proceeds — by selling common stock, other securities, or digital assets — to cover the deferred amount.</p>
          <p>Two consecutive failures to pay accumulated dividends constitutes a "regular dividend non-payment event," which triggers the right for preferred stockholders to appoint additional board members. This governance provision gives BMNP holders a meaningful lever if the company faces sustained payment difficulties.</p>

          <h2>The redemption premium: an implied price anchor</h2>
          <p>Unlike STRC and SATA — which use monthly rate adjustments to keep the price near $100 — BMNP uses a <strong>redemption premium schedule</strong> to create a similar price anchoring effect. Bitmine can redeem BMNP at any time, at a premium:</p>
          <ul>
            <li>Until <strong>December 10, 2027</strong> (18 months after issue): redemption at <strong>110% of the $100 stated amount</strong> ($110 per share), plus unpaid dividends</li>
            <li>From December 2027 to <strong>June 10, 2029</strong> (three years post-issue): redemption at <strong>105%</strong> ($105 per share), plus unpaid dividends</li>
            <li>After June 10, 2029: redemption at <strong>100%</strong> ($100 per share), plus unpaid dividends</li>
          </ul>
          <p>These redemption premiums mean that if Bitmine were to call the preferred stock within the first 18 months, holders would receive $110 per share — a significant premium for investors who purchased at the $80 IPO price. This structure provides a meaningful floor on downside: even if the market price drifts below $100, the redemption premium creates a strong reason for investors to hold, knowing they could receive 10–10% above stated value on an early call.</p>

          <h2>Reading the BMNP filings yourself</h2>
          <p>All details in this article are drawn from Bitmine's SEC filings, publicly available on the SEC's EDGAR system. The primary reference document is the final 424B5 prospectus supplement filed June 5, 2026 — which contains the complete Certificate of Designations, the rate-setting language, the compounding penalty mechanism, and the redemption premium schedule. Bitmine's filing history can be browsed at <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001829311&type=&dateb=&owner=include&count=40" target="_blank" rel="noopener noreferrer">SEC EDGAR — Bitmine Immersion Technologies (CIK 0001829311)</a>.</p>
          <p>For comparison with STRC's rules-based VWAP framework, see <a href="/blog/strc-vwap-dividend-mechanism">How STRC's Dividend Rate Is Set</a>. For SATA's discretionary mechanism, see <a href="/blog/sata-dividend-rate-mechanism">How SATA's Dividend Rate Is Set</a>. The <a href="/bmnp">BMNP hub</a> shows the live price and effective yield as the instrument begins trading.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. BMNP is a newly issued instrument settling June 10, 2026. Rate and structural details are based on publicly available SEC filings as of June 2026 and are subject to change. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'bmnp-vs-strc-sata',
    title: 'BMNP vs STRC and SATA: The Ethereum-Backed Alternative Explained',
    date: '2026-06-09',
    excerpt: "BMNP, STRC, and SATA are all high-yield preferred equity instruments — but BMNP is fundamentally different. It is backed by Ethereum rather than Bitcoin, funds its dividend from ETH staking rewards via MAVAN, and pays weekly rather than monthly or daily. Here is a direct comparison of all three.",
    readTime: '8 min read',
    category: 'BMNP',
    Content() {
      return (
        <>
          <p>STRC, SATA, and BMNP share a surface-level profile: all three are publicly traded preferred equity instruments paying high cash yields from companies with digital asset treasury strategies. But BMNP represents a genuine departure from the other two — in the asset backing the dividend, in how that income is generated, in the rate structure, and in the payment cadence. Understanding the differences helps clarify what kind of investment each instrument represents and what risks each carries.</p>

          <h2>The fundamental split: Ethereum versus Bitcoin</h2>
          <p>The most important distinction between BMNP and the other two instruments is the underlying asset.</p>
          <p><strong>STRC</strong> is issued by <strong>Strategy</strong> — the largest corporate Bitcoin holder in the world, with over 843,000 BTC on its balance sheet. The company's financial health, and by extension its ability to sustain STRC dividends, is directly tied to Bitcoin's price trajectory.</p>
          <p><strong>SATA</strong> is issued by <strong>Strive Asset Management</strong>, which holds 19,000 Bitcoin alongside an 18-month dedicated cash reserve. Strive's treasury is smaller than Strategy's but its reserve structure provides explicit near-term income protection, while its Bitcoin exposure gives it long-term appreciation potential alongside the fixed income stream.</p>
          <p><strong>BMNP</strong> is issued by <strong>Bitmine Immersion Technologies</strong> — the largest corporate holder of Ethereum in the world, with over 4.47 million ETH as of February 2026 (approximately 3.71% of the total circulating supply). Bitmine's treasury is measured in Ethereum, not Bitcoin, and its income comes from Ethereum staking rewards rather than from Bitcoin appreciation or balance sheet management.</p>
          <p>This is not a trivial distinction. Bitcoin and Ethereum are distinct assets with different supply mechanisms, different use cases, and different risk profiles. An investor choosing between BMNP, STRC, and SATA is also implicitly taking a position on these underlying assets — or deliberately diversifying across both.</p>

          <h2>How each issuer generates income</h2>
          <p>The three instruments differ not just in the asset they hold, but in how that asset generates the income that funds dividends.</p>
          <p><strong>Strategy</strong> does not earn yield on its Bitcoin directly. Bitcoin is a non-yielding asset — it does not stake, does not pay interest, and does not generate revenue simply by being held. Strategy funds STRC dividends through its business intelligence software revenues, its access to capital markets (ongoing stock and debt offerings), and a $2.25 billion cash reserve specifically set aside for preferred and debt obligations. Bitcoin's price appreciation strengthens the balance sheet over time, but it does not produce cash flow.</p>
          <p><strong>Strive</strong> similarly holds Bitcoin as a treasury asset — Bitcoin's price performance affects its long-term financial position, but Strive's near-term dividend security comes from its dedicated 18-month cash reserve ($137 million as of June 2026) rather than from any yield generated on its Bitcoin holdings.</p>
          <p><strong>Bitmine</strong>, by contrast, earns active yield on its Ethereum holdings through the Ethereum network's proof-of-stake mechanism. When Bitmine stakes its ETH — depositing it to validator nodes on the Ethereum network — it earns staking rewards denominated in ETH. As of May 25, 2026, approximately <strong>4.7 million ETH</strong> were staked through <strong>MAVAN</strong> (Bitmine's <strong style={{color:'#ffffff'}}>M</strong>ade in <strong style={{color:'#ffffff'}}>A</strong>merica <strong style={{color:'#ffffff'}}>VA</strong>lidator <strong style={{color:'#ffffff'}}>N</strong>etwork), earning a gross annual percentage rate of approximately <strong>2.5%–4.0%</strong>. This produces a projected annualized staking revenue of approximately <strong>$276 million</strong>.</p>
          <p>In addition, Bitmine runs <strong>option strategies on its ETH holdings</strong>, generating supplementary income: $24.1 million in ETH option premium income in the three months ended February 28, 2026 alone. The combination of staking yield and options income gives BMNP a direct, active income stream rather than the balance-sheet-based approach that backs STRC and SATA.</p>

          <h2>MAVAN: the infrastructure behind BMNP's income</h2>
          <p>MAVAN — the <strong style={{color:'#ffffff'}}>M</strong>ade in <strong style={{color:'#ffffff'}}>A</strong>merica <strong style={{color:'#ffffff'}}>VA</strong>lidator <strong style={{color:'#ffffff'}}>N</strong>etwork — is the infrastructure through which Bitmine operates as an Ethereum validator at scale. Launched in March 2026, MAVAN rapidly became one of the largest validator operations globally: by May 25, 2026, it had over <strong>$14 billion in ETH staked globally</strong>, with Bitmine's own 4.7 million ETH representing approximately 3.9% of the total ETH supply staked through the network.</p>
          <p>Operating validator infrastructure is a capital-intensive but scalable business. As Bitmine's ETH holdings grow — through additional purchases funded by BMNP offerings and other capital raises — more ETH can be staked, generating more rewards at the same 2.5%–4.0% annual rate. This creates a natural link between BMNP issuance and income growth: proceeds from preferred stock offerings fund ETH acquisition, which expands the staking base, which generates more income to fund dividends. The BMNP prospectus also notes that Bitmine acquired Pier Two Holdings in March 2026 — an institutional-grade blockchain infrastructure provider — to deepen its validator capabilities.</p>

          <h2>The headline yield: where all three currently stand</h2>
          <p>At current rates and stated amounts:</p>
          <ul>
            <li><strong>STRC</strong>: 11.50% annual yield — approximately $0.479 per share twice a month, or $11.50 per year</li>
            <li><strong>SATA</strong>: 13.00% annual yield — approximately $0.054 per share per NYSE business day, or $13.00 per year</li>
            <li><strong>BMNP</strong>: 9.50% annual yield — approximately $0.183 per share per week, or $9.50 per year on the $100 stated amount</li>
          </ul>
          <p>On stated rates, BMNP appears to be the lowest-yielding of the three. But the comparison depends heavily on the price you pay. BMNP launched at an <strong>IPO price of $80 per share</strong> — 20% below its $100 stated amount. An investor who purchases at $80 receives an <strong>effective yield of approximately 11.875%</strong> — above STRC's 11.50% and approaching SATA's 13.00%. As BMNP's price converges toward its $100 stated value (if it does), the effective yield for new buyers falls. Investors who bought at $80 lock in the higher effective yield on their cost basis regardless of subsequent price movements.</p>

          <h2>Rate structure: fixed versus adjustable</h2>
          <p>A critical structural difference between the three instruments is how their dividend rates are managed over time.</p>
          <p><strong>STRC</strong> uses a formal, published four-band VWAP framework. Depending on where its five-day volume-weighted average price falls relative to its $100 par value at month-end, mandatory minimum rate adjustments are triggered. If STRC trades below $95, the rate must increase by at least 50 basis points. Between $95 and $98.99, a minimum 25 basis point increase is required. Between $99 and $100.99, no change; above $101, a reduction of at least 25 basis points applies. This rules-based mechanism means STRC's rate trajectory is relatively predictable given its current trading price.</p>
          <p><strong>SATA</strong> operates on a wholly discretionary basis. The board decides the rate each month at its sole discretion, with no published price bands. The contractual protections are similar to STRC's (25 bps per period reduction cap, SOFR floor, $99 price condition for reductions), but the mechanism for rate increases is entirely at management's judgement.</p>
          <p><strong>BMNP</strong> has a <strong>fixed 9.50% stated rate</strong> at launch. There is no formal monthly price-tracking mechanism equivalent to STRC's VWAP framework, and no equivalent published target range equivalent to SATA's $99–$101 band. The rate can in principle be adjusted by the board — as a perpetual preferred, the Certificate of Designations governs what adjustments are permissible — but no framework for such adjustments was published at the time of the BMNP IPO. The rate set at issuance is the contractual starting point.</p>
          <p>This makes BMNP the least transparent of the three on rate management, but also potentially the most stable in the near term: a fixed rate with no mechanism to reduce it quickly is, from the income investor's perspective, a feature rather than a risk — at least while the issuer can sustain the payment.</p>

          <h2>Payment frequency: weekly, monthly, and daily</h2>
          <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--accent-gold)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--accent-gold)' }}>Feature</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#fde047' }}>BMNP</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#15803d' }}>STRC</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#2563eb' }}>SATA</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Issuer</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Bitmine Immersion Technologies</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Strategy (formerly MicroStrategy)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Strive Asset Management</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Treasury asset</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Ethereum (4.47M ETH, ~$8.8B)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Bitcoin (843,000+ BTC)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Bitcoin (19,000 BTC, ~$1.35B)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Income source</td>
                  <td style={{ padding: '0.75rem 1rem' }}>ETH staking (MAVAN) + ETH options</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Business revenues + cash reserve + capital markets</td>
                  <td style={{ padding: '0.75rem 1rem' }}>18-month dedicated cash reserve + Bitcoin appreciation</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Stated annual rate</td>
                  <td style={{ padding: '0.75rem 1rem' }}>9.50%</td>
                  <td style={{ padding: '0.75rem 1rem' }}>11.50%</td>
                  <td style={{ padding: '0.75rem 1rem' }}>13.00%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>IPO price</td>
                  <td style={{ padding: '0.75rem 1rem' }}>$80.00 (20% below par)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>$90.00 (10% below par)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>$80.00 (20% below par)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Effective yield at IPO price</td>
                  <td style={{ padding: '0.75rem 1rem' }}>~11.875%</td>
                  <td style={{ padding: '0.75rem 1rem' }}>~10.00%</td>
                  <td style={{ padding: '0.75rem 1rem' }}>~15.00%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Rate mechanism</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Fixed at issuance; no published adjustment framework</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Monthly VWAP-based adjustment (4-band framework)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Wholly discretionary board decision each month</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Payment frequency</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Weekly</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Semi-monthly from July 2026 (24 payments/year)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Daily (every NYSE business day from 16 June 2026)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Dividend type</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Cumulative</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Cumulative</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Cumulative</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Early redemption premium</td>
                  <td style={{ padding: '0.75rem 1rem' }}>110% until Dec 2027; 105% until June 2029</td>
                  <td style={{ padding: '0.75rem 1rem' }}>At par (no redemption premium)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>At par (no redemption premium)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Listing</td>
                  <td style={{ padding: '0.75rem 1rem' }}>NYSE: BMNP</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Nasdaq: STRC</td>
                  <td style={{ padding: '0.75rem 1rem' }}>NYSE: SATA</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>The redemption premium: a protection STRC and SATA do not offer</h2>
          <p>One feature that distinguishes BMNP from STRC and SATA is its <strong>early redemption premium</strong>. If Bitmine chooses to call the preferred stock within the first 18 months of issuance (before December 10, 2027), it must pay <strong>110% of the $100 stated amount — $110 per share</strong> — plus all accumulated and unpaid dividends. Between December 2027 and June 2029, the redemption price falls to 105%. After June 2029, it falls to par ($100).</p>
          <p>For investors who purchased at the $80 IPO price, an early redemption at $110 would represent a <strong>37.5% capital gain</strong> in addition to the dividend income received. STRC and SATA can be redeemed at par ($100) at any time — there is no equivalent premium. This redemption schedule creates a genuine price anchor above $100 in the near term, because any rational seller knows Bitmine would have to pay at least $110 per share to force redemption. That structurally limits downside in a way neither STRC nor SATA replicate.</p>

          <h2>Risk considerations</h2>
          <p>All three instruments carry the risks inherent to preferred equity from digital asset companies: dividends are equity obligations rather than legally guaranteed debt payments, and all three issuers' financial health is meaningfully tied to the performance of their respective treasury assets. But the risk profiles differ in important ways.</p>
          <p>BMNP's risk is the most distinct. Ethereum's price determines the value of Bitmine's balance sheet, and ETH staking rewards — while currently covering BMNP's dividend obligation many times over — can fluctuate as ETH prices move and network staking participation changes. If a large portion of the ETH supply were to be staked, individual validator returns would compress, reducing staking yields. ETH is also a newer, more complex asset than Bitcoin, with smart contract risk, protocol upgrade risk, and different regulatory exposure.</p>
          <p>The absence of a formal monthly rate adjustment mechanism in BMNP means the rate is more stable in the near term, but also means there is no systematic mechanism to pull the price back toward par if it drifts significantly. STRC's VWAP mechanism provides a direct, observable circuit breaker. BMNP's redemption premium provides a different kind of floor — but operates through the issuer's call option, not through an automatic price-tracking rate movement.</p>
          <p>For investors comparing all three instruments, BMNP offers a genuinely different risk and backing thesis: Ethereum-denominated income generation through active staking, rather than passive Bitcoin treasury management or cash reserve drawdown. Whether that is a diversification benefit or an additional complexity depends on your view of Ethereum's trajectory and the durability of staking yields as a reliable income source.</p>

          <h2>Using the BMNP hub</h2>
          <p>The <a href="/bmnp">BMNP hub</a> on this site shows live price and effective yield as BMNP begins trading from June 10, 2026. For STRC and SATA, the <a href="/strc/differentiator">STRC Differentiator</a> and <a href="/sata/differentiator">SATA Differentiator</a> compare each instrument against traditional income benchmarks. For a more detailed look at how each instrument's dividend rate is set, see <a href="/blog/strc-vwap-dividend-mechanism">STRC's VWAP mechanism</a>, <a href="/blog/sata-dividend-rate-mechanism">SATA's discretionary approach</a>, and <a href="/blog/bmnp-dividend-rate-mechanism">BMNP's fixed rate and compounding protection</a>.</p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. BMNP, STRC, and SATA are speculative investments. Figures for BMNP are based on the June 2026 prospectus supplement and pre-launch data. All rates, prices and holdings are subject to change. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'strc-sata-dividend-frequency-changes-june-2026',
    title: 'STRC Goes Semi-Monthly and SATA Goes Daily: What Changes and When',
    date: '2026-06-10',
    excerpt: 'Two significant dividend frequency changes are landing this month. STRC transitions to semi-monthly payments following a shareholder vote on June 8, with the first new-format payment due July 15. SATA switches to daily payments from June 16. Here is exactly what changes, what stays the same, and the key dates to know.',
    readTime: '4 min read',
    category: ['STRC', 'SATA'],
    Content() {
      return (
        <>
          <p>June 2026 brings two notable changes to the dividend structures of STRC and SATA. Neither change alters the annual yield — both instruments maintain their current rates. What changes is how often those payments arrive, and when the new schedules take effect.</p>

          <h2>STRC: monthly becomes semi-monthly</h2>
          <p>On 8 June 2026, Strategy's stockholders approved an amendment to change STRC's dividend payment frequency from once a month to twice a month. Both common stockholders and STRC preferred holders voted in favour at Strategy's 2026 Annual Meeting.</p>
          <p>The annual rate remains at <strong>11.50%</strong>. The only change is that each payment is split in two:</p>
          <ul>
            <li>Previously: approximately <strong>$0.958 per share each month</strong></li>
            <li>From July 2026: approximately <strong>$0.479 per share twice a month</strong></li>
          </ul>
          <p>The transition is straightforward. The final monthly payment follows the existing schedule, after which the semi-monthly cadence begins:</p>
          <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--accent-gold)' }}>
                  <th style={{ textAlign: 'left', padding: '0.6rem 1rem', color: 'var(--accent-gold)' }}>Payment</th>
                  <th style={{ textAlign: 'left', padding: '0.6rem 1rem', color: 'var(--accent-gold)' }}>Record Date</th>
                  <th style={{ textAlign: 'left', padding: '0.6rem 1rem', color: 'var(--accent-gold)' }}>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.6rem 1rem', color: 'var(--text-muted)' }}>Last monthly payment</td>
                  <td style={{ padding: '0.6rem 1rem' }}>15 June 2026</td>
                  <td style={{ padding: '0.6rem 1rem' }}>30 June 2026</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '0.6rem 1rem', color: 'var(--text-muted)' }}>First semi-monthly payment</td>
                  <td style={{ padding: '0.6rem 1rem' }}>30 June 2026</td>
                  <td style={{ padding: '0.6rem 1rem' }}>15 July 2026</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.6rem 1rem', color: 'var(--text-muted)' }}>Ongoing schedule</td>
                  <td style={{ padding: '0.6rem 1rem' }}>15th and last day of each month</td>
                  <td style={{ padding: '0.6rem 1rem' }}>Following record date</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Each payment remains subject to board declaration. Strategy's stated rationale for the change is to stabilise STRC's price, reduce cyclicality around the monthly payment date, improve liquidity, and allow shareholders to reinvest more frequently.</p>

          <h2>SATA: monthly becomes daily</h2>
          <p>SATA switches from monthly to daily dividend payments on <strong>16 June 2026</strong>. From that date, dividends accrue and are paid every NYSE business day — approximately 250 payments per year.</p>
          <p>The annual rate remains unchanged at <strong>13%</strong>. The per-payment amount is simply divided across business days:</p>
          <ul>
            <li>Previously: approximately <strong>$1.083 per share each month</strong></li>
            <li>From 16 June: approximately <strong>$0.052 per share per NYSE business day</strong></li>
          </ul>
          <p>The precise daily amount varies slightly by month depending on the number of NYSE business days in each period. For investors who reinvest, daily payments provide up to 250 compounding opportunities per year — a meaningful step up from monthly reinvestment over a longer time horizon.</p>

          <h2>What stays the same</h2>
          <p>The core economics of both instruments are unchanged. The annual yields — 11.50% for STRC and 13% for SATA — are not affected by the frequency change. Total annual income on a given holding remains identical regardless of how often the payments arrive. The adjustable-rate mechanisms that govern how each rate is reviewed each period are also unaffected.</p>
          <p>For investors taking dividends as cash, the annual income is the same as before. For those reinvesting, more frequent payment cycles provide marginally more compounding — an advantage that accumulates meaningfully over longer holding periods but is modest in the near term.</p>

          <h2>Key dates</h2>
          <ul>
            <li><strong>8 June 2026</strong> — STRC semi-monthly change approved by shareholders</li>
            <li><strong>15 June 2026</strong> — STRC last monthly record date</li>
            <li><strong>16 June 2026</strong> — SATA daily dividends begin</li>
            <li><strong>30 June 2026</strong> — STRC last monthly payment; first semi-monthly record date</li>
            <li><strong>15 July 2026</strong> — STRC first semi-monthly payment (subject to board declaration)</li>
          </ul>
          <p>Both changes are reflected across the live trackers, projectors, and dividend history pages on this site. The <a href="/strc">STRC hub</a> and <a href="/sata">SATA hub</a> show current rates and per-payment amounts updated to the new schedules.</p>

          <p className="disclaimer">This article is for informational purposes only and does not constitute financial advice. Dividend payments are subject to board declaration each period. Always consult a qualified financial adviser before making any investment decisions.</p>
        </>
      );
    },
  },
];

export function getArticle(slug) {
  return articles.find(a => a.slug === slug) ?? null;
}
