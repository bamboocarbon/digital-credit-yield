import AssetCard from '@/components/AssetCard';
import { sameIssuerTickers } from '@/lib/tickerDisplay';

// The home-page price cards, reused on the hub pages: one card per ticker the selected ticker's issuer owns
// (Strategy -> STRC, STRK, STRF, STRD, STRE; Strive -> SATA, SATS; the rest have one). The current ticker's card
// is outlined. Replaces the plain chip row on hub pages; the tool pages keep their chips.
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
          className="rounded-xl flex"
          style={{ outline: t === selected ? '2px solid var(--accent-gold)' : 'none', outlineOffset: '2px' }}
        >
          <div className="w-full flex"><AssetCard ticker={t} /></div>
        </div>
      ))}
    </div>
  );
}
