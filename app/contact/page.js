import ContactForm from './ContactForm';

export const metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact',
  description: 'Get in touch with Robin Gillingham at Digital Credit Yield. Questions about STRC, SATA, BMNP, or dividend investing? I\'d love to hear from you.',
  openGraph: {
    title: 'Contact',
    description: 'Get in touch with Robin Gillingham at Digital Credit Yield. Questions about STRC, SATA, BMNP, or dividend investing?',
    type: 'website',
    url: 'https://www.digitalcredityield.com/contact',
    images: [{ url: '/og?v=2&title=Contact&sub=Digital+Credit+Yield' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact',
    description: 'Get in touch with Robin Gillingham at Digital Credit Yield. Questions about STRC, SATA, BMNP, or dividend investing?',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Contact</h1>
      <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
        For enquiries, please use the form below or email{' '}
        <a href="mailto:contact@digitalcredityield.com" className="underline hover:text-white" style={{ color: 'var(--accent-gold)' }}>
          contact@digitalcredityield.com
        </a>
      </p>
      <ContactForm />
    </div>
  );
}
