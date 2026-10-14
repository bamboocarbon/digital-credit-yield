import Link from 'next/link';
import AssetCard from '@/components/AssetCard';
import { sameIssuerTickers } from '@/lib/tickerDisplay';

// The home-page price cards, reused on the hub pages: one card per ticker the selected ticker's issuer owns
// (Strategy -> STRC, STRK, STRF, STRD, STRE; Strive -> SATA, SATS; the rest have one). The current ticker's card
// is outlined. Replaces the plain chip row on hub pages; the tool pages keep their chips.
// The whole card is clickable: a transparent link is stretched over it (a sibling of the card's own
// "Explore" button, not a parent, so there are no nested links).
export default function IssuerCards({ selected }) {
  const tickers = sameIssuerTickers(selected);
  return (
    <div
      className="grid gap-4 justify-center mb-6"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 220px))' }}
      role="group"
      aria-label="Prices for this issuer's preferred stocks"
    >
      {tickers.map(t => (
        <div
          key={t}
          className="relative rounded-xl flex transition hover:brightness-125"
          style={{ outline: t === selected ? '2px solid var(--accent-gold)' : 'none', outlineOffset: '2px' }}
        >
          <div className="w-full flex"><AssetCard ticker={t} /></div>
          <Link
            href={`/${t.toLowerCase()}`}
            prefetch={false}
            aria-label={`Open the ${t} page`}
            aria-current={t === selected ? 'page' : undefined}
            className="absolute inset-0 rounded-xl"
          />
        </div>
      ))}
    </div>
  );
}
