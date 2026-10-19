// Static capital-structure figures for the market-cap pyramids (components/CapitalPyramid.js),
// one stack per ticker, ordered most senior -> most junior.
// PROTOTYPE DATA — hand-assembled 2026-10-14, to be replaced by the daily scan later.
// mcap is in MILLIONS of the stack's currency. mcap 0 = "none" (no debt ahead of the preferred).
// A row with `live` is recomputed at render time (lib/capitalStacksLive.js): market value = shares x live price.
//   live.shares  'counts:<path>' reads data/capital-stack-counts.json (kept current from filings by scripts/capitalCounts.mjs);
//                'value:<n>' is a hand-kept count (Bitmine/DeFi Dev publish none weekly — see comments below).
//   live.price   a site ticker ('STRF'), 'eq:<symbol>' for common stock, optional '@<fx>' to convert to the stack currency.
// `mcap` stays as the fallback if a price or count is unavailable, and for rows without `live` (debt, proposed SATS).
//
// Sources / basis:
//   STRC stack: strategy.com ADSO table at 11 Oct 2026 — converts sum to $6.714bn principal, STRK
//     $1.402bn notional x $75.6 (STRK still derived, no strategy.com page yet), MSTR 422.199m basic shares x $152.18 (Yahoo's share count was stale
//     at 379m). STRC/STRF/STRD/STRE market caps read off the
//     strategy.com series pages on 14 Oct 2026 (securities data as of 13 Oct close): STRC $8,783m
//     (notional $8,792m), STRF $1,328m, STRD $1,028m, STRE €612m = ~$685m at the page's $/€ rate.
//   SATS: 424B5 (15 Oct 2026) 7,000,000 shares sold at $90 = $630m (stated amount $100 = $700m).
//   SATA: Strive 8-K (13 Oct 2026, data as of 9 Oct): 14,030,176 SATA shares x $100 = $1,403m notional,
//     x $98.79 = $1,386m; common = 110,387,204 (Class A + B) x $27.59 = $3,046m.
//   BMNP: 3,500,000 shares ($80 IPO, 10-Q subsequent events) x $100 par, last close $99.53 (12 Oct
//     press release) = $348m. No later issuance found. BMNR: 603,226,394 shares as of 9 Jul 2026
//     (10-Q cover) less 20.8m bought back 14 Jul-17 Aug (weekly 8-Ks: 5.5+6.1+4.5+3.0+1.7m, $4bn
//     programme) = ~582.4m, x $23.49 = ~$13.68bn. ESTIMATE: any ATM issuance since is unknown (no share
//     count in the weekly 8-Ks) — replace with the next 10-K/10-Q count.
//   CHAD: 1,375,000 IPO shares + 206,250 over-allotment (8-K 21 Sep) = 1,581,250 x $9.79 = $15.5m. A
//     $300m ATM was set up 11 Sep but no sales are disclosed, so none counted. DFDV common: Yahoo
//     32.62m shares x $4.24 = $138m (10-Q cover had 30.998m at 13 Aug; Yahoo's is newer).
//   MORE: shares sold to investors x live price (counts.swc.preferred.sold = 111,112 IPO shares + Tennyson ATM sales, picked up from the Thursday RNS by scripts/capitalCounts.mjs — like Strategy's pyramid, unsold ATM capacity is not counted); the other 100,000 shares sit with Tennyson
//     for an ATM, not counted until sold. SWC: 378,240,705 shares on admission (RNS) x 53.47p = £202m.
//   CHAD debt ~$215.8m (30 Jun 2026 prospectus); MORE debt ~£16m drawn (15 Oct 2026 RNS; £20.8m at the 29 Sep 2026 prospectus, ~£19m then ~£17m after 5 Oct).
// Rates per Strategy's 8-K ATM tables: STRF 10%, STRK 8%, STRD 10%.

