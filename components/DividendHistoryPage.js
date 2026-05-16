'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import SubNav from '@/components/SubNav';
import GoogleAd from '@/components/GoogleAd';
import { loadProjectorState } from '@/lib/projectorState';

const MONO = { fontFamily: "'Roboto Mono', 'Courier New', monospace" };
const fmtMoney = v => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

function formatChartDate(dateStr) {
  const [y, m] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1]} '${y.slice(2)}`;
}

function predictNextDividend(dividends, confirmedDate = null) {
  if (dividends.length < 2) return null;

  const lastDate = dividends[dividends.length - 1].date;

  // Only use Yahoo's confirmed date if it's genuinely in the future relative to our history
  let nextDate = (confirmedDate && confirmedDate > lastDate) ? confirmedDate : null;
  if (!nextDate) {
    const recent = dividends.slice(-4);
    let totalGap = 0;
    for (let i = 1; i < recent.length; i++) {
      totalGap += (new Date(recent[i].date) - new Date(recent[i - 1].date)) / 86400000;
    }
    const avgGap = Math.round(totalGap / (recent.length - 1));
    const lastDate = new Date(dividends[dividends.length - 1].date + 'T00:00:00Z');
    nextDate = new Date(lastDate.getTime() + avgGap * 86400000).toISOString().split('T')[0];
  }

  // Amount — linear trend of last 3 changes (always estimated)
  const window = dividends.slice(-4);
  const changes = [];
  for (let i = 1; i < window.length; i++) changes.push(window[i].amount - window[i - 1].amount);
  const avgChange = changes.reduce((s, c) => s + c, 0) / changes.length;
  const nextAmount = parseFloat(Math.max(0, dividends[dividends.length - 1].amount + avgChange).toFixed(4));

  return { date: nextDate, amount: nextAmount, dateConfirmed: !!confirmedDate };
}

