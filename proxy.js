import { NextResponse } from 'next/server';
import { redis } from './lib/redisClient.js';

// Namespaced because this Redis instance is shared with polkadotbike (single
// free-tier Upstash database — Marketplace only grants one free DB per
// account, see project_pageview_counter_pattern memory 2026-09-02).
const NS = 'dcy:pv';

// Best-effort — this only needs to keep out the obvious crawlers so the
// counter reflects real visits, not perfectly filter every bot. A UA that
// spoofs a real browser will always slip through; nothing header-based can
// catch that (see the User-Agent logging below for when it does).
//
// Widened 2026-08-30 after an unidentified crawler swept 10+ pages in ~3
// seconds and none of it got filtered — the original list only caught UAs
// that self-identify as a bot/spider/crawler. Added: Meta's renamed
// crawler, chat-app link-preview fetchers, Google's URL-inspection tool,
// an SEO crawler with no bot/spider/crawl substring in its name, and the
// common non-browser HTTP clients (curl, wget, language-runtime HTTP
// libraries, API-testing tools) that a real visitor's browser never sends.
//
// 2026-08-30, second widening (ported from the same fix on polkadotbike):
// caught `get_titles/1.0` live in the actual recorded data there (a single
// hit, but a real gap — the UA-logging above is exactly what made this
// findable instead of guessed at) — a plain, undisguised scraper name that
// didn't match anything in the list above.
//
// 2026-08-31, third widening — Robin asked "are they genuine" about a
// 216-count day, checked the raw UA data directly rather than guessing.
// Found three more gaps, all confirmed in the actual recorded blobs:
// - `ForestEngine/1.0` — self-identifies as a bot in its own UA, just
//   didn't contain bot/spider/crawl.
// - `NetworkingExtension` — iOS's own system-level networking framework
//   (background prefetch/Siri-suggestions), not a real user page load.
// - The `Chrome/... Safari/604.1` combination — a broken/copy-pasted
//   scraper UA template (24 hits, same one, repeating every ~2h all day):
//   604.1 is the Mobile-Safari-only WebKit build suffix, and a genuine
//   Chrome UA (desktop or Linux) always ends `Safari/537.36` instead —
//   Chrome+604.1 together can only mean a fabricated UA, never a real
//   browser, so this is safe to match precisely without risking any real
//   visitor's UA (a real Mobile Safari UA never contains "Chrome/" at
//   all).
//
// 2026-09-02, fourth widening — Robin asked to compare a day's admin count
// against Vercel Web Analytics; the gap traced to real UA data (same method
// as above). Found on this site and/or polkadotbike the same day:
// - `GoogleOther` — Google's own generic crawler, self-identifies honestly
//   in its UA, just wasn't caught (only `google-inspectiontool` was listed).
// - `crusader-worker` — a plainly-named scraper, undisguised.
// - `AppEngine-Google` (with a `virustotalcloud` appid seen live) — Google
//   App Engine's default outbound UA, used by automated cloud scanners
//   (VirusTotal here), never a real browser.
// - `iPhone OS 13_2_3 ... Version/13.0.3 ... Safari/604.1` — an exact,
//   identical UA hit both this site and polkadotbike the same day at real
//   volume; iOS 13.2.3 is a 2019 release no real device would still present
//   in 2026, and the same fixed string on two unrelated sites the same day
//   points to one shared bot/prefetch service with a hardcoded fake UA, not
//   organic traffic. Matched on the exact OS+Safari-version combination so
//   it can't collide with any real visitor's UA.
//
// 2026-09-21, fifth widening — Robin asked why our counter still runs well
// ahead of Vercel Web Analytics; read the recentUAs sample directly (same
// method as above) on both this site and polkadotbike. Found:
// - `panscient` — Panscient's commercial company-data crawler, undisguised.
// - `WP-Safe-Scanner`, `CensysInspect`, `domain-harvester`, `NoMoreVibe` —
//   plainly-named scanners/crawlers, none containing bot/spider/crawl.
// - UAs literally starting with the string `User-Agent:` — a broken
//   scraper that pasted the header name into its own value; no real
//   browser's UA can begin with that.
// - A bare `Windows NT 10.0)` with no `Win64; x64` / `WOW64` token before
//   the closing paren — every real Chrome/Edge build includes one of those;
//   this exact string hit every single page on both sites within 800ms
//   (18:49:47.4-48.3, same UTC second on both), an unmistakable full-site
//   crawl, not a person.
// - Chrome majors below 90 (Chrome 90 shipped Apr 2021): Chrome auto-updates
//   continuously, so five-plus-year-old majors in 2026 traffic are a long
//   tail of one-off values from a rotated fake-UA pool, not real browsers
//   that simply haven't updated. Excludes WeChat's embedded browser
//   (MicroMessenger/Weixin/XWEB) — its bundled Chromium kernel genuinely
//   reports old Chrome majors on current phones; one such UA was in this
//   same sample, so this is a confirmed false-positive risk, not a
//   hypothetical one.
const BOT_UA = /bot|spider|crawl|slurp|facebookexternalhit|meta-externalagent|headless|lighthouse|pingdom|uptimerobot|monitor|preview|whatsapp|telegrambot|discordbot|google-inspectiontool|googleother|barkrowler|curl\/|wget\/|python-requests|python-urllib|go-http-client|okhttp|axios\/|node-fetch|postmanruntime|libwww-perl|apache-httpclient|guzzlehttp|insomnia|http\.rb|get_titles|forestengine|networkingextension|crusader-worker|appengine-google|chrome\/[\d.]+ safari\/604\.1|iphone os 13_2_3.*version\/13\.0\.3|panscient|wp-safe-scanner|censysinspect|domain-harvester|nomorevibe|^user-agent:|windows nt 10\.0\) applewebkit|^(?!.*(?:micromessenger|weixin|xweb)).*chrome\/(?:[0-9]|[1-8][0-9])\./i;

