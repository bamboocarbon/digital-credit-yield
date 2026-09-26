import AadsAd from '@/components/AadsAd';
import DividendInteractive from '@/components/DividendInteractive';
import { SATA_DAILY_START, isSataDailyDividend } from '@/lib/sataBusinessDays';
import { STRC_SEMI_MONTHLY_START, BMNP_DIVIDEND_SCHEDULE } from '@/lib/constants';

const MONO = { fontFamily: "Arial, Helvetica, sans-serif" };

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

// "Announced, Not Yet Paid" (and its groupUpcoming helper) moved into
// DividendInteractive.js, 2026-09-16 — Robin wanted it repositioned to sit
// directly under the Monthly Income Per Share chart, which only that
// client component renders.

export default function DividendHistoryPage({ ticker, dividends }) {
  const today = new Date().toISOString().slice(0, 10);
  const isSataComingSoon = ticker === 'SATA' && today < SATA_DAILY_START;
  const isStrcComingSoon = ticker === 'STRC' && today < STRC_SEMI_MONTHLY_START;
  const isBmnpComingSoon = ticker === 'BMNP' && today < BMNP_DIVIDEND_SCHEDULE[BMNP_DIVIDEND_SCHEDULE.length - 1].paymentDate;
  // CHAD has no dedicated schedule constant (unlike BMNP) — its only announced
  // dates live in the dividends prop itself (data/dividends-CHAD.json), so this
  // checks the last entry there directly instead.
  const isChadComingSoon = ticker === 'CHAD' && dividends.length > 0 && today < dividends[dividends.length - 1].date;
  const isComingSoon = isSataComingSoon || isStrcComingSoon || isBmnpComingSoon || isChadComingSoon;
  const isBmnp = ticker === 'BMNP';

  const monthlyDivs = ticker === 'SATA'
    ? dividends.filter(d => !isSataDailyDividend(d))
    : dividends;
  const inDailyEra = ticker === 'SATA' && dividends.some(d => isSataDailyDividend(d));

  // CHAD pays daily from day one — unlike SATA it has no "pre-daily era" of monthly
  // payments to show here, so this flat table stays empty for CHAD and its real
  // payments are grouped into the monthly summary table DividendInteractive.js
  // renders instead (same reasoning as SATA's daily entries: individually listing
  // every business day's payment would make this table hundreds of rows long).
  const allTableData = ticker === 'SATA' ? monthlyDivs : ticker === 'CHAD' ? [] : dividends;
  // The stored record can include dates that haven't happened yet — STRC's
  // live-merged feed sometimes reports the next declared distribution before
  // it pays, and BMNP's schedule is stored months ahead since Bitmine
  // announces it in advance. Robin, 2026-09-16: these must never render in
  // "All Payments" as if already paid.
  const tableData = allTableData.filter(d => d.date <= today);

  return (
    <div>
      <p className="mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
        {ticker === 'SATA'
          ? 'All recorded dividend payments for SATA. Monthly payments through June 15, 2026; daily business-day payments from June 16, 2026 onward.'
          : ticker === 'BMNP' || ticker === 'CHAD'
          ? `All recorded dividend payments for ${ticker}. Verified against the issuer's own SEC filings and stored on this server — building a permanent record that grows over time.`
          : `All recorded dividend payments for ${ticker}. Fetched from Yahoo Finance and stored on this server — building a permanent record that grows over time.`}
      </p>

      {isSataComingSoon && (
        <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.4)' }}>
          <p className="text-xs font-semibold tracking-wide mb-1" style={{ color: 'var(--accent-gold)' }}>UPCOMING: DAILY DIVIDENDS</p>
          <p className="text-sm">
            Starting <strong>June 16, 2026</strong>, SATA will switch from monthly to daily dividend payments — one payment for each NYSE market business day.
            The monthly income total remains the same (~$1.0833/share); it is simply distributed across ~21 business days per month.
          </p>
        </div>
      )}

      {isStrcComingSoon && (
        <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.4)' }}>
          <p className="text-xs font-semibold tracking-wide mb-1" style={{ color: 'var(--accent-gold)' }}>UPCOMING: SEMI-MONTHLY PAYMENTS</p>
          <p className="text-sm">
            Shareholders approved the move to semi-monthly dividends on <strong>June 8, 2026</strong>, but STRC still pays monthly today — the first
            semi-monthly payment is scheduled for <strong>July 15, 2026</strong>. The monthly income total remains the same (~$0.958/share); it will
            simply be split into two payments per month instead of one.
          </p>
        </div>
      )}

      {isBmnpComingSoon && (
        <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.4)' }}>
          <p className="text-xs font-semibold tracking-wide mb-1" style={{ color: 'var(--accent-gold)' }}>UPCOMING: FIRST DIVIDEND PAYMENTS</p>
          <p className="text-sm">
            BMNP began trading on the NYSE on <strong>June 16, 2026</strong>. The first dividend, <strong>$0.316667/share</strong>, covers amounts
            accrued since the June 10 issue date and pays on <strong>June 22, 2026</strong> (record date June 12). A second payment of{' '}
            <strong>$0.105556/share</strong> follows on <strong>June 26, 2026</strong> (record date June 16). Full weekly dividends of
            ~$0.1827/share begin after that.
          </p>
        </div>
      )}

      {isChadComingSoon && (
        <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.4)' }}>
          <p className="text-xs font-semibold tracking-wide mb-1" style={{ color: 'var(--accent-gold)' }}>UPCOMING: FIRST DIVIDEND PAYMENT</p>
          <p className="text-sm">
            CHAD closed its initial offering on <strong>September 8, 2026</strong>. Dividends accrue daily from that date, but the first cash payment
            — <strong>$0.07944/share</strong>, covering the accrual period from September 8 through October 1 — lands on <strong>October 1, 2026</strong>.
            After that, regular daily payments of roughly <strong>$0.0052/share</strong> begin on each business day of the month.
          </p>
        </div>
      )}

      {dividends.length === 0 && !isBmnp && (
        <div className="text-center py-16 text-sm" style={{ color: 'var(--text-muted)' }}>
          No dividend payments recorded yet for {ticker}. Data will appear after the first payment is made.
        </div>
      )}

      {(dividends.length > 0 || isBmnp) && (
        <>
          {/* Interactive section — client-rendered (stats, banners, calculator, chart, SATA daily table) */}
          <DividendInteractive ticker={ticker} />

          {/* Static monthly payments table — server-rendered for SEO */}
          {tableData.length > 0 && (
            <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h2 className="text-lg font-semibold mb-4">
                {inDailyEra ? 'Monthly Payments (Pre-Daily Era)' : 'All Payments'}
              </h2>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-2">
                {[...tableData].reverse().map((d, i, arr) => {
                  const prev   = arr[i + 1];
                  const change = prev != null ? d.amount - prev.amount : null;
                  return (
                    <div key={d.date} className="p-3 rounded-lg" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">{formatDate(d.date)}</p>
                        <p className="text-sm font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>${d.amount.toFixed(4)}/share</p>
                      </div>
                      {change !== null && (
                        <p className="text-xs mt-1" style={{ color: change > 0 ? 'var(--accent-green)' : change < 0 ? '#ef4444' : 'var(--text-muted)' }}>
                          {change > 0 ? '▲' : change < 0 ? '▼' : '—'} {change !== 0 ? `${change > 0 ? '+' : ''}$${change.toFixed(4)}` : 'unchanged'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto -mx-2 px-2">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Date', 'Per Share', 'Change'].map(h => (
                        <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...tableData].reverse().map((d, i, arr) => {
                      const prev   = arr[i + 1];
                      const change = prev != null ? d.amount - prev.amount : null;
                      return (
                        <tr key={d.date} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td className="py-2 px-3">{formatDate(d.date)}</td>
                          <td className="py-2 px-3" style={{ ...MONO, color: 'var(--accent-gold)' }}>${d.amount.toFixed(4)}</td>
                          <td className="py-2 px-3" style={{ ...MONO, color: change === null ? 'var(--text-muted)' : change > 0 ? 'var(--accent-green)' : change < 0 ? '#ef4444' : 'var(--text-muted)' }}>
                            {change === null ? '—' : change === 0 ? 'unchanged' : `${change > 0 ? '+' : ''}$${change.toFixed(4)}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <p className="text-xs text-center pb-4" style={{ color: 'var(--text-muted)' }}>
            {ticker === 'BMNP' || ticker === 'CHAD'
              ? "Dividend data sourced from the issuer's own SEC filings and stored on this server."
              : 'Dividend data sourced from Yahoo Finance and stored on this server.'}
            {!inDailyEra && ' Predictions are estimates based on historical payment intervals and recent amount trends — not guaranteed.'}
            {inDailyEra && ' Daily payment amounts calculated from the Strive-published formula: $100 × annual rate ÷ 12 ÷ business days in month.'}
          </p>
        </>
      )}

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
