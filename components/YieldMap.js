'use client';

import { useState, useEffect, useRef } from 'react';

// Effective yield (vertical) against stated rate (horizontal), one dot per preferred. The dashed
// diagonal is "at par" (stated = effective): above it a preferred trades under par and pays more
// than its stated rate, below it over par and pays less. Dot size is market cap in USD.
// Data: /api/yield-map (same cached quotes as the price cards).

const ISSUER = {
  STRC: ['Strategy', '#4ade80'], STRK: ['Strategy', '#4ade80'], STRF: ['Strategy', '#4ade80'],
  STRD: ['Strategy', '#4ade80'], STRE: ['Strategy', '#4ade80'],
  SATA: ['Strive', '#3b82f6'], SATS: ['Strive', '#3b82f6'],
  BMNP: ['Bitmine', '#fde047'], CHAD: ['DeFi Development', '#ef4444'], MORE: ['Smarter Web', '#a855f7'],
};
// Which side of its dot each label sits on (and a nudge), picked so neighbours don't collide.
const LABEL = {
  STRC: ['l', 4], MORE: ['r', 4], SATA: ['l', 4], CHAD: ['r', 4], BMNP: ['l', 4],
  STRF: ['r', 18], STRK: ['r', 4], STRD: ['r', 4], STRE: ['r', 4], SATS: ['l', 4],
};
const MUTED = '#9ca3af';

