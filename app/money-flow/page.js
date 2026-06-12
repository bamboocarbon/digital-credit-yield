import AadsAd from '@/components/AadsAd';
import { STRCMoneyFlowChart, SATAMoneyFlowChart, BMNPMoneyFlowChart } from '@/components/MoneyFlowChart';  // BMNPMoneyFlowChart only rendered when BMNP_ENABLED
import CumulativeFlowChart from '@/components/CumulativeFlowChart';
import MoneyFlowStats from '@/components/MoneyFlowStats';
import { BMNP_ENABLED } from '@/lib/constants';

// Date the narrative zones below were last revised — shown next to the story heading
const STORY_UPDATED = '11 June 2026';

export function generateMetadata() {
  const instruments = BMNP_ENABLED ? 'STRC, SATA & BMNP' : 'STRC & SATA';
  const desc = `Weekly capital raised by ${instruments} tracked from SEC 8-K filings since each IPO. Bar charts and cumulative totals showing investor demand over time.`;
  return {
    alternates: { canonical: '/money-flow' },
    title: `Money Flow — ${instruments}`,
    description: desc,
    openGraph: {
      title: `Money Flow — ${instruments} Capital Raised Since IPO`,
      description: desc,
      type: 'website',
      url: 'https://www.digitalcredityield.com/money-flow',
      images: [{ url: '/api/og?v=2&title=Money+Flow&sub=Capital+raised+since+IPO&tag=Data' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Money Flow — ${instruments} Capital Raised Since IPO`,
      description: desc,
    },
  };
}

export default function MoneyFlowPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">Money Flow</h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Weekly capital raised by {BMNP_ENABLED ? 'STRC, SATA and BMNP' : 'STRC and SATA'}, compiled
          from SEC 8-K filings since each IPO.
          {BMNP_ENABLED && ' BMNP listed on the NYSE in June 2026.'}
        </p>
      </div>

      {/* Totals */}
      <MoneyFlowStats />

      {/* Side-by-side weekly bars */}
      <div className={`grid grid-cols-1 gap-6 mb-6 ${BMNP_ENABLED ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">STRC</span>
              <span className="text-xs font-medium"
                style={{ color: '#4ade80' }}>Strategy Preferred</span>
            </div>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>IPO Jul 2025 · 11.50% · $4.2B ATM programme</p>
          <STRCMoneyFlowChart />
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">SATA</span>
              <span className="text-xs font-medium"
                style={{ color: '#3b82f6' }}>Strive Preferred</span>
            </div>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>IPO Nov 2025 · 13.00% · $500M ATM programme</p>
          <SATAMoneyFlowChart />
        </div>

        {BMNP_ENABLED && (
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">BMNP</span>
                <span className="text-xs font-medium"
                  style={{ color: '#fde047' }}>BitMine Preferred</span>
              </div>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>IPO expected Jun 2026 · TBC% · ATM programme TBC</p>
            <BMNPMoneyFlowChart />
          </div>
        )}
      </div>

      {/* Cumulative line chart */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-lg font-bold mb-1">Cumulative Capital Raised</h2>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          Linear shows STRC&apos;s dominance. Switch to Log to compare growth trajectories side by side.
        </p>
        <CumulativeFlowChart />
      </div>

      {/* Story zones — update STORY_UPDATED whenever a zone is added or revised */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
          <h2 className="text-lg font-bold">The Story Behind the Charts</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Story last updated: {STORY_UPDATED}</p>
        </div>

        <div className="space-y-5">

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-1 rounded-full" style={{ background: '#15803d' }} />
            <div>
              <p className="font-semibold text-sm mb-1">Zone 1 — STRC Launch <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Jul 2025</span></p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Strategy priced its STRC IPO at $90 per share on July 24, 2025, closing with gross proceeds of $2.52B — the largest US preferred stock IPO since 2009. Proceeds were immediately deployed into 21,021 BTC at an average of ~$117,256, bringing Strategy&apos;s total holdings to 628,791 BTC. A $4.2B at-the-market programme was announced days later on July 31, setting the stage for a sustained weekly capital machine.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-1 rounded-full" style={{ background: 'linear-gradient(#15803d 47%, var(--bg-card) 47%, var(--bg-card) 53%, #2563eb 53%)' }} />
            <div>
              <p className="font-semibold text-sm mb-1">Zone 2 — Quiet ATM <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Aug – Dec 2025</span></p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                The ATM programme ran at a measured pace through the second half of 2025 — typically $5–27M per week. Weekly raises were small relative to the IPO but consistent, totalling ~$235M over five months. This period established the mechanics of the programme and allowed the market to absorb the new instrument. SATA entered the picture in November with its own $160M IPO, immediately acquiring 1,567 BTC.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-1 rounded-full" style={{ background: 'linear-gradient(#15803d 47%, var(--bg-card) 47%, var(--bg-card) 53%, #2563eb 53%)' }} />
            <div>
              <p className="font-semibold text-sm mb-1">Zone 3 — Acceleration <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Jan – Feb 2026</span></p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                January 2026 marked a clear step-change. STRC weekly ATM raises jumped from ~$10M to $100–250M as institutional appetite grew and the programme gained credibility. Strategy acquired 41,002 BTC in January alone. SATA simultaneously closed a $225M follow-on on January 28 — oversubscribed with $600M+ in demand — signalling that the preferred equity Bitcoin playbook was being validated by the market. Both instruments were now in full capital-raising mode.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-1 rounded-full" style={{ background: '#15803d' }} />
            <div>
              <p className="font-semibold text-sm mb-1">Zone 4 — Breakout <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Mar – Apr 2026</span></p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                March 9 was the inflection point. STRC raised $1.18B in a single week — funding the purchase of 22,337 BTC at an average of $70,194. A month later, April 6 delivered another $1B week. These weren&apos;t anomalies; they reflected a structural shift in how institutional capital was being channelled into Bitcoin exposure via preferred equity. The cumulative line chart bends sharply upward from this point — the machine had found its stride.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-1 rounded-full" style={{ background: 'linear-gradient(#15803d 47%, var(--bg-card) 47%, var(--bg-card) 53%, #2563eb 53%)' }} />
            <div>
              <p className="font-semibold text-sm mb-1">Zone 5 — Record Run <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>May 2026</span></p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                May 25 saw STRC raise $2B in a single week — its largest weekly total. By this point STRC had raised $10.9B cumulatively, with 2026 year-to-date proceeds exceeding $5.58B through May 3 alone. SATA mirrored the momentum on a smaller scale: the week of May 25 produced a record 790 BTC purchase, more than doubling its previous weekly record of 371 BTC set earlier in the month. Both programmes are accelerating simultaneously, compressing the gap visible on the log scale.
              </p>
            </div>
          </div>

        </div>
      </div>

      <AadsAd />

      {/* Disclaimer */}
      <div className="rounded-xl p-5 mt-6" style={{ background: 'rgba(200,137,58,0.08)', border: '1px solid var(--accent-gold)' }}>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent-gold)' }}>Data Disclaimer</p>
        <p className="text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
          Capital flow data is compiled from publicly available SEC 8-K filings and is provided for informational purposes only. Figures represent gross proceeds reported at time of filing and may not reflect subsequent adjustments. This data does not constitute financial advice, investment advice, or a solicitation to buy or sell any financial instrument. Always consult a qualified financial adviser before making investment decisions.
        </p>
      </div>

    </div>
  );
}
