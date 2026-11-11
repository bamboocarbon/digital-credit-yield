// Cloudflare Web Analytics (RUM) data via the GraphQL Analytics API — for the daily analytics report.
//
// Needs two env vars on the server: CF_API_TOKEN (a token with Account > Account Analytics > Read — nothing
// else) and CF_ACCOUNT_ID. Each site also needs a Web Analytics "site tag" (the token in its beacon snippet).
// Everything here is read-only; callers treat failures as "no Cloudflare data" and carry on.
//
// RUM counts real browsers that ran Cloudflare's beacon: `count` = page views, `sum.visits` = visits
// (sessions), so bots that never run JavaScript aren't included.

const ENDPOINT = 'https://api.cloudflare.com/client/v4/graphql';

// Tolerate the usual paste slips in a Cloud Run variable: surrounding whitespace/newlines, quotes, and a leading
// `NAME=` copied along with the value (Cloudflare tokens and account IDs never contain '=').
function clean(v) {
  const raw = String(v ?? '').trim();
  // Cloudflare's "token created" page shows a sample `curl ... -H "Authorization: Bearer <token>"` command; if that
  // whole command was pasted, the token is the part after "Bearer ".
  const bearer = raw.match(/Bearer\s+([A-Za-z0-9_-]{20,})/);
  if (bearer) return bearer[1];
  return raw.replace(/^["']|["']$/g, '').replace(/^[A-Za-z_]+=/, '').trim();
}
const token = () => clean(process.env.CF_API_TOKEN);
const accountId = () => clean(process.env.CF_ACCOUNT_ID);

export function cloudflareConfigured() {
  return Boolean(token() && accountId());
}

/** Safe self-check for the report summary: shape of the credentials (never the values) + Cloudflare's own verdict. */
export async function diagnoseCloudflare() {
  const t = token();
  const info = {
    tokenLength: t.length,
    tokenShapeOk: /^[A-Za-z0-9_-]{30,60}$/.test(t),
    rawHadWhitespaceOrPrefix: clean(process.env.CF_API_TOKEN) !== String(process.env.CF_API_TOKEN ?? ''),
    accountIdOk: /^[0-9a-f]{32}$/.test(accountId()),
  };
  try {
    const res = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', { headers: { Authorization: `Bearer ${t}` } });
    const json = await res.json().catch(() => ({}));
    info.verify = { httpStatus: res.status, success: json.success ?? null, status: json.result?.status ?? null, message: json.errors?.[0]?.message ?? json.messages?.[0]?.message ?? null };
  } catch (err) {
    info.verify = { error: err.message };
  }
  return info;
}

async function gql(query, variables) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { acc: accountId(), ...variables } }),
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