export default function DividendHistoryPage({ ticker }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [dividends, setDividends] = useState(null);
  const [nextPaymentDate, setNextPaymentDate] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [shares, setShares] = useState('');

  useEffect(() => {
    const saved = loadProjectorState(ticker);
    if (saved) {
      let derived = '';
      if (saved.inputMode === 'shares' && Number(saved.numShares) > 0) {
        derived = String(saved.numShares);
      } else if (Number(saved.investmentAmount) > 0 && Number(saved.pricePerShare) > 0) {
        const count = Math.round(Number(saved.investmentAmount) / Number(saved.pricePerShare));
        if (count > 0) derived = String(count);
      }
      if (derived) setShares(derived);
    }
  }, [ticker]);

  useEffect(() => {
    fetch(`/api/dividends/${ticker}`)
      .then(r => r.json())
      .then(({ history, nextPaymentDate: npd }) => {
        setDividends(history);
        setNextPaymentDate(npd);
      })
      .catch(() => setFetchError(true));
  }, [ticker]);

  const latest = dividends?.length > 0 ? dividends[dividends.length - 1] : null;
  const avg = dividends?.length > 0
    ? dividends.reduce((s, d) => s + d.amount, 0) / dividends.length
    : 0;
  const impliedAnnual = avg * 12;
  const prediction = useMemo(
    () => dividends?.length >= 2 ? predictNextDividend(dividends, nextPaymentDate) : null,
    [dividends, nextPaymentDate]
  );

  const today = new Date().toISOString().split('T')[0];
  const predictionOverdue = prediction && prediction.date < today;

  const sharesNum = parseFloat(shares) || 0;
  const incomePerPayment = sharesNum * (latest?.amount ?? 0);
  const incomeAnnual = sharesNum * impliedAnnual;

  useEffect(() => {
    if (!dividends?.length) return;

    // Compute prediction locally so the dep array stays a fixed size
    const pred = dividends.length >= 2 ? predictNextDividend(dividends) : null;
    let destroyed = false;

    async function draw() {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      if (destroyed) return;
      const ctx = chartRef.current?.getContext('2d');
      if (!ctx) return;
      if (chartInstance.current) chartInstance.current.destroy();

      const allLabels = dividends.map(d => formatChartDate(d.date));
      const allAmounts = dividends.map(d => d.amount);
      const allBg = dividends.map(() => 'rgba(200,137,58,0.75)');
      const allBorder = dividends.map(() => '#c8893a');
      const allBorderWidth = dividends.map(() => 1);

      if (pred) {
        allLabels.push(formatChartDate(pred.date) + ' *');
        allAmounts.push(pred.amount);
        allBg.push('rgba(200,137,58,0.15)');
        allBorder.push('#c8893a');
        allBorderWidth.push(2);
      }

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: allLabels,
          datasets: [{
            label: 'Per Share ($)',
            data: allAmounts,
            backgroundColor: allBg,
            borderColor: allBorder,
            borderWidth: allBorderWidth,
            borderRadius: 3,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: c => {
                  const isEst = pred && c.dataIndex === dividends.length;
                  return isEst
                    ? `Estimated: $${Number(c.raw).toFixed(4)}/share`
                    : `Per share: $${Number(c.raw).toFixed(4)}`;
                },
              },
            },
          },
          scales: {
            x: { ticks: { color: '#6b7280', maxTicksLimit: 12, font: { size: 10 } }, grid: { color: '#1f2937' } },
            y: { ticks: { color: '#6b7280', callback: v => `$${Number(v).toFixed(2)}` }, grid: { color: '#1f2937' } },
          },
        },
      });
    }
    draw();
    return () => { destroyed = true; };
  }, [dividends]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SubNav ticker={ticker} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{ticker} Dividend History</h1>
      <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
        All recorded dividend payments for {ticker}. Fetched from Yahoo Finance and stored on this server — building a permanent record that grows over time.
      </p>

      {fetchError && (
        <div className="p-4 rounded-lg mb-6 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444' }}>
          Could not load dividend data. Please try refreshing the page.
        </div>
      )}

      {dividends === null && !fetchError && (
        <div className="text-center py-16 text-sm" style={{ color: 'var(--text-muted)' }}>Loading dividend history…</div>
      )}

      {dividends?.length === 0 && (
        <div className="text-center py-16 text-sm" style={{ color: 'var(--text-muted)' }}>
          No dividend payments recorded yet for {ticker}. Data will appear after the first payment is made.
        </div>
      )}

      {dividends?.length > 0 && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Payments on Record', value: String(dividends.length) },
              { label: 'Latest Per Share', value: `$${latest.amount.toFixed(4)}`, gold: true },
              { label: 'Avg Per Payment', value: `$${avg.toFixed(4)}`, gold: true },
              { label: 'Est. Annual Rate', value: `${impliedAnnual.toFixed(2)}%`, gold: true },
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                <p className="text-xl font-medium" style={{ ...MONO, color: stat.gold ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Next expected payment banner */}
          {prediction && (
            <div className="p-4 rounded-xl mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8"
              style={{ background: 'rgba(200,137,58,0.08)', border: `1px solid ${predictionOverdue ? '#f59e0b' : 'var(--accent-gold)'}` }}>
              <div>
                <p className="text-xs font-semibold tracking-wide mb-0.5"
                  style={{ color: predictionOverdue ? '#f59e0b' : 'var(--accent-gold)' }}>
                  {predictionOverdue ? 'PAYMENT DUE / OVERDUE' : prediction.dateConfirmed ? 'NEXT PAYMENT DATE' : 'NEXT EXPECTED PAYMENT'}
                </p>
                <p className="text-sm font-medium">{formatDate(prediction.date)}</p>
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Predicted per share</p>
                <p className="text-lg font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>${prediction.amount.toFixed(4)}</p>
              </div>
              {sharesNum > 0 && (
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Your predicted income</p>
                  <p className="text-lg font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>{fmtMoney(sharesNum * prediction.amount)}</p>
                </div>
              )}
              <p className="text-xs sm:ml-auto" style={{ color: 'var(--text-muted)' }}>
                {prediction.dateConfirmed ? 'Date confirmed by Yahoo Finance · ' : ''}Amount estimated from {dividends.length} payment{dividends.length !== 1 ? 's' : ''} on record
              </p>
            </div>
          )}

          {/* Income calculator */}
          <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-lg font-semibold mb-3">Income Calculator</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Number of shares</label>
                <input
                  type="text" inputMode="decimal"
                  value={shares}
                  onChange={e => setShares(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="e.g. 100"
                  className="w-28 px-3 py-2 rounded-lg text-sm text-center"
                  style={{ ...MONO, background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
              {sharesNum > 0 && (
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Last payment</p>
                    <p className="text-lg font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>{fmtMoney(incomePerPayment)}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Est. annual</p>
                    <p className="text-lg font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>{fmtMoney(incomeAnnual)}</p>
                  </div>
                  {prediction && (
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Next payment (est.)</p>
                      <p className="text-lg font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>{fmtMoney(sharesNum * prediction.amount)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-lg font-semibold mb-4">Payment History</h2>
            <div style={{ position: 'relative', height: '240px' }} className="md:h-72">
              <canvas ref={chartRef} aria-label="Dividend payment history chart" role="img" />
            </div>
            {prediction && (
              <div className="flex justify-center gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-sm" style={{ background: 'rgba(200,137,58,0.75)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Paid</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-sm" style={{ background: 'rgba(200,137,58,0.15)', border: '2px solid #c8893a' }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Estimated next (*)</span>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-lg font-semibold mb-4">All Payments</h2>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-2">
              {prediction && (
                <div className="p-3 rounded-lg" style={{ background: 'rgba(200,137,58,0.06)', border: '1px dashed var(--accent-gold)' }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-semibold mr-2" style={{ color: 'var(--accent-gold)' }}>ESTIMATED</span>
                      <span className="text-sm font-medium">{formatDate(prediction.date)}</span>
                    </div>
                    <p className="text-sm font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>${prediction.amount.toFixed(4)}/share</p>
                  </div>
                  {sharesNum > 0 && (
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      Income: <span style={{ color: 'var(--text-primary)' }}>{fmtMoney(sharesNum * prediction.amount)}</span>
                    </p>
                  )}
                </div>
              )}
              {[...dividends].reverse().map((d, i, arr) => {
                const prev = arr[i + 1];
                const change = prev != null ? d.amount - prev.amount : null;
                return (
                  <div key={d.date} className="p-3 rounded-lg" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">{formatDate(d.date)}</p>
                      <p className="text-sm font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>${d.amount.toFixed(4)}/share</p>
                    </div>
                    <div className="flex gap-4 mt-1">
                      {change !== null && (
                        <p className="text-xs" style={{ color: change > 0 ? 'var(--accent-green)' : change < 0 ? '#ef4444' : 'var(--text-muted)' }}>
                          {change > 0 ? '▲' : change < 0 ? '▼' : '—'} {change !== 0 ? `${change > 0 ? '+' : ''}$${change.toFixed(4)}` : 'unchanged'}
                        </p>
                      )}
                      {sharesNum > 0 && (
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          Income: <span style={{ color: 'var(--text-primary)' }}>{fmtMoney(sharesNum * d.amount)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto -mx-2 px-2">
              <table className="min-w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Date', 'Per Share', 'Change', ...(sharesNum > 0 ? ['Your Income'] : [])].map(h => (
                      <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prediction && (
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(200,137,58,0.06)' }}>
                      <td className="py-2 px-3">
                        <span className="text-xs font-semibold mr-2" style={{ color: 'var(--accent-gold)' }}>EST.</span>
                        {formatDate(prediction.date)}
                      </td>
                      <td className="py-2 px-3" style={{ ...MONO, color: 'var(--accent-gold)' }}>${prediction.amount.toFixed(4)}</td>
                      <td className="py-2 px-3" style={{ color: 'var(--text-muted)' }}>—</td>
                      {sharesNum > 0 && (
                        <td className="py-2 px-3" style={MONO}>{fmtMoney(sharesNum * prediction.amount)}</td>
                      )}
                    </tr>
                  )}
                  {[...dividends].reverse().map((d, i, arr) => {
                    const prev = arr[i + 1];
                    const change = prev != null ? d.amount - prev.amount : null;
                    return (
                      <tr key={d.date} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="py-2 px-3">{formatDate(d.date)}</td>
                        <td className="py-2 px-3" style={{ ...MONO, color: 'var(--accent-gold)' }}>${d.amount.toFixed(4)}</td>
                        <td className="py-2 px-3" style={{ ...MONO, color: change === null ? 'var(--text-muted)' : change > 0 ? 'var(--accent-green)' : change < 0 ? '#ef4444' : 'var(--text-muted)' }}>
                          {change === null ? '—' : change === 0 ? 'unchanged' : `${change > 0 ? '+' : ''}$${change.toFixed(4)}`}
                        </td>
                        {sharesNum > 0 && (
                          <td className="py-2 px-3" style={MONO}>{fmtMoney(sharesNum * d.amount)}</td>
                        )}
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
    </div>
  );
}
