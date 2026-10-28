// Prunes old Vercel deployments so Hobby Function Storage (10 GB) doesn't fill.
// Keeps the current production deployment + the newest KEEP_PRODUCTION production builds
// (rollback targets); deletes everything else older than MIN_AGE_HOURS. DRY_RUN=1 only logs.
const TOKEN = process.env.VERCEL_TOKEN;
const TEAM = process.env.VERCEL_TEAM_ID;
const PROJECT = process.env.VERCEL_PROJECT_ID;
const KEEP_PRODUCTION = Number(process.env.KEEP_PRODUCTION || 10);
const MIN_AGE_HOURS = Number(process.env.MIN_AGE_HOURS || 6);
const DRY_RUN = process.env.DRY_RUN === '1';

if (!TOKEN || !TEAM || !PROJECT) throw new Error('VERCEL_TOKEN, VERCEL_TEAM_ID and VERCEL_PROJECT_ID are required');

async function api(path, opts = {}) {
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`https://api.vercel.com${path}${sep}teamId=${TEAM}`, {
    ...opts,
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`${opts.method || 'GET'} ${path} -> ${res.status} ${await res.text()}`);
  return res.json();
}

const project = await api(`/v9/projects/${PROJECT}`);
const currentProdId = project.targets?.production?.id;
if (!currentProdId) throw new Error('Could not resolve current production deployment; refusing to prune');

const deployments = [];
let until;
for (;;) {
  const page = await api(`/v6/deployments?projectId=${PROJECT}&limit=100${until ? `&until=${until}` : ''}`);
  deployments.push(...page.deployments);
  if (!page.pagination?.next) break;
  until = page.pagination.next;
}
deployments.sort((a, b) => b.created - a.created);

const keep = new Set([currentProdId]);
deployments
  .filter((d) => d.target === 'production' && d.state === 'READY')
  .slice(0, KEEP_PRODUCTION)
  .forEach((d) => keep.add(d.uid));

const cutoff = Date.now() - MIN_AGE_HOURS * 3600 * 1000;
const inFlight = new Set(['BUILDING', 'QUEUED', 'INITIALIZING']);
const doomed = deployments.filter((d) => !keep.has(d.uid) && !inFlight.has(d.state) && d.created < cutoff);

console.log(`${deployments.length} deployments, keeping ${keep.size} production, deleting ${doomed.length}${DRY_RUN ? ' (dry run)' : ''}`);
let failed = 0;
for (const d of doomed) {
  if (DRY_RUN) { console.log(`would delete ${d.url}`); continue; }
  try {
    await api(`/v13/deployments/${d.uid}`, { method: 'DELETE' });
    console.log(`deleted ${d.url}`);
  } catch (e) {
    failed++;
    console.error(`FAILED ${d.url}: ${e.message}`);
  }
}
if (failed) process.exit(1);
