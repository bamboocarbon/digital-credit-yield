// One-off: replace the pre-June SATA weekly entries in the stored money-flow blob with the
// corrected SEED_SATA_WEEKLY (see lib/moneyFlowStore.js), keep everything from 1 Jun 2026 on
// (written by the cron from Strive's 8-Ks), and rebuild the cumulative series.
// Dry run by default; pass --apply to write the blob.
//   node --env-file=.env.local scripts/patch-sata-moneyflow.mjs [--apply]
import {
  getMoneyFlowData, saveMoneyFlowData, buildCumulative, SEED_SATA_WEEKLY, mergeMoreWeekly,
} from '../lib/moneyFlowStore.js';

const CUTOFF = '2026-05-25';
const apply = process.argv.includes('--apply');

const data = await getMoneyFlowData();
if (!data) throw new Error('Could not read the money-flow blob');

const before = data.sataWeekly.reduce((a, d) => a + d.value, 0);
const kept = data.sataWeekly.filter(d => d.date > CUTOFF);
const sataWeekly = [...SEED_SATA_WEEKLY, ...kept].sort((a, b) => a.date.localeCompare(b.date));
const after = sataWeekly.reduce((a, d) => a + d.value, 0);

const moreWeekly = mergeMoreWeekly ? mergeMoreWeekly(data.moreWeekly ?? []) : data.moreWeekly ?? [];
const cumulative = buildCumulative(data.strcWeekly, sataWeekly, data.bmnpWeekly ?? [], data.chadWeekly ?? [], moreWeekly);

console.log(`SATA total: ${before.toFixed(1)} -> ${after.toFixed(1)} ($M); rows ${data.sataWeekly.length} -> ${sataWeekly.length}`);
console.log('Latest cumulative:', JSON.stringify(cumulative.at(-1)));

if (apply) {
  await saveMoneyFlowData({ ...data, sataWeekly, moreWeekly, cumulative });
  console.log('Blob written.');
} else {
  console.log('Dry run — pass --apply to write.');
}
