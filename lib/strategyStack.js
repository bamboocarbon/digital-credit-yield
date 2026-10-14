// Static capital-structure figures for the Strategy pyramid (components/StrategyCapitalPyramid.js).
// PROTOTYPE DATA — hand-assembled 2026-10-14, to be replaced by the daily scan later.
//   debt:   $6.7bn convertible notes (8-K 25 May 2026, still the latest figure found)
//   STRF/STRK/STRD/STRE: notional from share counts in the March 2026 prospectus supplement
//           (STRK $1.402bn per the Aug 2026 briefing); STRE is euro-denominated, ~$ equivalent
//   STRC:   $15.5bn total preferred at 25 May less the four above, less ~$1.5bn of buybacks since
//   MSTR:   Yahoo market cap (price x shares) on 2026-10-14
// mcap ($bn) = notional x last price / par, rounded. `rank` 1 = most senior.
// Rates per Strategy's 8-K ATM tables: STRF 10%, STRK 8%, STRD 10% (the old StrategyCapitalStack
// still says STRD 8% — not yet corrected).
export const STRATEGY_STACK = [
  { id: 'DEBT', label: 'Convertible Senior Notes', kind: 'debt', tag: 'DEBT', rank: 1, mcap: 6.7, sub: '~$6.7B outstanding · Fixed maturity · Paid first in all scenarios' },
  { id: 'STRF', label: 'STRF', kind: 'pref', tag: 'PREFERRED', rank: 2, mcap: 1.3, sub: '10% fixed rate · Quarterly payments · Most senior preferred' },
  { id: 'STRC', label: 'STRC', kind: 'pref', tag: 'PREFERRED', rank: 3, mcap: 9.4, sub: '12.00% variable rate · Semi-monthly payments · Second most senior preferred', highlight: true },
  { id: 'STRE', label: 'STRE', kind: 'pref', tag: 'PREFERRED', rank: 4, mcap: 0.9, sub: '10% fixed rate · Quarterly EUR payments · EEA professional investors only' },
  { id: 'STRK', label: 'STRK', kind: 'pref', tag: 'PREFERRED', rank: 5, mcap: 1.1, sub: '8% fixed rate · Convertible into MSTR common stock' },
  { id: 'STRD', label: 'STRD', kind: 'pref', tag: 'PREFERRED', rank: 6, mcap: 0.9, sub: '10% stated rate · Most junior preferred · Trades below par' },
  { id: 'MSTR', label: 'MSTR Common Stock', kind: 'common', tag: 'COMMON EQUITY', rank: 7, mcap: 60.7, sub: 'Absorbs losses first · No dividend priority · Uncapped upside' },
];

export const STRATEGY_STACK_ASOF = '14 Oct 2026 (prototype figures)';
