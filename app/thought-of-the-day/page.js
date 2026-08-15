import Link from 'next/link';
import XPostGrid from '@/components/XPostGrid';
import { blobUrl } from '@/lib/blobUrl';
import { computeAnchors } from '@/lib/thoughtAnchors';

const SITE_URL = 'https://www.digitalcredityield.com';

// Fetch the thoughts on the server so the thought text is in the initial HTML
// (visible to crawlers / AdSense review); the X embeds then load client-side.
async function getThoughts() {
  try {
    const res = await fetch(blobUrl('dcy-thoughts.json'), {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return [...data].sort((a, b) => (b.date.localeCompare(a.date)) || (String(b.id).localeCompare(String(a.id))));
  } catch {
    return [];
  }
}

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

// One CreativeWork record per entry that actually has text — an empty thought
// has nothing worth indexing. Mirrors the author/publisher entity already
// used on blog articles (app/blog/[slug]/page.js) so this ties into the same
// Person/Organization graph rather than inventing a new one.
function buildThoughtsJsonLd(thoughts) {
  const anchors = computeAnchors(thoughts);
  return thoughts
    .filter(t => (t.text || '').trim())
    .map(t => ({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      headline: t.text,
      text: t.text,
      datePublished: t.date,
      url: `${SITE_URL}/thought-of-the-day#${anchors.get(t.id)}`,
      image: `${SITE_URL}/api/thought-card?id=${t.id}`,
      author: {
        '@type': 'Person',
        name: 'Robin Gillingham',
        url: `${SITE_URL}/about`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Digital Credit Yield',
        url: SITE_URL,
      },
    }));
}

export default async function ThoughtOfTheDayPage() {
  const thoughts = await getThoughts();
  const thoughtsJsonLd = buildThoughtsJsonLd(thoughts);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {thoughtsJsonLd.map((entry, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">Thought of the Day</h1>
      <p className="text-base mb-10 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
        Every day I share an encouraging / fun Thought of the Day on{' '}
        <a href="https://x.com/DCYieldHub" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>X</a>
        {' '}— a reflection on income investing, preferred stock and the discipline of staying the course. They are displayed here, latest first.
      </p>

      <XPostGrid kind="thoughts" initialItems={thoughts} />

      <section className="max-w-3xl mx-auto mt-14">
        <h2 className="text-2xl font-bold mb-4">Why a thought a day?</h2>
        <div className="space-y-4 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          <p>
            Income investing is as much about temperament as it is about numbers. Preferred stocks like{' '}
            <Link href="/strc" style={{ color: 'var(--accent-gold)' }}>STRC</Link>,{' '}
            <Link href="/sata" style={{ color: 'var(--accent-gold)' }}>SATA</Link> and{' '}
            <Link href="/bmnp" style={{ color: 'var(--accent-gold)' }}>BMNP</Link> are built to pay a steady
            dividend and trade close to their $100 par value. That means the hardest part for most investors
            is rarely the maths — it is the patience to hold through the noise and let the dividends compound.
          </p>
          <p>
            Each thought is deliberately short. Some are about the discipline of reinvesting, some about
            tuning out day-to-day price swings, and some are simply a bit of encouragement to stay the course.
            None of them are financial advice — they are a daily nudge toward the long-term, income-focused
            approach this site is built around.
          </p>
          <p>
            New to the instruments behind these posts? Start with{' '}
            <Link href="/blog/what-is-preferred-stock" style={{ color: 'var(--accent-gold)' }}>what preferred stock is</Link>,
            browse the <Link href="/glossary" style={{ color: 'var(--accent-gold)' }}>glossary</Link> of key terms,
            or read the <Link href="/faq" style={{ color: 'var(--accent-gold)' }}>FAQ</Link>.
          </p>
          <p>
            These thoughts, in wording and presentation, remain the copyright of Digital Credit Yield.
          </p>
        </div>
      </section>
    </div>
  );
}
