import SubNav from '@/components/SubNav';
import GoogleAd from '@/components/GoogleAd';
import DividendInteractive from '@/components/DividendInteractive';

const MONO = { fontFamily: "'Roboto Mono', 'Courier New', monospace" };

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

export default function DividendHistoryPage({ ticker, dividends }) {
  const latest = dividends.length > 0 ? dividends[dividends.length - 1] : null;
  const avg    = dividends.length > 0 ? dividends.reduce((s, d) => s + d.amount, 0) / dividends.length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SubNav ticker={ticker} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{ticker} Dividend History</h1>
      <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
        All recorded dividend payments for {ticker}. Fetched from Yahoo Finance and stored on this server — building a permanent record that grows over time.
      </p>

      {dividends.length === 0 && (
        <div className="text-center py-16 text-sm" style={{ color: 'var(--text-muted)' }}>
          No dividend payments recorded yet for {ticker}. Data will appear after the first payment is made.
        </div>
      )}

      {dividends.length > 0 && (
        <>
          {/* Stats — server-rendered */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Payments on Record', value: String(dividends.length) },
              { label: 'Latest Per Share',   value: `$${latest.amount.toFixed(4)}`, gold: true },
              { label: 'Avg Per Payment',    value: `$${avg.toFixed(4)}`,            gold: true },
              { label: 'Est. Annual Rate',   value: `${(avg * 12).toFixed(2)}%`,     gold: true },
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                <p className="text-xl font-medium" style={{ ...MONO, color: stat.gold ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Prediction banner + income calculator + chart — client-rendered */}
          <DividendInteractive ticker={ticker} />

          {/* Dividend table — server-rendered for SEO */}
          <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-lg font-semibold mb-4">All Payments</h2>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-2">
              {[...dividends].reverse().map((d, i, arr) => {
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
                  {[...dividends].reverse().map((d, i, arr) => {
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

          <p className="text-xs text-center pb-4" style={{ color: 'var(--text-muted)' }}>
            Dividend data sourced from Yahoo Finance and stored on this server. Predictions are estimates based on historical payment intervals and recent amount trends — not guaranteed.
          </p>
        </>
      )}

      <GoogleAd slot={`${ticker.toLowerCase()}-dividends`} />

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
