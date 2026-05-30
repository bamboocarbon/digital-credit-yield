import ContactForm from './ContactForm';

export const metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact — Digital Credit Yield',
  description: 'Get in touch with the Digital Credit Yield team. Questions about STRC, SATA, dividend investing, or the site? We\'d love to hear from you.',
  openGraph: {
    title: 'Contact — Digital Credit Yield',
    description: 'Get in touch with questions about STRC, SATA, or dividend investing.',
    type: 'website',
    url: 'https://digitalcredityield.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
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
