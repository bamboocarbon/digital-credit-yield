# Adding a New Ticker to Digital Credit Yield

A runbook for the exact work done adding **CHAD** (DeFi Development Corp., Solana-backed) as
the site's 4th tracked instrument on 2026-09-25, written so the same job for the next 1–2
preferred-equity tickers goes faster and skips the mistakes made this time.

Follow it roughly top to bottom. Steps are grouped by what they touch, not strict order —
some (data layer, par-value sweep) block everything downstream, so do those first.

---

## 0. Research first — get these facts right before touching any code

Pull these from the issuer's own **SEC FWP / 424B5 pricing supplement** — not a news
article, not an AI web-search summary. One AI search summary during the CHAD build
confidently stated its par value was $100 when the primary filing said $10. Cross-check
any number that feeds a formula against the actual filing text.

- [ ] **Ticker symbol** and exchange (Nasdaq/NYSE)
- [ ] **Stated/liquidation value per share** — DO NOT assume $100. This was the single
      biggest surprise of the CHAD build and drove a large chunk of the total work (see
      §3). Confirm it explicitly.
- [ ] **Initial annual dividend rate** and how it's set (rules-based / discretionary /
      fixed) — and whether the issuer is *actually* following its own published mechanism
      right now, or quietly overriding it (Strategy has been holding STRC flat despite its
      own VWAP bands since July 2026 — don't just parrot the "how it's set" copy, check
      current behaviour).
- [ ] **Payment cadence** (monthly/semi-monthly/weekly/daily) and the first payment date —
      note if there's a stub/catch-up period before "regular" payments start.
- [ ] **Issuer name, ticker, CIK** (from `data.sec.gov`), and official domain.
- [ ] **What backs the dividend** — cash reserve, staking revenue, crypto holdings — and
      whether the issuer discloses this on a **regular cadence** (Bitmine's weekly ETH
      press release) or only **opportunistically**. This determines whether the regulatory
      scan should refresh it weekly or just "when a new figure surfaces."
- [ ] **IPO size/proceeds** for the money-flow seed.

---

## 1. Core data layer — do this first, everything else imports from it

All in `lib/`:

- [ ] `lib/constants.js`:
  - `FALLBACK_RATES` — add the ticker's initial rate
  - **`PAR_VALUE`** — add the real stated value (not a copy-paste of 100)
  - `VALID_TICKERS` — add the ticker
  - `PAYMENT_FREQUENCY` — label + `perYear` + `perPeriod`
  - `DIVIDEND_RESERVE` — label/display/note/source for the "what backs it" hub card
  - A `*_HOLDINGS`-style constant if the issuer discloses raw crypto holdings (mirror
    `STRATEGY_BTC_HOLDINGS`/`STRIVE_BTC_HOLDINGS`/`BITMINE_ETH_HOLDINGS`/`DFDV_SOL_HOLDINGS`)
    — single source of truth, don't hardcode the figure into multiple files independently
    (that's exactly how STRC's holdings figure went stale at 880k vs actual 846k).
- [ ] `lib/tickerDisplay.js`: `TICKER_COLOUR` (pick something visually distinct from every
  existing ticker AND every blog category colour — see §9 palette list) + `COMPANY`. `ALL`
  and `SELECTABLE_TICKERS` pick the new ticker up automatically once added to `ALL`.
- [ ] `lib/yieldRateHistory.js`: `YIELD_RATE_HISTORY[TICKER]` — first entry dated the
  IPO/closing date.
- [ ] `lib/edgarParser.js`: `COMPANIES[TICKER]` — CIK + search keywords.
- [ ] `lib/moneyFlowStore.js`: `SEED_TICKER_WEEKLY` (just the confirmed IPO raise is
  enough — the cron backfills real figures going forward), and thread the new param
  through `saveMoneyFlowData()` and `buildCumulative()`.
- [ ] `lib/pendingRateChanges.js`: add `TICKER: null`.
- [ ] Only add a feature-flag (`TICKER_ENABLED` env var, `app/ticker/layout.js` redirect
  gate) if the ticker **isn't trading yet**. If it's already live, skip the flag entirely —
  BMNP needed one because it launched mid-build; CHAD didn't need one and it was simpler
  for it.

---

## 2. New route + redirects

- [ ] `app/ticker/page.js` — copy an existing one (e.g. `app/bmnp/page.js`) almost
  verbatim: metadata (title/description/OG images using `/api/og`), JSON-LD, `<AssetHub
  ticker="TICKER" name="..." />`.
