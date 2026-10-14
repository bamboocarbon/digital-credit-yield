// Turns the scan feed (data/scan-feed/*.json) into exact share counts for the capital-structure
// pyramids: data/capital-stack-counts.json. Deterministic parsing — no model in the loop.
//   Strive   exact, weekly: Class A/B common + SATA (+ SATS once it appears) from its Monday 8-K table
//   SWC      exact: ordinary shares from each Total Voting Rights RNS; MORE preferred shares from the offer RNS
//   Strategy ledger: starts from a hand-entered base (strategy.com, 11 Oct 2026) and applies each weekly 8-K's
//            ATM shares sold and shares repurchased per series. Idempotent (periods already applied are skipped).
//   Bitmine / DeFi Dev: NOT here — their weekly filings carry no share counts (only 10-Q/10-K do), so those
//            stay hand-kept estimates in lib/capitalStacks.js.
// Prices are NOT stored here: market value = counts x live price, computed where the pyramid is rendered.
import { readFile } from 'node:fs/promises';

const num = s => (s === '-' || s == null ? 0 : Number(String(s).replace(/,/g, '')));
const MONTHS = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };
const isoDate = s => { const m = s.match(/([A-Z][a-z]+) (\d{1,2}), (\d{4})/); return m ? `${m[3]}-${String(MONTHS[m[1]]).padStart(2, '0')}-${m[2].padStart(2, '0')}` : null; };

// Strategy base: strategy.com series pages + ADSO table, read off by hand on 14 Oct 2026 (securities data as of the
// 13 Oct close; MSTR basic shares as of 11 Oct). Notional ($M or €M) / 100 = shares at $100 / €100 stated value.
// STRK = 1,402k MSTR-conversion shares x $1,000 = $1,402M notional -> 14.02M shares.
export const STRATEGY_BASE = {
  asOf: '2026-10-11',
  counts: { STRC: 87_921_000, STRF: 12_840_000, STRK: 14_020_000, STRD: 14_024_000, STRE: 7_750_000, MSTR: 422_199_000 },
  source: 'strategy.com series pages (13 Oct 2026) + ADSO table (11 Oct 2026), entered by hand',
};
const ATM_TICKERS = ['STRF', 'STRC', 'STRK', 'STRD', 'MSTR']; // STRE is Luxembourg-listed: not in the ATM table

// ---- Strategy -------------------------------------------------------------------------------------
export function parseStrategyWeeks(text) {
  const out = [];
  const periods = [...text.matchAll(/During Period ([A-Z][a-z]+ \d{1,2}, \d{4}) to ([A-Z][a-z]+ \d{1,2}, \d{4})/g)];
  const periodAt = pos => { let p = null; for (const m of periods) if (m.index <= pos) p = m; return p; };
  for (const m of text.matchAll(/Shares (Sold|Repurchased)/g)) {
    const p = periodAt(m.index); if (!p) continue;
    const next = text.indexOf('During Period', m.index + 10);
    const sect = text.slice(m.index, next === -1 ? m.index + 1800 : Math.min(next, m.index + 1800));
    const rows = {};
    for (const t of ATM_TICKERS) {
      const r = sect.match(new RegExp(`\\b${t} Stock(?: \\(\\d\\))?\\s+([\\d,]+|-)\\s+\\$`));
      if (r) rows[t] = num(r[1]);
    }
    if (Object.keys(rows).length) out.push({ kind: m[1] === 'Sold' ? 'sold' : 'repurchased', periodStart: isoDate(p[1]), periodEnd: isoDate(p[2]), rows });
  }
  // The same period can appear in several tables (and 8-Ks repeat prior weeks) — de-duplicate.
  const seen = new Set();
  return out.filter(w => { const k = `${w.kind}|${w.periodEnd}`; if (seen.has(k)) return false; seen.add(k); return true; });
}

