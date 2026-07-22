import { BMNP_ENABLED } from './constants';

// Brand colours — must stay in sync with Differentiator.js, insightEngine.js and generateMp4.js
export const TICKER_COLOUR = { STRC: '#4ade80', SATA: '#3b82f6', BMNP: '#fde047' };
export const COMPANY = { STRC: 'Strategy', SATA: 'Strive', BMNP: 'Bitmine' };

const ALL = ['STRC', 'SATA', 'BMNP'];

// Visible tickers respect the BMNP feature flag.
export const SELECTABLE_TICKERS = ALL.filter(t => t !== 'BMNP' || BMNP_ENABLED);
