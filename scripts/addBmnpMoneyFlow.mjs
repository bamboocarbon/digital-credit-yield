// One-off: add BMNP's IPO capital raise to the live money-flow Blob, preserving
// existing STRC/SATA weekly data and rebuilding the cumulative series.
// Run: node --env-file=.env.local scripts/addBmnpMoneyFlow.mjs
import { getMoneyFlowData, saveMoneyFlowData, buildCumulative, SEED_BMNP_WEEKLY } from '../lib/moneyFlowStore.js';

const data = await getMoneyFlowData();
if (!data) {
  console.error('No existing money-flow Blob found. Run seedMoneyFlow.mjs first.');
  process.exit(1);
}

const strcWeekly = data.strcWeekly || [];
const sataWeekly = data.sataWeekly || [];
const bmnpWeekly = SEED_BMNP_WEEKLY;
const cumulative = buildCumulative(strcWeekly, sataWeekly, bmnpWeekly);

await saveMoneyFlowData({ strcWeekly, sataWeekly, bmnpWeekly, cumulative });
console.log(`Saved. bmnpWeekly = ${JSON.stringify(bmnpWeekly)}`);
console.log(`Cumulative rows: ${cumulative.length}; last: ${JSON.stringify(cumulative[cumulative.length - 1])}`);