- [ ] **`next.config.mjs`** `TOOL_REDIRECTS` — add the new ticker's lowercase symbol to the
  array at the top. This is what makes `/ticker/projector`, `/ticker/chart`,
  `/ticker/dividends`, `/ticker/vs-treasuries` (old-style per-ticker links used in
  emails/articles) redirect to the real consolidated tool pages. Easy to forget since
  nothing breaks visibly in dev if you miss it — old links just 404 in production.

---

## 3. The par-value sweep — only needed if the new ticker's stated value ≠ $100

If it *is* $100, skip this whole section. If it isn't (like CHAD's $10), the codebase has
a pervasive numeric coincidence baked in: `ASSET_RATES[ticker]` (the raw rate number, e.g.
`13.00`) gets used directly as if it *were* the $/share/year figure, because for a $100-par
stock, `rate% × $100 / 100 == rate` — the multiplication by par and division by 100 cancel
out to a no-op. The moment par isn't 100, every place doing this silently produces a wrong
number (often exactly 10x off for a $10 par).

Grep for `ASSET_RATES[ticker]` and `ASSET_RATES.TICKER` sitewide and check whether each
usage is (a) a **% display** (fine, leave it) or (b) a **$ amount** (multiply by
`PAR_VALUE[ticker] / 100`). Known offenders found during the CHAD build, in the order they
were actually caught (some only surfaced days later when a user spotted a wrong number on
screen — code review alone didn't catch all of them):

- [ ] `components/AssetCard.js` — effective yield calc (`(ASSET_RATES[ticker] / price) * 100`)
- [ ] `components/AssetHubLive.js` — `annualDividendDollars`, effective yield, per-payment $
- [ ] `components/EffectiveYieldChart.js` — **the /chart page's upper chart line** — this
  one wasn't caught until a user reported CHAD's effective yield reading ~144% instead of
  ~14.4%. Check this one specifically and early.
- [ ] `components/GrowthProjector.js` / `components/Differentiator.js` — shares-mode input:
  `pricePerShare` default, effective-yield formula, the "is this above/below par" `100`
  comparisons scattered through the JSX. Also reset `pricePerShare` to the new ticker's own
  par when the stock selector switches tickers with no saved state (otherwise it silently
  carries over the *previous* ticker's par as a stale default).
- [ ] `components/DividendInteractive.js` — `impliedAnnual` was being used as **both** a %
  display value and a $ amount in different lines. Split into `impliedAnnual` (%, for
  display) and `impliedAnnualDollars` (par-scaled, for `incomeAnnual`/
  `expectedMonthlyTotal`). Also the next-payment `fixedAmount` prediction formula.
- [ ] `scripts/insightEngine.js` — `effYield()` function
- [ ] `scripts/dailyEmail.js` — the snapshot-cell effective yield calc

**How to find the rest**: `grep -rn "ASSET_RATES\[" --include="*.js" .` and read every
hit's surrounding context — is the result being displayed with a `%` suffix, or is it
being multiplied by a share count / compared against a dollar price? The latter needs the
par fix.

---

## 4. Dividend data pipeline

- [ ] `data/dividends-TICKER.json` — seed with whatever's actually confirmed (even just one
  forward-dated stub entry is fine; the existing "Announced, Not Yet Paid" UI handles a
  future-dated entry automatically, no extra code needed).
- [ ] `app/api/dividends/[ticker]/route.js` — add the ticker to the Yahoo-skip condition
  (`upper === 'BMNP' || upper === 'CHAD'` style) **if** it's a newly-listed,
  non-standard-cadence security — Yahoo's dividend feed has been unreliable for every one
  of these so far. If it's genuinely well-covered by Yahoo, skip this.
- [ ] `components/DividendHistoryPage.js` — add an `isTICKERComingSoon` banner (mirror the
  existing STRC/SATA/BMNP ones) explaining the gap before the first payment. If the ticker
  pays **daily** (like SATA/CHAD): also exclude it from the flat `allTableData` array
  (`ticker === 'TICKER' ? [] : dividends`) — otherwise every single daily payment becomes
  its own row and the table grows to ~250 rows/year.
- [ ] `components/DividendInteractive.js` — if daily-cadence, add a monthly-grouped summary
  table (mirror the block added for CHAD, *not* SATA's — SATA's version depends on a
  published business-days-per-month table the new issuer almost certainly won't have; the
  CHAD version just groups real recorded payments by month, no formula needed).
- [ ] Don't build a bespoke `TICKER_DIVIDEND_SCHEDULE` constant (BMNP-style) unless the
  ticker's cadence genuinely needs it (BMNP is weekly with irregular stub payments and
  needed one; CHAD's daily cadence flowed fine through the generic path with zero extra
  scheduling code).

