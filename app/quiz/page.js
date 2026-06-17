import Link from 'next/link';
import XPostGrid from '@/components/XPostGrid';
import { blobUrl } from '@/lib/blobUrl';

// Fetch quiz items on the server so the question + answer text are in the
// initial HTML (crawler / AdSense visible); the X embeds load client-side.
async function getQuiz() {
  try {
    const res = await fetch(blobUrl('dcy-quiz.json'), {
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
  alternates: { canonical: '/quiz' },
  title: 'Quiz',
  description: 'Test your knowledge of preferred stock, dividends and Bitcoin treasury companies with the @DCYieldHub quiz posts — reveal the answer to each, newest first.',
  openGraph: {
    title: 'Quiz',
    description: 'Test your knowledge with the @DCYieldHub quiz posts — STRC, SATA, BMNP, preferred stock and dividends.',
    type: 'website',
    url: 'https://www.digitalcredityield.com/quiz',
    images: [{ url: '/og?v=3&title=Quiz&sub=Test+your+knowledge+with+DCYieldHub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quiz',
    description: 'Test your knowledge with the @DCYieldHub quiz posts.',
  },
};

export default async function QuizPage() {
  const quiz = await getQuiz();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">Quiz</h1>
      <p className="text-base mb-10 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
        Have some fun with the quiz posts I share on{' '}
        <a href="https://x.com/DCYieldHub" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>X</a>
        {' '}— covering preferred stock, dividends and Bitcoin treasury companies. Read each question, then hit <span style={{ color: 'var(--text-primary)' }}>Reveal answer</span>. Newest first.
      </p>

      <XPostGrid kind="quiz" initialItems={quiz} />

      <section className="max-w-3xl mt-14">
        <h2 className="text-2xl font-bold mb-4">How the quiz works</h2>
        <div className="space-y-4 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          <p>
            Each quiz is a short question I post on X about preferred stocks, dividends, capital structure,
            and the Bitcoin and Ethereum treasury companies behind{' '}
            <Link href="/strc" style={{ color: 'var(--accent-gold)' }}>STRC</Link>,{' '}
            <Link href="/sata" style={{ color: 'var(--accent-gold)' }}>SATA</Link> and{' '}
            <Link href="/bmnp" style={{ color: 'var(--accent-gold)' }}>BMNP</Link>. Read the question, have a
            guess, then hit <span style={{ color: 'var(--text-primary)' }}>Reveal answer</span> to check yourself.
          </p>
          <p>
            The questions are designed to make the details stick — things like where a preferred series sits in
            a company&apos;s capital structure, how a dividend rate is actually set, or why these instruments
            tend to trade near their $100 par value. Getting one wrong is part of the point; the answer is
            always there to learn from.
          </p>
          <p>
            Want to brush up first? The <Link href="/blog" style={{ color: 'var(--accent-gold)' }}>blog</Link>{' '}
            covers each instrument in depth, the{' '}
            <Link href="/glossary" style={{ color: 'var(--accent-gold)' }}>glossary</Link> explains the jargon,
            and the <Link href="/faq" style={{ color: 'var(--accent-gold)' }}>FAQ</Link> answers the most
            common questions.
          </p>
        </div>
      </section>
    </div>
  );
}
