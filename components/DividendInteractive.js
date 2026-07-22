'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { loadProjectorState } from '@/lib/projectorState';
import { ASSET_RATES, PAYMENT_FREQUENCY, STRC_SEMI_MONTHLY_START } from '@/lib/constants';
import { SATA_DAILY_START, getBusinessDaysInMonth, getSataDailyDividend, getSataExpectedPeriodAmount, getSataMonthProgress, getSataDailyPaymentsToDate, isSataDailyDividend } from '@/lib/sataBusinessDays';
import { getBmnpExpectedMonthlyTotal } from '@/lib/bmnpSchedule';

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

// Yahoo's `quote.dividendDate` field (surfaced here as apiNextPaymentDate) has been
// observed returning implausible far-future dates for these newly-listed,
// non-standard-cadence securities — e.g. it reported STRC's next payment as
// 2 months out and BMNP's as 9 weekly-periods out. Rather than trust it blindly,
// sanity-check it against the ticker's own declared payment frequency, and for
// STRC prefer the company-confirmed semi-monthly transition date we already hold
// (STRC_SEMI_MONTHLY_START) over Yahoo entirely while that transition is pending.
function getTrustedConfirmedDate(ticker, apiNextPaymentDate, lastDate, today) {
  if (ticker === 'STRC' && today < STRC_SEMI_MONTHLY_START && lastDate < STRC_SEMI_MONTHLY_START) {
    return { date: STRC_SEMI_MONTHLY_START, source: 'schedule' };
  }
  if (!apiNextPaymentDate || apiNextPaymentDate <= lastDate) return { date: null, source: null };
  const freq = PAYMENT_FREQUENCY[ticker];
  if (freq) {
    const expectedGapDays = 365 / freq.perYear;
    const actualGapDays = (new Date(apiNextPaymentDate) - new Date(lastDate)) / 86400000;
    if (actualGapDays > expectedGapDays * 2.5) return { date: null, source: null };
  }
  return { date: apiNextPaymentDate, source: 'yahoo' };
}

// Our dividend history is keyed by record date (confirmed against Strategy's own
// published table), but Yahoo's `dividendDate` field reports a payout date instead —
// and has been seen landing a full extra period out (e.g. 31 days from STRC's last
// record when the true next record is 15-16 days out), which the sanity check above
// doesn't catch since it's still within its multiplier. Where the record-date cadence
// is exactly known, compute it directly instead of trusting either Yahoo or a trailing
// average (which gets skewed for a few periods right after a cadence change).
function nextKnownRecordDate(ticker, lastDateStr) {
  const last = new Date(lastDateStr + 'T00:00:00Z');
  if (ticker === 'STRC' && lastDateStr >= STRC_SEMI_MONTHLY_START) {
    // Semi-monthly record dates alternate between the 15th and the last calendar day of the month.
    if (last.getUTCDate() === 15) {
      const lastDayOfMonth = new Date(Date.UTC(last.getUTCFullYear(), last.getUTCMonth() + 1, 0)).getUTCDate();
      return new Date(Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), lastDayOfMonth)).toISOString().split('T')[0];
    }
    return new Date(Date.UTC(last.getUTCFullYear(), last.getUTCMonth() + 1, 15)).toISOString().split('T')[0];
  }
  if (ticker === 'BMNP') {
    return new Date(last.getTime() + 7 * 86400000).toISOString().split('T')[0];
  }
  return null;
}

function predictNextDividend(dividends, confirmedDate = null, confirmedSource = null, fixedAmount = null) {
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
  // Prefer the known per-payment amount (par x published rate / payments per year) over a
  // trend guess — the trend method reads a payment-frequency change (e.g. STRC's move to
  // semi-monthly) as a steep decline, when the rate and per-share economics haven't moved at all.
  let nextAmount;
  if (fixedAmount != null) {
    nextAmount = fixedAmount;
  } else {
    const window = dividends.slice(-4);
    const changes = [];
    for (let i = 1; i < window.length; i++) changes.push(window[i].amount - window[i - 1].amount);
    const avgChange = changes.reduce((s, c) => s + c, 0) / changes.length;
    nextAmount = parseFloat(Math.max(0, dividends[dividends.length - 1].amount + avgChange).toFixed(4));
  }
  return { date: nextDate, amount: nextAmount, dateConfirmed: !!confirmedDate, dateSource: confirmedDate ? confirmedSource : null };
}

