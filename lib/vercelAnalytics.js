// Queries Vercel's real Web Analytics data via the same REST endpoint the
// `vercel metrics` CLI command uses (POST /v2/observability/query) — found
// by running that CLI with --debug and reading the underlying HTTP calls,
// then confirmed to accept a plain personal access token (not tied to a CLI
// login session). Needs VERCEL_API_TOKEN (Account Settings → Tokens) and
// VERCEL_TEAM_ID as env vars. See project_pageview_counter_pattern memory
// (2026-09-03) for the full request-shape discovery.

const TEAM_ID = process.env.VERCEL_TEAM_ID;
const TOKEN = process.env.VERCEL_API_TOKEN;

async function queryObservability(body) {
  if (!TEAM_ID || !TOKEN) throw new Error('Missing VERCEL_TEAM_ID or VERCEL_API_TOKEN');
  const res = await fetch(`https://api.vercel.com/v2/observability/query?teamId=${TEAM_ID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Vercel observability query failed: ${JSON.stringify(json)}`);
  return json;
}

/**
 * Sum of pageviews AND unique visitors for one project over [start, end).
 * "unique/visitor_id" is the closest thing Vercel has to "number of people" —
 * our own counter is deliberately cookie-free and can't distinguish people,
 * only raw hits, so this is the actual comparison point Robin asked for.
 */
export async function getVercelTotals(projectId, start, end) {
  const base = {
    groupBy: [],
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    granularity: { hours: 24 },
    scope: { type: 'project', ownerId: TEAM_ID, projectIds: [projectId] },
  };
  const [pv, uniq] = await Promise.all([
    queryObservability({ ...base, metric: 'vercel.analytics_pageview.count', aggregation: 'sum' }),
    queryObservability({ ...base, metric: 'vercel.analytics_pageview.count', aggregation: 'unique/visitor_id' }),
  ]);
  const pageviews = pv.summary?.[0]?.vercel_analytics_pageview_count_sum ?? 0;
  const people = uniq.summary?.[0]?.vercel_analytics_pageview_count_unique_visitor_id ?? 0;
  return { pageviews, people };
}

/** Top pages by pageview count for one project over [start, end). */
export async function getVercelTopPages(projectId, start, end, limit = 10) {
  const json = await queryObservability({
    metric: 'vercel.analytics_pageview.count',
    aggregation: 'sum',
    groupBy: ['request_path'],
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    granularity: { hours: 24 },
    limit,
    scope: { type: 'project', ownerId: TEAM_ID, projectIds: [projectId] },
  });
  return (json.summary || [])
    .map((row) => ({ path: row.request_path, count: row.vercel_analytics_pageview_count_sum }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