export const CAPITAL_STACKS = {
  STRC: {
    currency: '$',
    caption: 'Strategy Inc capital structure · Source: SEC filings',
    rows: [
      { id: 'DEBT', label: 'Convertible Senior Notes', kind: 'debt', tag: 'DEBT', mcap: 6714, sub: '~$6.7B outstanding · Fixed maturity · Paid first in all scenarios' },
      { id: 'STRF', live: { shares: 'counts:strategy.counts.STRF', price: 'STRF' }, label: 'STRF', kind: 'pref', tag: 'PREFERRED', mcap: 1328, sub: '10% fixed rate · Quarterly payments · Most senior preferred' },
      { id: 'STRC', live: { shares: 'counts:strategy.counts.STRC', price: 'STRC' }, label: 'STRC', kind: 'pref', tag: 'PREFERRED', mcap: 8783, sub: '12.00% variable rate · Semi-monthly payments · Second most senior preferred', highlight: true },
      { id: 'STRE', live: { shares: 'counts:strategy.counts.STRE', price: 'STRE@1.119' }, label: 'STRE', kind: 'pref', tag: 'PREFERRED', mcap: 685, sub: '10% fixed rate · Quarterly EUR payments · EEA professional investors only' },
      { id: 'STRK', live: { shares: 'counts:strategy.counts.STRK', price: 'STRK' }, label: 'STRK', kind: 'pref', tag: 'PREFERRED', mcap: 1060, sub: '8% fixed rate · Convertible into MSTR common stock' },
      { id: 'STRD', live: { shares: 'counts:strategy.counts.STRD', price: 'STRD' }, label: 'STRD', kind: 'pref', tag: 'PREFERRED', mcap: 1028, sub: '10% fixed rate · Most junior preferred · Trades below par' },
      { id: 'MSTR', live: { shares: 'counts:strategy.counts.MSTR', price: 'eq:MSTR' }, label: 'MSTR Common Stock', kind: 'common', tag: 'COMMON EQUITY', mcap: 64250, sub: 'Absorbs losses first · No dividend priority · Uncapped upside' },
    ],
  },
  SATA: {
    currency: '$',
    caption: "SATA in Strive's capital structure",
    rows: [
      { id: 'DEBT', label: 'No Debt', kind: 'none', tag: 'DEBT FREE', mcap: 0, sub: 'All legacy debt retired Q1 2026 · Zero existing indebtedness · Debt-free by policy' },
      { id: 'SATA', live: { shares: 'counts:strive.SATA', price: 'SATA' }, label: 'SATA', kind: 'pref', tag: 'PREFERRED', mcap: 1386, sub: '13% variable rate · Daily payments · Senior to SATS · Most senior security outstanding', highlight: true },
      { id: 'SATS', live: { shares: 'value:7000000', price: 'SATS' }, label: 'SATS', kind: 'pref', tag: 'PREFERRED', mcap: 630, sub: '15% fixed rate · Daily payments · Cumulative · Junior to SATA · $630m raised at $90 (15 Oct 2026)' },
      { id: 'ASST', live: { shares: 'counts:strive.commonEffective', price: 'eq:ASST' }, label: 'ASST Common Stock', kind: 'common', tag: 'COMMON EQUITY', mcap: 3046, sub: 'Absorbs losses first · No dividend priority · Uncapped upside from Bitcoin appreciation' },
    ],
  },
  // SATS priced its IPO on 15 Oct 2026: 7,000,000 shares at $90 = $630m. Until it trades its row uses that issue price (the
  // live price lookup fails while it is pre-listing, so resolveRow falls back to mcap); once listed it uses the live price.
  SATS: {
    currency: '$',
    caption: "SATS in Strive's capital structure · Source: Strive 424B5 (15 October 2026) · SATS shown at its $90 IPO price until it trades",
    rows: [
      { id: 'DEBT', label: 'No Debt', kind: 'none', tag: 'DEBT FREE', mcap: 0, sub: 'All legacy debt retired Q1 2026 · Zero existing indebtedness · Debt-free by policy' },
      { id: 'SATA', live: { shares: 'counts:strive.SATA', price: 'SATA' }, label: 'SATA', kind: 'pref', tag: 'PREFERRED', mcap: 1386, sub: '13% variable rate · Daily payments · Senior to SATS' },
      { id: 'SATS', live: { shares: 'value:7000000', price: 'SATS' }, label: 'SATS', kind: 'pref', tag: 'PREFERRED', mcap: 630, sub: '15% fixed rate · Daily payments · Cumulative · Junior to SATA · $630m raised at $90', highlight: true },
      { id: 'ASST', live: { shares: 'counts:strive.commonEffective', price: 'eq:ASST' }, label: 'ASST Common Stock', kind: 'common', tag: 'COMMON EQUITY', mcap: 3046, sub: 'Absorbs losses first · No dividend priority · Uncapped upside from Bitcoin appreciation' },
    ],
  },
  BMNP: {
    currency: '$',
    caption: "BMNP in Bitmine's capital structure · Source: Bitmine 424B5 (5 June 2026) and 10-Q (quarter to 31 May 2026)",
    rows: [
      { id: 'DEBT', label: 'No borrowings', kind: 'none', tag: 'NO DEBT', mcap: 0, sub: 'No notes, loans or convertibles on the balance sheet at 31 May 2026 · ~$30m total liabilities · future debt would rank ahead' },
      { id: 'BMNP', live: { shares: 'value:3500000', price: 'BMNP' }, label: 'BMNP', kind: 'pref', tag: 'PREFERRED', mcap: 348, sub: '9.50% fixed · Weekly · Cumulative · Redeemable at 110% → 105% → 100% of $100', highlight: true },
      { id: 'BMNR', live: { shares: 'value:582400000', price: 'eq:BMNR' }, label: 'BMNR Common Stock', kind: 'common', tag: 'COMMON EQUITY', mcap: 13680, sub: 'Absorbs losses first · No dividend priority · Cannot be paid while BMNP arrears exist' },
    ],
  },
  CHAD: {
    currency: '$',
    caption: "CHAD in DeFi Development Corp.'s capital structure · Source: CHAD prospectus and 10-Q, balances at 30 June 2026",
    rows: [
      { id: 'DEBT', label: 'Debt · ~$216m outstanding', kind: 'debt', tag: 'DEBT', mcap: 216, sub: 'Convertible notes (2030) · Borrowing against pledged digital assets · Paid before any CHAD dividend or liquidation claim' },
      { id: 'CHAD', live: { shares: 'value:1581250', price: 'CHAD' }, label: 'CHAD', kind: 'pref', tag: 'PREFERRED', mcap: 15.5, sub: '13% variable · Daily · Cumulative · $10 stated value · $11 redemption option', highlight: true },
      { id: 'DFDV', live: { shares: 'value:32620790', price: 'eq:DFDV' }, label: 'DFDV Common Stock', kind: 'common', tag: 'COMMON EQUITY', mcap: 138, sub: 'Absorbs losses first · No dividend priority · Uncapped SOL upside' },
    ],
  },
  MORE: {
    currency: '£',
    caption: "MORE in The Smarter Web Company's capital structure · Source: MORE prospectus (29 Sep 2026); debt per the 15 Oct 2026 RNS",
    rows: [
      { id: 'DEBT', label: 'Debt · Coinbase credit facility', kind: 'debt', tag: 'DEBT', mcap: 16, sub: 'About £16m drawn after the 15 Oct 2026 RNS (£20.8m at the prospectus) · Secured against bitcoin · Repaid before any MORE dividend or liquidation claim' },
      { id: 'MORE', live: { shares: 'counts:swc.preferred.sold', price: 'MORE' }, label: 'MORE', kind: 'pref', tag: 'PREFERRED', mcap: 11.1, sub: '12% initial, variable (20% cap) · Weekly · Cumulative · £100 reference value · Redeemable at £110 · No vote · Counts shares sold to investors: the 100,000 Tennyson holds for sale are added as they sell', highlight: true },
      { id: 'SWC', live: { shares: 'counts:swc.ordinary.shares', price: 'eq:SWC.L' }, label: 'SWC Ordinary Shares', kind: 'common', tag: 'COMMON EQUITY', mcap: 202, sub: 'Absorbs losses first · No dividend priority · Uncapped bitcoin upside' },
    ],
  },
};
