import Link from 'next/link';

const footerLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
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
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} Digital Credit Yield. For information purposes only. Not financial advice.
        </p>
      </div>
    </footer>
  );
}
