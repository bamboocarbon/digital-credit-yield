import Link from 'next/link';

const footerLinks = [
  { label: 'Money Flow', href: '/money-flow' },
  { label: 'Thought of the Day', href: '/thought-of-the-day' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Risks', href: '/risks' },
  { label: 'Glossary', href: '/glossary' },
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
              prefetch={false}
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
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)', opacity: 0.65 }}>
          Also by me: <a
            href="https://polkadotbike.com"
            target="_blank"
            rel="noopener"
            className="hover:text-white transition-colors"
            style={{ fontWeight: 800, whiteSpace: 'nowrap' }}
          >
            Polka<span
              style={{
                display: 'inline-block',
                width: '1.35em',
                height: '1.35em',
                verticalAlign: '-0.3em',
                margin: '0 0.12em',
                overflow: 'hidden',
                textIndent: '-9999px',
                whiteSpace: 'nowrap',
                background: 'url("data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E%3Ccircle cx=%2216%22 cy=%2216%22 r=%2216%22 fill=%22%23ef4444%22/%3E%3Ctext x=%2216.75%22 y=%2220%22 text-anchor=%22middle%22 font-family=%22Inter,system-ui,sans-serif%22 font-size=%2210.5%22 font-weight=%22900%22 letter-spacing=%221.5%22 fill=%22%23000%22%3EDOT%3C/text%3E%3C/svg%3E") no-repeat center/contain',
              }}
            >DOT</span>Bike
          </a> — gear ratio calculators &amp; race stats for road, gravel and mountain bikes.
        </p>
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} Digital Credit Yield. For information purposes only. Not financial advice.
        </p>
      </div>
    </footer>
  );
}
