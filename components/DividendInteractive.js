'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { loadProjectorState } from '@/lib/projectorState';
import { ASSET_RATES } from '@/lib/constants';
import { SATA_DAILY_START, getBusinessDaysInMonth, getSataDailyDividend, getSataMonthlyTotal } from '@/lib/sataBusinessDays';

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

function ymToLabel(ym) {
  const [y, m] = ym.split('-');
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${names[parseInt(m, 10) - 1]} '${y.slice(2)}`;
}

function groupByMonth(divs) {
  const groups = {};
  divs.forEach(d => {
    const ym = d.date.slice(0, 7);
    if (!groups[ym]) groups[ym] = [];
    groups[ym].push(d);
  });
  return groups;
}

function predictNextDividend(dividends, confirmedDate = null) {
  if (dividends.length < 2) return null;
  const lastDate = dividends[dividends.length - 1].date;
  let nextDate = (confirmedDate && confirmedDate > lastDate) ? confirmedDate : null;
  if (!nextDate) {
    const recent = dividends.slice(-4);
    let totalGap = 0;
    for (let i = 1; i < recent.length; i++)
      totalGap += (new Date(recent[i].date) - new Date(recent[i - 1].date)) / 86400000;
    const avgGap = Math.round(totalGap / (recent.length - 1));
    const last = new Date(dividends[dividends.length - 1].date + 'T00:00:00Z');
    nextDate = new Date(last.getTime() + avgGap * 86400000).toISOString().split('T')[0];
  }
  const window = dividends.slice(-4);
  const changes = [];
  for (let i = 1; i < window.length; i++) changes.push(window[i].amount - window[i - 1].amount);
  const avgChange = changes.reduce((s, c) => s + c, 0) / changes.length;
  const nextAmount = parseFloat(Math.max(0, dividends[dividends.length - 1].amount + avgChange).toFixed(4));
  return { date: nextDate, amount: nextAmount, dateConfirmed: !!confirmedDate };
}

