import XPostGrid from '@/components/XPostGrid';

export const metadata = {
  alternates: { canonical: '/thought-of-the-day' },
  title: 'Thought of the Day',
  description: 'A growing archive of the daily Thought of the Day posts from @DCYieldHub — short reflections on income investing, preferred stock and staying the course, newest first.',
  openGraph: {
    title: 'Thought of the Day',
    description: 'The daily Thought of the Day archive from @DCYieldHub — short reflections on income investing and preferred stock.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/thought-of-the-day',
    images: [{ url: '/og?v=3&title=Thought+of+the+Day&sub=Daily+reflections+from+DCYieldHub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thought of the Day',
    description: 'The daily Thought of the Day archive from @DCYieldHub.',
  },
};

export default function ThoughtOfTheDayPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">Thought of the Day</h1>
      <p className="text-base mb-10 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
        Every day I share a fun / encouraging Thought of the Day on{' '}
        <a href="https://x.com/DCYieldHub" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>X</a>
        {' '}— a reflection on income investing, preferred stock and the discipline of staying the course. They are collected here, newest first.
      </p>

      <XPostGrid kind="thoughts" />
    </div>
  );
}