export function updateStrategy(prev, secFeed) {
  const led = prev?.strategy?.ledger ?? { counts: { ...STRATEGY_BASE.counts }, appliedThrough: STRATEGY_BASE.asOf, applied: [] };
  const weeks = [];
  for (const f of secFeed?.MSTR?.filings ?? []) if (f.form === '8-K') for (const d of f.docs ?? []) weeks.push(...parseStrategyWeeks(d.text).map(w => ({ ...w, url: d.url })));
  weeks.sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
  const done = new Set(led.applied);
  const warnings = [];
  for (const w of weeks) {
    const key = `${w.kind}|${w.periodEnd}`;
    if (w.periodEnd <= STRATEGY_BASE.asOf || done.has(key)) continue;
    const sign = w.kind === 'sold' ? 1 : -1;
    for (const [t, n] of Object.entries(w.rows)) led.counts[t] += sign * n;
    led.applied.push(key);
    if (w.periodEnd > led.appliedThrough) led.appliedThrough = w.periodEnd;
  }
  if (!weeks.length) warnings.push('No Strategy ATM tables found in the feed window.');
  return { ledger: led, asOf: led.appliedThrough, counts: led.counts, base: STRATEGY_BASE, warnings };
}

// ---- Strive ---------------------------------------------------------------------------------------
export function parseStrive(secFeed) {
  const filings = [...(secFeed?.ASST?.filings ?? [])].filter(f => f.form === '8-K').sort((a, b) => b.date.localeCompare(a.date));
  for (const f of filings) for (const d of f.docs ?? []) {
    const t = d.text;
    if (!/Shares outstanding/.test(t) || !/SATA Stock/.test(t)) continue;
    const asOf = t.match(/As of ([A-Z][a-z]+ \d{1,2}, \d{4}) As of ([A-Z][a-z]+ \d{1,2}, \d{4})/);
    const cur = re => { const m = t.match(re); return m ? num(m[2]) : null; };
    const row = label => cur(new RegExp(`${label}\\s+(?:\\(\\d\\)\\s*)?([\\d,]+)\\s+([\\d,]+)`));
    return {
      asOf: asOf ? isoDate(asOf[2]) : null,
      classA: row('Class A common stock'),
      classB: row('Class B common stock'),
      commonEffective: row('Effective Common Shares Outstanding'),
      SATA: row('SATA Stock'),
      SATS: /SATS Stock/.test(t) ? row('SATS Stock') : null,
      bitcoinHeld: row('Bitcoin held'),
      source: d.url, filed: f.date,
    };
  }
  return null;
}

// ---- Smarter Web ----------------------------------------------------------------------------------
export function parseSwc(swcFeed) {
  const items = [...(swcFeed?.items ?? [])].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  let ord = null, pref = null;
  for (const it of items) {
    const t = it.text ?? '';
    if (!ord) {
      const m = t.match(/(?:it has|will consist of) ([\d,]{9,}) [Oo]rdinary [Ss]hares/);
      if (m) ord = { shares: num(m[1]), asOf: it.date, source: it.url, headline: it.headline };
    }
    if (!pref) {
      const m = t.match(/admission of the ([\d,]+) Preferred Shares \(being the ([\d,]+) Preferred Shares issued pursuant to the IPO and the ([\d,]+) Preferred Shares issued into the Preferred Shares ATM Facility/);
      if (m) pref = { issued: num(m[1]), ipo: num(m[2]), atmFacility: num(m[3]), asOf: it.date, source: it.url, headline: it.headline,
        note: 'ATM-facility shares are issued to Tennyson to sell into the market; they exist but may not be sold yet.' };
    }
  }
  return { ordinary: ord, preferred: pref };
}

export async function buildCounts({ sec, swc, prevPath }) {
  let prev = null;
  try { prev = JSON.parse(await readFile(prevPath, 'utf8')); } catch {}
  const warnings = [];
  const strategy = updateStrategy(prev, sec); warnings.push(...strategy.warnings); delete strategy.warnings;
  const strive = parseStrive(sec) ?? prev?.strive ?? null; if (!parseStrive(sec)) warnings.push('No Strive share table in the feed window; kept previous.');
  const sw = parseSwc(swc);
  return {
    generatedAt: new Date().toISOString(),
    strategy,
    strive,
    swc: { ordinary: sw.ordinary ?? prev?.swc?.ordinary ?? null, preferred: sw.preferred ?? prev?.swc?.preferred ?? null },
    notes: ['Prices are not stored here; multiply by the live price at render time.', 'Bitmine and DeFi Dev share counts are not parseable from weekly filings — see lib/capitalStacks.js.'],
    warnings,
  };
}