---

## 5. Shared listing surfaces (grep is your friend here)

Run `grep -rln "BMNP" --include="*.js" . | grep -v node_modules` (swap in whichever
existing 3-letter ticker is most similar to the new one) — it will surface **every** file
that needs the new ticker added in parallel. Cross off against this list as you go so
nothing's missed:

- [ ] `components/CompareTable.js` — full row set (issuer, par value, rate, frequency,
  per-payment $, rate-setting mechanism, what backs it, capital structure position)
- [ ] `components/AssetCard.js` (homepage) — description blurb (keep it roughly the same
  **length** as the other three — a noticeably longer one throws off cross-card
  alignment, see §9), income badge label
- [ ] `components/AssetHub.js` — `TOOLS` array + `DESCRIPTIONS` prose block (3-4 paragraphs
  mirroring the existing tickers' style + a closing personal-voice line)
- [ ] `components/Navbar.js`, `app/not-found.js`, `app/sitemap.js`
- [ ] `app/faq/page.js`, `app/glossary/page.js`, `app/risks/page.js`, `app/about/page.js`,
  `app/contact/page.js`, `app/privacy-policy/page.js`, `app/terms/page.js`,
  `app/layout.js`, `app/page.js`, `app/quiz/page.js`, `app/thought-of-the-day/page.js`,
  `app/chart/page.js`, `app/dividends/page.js`, `app/projector/page.js`,
  `app/vs-treasuries/page.js` — copy/metadata mentioning the other tickers by name
- [ ] `app/api/og/route.js` — check the **fallback** tagline too (shown on any page that
  doesn't pass its own `rate` param), not just per-page metadata — this one was found
  stale (still said "STRC and SATA" with BMNP long since live) only when specifically asked
  about "the X card."
- [ ] Money-flow page (`app/money-flow/page.js`, `components/MoneyFlowChart.js` — new
  colour consts + exported chart component, `components/CumulativeFlowChart.js` — legend
  entry + `<Line>` for both linear and log charts (remove per-point `dot` markers, match
  the other tickers' `dot={false}`), `components/MoneyFlowStats.js` — new stat card,
  `app/api/cron/money-flow/route.js`, `app/api/money-flow-data/route.js`) — plus a new
  narrative "Zone" paragraph in the page's story section.
- [ ] `components/BlogIndex.js` — add the ticker to the filter-button category list
  **even before any article exists** for it (union it into `allCats` manually rather than
  waiting for a real article to surface it), with an empty-state message for zero-match
  filters generally.
- [ ] **Do NOT retroactively edit existing dated blog articles** to mention the new ticker
  — they're accurate as of their own publish date. Only touch evergreen (undated) content.
  Writing new articles for the new ticker is Robin's content call, not an implementation
  task — mention it's available but don't just write one unprompted.

---

## 6. Scripts, emails, and the daily video

- [ ] `scripts/insightEngine.js` — `TICKERS` array, `COLOR` map, `getDailyTicker()` (now
  cycles N tickers, `% N`), `generateDailyInsight()`'s `Promise.all` quote/next-date fetch.
- [ ] `scripts/dailyEmail.js` — `TICKER_COLOUR`, `BLOG_CATEGORY_COLOUR`, the snapshot-row
  `<td width="...">` percentage (recalculate for however many tickers now — was 33% for 3,
  25% for 4), `displayTickers`, the title banner text, rates fallback object.
- [ ] `scripts/eveningEmail.js` ("last email of the day") — a full `QUESTIONS_BY_TICKER`
  block (6-ish income/yield questions mirroring the existing ones), a `TICKER_RATE` const,
  the banner text. **This one is easy to forget** since `getDailyTicker(1)` will silently
  try to index into a ticker with no question block and crash the moment the rotation
  lands on it — add the block in the same commit that widens `getDailyTicker`'s cycle,
  don't defer it.
- [ ] `scripts/motivationEmail.js` — banner text only (no per-ticker content to add).
- [ ] **The rocket video** (`scripts/generateMp4.js` +
  `scripts/daily-email-v2-rocket-race/renderVerticalRaceFrame.mjs` +
  `buildPreview.mjs`): this is real canvas-rendering code, not something a build/typecheck
  catches — see §9 for how to actually test it before shipping.
  - `TICKER_COLOUR` in the renderer
  - Widen the snapshot-strip column math from N to N+1 tickers (adjust `gap`/font sizes
    down slightly so text doesn't crowd a narrower cell)
  - Give the new ticker its **own** lane position in `LANE_POSITION`/equivalent, matching
    its snapshot-strip column — don't just fall back it into an existing ticker's lane
    position "to avoid a crash." A user will notice the bar isn't under its own column.
  - This means the lanes array can now have an empty (`null`) slot on days a ticker other
    than the last-added one races (only 3 bars — featured + 2 benchmarks — across N
    possible positions). Every place that does `lanes.forEach`/`.map`/`.find`/`.filter`
    needs a null-guard (`if (!lane) return`, `.filter(Boolean)`, `l?.key`). This bit
    **the actual production script** (`generateMp4.js`), not just the preview tool — check
    all three files, not just the one you're actively editing.

---

## 7. The regulatory-scan routine (external, not in this repo)

This is a claude.ai scheduled routine (`RemoteTrigger` tool, `action: "get"` /
`"update"`), not code in this repo — check the current routine ID/URL in memory
(`project_dcy_regulatory_scan`) before touching it.

- [ ] Add the new ticker + its parent company (name, CIK) throughout the prompt at the
  **same priority** as the existing ones — Steps 1-5 (research/reporting), not just a
  footnote.
- [ ] Step 6 (dividend rate sync) — add the ticker to the per-ticker loop.
- [ ] Step 7 (dividend history sync) — decide Yahoo-trusted vs manual-8-K-sourced (see §4),
  and if manual, describe exactly where entries go (which file, which field is the
  record/payment date) and a sanity-check order-of-magnitude for the per-share amount (this
  caught a potential 10x-wrong-par mistake before it could happen).
- [ ] Step 8 (funding-source box sync) — add the new `DIVIDEND_RESERVE` entry's sourcing
  rules. If the backing figure is disclosed **on a regular cadence** (weekly, same release
  as the holdings total), say so explicitly and tell it to pull the whole figure (amount +
  % + rate) from **one coherent release**, never mixing a fresh total from one week with a
  supporting detail from an older one. If it's only disclosed **occasionally** with no
  fixed cadence yet (this was CHAD's actual situation — DFDV's weekly release only ever
  gave a vague "8-11%" range, not a precise figure), say that too, and tell it not to
  invent precision that doesn't exist yet.
- [ ] Add (or extend) a **treasury-holdings-constant sync step** — the one step that
  actually keeps the `*_HOLDINGS` constants from §1 current. This didn't exist before CHAD
  and was the direct fix for STRC's holdings figure going stale.
- [ ] After editing: verify the update actually landed by re-`get`-ting the routine and
  grepping the returned prompt for a distinctive new phrase — the update calls return a
  large JSON blob with the prompt embedded 2-3 times; don't assume a 200 response means the
  right text landed.

---

## 8. Colour choice

Every ticker needs one hex colour, synced across ~14 files (grep `TICKER_COLOUR` to find
them all). Pick something visually distinct from:

- Every existing ticker colour (STRC green `#4ade80`, SATA blue `#3b82f6`, BMNP yellow
  `#fde047`, CHAD dark red `#7f1d1d`)
- The blog category colours in the same palette (SOL purple `#a78bfa`, Metaplanet sky
  `#7dd3fc`)
- The site's existing semantic colours (`--accent-green` for gains, `--accent-red
  `#ef4444`` for losses, `--accent-gold` for the brand accent) — a ticker colour that's too
  close to one of these reads as the wrong thing at a glance.

If asked to darken/lighten after the fact, it's a pure find-and-replace of the hex (plus
any rgba-derived variants at different opacities) across the same file set — but **verify
the replacement actually landed** (see §9, the `sed` gotcha).

---

## 9. Testing protocol — do this before calling it done, not after

- [ ] `npm run build` after any non-trivial batch of changes — catches import/syntax
  errors across the whole Next.js app in one shot. **Never run this while a `next dev` is
  also running against the same directory** — kill the dev server first
  (`pkill -f "next dev"`), delete `.next`, build, then restart dev.
- [ ] Smoke-test every new route with curl (`/ticker`, `/projector?stock=ticker`,
  `/dividends?stock=ticker`, `/chart?stock=ticker`, `/vs-treasuries?stock=ticker`,
  `/money-flow`, `/`) — all should 200.
- [ ] **Regression-test the existing tickers**, not just the new one — the par-value
  refactor in particular touches shared formulas; confirm STRC/SATA/etc still compute the
  same numbers as before (par defaults to 100 for them, so behaviour should be byte-for-byte
  identical, but verify).
- [ ] For dividend-table UI changes: temporarily swap in a handful of fake past-dated
  entries into `data/dividends-TICKER.json`, hit the page, confirm the monthly summary
  table/progress box render correctly with real numbers, **then restore the real file**
  before committing. Don't skip this — the empty-state and populated-state code paths are
  different enough that "it didn't crash" isn't the same as "it's correct."
- [ ] For the rocket video specifically: render actual test frames locally rather than
  trusting code review. A one-off Node script importing `buildLanes`/`renderFrame`/
  `createRaceCanvas` directly, writing a single PNG via `@napi-rs/canvas`, and viewing it
  with the Read tool, is fast and catches layout bugs (misaligned lanes, cramped text) that
  are very hard to spot by reading canvas-drawing code. Test with the new ticker as
  featured AND as non-featured. Clean up the test PNG/MP4 files afterward — don't commit
  them.
- [ ] Colour-swap verification specifically: `grep -rl` across a directory containing a
  bracketed Next.js dynamic route path (e.g. `app/blog/[slug]/page.js`) can silently
  misbehave in some shells/tools (glob-expansion of `[slug]`) — a bulk `sed` loop over such
  a file list failed silently here despite reporting success. After any bulk find/replace,
  **directly `Read` a couple of the supposedly-changed files** to confirm, don't just trust
  a follow-up grep that might have the same path-globbing problem.

---

## 10. Deploy protocol

- [ ] `git status` / `git diff --stat` — review everything before staging.
- [ ] `git add -A && git commit` with a real message (what changed and why, not just "add
  ticker").
- [ ] **`git fetch origin main` before every push** — the regulatory-scan routine commits
  to `main` autonomously on its own daily schedule and can land a commit between your
  session start and your push. It touches `lib/constants.js`'s `DIVIDEND_RESERVE` block
  specifically (Steps 6/8), which is also exactly what a new-ticker build touches — expect
  a merge conflict there specifically, and resolve by taking the scan's newer disclosed
  figures while keeping your new ticker's block.
- [ ] `git push origin main` — Vercel auto-deploys.
- [ ] Poll the Vercel deployment (`mcp__plugin_vercel_vercel__get_deployment` /
  `list_deployments`, project `prj_s1iAt31nYu5VzUyua5MxAfhamnPL`, team
  `team_aoPD7jhnWT4HaMQQDDjoMh2J`) until `state: "READY"` before assuming anything is live.
- [ ] **The money-flow Blob will not automatically pick up the new ticker's seed data** —
  `/api/money-flow-data` only falls back to `SEED_*` when the *entire* Blob is empty; since
  it's already populated with the existing tickers, it just returns that as-is, silently
  missing the new `tickerWeekly` key forever unless something explicitly writes it. Fix:
  after the deploy is READY, manually trigger the money-flow cron once —
  `gh workflow run "Site crons" -f email=money-flow` — rather than waiting for tomorrow's
  scheduled 14:00 UTC run. Verify by fetching the Blob **directly** (bypassing the
  `/api/money-flow-data` route's 1-hour cache) with the `BLOB_READ_WRITE_TOKEN` from
  `.env.local`:
  ```
  curl "https://<storeid>.private.blob.vercel-storage.com/money-flow-data.json" \
    -H "Authorization: Bearer $BLOB_READ_WRITE_TOKEN"
  ```
  (storeid = 4th `_`-separated segment of the token, lowercased).

---

## Quick reference: files touched adding CHAD (52 in the first pass, several more in follow-ups)

If short on time, `git log --stat` on these commits in `~/digital-credit-yield-v2` is the
single most useful thing to re-read — real diffs beat a written description:

- `3ef3933` — the main rollout (all of §1-6 in one commit)
- `9384237` — STRC VWAP-wording fix + treasury-holdings constants + the
  `EffectiveYieldChart.js` par-value bug
- `77529e2` — blog filter, daily dividend summary table, brighter money-flow bars
- `11c2229` — rocket video's own lane + X-card tagline + dot-marker cleanup
- `9b4c991` / `7744268` — colour changes (find-and-replace across the same ~14 files each
  time)

Read the commit messages in full — each one explains *why*, not just *what*, and several
document a real bug found along the way that's worth checking for again next time.
