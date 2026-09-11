// Shared by any client component that needs to know whether cookies/ads are
// currently allowed to load — CookieBanner.js has its own inline version of
// this same check (it also needs to decide when to render itself), this is
// for everything else (AadsAd.js) that just needs a yes/no.
export function isConsentGranted() {
  try {
    const stored = localStorage.getItem('cookieConsent');
    if (stored === 'accepted') return true;
    if (stored === 'declined') return false;
    // No explicit choice yet — outside the EEA/UK (see proxy.js: regionFor
    // / REGULATED_COUNTRIES) cookies default on with no prompt.
    const match = document.cookie.match(/(?:^|; )consent_region=([^;]*)/);
    const region = match ? decodeURIComponent(match[1]) : 'regulated';
    return region === 'open';
  } catch {
    return false;
  }
}