function SataMonthlyProgress({ byMonth, todayYM }) {
  const displayMonths = [];
  let [y, m] = [2026, 6];
  const [endY, endM] = todayYM.split('-').map(Number);
  while (y < endY || (y === endY && m <= endM)) {
    displayMonths.push(`${y}-${String(m).padStart(2, '0')}`);
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return (
    <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <h2 className="text-lg font-semibold mb-1">Monthly Payment Progress</h2>
      <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
        Each box represents one calendar month. Gold fill indicates the proportion of expected NYSE business-day payments received.
      </p>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
        {displayMonths.map(ym => {
          const paid    = byMonth[ym]?.length ?? 0;
          const total   = getBusinessDaysInMonth(ym) ?? 21;
          const fillPct = total > 0 ? Math.min(paid / total, 1) : 0;
          const isCurrentMonth = ym === todayYM;
          const isComplete = fillPct >= 1;
          return (
            <div key={ym} className="flex flex-col items-center gap-1">
              <div title={`${paid} of ${total} payments made`}
                style={{ position: 'relative', width: '100%', height: 52,
                  border: `2px solid ${isCurrentMonth ? '#f5a623' : 'rgba(200,137,58,0.5)'}`,
                  borderRadius: 6, overflow: 'hidden', background: '#111827' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: `${fillPct * 100}%`,
                  background: isComplete ? '#f5a623' : 'rgba(245,166,35,0.6)',
                  transition: 'height 0.4s ease' }} />
              </div>
              <span style={{ fontSize: 10, color: isCurrentMonth ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {ymToLabel(ym)}
              </span>
              <span style={{ fontSize: 10, ...MONO, color: paid > 0 ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                {paid}/{total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DividendInteractive({ ticker }) {
  const chartRef      = useRef(null);
  const chartInstance = useRef(null);
  const [dividends, setDividends]             = useState(null);
  const [nextPaymentDate, setNextPaymentDate] = useState(null);
  const [fetchError, setFetchError]           = useState(false);
  const [shares, setShares]                   = useState('');
  const [chartRange, setChartRange]           = useState('12M');

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

  const today   = new Date().toISOString().split('T')[0];
  const todayYM = today.slice(0, 7);

  const { monthlyDivs, dailyDivs } = useMemo(() => {
    if (!dividends) return { monthlyDivs: [], dailyDivs: [] };
    if (ticker !== 'SATA') return { monthlyDivs: dividends, dailyDivs: [] };
    return {
      monthlyDivs: dividends.filter(d => d.date < SATA_DAILY_START),
      dailyDivs:   dividends.filter(d => d.date >= SATA_DAILY_START),
    };
  }, [dividends, ticker]);

  const dailyByMonth = useMemo(() => groupByMonth(dailyDivs), [dailyDivs]);
  const inDailyEra   = ticker === 'SATA' && dailyDivs.length > 0;

  const sataDailyStats = useMemo(() => {
    if (!dailyDivs.length) return null;
    const annualRate = ASSET_RATES.SATA;
    const latest = dailyDivs[dailyDivs.length - 1];
    const currentMonthPaid = (dailyByMonth[todayYM] ?? []).reduce((s, d) => s + d.amount, 0);
    const expectedMonthlyTotal = getSataMonthlyTotal(annualRate);
    return { latest, currentMonthPaid, expectedMonthlyTotal };
  }, [dailyDivs, dailyByMonth, todayYM]);

  const latestMonthly = monthlyDivs.length > 0 ? monthlyDivs[monthlyDivs.length - 1] : null;
  const avgMonthly    = monthlyDivs.length > 0 ? monthlyDivs.reduce((s, d) => s + d.amount, 0) / monthlyDivs.length : 0;
  const impliedAnnual = avgMonthly * 12;

  const prediction = useMemo(
    () => inDailyEra ? null : (monthlyDivs.length >= 2 ? predictNextDividend(monthlyDivs, nextPaymentDate) : null),
    [inDailyEra, monthlyDivs, nextPaymentDate],
  );

  const predictionOverdue = prediction && prediction.date < today;
  const sharesNum         = parseFloat(shares) || 0;
  const incomePerPayment  = sharesNum * (latestMonthly?.amount ?? 0);
  const incomeAnnual      = sharesNum * impliedAnnual;

  useEffect(() => {
    if (!dividends?.length) return;
    let destroyed = false;
    async function draw() {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      if (destroyed) return;
      const ctx = chartRef.current?.getContext('2d');
      if (!ctx) return;
      if (chartInstance.current) chartInstance.current.destroy();

      if (ticker === 'SATA' && dailyDivs.length > 0) {
        const allByMonth = {};
        dividends.forEach(d => {
          const ym = d.date.slice(0, 7);
          allByMonth[ym] = (allByMonth[ym] ?? 0) + d.amount;
        });
        const rangeLimit = chartRange === '12M' ? 12 : chartRange === '24M' ? 24 : Infinity;
        const allMonths  = Object.keys(allByMonth).sort();
        const months     = rangeLimit === Infinity ? allMonths : allMonths.slice(-rangeLimit);
        const totals     = months.map(ym => allByMonth[ym]);
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: { labels: months.map(ymToLabel), datasets: [{
            label: 'Monthly income / share ($)', data: totals,
            backgroundColor: months.map(ym => ym < '2026-06' ? 'rgba(200,137,58,0.5)' : 'rgba(200,137,58,0.75)'),
            borderColor: '#c8893a', borderWidth: 1, borderRadius: 3,
          }] },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: c => {
                const ym = months[c.dataIndex];
                const amount = `$${Number(c.raw).toFixed(4)}/share`;
                if (ym < '2026-06') return amount;
                const paid = dailyByMonth[ym]?.length ?? 0;
                const total = getBusinessDaysInMonth(ym) ?? '?';
                return `${amount} (${paid}/${total} days)`;
              }}},
            },
            scales: {
              x: { ticks: { color: '#6b7280', maxTicksLimit: 12, font: { size: 10 } }, grid: { color: '#1f2937' } },
              y: { ticks: { color: '#6b7280', callback: v => `$${Number(v).toFixed(2)}` }, grid: { color: '#1f2937' } },
            },
          },
        });
      } else {
        const sourceDivs = ticker === 'SATA' ? monthlyDivs : dividends;
        if (!sourceDivs.length) return;
        const rangeLimit  = chartRange === '12M' ? 12 : chartRange === '24M' ? 24 : Infinity;
        const targetDivs  = rangeLimit === Infinity ? sourceDivs : sourceDivs.slice(-rangeLimit);
        const pred        = sourceDivs.length >= 2 ? predictNextDividend(sourceDivs) : null;
        const allLabels   = targetDivs.map(d => formatChartDate(d.date));
        const allAmounts  = targetDivs.map(d => d.amount);
        const allBg       = targetDivs.map(() => 'rgba(200,137,58,0.75)');
        const allBorder   = targetDivs.map(() => '#c8893a');
        const allBW       = targetDivs.map(() => 1);
        if (pred) {
          allLabels.push(formatChartDate(pred.date) + ' *');
          allAmounts.push(pred.amount);
          allBg.push('rgba(200,137,58,0.15)');
          allBorder.push('#c8893a');
          allBW.push(2);
        }
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: { labels: allLabels, datasets: [{ label: 'Per Share ($)', data: allAmounts,
            backgroundColor: allBg, borderColor: allBorder, borderWidth: allBW, borderRadius: 3 }] },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: c => {
                const isEst = pred && c.dataIndex === allLabels.length - 1 && allLabels.at(-1)?.endsWith(' *');
                return isEst ? `Estimated: $${Number(c.raw).toFixed(4)}/share` : `Per share: $${Number(c.raw).toFixed(4)}`;
              }}},
            },
            scales: {
              x: { ticks: { color: '#6b7280', maxTicksLimit: 12, font: { size: 10 } }, grid: { color: '#1f2937' } },
              y: { ticks: { color: '#6b7280', callback: v => `$${Number(v).toFixed(2)}` }, grid: { color: '#1f2937' } },
            },
          },
        });
      }
    }
    draw();
    return () => { destroyed = true; };
  }, [dividends, ticker, dailyDivs, monthlyDivs, chartRange]);

  if (fetchError) return (
    <div className="p-4 rounded-lg mb-6 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444' }}>
      Could not load dividend data. Please try refreshing the page.
    </div>
  );

  if (!dividends) return (
    <div className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>Loading latest data…</div>
  );

  if (dividends.length === 0) return null;

  return (
    <>
      {/* Stats */}
      {inDailyEra ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Daily Payments on Record', value: String(dailyDivs.length) },
            { label: 'Latest Daily Amount',      value: `$${sataDailyStats.latest.amount.toFixed(6)}`,     gold: true },
            { label: 'This Month Received',      value: `$${sataDailyStats.currentMonthPaid.toFixed(4)}`,  gold: true },
            { label: 'Expected Monthly Total',   value: `$${sataDailyStats.expectedMonthlyTotal.toFixed(4)}`, gold: true },
          ].map(stat => (
            <div key={stat.label} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              <p className="text-xl font-medium" style={{ ...MONO, color: stat.gold ? 'var(--accent-gold)' : 'var(--text-primary)' }}>{stat.value}</p>
            </div>
          ))}
        </div>
      ) : monthlyDivs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Payments on Record', value: String(monthlyDivs.length) },
            { label: 'Latest Per Share',   value: `$${latestMonthly.amount.toFixed(4)}`, gold: true },
            { label: 'Avg Per Payment',    value: `$${avgMonthly.toFixed(4)}`,            gold: true },
            { label: 'Est. Annual Rate',   value: `${impliedAnnual.toFixed(2)}%`,         gold: true },
          ].map(stat => (
            <div key={stat.label} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              <p className="text-xl font-medium" style={{ ...MONO, color: stat.gold ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                {typeof stat.value === 'string' && stat.value.endsWith('%')
                  ? <>{stat.value.slice(0, -1)}<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8em' }}>%</span></>
                  : stat.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {/* SATA daily era banner */}
      {inDailyEra && (
        <div className="p-4 rounded-xl mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8"
          style={{ background: 'rgba(200,137,58,0.08)', border: '1px solid var(--accent-gold)' }}>
          <div>
            <p className="text-xs font-semibold tracking-wide mb-0.5" style={{ color: 'var(--accent-gold)' }}>DAILY DIVIDEND PAYMENTS ACTIVE</p>
            <p className="text-sm font-medium">Every NYSE business day</p>
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Daily amount (this month)</p>
            <p className="text-lg font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>
              ${getSataDailyDividend(ASSET_RATES.SATA, todayYM)?.toFixed(6) ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Expected this month</p>
            <p className="text-lg font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>
              ${getSataMonthlyTotal(ASSET_RATES.SATA).toFixed(4)}
            </p>
          </div>
          <p className="text-xs sm:ml-auto" style={{ color: 'var(--text-muted)' }}>
            From {formatDate(SATA_DAILY_START)} · {getBusinessDaysInMonth(todayYM)} business days this month
          </p>
        </div>
      )}

      {/* Monthly prediction banner */}
      {!inDailyEra && prediction && (
        <div className="p-4 rounded-xl mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8"
          style={{ background: 'rgba(200,137,58,0.08)', border: `1px solid ${predictionOverdue ? '#f59e0b' : 'var(--accent-gold)'}` }}>
          <div>
            <p className="text-xs font-semibold tracking-wide mb-0.5" style={{ color: predictionOverdue ? '#f59e0b' : 'var(--accent-gold)' }}>
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
            {prediction.dateConfirmed ? 'Date confirmed by Yahoo Finance · ' : ''}Amount estimated from {monthlyDivs.length} payment{monthlyDivs.length !== 1 ? 's' : ''} on record
          </p>
        </div>
      )}

      {/* Income calculator */}
      <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-lg font-semibold mb-3">Income Calculator</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Number of shares</label>
            <input type="text" inputMode="decimal" value={shares}
              onChange={e => setShares(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="e.g. 100" className="w-28 px-3 py-2 rounded-lg text-sm text-center"
              style={{ ...MONO, background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          {sharesNum > 0 && (
            <div className="flex flex-wrap gap-6">
              {inDailyEra ? (
                <>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Per business day</p>
                    <p className="text-lg font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>
                      {fmtMoney(sharesNum * (getSataDailyDividend(ASSET_RATES.SATA, todayYM) ?? 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Expected monthly</p>
                    <p className="text-lg font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>
                      {fmtMoney(sharesNum * getSataMonthlyTotal(ASSET_RATES.SATA))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Annual income</p>
                    <p className="text-lg font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>
                      {fmtMoney(sharesNum * ASSET_RATES.SATA)}
                    </p>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fill boxes — SATA daily era only */}
      {inDailyEra && <SataMonthlyProgress byMonth={dailyByMonth} todayYM={todayYM} />}

      {/* Chart */}
      <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{inDailyEra ? 'Monthly Income Per Share' : 'Payment History'}</h2>
          <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border)', fontSize: '11px' }}>
            {['12M', '24M', 'All'].map(r => (
              <button key={r} type="button" onClick={() => setChartRange(r)} className="px-3 py-1 font-medium"
                style={{ background: chartRange === r ? 'var(--accent-gold)' : 'var(--bg-card-hover)',
                  color: chartRange === r ? '#000' : 'var(--text-muted)' }}>{r}</button>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', height: '240px' }} className="md:h-72">
          <canvas ref={chartRef} aria-label="Dividend payment history chart" role="img" />
        </div>
        {!inDailyEra && prediction && (
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

      {/* SATA daily era: monthly summary payments table */}
      {inDailyEra && (
        <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4">All Payments</h2>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--accent-gold)' }}>Daily Dividend Period (from June 16, 2026)</h3>

          <div className="sm:hidden space-y-2 mb-6">
            {Object.keys(dailyByMonth).sort().reverse().map(ym => {
              const paid = dailyByMonth[ym].length;
              const total = getBusinessDaysInMonth(ym) ?? '?';
              const monthTotal = dailyByMonth[ym].reduce((s, d) => s + d.amount, 0);
              return (
                <div key={ym} className="p-3 rounded-lg" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{ymToLabel(ym)}</p>
                    <p className="text-sm font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>${monthTotal.toFixed(4)}/share</p>
                  </div>
                  <div className="flex gap-4 mt-1">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{paid} of {total} payments</p>
                    {sharesNum > 0 && (
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Income: <span style={{ color: 'var(--text-primary)' }}>{fmtMoney(sharesNum * monthTotal)}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden sm:block overflow-x-auto -mx-2 px-2 mb-6">
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Month', 'Payments Made', 'Monthly Total', ...(sharesNum > 0 ? ['Your Income'] : [])].map(h => (
                    <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(dailyByMonth).sort().reverse().map(ym => {
                  const paid = dailyByMonth[ym].length;
                  const total = getBusinessDaysInMonth(ym) ?? '?';
                  const monthTotal = dailyByMonth[ym].reduce((s, d) => s + d.amount, 0);
                  return (
                    <tr key={ym} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-2 px-3">{ymToLabel(ym)}</td>
                      <td className="py-2 px-3" style={{ ...MONO, color: paid >= total ? 'var(--accent-green)' : 'var(--text-muted)' }}>{paid} / {total}</td>
                      <td className="py-2 px-3" style={{ ...MONO, color: 'var(--accent-gold)' }}>${monthTotal.toFixed(4)}</td>
                      {sharesNum > 0 && <td className="py-2 px-3" style={MONO}>{fmtMoney(sharesNum * monthTotal)}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {monthlyDivs.length > 0 && (
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>Monthly History (pre June 16, 2026)</h3>
          )}
        </div>
      )}
    </>
  );
}
