import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// Best-effort — this only needs to keep out the obvious crawlers so the
// counter reflects real visits, not perfectly filter every bot.
const BOT_UA = /bot|spider|crawl|slurp|facebookexternalhit|headless|lighthouse|pingdom|uptimerobot|monitor|preview/i;

function encodePath(pathname) {
  const trimmed = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!trimmed) return '_home';
  return trimmed.replace(/\//g, '--');
}

/**
 * Records one marker blob per real page load — no cookies, no per-visitor
 * ID, so it isn't gated by cookie consent the way GA4 is. Ported from the
 * polkadotbike site's proven pattern (lib/pageviewLog.js aggregates it).
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
  const ua = request.headers.get('user-agent') || '';
  if (!BOT_UA.test(ua)) {
    const encoded = encodePath(request.nextUrl.pathname);
    event.waitUntil(
      put(`pageviews/${encoded}/${Date.now()}-${crypto.randomUUID()}`, new Date().toISOString(), {
        access: 'private',
        addRandomSuffix: false,
        contentType: 'text/plain',
      }).catch(() => {})
    );
  }
  return NextResponse.next();
}

export const config = {
  // Skips API routes, Next internals, /admin (don't count our own visits),
  // and anything that looks like a static file (has a dot anywhere in the
  // path — covers favicon.ico, robots.txt, sitemap.xml, images, etc.). One
  // combined negative-lookahead pattern, not multiple matcher entries —
  // multiple entries are OR'd together, which would defeat the exclusions.
  matcher: ['/((?!api/|_next/static/|_next/image/|admin|.*\\.).*)'],
};
