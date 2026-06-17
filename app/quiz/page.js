import XPostGrid from '@/components/XPostGrid';

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

export default function QuizPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">Quiz</h1>
      <p className="text-base mb-10 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
        Have some fun with the quiz posts I share on{' '}
        <a href="https://x.com/DCYieldHub" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>X</a>
        {' '}— covering preferred stock, dividends and Bitcoin treasury companies. Read each question, then hit <span style={{ color: 'var(--text-primary)' }}>Reveal answer</span>. Newest first.
      </p>

      <XPostGrid kind="quiz" />
    </div>
  );
}
