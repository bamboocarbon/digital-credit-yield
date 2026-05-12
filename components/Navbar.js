'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { label: 'Home', href: '/' },
  { label: 'STRC', href: '/strc' },
  { label: 'SATA', href: '/sata' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40"
      style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span style={{ display: 'inline-block', width: 12, height: 12, background: 'var(--accent-gold)', borderRadius: 2, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-primary)' }}>Digital Credit Yield</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors"
                style={{
                  color: pathname === link.href || pathname.startsWith(link.href + '/') && link.href !== '/'
                    ? 'var(--accent-gold)'
                    : 'var(--text-muted)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 px-2 text-sm font-medium rounded-lg min-h-[44px] flex items-center"
                style={{
                  color: pathname === link.href ? 'var(--accent-gold)' : 'var(--text-primary)',
                  background: pathname === link.href ? 'var(--bg-card-hover)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
