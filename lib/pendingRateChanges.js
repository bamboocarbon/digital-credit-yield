// Rate changes that have been announced but are not yet effective.
// The daily rate-check routine fills these in the moment it finds an announcement
// (alongside a forward-dated entry in yieldRateHistory.js), and clears them back to
// null once `effectiveFrom` arrives — by then ASSET_RATES already reflects the new
// rate on its own, since it's computed from yieldRateHistory.js at build time.
export const PENDING_RATE_CHANGES = {
  STRC: null,
  SATA: null,
  BMNP: null,
  CHAD: { newRate: 14.00, effectiveFrom: '2026-11-02', announcedDate: '2026-10-15', source: 'https://www.manilatimes.net/2026/10/15/tmt-newswire/globenewswire/defi-development-corp-increases-chad-annual-dividend-rate-to-14/2446557' },
  MORE: null,
  // Shape when set: { newRate: Number, effectiveFrom: 'YYYY-MM-DD', announcedDate: 'YYYY-MM-DD', source: 'URL' }
};
