// Ezoic standalone ad placeholder. Renders ONLY the placeholder div — ads are
// loaded and refreshed centrally by <EzoicRouteRefresh> in the root layout,
// which calls ezstandalone.showAds() after every route change (per Ezoic's
// "Dynamic Content → Changing Pages" guidance) so in-content, anchor and video
// units all refresh on client-side navigation.
//
// Per Ezoic: never style this div — reserving space leaves a blank gap when no
// ad fills. `id` is the numeric placement ID from the Ezoic dashboard.
export default function EzoicAd({ id }) {
  return <div id={`ezoic-pub-ad-placeholder-${id}`} />;
}