export default function YieldMap() {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [w, setW] = useState(860);
  const box = useRef(null);

  useEffect(() => {
    fetch('/api/yield-map').then(r => r.json()).then(d => (d.points?.length ? setData(d) : setFailed(true))).catch(() => setFailed(true));
  }, []);
  useEffect(() => {
    if (!box.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(320, Math.min(900, Math.round(e.contentRect.width)))));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  if (failed) return null;

  const body = (() => {
    if (!data) return <div className="animate-pulse rounded-lg" style={{ height: 360, background: 'var(--bg-card-hover)' }} />;
    const { points, refs } = data;
    const nums = [...points.flatMap(p => [p.stated, p.effective]), refs.treasury?.value, refs.corporate?.value].filter(Number.isFinite);
    const lo = Math.max(0, Math.floor((Math.min(...nums) - 0.5) / 2) * 2);
    const hi = Math.ceil((Math.max(...nums) + 0.5) / 2) * 2;
    const small = w < 560;
    const H = Math.round(Math.max(380, w * 0.65)), L = small ? 46 : 62, R = 16, T = 16, B = small ? 52 : 58;
    const x = v => L + (v - lo) / (hi - lo) * (w - L - R);
    const y = v => H - B - (v - lo) / (hi - lo) * (H - T - B);
    const fs = small ? 11 : 13;
    const ticks = []; for (let v = lo; v <= hi; v += 2) ticks.push(v);
    const ang = -Math.atan2(y(lo) - y(hi), x(hi) - x(lo)) * 180 / Math.PI;
    // unit normal to the diagonal pointing up-left (into the green zone), and the distance from the diagonal's centre to the far corner
    const vx = x(hi) - x(lo), vy = y(hi) - y(lo), vn = Math.hypot(vx, vy);
    const g = { cx: x((lo + hi) / 2), cy: y((lo + hi) / 2), nx: vy / vn, ny: -vx / vn };
    g.len = (x(lo) - g.cx) * g.nx + (y(hi) - g.cy) * g.ny;
    const maxM = Math.max(...points.map(p => p.mcap || 0), 1);
    const rad = m => (small ? 4 : 5) + Math.sqrt(m || 10) / (small ? 9 : 6.2);
    const refList = [[refs.treasury, '10-yr Treasury'], [refs.corporate, 'Corporate bonds (high quality)']].filter(([r]) => r);

    return (
      <svg viewBox={`0 0 ${w} ${H}`} width="100%" role="img" aria-label="Effective yield against stated rate for each preferred stock" style={{ display: 'block' }}>
        <defs>
          {/* Shading fades from nothing at the par diagonal to its strongest at the far corner, so the colour
              gets stronger the further a preferred is from par. The gradient runs along the diagonal's normal. */}
          <linearGradient id="ym-green" gradientUnits="userSpaceOnUse" x1={g.cx} y1={g.cy} x2={g.cx + g.nx * g.len} y2={g.cy + g.ny * g.len}>
            <stop offset="0" stopColor="#22c55e" stopOpacity="0" />
            <stop offset="0.3" stopColor="#22c55e" stopOpacity="0.09" />
            <stop offset="0.65" stopColor="#22c55e" stopOpacity="0.21" />
            <stop offset="1" stopColor="#22c55e" stopOpacity="0.34" />
          </linearGradient>
          <linearGradient id="ym-red" gradientUnits="userSpaceOnUse" x1={g.cx} y1={g.cy} x2={g.cx - g.nx * g.len} y2={g.cy - g.ny * g.len}>
            <stop offset="0" stopColor="#ef4444" stopOpacity="0" />
            <stop offset="0.3" stopColor="#ef4444" stopOpacity="0.09" />
            <stop offset="0.65" stopColor="#ef4444" stopOpacity="0.21" />
            <stop offset="1" stopColor="#ef4444" stopOpacity="0.34" />
          </linearGradient>
        </defs>
        <polygon points={`${x(lo)},${y(lo)} ${x(lo)},${y(hi)} ${x(hi)},${y(hi)}`} fill="url(#ym-green)" />
        <polygon points={`${x(lo)},${y(lo)} ${x(hi)},${y(lo)} ${x(hi)},${y(hi)}`} fill="url(#ym-red)" />
        <text x={x(lo) + 8} y={y(hi) + 18} fill="#4ade80" fillOpacity=".85" fontSize={fs}>{small ? 'Under par: you earn more' : 'Under par: you earn more than the stated rate'}</text>
        <text x={x(hi) - 8} y={y(lo) - 10} fill="#f87171" fillOpacity=".85" fontSize={fs} textAnchor="end">{small ? 'Over par: you earn less' : 'Over par: you earn less than the stated rate'}</text>
        {ticks.map(v => (
          <g key={v}>
            <line x1={L} x2={w - R} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.07)" />
            <line y1={T} y2={H - B} x1={x(v)} x2={x(v)} stroke="rgba(255,255,255,0.07)" />
            <text x={L - 8} y={y(v) + 4} fill={MUTED} fontSize={fs - 1} textAnchor="end">{v}%</text>
            <text x={x(v)} y={H - B + 18} fill={MUTED} fontSize={fs - 1} textAnchor="middle">{v}%</text>
          </g>
        ))}
        <line x1={x(lo)} y1={y(lo)} x2={x(hi)} y2={y(hi)} stroke="#6b7280" strokeDasharray="5 5" />
        <text transform={`translate(${x(hi - 0.1)},${y(hi - 0.1)}) rotate(${ang})`} dy="-7" fill={MUTED} fontSize={fs - 1} textAnchor="end">at par (stated = effective)</text>
        {refList.map(([r, name]) => (
          <g key={name}>
            {/* a bond at par has stated = effective: across to the diagonal, then down to the axis */}
            <polyline points={`${x(lo)},${y(r.value)} ${x(r.value)},${y(r.value)} ${x(r.value)},${y(lo)}`} fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 4" />
            <circle cx={x(r.value)} cy={y(r.value)} r="3.5" fill="#a78bfa" />
            <text x={x(r.value) + 8} y={y(r.value) + 18} fill="#a78bfa" fontSize={fs - 1}>{name} {r.value.toFixed(1)}%</text>
          </g>
        ))}
        <text x={(L + w - R) / 2} y={H - 10} fill="#e5e7eb" fontSize={fs + 1} textAnchor="middle">Stated rate (current)</text>
        <text transform={`translate(14,${(T + H - B) / 2}) rotate(-90)`} fill="#e5e7eb" fontSize={fs + 1} textAnchor="middle">Effective yield</text>
        {points.map(p => {
          const [, col] = ISSUER[p.ticker] ?? ['', '#9ca3af'];
          const r = rad(p.mcap), [side, dy] = LABEL[p.ticker] ?? ['r', 4];
          const cx = x(p.stated), cy = y(p.effective);
          return (
            <g key={p.ticker}>
              <circle cx={cx} cy={cy} r={r} fill={col} fillOpacity=".75" stroke={col} strokeWidth="2" />
              <text x={side === 'l' ? cx - r - 6 : cx + r + 6} y={cy + dy} fill="#e5e7eb" fontSize={fs} fontWeight="600" textAnchor={side === 'l' ? 'end' : 'start'}>
                {p.ticker} <tspan fill={MUTED} fontWeight="400">{p.effective.toFixed(1)}%</tspan>
              </text>
            </g>
          );
        })}
      </svg>
    );
  })();

  const issuers = data ? [...new Map(data.points.map(p => [ISSUER[p.ticker]?.[0], ISSUER[p.ticker]?.[1]])).entries()] : [];
  const shortDate = d => (d ? new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }) : null);
  const tDate = shortDate(data?.refs?.treasury?.date), cDate = shortDate(data?.refs?.corporate?.date);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-2 text-center">Where Each Preferred Is Priced</h2>
      <p className="text-sm text-center mb-6 max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
        Effective yield (what you earn at today&rsquo;s price) against the stated rate. Above the diagonal a preferred trades under par; below it, over par.
      </p>
      <div ref={box} className="card rounded-xl p-3 sm:p-4 mx-auto" style={{ border: '1px solid var(--border)', maxWidth: 920 }}>
        {body}
        {data && (
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            {issuers.map(([name, col]) => (
              <span key={name}><i style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: col, marginRight: 6 }} />{name}</span>
            ))}
            <span>Dot size = market cap</span>
          </div>
        )}
      </div>
      {data && (
        <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
          Live prices, refreshed every few minutes.{tDate ? ` 10-year Treasury: Federal Reserve via FRED, ${tDate}.` : ''}{cDate ? ` Corporate bonds: US Treasury via FRED, ${cDate}.` : ''}
        </p>
      )}
    </section>
  );
}
