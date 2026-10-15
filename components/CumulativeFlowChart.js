'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BMNP_ENABLED } from '@/lib/constants';

// Cumulative capital raised ($M) from SEC 8-K filings
const data = [
  { period: 'Jul 25',      strc: 2521,  sata: null },
  { period: 'Aug 25',      strc: 2543,  sata: null },
  { period: 'Sep 25',      strc: 2589,  sata: null },
  { period: 'Oct 25',      strc: 2654,  sata: null },
  { period: 'Nov 25',      strc: 2697,  sata: 174  },
  { period: 'Dec 25',      strc: 2746,  sata: 243  },
  { period: 'Jan 26',      strc: 3446,  sata: 541  },
  { period: 'Feb 26',      strc: 4086,  sata: 688  },
  { period: 'Mar wk1',     strc: 4286,  sata: 733  },
  { period: 'Mar wk2',     strc: 5466,  sata: 751  },
  { period: 'Mar wk3',     strc: 6046,  sata: 856  },
  { period: 'Apr wk1',     strc: 7246,  sata: 964  },
  { period: 'Apr wk2',     strc: 7546,  sata: 1029 },
  { period: 'Apr wk3',     strc: 7946,  sata: 1099 },
  { period: 'Apr wk4',     strc: 8196,  sata: 1174 },
  { period: 'May wk1',     strc: 8326,  sata: 1211 },
  { period: 'May wk2',     strc: 8526,  sata: 1257 },
  { period: 'May wk3',     strc: 8926,  sata: 1307 },
  { period: 'May wk4',     strc: 10926, sata: 1386 },
];

const fmtLinear = v => v >= 1000 ? `$${(v / 1000).toFixed(1)}B` : `$${v}M`;
const fmtLog    = v => { const a = Math.pow(10, v); return a >= 1000 ? `$${(a / 1000).toFixed(1)}B` : `$${Math.round(a)}M`; };

const tick = { fontFamily: 'inherit', fontSize: 11, fill: '#6b7280' };

function TooltipLinear({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '8px 12px', borderRadius: 8, fontSize: 12 }}>
      <p style={{ color: '#6b7280', marginBottom: 4 }}>{label}</p>
      {payload.map(p => p.value != null && (
        <p key={p.name} style={{ color: p.color, margin: '2px 0' }}>{p.name}: <strong>{fmtLinear(p.value)}</strong></p>
      ))}
    </div>
  );
}

function TooltipLog({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '8px 12px', borderRadius: 8, fontSize: 12 }}>
      <p style={{ color: '#6b7280', marginBottom: 4 }}>{label}</p>
      {payload.map(p => p.value != null && (
        <p key={p.name} style={{ color: p.color, margin: '2px 0' }}>{p.name}: <strong>{fmtLog(p.value)}</strong></p>
      ))}
    </div>
  );
}

