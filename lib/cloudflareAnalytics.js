// Cloudflare Web Analytics (RUM) data via the GraphQL Analytics API — for the daily analytics report.
//
// Needs two env vars on the server: CF_API_TOKEN (a token with Account > Account Analytics > Read — nothing
// else) and CF_ACCOUNT_ID. Each site also needs a Web Analytics "site tag" (the token in its beacon snippet).
// Everything here is read-only; callers treat failures as "no Cloudflare data" and carry on.
//
// RUM counts real browsers that ran Cloudflare's beacon: `count` = page views, `sum.visits` = visits
// (sessions), so bots that never run JavaScript aren't included.

const ENDPOINT = 'https://api.cloudflare.com/client/v4/graphql';

export function cloudflareConfigured() {
  return Boolean(process.env.CF_API_TOKEN && process.env.CF_ACCOUNT_ID);
}

async function gql(query, variables) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.CF_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { acc: process.env.CF_ACCOUNT_ID, ...variables } }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.errors?.length) {
    const msg = json.errors?.map((e) => e.message).join('; ') || `HTTP ${res.status}`;
    throw new Error(`Cloudflare analytics: ${msg}`);
  }
  return json.data?.viewer?.accounts?.[0] ?? {};
}

/** Page views and visits for one site over [start, end). */
export async function getCloudflareTotals(siteTag, start, end) {
  const acct = await gql(
    `query ($acc: string!, $site: string!, $start: Time!, $end: Time!) {
      viewer { accounts(filter: { accountTag: $acc }) {
        rumPageloadEventsAdaptiveGroups(
          filter: { siteTag: $site, datetime_geq: $start, datetime_lt: $end }, limit: 1) {
          count
          sum { visits }
        }
      } }
    }`,
    { site: siteTag, start: start.toISOString(), end: end.toISOString() }
  );
  const row = acct.rumPageloadEventsAdaptiveGroups?.[0];
  return { pageviews: row?.count ?? 0, visits: row?.sum?.visits ?? 0 };
}

/** Top pages by page views for one site over [start, end). */
export async function getCloudflareTopPages(siteTag, start, end, limit = 10) {
  const acct = await gql(
    `query ($acc: string!, $site: string!, $start: Time!, $end: Time!, $limit: Int!) {
      viewer { accounts(filter: { accountTag: $acc }) {
        rumPageloadEventsAdaptiveGroups(
          filter: { siteTag: $site, datetime_geq: $start, datetime_lt: $end },
          limit: $limit, orderBy: [count_DESC]) {
          count
          dimensions { requestPath }
        }
      } }
    }`,
    { site: siteTag, start: start.toISOString(), end: end.toISOString(), limit }
  );
  return (acct.rumPageloadEventsAdaptiveGroups ?? []).map((g) => ({ path: g.dimensions?.requestPath || '/', count: g.count }));
}
