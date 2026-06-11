import UnsubscribeForm from '@/components/UnsubscribeForm';

export const metadata = {
  alternates: { canonical: '/unsubscribe' },
  title: 'Unsubscribe',
  description: 'Unsubscribe from the Digital Credit Yield daily snapshot email. Enter your email address and you will be removed from the list immediately.',
  robots: { index: false },
};

export default function UnsubscribePage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Unsubscribe</h1>
      <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
        Enter the email address you subscribed with and it will be removed from the
        daily snapshot list immediately.
      </p>
      <UnsubscribeForm />
    </div>
  );
}
