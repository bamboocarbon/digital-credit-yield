@AGENTS.md

## DCY Regulatory & News Scan — end-of-run notification
At the end of each scheduled run, after committing any file changes from Steps 6-9
(lib/yieldRateHistory.js, lib/pendingRateChanges.js, lib/constants.js,
data/dividends-*.json) to this session's branch, send a push notification and written
report summarizing what changed, and explicitly ask Robin whether to push those changes
to main so the site goes live. Do not push to main without that explicit go-ahead on
each run — commit and push to the session's own branch, then ask.

## DCY Regulatory & News Scan — Step 0 feed staleness self-heal
The scan-feed GitHub Action (.github/workflows/scan-feed.yml) is a *scheduled* cron job, not something
this session's "git pull" can force to re-run — confirmed 2026-10-15, when both its 13:00 and 13:05 UTC
schedules silently failed to fire (GitHub dropped them; the workflow's Actions history showed zero
schedule-triggered runs, only the two manual workflow_dispatch runs from its 2026-10-14 setup), leaving
data/scan-feed/ a full day stale and missing that morning's SWC bitcoin-purchase RNS entirely.
If, after `git pull`, data/scan-feed/meta.json's `generatedAt` is not from earlier today (UTC) — don't just
flag it and fall back to WebSearch. First try to self-heal: call the GitHub MCP tool
`mcp__github__actions_run_trigger` with `method: 'run_workflow'`, `workflow_id: 'scan-feed.yml'`,
`ref: 'main'` to kick it off directly (this requires the GitHub MCP server/repo access this session
already has for PR work). Wait a short while, `git pull` again, and re-read the feed files. Only fall
back to pure WebSearch for whatever's still missing after that, and say explicitly in the report that
the scheduled feed had to be triggered by hand. The workflow now runs 4 backup schedules across the
13:00-13:08 UTC window instead of 2, which should make full silent drops rarer going forward, but isn't
a substitute for this check.

## AdSense ad units (T10)
GoogleAd component uses placeholder slot strings ("home-banner", "strc-hub", etc.) not numeric AdSense IDs.
Decision pending: either (a) switch to Auto ads and remove the manual <ins> render path, or (b) create real
ad units in the AdSense dashboard post-approval and map slot names to numeric IDs in a constants object.
No code change until decision is made.
