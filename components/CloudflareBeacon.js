'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Cloudflare Web Analytics beacon (cookieless). It has no IP exclusion of its own, so the owner is kept out here:
//  - never loads on /admin, and
//  - visiting /admin once sets a localStorage flag in that browser, after which the beacon never loads for it on any
//    page (phone, laptop, any network). To undo it, clear the site's storage or remove 'dcy_owner'.
// The server-side counter has its own PV_EXCLUDE_IPS exclusion (proxy.js) and is not affected by this.
const OWNER_KEY = 'dcy_owner';

export default function CloudflareBeacon({ token }) {
  const pathname = usePathname() || '';
  const onAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  useEffect(() => {
    let owner = onAdmin;
    try {
      if (onAdmin) localStorage.setItem(OWNER_KEY, '1');
      owner = owner || localStorage.getItem(OWNER_KEY) === '1';
    } catch { /* storage blocked: the path check alone applies */ }
    if (!token || owner || document.querySelector('script[data-cf-beacon]')) return;
    const s = document.createElement('script');
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.defer = true;
    s.setAttribute('data-cf-beacon', JSON.stringify({ token }));
    document.body.appendChild(s);
  }, [onAdmin, token]);

  return null;
}
