@AGENTS.md

## AdSense ad units (T10)
GoogleAd component uses placeholder slot strings ("home-banner", "strc-hub", etc.) not numeric AdSense IDs.
Decision pending: either (a) switch to Auto ads and remove the manual <ins> render path, or (b) create real
ad units in the AdSense dashboard post-approval and map slot names to numeric IDs in a constants object.
No code change until decision is made.