function SataMonthlyProgress({ monthlyByMonth, todayYM, today, annualRate }) {
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
        Each box represents one calendar month. Gold fill indicates the proportion of expected income received so far.
      </p>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
        {displayMonths.map(ym => {
          const monthlyPaid = (monthlyByMonth[ym] ?? []).reduce((s, d) => s + d.amount, 0);
          // Count business days elapsed (= payments made), not lagging Yahoo events.
          const dailyCount = getSataDailyPaymentsToDate(ym, today);
          const dailyTotal = getBusinessDaysInMonth(ym) ?? 21;
          const dailyPaid  = dailyCount * (getSataDailyDividend(annualRate, ym) ?? 0);
          const { paid, expected, fillPct } = getSataMonthProgress({ monthlyPaid, dailyPaid, annualRate, yearMonth: ym });
          const isCurrentMonth = ym === todayYM;
          const isComplete = fillPct >= 1;
          return (
            <div key={ym} className="flex flex-col items-center gap-1">
              <div title={`$${paid.toFixed(4)} of $${expected.toFixed(4)} expected`}
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
                {dailyCount}/{dailyTotal}
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
      monthlyDivs: dividends.filter(d => !isSataDailyDividend(d)),
      dailyDivs:   dividends.filter(d => isSataDailyDividend(d)),
    };
  }, [dividends, ticker]);

  const dailyByMonth   = useMemo(() => groupByMonth(dailyDivs), [dailyDivs]);
  const monthlyByMonth = useMemo(() => groupByMonth(monthlyDivs), [monthlyDivs]);
  // Yahoo's dividend feed can lag a few days behind the actual payment schedule —
  // once SATA_DAILY_START arrives, treat the page as in the daily era regardless
  // of whether Yahoo has recorded a daily event yet, and fall back to the published
  // formula for "today's" amount until the first recorded event catches up.
  const inDailyEra = ticker === 'SATA' && today >= SATA_DAILY_START;
  const isBmnp = ticker === 'BMNP';
  const showGhostedChart = inDailyEra || isBmnp;

  const sataDailyStats = useMemo(() => {
    if (ticker !== 'SATA') return null;
    const annualRate = ASSET_RATES.SATA;
    const dailyAmt = getSataDailyDividend(annualRate, todayYM) ?? 0;
    // SATA pays every NYSE business day; Yahoo's feed lags, so base counts and
    // amounts on business days elapsed (payments made) rather than recorded events.
    const months = [];
    let [yy, mm] = [2026, 6];
    const [eY, eM] = todayYM.split('-').map(Number);
    while (yy < eY || (yy === eY && mm <= eM)) { months.push(`${yy}-${String(mm).padStart(2, '0')}`); mm++; if (mm > 12) { mm = 1; yy++; } }
    const paymentsMade     = months.reduce((s, ym) => s + getSataDailyPaymentsToDate(ym, today), 0);
    const currentMonthDays = getSataDailyPaymentsToDate(todayYM, today);
    const currentMonthPaid = currentMonthDays * dailyAmt;
    const expectedMonthlyTotal = getSataExpectedPeriodAmount(todayYM, annualRate);
    return { paymentsMade, dailyAmt, currentMonthPaid, expectedMonthlyTotal };
  }, [ticker, todayYM, today]);

  const latestMonthly = monthlyDivs.length > 0 ? monthlyDivs[monthlyDivs.length - 1] : null;
  const avgMonthly    = monthlyDivs.length > 0 ? monthlyDivs.reduce((s, d) => s + d.amount, 0) / monthlyDivs.length : 0;
  // The published rate (ASSET_RATES), not a trailing average of $ amounts — averaging raw
  // per-share history breaks the moment payment frequency changes (e.g. STRC's move to
  // semi-monthly halved the per-payment amount without changing the annual rate at all).
  const impliedAnnual = ASSET_RATES[ticker] ?? avgMonthly * 12;
  // Mirrors SATA's "This Month So Far" / "Expected Monthly Total" so all three dividend
  // pages show the same set of stats. STRC pays the same total each month regardless of
  // the semi-monthly split (rate ÷ 12); BMNP's weekly cadence varies by how many paydays
  // land in the month, so it uses the same schedule-aware helper as the ghosted chart.
  const monthToDateTotal = monthlyDivs
    .filter(d => d.date.slice(0, 7) === todayYM)
    .reduce((s, d) => s + d.amount, 0);
  const expectedMonthlyTotal = ticker === 'BMNP'
    ? getBmnpExpectedMonthlyTotal(todayYM, ASSET_RATES.BMNP)
    : impliedAnnual / 12;

  const prediction = useMemo(() => {
    if (inDailyEra || monthlyDivs.length < 2) return null;
    const lastDate = monthlyDivs[monthlyDivs.length - 1].date;
    const knownDate = nextKnownRecordDate(ticker, lastDate);
    const trusted = knownDate
      ? { date: knownDate, source: 'schedule' }
      : getTrustedConfirmedDate(ticker, nextPaymentDate, lastDate, today);
    const freq = PAYMENT_FREQUENCY[ticker];
    const fixedAmount = freq ? parseFloat((ASSET_RATES[ticker] / freq.perYear).toFixed(4)) : null;
    return predictNextDividend(monthlyDivs, trusted.date, trusted.source, fixedAmount);
  }, [inDailyEra, monthlyDivs, nextPaymentDate, ticker, today]);

  const predictionOverdue = prediction && prediction.date < today;
  const sharesNum         = parseFloat(shares) || 0;
  const incomePerPayment  = sharesNum * (latestMonthly?.amount ?? 0);
  const incomeAnnual      = sharesNum * impliedAnnual;

  useEffect(() => {
    if (dividends === null) return;
    if (!dividends.length && ticker !== 'BMNP') return;
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
        // Always include every month of the daily era through today, even if the
        // fetched/merged dividends feed is missing entries for it — matches the
        // BMNP branch below, so a gap in the underlying data can't drop a whole
        // month (or a day within it) off the chart.
        const monthsSet = new Set(Object.keys(allByMonth));
        let [y, m] = [2026, 6];
        const [endY, endM] = todayYM.split('-').map(Number);
        while (y < endY || (y === endY && m <= endM)) {
          monthsSet.add(`${y}-${String(m).padStart(2, '0')}`);
          m++; if (m > 12) { m = 1; y++; }
        }
        const rangeLimit = chartRange === '12M' ? 12 : chartRange === '24M' ? 24 : Infinity;
        const allMonths  = Array.from(monthsSet).sort();
        const months     = rangeLimit === Infinity ? allMonths : allMonths.slice(-rangeLimit);
        const totals     = months.map(ym => {
          if (ym < '2026-06') return allByMonth[ym];
          const monthlyPaid = (monthlyByMonth[ym] ?? []).reduce((s, d) => s + d.amount, 0);
          const daysPaid = getSataDailyPaymentsToDate(ym, today);
          return monthlyPaid + daysPaid * (getSataDailyDividend(ASSET_RATES.SATA, ym) ?? 0);
        });

        // A month in progress (paid < expected) shows its real paid total as a solid bar
        // plus a translucent "remaining" segment stacked on top — so it reads as partial
        // instead of looking like the tallest, most-complete bar on the chart the moment
        // any single payment lands. Past/complete months get a zero-height remaining
        // segment, so they render as a single solid bar exactly as before.
        const expected = months.map((ym, i) => {
          if (ym < '2026-06') return totals[i];
          const monthlyPaid = (monthlyByMonth[ym] ?? []).reduce((s, d) => s + d.amount, 0);
          const dailyPaid   = (dailyByMonth[ym] ?? []).reduce((s, d) => s + d.amount, 0);
          return getSataMonthProgress({ monthlyPaid, dailyPaid, annualRate: ASSET_RATES.SATA, yearMonth: ym }).expected;
        });
        const remaining = months.map((ym, i) => Math.max(0, expected[i] - totals[i]));

        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: { labels: months.map(ymToLabel), datasets: [
            {
              label: 'Paid', data: totals, stack: 'income',
              backgroundColor: months.map(ym => ym < '2026-06' ? '#c8893a' : 'rgba(200,137,58,0.85)'),
              borderColor: '#c8893a', borderWidth: 1, borderRadius: 3,
            },
            {
              label: 'Remaining (expected)', data: remaining, stack: 'income',
              backgroundColor: 'rgba(245,166,35,0.3)', borderColor: 'rgba(245,166,35,0.7)',
              borderWidth: 1, borderDash: [3, 3], borderRadius: 3,
            },
          ] },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { filter: c => c.datasetIndex === 0, callbacks: { label: c => {
                const ym = months[c.dataIndex];
                const amount = `$${Number(c.raw).toFixed(4)}/share`;
                if (ym < '2026-06') return amount;
                const paid = getSataDailyPaymentsToDate(ym, today);
                const total = getBusinessDaysInMonth(ym) ?? '?';
                const exp = expected[c.dataIndex];
                const suffix = `(${paid}/${total} days)`;
                return remaining[c.dataIndex] > 0 ? `${amount} of ~$${exp.toFixed(4)} expected ${suffix}` : `${amount} ${suffix}`;
              }}},
            },
            scales: {
              x: { stacked: true, ticks: { color: '#6b7280', autoSkip: false, font: { size: 10 } }, grid: { color: '#1f2937' } },
              y: { stacked: true, ticks: { color: '#6b7280', callback: v => `$${Number(v).toFixed(2)}` }, grid: { color: '#1f2937' } },
            },
          },
        });
      } else if (ticker === 'BMNP') {
        const allByMonth = {};
        dividends.forEach(d => {
          const ym = d.date.slice(0, 7);
          allByMonth[ym] = (allByMonth[ym] ?? 0) + d.amount;
        });
        // Bitmine has announced the schedule but no payment has actually landed yet —
        // always include every month from listing through today so the chart shows
        // the planned dividends ghosted out, even with zero real data on record.
        const monthsSet = new Set(Object.keys(allByMonth));
        let [y, m] = [2026, 6];
        const [endY, endM] = todayYM.split('-').map(Number);
        while (y < endY || (y === endY && m <= endM)) {
          monthsSet.add(`${y}-${String(m).padStart(2, '0')}`);
          m++; if (m > 12) { m = 1; y++; }
        }
        const rangeLimit = chartRange === '12M' ? 12 : chartRange === '24M' ? 24 : Infinity;
        const allMonths  = Array.from(monthsSet).sort();
        const months     = rangeLimit === Infinity ? allMonths : allMonths.slice(-rangeLimit);
        const totals     = months.map(ym => allByMonth[ym] ?? 0);
        const expected   = months.map((ym, i) => Math.max(totals[i], getBmnpExpectedMonthlyTotal(ym, ASSET_RATES.BMNP)));
        const remaining  = months.map((ym, i) => Math.max(0, expected[i] - totals[i]));

        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: { labels: months.map(ymToLabel), datasets: [
            {
              label: 'Paid', data: totals, stack: 'income',
              backgroundColor: 'rgba(200,137,58,0.85)', borderColor: '#c8893a', borderWidth: 1, borderRadius: 3,
            },
            {
              label: 'Remaining (expected)', data: remaining, stack: 'income',
              backgroundColor: 'rgba(253,224,71,0.25)', borderColor: 'rgba(253,224,71,0.7)',
              borderWidth: 1, borderDash: [3, 3], borderRadius: 3,
            },
          ] },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { filter: c => c.datasetIndex === 0, callbacks: { label: c => {
                const amount = `$${Number(c.raw).toFixed(4)}/share`;
                const exp = expected[c.dataIndex];
                return remaining[c.dataIndex] > 0 ? `${amount} of ~$${exp.toFixed(4)} expected` : amount;
              }}},
            },
            scales: {
              x: { stacked: true, ticks: { color: '#6b7280', autoSkip: false, font: { size: 10 } }, grid: { color: '#1f2937' } },
              y: { stacked: true, ticks: { color: '#6b7280', callback: v => `$${Number(v).toFixed(2)}` }, grid: { color: '#1f2937' } },
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
              x: { ticks: { color: '#6b7280', autoSkip: false, font: { size: 10 } }, grid: { color: '#1f2937' } },
              y: { ticks: { color: '#6b7280', callback: v => `$${Number(v).toFixed(2)}` }, grid: { color: '#1f2937' } },
            },
          },
        });
      }
    }
    draw();
    return () => { destroyed = true; };
  }, [dividends, ticker, dailyDivs, monthlyDivs, dailyByMonth, monthlyByMonth, chartRange, todayYM, today]);

  if (fetchError) return (
    <div className="p-4 rounded-lg mb-6 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444' }}>
      Could not load dividend data. Please try refreshing the page.
    </div>
  );

  if (!dividends) return (
    <div className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>Loading latest data…</div>
  );

  if (dividends.length === 0 && !isBmnp) return null;

  return (
    <>
      {/* Stats — same five slots on every ticker's page: payments made, latest/daily amount,
          month-to-date, current annual rate, expected monthly total. */}
      {(inDailyEra || monthlyDivs.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {(inDailyEra ? [
            { label: 'Daily Payments Made',    value: String(sataDailyStats.paymentsMade) },
            { label: 'Daily Amount',           value: `$${sataDailyStats.dailyAmt.toFixed(6)}`, gold: true },
            { label: 'This Month So Far',      value: `$${sataDailyStats.currentMonthPaid.toFixed(4)}`,  gold: true },
            { label: 'Current Annual Rate',    value: `${ASSET_RATES.SATA.toFixed(2)}%`,        gold: true },
            { label: 'Expected Monthly Total', value: `$${sataDailyStats.expectedMonthlyTotal.toFixed(4)}`, gold: true },
          ] : [
            { label: 'Payments on Record',     value: String(monthlyDivs.length) },
            { label: 'Latest Per Share',       value: `$${latestMonthly.amount.toFixed(4)}`,    gold: true },
            { label: 'This Month So Far',      value: `$${monthToDateTotal.toFixed(4)}`,        gold: true },
            { label: 'Current Annual Rate',    value: `${impliedAnnual.toFixed(2)}%`,           gold: true },
            { label: 'Expected Monthly Total', value: `$${expectedMonthlyTotal.toFixed(4)}`,    gold: true },
          ]).map(stat => (
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
      )}

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
              ${getSataExpectedPeriodAmount(todayYM, ASSET_RATES.SATA).toFixed(4)}
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
            {prediction.dateSource === 'schedule' ? 'Date confirmed by the announced dividend schedule · '
              : prediction.dateConfirmed ? 'Date confirmed by Yahoo Finance · ' : ''}Amount estimated from {monthlyDivs.length} payment{monthlyDivs.length !== 1 ? 's' : ''} on record
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
          {sharesNum > 0 && (inDailyEra || monthlyDivs.length > 0) && (
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
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Expected this period</p>
                    <p className="text-lg font-medium" style={{ ...MONO, color: 'var(--accent-gold)' }}>
                      {fmtMoney(sharesNum * getSataExpectedPeriodAmount(todayYM, ASSET_RATES.SATA))}
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
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Annual income</p>
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
      {inDailyEra && (
        <SataMonthlyProgress
          monthlyByMonth={monthlyByMonth}
          todayYM={todayYM}
          today={today}
          annualRate={ASSET_RATES.SATA}
        />
      )}

      {/* Chart */}
      <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{showGhostedChart ? 'Monthly Income Per Share' : 'Payment History'}</h2>
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
        {!showGhostedChart && prediction && (
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
        {showGhostedChart && (
          <div className="flex justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: 'rgba(200,137,58,0.85)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Paid so far</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: isBmnp ? 'rgba(253,224,71,0.25)' : 'rgba(245,166,35,0.3)', border: isBmnp ? '1px dashed rgba(253,224,71,0.7)' : '1px dashed rgba(245,166,35,0.7)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Still expected this month</span>
            </div>
          </div>
        )}
      </div>

      {/* SATA daily era: monthly summary payments table */}
      {inDailyEra && (
        <div className="card p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4">All Payments</h2>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--accent-gold)' }}>Daily Dividend Period (from June 16, 2026)</h3>

          {dailyDivs.length === 0 && (
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              No daily payments recorded yet — Yahoo Finance typically reports new dividend events with a short lag. This table will populate automatically once the first daily payment is confirmed.
            </p>
          )}

          <div className="sm:hidden space-y-2 mb-6">
            {Object.keys(dailyByMonth).sort().reverse().map(ym => {
              const paid = getSataDailyPaymentsToDate(ym, today);
              const total = getBusinessDaysInMonth(ym) ?? '?';
              const monthTotal = paid * (getSataDailyDividend(ASSET_RATES.SATA, ym) ?? 0);
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
                  const paid = getSataDailyPaymentsToDate(ym, today);
                  const total = getBusinessDaysInMonth(ym) ?? '?';
                  const monthTotal = paid * (getSataDailyDividend(ASSET_RATES.SATA, ym) ?? 0);
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
        </div>
      )}
    </>
  );
}
