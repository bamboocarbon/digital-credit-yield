'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        An unexpected error occurred. Please try refreshing the page.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-lg font-medium text-sm min-h-[44px] transition-opacity hover:opacity-80"
        style={{ background: 'var(--accent-gold)', color: '#000' }}
      >
        Try again
      </button>
    </div>
  );
}
