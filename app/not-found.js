import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you were looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        The page you were looking for doesn&rsquo;t exist. Try one of the links below.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { href: '/', label: 'Home' },
          { href: '/strc', label: 'STRC' },
          { href: '/sata', label: 'SATA' },
          { href: '/bmnp', label: 'BMNP' },
          { href: '/blog', label: 'Blog' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-5 py-2 rounded-lg font-medium text-sm transition-opacity hover:opacity-80"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
