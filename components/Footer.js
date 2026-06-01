import Link from 'next/link';

const footerLinks = [
  { label: 'Money Flow', href: '/money-flow' },
  { label: 'About Me', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className="mt-auto py-8 px-4"
      style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-x-6 gap-y-2 text-center">
          {footerLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-colors hover:text-white"
              style={{ color: 'var(--text-muted)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <a
          href="https://x.com/DCYieldHub"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow @DCYieldHub on X for daily insights"
          className="flex items-center gap-2 text-sm transition-colors hover:text-white"
          style={{ color: 'var(--text-muted)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
          </svg>
          Follow @DCYieldHub for daily insight
        </a>
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} Digital Credit Yield. For information purposes only. Not financial advice.
        </p>
      </div>
    </footer>
  );
}
