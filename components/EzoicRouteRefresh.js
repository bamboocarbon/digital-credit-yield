'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Drives Ezoic ad rendering across Next.js client-side navigation.
//
// The Ezoic standalone script never auto-renders placeholders — showAds() must
// be called once the page's placeholder divs are in the DOM, and re-called on
// every pageview change (Ezoic "Dynamic Content → Changing Pages"). showAds()
// with no args renders every placeholder present on the new page and refreshes
// the anchor + video units. destroyAll() first clears the previous page's
// placeholders so reused placement IDs don't collide (Ezoic warns a still-live
// ID gives "unpredictable ad behaviour").
//
// Running inside cmd.push() means the work is queued until sa.min.js has
// loaded, so it is safe even before the Ezoic script is ready. The effect fires
// after the new route's DOM is committed, so destroyAll never removes ads on
// the page the user is still viewing.
export default function EzoicRouteRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    window.ezstandalone = window.ezstandalone || {};
    window.ezstandalone.cmd = window.ezstandalone.cmd || [];
    window.ezstandalone.cmd.push(() => {
      try { window.ezstandalone.destroyAll(); } catch {}
      window.ezstandalone.showAds();
    });
  }, [pathname]);

  return null;
}
