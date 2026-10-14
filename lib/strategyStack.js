// Static capital-structure figures for the Strategy pyramid (components/StrategyCapitalPyramid.js).
// PROTOTYPE DATA — hand-assembled 2026-10-14, to be replaced by the daily scan later.
//   debt:   $6.7bn convertible notes (8-K 25 May 2026, still the latest figure found)
//   STRF/STRK/STRD/STRE: notional from share counts in the March 2026 prospectus supplement
//           (STRK $1.402bn per the Aug 2026 briefing); STRE is euro-denominated, ~$ equivalent
//   STRC:   $15.5bn total preferred at 25 May less the four above, less ~$1.5bn of buybacks since
//   MSTR:   Yahoo market cap (price x shares) on 2026-10-14
// mcap ($bn) = notional x last price / par, rounded. `rank` 1 = most senior.
export const STRATEGY_STACK = [
  { id: 'DEBT', label: 'Convertible notes', kind: 'debt', rank: 1, mcap: 6.7, note: '0% convertible senior notes' },
  { id: 'STRF', label: 'STRF', kind: 'pref', rank: 2, mcap: 1.3, rate: '10% fixed', note: 'Quarterly · most senior preferred' },
  { id: 'STRC', label: 'STRC', kind: 'pref', rank: 3, mcap: 9.4, rate: '12% variable', note: 'Semi-monthly', highlight: true },
  { id: 'STRE', label: 'STRE', kind: 'pref', rank: 4, mcap: 0.9, rate: '10% fixed', note: 'Euro · quarterly' },
  { id: 'STRK', label: 'STRK', kind: 'pref', rank: 5, mcap: 1.1, rate: '8% fixed', note: 'Convertible into MSTR' },
  { id: 'STRD', label: 'STRD', kind: 'pref', rank: 6, mcap: 0.9, rate: '10% stated', note: 'Most junior preferred' },
  { id: 'MSTR', label: 'MSTR common', kind: 'common', rank: 7, mcap: 60.7, note: 'Absorbs losses first' },
];

export const STRATEGY_STACK_ASOF = '14 Oct 2026 (prototype figures)';
