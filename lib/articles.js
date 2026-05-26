export const articles = [
  {
    slug: 'what-is-preferred-stock',
    title: 'What Is Preferred Stock? A Plain English Guide',
    date: '2026-03-10',
    excerpt: 'Most investors know about ordinary shares and bonds. Preferred stock sits between them — and understanding how it works is the foundation for evaluating any high-yield income asset like STRC or SATA.',
    readTime: '6 min read',
    category: 'Education',
    Content() {
      return (
        <>
          <p>Most investors are familiar with two types of securities: ordinary shares and bonds. Preferred stock is a hybrid that draws features from both. It is widely used by corporations to raise capital and underpins the structure of newer income instruments like STRC and SATA.</p>

          <h2>Where preferred stock sits in the capital structure</h2>
          <p>When a company raises money, it can borrow through bonds, sell ownership through ordinary shares, or issue preferred stock — a middle path. The term "preferred" refers to payment priority. If dividends are paid or the company is liquidated, preferred shareholders receive their payment before ordinary shareholders. Bondholders, however, still rank above preferred stockholders. This places preferred equity firmly in the middle of the capital stack: more protected than ordinary shares, less senior than debt.</p>

          <h2>Fixed dividends and income predictability</h2>
          <p>Preferred stock carries a <strong>fixed dividend</strong> expressed as a percentage of the issue (par) price. This payment is agreed at issuance and does not fluctuate with company profits. Unlike ordinary share dividends — which can be raised, cut, or eliminated at will — preferred dividends offer a level of consistency that makes them attractive to income-focused investors.</p>
          <p>In most structures, preferred shareholders receive <strong>no voting rights</strong>. They trade governance influence for income stability. For investors primarily interested in reliable cash flow rather than corporate control, this is a straightforward tradeoff.</p>

          <h2>Cumulative versus non-cumulative dividends</h2>
          <p>One critical distinction between preferred stock structures is whether dividends are <strong>cumulative</strong> or <strong>non-cumulative</strong>.</p>
          <p>With cumulative preferred stock, if the issuer misses a dividend payment, the unpaid amount accumulates as an obligation. Before ordinary shareholders receive anything, all back-owed preferred dividends must be settled. Non-cumulative preferred stock offers no such protection: a missed payment is simply gone.</p>
          <p>This distinction matters considerably when assessing downside risk. Non-cumulative structures offer less protection if an issuer encounters financial difficulty.</p>

          <h2>Perpetual versus term preferred stock</h2>
          <p><strong>Perpetual preferred stock</strong> has no maturity date. The issuer pays dividends indefinitely, and the shares do not automatically redeem. Total return depends almost entirely on dividend income — there is no built-in capital return event to anchor pricing.</p>
          <p><strong>Term preferred stock</strong> has a fixed maturity at which the company redeems shares at par value, similar to a bond. This creates a known endpoint that affects both price behaviour and yield calculation.</p>
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
          <p>Strive holds 13,000+ Bitcoin alongside 18+ months of cash reserves — a substantial buffer designed to maintain dividend payments through periods of Bitcoin price volatility. This dual-asset approach (Bitcoin for long-term appreciation, cash for near-term income obligations) is central to SATA's income thesis.</p>

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
            <li><strong>13,000+ Bitcoin</strong> — Strive holds a significant Bitcoin reserve that forms the long-term strategic backing of the instrument. If Bitcoin appreciates over time, this reserve becomes more valuable, strengthening Strive's overall financial position. Bitcoin's price volatility does not directly change the cash dividend, but it does affect the long-term health of the backing portfolio.</li>
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
    category: 'Comparison',
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
          <p><strong>SATA</strong> is issued by <strong>Strive Asset Management</strong>, a US-based investment firm founded in 2022. Strive holds 13,000+ Bitcoin alongside 18+ months of dedicated cash reserves, and has designed SATA specifically as a high-yield income instrument with a conservative reserve policy to support dividend sustainability.</p>

          <h2>Rate mechanism</h2>
          <p>STRC uses a <strong>monthly adjustable rate</strong> designed to keep the instrument trading near its $100 par value. When STRC drifts below par, the rate adjusts upward; when it rises above par, the rate adjusts down. The rate has stepped up progressively since its July 2025 IPO (from 9% to 11.50%).</p>
          <p>SATA does not operate on the same formal monthly adjustment mechanism. Instead, Strive manages the trading range through its reserve policy and market activity. The rate has also increased since SATA's November 2025 IPO: 12% → 12.25% → 12.75% → 13%. Both instruments have demonstrated a pattern of increasing rates as they mature and market conditions evolve.</p>

          <h2>What backs each dividend</h2>
          <p>Both instruments are backed by Bitcoin-connected issuers, but the nature of the backing differs.</p>
          <p>STRC is backed by Strategy's financial resources — including its 800,000+ Bitcoin holdings, business revenues from its software operations, and its ongoing access to capital markets. Strategy is a large, well-established public company with a long track record in the capital markets.</p>
          <p>SATA is backed by Strive's dual-asset structure: 13,000+ Bitcoin for long-term value and <strong>18+ months of dedicated cash reserves</strong> specifically earmarked for dividend payments. This cash reserve provides a tangible, concrete buffer against short-term adversity. For income investors who prioritise near-term dividend security, SATA's explicit reserve policy is a meaningful differentiator.</p>

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
];

export function getArticle(slug) {
  return articles.find(a => a.slug === slug) ?? null;
}
