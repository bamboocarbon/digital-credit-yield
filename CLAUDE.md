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

## DCY Regulatory & News Scan — Strategy daily dividends (APPROVED 28 Oct 2026)
This section SUPERSEDES the routine prompt's Step 11 items 2-3 ("vote pending / do NOT change…", "$100 × rate ÷ 24",
"quarterly" and the `{ date, amount }`-only file format) for STRC/STRF/STRK/STRD.
Stockholders approved calendar-day dividends (8-K 28 Oct 2026, preliminary results, subject to the amended
certificates being filed). STRC: record dates every calendar day from 1 Nov 2026. STRF/STRK/STRD: from 1 Jan 2027
(quarterly until their 31 Dec 2026 payment; first daily payment expected 4 Jan 2027). STRE is NOT included.
Each daily dividend is paid on the next business day; weekend/holiday record dates are paid together on the Monday/next business day.

- **The site already switches by date** (`lib/constants.js` `DAILY_START` + clock-gated `PAYMENT_FREQUENCY`). Do NOT edit
  `PAYMENT_FREQUENCY`, `DAILY_START`, the hub banner or page copy yourself — report anything that looks wrong.
- **Check the amended STRC certificate was filed + effective (30 Oct – 1 Nov 2026).** Strategy's 15 Oct 8-K says the
  November daily dividends are payable ONLY if the Second A&R STRC certificate of designations is filed and effective by
  12:01am ET on 1 Nov 2026; if so the 31 Oct semi-monthly dividend (payable 15 Nov) is NOT paid. Look for the 8-K
  (Items 3.03/5.03) in the feed. If it is missing or says otherwise by 1 Nov, send an URGENT push notification:
  the site then needs the 31 Oct row ($0.50) restored in `data/dividends-STRC.json` and the November daily rows removed.
  When it is confirmed, say so once in the report.
- **STRC daily rows are hand-kept** in `data/dividends-STRC.json` (the live API no longer merges Yahoo for STRC from
  31 Oct 2026). Format per row: `{ "date": "<RECORD date>", "amount": <declared cents amount>, "payDate": "<payment date>" }`,
  sorted by date, one row per calendar day. **Never strip `payDate`** when overwriting from the API or editing the file.
  Strategy declares each month's table in an 8-K around the 15th of the month before (November's came 15 Oct 2026;
  its "Record Date / Payment Date / Cash Dividend Per Share" table is in the feed's 8-K text). When a new month's
  table appears and its rows are missing from the file, add ALL of them exactly as declared (whole-cent amounts; the
  month should sum to about $100 × rate ÷ 12 — November 2026 sums to exactly $1.00 at 12%). Never interpolate or guess a
  month that has not been declared. This is time-sensitive (payments start on the 2nd of the month and the page shows
  no daily banner without rows): flag it prominently in the push notification and the report, and ask Robin for the
  go-ahead to push to main (same commit rule as the other steps: session branch first, ask before main).
- **STRF/STRK/STRD:** keep adding the quarterly rows (`{ date, amount }`) until the 31 Dec 2026 payment. Expect their
  first daily table in an 8-K around mid-December 2026 (records 1 Jan 2027 onward). Add it in the same
  `{ date (record), amount, payDate }` format, flagged the same way. `data/dividends-STRK|STRF|STRD.json` are hand-kept
  by the site's API route already.
