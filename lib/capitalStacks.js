// Static capital-structure figures for the market-cap pyramids (components/CapitalPyramid.js),
// one stack per ticker, ordered most senior -> most junior.
// PROTOTYPE DATA — hand-assembled 2026-10-14, to be replaced by the daily scan later.
// mcap is in MILLIONS of the stack's currency. mcap 0 = "none" (no debt ahead of the preferred).
//
// Sources / basis:
//   STRC stack: strategy.com ADSO table at 11 Oct 2026 — converts sum to $6.714bn principal, STRK
//     $1.402bn notional x $75.6 (STRK still derived, no strategy.com page yet), MSTR 422.199m basic shares x $152.18 (Yahoo's share count was stale
//     at 379m). STRC/STRF/STRD/STRE market caps read off the
//     strategy.com series pages on 14 Oct 2026 (securities data as of 13 Oct close): STRC $8,783m
//     (notional $8,792m), STRF $1,328m, STRD $1,028m, STRE €612m = ~$685m at the page's $/€ rate.
//   SATA: Strive 8-K (13 Oct 2026, data as of 9 Oct): 14,030,176 SATA shares x $100 = $1,403m notional,
//     x $98.79 = $1,386m; common = 110,387,204 (Class A + B) x $27.59 = $3,046m.
//   BMNP: 3,500,000 shares ($80 IPO, 10-Q subsequent events) x $100 par, last close $99.53 (12 Oct
//     press release) = $348m. No later issuance found. BMNR: 603,226,394 shares as of 9 Jul 2026
//     (10-Q cover; weekly 8-Ks give no share count, so this is ~3 months stale) x $23.49 = $14.17bn.
//   CHAD/MORE preferreds: capital raised to date (money-flow data) x last price / par —
//     an approximation of market value. Commons: Yahoo market caps (BMNR, DFDV, SWC.L).
//   CHAD debt ~$215.8m (30 Jun 2026 prospectus); MORE debt £20.8m drawn (29 Sep 2026 prospectus).
// Rates per Strategy's 8-K ATM tables: STRF 10%, STRK 8%, STRD 10% (the old StrategyCapitalStack
// in the blog articles still says STRD 8%).

export const CAPITAL_STACKS = {
  STRC: {
    currency: '$',
    caption: 'Strategy Inc capital structure · Source: SEC filings · prototype figures, 14 Oct 2026',
    rows: [
      { id: 'DEBT', label: 'Convertible Senior Notes', kind: 'debt', tag: 'DEBT', mcap: 6714, sub: '~$6.7B outstanding · Fixed maturity · Paid first in all scenarios' },
      { id: 'STRF', label: 'STRF', kind: 'pref', tag: 'PREFERRED', mcap: 1328, sub: '10% fixed rate · Quarterly payments · Most senior preferred' },
      { id: 'STRC', label: 'STRC', kind: 'pref', tag: 'PREFERRED', mcap: 8783, sub: '12.00% variable rate · Semi-monthly payments · Second most senior preferred', highlight: true },
      { id: 'STRE', label: 'STRE', kind: 'pref', tag: 'PREFERRED', mcap: 685, sub: '10% fixed rate · Quarterly EUR payments · EEA professional investors only' },
      { id: 'STRK', label: 'STRK', kind: 'pref', tag: 'PREFERRED', mcap: 1060, sub: '8% fixed rate · Convertible into MSTR common stock' },
      { id: 'STRD', label: 'STRD', kind: 'pref', tag: 'PREFERRED', mcap: 1028, sub: '10% fixed rate · Most junior preferred · Trades below par' },
      { id: 'MSTR', label: 'MSTR Common Stock', kind: 'common', tag: 'COMMON EQUITY', mcap: 64250, sub: 'Absorbs losses first · No dividend priority · Uncapped upside' },
    ],
  },
  SATA: {
    currency: '$',
    caption: "SATA in Strive's capital structure · prototype figures, 14 Oct 2026",
    rows: [
      { id: 'DEBT', label: 'No Debt', kind: 'none', tag: 'DEBT FREE', mcap: 0, sub: 'All legacy debt retired Q1 2026 · Zero existing indebtedness · Debt-free by policy' },
      { id: 'SATA', label: 'SATA', kind: 'pref', tag: 'PREFERRED', mcap: 1386, sub: '13% variable rate · Daily payments · Only preferred series · Most senior security outstanding', highlight: true },
      { id: 'ASST', label: 'ASST Common Stock', kind: 'common', tag: 'COMMON EQUITY', mcap: 3046, sub: 'Absorbs losses first · No dividend priority · Uncapped upside from Bitcoin appreciation' },
    ],
  },
  BMNP: {
    currency: '$',
    caption: "BMNP in Bitmine's capital structure · Source: Bitmine 424B5 (5 June 2026) and 10-Q (quarter to 31 May 2026) · prototype figures, 14 Oct 2026",
    rows: [
      { id: 'DEBT', label: 'No borrowings', kind: 'none', tag: 'NO DEBT', mcap: 0, sub: 'No notes, loans or convertibles on the balance sheet at 31 May 2026 · ~$30m total liabilities · future debt would rank ahead' },
      { id: 'BMNP', label: 'BMNP', kind: 'pref', tag: 'PREFERRED', mcap: 348, sub: '9.50% fixed · Weekly · Cumulative · Redeemable at 110% → 105% → 100% of $100', highlight: true },
      { id: 'BMNR', label: 'BMNR Common Stock', kind: 'common', tag: 'COMMON EQUITY', mcap: 14170, sub: 'Absorbs losses first · No dividend priority · Cannot be paid while BMNP arrears exist' },
    ],
  },
  CHAD: {
    currency: '$',
    caption: "CHAD in DeFi Development Corp.'s capital structure · Source: CHAD prospectus and 10-Q, balances at 30 June 2026 · prototype figures, 14 Oct 2026",
    rows: [
      { id: 'DEBT', label: 'Debt · ~$216m outstanding', kind: 'debt', tag: 'DEBT', mcap: 216, sub: 'Convertible notes (2030) · Borrowing against pledged digital assets · Paid before any CHAD dividend or liquidation claim' },
      { id: 'CHAD', label: 'CHAD', kind: 'pref', tag: 'PREFERRED', mcap: 13, sub: '13% variable · Daily · Cumulative · $10 stated value · $11 redemption option', highlight: true },
      { id: 'DFDV', label: 'DFDV Common Stock', kind: 'common', tag: 'COMMON EQUITY', mcap: 138, sub: 'Absorbs losses first · No dividend priority · Uncapped SOL upside' },
    ],
  },
  MORE: {
    currency: '£',
    caption: "MORE in The Smarter Web Company's capital structure · Source: MORE prospectus (29 Sep 2026) · prototype figures, 14 Oct 2026",
    rows: [
      { id: 'DEBT', label: 'Debt · Coinbase credit facility', kind: 'debt', tag: 'DEBT', mcap: 20.8, sub: '£20.8m drawn per the prospectus (about 11.8% leverage) · Secured against bitcoin · Repaid before any MORE dividend or liquidation claim' },
      { id: 'MORE', label: 'MORE', kind: 'pref', tag: 'PREFERRED', mcap: 13, sub: '12% initial, variable (20% cap) · Weekly · Cumulative · £100 reference value · Redeemable at £110 · No vote', highlight: true },
      { id: 'SWC', label: 'SWC Ordinary Shares', kind: 'common', tag: 'COMMON EQUITY', mcap: 201, sub: 'Absorbs losses first · No dividend priority · Uncapped bitcoin upside' },
    ],
  },
};
