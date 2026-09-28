@AGENTS.md

## DCY Regulatory & News Scan — end-of-run notification
At the end of each scheduled run, after committing any file changes from Steps 6-9
(lib/yieldRateHistory.js, lib/pendingRateChanges.js, lib/constants.js,
data/dividends-*.json) to this session's branch, send a push notification and written
report summarizing what changed, and explicitly ask Robin whether to push those changes
to main so the site goes live. Do not push to main without that explicit go-ahead on
each run — commit and push to the session's own branch, then ask.

## AdSense ad units (T10)
GoogleAd component uses placeholder slot strings ("home-banner", "strc-hub", etc.) not numeric AdSense IDs.
Decision pending: either (a) switch to Auto ads and remove the manual <ins> render path, or (b) create real
ad units in the AdSense dashboard post-approval and map slot names to numeric IDs in a constants object.
No code change until decision is made.