function parsePeriod(p) {
  const m = p.match(/^([A-Za-z]+)\s+(\d+)\s+'(\d+)$/);
  if (!m) return new Date(0);
  return new Date(`${m[1]} ${m[2]} 20${m[3]}`);
}

function filterCumulative(data, range) {
  if (range === 'all' || !data.length) return data;
  const last = parsePeriod(data[data.length - 1].period);
  const months = range === '6m' ? 6 : range === '1y' ? 12 : 24;
  const cutoff = new Date(last);
  cutoff.setMonth(cutoff.getMonth() - months);
  return data.filter(d => parsePeriod(d.period) >= cutoff);
}

const RANGE_OPTS = ['6M', '1Y', 'All'];

// One entry per plotted line — the legend buttons toggle these on/off so the smaller
// issuers can be compared without STRC's scale flattening them.
const TICKER_LINES = [
  { key: 'strc', color: '#15803d', label: 'Strategy', sub: 'all 5 preferreds · IPO Jan 2025' },
  { key: 'sata', color: '#2563eb', label: 'Strive', sub: 'SATA + SATS · IPO Nov 2025' },
  ...(BMNP_ENABLED ? [{ key: 'bmnp', color: '#fde047', label: 'BMNP', sub: 'Bitmine · IPO Jun 2026' }] : []),
  { key: 'chad', color: '#7f1d1d', label: 'CHAD', sub: 'DeFi Development Corp. · IPO Sep 2026' },
  { key: 'more', color: '#a855f7', label: 'MORE', sub: 'Smarter Web Company · IPO Oct 2026 (£ converted)' },
];

const cardStyle = {
  background: '#111827',
  border: '1px solid #1f2937',
  borderRadius: 12,
  padding: '20px 12px 12px 4px',
  marginBottom: 16,
};

export default function CumulativeFlowChart() {
  const [scale, setScale] = useState('linear');
  const [range, setRange] = useState('all');
  const [liveData, setLiveData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hidden, setHidden] = useState([]);

  useEffect(() => {
    fetch('/api/money-flow-data')
      .then(r => r.json())
      .then(d => {
        if (d?.cumulative?.length) setLiveData(d.cumulative);
        if (d?.lastUpdated) setLastUpdated(d.lastUpdated);
      })
      .catch(() => {});
  }, []);

  const activeData = liveData ?? data;
  const displayData = filterCumulative(activeData, range);
  const isLog = scale === 'log';
  const visibleLines = TICKER_LINES.filter(t => !hidden.includes(t.key));

  // Always keep at least one line on the chart.
  const toggleLine = key => setHidden(h =>
    h.includes(key) ? h.filter(k => k !== key) : (visibleLines.length > 1 ? [...h, key] : h)
  );

  // Log axis fitted to whatever is visible, so hiding STRC zooms in on the smaller issuers
  // (the old fixed 10^2 floor would push anything under $100M off the bottom of the chart).
  const visibleValues = displayData.flatMap(d => visibleLines.map(t => d[t.key])).filter(v => v > 0);
  const logLo = visibleValues.length ? Math.floor(Math.log10(Math.min(...visibleValues)) * 2) / 2 : 2;
  const logHi = visibleValues.length ? Math.max(logLo + 1, Math.ceil(Math.log10(Math.max(...visibleValues)) * 2) / 2) : 4.2;
  const logTicks = [];
  for (let v = logLo; v <= logHi + 1e-9; v += 0.5) logTicks.push(+v.toFixed(1));

  return (
    <div>
      {/* Legend + toggle */}
      <div className="flex items-center justify-between flex-wrap gap-x-6 gap-y-3 mb-4">
        <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          {TICKER_LINES.map(i => {
            const on = !hidden.includes(i.key);
            return (
              <button key={i.key} type="button" onClick={() => toggleLine(i.key)} aria-pressed={on}
                title={`${on ? 'Hide' : 'Show'} ${i.label} — ${i.sub}`}
                className="flex items-center gap-2 transition-opacity"
                style={{
                  padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                  background: 'var(--bg-card)',
                  border: `1px solid ${on ? i.color : 'var(--border)'}`,
                  opacity: on ? 1 : 0.45,
                }}>
                <div style={{ width: 24, height: 2, background: i.color, borderRadius: 2 }} />
                <p style={{ margin: 0, color: '#e5e7eb', textDecoration: on ? 'none' : 'line-through' }}>{i.label}</p>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {RANGE_OPTS.map(r => (
              <button key={r} onClick={() => setRange(r.toLowerCase())}
                className="text-sm font-medium transition-colors"
                style={{
                  padding: '4px 10px', borderRadius: 8,
                  background: range === r.toLowerCase() ? 'var(--accent-gold)' : 'var(--bg-card)',
                  color:      range === r.toLowerCase() ? '#000' : 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}>
                {r}
              </button>
            ))}
          </div>
          <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
          {['linear', 'log'].map(s => (
            <button key={s} onClick={() => setScale(s)}
              className="px-3 py-1.5 text-sm rounded-lg font-medium transition-colors"
              style={{
                background: scale === s ? 'var(--accent-gold)' : 'var(--bg-card)',
                color:      scale === s ? '#000' : 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Linear chart */}
      {!isLog && (
        <div style={cardStyle}>
          <p style={{ margin: '0 0 16px 44px', fontSize: 11, color: '#4b5563', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Linear Scale · Absolute Size
          </p>
          <div role="img" aria-label={`Strategy, Strive${BMNP_ENABLED ? ', BMNP' : ''} CHAD and MORE cumulative capital raised — linear scale line chart`}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={displayData} margin={{ top: 4, right: 20, left: 8, bottom: 55 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="period" tick={tick} angle={-45} textAnchor="end" interval={0} height={65} />
              <YAxis tickFormatter={fmtLinear} tick={tick} width={54} />
              <Tooltip content={<TooltipLinear />} />
              {visibleLines.map(t => (
                <Line key={t.key} type="monotone" dataKey={t.key} name={t.label} stroke={t.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} connectNulls={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Log chart */}
      {isLog && (
        <div style={cardStyle}>
          <p style={{ margin: '0 0 16px 44px', fontSize: 11, color: '#4b5563', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Log Scale · Growth Trajectory
          </p>
          <div role="img" aria-label={`Strategy, Strive${BMNP_ENABLED ? ', BMNP' : ''} CHAD and MORE cumulative capital raised — log scale line chart`}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={displayData.map(d => ({ ...d, strc: d.strc ? Math.log10(d.strc) : null, sata: d.sata ? Math.log10(d.sata) : null, bmnp: d.bmnp ? Math.log10(d.bmnp) : null, chad: d.chad ? Math.log10(d.chad) : null, more: d.more ? Math.log10(d.more) : null }))}
              margin={{ top: 4, right: 20, left: 8, bottom: 55 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="period" tick={tick} angle={-45} textAnchor="end" interval={0} height={65} />
              <YAxis tickFormatter={fmtLog} tick={tick} width={54} domain={[logLo, logHi]} ticks={logTicks} />
              <Tooltip content={<TooltipLog />} />
              {visibleLines.map(t => (
                <Line key={t.key} type="monotone" dataKey={t.key} name={t.label} stroke={t.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} connectNulls={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          </div>
        </div>
      )}

      <p style={{ fontSize: 10, color: '#374151', textAlign: 'center' }}>
        Source: SEC 8-K filings (MORE: London Stock Exchange RNS, converted from £ at ~1.32) · auto-updated weekly
        {lastUpdated && ` · Last updated ${new Date(lastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
      </p>
    </div>
  );
}
