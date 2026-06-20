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
        <a href="https://x.com/DCYieldHub" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>X</a>.
      </p>

      <XPostGrid
        kind="quiz"
        initialItems={quiz}
        trailing={
          <div className="self-start sm:col-span-1 lg:col-span-2 flex items-start justify-center px-4 pt-6">
            <p
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-center"
              style={{ color: 'var(--accent-gold)' }}
            >
              Watch this space !
            </p>
          </div>
        }
      />
    </div>
  );
}
