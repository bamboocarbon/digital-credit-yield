import Link from 'next/link';
import CompoundingChart from '@/components/CompoundingChart';
import StrategyCapitalStack from '@/components/StrategyCapitalStack';
import StriveCapitalStack from '@/components/StriveCapitalStack';

export const articles = [
  {
    slug: 'strategy-transforms',
    title: 'Strategy Transforms',
    metaTitle: 'Strategy Transforms — Inside the Digital Credit Capital Framework',
    date: '2026-06-30',
    excerpt: "STRC fell from par to the low $70s in five weeks — the 'never sell' promise broken, the ATM flywheel seized. Yesterday Strategy announced a formal Digital Credit Capital Framework: a $2.55 billion ring-fenced reserve, a $1.25 billion Bitcoin monetisation programme, a 12% dividend rate and buyback authorisations. Here is what it actually says.",
    readTime: '7 min read',
    category: ['STRC'],
    Content() {
      return (
        <>
          <p>STRC has had a difficult five weeks. When I wrote <a href="/blog/storm-in-a-teacup">A Storm in a Teacup</a> on the 19th of June, the price had dropped to an intraday low of $82.50 on triple-witching day and then clawed virtually all of it back — enough to call it a storm, contained. It wasn&apos;t. The weeks that followed brought a second slide, deeper and slower, with STRC falling all the way to the low $70s before yesterday&apos;s announcement from Strategy gave it a partial reprieve, bouncing back to around $83. This article is the follow-up: what pushed the price lower after the storm, what Strategy actually announced yesterday, and what it means in plain terms for anyone holding STRC.</p>

          <h2>The storm that wasn&apos;t contained</h2>
          <p>After triple-witching cleared, the price didn&apos;t snap back to par. It kept drifting — and then a sequence of events made the original drop look like the prelude.</p>
          <p>The first was the sale. At the end of May, Strategy disclosed it had sold 32 Bitcoin between the 26th and 31st of the month, raising around $2.5 million to cover preferred dividend obligations. The numbers were tiny — 32 coins against a holding of more than 880,000 Bitcoin is less than 0.004% of the stack. But the symbolism was enormous. Michael Saylor had spent years making &quot;never sell&quot; the bedrock of Strategy&apos;s brand. The moment that changed, even for 32 coins, the question in every holder&apos;s mind shifted from <em>will they ever sell?</em> to <em>how much will they sell, and why?</em> The answer — that it was to fund preferred dividend payments — didn&apos;t calm nerves. It raised them. The following week, Strategy bought considerably more Bitcoin back. But the market doesn&apos;t easily forget a broken promise, and the price kept sliding.</p>
          <p>Then came the social media pile-on. After the 32 BTC sale was disclosed, voices on X declared Strategy insolvent, STRC dividends unpayable, the whole model a Ponzi scheme. None of it was backed with numbers; much of it was wrong. But markets don&apos;t wait for corrections, and retail holders watching STRC drift lower found fresh reasons to exit at every turn.</p>
          <p>Meanwhile, the mechanism that was supposed to stabilise STRC had quietly stopped working. The at-the-market share issuance programme — the flywheel I described in <a href="/blog/storm-in-a-teacup">A Storm in a Teacup</a> — depends on STRC trading near its $100 par value. When it&apos;s there, Strategy issues new shares at around par, pockets the cash, and buys more Bitcoin. Below par, the maths breaks down: you&apos;re issuing shares you&apos;ll eventually need to redeem at $100 for less than that. So as STRC fell, the mechanism that would normally haul it back stopped turning, and the price drifted into the low $70s with no obvious floor.</p>

          <h2>Yesterday&apos;s announcement</h2>
          <p>On the 29th of June, Strategy published what it calls a Digital Credit Capital Framework — a formal, board-approved policy setting out how it plans to protect preferred dividend payments and stabilise STRC. It came in five parts, so let me take them one by one in plain terms.</p>

          <h2>Part 1: The USD Reserve — ring-fenced and governed</h2>
          <p>Strategy&apos;s press release states a USD Reserve of $2.55 billion as of 28th June — but that number needs a sentence of context. It includes expected cash proceeds from shares sold under Strategy&apos;s at-the-market programme that had not yet settled on that date. The underlying settled balance a week earlier was around $1.4 billion; it grew to $2.55 billion through heavy ATM activity in the final days of June, some of which was still clearing. The reserve is real, but the headline figure is partly in-flight cash rather than funds already sitting in the account.</p>
          <p>What the framework does is put a formal fence around that reserve. Under the new board-approved USD Reserve Policy, the money can only be used for two purposes: paying preferred stock dividends and paying interest on outstanding debt. Any other use requires a separate board vote. Based on Strategy&apos;s current annual expected payments of roughly $1.76 billion, the $2.55 billion reserve represents about <strong>17.4 months of coverage</strong>. Add the $1.25 billion BTC monetisation capacity described below and total preferred dividend liquidity coverage rises to approximately <strong>$3.80 billion — or 25.9 months</strong> — though that BTC figure is price-sensitive. There is also a board-established floor: the USD Reserve must not fall below <strong>12 months</strong> of current expected payments, and dropping below that requires fresh board authorisation.</p>

          <h2>Part 2: STRC rate raised to 12%</h2>
          <p>The STRC dividend rate moves to 12% per annum from 1st July, up from 11.50%. At $100 par that works out to around $1.00 per share per month. Because the price has drifted well below par, the effective yield to a new buyer today is meaningfully higher than 12% — you can see the live figure on the <a href="/strc">STRC hub</a>.</p>
          <p>Going forward, Strategy says it will evaluate the rate monthly against a range of factors: STRC&apos;s trading level, market yields, credit spreads, Bitcoin&apos;s price and volatility, USD Reserve coverage, and the company&apos;s overall capital structure. There is also a caveat in the announcement worth noting explicitly: Strategy will <em>not necessarily</em> increase the STRC rate solely because the price trades below its stated amount. The rate is one tool among several — the buyback programme, the reserve management, and the BTC monetisation programme are the others.</p>

          <h2>Part 3: The Bitcoin Monetisation Programme — authorised, not obligated</h2>
          <p>This is the headline item, and I want to be precise about what it says and what it doesn&apos;t. Strategy&apos;s board has <em>authorised</em> the company to sell Bitcoin for three specific purposes:</p>
          <ul>
            <li>To generate up to $1.25 billion to fund the USD Reserve</li>
            <li>To additionally fund preferred dividends and interest directly — or replenish the reserve after such payments — when management judges this to be more advantageous than issuing new equity</li>
            <li>To fund repurchases of Digital Credit Securities or common stock under the buyback programmes</li>
          </ul>
          <p>Anything outside those three purposes, or above the authorised limits, requires further board approval. The programme does not commit Strategy to a single Bitcoin sale; it removes the need to seek a fresh board vote each time a sale is considered. The &quot;never sell&quot; era is over as a formal policy, but this is a conditional, capped, purpose-limited programme — not an open tap.</p>
          <p>The CFO, Andrew Kang, framed it simply: <em>&quot;Bitcoin is capital. This program gives Strategy the flexibility to use a portion of its BTC Reserve to strengthen Digital Credit, fund or replenish the USD Reserve, fund dividend payments and interest expense, and fund accretive repurchases when BTC monetization is more advantageous than issuing common equity.&quot;</em></p>

          <h2>Part 4: Buyback programmes</h2>
          <p>Strategy authorised $1 billion to buy back its Digital Credit Securities — with STRC explicitly named as the initial priority — and a separate $1 billion to buy back class A common stock. A buyback of STRC at current prices allows Strategy to retire shares at a discount to par, reducing the future dividend obligation in the process. Whether they deploy this capital depends on circumstances, but the authorisation sends a clear signal: at these prices, they think the shares are cheap.</p>
          <p>One distinction worth noting: neither buyback programme is funded from the USD Reserve. The reserve is ring-fenced for dividends and debt interest only. If BTC sales are used to fund buybacks, those transactions go through the BTC Monetisation Programme separately.</p>

          <h2>Part 5: The stated price target</h2>
          <p>Strategy restated its corporate objective for STRC: to trade over time in a range of approximately <strong>$99 to $100</strong>. It has said this before. The framework is the formal mechanism it is now putting behind that goal.</p>

          <h2>The old model and the new</h2>
          <p>The best way to see what has changed is to draw it. Until now, Strategy&apos;s relationship with Bitcoin was essentially one-directional: capital came in, Bitcoin went in, and nothing came out. Yesterday&apos;s announcement introduces a conditional outflow — a managed valve, with defined rules about when it opens and what the money can be used for.</p>

          <div style={{ margin: '2rem 0', overflowX: 'auto' }}>
            <svg viewBox="0 0 660 470" width="100%" style={{ maxWidth: '660px', display: 'block', margin: '0 auto' }}>
              <defs>
                <marker id="arr-gray" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#64748b" />
                </marker>
                <marker id="arr-gold" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
                </marker>
                <marker id="arr-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#22c55e" />
                </marker>
                <marker id="arr-purple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#8b5cf6" />
                </marker>
              </defs>

              {/* ══ LEFT PANEL: BEFORE ══ */}
              <rect x="3" y="3" width="308" height="444" rx="8" fill="none" stroke="#374151" strokeWidth="1.5" />
              <text x="157" y="26" textAnchor="middle" fontSize="12" fill="#94a3b8" fontWeight="700" letterSpacing="1.5">BEFORE</text>

              {/* Capital Markets */}
              <rect x="97" y="38" width="120" height="32" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
              <text x="157" y="59" textAnchor="middle" fontSize="11" fill="#cbd5e1" fontWeight="600">Capital Markets</text>

              {/* Split left → Strategy */}
              <line x1="140" y1="71" x2="86" y2="112" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arr-gray)" />
              {/* Split right → Preferred */}
              <line x1="175" y1="71" x2="228" y2="112" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arr-gray)" />

              {/* Strategy / MSTR */}
              <rect x="18" y="114" width="96" height="46" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
              <text x="66" y="133" textAnchor="middle" fontSize="11" fill="#cbd5e1" fontWeight="600">Strategy</text>
              <text x="66" y="150" textAnchor="middle" fontSize="9.5" fill="#64748b">MSTR</text>

              {/* Preferred Issues */}
              <rect x="188" y="114" width="106" height="54" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
              <text x="241" y="131" textAnchor="middle" fontSize="10.5" fill="#cbd5e1" fontWeight="600">Preferred Issues</text>
              <text x="241" y="148" textAnchor="middle" fontSize="9.5" fill="#94a3b8">STRC &#183; STRD</text>
              <text x="241" y="162" textAnchor="middle" fontSize="9.5" fill="#94a3b8">STRK &#183; STRF</text>

              {/* Arrow Strategy → BTC */}
              <line x1="88" y1="161" x2="116" y2="198" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arr-gray)" />
              {/* Arrow Preferred → BTC */}
              <line x1="218" y1="170" x2="196" y2="198" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arr-gray)" />

              {/* Bitcoin Stack */}
              <rect x="58" y="200" width="198" height="52" rx="5" fill="#1a1f2e" stroke="#475569" strokeWidth="1.5" />
              <text x="157" y="222" textAnchor="middle" fontSize="12" fill="#94a3b8" fontWeight="700">Bitcoin Stack</text>
              <text x="157" y="240" textAnchor="middle" fontSize="10" fill="#64748b">Accumulate. No outflow.</text>

              {/* Never sell banner */}
              <rect x="58" y="264" width="198" height="38" rx="5" fill="#450a0a" stroke="#991b1b" strokeWidth="1.2" />
              <text x="157" y="280" textAnchor="middle" fontSize="11" fill="#fca5a5" fontWeight="700">&#34;We will never sell&#34;</text>
              <text x="157" y="295" textAnchor="middle" fontSize="9.5" fill="#f87171">Saylor&apos;s repeated public position</text>

              <text x="157" y="336" textAnchor="middle" fontSize="10" fill="#6b7280">One-directional. Bitcoin only flows in.</text>
              <text x="157" y="352" textAnchor="middle" fontSize="10" fill="#6b7280">No mechanism to fund preferred payments</text>
              <text x="157" y="368" textAnchor="middle" fontSize="10" fill="#6b7280">from the Bitcoin stack itself.</text>

              {/* ── DIVIDER ── */}
              <line x1="330" y1="10" x2="330" y2="440" stroke="#374151" strokeWidth="1" strokeDasharray="5 4" />

              {/* ══ RIGHT PANEL: AFTER ══ */}
              <rect x="349" y="3" width="308" height="464" rx="8" fill="none" stroke="#f59e0b" strokeWidth="3" />
              <text x="503" y="26" textAnchor="middle" fontSize="12" fill="#f59e0b" fontWeight="700" letterSpacing="1.5">AFTER</text>

              {/* Capital Markets */}
              <rect x="443" y="38" width="120" height="32" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
              <text x="503" y="59" textAnchor="middle" fontSize="11" fill="#cbd5e1" fontWeight="600">Capital Markets</text>

              {/* CM → Strategy and Preferred */}
              <line x1="486" y1="70" x2="428" y2="90" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arr-gray)" />
              <line x1="522" y1="70" x2="570" y2="90" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arr-gray)" />

              {/* Strategy / MSTR */}
              <rect x="362" y="90" width="96" height="46" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
              <text x="410" y="109" textAnchor="middle" fontSize="11" fill="#cbd5e1" fontWeight="600">Strategy</text>
              <text x="410" y="126" textAnchor="middle" fontSize="9.5" fill="#64748b">MSTR</text>

              {/* Preferred Issues */}
              <rect x="530" y="90" width="112" height="54" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
              <text x="586" y="109" textAnchor="middle" fontSize="10.5" fill="#cbd5e1" fontWeight="600">Preferred Issues</text>
              <text x="586" y="126" textAnchor="middle" fontSize="9.5" fill="#94a3b8">STRC &#183; STRD</text>
              <text x="586" y="140" textAnchor="middle" fontSize="9.5" fill="#94a3b8">STRK &#183; STRF</text>

              {/* Buybacks → Strategy: tip stops at Strategy bottom (y=136) */}
              <line x1="440" y1="164" x2="436" y2="138" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr-purple)" />
              {/* Buybacks → Preferred: tip stops at Preferred bottom (y=144) */}
              <line x1="566" y1="164" x2="570" y2="146" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr-purple)" />

              {/* Buybacks box: y=164–220 */}
              <rect x="428" y="164" width="150" height="56" rx="5" fill="#1a1a2e" stroke="#8b5cf6" strokeWidth="1.8" />
              <text x="503" y="183" textAnchor="middle" fontSize="11" fill="#c4b5fd" fontWeight="700">Buybacks</text>
              <text x="503" y="198" textAnchor="middle" fontSize="9" fill="#a78bfa">STRC · MSTR repurchases</text>
              <text x="503" y="208" textAnchor="middle" fontSize="8" fill="#a78bfa">direct — bypasses reserve</text>

              {/* Strategy → BTC Stack: tip stops at BTC top (y=240) */}
              <line x1="378" y1="136" x2="416" y2="238" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arr-gray)" />
              {/* Preferred → BTC Stack: tip stops at BTC top (y=240) */}
              <line x1="600" y1="144" x2="585" y2="238" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arr-gray)" />

              {/* BTC → Buybacks: 20px gap; tip stops at Buybacks bottom (y=220) */}
              <line x1="503" y1="240" x2="503" y2="222" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arr-gold)" />

              {/* Bitcoin Stack: y=240–288 (20px below Buybacks bottom 220) */}
              <rect x="398" y="240" width="210" height="48" rx="5" fill="#1a1f2e" stroke="#f59e0b" strokeWidth="1.8" />
              <text x="503" y="260" textAnchor="middle" fontSize="12" fill="#fde047" fontWeight="700">Bitcoin Stack</text>
              <text x="503" y="278" textAnchor="middle" fontSize="10" fill="#f59e0b">Primary reserve. Active capital.</text>

              {/* BTC → USD Reserve: 20px gap; tip stops at USD Reserve top (y=308) */}
              <line x1="503" y1="288" x2="503" y2="306" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arr-gold)" />

              {/* USD Reserve: y=308–364 (20px below BTC bottom 288) */}
              <rect x="428" y="308" width="150" height="56" rx="5" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
              <text x="503" y="327" textAnchor="middle" fontSize="11" fill="#86efac" fontWeight="700">USD Reserve</text>
              <text x="503" y="342" textAnchor="middle" fontSize="9" fill="#4ade80">$2.55bn · ~17 months cover</text>
              <text x="503" y="353" textAnchor="middle" fontSize="8.5" fill="#4ade80">preferred divs + interest</text>

              {/* Green return: USD Reserve right (578, centre y=336) → across → up → Preferred bottom (y=144) */}
              <path d="M 578 336 L 622 336 L 622 146" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr-green)" />

              {/* Notes */}
              <text x="503" y="382" textAnchor="middle" fontSize="9" fill="#6b7280">USD Reserve: ring-fenced for preferred divs &amp; interest.</text>
              <text x="503" y="396" textAnchor="middle" fontSize="9" fill="#6b7280">Buybacks: BTC sold directly — bypasses the reserve.</text>

              {/* Legend */}
              <text x="503" y="416" textAnchor="middle" fontSize="9" fill="#4b5563">── Gray: capital markets / issuance</text>
              <text x="503" y="430" textAnchor="middle" fontSize="9" fill="#f59e0b">- - Gold dashed: BTC monetisation (board-authorised)</text>
              <text x="503" y="444" textAnchor="middle" fontSize="9" fill="#22c55e">- - Green dashed: USD Reserve → preferred dividends</text>
              <text x="503" y="458" textAnchor="middle" fontSize="9" fill="#8b5cf6">- - Purple dashed: buyback repurchases (direct)</text>
            </svg>
          </div>

          <h2>The words that define the shift</h2>
          <p>CEO Phong Le&apos;s statement from the press release is the clearest articulation of what has changed: <em>&quot;Strategy is evolving from one-way capital issuance to active capital management. We intend to move between issuing securities when capital is attractive and repurchasing securities when our instruments trade at levels that make buybacks accretive.&quot;</em></p>
          <p>That is exactly the transition the diagram above is showing. The old model had one gear: issue capital, buy Bitcoin, repeat. The new one has two gears — issue when conditions favour it, repurchase when they don&apos;t — with the Bitcoin stack now acting as a reserve that can be partially monetised to fund whichever gear is turning.</p>
          <p>Saylor added his own framing: <em>&quot;Strategy remains committed to Bitcoin as its primary treasury reserve asset. At the same time, Digital Credit requires liquidity, discipline, and active capital management.&quot;</em> The phrase <em>active capital management</em> is doing a lot of work in that sentence. Since 2020 the model was passive: buy Bitcoin, never sell it. That line is the first formal acknowledgement that running a large preferred equity programme is a management challenge in its own right, not a side effect of owning Bitcoin.</p>

          <h2>My honest read</h2>
          <p>The $2.55 billion ring-fence is meaningful. It is not a promise to top it up indefinitely — it is a snapshot of what is in the box today, with a governance constraint saying only two things can take money out without a fresh board vote. That is a material new constraint on what management can do with that cash. The combined figure of 25.9 months of coverage ($3.80 billion including BTC monetisation capacity) is actually a more reassuring number than the 17.4 months from the reserve alone — but it only holds if management is willing to sell Bitcoin when needed, and the size of any BTC sale would be at prices that may well be lower than today&apos;s. If the Bitcoin price falls further, the 25.9 months of coverage shrinks too.</p>
          <p>What the framework doesn&apos;t do is fully answer the long-term question: can STRC return to $100 and stay there? The ATM flywheel that was meant to do that job is still seized as long as the price is below par. The $1 billion buyback authorisation could lift the price mechanically, but it&apos;s a billion dollars against a market that has been under sustained pressure. I think this framework buys time and establishes discipline — both of which were needed. Whether it reboots the par-defence mechanism entirely is a different question, and time will answer it.</p>
          <p>STRC closed yesterday at around $83.60 — a meaningful recovery from the low $70s, but still around 16% below par. The new framework explains why a floor appeared when it did. Whether it explains why the price should climb all the way back to $100 is a question I&apos;m holding open for now. That is why I called this piece Strategy Transforms rather than Strategy Recovers — the capital playbook has genuinely changed; the price still has work to do.</p>
          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). Everything above is how I read yesterday&apos;s announcement myself — it isn&apos;t financial advice.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. STRC is a speculative investment and can be volatile. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'storm-in-a-teacup',
    title: 'A Storm in a Teacup',
    metaTitle: 'A Storm in a Teacup — STRC and SATA on Triple-Witching Day',
    date: '2026-06-19',
    excerpt: "On Thursday's triple-witching session STRC fell to a record low and SATA broke par — then both clawed most of it back. Here is what actually happened, why Strive and Strategy responded so differently, and what STRC's own prospectus warned all along.",
    readTime: '6 min read',
    category: ['STRC', 'SATA'],
    Content() {
      return (
        <>
          <p>For two instruments sold on the promise of sitting still, STRC and SATA had a loud Thursday. STRC dropped about 7% intraday to a record low in the low $80s; SATA, which had been holding its $100 par, fell through it. By the close both had clawed most of it back. If you only saw the headlines you&apos;d have thought something broke — but watch how the day actually unfolded and it looks far more like a storm in a teacup. The interesting part isn&apos;t the drop. It&apos;s what it revealed about who owns these things and what they were told when they bought.</p>

          <h2>Why Thursday was always going to be messy</h2>
          <p>Thursday was triple-witching day. Four times a year — normally the third Friday of March, June, September and December — three classes of derivatives expire at once: stock options, stock-index futures, and stock-index options. Traders unwind and roll enormous positions into that expiry, and the result is reliably heavier volume and sharper price swings, often with little to do with any company&apos;s fundamentals. This quarter it landed a day early: the third Friday is the 19th, which is the Juneteenth market holiday, so the whole circus was pulled forward to Thursday the 18th. So the volatility wasn&apos;t a surprise — it was on the calendar. That matters for how you read STRC and SATA&apos;s moves, because some of what hit them on Thursday was simply the tide of expiry, not a verdict on either stock.</p>

          <h2>What actually happened</h2>
          <p>Bitcoin set the tone. From Wednesday&apos;s close it fell as much as 3% during Thursday&apos;s session before recovering part of it, finishing the day down about 2%. That&apos;s a routine move for Bitcoin — but STRC and SATA are built to be calmer than the asset underneath them, and on a witching day that gap got stress-tested.</p>
          <p>STRC went into Thursday at a Wednesday close of $89 — already below its $100 stated amount. It then fell to a record low of <strong>$82.50</strong>, roughly 7% down, before grinding virtually all the way back to where it started the day. SATA had it worse on paper: it began from exactly $100, its par value, dropped about 7% to an intraday low of <strong>$92.88</strong>, and recovered less convincingly, closing at <strong>$97.71</strong> — down about 2.3% on the day, and back to within 1.3% of Strive&apos;s $99–$101 target range. You can see both on the <a href="/strc">STRC</a> and <a href="/sata">SATA</a> hubs, and the intraday context on the <a href="/chart?stock=strc">price chart</a>. The pattern is the same for both: a violent dip into the expiry, then a recovery as the witching pressure cleared. SATA simply didn&apos;t close the gap as cleanly.</p>

          <h2>Two CEOs, two playbooks</h2>
          <p>The response told its own story. Within hours of the close, Strive came out swinging — and not with one voice but two. Chief executive Matt Cole <a href="https://x.com/ColeMacro/status/2067703328314904815">posted first</a>, putting a name to the day:</p>
          <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', margin: '1.5rem 0' }}>
            <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-primary)' }}>&quot;Today was the most difficult day in the history of Digital Credit. $STRC traded as low as $82.50 before recovering sharply. $SATA traded from par down to the low 90s before also rebounding&hellip; What happened today was a leverage liquidation event, not a deterioration in underlying credit quality. There is an old saying in income markets that the road to hell is paved with carry.&quot;</p>
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.85em', color: 'var(--text-muted)' }}>— Matt Cole, CEO of Strive (@ColeMacro)</p>
          </div>
          <p>It is a distinction worth holding onto: a liquidation event and a credit event are not the same thing. Investors had borrowed against these &quot;stable&quot; yields to squeeze out extra carry; when the witching-day move went against them, the leveraged holders were forced to sell, and the selling fed on itself — none of which says anything about whether Strive can actually pay. Chief risk officer Jeff Walton <a href="https://x.com/PunterJeff/status/2067753978604245209">followed with the data</a> to back it up:</p>
          <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', margin: '1.5rem 0' }}>
            <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-primary)' }}>&quot;$SATA traded $153 Million in volume&hellip; roughly 20% of the entire $SATA supply&hellip; For large institutional capital, Liquidity is the whole question. Liquidity is what determines how large a position you can build, and how quickly you can exit it, without moving the market against yourself. A day like today is a real world test of Liquidity, not necessarily Credit.&quot;</p>
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.85em', color: 'var(--text-muted)' }}>— Jeff Walton, Chief Risk Officer, Strive (@PunterJeff)</p>
          </div>
          <p>Walton&apos;s point is that the tape tested how easily you can get in and out, not the issuer&apos;s health — and on that measure the instruments passed. STRC turned over about $941 million, its fourth-busiest day on record, and both stocks found bids the whole way down. I think he&apos;s right that liquidity, not credit, was the story on Thursday. Whether you find &quot;a leverage flush proves the collateral is trusted&quot; genuinely reassuring or a shade too convenient probably depends on whether you were the one being liquidated.</p>
          <p>Strategy, by contrast, said nothing on Thursday that I noticed. Michael Saylor only weighed in <a href="https://x.com/saylor/status/2067861414069375418">the next morning</a>, and where Strive had written essays, he wrote five lines:</p>
          <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', margin: '1.5rem 0' }}>
            <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-primary)' }}>&quot;Markets are closed today. Volatility is never easy. Bitcoin keeps working. So do we. Thank you for your support.&quot;</p>
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.85em', color: 'var(--text-muted)' }}>— Michael Saylor (@saylor)</p>
          </div>
          <p>No data, no rebuttal, no defence of the credit — and notice he picked a day the market was already shut to say it. &quot;Volatility is never easy&quot; is a quiet concession that the calm instrument had a stormy day, but the brevity is the real message: nothing here, in his telling, is worth a thousand-word explanation. That split in tone is the tell. Strive answered fast, loudly and twice over — the reflex of a firm whose holders include a lot of retail investors who watched Thursday&apos;s candle with their stomach in knots and needed steadying. Strategy let a day pass and then shrugged in five lines, which fits a holder base skewing more institutional — people who have sat through a hundred witching days and don&apos;t need their hand held when a preferred wobbles into an options expiry. Same event, two very different audiences, two very different playbooks.</p>

          <h2>Was anyone warned? Straight from the prospectus</h2>
          <p>Saylor&apos;s &quot;volatility is never easy&quot; concession drew the obvious retort — and critics like Peter Schiff seized on it — that you can&apos;t sell a stock on its stability and then ask holders to stomach the swings. So I went back to STRC&apos;s prospectus to see whether that risk was ever actually disclosed to prospective buyers. It was, in black and white. The risk factors state that because Strategy can change the dividend rate for any reason, &quot;the trading price of the STRC Stock could be significantly volatile,&quot; and that the company &quot;may be unsuccessful in achieving, or may abandon, our current intention of adjusting the regular dividend rate&quot; in a way designed to keep STRC &quot;near its stated amount of $100 per share.&quot; It even spells out that increased volatility could cause &quot;wide fluctuations in the implied yield&quot; and uncertainty over &quot;the price at which investors may resell their STRC Stock, if at all.&quot;</p>
          <p>So Friday&apos;s message wasn&apos;t new information — it was the fine print all along. My honest read is that this is a marketing-versus-disclosure gap, not a deception: the pitch leaned on stability and the $100 anchor, while the legal document hedged every word of it. The lesson is the unglamorous one I keep coming back to — read the risk factors before you read the yield. I unpack how the par-defence mechanism is meant to work in <a href="/blog/how-strc-works">how STRC works</a> and the exact rate-setting framework in <a href="/blog/strc-vwap-dividend-mechanism">how STRC&apos;s rate is set</a>.</p>

          <h2>The harder question: can it still climb back to par?</h2>
          <p>All of that rests on one assumption — that the price climbs back to $100. It usually has, and there used to be a dependable engine behind it. When STRC and SATA paid monthly, demand bunched up around each record date: buyers piled in to capture the coming dividend, and that recurring surge of dividend-capture flow helped haul the price back towards par every cycle. Once it was at $100, the issuer could lean on its at-the-market program, sell fresh shares at around par, and recycle the cash into more Bitcoin. A tidy flywheel — the dividend pulled the price up, and the price let them raise and buy.</p>
          <p>But both instruments have just changed the cadence. STRC moved to twice-monthly dividends earlier this month, and SATA now pays daily. Spreading the dividend across many small, frequent payouts smooths the calendar — there&apos;s no single fat record date left to front-run. The trade is a big, concentrated demand spike for a thinner, more continuous trickle of buying. Steadier, maybe. But I&apos;m genuinely unsure that trickle is concentrated enough to heave the price back to $100 the way the old monthly rush did — and if it isn&apos;t, &quot;below par&quot; could settle in as a state rather than a passing dip. That would also gum up the raise-and-buy flywheel, which only turns when the price is near par. It&apos;s the open question hanging over both stocks right now, and honestly, time will tell.</p>

          <h2>So — storm in a teacup?</h2>
          <p>Mostly, yes. The volatility is real, but on Thursday it was largely mechanical: a witching-day air pocket, deepened by leveraged holders being flushed, that both stocks recovered from within hours. And here&apos;s the part I find genuinely interesting. A forced-selling cascade hands the discount straight to whoever is patient enough to take the other side. If the price is going to keep snapping back towards $100, then STRC at $82.50 isn&apos;t only a fright — it&apos;s an 11.50% coupon bought on a far lower outlay, with a potential capital gain on top if it reverts to par, plus the dividends accruing the whole time. That asymmetry — limited downside if the par mechanism holds, a clear gain if it pulls back up — is the reward on offer to anyone willing to step in when others are being margin-called.</p>
          <p>The caveat I&apos;d hold onto: &quot;virtually recovered this time&quot; is not a guarantee, and STRC has spent stretches below par for weeks, not hours. The par anchor is an intention, not a promise — the prospectus says so itself. If you want to put numbers on the discount-to-par idea, the <a href="/projector?stock=strc">Growth Projector</a> models it out, and the <a href="/vs-treasuries?stock=strc">vs Treasuries</a> page is the honest yardstick for whether the extra yield pays you enough for days like Thursday.</p>
          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). Everything above is how I read Thursday&apos;s session myself — it isn&apos;t financial advice.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. STRC and SATA are speculative investments and can be volatile. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'what-is-preferred-stock',
    title: 'What Is Preferred Stock? A Basic Guide',
    metaTitle: 'What Is Preferred Stock? An Introduction',
    date: '2026-03-10',
    excerpt: 'Strategy raised $2.5bn from a single preferred-stock IPO — so what exactly is preferred stock? The basic framework I use to size up STRC and SATA, from par and priority to cumulative dividends and effective yield.',
    readTime: '6 min read',
    category: 'Education',
    Content() {
      return (
        <>
          <p>When Strategy pulled in about $2.5 billion from a single preferred-stock IPO in July 2025, plenty of investors had the same first reaction I did: what exactly <em>is</em> this thing? Preferred stock lives in the gap between the two securities most people know — common stock and bonds — and borrows features from both. It&apos;s now how companies like Strategy and Strive raise billions, and it&apos;s the foundation under STRC and SATA, the instruments I track on this site.</p>

          <h2>Where preferred stock sits in the capital structure</h2>
          <p>A company raising money has three broad options: borrow through bonds, sell ownership through common stock, or issue preferred stock — the middle path. The word &quot;preferred&quot; is about payment priority. When dividends are paid, or if the company is wound up, preferred holders get paid before common shareholders; bondholders still rank above them. So preferred equity sits in the middle of the stack — better protected than common stock, behind the debt. If you want to see that drawn out for a real issuer, I broke down <a href="/blog/strategy-capital-structure">Strategy&apos;s seven-layer capital stack</a> separately.</p>

          <h2>Fixed dividends, and why income investors care</h2>
          <p>Preferred stock pays a <strong>fixed dividend</strong>, set as a percentage of the par (issue) price and agreed at issuance — it doesn&apos;t rise and fall with quarterly profits the way a common dividend can. In exchange, preferred holders usually get <strong>no vote</strong>. For someone buying for cash flow rather than control, that&apos;s an easy trade, and it&apos;s the whole appeal: a known, repeatable payment.</p>

          <h2>Cumulative versus non-cumulative</h2>
          <p>The single most important difference between two preferreds that otherwise look identical is whether the dividend is <strong>cumulative</strong> or <strong>non-cumulative</strong>. With cumulative preferred, a missed payment doesn&apos;t disappear — it accrues as an obligation that has to be cleared before common shareholders see a penny. With non-cumulative, a skipped dividend is simply gone.</p>
          <p>This is the first box I tick on any preferred, because it&apos;s where the real downside protection lives. Before buying any income instrument — STRC, SATA or anything else — it&apos;s worth finding this one line in the prospectus and knowing which side it falls on.</p>

          <h2>Perpetual versus term</h2>
          <p><strong>Perpetual</strong> preferred has no maturity date: the dividends run indefinitely and there&apos;s no built-in redemption to anchor the price. <strong>Term</strong> preferred redeems at par on a set date, like a bond. STRC and SATA are both perpetual — which is exactly why your real return hinges on the <a href="/blog/what-is-effective-yield">effective yield</a> (the dividend measured against the price you actually paid), not just the headline rate.</p>

          <h2>How preferred stock compares to bonds</h2>
          <p>A bond is debt: the issuer is legally bound to pay interest and return principal, and a miss is a default. A preferred dividend is an equity payment that can, in theory, be suspended without triggering default. In practice issuers guard these payments fiercely — skipping one wrecks your ability to raise the next round of capital, and these companies raise capital almost constantly.</p>
          <p>To compensate investors for bearing slightly more risk than bondholders, preferred stock typically carries a <strong>higher yield</strong> than bonds from the same issuer. This yield premium is the return for accepting a lower position in the capital stack.</p>

          <h2>The adjustable-rate twist — and why STRC&apos;s rate keeps moving</h2>
          <p>Some preferred carries a variable rate that resets to keep the price near par. STRC is the clearest example I follow. Since its July 2025 IPO the rate has stepped up almost every month — 9% → 10% → 10.25% → 10.50% → 11% → 11.25% → 11.50% — each bump nudging the price back towards its $100 par. When it drifts below par the rate rises to attract buyers; above par, it eases off. You can watch the whole history on the <a href="/dividends?stock=strc">STRC dividend page</a>.</p>

          <h2>What I actually look at</h2>
          <p>When I&apos;m weighing up STRC or SATA, three numbers do most of the work: the <strong>stated yield</strong> (annual dividend ÷ par), the <strong>effective yield</strong> (annual dividend ÷ the price you pay), and <strong>par proximity</strong> (how close it&apos;s trading to its issue price right now). The <a href="/strc">STRC</a> and <a href="/sata">SATA</a> hubs show all three live. Get comfortable with those and you&apos;ll know exactly what you&apos;re holding — and why, with a preferred, the price you pay matters as much as the dividend rate.</p>
          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). The way I&apos;ve framed preferred equity above is how I personally think about it — it isn&apos;t financial advice.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Past performance is not indicative of future results. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'how-strc-works',
    title: "How STRC Works: Strategy's Perpetual Preferred Stock Explained",
    metaTitle: 'How STRC Works — Strategy Preferred Stock',
    date: '2026-03-17',
    excerpt: "STRC is a perpetual preferred stock issued by Strategy — the world's largest corporate Bitcoin holder. Here's how the instrument is structured, what backs the dividend, and how the adjustable-rate mechanism works.",
    readTime: '6 min read',
    category: 'STRC',
    Content() {
      return (
        <>
          <p>STRC has done something most stocks never do. Since it listed in July 2025 its dividend rate has climbed from 9% to 11.50% a year, and through every one of those step-ups the price has barely strayed from $100. The first time I sat with that chart I had the obvious question: how does an instrument pay double-digit income and still sit flat? The answer is entirely in how STRC is built — and it's worth understanding before you treat it as a place to park cash.</p>

          <h2>Why Strategy issues it in the first place</h2>
          <p>Strategy — the company Michael Saylor turned from a business-intelligence software firm into the largest corporate Bitcoin holder in the world — needs capital, more or less constantly, to keep buying Bitcoin. It has three ways to raise it: borrow through debt, sell common stock, or issue preferred equity. STRC is the preferred-equity route. Strategy takes your money, hands you a fixed monthly income stream, and puts the proceeds towards more Bitcoin.</p>
          <p>What I like about this from the issuer's side tells you something as an investor: preferred lets Strategy raise money without diluting common shareholders and without the hard repayment deadline that comes with debt. That flexibility is exactly why these payments tend to be defended — the model only works if the company can keep coming back to the well, and a skipped preferred dividend slams that door. If you want the full ranking, I mapped out <a href="/blog/strategy-capital-structure">Strategy's seven-layer capital stack</a> separately.</p>

          <h2>The structure: $100 par, paid monthly</h2>
          <p>STRC is <strong>perpetual</strong> preferred stock with a <strong>$100 par value</strong> and no maturity date — there's no point in the future where Strategy hands you $100 back, so the dividend is the whole return. The rate is reviewed every month. It currently sits at <strong>11.50%</strong>, which works out to roughly <strong>$0.958 per share each month</strong>, or $11.50 a year, paid in cash directly to holders.</p>

          <h2>Why the price barely moves</h2>
          <p>The flat price isn't luck — it's the design. A traditional fixed-rate preferred drifts a long way from par as interest rates move around it, because the dividend is stuck while the world changes. STRC instead adjusts the rate to chase the price. Drift below $100 and the rate steps up to pull buyers back in; trade above $100 and it eases off. The practical effect is an instrument that behaves far more like a cash holding than like a normal stock. The exact bands and the five-day VWAP window that triggers each move are worth a read on their own — I broke that down in <a href="/blog/strc-vwap-dividend-mechanism">how STRC's rate is actually set</a>.</p>

          <h2>The rate has only gone one way so far</h2>
          <p>STRC came to market in July 2025 at 9% and has been stepped up almost every month since:</p>
          <ul>
            <li>July 2025: 9.00%</li>
            <li>August 2025: 10.00%</li>
            <li>September 2025: 10.25%</li>
            <li>October 2025: 10.50%</li>
            <li>November 2025: 11.00%</li>
            <li>December 2025: 11.25%</li>
            <li>March 2026: 11.50%</li>
          </ul>
          <p>Seven moves, every one of them up. I read that as steady downward pressure on the price — demand for the shares hasn't kept pace with issuance, so the rate has had to keep rising to hold par. That's not a criticism; it's the mechanism doing its job. But it's a useful reminder that &quot;stable price&quot; here is bought with a rising payout, not free.</p>

          <h2>Stated yield versus what you actually earn</h2>
          <p>At exactly $100, your yield equals the stated 11.50%. Buy on the open market, though, and the price you pay decides your real return. Pick up shares at $98 and your <a href="/blog/what-is-effective-yield">effective yield</a> is 11.50 ÷ 98 ≈ 11.73%; pay $102 and it slips below the headline. With a perpetual preferred there's no redemption at par to pull you back, so this is the number I actually watch — the entry price matters as much as the rate. The <a href="/chart?stock=strc">STRC yield chart</a> shows how effective yield has moved over time, and the <a href="/strc">STRC hub</a> carries both figures live.</p>

          <h2>What's actually behind the dividend</h2>
          <p>Strategy still earns some revenue from software, but make no mistake about what sits under STRC: a balance sheet dominated by Bitcoin. The ability to keep paying depends on Strategy's overall financial position and its continued access to capital markets — which is to say, indirectly, on Bitcoin doing its job. And because this is preferred equity, the dividend is an obligation the company can suspend without it counting as a default, the way missing a bond coupon would. The strong practical incentive to never do that is real, but it isn't a legal guarantee, and I think anyone holding STRC should be clear-eyed that the safety here is reputational and commercial, not contractual.</p>

          <h2>How I model it</h2>
          <p>Once you understand the mechanics, the question becomes what it does to a real balance over time. The <a href="/projector?stock=strc">STRC Growth Projector</a> takes an investment amount and a 1–20 year horizon and shows the outcome with and without dividend reinvestment, pre-filled with the current live effective yield. The <a href="/vs-treasuries?stock=strc">vs Treasuries</a> page lines STRC up against traditional income benchmarks, which is the honest way to judge whether the extra yield is worth the extra risk.</p>
          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). The way I've framed STRC above is how I personally think about it — it isn't financial advice.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. STRC is a speculative investment. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'bitcoin-treasury-companies',
    title: 'Bitcoin Treasury Companies and Why They Issue Preferred Equity',
    metaTitle: 'Bitcoin Treasury Companies Explained',
    date: '2026-03-25',
    updated: '2026-06-19',
    excerpt: "Bitcoin doesn't pay a dividend — so why do the companies hoarding it pay income investors 11.5% to 13%? The logic of the Bitcoin-treasury model, why preferred equity like STRC and SATA exists, and what actually backs the dividend.",
    readTime: '7 min read',
    category: 'Education',
    Content() {
      return (
        <>
          <p>STRC pays 11.5% a year right now, and SATA pays 13%. The question that stuck with me when I first started following them wasn&apos;t whether those yields were safe — it was simpler: why is a company built around Bitcoin so keen to pay out this much income in the first place? Bitcoin itself pays no dividend. So why would the businesses hoarding it hand double-digit cash yields to income investors? The answer is the whole logic of the Bitcoin-treasury model, and STRC and SATA — the two instruments I track on this site — are what falls out of it.</p>

          <h2>What a Bitcoin treasury company actually is</h2>
          <p>A Bitcoin treasury company holds Bitcoin as its dominant balance-sheet asset — ahead of cash, bonds, or anything a normal corporate treasurer would reach for. The thesis, which Strategy&apos;s Michael Saylor has spent years hammering home, is that Bitcoin&apos;s fixed supply makes it a better long-term store of value than currencies a central bank can simply print more of. These firms raise money for one purpose: to buy and hold more Bitcoin. Their share price then largely rises and falls with the value of that stack.</p>
          <p>It is worth pausing on how strange this is. Traditional treasury management exists to do the opposite — preserve capital and keep cash liquid and boring. A Bitcoin treasury company deliberately swaps that safety for volatility because it believes the asset on the other side is worth it. Whether or not you buy the thesis, it is a genuinely new kind of company, and the income instruments it has spawned are new too.</p>

          <h2>Three ways to buy Bitcoin with other people&apos;s money</h2>
          <p>These companies can&apos;t throw off enough cash from their actual operations to fund Bitcoin purchases at the scale they want, so they go to the capital markets. There are really three doors:</p>
          <ol>
            <li><strong>Common stock</strong> — raises cash fast, but dilutes everyone who already owns shares.</li>
            <li><strong>Convertible debt</strong> — bonds that can turn into equity later; cheap up front, but a future obligation that has to be repaid or converted.</li>
            <li><strong>Preferred equity</strong> — instruments like <a href="/strc">STRC</a> and <a href="/sata">SATA</a> that raise capital at a fixed yield without diluting common holders and without debt&apos;s hard repayment date.</li>
          </ol>
          <p>Preferred is the one I find most interesting, because it is the elegant compromise. The issuer gets capital without giving away ownership or signing up to a repayment deadline; the investor gets a known, repeatable cash yield instead of a bet on the share price. If you want the mechanics of how preferred sits between common stock and bonds, I laid that out in <a href="/blog/what-is-preferred-stock">what is preferred stock</a>.</p>

          <h2>Why the yields are so fat</h2>
          <p>An 11.5% to 13% cash yield is not normal for preferred stock — conventional preferreds pay a fraction of that. Two things explain the gap. The first is plain risk: heavy Bitcoin exposure, business models with barely any track record, and balance sheets that swing with a famously volatile asset all mean investors demand a hefty premium before they will part with their money this way.</p>
          <p>The second reason is the one people miss — these instruments are competing with Bitcoin itself. Anyone weighing up STRC could instead just buy Bitcoin and reach for the upside. To pull that capital towards a fixed-income instrument, the yield has to be loud enough to be worth giving up the lottery ticket. So the fat yield isn&apos;t generosity; it is the price the issuer has to pay to win the argument against simply owning more BTC.</p>

          <h2>What actually backs the dividend</h2>
          <p>Here is the distinction that matters most, and the one most easily fudged. The dividend you receive is paid from cash and cash flow — not directly out of Bitcoin. Strategy and Strive don&apos;t sell a sliver of BTC every month to fund your payment; it comes from reserves and from the capital they keep raising. So the <strong>payment</strong> is a cash question. The <strong>health of the company standing behind it</strong>, though, is a Bitcoin question — if the price collapses and stays down, the balance sheet weakens even while near-term cash can still cover the dividend.</p>
          <p>That split is the whole game for an income buyer. A short Bitcoin dip is mostly noise; a long, grinding bear market is the real risk, because it erodes the backing and the ability to raise fresh capital at the same time. I dug into exactly where these dividends rank against everything else a company owes in <a href="/blog/strategy-capital-structure">Strategy&apos;s capital structure</a>, and into the instrument itself in <a href="/blog/how-strc-works">how STRC works</a>.</p>

          <h2>The two issuers I follow</h2>
          <p><strong>Strategy</strong> (formerly MicroStrategy) wrote the playbook. It began buying Bitcoin in August 2020 under Michael Saylor, the first major public company to make BTC its primary reserve asset, and now holds more than 800,000 BTC — more than anyone else listed. <a href="/strc">STRC</a>, its perpetual preferred, launched in July 2025 and has ratcheted its rate up steadily since. Strategy&apos;s approach is close to all-in: maximum Bitcoin, financed by a stack of instruments layered on top of it.</p>
          <p><strong>Strive</strong>, founded in 2022, comes at it more cautiously. <a href="/sata">SATA</a>, its preferred equity, pairs a Bitcoin treasury with a deliberately conservative cash buffer — Strive has pointed to holding 13,000-plus BTC alongside something like 18 months of cash reserves, specifically so it can keep paying the dividend through a Bitcoin downturn. That dual-asset design — Bitcoin for the long-term bet, cash for the near-term promises — is the real difference between SATA and STRC, and it is why I read SATA&apos;s pitch as the more income-investor-friendly of the two, at least on paper.</p>

          <h2>What it means if you&apos;re buying for income</h2>
          <p>Buy STRC or SATA and you are not buying a bond, and you are not buying a conventional preferred. You are buying a high cash yield strapped to a company whose fortunes track Bitcoin and whose business model is still being stress-tested in public. That earns you more income than a traditional preferred — but the extra yield is not a free lunch, it is payment for genuinely higher risk. The number that decides what you actually earn, incidentally, is the price you pay going in; I&apos;d get comfortable with <a href="/blog/what-is-effective-yield">effective yield</a> before treating either one as an income substitute.</p>
          <p>My own take is that these are worth understanding on their own terms rather than filing under &quot;safe income.&quot; Treated as what they are — a new, higher-risk category that happens to pay like a junk bond and move like a crypto proxy — they can earn a place in an income portfolio. Treated as a savings account with a better rate, they will eventually teach you the difference the hard way.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). Everything above is how I think about the Bitcoin-treasury model myself — it isn&apos;t financial advice.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'what-is-effective-yield',
    title: 'What Is Effective Yield and Why It Matters for Income Investors',
    metaTitle: 'Effective Yield for Income Investors',
    date: '2026-04-04',
    excerpt: "Two people buy the same stock at different prices and earn different returns on the identical dividend. That gap — effective yield — is the first number I check on any income instrument, and it's almost never the rate in the headline.",
    readTime: '5 min read',
    category: 'Education',
    Content() {
      return (
        <>
          <p>Two people buy the same preferred stock. One pays $100 a share; the other waits and pays $95. They collect the identical dividend every month — and yet they are not earning the same return. The one who paid less earns more, on every single dollar, for as long as they both hold. That gap is the most useful idea I know for buying income, and it has a name: <strong>effective yield</strong>. It is the first number I work out before I take any income instrument seriously, and it is almost never the number in the headline.</p>

          <h2>Stated yield versus effective yield</h2>
          <p>The <strong>stated yield</strong> — the coupon, the rate everyone quotes — is the annual dividend measured against the <em>par</em> value the instrument was issued at. A preferred with a $100 par paying $13 a year has a stated yield of 13%, and that number is fixed for good the day it is issued.</p>
          <p>The <strong>effective yield</strong> is the same dividend measured against the <em>price you can actually buy it at today</em>. If that $13 stock is trading at $95, the effective yield is 13 &divide; 95 = 13.68%. At $106 it is 13 &divide; 106 = 12.26%. The dividend has not budged — only the price has, and that alone moves what a new buyer earns. Stated yield is the sticker on the box; effective yield is what you pay at the till.</p>

          <h2>Why the price wanders off par</h2>
          <p>A preferred trades on the open market like anything else, so its price drifts with supply and demand, interest-rate expectations, news about the issuer, and plain market mood. Even STRC, whose rate is reset to pull it back towards $100, still moves around in the meantime — and a conventional fixed-rate preferred can swing a long way when rates shift, because its dividend can&apos;t. The upshot is that effective yield almost never sits exactly on the stated rate, which is precisely why it is the one worth watching.</p>

          <h2>Effective yield is what you actually earn</h2>
          <p>When you buy STRC or SATA you buy at the market price, not at par, so your return is the effective yield at <em>your</em> entry — not the advertised rate. Pay $103 for a share that pays $11.50 a year and you are earning 11.17%, not 11.50%. It sounds trivial; on a large position it isn&apos;t. Flip it around and the point gets more interesting: if a wobble drops STRC to $97, a buyer there locks in about 11.86%, comfortably above the stated 11.50%. This is why I don&apos;t read a price dip below par as bad news — for a patient income buyer it is a higher yield on sale, as long as you understand that is what you are measuring. The mechanics of how STRC&apos;s rate chases par are in <a href="/blog/how-strc-works">how STRC works</a>.</p>

          <h2>Yield on cost: your number, and it is locked in</h2>
          <p>Here is the part people muddle. Once you have bought, your cost basis is fixed, and so is your <strong>yield on cost</strong> — the dividend as a percentage of what <em>you</em> paid. It does not move when the market price moves. Buy at $97 and watch the price climb to $104 later: you are still collecting the same cash per share, so your personal yield on cost is still about 11.86%. The live effective yield quoted on the site is aimed at someone buying <em>today</em> — it says nothing about what your existing position is earning. Your number was set the moment you bought.</p>

          <h2>Where I watch it</h2>
          <p>Two tools on the site lean on this directly. The effective-yield charts for <a href="/chart?stock=strc">STRC</a> and <a href="/chart?stock=sata">SATA</a> plot the figure over time: a rising line means the price has fallen against the dividend — better value for new money — while a falling line means it has gotten more expensive. A few months of that line tells you far more about whether today is a good entry than any single snapshot. And the <a href="/projector?stock=strc">Growth Projector</a> builds its compounding on effective yield rather than the par-based rate, so reinvested dividends are assumed to buy in at today&apos;s real yield. Over a ten- or twenty-year horizon even a small difference in that starting yield fans out into a very different end number — which is the whole reason I bother tracking it to the decimal.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). Effective yield is the first number I check on either one — but this is how I think about it, not financial advice.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'how-sata-works',
    title: 'How SATA Works: Income Backed by Bitcoin and Cash Reserves',
    metaTitle: 'How SATA Works — Bitcoin-Backed Income',
    date: '2026-05-23',
    updated: '2026-06-17',
    excerpt: "SATA is Strive's preferred equity instrument paying 13% per year — one of the highest yields available in listed preferred equity. Here's how it's structured, what backs the dividend, and why SATA is moving to daily payments from June 2026.",
    readTime: '7 min read',
    category: 'SATA',
    Content() {
      return (
        <>
          <p>SATA pays 13% a year, which puts it among the highest yields in listed preferred equity. Whenever a rate like that is on offer, the first question worth asking is the one most people skip past: what actually stands behind the payment? For SATA the answer comes in two parts — a holding of Bitcoin and a ring-fenced cash reserve — and that pairing is the reason I think it deserves to be understood on its own terms rather than lumped in with ordinary preferred shares.</p>

          <h2>Who is Strive?</h2>
          <p>SATA is issued by Strive Asset Management, a US investment firm founded in 2022 and built around Bitcoin as a core long-term holding. SATA is its preferred-equity instrument — a publicly traded security designed to pay a high, steady cash income, monthly today and moving to daily from June 2026. Put simply, SATA lets you earn a regular income from a Bitcoin-focused company without having to buy or hold any Bitcoin yourself.</p>

          <h2>The structure</h2>
          <p>SATA is publicly traded preferred equity with a <strong>$100 par value</strong> and a <strong>13% stated annual yield</strong>, paid monthly as a cash dividend of about <strong>$1.083 a share</strong>. Strive actively works to keep it trading in a tight $99–$101 band, leaning on market-making and its reserve policy to hold the line near par.</p>
          <p>It launched in <strong>November 2025</strong> at 12%, and the rate has climbed steadily since: 12% → 12.25% in January 2026 → 12.75% in March → 13% in April. Each step reflects Strive nudging the rate to keep the price anchored as the instrument finds its feet — the same drift-below-par-and-raise logic that governs most of these reset-style preferreds.</p>

          <h2>What actually backs the dividend</h2>
          <p>This is the part that sets SATA apart, and it rests on two quite different assets doing two different jobs.</p>
          <p>The first is <strong>Bitcoin</strong> — Strive held 13,000-plus coins at launch, and that reserve is the long-term backing. If Bitcoin appreciates, Strive&apos;s balance sheet strengthens behind the instrument; if it falls, the cash dividend doesn&apos;t change directly, but the health of the backing portfolio does. Bitcoin is the upside engine, not the thing that pays your monthly dividend.</p>
          <p>The second is the part that reassures me more: <strong>over eighteen months of dividend payments held in cash</strong>, ring-fenced from the Bitcoin and set aside specifically to cover distributions. That is what matters in a bad year. Even through a long, ugly stretch for Bitcoin, Strive can keep paying out of that buffer rather than being forced to sell coins at a low price to fund the dividend. It helps that Strive carries no debt sitting ahead of SATA, so the cash reserve stands behind the preferred more or less alone, rather than having to cover interest first.</p>
          <p>That dual design — Bitcoin for the long-term bet, cash for near-term safety — is the whole income thesis, and it is genuinely different from a lot of high-yield preferreds that have nothing but the issuer&apos;s ongoing cash flow standing behind the payment.</p>

          <h2>Daily dividends from June 2026</h2>
          <p>From <strong>16 June 2026</strong>, SATA switches from monthly to a payment every NYSE business day — one of the first listed securities to pay income daily. The headline doesn&apos;t change: it is still 13% a year. All that changes is the rhythm, a small daily payment instead of one monthly deposit, which nudges the compounding rate up a touch for reinvestors and gives cash-takers their income in a steadier trickle.</p>
          <p>Because the number of trading days shifts month to month, the exact daily amount per share moves around a little. The first stretch is partial — 16 to 30 June 2026, ten qualifying days — before the regular cadence settles in. I dug into whether any of this actually matters in <Link href="/blog/monthly-vs-daily-dividends">monthly versus daily dividends</Link> — the short version being that it matters far less than whether you reinvest at all.</p>

          <h2>Effective yield and the par peg</h2>
          <p>Like any traded income instrument, what you actually earn depends on the price you pay, not just the stated rate. Buy at $100 and you earn the full 13%; buy at $98 and your effective yield is about 13.27%; pay $102 and it slips to roughly 12.75%. Because Strive works to keep the price pinned near par, those gaps tend to be small — but they are real, and they are why I read a dip below par as a better entry for new money, not a worse one. The <a href="/sata">SATA hub</a> shows the live price and effective yield, and the <a href="/chart?stock=sata">yield chart</a> tracks that figure over time so you can judge whether today is a cheap or dear entry against the income on offer.</p>

          <h2>Putting numbers on it</h2>
          <p>To see what this does to a real balance, the <a href="/projector?stock=sata">Growth Projector</a> models what a given investment becomes over one to twenty years, with or without reinvestment, and the <a href="/vs-treasuries?stock=sata">vs Treasuries</a> page lines SATA up against ordinary income benchmarks — the honest yardstick for whether the extra yield pays you enough for the extra risk.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST) rather than the preferreds themselves. The cash buffer behind SATA is the feature I find most reassuring — but this is how I read it, not financial advice.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. SATA is a speculative investment. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'monthly-vs-daily-dividends',
    title: 'Monthly vs Daily Dividends: Does the Frequency Actually Matter?',
    metaTitle: 'Monthly vs Daily Dividends Explained',
    date: '2026-05-20',
    excerpt: 'Most income assets pay dividends quarterly or monthly. SATA is switching to daily payments from June 2026. But does payment frequency actually make a meaningful difference to real-world returns? The answer depends on what you do with the income.',
    readTime: '5 min read',
    category: 'Education',
    Content() {
      return (
        <>
          <p>From June 2026, SATA becomes one of the first listed securities to pay a dividend every single trading day — not quarterly, not monthly, but daily. It sounds like a real upgrade, and it makes for a great headline. So here is my honest answer to the question in the title, up front: for most people, the frequency barely matters. What you do with the income — reinvest it or spend it — swamps how often it arrives. Let me walk through why, because the gap between the marketing and the maths is the interesting part.</p>

          <h2>If you spend it, frequency is almost irrelevant</h2>
          <p>If you take your dividends as cash to live on, how often they land has next to no effect on your return. Whether $108 turns up on the first of the month or trickles in as a few dollars each business day, the yearly total is identical — 13% is 13% however you slice it across the calendar. Daily delivery is a convenience, not a return; the money simply arrives more smoothly. If you are a spender, you can stop reading here and not miss anything that touches your wallet.</p>

          <h2>If you reinvest, daily edges it — just</h2>
          <p>Reinvesting is where frequency earns its keep, at least on paper. Every dividend you put back to work buys shares that immediately start paying their own dividends, so the sooner a payment lands and is reinvested, the sooner it compounds. More payments a year means more compounding cycles, and more cycles means a slightly higher effective return. The order runs exactly as you would guess — annual is the weakest, then quarterly, then monthly (the norm for preferred equity), then daily at the top, with around 250 NYSE business days in a year.</p>

          <h2>The numbers at 13%</h2>
          <p>The trouble is that &quot;slightly higher&quot; really is slight. At SATA&apos;s 13%, monthly reinvestment works out to an effective rate of about 13.80% a year; daily reinvestment, about 13.88%. That is a gap of roughly seven and a half basis points — under a tenth of one percent. On a $10,000 holding it comes to about $7.50 a year, and it scales straight in line from there: around $75 on $100,000, about $375 on half a million. Real money at size, but hardly the step-change the word &quot;daily&quot; suggests — and although that sliver does itself compound over twenty years, it never swells into anything dramatic.</p>

          <h2>The decision that actually matters</h2>
          <p>Which brings me to the point the whole monthly-versus-daily debate tends to bury. The comparison worth having isn&apos;t monthly against daily — it is reinvesting against not reinvesting. Skipping reinvestment altogether costs you far more than the handful of basis points between payment schedules will ever win back. The <a href="/projector?stock=sata">SATA Growth Projector</a> makes this plain: toggle reinvestment on and off across twenty years and the two paths fan miles apart; switch the same projection between monthly and daily and you would struggle to tell them apart. Put your attention on the big lever, not the small one.</p>

          <h2>Where daily genuinely helps</h2>
          <p>None of that makes daily pointless — there are two real benefits the spreadsheet misses. If you reinvest by hand rather than automatically, daily payments hand you far more chances to buy in at the price on the day instead of a single monthly snapshot, which suits anyone who likes to be opportunistic. And there is a softer one: watching income land every trading day changes how the holding feels — more tangible, more continuous than a once-a-month deposit. Whether that counts for anything is a matter of temperament, not arithmetic.</p>

          <h2>What SATA&apos;s switch actually changes</h2>
          <p>For the record, the move to daily doesn&apos;t touch the headline yield — 13% stays 13%. All that changes is the rhythm: one payment per NYSE business day rather than one a month, with each month&apos;s payments still adding up to roughly a twelfth of the annual rate. The first stretch is a partial one — daily qualifying days begin on 16 June 2026, giving ten business days that month — so that opening period is smaller than a full month before the regular daily cadence settles in.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST) rather than the preferreds themselves. My honest take is that daily dividends are a nice-to-have, not a reason to buy — but that is my view, not financial advice.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'strc-vs-sata',
    title: 'STRC vs SATA: Comparing Two Preferred Income Assets',
    metaTitle: 'STRC vs SATA: Preferred Income Compared',
    date: '2026-05-05',
    excerpt: "SATA pays 13%, STRC pays 11.5% — so why hold the lower one? Because the 1.5-point gap buys two different instruments: different issuers, different backing, and different machinery keeping each near par. How I weigh one against the other.",
    readTime: '6 min read',
    category: ['STRC', 'SATA'],
    Content() {
      return (
        <>
          <p>On headline yield this is a short article: SATA pays 13%, STRC pays 11.5%, so buy SATA. If it were that simple I wouldn&apos;t bother following both. The 1.5-point gap is real, but it is the price of two genuinely different instruments — different issuers, different backing, and different machinery keeping each one near its $100 par. Here is how I actually weigh one against the other.</p>

          <h2>The yield gap, and what it really buys</h2>
          <p>Start with the number everyone leads on. STRC pays <strong>11.50%</strong> a year, about $0.958 a share a month; SATA pays <strong>13.00%</strong>, about $1.083. On a $50,000 position that 1.5-point gap is roughly <strong>$750 of extra income a year</strong> from SATA, and with reinvestment the difference compounds into something a good deal larger over a decade. So yes — if income were the only axis, SATA wins and we are done. The reason I don&apos;t stop there is that the higher number is also telling you something about the risk you are being paid to take.</p>

          <h2>Two very different issuers</h2>
          <p><strong>STRC</strong> comes from <strong>Strategy</strong> (formerly MicroStrategy), Michael Saylor&apos;s company, which holds more than 800,000 Bitcoin — more than any other public company — and has spent years building deep, repeated access to the capital markets. <strong>SATA</strong> comes from <strong>Strive Asset Management</strong>, a far younger firm founded in 2022, which held 13,000-plus Bitcoin at launch alongside 18-plus months of dedicated cash reserves. In a sentence: with STRC you are leaning on scale and a long track record; with SATA you are leaning on a small, careful issuer that has visibly set cash aside. I cover why either exists at all in <a href="/blog/bitcoin-treasury-companies">Bitcoin treasury companies and why they issue preferred equity</a>.</p>

          <h2>How each one defends par</h2>
          <p>This is where they diverge most, and it is the part I&apos;d want a new buyer to understand. STRC runs a <strong>formal, rules-based monthly rate</strong> that resets to keep the price near $100 — drift below par and the rate steps up to pull buyers in, which is why it has climbed from 9% to 11.50% since its July 2025 IPO. The full framework is in <a href="/blog/strc-vwap-dividend-mechanism">how STRC&apos;s rate is set</a>. SATA has <strong>no equivalent published mechanism</strong>; Strive manages the trading range through its reserves and market activity at its own discretion, and its rate has walked up from 12% to 13% since the November 2025 IPO (12% &rarr; 12.25% &rarr; 12.75% &rarr; 13%). I lay that contrast out in <a href="/blog/sata-dividend-rate-mechanism">how SATA&apos;s rate is set</a>. Neither approach is obviously better — STRC&apos;s is transparent and predictable, SATA&apos;s is flexible but asks you to trust management&apos;s judgement.</p>

          <h2>What is actually behind the dividend</h2>
          <p>Both dividends ultimately rest on Bitcoin-linked issuers, but the texture of the backing differs. STRC stands on Strategy&apos;s whole financial position — its 800,000-plus Bitcoin, the cash from its software business, constant access to fresh capital, and, since December 2025, an explicit <strong>USD reserve</strong> earmarked for preferred dividends and debt interest. Strategy set that pot up at <strong>$1.44 billion</strong>, funded by selling common stock through its at-the-market program.</p>
          <p>SATA leans on Strive&apos;s <strong>dual-asset design</strong>: Bitcoin for the long-term bet, plus <strong>18-plus months of cash specifically ring-fenced to pay the dividend</strong>. So both issuers now hold a dedicated dollar buffer — the real difference is what each one has to cover. Strategy&apos;s reserve has to stand behind <em>all</em> of its preferred lines and its debt interest, a far bigger bill, so in months-of-coverage terms it stretches less far than the headline figure suggests; Strive&apos;s buffer sits against SATA more or less alone. That proportional depth is, to me, still SATA&apos;s most reassuring feature — but it is now a question of degree, not of one issuer having a reserve and the other going without.</p>

          <h2>Income frequency</h2>
          <p>Here the two line up: both pay <strong>monthly</strong>, in cash, rather than the quarterly schedule most conventional preferreds run on. Monthly payments are a small but real edge if you reinvest — the cash goes back to work twelve times a year instead of four, so it compounds a little faster — and for anyone taking the income as spending money, a monthly rhythm is simply easier to live on. It is a point of similarity, not a way to tell them apart.</p>

          <h2>The risks are the same shape</h2>
          <p>For all their differences, the downside rhymes. Neither is a bond or investment-grade anything; the dividends are not legally guaranteed the way bond interest is, and both issuers are roped to the Bitcoin price through their holdings. A long, grinding Bitcoin bear market would pressure both balance sheets at once — even if near-term cash could still cover the payments. The higher yields on both, set against conventional preferreds, are simply the market pricing that extra risk. Whatever you decide, these belong in the higher-risk sleeve of an income portfolio, sized accordingly.</p>

          <h2>Putting numbers on it</h2>
          <p>When I want to see how either stacks up against a genuinely safe alternative, I use the <a href="/vs-treasuries?stock=strc">STRC vs Treasuries</a> and <a href="/vs-treasuries?stock=sata">SATA vs Treasuries</a> pages, which line each one up against Treasury benchmarks on effective yield and projected growth across several horizons. If you forced a characterization out of me: STRC is the bigger, more liquid, more institutional name; SATA pays you more and backs it with a proportionally deeper cash buffer. I hold neither directly — I own the parent companies — but if I were buying for income, the call would come down to how much I valued that explicit reserve against Strategy&apos;s sheer scale.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). The comparison above is how I personally frame the two — it isn&apos;t financial advice.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'how-to-use-the-growth-projector',
    title: 'How to Use the Growth Projector to Model Your Income Portfolio',
    metaTitle: 'How to Use the Growth Projector',
    date: '2026-05-14',
    excerpt: 'The Growth Projector lets you enter an investment amount, set a yield and time horizon, and toggle reinvestment — then shows projected value and total income over time. Here is how to use it effectively and what the numbers actually mean.',
    readTime: '4 min read',
    category: 'Guide',
    Content() {
      return (
        <>
          <p>The first time I put a real number into the Growth Projector, the figure that came back made me double-check the maths. Fifty thousand dollars left to compound at SATA&apos;s 13% for twenty years lands somewhere near $664,000 — entirely from reinvested dividends, before a single dollar of price appreciation. That gap between &quot;a 13% income stream&quot; and &quot;more than a tenfold return&quot; is the whole reason I built the projector the way I did, and the reason I think it&apos;s the most useful tool on this site. Here is how I actually use it.</p>

          <p>There are two projectors, one for each instrument I track — <a href="/projector?stock=strc">STRC</a> and <a href="/projector?stock=sata">SATA</a> — and they work identically. When the page loads, the yield box holds the current stated dividend rate: 11.50% for STRC, 13% for SATA. That is the dividend measured against the $100 par the share was issued at, and it is the sensible default — these instruments are new enough that the market data feeds don&apos;t report a reliable yield for them, so rather than guess, the projector anchors to the published rate. It won&apos;t resurrect a stale number either: it always loads today&apos;s rate, so STRC shows 11.50% and not the 9% it launched at in July 2025.</p>
          <p>Almost nobody actually buys at par, though, which is what the <strong>Yield basis</strong> toggle at the top of the inputs is for. Leave it on <em>Annual</em> and the box behaves as above — you can type over the rate to test a scenario. Flip it to <em>Effective</em> and the box relabels itself &quot;Effective Yield&quot; and shows the yield you&apos;d really be earning: the same dividend, measured against the price you actually pay rather than against $100. In plain dollar mode it works that out from the live market price — if STRC is trading below par your dollars buy more shares than they would at par, so the effective figure sits above 11.50%; above par it sits below. If you&apos;d rather pin it to your own entry, switch the amount box from dollars to a share count and type your cost per share, and the effective yield is calculated from that instead. Flipping between the two is the fastest way to see what buying away from par does to the same starting stake. The box is read-only in Effective mode for a reason — it&apos;s a calculated figure, not one you set.</p>

          <h2>The inputs that matter</h2>
          <p>The <strong>amount</strong> is your starting capital, with a small dollars/shares switch beside it. In dollar mode you just enter a sum; in share mode you enter a number of shares plus your price per share — and that price is exactly what the Effective yield is calculated from. Next to it is a <strong>monthly</strong> box for regular top-ups, if you plan to keep adding to the position; leave it at zero to model a single lump sum and read the result as conservative.</p>
          <p>The <strong>yield</strong> I&apos;ve covered — stated by default, your real entry yield once you flip to Effective, and editable only in Annual mode since Effective is derived. It is still worth stress-testing in Annual mode: what happens if STRC&apos;s yield compresses to 10% as the price climbs back towards par, or holds where it is for five years? That one number swings the long-horizon outcome far more than the size of your stake does.</p>
          <p>The <strong>time horizon</strong> runs from 1 to 20 years, and the compounding only really shows its teeth past the ten-year mark — before that, the reinvested and cash-out lines sit closer together than people expect. The <strong>reinvestment</strong> control is a slider, not an on/off switch, and it is the most consequential input on the page: at 100% every dividend buys more shares, at 0% you take it all as cash and your share count never changes, and anywhere in between splits the difference.</p>

          <h2>Reading the two lines</h2>
          <p>With reinvestment off, you&apos;re looking at a flat value line and a steadily climbing cumulative-income figure underneath it. That is the honest picture of an income stream: your share count is fixed, so if the price stays near par your portfolio value sits roughly still while the cash you&apos;ve collected ticks up. On $50,000 at STRC&apos;s 11.50%, that&apos;s about $5,750 a year — $57,500 over a decade, with your original stake still in shares throughout. If you&apos;re drawing the income to live on, this is the line you care about, and the projector makes it easy to check whether that annual figure clears your target.</p>
          <p>Flip reinvestment on and the value line bends upward instead of running flat. Each month&apos;s dividends buy more shares, those shares pay their own dividends, and the curve steepens as it goes. Run SATA&apos;s 13% out to twenty years and the $50,000 reaches roughly $664,000; the same stake in STRC at 11.50% gets to around $493,000. The 1.5-point yield difference looks small on day one and turns into a six-figure gap by year twenty — which is exactly why I don&apos;t treat the starting yield casually.</p>

          <h2>Where the model stops</h2>
          <p>I&apos;d rather be straight about what these numbers are not. The projector holds the yield fixed for the entire run, and reality doesn&apos;t. STRC&apos;s rate has stepped up every month since its July 2025 IPO — 9%, then 10%, 10.25%, 10.50%, 11%, 11.25%, and now 11.50% — and SATA has moved to 13% from its launch rate. Hold either constant for twenty years in the model and you&apos;re answering &quot;if conditions roughly persist, what does this trajectory look like?&quot; — not &quot;what will happen.&quot; It&apos;s a planning frame, not a forecast, which is why I tend to run three versions of every scenario: the live yield, two points below, and two points above. The spread between those three tells you more than any single headline number.</p>
          <p>It also ignores tax, which for most people is not a rounding error on a dividend this size, and it doesn&apos;t model transaction costs, currency, or what the share price itself does beyond the income-driven growth on the chart. If you want to judge whether the extra yield is worth the extra risk in the first place, that comparison lives on the <a href="/vs-treasuries?stock=strc">vs Treasuries</a> page, not here.</p>

          <p>One small convenience: your inputs save to your browser automatically, so your last scenario is waiting when you come back. I use that to keep a baseline scenario pinned, then edit the stated rate in Annual mode whenever it moves — STRC&apos;s has stepped up nearly every month since launch — so the projection keeps pace with reality instead of freezing on the day I first ran it.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). The way I use the projector above is how I plan my own scenarios — it isn&apos;t financial advice.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Projections are illustrative and are not a guarantee of future returns. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'dividend-reinvestment-compounding',
    title: 'Reinvesting Dividends: How Compounding Works with STRC and SATA',
    metaTitle: 'Reinvesting STRC & SATA Dividends',
    date: '2026-05-16',
    excerpt: 'Taking your monthly dividends as cash is one way to use STRC and SATA. Reinvesting them is another — and over time the difference in outcome is dramatic. Here is how compounding works and how the Growth Projector shows you the numbers for your own scenario.',
    readTime: '6 min read',
    category: 'Education',
    Content() {
      return (
        <>
          <p>The case for reinvesting comes down to a single pair of numbers I keep coming back to. Put $10,000 into SATA at 13% and spend every dividend, and twenty years later you are still collecting the same $108 a month you started with. Reinvest those same dividends instead, and by year twenty the position is throwing off around $1,438 a month — more than thirteen times the income, from the identical opening stake. Same instrument, same rate, same money in; the only thing that changes is what you do with the monthly payment. That gap is the whole case for compounding, and it is worth seeing exactly where it comes from.</p>

          <p>Every month STRC and SATA pay you cash, and every month you make the same quiet decision: spend it, sit on it, or buy more shares with it. Take the cash and your share count never moves — next month&apos;s dividend is the same size as this month&apos;s, your income steady but flat. Reinvest it and your holding ticks up, so the following month you earn on a slightly bigger base, and the month after that on a bigger one still. Each payment buys a little more income-generating capital, and given enough years those small increments stop being small. That is all compounding is: earning a return on your returns, not just on the money you started with.</p>

          <h2>What it looks like on $10,000</h2>
          <p>Start with $10,000 of STRC at today&apos;s 11.50%. The first month pays $95.83. Spend every payment and your capital sits at $10,000 forever, handing you $1,150 a year — $23,000 of income over two decades, for an end position of $33,000. Reinvest every payment instead and the base compounds: about $11,213 after one year, $17,723 after five, $31,409 after ten, and roughly <strong>$98,600</strong> after twenty. That is almost three times the cash-out result, from the same opening $10,000.</p>
          <p>SATA tells the same story with more force, because the rate is higher. At 13% the first monthly dividend on $10,000 is $108.33. Cashed out, that is $1,300 a year and $26,000 over twenty years, ending at $36,000. Reinvested, the position reaches about $11,380 after a year, $19,089 after five, $36,437 after ten, and roughly <strong>$132,800</strong> after twenty — more than three and a half times the cash-out total. The higher the yield, the harder compounding pulls.</p>

          <CompoundingChart />

          <h2>The part that matters: income</h2>
          <p>Pot size is the headline, but the figure I find more telling is the monthly income at the end. The $10,000 STRC cash-out investor earns $95.83 a month on day one and $95.83 a month in twenty years&apos; time — it never budges. The reinvestor&apos;s grown ~$98,600 position would, at the same 11.50%, pay roughly <strong>$945 a month</strong> — nearly ten times the income of someone who put in the same money and spent it along the way. For SATA the spread is wider still: $108 a month forever against about <strong>$1,438 a month</strong> on the reinvested ~$132,800. Same starting sum, an order of magnitude apart in income by the end.</p>
          <p>That is why I treat reinvestment as a long-game decision rather than an income one. For the first few years the extra is barely noticeable — a few more dollars a month, easy to dismiss. It is the back half of the timeline that does the heavy lifting, and it only pays off if you leave it alone long enough to get there.</p>

          <h2>Why monthly payments help</h2>
          <p>Both instruments pay monthly rather than quarterly, and that cadence is quietly doing work. Every payment is a chance to put money back twelve times a year instead of four, and each reinvestment becomes part of the base the next one earns on. More frequent payments simply mean more compounding cycles, and more cycles mean a steeper curve over a long horizon. Monthly sits at a sensible spot for anyone who wants their dividends back at work without waiting a quarter for the privilege.</p>

          <h2>Run your own numbers</h2>
          <p>The figures above are just one example — yours will differ. The <a href="/projector?stock=strc">STRC</a> and <a href="/projector?stock=sata">SATA</a> Growth Projectors are built for exactly this: put in your own amount and time horizon and they lay the cash-out income stream and the reinvested growth side by side, out to twenty years, anchored to the current rate. It is far quicker than doing the arithmetic by hand, and it lets you test your real position rather than a round $10,000.</p>

          <h2>One honest caveat</h2>
          <p>Every number here assumes a flat rate for the whole run — 11.50% for STRC, 13% for SATA, held steady for twenty years. Reality will not be that tidy: STRC&apos;s rate resets, SATA&apos;s has moved since launch, the price you pay won&apos;t always be par, and tax takes a bite out of every dividend you reinvest. The projector makes the same simplifying assumption and says so plainly, so treat all of this as an illustration of the mechanism, not a forecast. What does hold, whatever the exact rate, is the shape of it — reinvestment compounds your income base, monthly payments compound it faster, and time is the ingredient that turns a modest yield into a serious one.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST) rather than the preferreds themselves. If I were buying these for income, reinvesting is the approach I&apos;d take — but that is my own view, not financial advice.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. All projections are hypothetical illustrations assuming a constant dividend yield. They do not account for price fluctuation, reinvestment risk, tax, or changes in the dividend rate. Past performance is not indicative of future results. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },

  {
    slug: 'strategy-capital-structure',
    title: "Strategy's Capital Structure: From Senior Debt to Common Stock — and Where STRC Fits",
    metaTitle: "STRC in Strategy's Capital Structure",
    date: '2026-06-03',
    excerpt: "STRC pays 11.5% — but where does it actually sit at Strategy? Second from the top of the preferred tier: below $6.7bn of convertible debt and STRF, above STRE, STRK, STRD and MSTR common. Here's the full stack, top to bottom, and why that seat sets the yield.",
    readTime: '7 min read',
    category: 'STRC',
    Content() {
      return (
        <>
          <p>Strategy has issued so many different securities that you almost need a map to keep them straight — $6.7 billion of convertible bonds, five separate preferred series, and the MSTR common stock everyone knows. What surprised me when I first plotted STRC onto that map is how high it sits: second from the top of the preferred tier, with only STRF ranked above it. For an instrument paying 11.5%, that&apos;s an unusually senior seat — and it&apos;s the fact that frames everything else about STRC.</p>

          <p>Strategy isn&apos;t really a software company any more; it&apos;s a leveraged machine for buying Bitcoin, and the stack of debt and equity it has built is the engine. Where STRC fits in that stack tells you both how protected your income is and why the rate is set where it is. So it&apos;s worth walking the stack from the top down — the same order Strategy&apos;s assets would actually be handed out in if things ever went wrong.</p>

          <h2>Top of the stack: $6.7 billion of convertible debt</h2>
          <p>Debt always gets paid first, and Strategy&apos;s sits right at the top: roughly $6.7 billion in convertible senior notes as of May 2026, issued to institutions across several tranches and maturities. A number of those pay 0% interest — the lenders aren&apos;t in it for the coupon, they&apos;re in it for the conversion right, the option to swap the bond into MSTR common stock at a pre-set price.</p>
          <p>What matters for a STRC holder is the priority. Those notes rank ahead of every equity holder in the business — preferred and common alike. In a wind-up, bondholders have first claim on Strategy&apos;s assets, including its 843,000-plus Bitcoin, before a single preferred dividend is considered. The near-zero-coupon structure is deliberate: Strategy borrows cheaply to buy Bitcoin and bets the appreciation outruns any dilution when those bonds convert. That bet shapes everything sitting beneath it — STRC included.</p>

          <h2>The preferred tier: five series, not one</h2>
          <p>Below the debt and above MSTR common sits the preferred tier — and this is where people tend to lump everything together as &quot;Strategy preferred&quot; when it&apos;s actually five distinct series, around $15.5 billion of notional between them. They all rank ahead of common stock, but they don&apos;t rank equally with each other. Seniority within the tier runs in a set order, and STRC sits near the top of it.</p>

          <p><strong>STRF — the most senior (10% fixed, quarterly).</strong> STRF sits at the very top of the preferred hierarchy, which makes it the most protected of the five. It pays a fixed 10% a year in quarterly cash of $2.50 a share, and ranks ahead of every other series if Strategy ever had to trim or suspend dividends.</p>

          <p><strong>STRC — second most senior (currently 11.50%, monthly).</strong> STRC is the one I track on this site, and it sits immediately below STRF — only that one series ranks above it. It launched in July 2025 at 9% and has stepped up almost every month since, reaching 11.50%, or about $0.958 a share each month. The rate resets monthly to keep the price near its $100 par: drift below par and the rate rises to pull buyers in; drift above and it eases off. No conversion feature, no maturity date — just monthly cash. A near-top seat in the stack, monthly income and that self-correcting rate are exactly why STRC has become the series that draws the most money. Strategy&apos;s own prospectus spells the ranking out:</p>

          <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', margin: '1.5rem 0' }}>
            <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-primary)' }}>"STRC Stock ranks senior to dividend junior stock (which includes class A common stock, class B common stock, STRE Stock, STRK Stock, and STRD Stock) with respect to the payment of dividends and with respect to the distribution of assets upon liquidation. However, the company's indebtedness and STRF Stock rank senior to the STRC Stock."</p>
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.85em', color: 'var(--text-muted)' }}>— Strategy Inc, Form 424B5 Prospectus Supplement, SEC EDGAR</p>
          </div>

          <p><strong>STRE — the euro series (10% fixed, quarterly).</strong> STRE is Strategy&apos;s only non-dollar preferred — denominated in euros at €100 a share, built to tap European capital and listed on the Luxembourg Stock Exchange&apos;s Euro MTF market rather than Nasdaq. The 10% dividend pays quarterly in euros, and the raise came in at €620 million, upsized from €350 million on strong demand. It&apos;s open only to professional and institutional investors in the European Economic Area — not retail, and not the UK. In the stack it sits below STRC and above STRK and STRD.</p>

          <p><strong>STRK — the convertible (below STRE).</strong> STRK is the only convertible preferred in the lineup. Each share converts into 0.1 of an MSTR share, so holders get a slice of Strategy&apos;s equity upside alongside the income — at the cost of sitting lower in the preferred order. It&apos;s a genuinely different animal from the others: part fixed income, part equity option.</p>

          <p><strong>STRD — the most junior (8% stated).</strong> STRD sits at the bottom of the preferred tier, just above common stock, with the lowest stated rate of the five at 8%. Because it&apos;s last in line within the tier, buyers demand more compensation, and it often trades below its $100 par — which pushes its effective yield well above the stated 8%.</p>

          <h2>The bottom: MSTR common stock</h2>
          <p>Right at the bottom sits MSTR, the common stock. Common holders absorb losses first and get paid last, with no priority claim on dividends or assets — in trouble, they get whatever is left after every creditor and every preferred holder has been satisfied. The flip side is that all the uncapped upside is theirs: if Bitcoin runs and every senior obligation is met, the residual value flows to MSTR. That&apos;s the core trade in any capital structure — MSTR carries the most risk and the most reward; STRC sits well above it with a contractual income stream and a $100 par anchor, but gives up that open-ended upside in return. Which seat suits you comes down to whether you&apos;re buying for income or for growth.</p>

          <h2>The stack at a glance</h2>
          <StrategyCapitalStack />
          <p>Top to bottom, it lines up like this:</p>
          <ol>
            <li><strong>Convertible senior notes</strong> — ~$6.7B of debt; paid first in every scenario</li>
            <li><strong>STRF</strong> — most senior preferred; 10% fixed; quarterly USD</li>
            <li><strong>STRC</strong> — second most senior preferred; 11.50% adjustable; monthly USD</li>
            <li><strong>STRE</strong> — euro-denominated preferred; 10% fixed; quarterly EUR; EEA professionals only</li>
            <li><strong>STRK</strong> — convertible preferred; equity upside via MSTR conversion</li>
            <li><strong>STRD</strong> — most junior preferred; 8% stated; just above common</li>
            <li><strong>MSTR common stock</strong> — absorbs losses first; uncapped upside</li>
          </ol>

          <h2>Why STRC has pulled ahead of the other four</h2>
          <p>Of the five series, STRC has become the standout by almost any measure I look at. By mid-2026 it had scaled to a $6.4 billion market cap, with Strategy raising $5.6 billion of STRC in the first half of the year alone. Daily volume regularly tops $375 million — one of the most liquid preferreds in the US market — and its 30-day volatility has fallen to about 1.7%, remarkably calm for anything with Bitcoin behind it. A few things explain the pull:</p>
          <ul>
            <li><strong>Seniority and yield together</strong> — it&apos;s the second most senior preferred, ranked just below STRF, yet it pays more than any of them. Near-top-tier protection with a rate that&apos;s climbed to 11.50% is a rare pairing.</li>
            <li><strong>Monthly, not quarterly</strong> — every other series pays quarterly; STRC pays every month, which suits anyone buying for regular income rather than waiting 90 days between cheques.</li>
            <li><strong>The self-correcting rate</strong> — the monthly reset keeps STRC pinned near $100 par, which has held its price unusually steady and makes it behave more like a cash instrument than a typical preferred.</li>
            <li><strong>A real cash buffer</strong> — Strategy has set aside $1.1 billion specifically for dividend and interest obligations, a concrete cushion between STRC holders and any dividend disruption.</li>
            <li><strong>A track record</strong> — about $413 million distributed since the July 2025 launch, paid month after month.</li>
          </ul>
          <p>That mix — seniority, monthly income, price stability and deep liquidity — is why I&apos;d call STRC the benchmark for this young digital-credit asset class, not just the biggest of Strategy&apos;s preferreds.</p>

          <h2>What it means if you hold STRC</h2>
          <ul>
            <li><strong>Second most senior preferred</strong> — only STRF ranks above it; four of the five series, including the convertible STRK and the junior STRD, sit below. That&apos;s a genuinely protected spot inside a complex, well-capitalised structure.</li>
            <li><strong>Senior to common</strong> — STRC dividends have to be dealt with before MSTR holders see anything, which is real protection relative to owning MSTR outright.</li>
            <li><strong>Junior to all the debt</strong> — the $6.7 billion of convertibles ranks ahead of STRC in every scenario; under severe stress, debt gets serviced before any preferred dividend.</li>
            <li><strong>Bitcoin is the thing underneath it all</strong> — the whole stack ultimately leans on Strategy&apos;s 843,000-plus Bitcoin. A sustained drop in Bitcoin presses on the stack from the bottom up, starting with MSTR and working towards the preferred tier over time.</li>
          </ul>

          <h2>So why the yield premium</h2>
          <p>STRC&apos;s 11.50% is well above the 5–7% a conventional preferred tends to pay, and the structure above explains exactly why. You&apos;re taking on Bitcoin&apos;s price path through Strategy&apos;s balance sheet, sitting below $6.7 billion of senior debt, and holding a perpetual instrument with no guaranteed return of capital. But inside the preferred tier itself STRC holds a strong hand — second only to STRF — and its liquidity, monthly payments and $1.1 billion reserve make it the most developed and investor-friendly of the five. The way I read it, the rate isn&apos;t a distress signal; it&apos;s the price of a clearly-defined risk that&apos;s simply different from an ordinary preferred. Whether that trade suits you is a judgement only you can make — but you can&apos;t make it well without first understanding the stack. To see STRC against the other obvious option, I put the two head to head in <a href="/blog/strc-vs-sata">STRC vs SATA</a>; for the opposite approach to financing entirely — no debt at all — there&apos;s <a href="/blog/strive-capital-structure">Strive&apos;s capital structure</a>. The live STRC numbers are on the <a href="/strc">STRC hub</a>.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). Mapping the stack the way I have here is how I personally weigh STRC — it isn&apos;t financial advice.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Capital structure details are based on publicly available information as of June 2026 and are subject to change. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'strive-capital-structure',
    title: "Strive's Capital Structure: What Debt-Free Means for SATA",
    metaTitle: "Strive's Debt-Free Capital Structure",
    date: '2026-06-03',
    excerpt: "Strive cleared the last of its inherited debt in early 2026, which leaves SATA sitting at the very top of the stack with no creditor ahead of it. Here's why that — plus an 18-month cash reserve — is the part of SATA I find most reassuring.",
    readTime: '6 min read',
    category: 'SATA',
    Content() {
      return (
        <>
          <p>When I size up a preferred, the first thing I want to know is what ranks above it — who gets paid before I do. With SATA the answer is unusually short: nothing does. Strive, the company behind SATA, cleared the last of its inherited debt in early 2026 and has committed to staying debt-free, which leaves SATA at the very top of the company&apos;s stack — no bondholder, no lender with a prior claim on the Bitcoin sitting behind it. For an income holding, where you land in that queue counts as much as the rate on the label, and it&apos;s the part most yield comparisons skip straight past.</p>

          <h2>A quick word on where preferred sits</h2>
          <p>Every company that raises money builds a hierarchy of claims. Creditors sit at the top — legally enforceable claims, paid first. Common shareholders sit at the bottom, absorbing losses first and paid last. Preferred stock sits in the middle: senior to common, normally junior to any debt. The fewer senior claims stacked above a preferred, the stronger its position — and that&apos;s really the whole story with SATA. I drew the same picture from the other side of the trade in <a href="/blog/strategy-capital-structure">Strategy&apos;s seven-layer stack</a>, which is a useful contrast to keep in mind here.</p>

          <h2>Strive's stack: two layers and nothing else</h2>
          <p>Strive&apos;s structure is about as lean as a listed Bitcoin treasury company gets. As of June 2026 there are just two securities outstanding, sitting on top of zero debt:</p>
          <ol>
            <li><strong>SATA preferred stock</strong> — Variable Rate Series A Perpetual Preferred Stock; 13% variable rate, monthly cash dividends, $100 par; the senior equity security.</li>
            <li><strong>ASST common stock</strong> — absorbs losses first, paid last, uncapped upside.</li>
          </ol>
          <p>That&apos;s the entire stack. No convertible notes, no secured loans, no bond tranches. Strive cleared the $120 million of legacy convertible notes it inherited when it acquired Semler Scientific, and has said it intends to fund all future Bitcoin buying through preferred and common equity rather than borrowing.</p>

          <h2>Why "no debt" actually matters to a SATA holder</h2>
          <p>Because there&apos;s no debt, SATA is currently the most senior security Strive has. No creditors with a prior claim on the Bitcoin, no interest payments that have to be serviced before a dividend can go out — in a company with no debt, the preferred holder is first in line. Compare that with STRC over at Strategy, where holders sit beneath roughly $6.7 billion of convertible notes; those bondholders would be paid ahead of them in any wind-up. SATA has no equivalent layer above it.</p>
          <p>Strive&apos;s own prospectus is blunt about how this works:</p>

          <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', margin: '1.5rem 0' }}>
            <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-primary)' }}>"The SATA Stock ranks senior to Strive's Class A common stock and Class B common stock with respect to the payment of dividends and the distribution of assets upon Strive's liquidation, dissolution or winding up. However, the SATA Stock is junior to Strive's existing and future indebtedness and structurally junior to the liabilities of Strive's subsidiaries."</p>
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.85em', color: 'var(--text-muted)' }}>— Strive Inc, Form 424B5 Prospectus Supplement, SEC EDGAR</p>
          </div>

          <p>The phrase I&apos;d underline there is <strong>&quot;existing and future indebtedness.&quot;</strong> Right now Strive has none, so SATA&apos;s subordination to debt is theoretical rather than real. But it&apos;s conditional: the day Strive takes on debt, that debt ranks above SATA. Which is exactly why the debt-free commitment isn&apos;t corporate fluff to me — it&apos;s the single policy a SATA holder should keep an eye on.</p>

          <h2>What's actually backing the dividend</h2>
          <p>Behind SATA&apos;s income is Strive&apos;s Bitcoin treasury — 19,000 BTC as of June 2026, worth roughly $1.35 billion, bought at a cost that&apos;s delivered a year-to-date BTC yield of 36.7%. But the part that reassures me more than the Bitcoin is the cash. Strive holds a dedicated dividend reserve of about $137 million, sized to cover roughly 18 months of SATA payments without selling a single coin. That buffer is what separates the next year and a half of dividends from Bitcoin&apos;s day-to-day price — even in a sustained downturn, the income is pre-funded from cash, not raised through forced Bitcoin sales.</p>

          <h2>The stack at a glance</h2>
          <StriveCapitalStack />
          <p>Top to bottom: no debt, then SATA (13% variable, monthly, $100 par, the most senior security outstanding), then ASST common, which absorbs losses first and carries the uncapped upside. Set that next to Strategy&apos;s seven layers — $6.7 billion of convertibles, five preferred series stacked in seniority order, and MSTR common at the bottom — and the difference in complexity is obvious. Strive doesn&apos;t need the hierarchy because it chose preferred equity over debt as its main way of raising money.</p>

          <h2>How I read the trade</h2>
          <p>SATA&apos;s 13% is the highest rate of any Bitcoin-backed preferred trading today, and it&apos;s worth being honest about why. You&apos;re not being paid that premium for sitting below senior debt — there isn&apos;t any. You&apos;re being paid for Strive itself: a smaller, younger, faster-growing company than Strategy, with a more concentrated Bitcoin position and a shorter track record. The risk lives in the size and stage of the business and in Bitcoin&apos;s long-term performance — not in the capital structure.</p>
          <p>That&apos;s an unusual combination, and it&apos;s why I find SATA interesting: a high headline rate from an issuer with no creditors ahead of the preferred. The cash reserve covers the short term; Bitcoin&apos;s price decides the long-term health of the issuer. If you want to see how that 13% translates against the price you&apos;d actually pay, the <a href="/sata">SATA hub</a> and the <a href="/dividends?stock=sata">dividend page</a> show the live numbers, and the <a href="/blog/strc-vs-sata">STRC vs SATA comparison</a> sits the two side by side.</p>
          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). What draws me to SATA — the clean, debt-free stack and the cash buffer behind the dividend — is my own read, not financial advice. Strive&apos;s debt-free policy is a commitment, not a guarantee, and that&apos;s the line I&apos;d watch.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Capital structure details are based on publicly available information as of June 2026 and are subject to change. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'strc-vwap-dividend-mechanism',
    title: "How STRC's Dividend Rate Is Set: The VWAP Mechanism Explained",
    metaTitle: 'STRC Dividend Rate: The VWAP Mechanism',
    date: '2026-06-04',
    excerpt: "STRC has raised its rate seven times since IPO — 9% to 11.50% — then stopped. It isn't monthly guesswork: the rate follows a published rulebook tied to a five-day average price against $100 par. Here's how the mechanism works, and why it's behaved like a thermostat.",
    readTime: '7 min read',
    category: 'STRC',
    Content() {
      return (
        <>
          <p>Seven straight monthly rate increases, 9% to 11.50% — and then nothing. STRC has sat at 11.50% since March 2026. When I first followed that sequence I assumed someone at Strategy was making a fresh judgement call each month. They aren&apos;t, really. STRC&apos;s rate is set by a published rulebook tied to a single number: its five-day average price measured against $100 par. Once you&apos;ve seen the table behind it, the whole rate history stops looking like a string of decisions and starts looking like a thermostat — and that&apos;s the cleanest way I&apos;ve found to understand the instrument.</p>

          <h2>What the prospectus said at IPO — and what it didn't</h2>
          <p>When STRC launched in July 2025, Strategy&apos;s 424B5 prospectus only described the rate mechanism in broad strokes: it intended to push the rate up when STRC traded below par and down when it traded above, aiming to keep the price near $100. No thresholds, no step sizes — at IPO this was a stated policy, not a rulebook. The numbers came later.</p>
          <p>One detail set the tone from day one. STRC carries a $100 par value, but the IPO priced at $90 — so anyone buying at launch earned an effective yield near 10% on cost even though the stated rate was 9% of par. Trading 10% below par from the first print, the rate was always going to come under early pressure to climb. And climb it did, once the formal framework landed two months later.</p>

          <h2>The rulebook: the August 2025 framework</h2>
          <p>On 28 August 2025, Strategy filed an 8-K that turned the vague policy into hard numbers. This is the filing that first set out the exact price bands and the basis-point moves that have governed every monthly rate decision since. It measures a five-day VWAP — the five trading days before the last trading day of each month — and maps the result to a recommendation for the next month&apos;s rate:</p>

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

          <p>You&apos;ll often see this shortened to &quot;STRC below $98 means a 0.50% rate increase.&quot; That&apos;s not quite right, and the difference matters. The $95–$98.99 band only triggers +25 bps; you need a price below $95 to force +50 bps. Both are <em>minimums</em> — the &quot;or more&quot; is doing real work, because it&apos;s what lets the board go bigger when it wants to. The September 2025 jump from 9% to 10% — a full 100 bps in one month — was exactly that discretion in action, used to drag a freshly-launched instrument back up off the floor.</p>
          <p>Strategy refiled the same four-band table in an 8-K on 5 February 2026. Nothing changed — same thresholds, same increments — so the rules that have governed every rate move since September 2025 are still the ones in force today. Worth knowing, because it means the framework you read once is the framework you can keep using.</p>

          <h2>The floors that actually bind</h2>
          <p>The VWAP table is management&apos;s stated intention, and Strategy has been clear it can change or suspend it at the board&apos;s discretion. What it <em>can&apos;t</em> rewrite at will is the Certificate of Designations — the binding legal terms — and that document is where the real protection sits. On the downside it locks in three things:</p>
          <ul>
            <li>Strategy <strong>can&apos;t cut</strong> the rate by more than 25 bps in a period, plus a small allowance if one-month term SOFR fell during it.</li>
            <li>Strategy <strong>can&apos;t cut</strong> below the prevailing one-month term SOFR rate — a floating floor that tracks short-term interest rates.</li>
            <li>Strategy <strong>can&apos;t cut at all</strong> until every accrued, unpaid dividend has been settled in full.</li>
          </ul>
          <p>That&apos;s an asymmetric ratchet, and it&apos;s the part I&apos;d point any income investor to first. There&apos;s no ceiling on increases — the rate can jump by any amount, any time — but cuts are boxed in: 25 bps at a time, never below SOFR, and only with a clean payment record behind them. Halving the rate would take the better part of a year. You don&apos;t get a guarantee, but you do get a mechanism that can&apos;t turn against you overnight.</p>

          <h2>The rate history</h2>
          <p>Seven increases in a row from September 2025 through March 2026 tell the story of an instrument stuck below par while Bitcoin slid and buyers stayed away above $95–$99:</p>
          <ul>
            <li>Aug 2025: <strong>9.00%</strong> — first dividend at the IPO rate ($0.750/share)</li>
            <li>Sept 2025: <strong>10.00%</strong> — +100 bps; the discretionary jump off deep below-par trading ($0.833/share)</li>
            <li>Oct 2025: <strong>10.25%</strong> — +25 bps ($0.854/share)</li>
            <li>Nov 2025: <strong>10.50%</strong> — +25 bps ($0.875/share)</li>
            <li>Dec 2025: <strong>10.75%</strong> — +25 bps ($0.896/share)</li>
            <li>Jan 2026: <strong>11.00%</strong> — +25 bps ($0.917/share)</li>
            <li>Feb 2026: <strong>11.25%</strong> — +25 bps ($0.938/share)</li>
            <li>Mar 2026: <strong>11.50%</strong> — +25 bps ($0.958/share)</li>
            <li>Apr 2026 onward: <strong>11.50%</strong> — held; VWAP sitting in the $99–$101 neutral zone</li>
          </ul>
          <p>The one outlier is that September jump — 100 bps, double the 50 bps minimum for sub-$95 trading. To me it reads as the board leaning hard on its discretion early, to steady an instrument that had opened well under its $100 par before it could drift any further.</p>

          <h2>Why it's held at 11.50% since March</h2>
          <p>Four months flat isn&apos;t inertia — under this framework it&apos;s a signal. A steady rate means the five-day VWAP has been landing in the $99–$101 neutral zone at each month-end. The earlier increases did their job: they pulled buyers in, nudged the price back towards $100, and once it settled the table called for no further change. This is the mechanism working exactly as designed — a self-correcting loop that uses the income rate to keep the price close to par. It&apos;s also why I read a STRC rate <em>change</em>, when one eventually comes, as information: it&apos;s telling you the price has drifted out of that band.</p>

          <h2>The semi-monthly proposal</h2>
          <p>Strategy has proposed switching STRC from monthly to semi-monthly payments, with a shareholder vote scheduled for 8 June 2026 — the outcome isn&apos;t confirmed yet. If it passes, holders would get two payments a month instead of one. The annual rate wouldn&apos;t change; only the frequency would. If you reinvest, slightly more frequent payments give a marginal compounding edge; if you take the income as cash, the yearly total is identical. It&apos;s a plumbing change, not a yield change.</p>

          <h2>Reading the filings yourself</h2>
          <p>If you want to verify any of this, it&apos;s all on EDGAR. Three filings carry the weight: the original 424B5 prospectus supplement (July 2025, with the Certificate of Designations and its rate-reduction limits), the 8-K of 28 August 2025 (which introduced the four-band VWAP table), and the 8-K of 5 February 2026 (which reaffirmed it). Strategy&apos;s full history is at <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001050446&type=&dateb=&owner=include&count=40" target="_blank" rel="noopener noreferrer">SEC EDGAR — Strategy Inc (CIK 0001050446)</a> — filter by 8-K for the framework filings, by 424B5 for the prospectus and any follow-on supplements.</p>

          <p>SATA, over at Strive, sets its rate the opposite way — no published bands, no mandatory steps, just a board decision each month. I put the two mechanisms side by side in <a href="/blog/sata-dividend-rate-mechanism">how SATA&apos;s rate is set</a>.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). Reading STRC&apos;s rate as a thermostat rather than a monthly verdict is how I personally think about it — it isn&apos;t financial advice, and the SEC filings are the place to confirm the detail.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Rate framework details are based on publicly available SEC filings as of June 2026. The dividend adjustment framework is management's stated intention and may be changed or suspended at any time. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'sata-dividend-rate-mechanism',
    title: "How SATA's Dividend Rate Is Set — And Why It Differs from STRC",
    metaTitle: 'SATA vs STRC: How Dividend Rates Are Set',
    date: '2026-06-04',
    excerpt: "SATA and STRC both nudge their rate monthly to hold the price near $100 par — but STRC follows a published rulebook and SATA follows a board's judgement. Strive's prospectus is unusually blunt about that discretion. Here's how SATA's rate is actually set, and what the filings say.",
    readTime: '7 min read',
    category: 'SATA',
    Content() {
      return (
        <>
          <p>Most preferred-stock prospectuses bury the rate-setting language in careful, hedged wording. Strive&apos;s does the opposite: it comes right out and says the board can cut SATA&apos;s rate &quot;in our sole and absolute discretion&quot; and &quot;without regard to the impact that reduction may have on the trading price.&quot; The first time I read that, it stopped me — because it&apos;s the cleanest statement I&apos;ve found of what really separates SATA from STRC. Both adjust their rate monthly to hold the price near $100 par. But STRC does it by following a published rulebook; SATA does it by board judgement. Same goal, two very different machines underneath — and it&apos;s worth understanding the difference before you treat either as a stable income holding.</p>

          <h2>SATA's rate is a board decision, full stop</h2>
          <p>Strive&apos;s November 2025 prospectus is unusually candid about who controls the rate. It gives Strive &quot;the right, in our sole and absolute discretion, to adjust the monthly regular dividend rate per annum,&quot; and spells out that Strive &quot;may, at any time in their sole and absolute discretion, and without the consent of any preferred stockholder, choose to reduce the monthly regular dividend rate per annum to the maximum extent permitted by the terms of the SATA Stock, without regard to the impact that reduction may have on the trading price or value of the SATA Stock.&quot;</p>
          <p>I don&apos;t think I&apos;ve seen a blunter disclaimer in an income product. Strive isn&apos;t promising to hold the rate, isn&apos;t binding itself to a schedule, and isn&apos;t pointing to any automatic trigger. Every month&apos;s rate is a fresh board call, fenced in only by the contractual limits written into the Certificate of Designation — which is where SATA and STRC turn out to look far more alike than the rate-setting style suggests.</p>

          <h2>What Strive says it's trying to do</h2>
          <p>There&apos;s no algorithm, but Strive has at least disclosed its intent. The prospectus says its &quot;current intention, which is subject to change in its sole and absolute discretion, is to adjust the monthly regular dividend rate per annum in such manner as Strive believes will maintain SATA Stock&apos;s trading price&quot; inside a target range — and that range has moved since launch:</p>
          <ul>
            <li><strong>At IPO (November 2025):</strong> a wide <strong>$95–$105</strong> band around par.</li>
            <li><strong>From March 2026:</strong> narrowed to <strong>$99–$101</strong> — a tight $2 band, the same operating range STRC effectively runs.</li>
          </ul>
          <p>That tightening came alongside a commitment not to issue new SATA below $100 through its at-the-market programme. Together they read as a more precise price-management posture as the instrument matured. But notice what they still aren&apos;t: neither is a binding contractual rule, and neither is a published table you could use to predict the next move. Intent isn&apos;t obligation.</p>

          <h2>Why there are no VWAP bands</h2>
          <p>STRC measures its price with a five-day VWAP — the five trading days before month-end — and that number maps straight onto a mandatory minimum move: below $95 forces at least +50 bps, $95–$98.99 at least +25 bps, and so on. SATA has no equivalent. Its Certificate of Designation does define a price measurement — a <strong>twenty-trading-day arithmetic average of sale prices</strong> — but it does a different job: it&apos;s an eligibility test for whether a <em>cut</em> is allowed, not a trigger that forces an <em>increase</em>. There&apos;s no table anywhere mapping price levels to required rate changes. Strive simply declares the rate each period, and the window that bites is the <strong>full prior dividend period</strong>: if the average price across that whole month was below $99, Strive can&apos;t cut, full stop.</p>

          <h2>Where SATA and STRC actually converge</h2>
          <p>Here&apos;s the part that surprised me, given how differently the two are governed: the downside protections are nearly identical. Before Strive can reduce SATA&apos;s rate, three things all have to be true:</p>
          <ul>
            <li>Either <strong>three months have passed</strong> since the November 2025 issue date, or the 20-day average has topped <strong>$100</strong> in the meantime — whichever comes first;</li>
            <li>all <strong>accumulated dividends</strong> for completed periods have been paid in full;</li>
            <li>the average price over the <strong>immediately preceding full dividend period</strong> was not below <strong>$99</strong>.</li>
          </ul>
          <p>Even with all three met, the cut is capped: <strong>25 basis points</strong> per period, plus a small allowance if one-month term SOFR fell during the period. And the rate can never go below one-month term SOFR — the same floating floor STRC has. There&apos;s no cap on increases for either instrument. So both run the same asymmetric ratchet: rates can be raised freely and by any amount, but cuts are small, need a clean payment record, and are blocked entirely whenever the stock has been trading below $99. For an income holder that asymmetry is what matters most — a sudden, steep cut simply isn&apos;t mechanically available to either board.</p>

          <h2>The rate history</h2>
          <p>SATA launched at <strong>$80</strong> — 20% below its $100 stated value — at a 12% rate, which put the effective yield on cost near 15% at the IPO and baked in an upward bias while it traded under par. The moves since have been steady and, notably, uniform:</p>
          <ul>
            <li>Nov 2025: <strong>12.00%</strong> — IPO; issue price $80 (~$1.000/share/month)</li>
            <li>Dec 2025: <strong>12.25%</strong> — +25 bps</li>
            <li>Jan 2026: <strong>12.25%</strong> — held, no change</li>
            <li>Feb 2026: <strong>12.50%</strong> — +25 bps</li>
            <li>Mar 2026: <strong>12.75%</strong> — +25 bps; target range narrowed to $99–$101</li>
            <li>Apr 2026: <strong>13.00%</strong> — +25 bps</li>
            <li>May 2026: <strong>13.00%</strong> — held</li>
          </ul>
          <p>Three things jump out at me. Every increase has been exactly 25 bps — the same size as the maximum permitted <em>cut</em> — so Strive seems to have quietly adopted 25 bps as its house step even though nothing requires it to. The January hold is the tell: an active step-up sequence simply paused, no published threshold crossed, because the board judged no change was needed. And the rate settled at 13% in May, the very month STRC settled at 11.50% — both reaching equilibrium together as Bitcoin recovered and each found its par-proximate range.</p>
          <p>There&apos;s one change already on the calendar. Strive has announced that from 16 June 2026 the annual rate stays at 13%, but SATA switches from monthly to daily payments — roughly $0.054 a share every business day. That&apos;s a frequency change, not a rate change: the income is the same, it just arrives in smaller, more frequent instalments.</p>

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

          <h2>What the IPO discounts tell you</h2>
          <p>Both launched below par, but SATA launched much further below. STRC priced at $90 — 10% under par, a 9% rate, roughly a 10% yield on cost. SATA priced at $80 — 20% under par, a 12% rate, roughly 15% on cost. That gap isn&apos;t just rate-management style; it&apos;s the market pricing risk. STRC&apos;s IPO raised about $2.5 billion; SATA&apos;s raised around $148 million — a much smaller raise from a younger, less-established issuer. The deeper discount and higher starting rate are what it took to bring buyers in. To me the 12% SATA start versus STRC&apos;s 9% is a genuine risk premium showing up on day one, not an accounting quirk.</p>

          <h2>The January hold: discretion in one decision</h2>
          <p>If you want a single moment that captures the difference, look at January 2026. STRC kept climbing through that winter window under its rules — 10.50% to 10.75% to 11.00% — because its month-end VWAP sat in a band that <em>forced</em> a minimum +25 bps. SATA, on a similar prior trajectory, just held at 12.25%. Under SATA&apos;s structure the board could look at the price, decide a pause was fine, and do nothing — no trigger, no table, no obligation. That judgement-based hold is something STRC&apos;s framework structurally can&apos;t produce. Whether you find that freedom reassuring or unsettling probably tells you which of the two suits you.</p>

          <h2>What it means if you're buying for income</h2>
          <p>The governance gap creates two different risk profiles. STRC&apos;s rulebook is more predictable: if you know where it&apos;s trading, you can reasonably guess the direction of the next move. SATA gives you no such read — each month&apos;s rate is genuinely management&apos;s call. But on downside protection they&apos;re effectively the same instrument: 25 bps maximum cut per period, a SOFR floor, and the $99 prior-period condition that blocks cuts near or below par. Those protections were drafted independently by two different companies and still landed in almost the same place, which tells you something about what the market now expects from these instruments. The upshot is identical for both — a dramatic cut isn&apos;t available, and any reduction would grind out slowly over many months.</p>
          <p>SATA&apos;s extra yield — 13% against STRC&apos;s 11.50% — is the price of all of that: a smaller, younger issuer, a shorter market record, and a rate set by discretion rather than rule. Whether that 150 bps is enough compensation is a judgement call, and for me it comes down to how much I trust Strive&apos;s management and its Bitcoin treasury growth, with the 18-month cash reserve sitting behind the near-term dividend as the backstop.</p>

          <h2>Reading the filings yourself</h2>
          <p>If you&apos;d rather check this than take my word for it, Strive&apos;s EDGAR history is public under CIK 0001920406. Three filings carry most of the weight: the original 424B5 prospectus supplement from November 2025 (the initial Certificate of Designation and the discretion language), the 8-K of 11 March 2026 (the target-range narrowing to $99–$101), and the 8-K of 13 May 2026 (the Amended and Restated Certificate of Designation behind the move to daily payments).</p>
          <p>You can browse the full history at <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001920406&type=&dateb=&owner=include&count=40" target="_blank" rel="noopener noreferrer">SEC EDGAR — Strive Inc (CIK 0001920406)</a> — filter by 8-K for the monthly rate announcements, by 424B5 for the prospectus supplements. For the other side of the comparison, I broke down STRC&apos;s rules-based version in <a href="/blog/strc-vwap-dividend-mechanism">how STRC&apos;s rate is set</a>.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). What I make of SATA&apos;s discretionary rate above is my own read of the filings, not financial advice — and Strive&apos;s own prospectus is the first place to confirm any of it.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. Rate mechanism details are based on publicly available SEC filings as of June 2026. SATA's dividend adjustment mechanism is entirely at management's discretion and may change at any time. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'bmnp-dividend-rate-mechanism',
    title: "How BMNP's Dividend Rate Is Set: Fixed Income, Weekly Payments, and Ethereum Staking",
    metaTitle: 'BMNP Dividend Rate: Fixed Income Explained',
    date: '2026-06-06',
    excerpt: "BMNP is the odd one out — not a Bitcoin play but an Ethereum one, funded by staking rewards from the largest corporate ETH holder around. Its 9.50% rate is fixed, paid weekly, and anchored by a redemption ladder instead of a monthly reset. Here's how it all works.",
    readTime: '7 min read',
    category: 'BMNP',
    Content() {
      return (
        <>
          <p>Every other instrument I track is, when you strip it back, a Bitcoin bet wrapped in a preferred share. BMNP isn&apos;t. Its income comes from Ethereum — specifically the staking rewards Bitmine earns on the largest corporate ETH pile in the world — and almost everything about how the dividend works is built differently too. The rate is fixed at 9.50% rather than monthly-adjusting, payments land weekly, and a redemption ladder does the price-anchoring job that STRC and SATA hand to their rate mechanism. BMNP — Series A Perpetual Preferred Stock from Bitmine Immersion Technologies — is expected to start trading on the NYSE on or around 10 June 2026, so this is a look at how it&apos;s built rather than how it&apos;s traded.</p>

          <h2>The company behind it</h2>
          <p>Bitmine Immersion Technologies (NYSE: BMNR) started life as a Bitcoin miner running immersion-cooled rigs, then pivoted hard through 2024–25 — selling down the mining business and ploughing the capital into Ethereum, much as Strategy did with Bitcoin. By early 2026 it was the largest corporate holder of ETH in the world. As of 28 February 2026 it held over <strong>4.47 million ETH</strong> — about 3.71% of the circulating supply, worth roughly <strong>$8.8 billion</strong> — alongside 195 BTC, an $880 million cash pile and a $180 million stake in Beast Industries, for around <strong>$9.9 billion</strong> in total assets. The stated ambition is to own roughly 5% of all ETH.</p>
          <p>The piece that matters for BMNP is what Bitmine does with that ETH. In March 2026 it launched <strong>MAVAN</strong> — its <strong style={{color:'#ffffff'}}>M</strong>ade in <strong style={{color:'#ffffff'}}>A</strong>merica <strong style={{color:'#ffffff'}}>VA</strong>lidator <strong style={{color:'#ffffff'}}>N</strong>etwork — a proprietary institutional staking platform; by May it had more than $14 billion of ETH staked through it, and it bought infrastructure provider <strong>Pier Two Holdings</strong> to deepen the operation. This is a genuinely growing business: quarterly revenue hit $11 million for the three months to 28 February 2026, up from $1.5 million a year earlier, driven by staking and ETH option income. The BMNP raise — about <strong>$274.8 million</strong> net — is earmarked for more ETH and more MAVAN.</p>

          <h2>A fixed rate, not a monthly adjustment</h2>
          <p>The biggest structural break from STRC and SATA is that BMNP&apos;s <strong>9.50% rate is fixed at issuance</strong>. There&apos;s no VWAP band table, no algorithmic trigger, no published target range that nudges the rate up or down as the price moves around $100. STRC runs a strict four-band VWAP rulebook; SATA leaves it to board discretion within a loose $99–$101 intention. BMNP is closest to SATA — the board can adjust the rate in future — but it goes further by publishing no mechanism at all. The 9.50% is a starting coupon, not a peg.</p>
          <p>That fixed rate is best read together with the issue price. Bitmine priced BMNP at <strong>$80</strong> — 20% below the $100 stated amount, the very same structure Strive used for SATA&apos;s $80 IPO. At $80, a 9.50% stated rate is an <strong>effective yield of about 11.875%</strong> on cost (9.50 ÷ 80). That&apos;s the trick: the deep discount lifts a modest-looking headline rate into the same neighbourhood as STRC (11.50% at par) and SATA (13% at par). At ~11.875% effective, BMNP slots in between the two on day-one yield — and asks you to buy the Ethereum thesis on top.</p>

          <h2>Weekly payments</h2>
          <p>BMNP pays <strong>weekly, in arrears</strong> — 52 payments a year, each off a record date 10 days before payment. At 9.50% on the $100 stated amount that&apos;s roughly <strong>$0.183 a share a week</strong> (9.50 ÷ 52), and Bitmine keeps the option to pay even more often if it wants. On cadence the three line up neatly: SATA pays daily (every NYSE business day from 16 June 2026, ~250 a year), BMNP weekly, STRC monthly. One quirk worth noting — BMNP&apos;s weeks run on the calendar, not the exchange, so payments keep coming whether or not a given day is a NYSE trading day. For anyone reinvesting, 52 cycles a year compounds meaningfully faster than 12; for anyone living off the income, it&apos;s simply a steadier drumbeat.</p>

          <h2>What actually funds it: Ethereum staking</h2>
          <p>Bitmine is blunt in its prospectus about where the money comes from: it &quot;expects to fund any dividends paid on the Series A Preferred Stock primarily through the yield generated on our ETH holdings from staking, option strategies on Ethereum and additional capital raising activities.&quot; That&apos;s the real point of difference. STRC&apos;s dividends lean on Strategy&apos;s broader capital structure and cash; SATA&apos;s come from a dedicated 18-month cash reserve behind Strive&apos;s Bitcoin. BMNP&apos;s come from Ethereum doing work — two streams in particular:</p>
          <ul>
            <li><strong>Staking through MAVAN</strong> — as of 25 May 2026 about 4.7 million ETH was staked via MAVAN, some 87% of Bitmine&apos;s holdings and roughly 3.9% of all staked ETH. At a gross staking APR of about 2.5–4.0%, that points to roughly <strong>$276 million</strong> a year in staking revenue.</li>
            <li><strong>ETH option premiums</strong> — Bitmine writes options against its ETH, which brought in $24.1 million in the three months to 28 February 2026 on top of the base staking yield.</li>
          </ul>
          <p>Set that against the obligation. At 9.50% on 3.5 million shares of $100 stated value, BMNP costs about <strong>$33.25 million a year</strong> in dividends — and projected staking revenue alone covers that roughly <strong>eight times over</strong>. That&apos;s a comfortable-looking cushion, and it&apos;s the number that reassures me most about the instrument. The honest caveats: staking yield moves with the ETH price and network conditions, and the preferred dividend isn&apos;t Bitmine&apos;s only claim on that cash — common shareholders and operating costs sit in the picture too. But on the figures at launch, the income behind BMNP is well covered.</p>

          <h2>What happens if a payment is missed</h2>
          <p>BMNP&apos;s dividends are <strong>cumulative</strong>, and the structure has real teeth if Bitmine ever falls behind. Miss a scheduled payment and the unpaid amount doesn&apos;t vanish — it starts compounding at an <strong>escalating penalty rate</strong>:</p>
          <ul>
            <li>the compounding rate begins at the regular rate <strong>plus 5 basis points</strong> (compounding weekly);</li>
            <li>it climbs a further <strong>5 bps every week</strong> the arrears go unpaid;</li>
            <li>and it&apos;s capped at <strong>15% a year</strong>.</li>
          </ul>
          <p>The effect is to make delay expensive — and more expensive the longer it runs — which is a strong incentive to clear arrears fast and a guarantee that nothing simply gets written off. On top of that, if Bitmine doesn&apos;t declare a dividend by the record date it has to spend the next 30 days using commercially reasonable efforts to raise the cash — selling common stock, other securities or digital assets — to cover it. And two consecutive misses trigger a &quot;regular dividend non-payment event,&quot; which hands preferred holders the right to appoint extra board members. That governance lever is the part I&apos;d weigh most: it means a persistent payment problem doesn&apos;t leave holders as bystanders.</p>

          <h2>The redemption premium as a price anchor</h2>
          <p>STRC and SATA keep their price near $100 by moving the rate. BMNP, with a fixed rate, leans on something else: a <strong>redemption premium schedule</strong>. Bitmine can buy the stock back at any time, but early buy-backs cost it a premium:</p>
          <ul>
            <li>until <strong>10 December 2027</strong> (18 months after issue): <strong>110%</strong> — $110 a share, plus unpaid dividends;</li>
            <li>from then until <strong>10 June 2029</strong> (three years post-issue): <strong>105%</strong> — $105 a share, plus unpaid dividends;</li>
            <li>after 10 June 2029: <strong>100%</strong> — $100 a share, plus unpaid dividends.</li>
          </ul>
          <p>That does quiet work on the downside. An investor who bought at the $80 IPO and saw an early buy-back inside the first 18 months would be paid $110 — better than a 35% premium to cost. Even if the market price drifts under $100, the prospect of a 5–10% premium over stated value on an early buy-back gives holders a concrete reason to sit tight. It&apos;s a different route to the same place STRC and SATA reach through their rate mechanism: a reason for the price not to wander too far from par.</p>

          <h2>Reading the filings yourself</h2>
          <p>Everything here comes from Bitmine&apos;s SEC filings on EDGAR. The document to read is the final 424B5 prospectus supplement filed <strong>5 June 2026</strong> — it carries the full Certificate of Designations, the rate language, the compounding-penalty mechanism and the redemption schedule. Bitmine&apos;s filing history is at <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001829311&type=&dateb=&owner=include&count=40" target="_blank" rel="noopener noreferrer">SEC EDGAR — Bitmine Immersion Technologies (CIK 0001829311)</a>.</p>
          <p>For how the other two set their rates, I covered STRC&apos;s rules-based VWAP framework in <a href="/blog/strc-vwap-dividend-mechanism">how STRC&apos;s rate is set</a> and SATA&apos;s discretionary approach in <a href="/blog/sata-dividend-rate-mechanism">how SATA&apos;s rate is set</a>. The <a href="/bmnp">BMNP hub</a> shows the live price and effective yield once it starts trading.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). BMNP&apos;s Ethereum-staking model is the one I&apos;ve spent the least time with of the three, so take the above as my early read of the filings, not financial advice — and the prospectus is the place to confirm the detail.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. BMNP is a newly issued instrument settling June 10, 2026. Rate and structural details are based on publicly available SEC filings as of June 2026 and are subject to change. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'bmnp-vs-strc-sata',
    title: 'BMNP vs STRC and SATA: The Ethereum-Backed Alternative Explained',
    metaTitle: 'BMNP vs STRC & SATA: Ethereum Alternative',
    date: '2026-06-09',
    excerpt: "Rank them by headline rate — SATA 13%, STRC 11.50%, BMNP 9.50% — and BMNP looks like the loser. It isn't that simple: it's backed by Ethereum, not Bitcoin, and pays from staking rewards rather than a Bitcoin balance sheet. Here's how all three really compare.",
    readTime: '7 min read',
    category: 'BMNP',
    Content() {
      return (
        <>
          <p>Line the three up by headline rate — SATA at 13%, STRC at 11.50%, BMNP at 9.50% — and BMNP looks like the obvious loser. I think that&apos;s the wrong way to read them. The headline rate is the least interesting number here, because BMNP is barely the same kind of bet as the other two: it&apos;s backed by Ethereum rather than Bitcoin, and it pays you out of staking rewards rather than a Bitcoin balance sheet. Once that clicks, the question stops being &quot;which yields most&quot; and becomes &quot;which asset, and which way of earning on it, do I actually want.&quot;</p>

          <h2>Ethereum versus Bitcoin</h2>
          <p>The split that matters most is the asset underneath each one. <strong>STRC</strong> comes from <strong>Strategy</strong>, the largest corporate Bitcoin holder in the world — 843,000-plus BTC — so STRC&apos;s health is tied straight to Bitcoin&apos;s price. <strong>SATA</strong> comes from <strong>Strive</strong>, which holds 19,000 BTC (~$1.35 billion) behind an 18-month cash reserve: a smaller treasury than Strategy&apos;s, but with explicit near-term income cover on top of the Bitcoin upside. <strong>BMNP</strong> comes from <strong>Bitmine Immersion Technologies</strong>, the largest corporate holder of Ethereum — over 4.47 million ETH as of February 2026, about 3.71% of the circulating supply.</p>
          <p>That&apos;s not a cosmetic difference. Bitcoin and Ethereum have different supply dynamics, different uses and different risk profiles, so picking between these three isn&apos;t only a yield decision — you&apos;re taking a position on the underlying asset, or deliberately spreading across both. For me that&apos;s the first thing to be honest with yourself about, before the rate even comes into it.</p>

          <h2>How each one actually earns the dividend</h2>
          <p>The deeper difference is how the asset throws off the cash that pays you. <strong>Strategy</strong> earns no yield on its Bitcoin — Bitcoin doesn&apos;t stake or pay interest, it just sits there. STRC&apos;s dividends come from Strategy&apos;s software revenues, its constant access to capital markets, and a $1.1 billion cash reserve set aside for preferred and debt obligations; Bitcoin&apos;s price strengthens the balance sheet over time but produces no cash flow. <strong>Strive</strong> is similar — Bitcoin is a treasury asset, and near-term dividend security comes from its dedicated 18-month cash reserve ($137 million as of June 2026), not from any yield on the coins.</p>
          <p><strong>Bitmine is the one that&apos;s genuinely different.</strong> It earns an active yield on its Ethereum through proof-of-stake: deposit ETH to validator nodes, collect staking rewards in ETH. It does this at scale through <strong>MAVAN</strong> — its <strong style={{color:'#ffffff'}}>M</strong>ade in <strong style={{color:'#ffffff'}}>A</strong>merica <strong style={{color:'#ffffff'}}>VA</strong>lidator <strong style={{color:'#ffffff'}}>N</strong>etwork, launched March 2026 — which by 25 May 2026 had over <strong>$14 billion of ETH staked</strong> globally, Bitmine&apos;s own 4.7 million ETH among it (roughly 3.9% of all staked ETH). At a gross staking rate of about <strong>2.5–4.0%</strong>, that points to roughly <strong>$276 million</strong> a year in staking revenue, and Bitmine writes options on its ETH on top ($24.1 million in the three months to 28 February 2026). It also bought infrastructure provider <strong>Pier Two Holdings</strong> in May 2026 to deepen the validator operation.</p>
          <p>This is the distinction I&apos;d put right at the centre of the whole comparison. BMNP&apos;s Ethereum actively <em>earns</em> the money that pays the dividend — stake the ETH, collect the rewards, pass them to holders. STRC and SATA&apos;s Bitcoin earns nothing; it just sits on the balance sheet. Their dividends are funded from elsewhere — revenues, capital raises, a cash reserve — and the Bitcoin&apos;s role is to hold or rise in value over time to keep the model solvent. So the two camps need different things from their asset: STRC and SATA need Bitcoin to <em>appreciate</em>, while BMNP just needs Ethereum to keep <em>producing</em>. That also gives BMNP a built-in flywheel — proceeds buy ETH, the ETH gets staked, the staking income funds the payout and the next round of buying. Whether that&apos;s a genuine advantage or simply a different set of moving parts is the real judgement call here.</p>

          <h2>The headline yield — and why it lies</h2>
          <p>At stated rates on the $100 amount:</p>
          <ul>
            <li><strong>STRC</strong>: 11.50% — about $0.479 a share twice a month, $11.50 a year</li>
            <li><strong>SATA</strong>: 13.00% — about $0.054 a share each NYSE business day, $13.00 a year</li>
            <li><strong>BMNP</strong>: 9.50% — about $0.183 a share each week, $9.50 a year</li>
          </ul>
          <p>So BMNP looks lowest — but the stated rate is measured against $100 par, and what you actually earn depends on what you pay. BMNP launched at an <strong>$80 IPO price</strong>, 20% below par. Buy at $80 and the 9.50% becomes an <strong>effective yield of about 11.875%</strong> (9.50 ÷ 80) — above STRC&apos;s 11.50% and closing on SATA&apos;s 13%. If BMNP&apos;s price drifts up towards $100, new buyers get less; but anyone in at $80 keeps that ~11.875% on their cost whatever the price does later. This is the one thing I&apos;d want a newcomer to take away: the rate on the label and the yield in your pocket are not the same number.</p>

          <h2>Rate structure: fixed versus adjustable</h2>
          <p>The three also manage the rate completely differently over time. <strong>STRC</strong> follows a published four-band VWAP rulebook: where its five-day average price sits against $100 at month-end forces a minimum move — below $95, at least +50 bps; $95–$98.99, at least +25 bps; $99–$100.99, no change; above $101, at least −25 bps. Predictable, if you know the price. <strong>SATA</strong> is the opposite — a wholly discretionary board call each month, no published bands, though with the same downside protections as STRC (25 bps cut cap, SOFR floor, a $99 price condition on cuts). <strong>BMNP</strong> sits a step further still: a <strong>fixed 9.50%</strong> with no published adjustment framework at all. The board can in principle adjust it under the Certificate of Designations, but nothing was published at IPO — the issuance rate is the starting point, full stop.</p>
          <p>That makes BMNP the least transparent of the three on rate management and, oddly, potentially the most stable in the near term. A fixed rate with no quick mechanism to cut it is, from an income buyer&apos;s seat, a feature rather than a flaw — for as long as the issuer can keep paying it.</p>

          <h2>The three side by side</h2>
          <p>Pulling the whole comparison into one view — issuer, asset, income source, rate, price and cadence:</p>
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
                  <td style={{ padding: '0.75rem 1rem' }}>Nasdaq: SATA</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>BMNP's extra: a redemption premium</h2>
          <p>Here&apos;s one thing BMNP gives holders that the other two don&apos;t. If Bitmine wants to buy the stock back inside the first 18 months — before 10 December 2027 — it has to pay <strong>110% of par, $110 a share</strong>, plus any unpaid dividends. From then until June 2029 the buy-back price is 105%; after that, par. For someone who bought at the $80 IPO, an early buy-back at $110 is a <strong>37.5% capital gain</strong> on top of the income already collected. STRC and SATA can both be bought back at par with no premium. That schedule quietly props the price up near term: no rational seller dumps far below $110 when the issuer would have to pay at least that to force them out — a floor neither STRC nor SATA has.</p>

          <h2>The risks, honestly</h2>
          <p>All three carry the basic preferred-equity risk: dividends are equity obligations, not guaranteed debt, and each issuer&apos;s health is tied to its treasury asset. BMNP&apos;s is the most distinct. Ethereum&apos;s price drives Bitmine&apos;s balance sheet, and staking rewards — comfortably covering the dividend today — can compress if ETH falls or if a much larger share of the supply gets staked and validator returns thin out. ETH is also a newer, more complex asset than Bitcoin, carrying smart-contract, protocol-upgrade and regulatory exposure that Bitcoin doesn&apos;t.</p>
          <p>And the flip side of BMNP&apos;s fixed rate: with no monthly adjustment, there&apos;s no automatic mechanism dragging the price back to par if it drifts. STRC&apos;s VWAP rule is an observable circuit-breaker; BMNP leans on the redemption premium instead, which only bites through the issuer&apos;s call option, not an automatic rate move. So what BMNP really offers is a different thesis, not a better one: Ethereum-denominated income earned by active staking, versus passive Bitcoin treasuries or a cash-reserve drawdown. Whether that&apos;s welcome diversification or just extra complexity comes down to your read on Ethereum, and on how durable staking yields prove to be.</p>

          <h2>Where to look next</h2>
          <p>The <a href="/bmnp">BMNP hub</a> shows live price and effective yield once BMNP starts trading on 10 June 2026, and the <a href="/vs-treasuries?stock=strc">STRC</a> and <a href="/vs-treasuries?stock=sata">SATA</a> vs-Treasuries pages set each against ordinary income benchmarks. If you want the rate mechanics in full, I broke each one down separately: <a href="/blog/strc-vwap-dividend-mechanism">STRC&apos;s VWAP rulebook</a>, <a href="/blog/sata-dividend-rate-mechanism">SATA&apos;s discretionary approach</a>, and <a href="/blog/bmnp-dividend-rate-mechanism">BMNP&apos;s fixed rate and compounding protection</a>.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). BMNP&apos;s Ethereum-staking model is newer to me than the other two, so the comparison above is my own read, not financial advice — and which of the three suits you depends as much on Bitcoin-versus-Ethereum as on the yield.</em></p>

          <p className="disclaimer">This article is for educational purposes only and does not constitute financial advice. BMNP, STRC, and SATA are speculative investments. Figures for BMNP are based on the June 2026 prospectus supplement and pre-launch data. All rates, prices and holdings are subject to change. Always consult a qualified financial adviser before making investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'strc-sata-dividend-frequency-changes-june-2026',
    title: 'STRC Goes Semi-Monthly and SATA Goes Daily: What Changes and When',
    metaTitle: 'STRC Semi-Monthly & SATA Daily Dividends',
    date: '2026-06-10',
    excerpt: "Two dividend changes land this month, and neither touches what you actually earn. STRC moves to twice-monthly payments after the 8 June vote (first new payment 15 July); SATA switches to daily from 16 June. Here's what changes, what doesn't, and the dates to watch.",
    readTime: '4 min read',
    category: ['STRC', 'SATA'],
    Content() {
      return (
        <>
          <p>Two of the three instruments I track change how often they pay this month — STRC moving to twice a month, SATA to every business day. Before anyone reads too much into that: neither change touches what you actually earn in a year. The rate stays put; only the rhythm changes. The dates do matter if you&apos;re holding through the switch, though, so here&apos;s exactly what happens and when.</p>

          <h2>STRC: monthly becomes semi-monthly</h2>
          <p>On 8 June 2026, Strategy&apos;s stockholders approved moving STRC from one payment a month to two. Both common holders and STRC preferred holders backed it at Strategy&apos;s 2026 Annual Meeting.</p>
          <p>The annual rate is untouched at <strong>11.50%</strong> — each payment is simply halved:</p>
          <ul>
            <li>Previously: approximately <strong>$0.958 per share each month</strong></li>
            <li>From July 2026: approximately <strong>$0.479 per share twice a month</strong></li>
          </ul>
          <p>The handover is clean: the last monthly payment runs on the old schedule, then the twice-monthly cadence picks up.</p>
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
          <p>Each payment still needs board declaration. Strategy&apos;s reasoning is to steady STRC&apos;s price, smooth the cyclicality that built up around the single monthly payment date, improve liquidity, and let holders reinvest more often. That last point is the only one that changes anything for you — and only if you reinvest.</p>

          <h2>SATA: monthly becomes daily</h2>
          <p>SATA goes from monthly to <strong>daily</strong> payments on <strong>16 June 2026</strong>. From that date it pays every NYSE business day — roughly 250 payments a year.</p>
          <p>Again the annual rate doesn&apos;t move, holding at <strong>13%</strong>; the monthly amount is just sliced across the business days:</p>
          <ul>
            <li>Before: approximately <strong>$1.083 per share each month</strong></li>
            <li>From 16 June: approximately <strong>$0.052 per share each NYSE business day</strong></li>
          </ul>
          <p>The exact daily figure wobbles a little month to month with the number of trading days. Daily is the headline-grabber of the two changes, but in practice it&apos;s the same income arriving in 250 small pieces instead of 12 larger ones. Where it genuinely helps is reinvestment — up to 250 compounding points a year rather than 12, which adds up over a long holding period even if it&apos;s barely visible in the short run.</p>

          <h2>What doesn't change</h2>
          <p>The economics. Both yields — 11.50% on STRC, 13% on SATA — are untouched, so the total income on a given holding over a year is exactly what it was before, however often it lands. The adjustable-rate mechanisms that set each rate each period are unaffected too. Take your dividends as cash and nothing about your year changes; reinvest and you get marginally more compounding from the extra cycles — real over many years, modest in the near term. That&apos;s genuinely the whole story: a change of rhythm, not of return.</p>

          <h2>Key dates</h2>
          <ul>
            <li><strong>8 June 2026</strong> — STRC semi-monthly change approved by shareholders</li>
            <li><strong>15 June 2026</strong> — STRC last monthly record date</li>
            <li><strong>16 June 2026</strong> — SATA daily dividends begin</li>
            <li><strong>30 June 2026</strong> — STRC last monthly payment; first semi-monthly record date</li>
            <li><strong>15 July 2026</strong> — STRC first semi-monthly payment (subject to board declaration)</li>
          </ul>
          <p>Both changes are reflected across the trackers, projectors and dividend-history pages here — the <a href="/strc">STRC hub</a> and <a href="/sata">SATA hub</a> show the current rates and per-payment amounts on the new schedules.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). My honest take is that these frequency changes matter far less than they look — useful if you reinvest, neutral if you don&apos;t. Not financial advice.</em></p>

          <p className="disclaimer">This article is for informational purposes only and does not constitute financial advice. Dividend payments are subject to board declaration each period. Always consult a qualified financial adviser before making any investment decisions.</p>
        </>
      );
    },
  },
  {
    slug: 'two-roads-to-a-bitcoin-bank',
    title: "Two Roads to a Bitcoin Bank: How Metaplanet's Model Differs from Strategy's",
    metaTitle: "Two Roads to a Bitcoin Bank: Metaplanet vs Strategy",
    date: '2026-06-13',
    excerpt: "Metaplanet looks like another Strategy tribute act — big Bitcoin pile, dividend-paying preferred shares. But last week it bought a Japanese brokerage outright, which tells you it's building something different: a Bitcoin bank that sells direct to Japanese savers.",
    readTime: '8 min read',
    category: 'Metaplanet',
    Content() {
      return (
        <>
          <p>For most of the past two years, the Bitcoin treasury company has really been a story about one firm. Strategy — the business Michael Saylor built out of the old MicroStrategy — wrote the playbook everyone now borrows: raise money, buy Bitcoin, repeat, and watch the amount of Bitcoin behind each share climb over time. The instruments I track on this site are all variations on that one theme: Strategy&apos;s own <a href="/blog/strc-vwap-dividend-mechanism">STRC</a>, Strive&apos;s <a href="/blog/sata-dividend-rate-mechanism">SATA</a>, and now Bitmine&apos;s freshly listed <a href="/blog/bmnp-dividend-rate-mechanism">BMNP</a>.</p>

          <p>Japan&apos;s Metaplanet looks, at first glance, like another tribute act. It holds a large pile of Bitcoin, its share price rises and falls with the coin, and it has been issuing the same sort of dividend-paying preferred shares that made Strategy famous. But look a little closer and it&apos;s quietly building something with a rather different shape — and the reason I think it&apos;s worth a write-up is that it may be the first of these companies to change the destination, not just the vehicle. Below I walk through how its two preferred share classes work, where they part company with Strategy, and why an acquisition announced last week may matter more than either.</p>

          <h2>A quick reminder of what a preferred share actually is</h2>
          <p>If you already live and breathe this stuff, skip ahead. For everyone else, a preferred share sits somewhere between a bond and an ordinary share. Like a bond, it pays a regular, agreed income. Like a share, it has no fixed repayment date and ranks below the company&apos;s lenders if things go wrong. The appeal for a Bitcoin treasury company is simple: it can raise cash by selling these income-paying shares without handing out more ordinary shares and shrinking each existing owner&apos;s slice of the pie. The cash comes in, more Bitcoin gets bought, and the ordinary shareholders are not diluted in the process.</p>
          <p>That is the engine. Now to the two machines Metaplanet has bolted onto it.</p>

          <h2>Metaplanet&apos;s two-tier design: MARS and MERCURY</h2>
          <p>Where Strategy has grown a sprawling stack of separate preferred products, Metaplanet has kept things to two named tiers stacked one on top of the other.</p>
          <p>The senior tier is called <strong>MARS</strong>. It is the one that most closely resembles Strategy&apos;s flagship. MARS pays a dividend that adjusts every month, and it carries a clever self-righting feature: when the share trades below its set value the dividend rate rises to lure buyers back, and when it trades above, the rate falls. The aim is to keep the price hovering near its anchor rather than swinging about. MARS holders sit near the front of the queue for payment and cannot convert their shares into ordinary stock — they are there for the income, not the lottery ticket.</p>
          <p>The junior tier is called <strong>MERCURY</strong>, and it is the one Metaplanet has actually sold so far, raising around 150 million dollars from large institutions late in 2025. MERCURY pays a fixed dividend of just under 5 per cent, but it comes with a twist MARS lacks: the right, much further down the line, to convert into ordinary shares. That makes it a hybrid — part steady income, part bet on the share price climbing. One of the company&apos;s own executives described it as part bond, part Bitcoin call option, part treasury accelerator, which is a fair summary.</p>
          <p>Put simply, MARS is the pure income instrument — senior, stable, and non-convertible; MERCURY is the hybrid, trading a lower headline rate for a long-term bet on the ordinary share price.</p>

          <h2>Where this parts company with Strategy</h2>
          <p>Three differences are worth understanding, and none of them require a spreadsheet.</p>
          <p><strong>The income looks far lower — but mostly because of the currency.</strong> Strategy&apos;s headline preferred share recently paid north of 11 per cent. Metaplanet&apos;s pay low-to-mid single digits. On the face of it that looks like a chasm, and a casual reader might conclude Strategy is simply more generous. The real explanation is geography. A dollar-denominated share competes against American government bonds, which themselves pay a meaningful return, so it has to offer a good deal more to stand out. A yen-denominated share competes against Japanese savings rates that have sat near zero for years, so even a modest dividend looks attractive to a Japanese saver. Measured against their respective home backdrops, the gap is far narrower than the raw numbers suggest. This is the point I see misunderstood most often in the coverage of Metaplanet, and the one I&apos;d hold onto.</p>
          <p><strong>The way the shares reach the market is different.</strong> Strategy&apos;s great advantage is a mechanism that lets it drip its preferred shares into the open market continuously, day after day, which is how it has raised billions. That particular tool is not available in Japan in the same form. Metaplanet instead relies on a warrant-based structure and sales to selected institutions — effective, but more stop-start. The constraint on the Japanese firm has never really been investor appetite; it has been the plumbing for getting the shares out of the door. That matters, because it points to where the company has just spent its money.</p>
          <p><strong>The structure is simpler, though both are tiered.</strong> Here I&apos;d be careful not to overstate the contrast. Strategy is itself deeply layered — I counted <a href="/blog/strategy-capital-structure">seven layers in its stack</a>, from senior debt down through five separate preferred series to the common shares. Metaplanet hasn&apos;t avoided tiers — it has just used far fewer of them. Its ladder runs senior MARS, junior MERCURY, ordinary shares at the bottom — the same idea of ranked seniority, but two preferred rungs rather than five. That makes it closer to how a traditional company organises its finances, and arguably an easier thing for a cautious investor to read.</p>

          <h2>Last week&apos;s move: buying the shop, not renting the shelf</h2>
          <p>On 12 June, Metaplanet announced what several outlets called a tie-up with a financial firm. That undersells it. The company is not partnering with anyone — it is buying a securities firm outright, paying around 13 million dollars for full ownership of a licensed Japanese brokerage called Siiibo, which it will rename Metaplanet Securities once the deal closes this summer.</p>
          <p>The reason this matters connects directly to that plumbing problem. Siiibo holds a licence that allows it to create and sell investment products directly to ordinary Japanese savers, and it already runs an online platform that has handled more than a hundred bond sales. By owning it, Metaplanet acquires its own distribution channel and the regulatory permission to manufacture financial products in-house. Rather than depending on overseas institutions to take its preferred shares, it could in time issue Bitcoin-backed bonds and preferred shares and sell them straight to the Japanese public.</p>
          <p>And the size of that public is the whole point. Japanese households sit on something in the region of 7.4 trillion dollars held in cash and low-yielding deposits. Metaplanet&apos;s bet is that, with inflation nibbling at the value of those savings, some of that money will go looking for a return — and that a Bitcoin-backed product sold through a familiar, regulated, Japanese brokerage is exactly the bridge a cautious saver might be willing to cross. The company can begin with its own register of roughly a quarter of a million existing shareholders. This is what its leadership calls &ldquo;Project Nova&rdquo;, a plan to turn a company that simply holds Bitcoin into one that builds and sells financial products on top of it.</p>
          <p>It is, in spirit, the same destination Saylor once described for Strategy — the idea of becoming a sort of Bitcoin bank. The difference is method. Strategy talks about building those instruments; Metaplanet has gone out and bought the licensed firm that can distribute them.</p>

          <h2>The honest caveats</h2>
          <p>None of this is happening in a calm market, and it would be misleading to pretend otherwise. Bitcoin has fallen sharply over the past year, Metaplanet recently reported a heavy paper loss from marking its holdings down to current prices, and the value the market places on the company has slipped just below the value of the Bitcoin it actually owns. In that situation the firm&apos;s own chief executive has said he would seriously consider buying back ordinary shares rather than issuing new ones — which is the opposite of expansion. So the near-term signal is caution, not a fundraising spree.</p>
          <p>The acquisition is best understood as building the road before the traffic arrives. The securities firm it is buying is itself loss-making and small, the new products will all need regulatory sign-off before they can launch, and the whole plan rests on Japanese savers eventually warming to the idea. Whether that happens is genuinely unknown.</p>
          <p>But as a statement of direction, it is a clear one. Strategy showed the world that a public company could turn itself into a vehicle for accumulating Bitcoin. Metaplanet is testing whether the next step is to turn that vehicle into a shop — one that sells the income-paying instruments built on a Bitcoin balance sheet directly to the people whose savings have nowhere productive to go. Two firms, the same starting point, and increasingly two different roads.</p>

          <p><em>I track STRC and SATA daily and hold positions in their parent issuers (MSTR and ASST). Metaplanet isn&apos;t one I hold or follow as closely, so the read above is my own interpretation of where it&apos;s heading rather than financial advice — and &ldquo;Project Nova&rdquo; is a stated plan, not a done deal.</em></p>

          <p className="disclaimer">This article is for general information and education. It is not investment advice, and the author is not a financial adviser. Crypto-linked preferred shares are volatile and may not be suitable for all investors. Always do your own research.</p>
        </>
      );
    },
  },
];

export function getArticle(slug) {
  return articles.find(a => a.slug === slug) ?? null;
}
