import { BMNP_ENABLED } from './constants';

// Brand colours — must stay in sync with Differentiator.js, insightEngine.js and generateMp4.js
// One colour per issuer: every Strategy ticker is STRC green, every Strive ticker is SATA blue.
export const TICKER_COLOUR = { STRC: '#4ade80', SATA: '#3b82f6', BMNP: '#fde047', CHAD: '#7f1d1d', MORE: '#a855f7', STRK: '#4ade80', STRF: '#4ade80', STRD: '#4ade80', STRE: '#4ade80', SATS: '#3b82f6' };
export const COMPANY = { STRC: 'Strategy', SATA: 'Strive', BMNP: 'Bitmine', CHAD: 'DeFi Development Corp.', MORE: 'The Smarter Web Company', STRK: 'Strategy', STRF: 'Strategy', STRD: 'Strategy', STRE: 'Strategy (EUR)', SATS: 'Strive' };

const ALL = ['STRC', 'SATA', 'BMNP', 'CHAD', 'MORE', 'STRK', 'STRF', 'STRD', 'STRE', 'SATS'];

// Visible tickers respect the BMNP feature flag.
export const SELECTABLE_TICKERS = ALL.filter(t => t !== 'BMNP' || BMNP_ENABLED);

// Issuers and the tickers they own, in display order. Tickers that aren't on the site yet
// (STRK, STRF, STRD, STRE, SATS) are listed so they appear automatically once added to ALL above.
export const ISSUERS = [
  { name: 'Strategy', tickers: ['STRC', 'STRK', 'STRF', 'STRD', 'STRE'] },
  { name: 'Strive', tickers: ['SATA', 'SATS'] },
  { name: 'Bitmine', tickers: ['BMNP'] },
  { name: 'DeFi Dev', tickers: ['CHAD'] },
  { name: 'Smarter Web', tickers: ['MORE'] },
]
  .map(i => ({ ...i, tickers: i.tickers.filter(t => SELECTABLE_TICKERS.includes(t)) }))
  .filter(i => i.tickers.length > 0);

// The tickers shown in a page's selector: only the siblings from the same issuer as `ticker`.
export function sameIssuerTickers(ticker) {
  return ISSUERS.find(i => i.tickers.includes(ticker))?.tickers ?? SELECTABLE_TICKERS;
}
