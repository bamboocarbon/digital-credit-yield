const STORAGE_KEY = (ticker) => `dcy_projector_${ticker.toLowerCase()}`;

export function saveProjectorState(ticker, state) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY(ticker), JSON.stringify(state));
}

export function loadProjectorState(ticker) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY(ticker));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const defaultProjectorState = {
  investmentAmount: 10000,
  numShares: 1000,
  pricePerShare: 100,
  inputMode: 'dollars',
  annualYield: 11.50,
  startDate: new Date().toISOString().split('T')[0],
  horizon: '5Y',
  reinvestmentPct: 100,
  monthlyContribution: 0,
};
