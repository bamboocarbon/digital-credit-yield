'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SubNav({ ticker }) {
  const pathname = usePathname();
  const lower = ticker.toLowerCase();
  const q = `?stock=${lower}`;

  // Hub stays per-ticker; the four tools are consolidated single pages that
  // carry the active stock through the query string.
  const tabs = [
    { label: 'Hub', href: `/${lower}` },
    { label: 'Chart', href: `/chart${q}` },
    { label: 'Growth Projector', href: `/projector${q}`, shortLabel: 'Projector' },
    { label: 'vs Treasuries', href: `/vs-treasuries${q}` },
    { label: 'Dividends', href: `/dividends${q}` },
  ];

  return (
    <div className="tab-strip flex gap-0.5 mb-6 overflow-x-auto"
      style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
      {tabs.map(tab => {
        const active = pathname === tab.href.split('?')[0];
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="tab-item px-1.5 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors min-h-[44px] flex items-center rounded-t-lg whitespace-nowrap flex-shrink-0"
            style={{
              color: active ? 'var(--accent-gold)' : 'var(--text-muted)',
              borderBottom: active ? '2px solid var(--accent-gold)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {tab.shortLabel ? (
              <>
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </>
            ) : tab.label}
          </Link>
        );
      })}
    </div>
  );
}