// A different bot class UA filtering can never catch: these self-identify
// by hitting a PATH that isn't a real route on this site at all, often with
// a normal-looking (or subtly malformed) UA rather than an honest one.
// Found live on this site 2026-08-30: two hits on /file-manager/initialize
// (a known vulnerability-scanner probe path, unrelated to DCY specifically)
// with a UA missing its browser/version entirely — no real browser sends
// that. Best-effort, extend as new scan targets show up in the recorded UA
// data.
//
// 2026-08-31: added `_profiler` (Symfony's debug-toolbar route,
// /_profiler/open and /_profiler/phpinfo both hit — this site isn't even
// PHP, so it's a blind scanner probe, not a mistaken real request).
const SCAN_PATH = /^\/(wp-|wordpress|xmlrpc\.php|\.env|\.git|phpmyadmin|pma\/|file-manager|elfinder|cgi-bin|actuator|vendor\/phpunit|config\.php|\.aws|\.ssh|shell\.php|eval-stdin\.php|_profiler)/i;

function encodePath(pathname) {
  const trimmed = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!trimmed) return '_home';
  return trimmed.replace(/\//g, '--');
}

// GDPR/UK-GDPR territory: the 27 EU states, the three non-EU EEA members
// (Iceland, Liechtenstein, Norway — bound by GDPR via the EEA agreement),
// and the UK. Everywhere else defaults cookies/analytics on with no banner.
const REGULATED_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB',
]);

/**
 * Reads the raw `x-vercel-ip-country` header Vercel's edge network stamps
 * on every request — not the `@vercel/functions` geolocation() helper,
 * which isn't a dependency here and would add one just for this. The
 * header is set at the network level regardless of Next.js version, so
 * it works the same in proxy.js here as in polkadotbike's middleware.ts.
 * Missing locally (no such header in `next dev`) and, in theory, on any
 * edge case Vercel doesn't resolve — both fail safe to 'regulated' so a
 * detection gap shows an unnecessary banner rather than skipping a
 * required one.
 */
function regionFor(request) {
  const country = request.headers.get('x-vercel-ip-country');
  if (!country) return 'regulated';
  return REGULATED_COUNTRIES.has(country.toUpperCase()) ? 'regulated' : 'open';
}

// 2026-09-24 — a UA-string blocklist can't keep up with this class of bot:
// Robin's daily email showed DCY at ~390 pageviews/day (09-22/09-23) with no
// matching rise in Vercel Web Analytics. The recentUAs sample showed why —
// four fixed, plausible, current-version UAs (Mac Chrome/142, Mac Chrome/148,
// Windows Chrome/124, Android Chrome/114) each swept nearly every page on the
// site within about a second, repeating every 10-40 minutes around the
// clock — 83% of 09-23's recorded events. None of them self-identify or
// look fake individually, so nothing in BOT_UA can catch them, and rotating
// through a bigger UA pool defeats a blocklist by design. Vercel Analytics
// never saw it because it's a client-side beacon — a scraper fetching raw
// HTML with a spoofed UA never executes the page's JS to fire it.
//
// The reliable signal is behavioural, not the UA string: a real visitor
// never opens several distinct pages inside the same few seconds. Counted
// per client IP (the `x-vercel-ip-country` header above is Vercel's own
// edge-network header the same way; `x-forwarded-for` is the equivalent for
// the client's address) with a short Redis TTL — not stored anywhere else,
// consistent with this file's no-cookie/no-per-visitor-ID design. This only
// stops counting a client's pageviews once it's swept past a threshold no
// human reaches; it never blocks the request — the page is still served
// normally either way, this only corrects what lands in the reports.
const BURST_WINDOW_SECONDS = 3;
const BURST_ALLOWANCE = 4;

function clientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

async function recordPageview(encoded, ip, ua) {
  const burstKey = `${NS}:burst:${ip}`;
  const hitsInWindow = await redis.incr(burstKey);
  if (hitsInWindow === 1) await redis.expire(burstKey, BURST_WINDOW_SECONDS);
  // Past the allowance for this window — a full-site sweep, not a person.
  if (hitsInWindow > BURST_ALLOWANCE) return;

  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const month = day.slice(0, 7);
  await redis
    .pipeline()
    .incr(`${NS}:day:${day}`)
    .incr(`${NS}:month:${month}`)
    .sadd(`${NS}:months`, month)
    .hincrby(`${NS}:paths`, encoded, 1)
    .incr(`${NS}:total`)
    // Bounded rolling sample of the last 500 events (timestamp, path,
    // UA) — replaces the old per-event-forever log that caused the
    // quota problem, while keeping the ability to diagnose a new bot
    // pattern from real data (the method that caught GoogleOther,
    // crusader-worker, ForestEngine, the stale-iOS UA, etc. in past
    // sessions) without unbounded growth.
    .lpush(`${NS}:recentUAs`, `${now.toISOString()}\t${encoded}\t${ua}`)
    .ltrim(`${NS}:recentUAs`, 0, 499)
    .exec();
}

/**
 * Increments day/month/path/total counters in Redis on every real page
 * load — no cookies, no per-visitor ID, so it isn't gated by cookie consent
 * the way GA4 is. Ported from the polkadotbike site's proven pattern
 * (lib/pageviewLog.js aggregates it).
 *
 * 2026-09-02: rebuilt from the original one-Blob-per-event design. That
 * design cost one Vercel Blob "Advanced Operation" per write AND per
 * list()-based admin read, which put the shared team account (Blob billing
 * is account-wide, not per-project) at 75% of Hobby's 2,000/month cap
 * within ~3 days at this site's real traffic (~200+ pageviews/day) —
 * see project_pageview_counter_pattern memory, 2026-09-02 entry, for the
 * full diagnosis. Counters cost a handful of Redis commands per event
 * against Upstash's 500K/month free tier instead — not remotely close to
 * that limit at current traffic.
 *
 * Named `proxy`, not `middleware` — this Next.js version (16) deprecated
 * and renamed the file convention; see node_modules/next/dist/docs/01-app/
 * 03-api-reference/03-file-conventions/proxy.md.
 *
 * Every nav Link across this site must keep `prefetch={false}` (Navbar,
 * Footer, SubNav) — Next's viewport-prefetch fires a request that looks
 * identical to a real page open once it reaches here, and polkadotbike's
 * own counter overcounted ~13x from exactly this before that fix landed.
 */
export function proxy(request, event) {
  const response = NextResponse.next();
  // Read by the consent-init script and CookieBanner (see app/layout.js /
  // components/CookieBanner.js) to decide whether to default cookies/ads
  // to on with no prompt, or off-until-accepted with the banner shown.
  response.cookies.set('consent_region', regionFor(request), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  });

  // `npm run dev` shares this exact same production Redis instance (same
  // KV_REST_API_URL/TOKEN in .env.local) — the equivalent Blob-store gotcha
  // bit both sites on 2026-08-30, so the same guard carries over. Vercel
  // sets `VERCEL` in every deployed environment (production AND preview)
  // but never in plain local `next dev` — same signal polkadotbike's
  // lib/calendar/store.ts uses to pick its storage backend. Skip recording
  // entirely rather than try to filter dev traffic out after the fact.
  if (!process.env.VERCEL) return response;
  const ua = request.headers.get('user-agent') || '';
  // A real browser always sends a User-Agent — a blank one is itself a
  // reliable bot signal, not just "unknown".
  if (ua && !BOT_UA.test(ua) && !SCAN_PATH.test(request.nextUrl.pathname)) {
    const encoded = encodePath(request.nextUrl.pathname);
    event.waitUntil(recordPageview(encoded, clientIp(request), ua).catch(() => {}));
  }
  return response;
}

export const config = {
  // Skips API routes, Next internals, /admin (don't count our own visits),
  // and anything that looks like a static file (has a dot anywhere in the
  // path — covers favicon.ico, robots.txt, sitemap.xml, images, etc.). One
  // combined negative-lookahead pattern, not multiple matcher entries —
  // multiple entries are OR'd together, which would defeat the exclusions.
  matcher: ['/((?!api/|_next/static/|_next/image/|admin|.*\\.).*)'],
};
