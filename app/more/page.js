import AssetHub from '@/components/AssetHub';
import { ASSET_RATES } from '@/lib/constants';

export const revalidate = 3600; // refresh the live-priced capital-structure pyramid hourly

const rate = ASSET_RATES.MORE.toFixed(2);

export const metadata = {
  alternates: { canonical: '/more' },
  title: `MORE — The Smarter Web Company Preferred Shares`,
  description: `Track MORE, The Smarter Web Company's sterling preferred shares on the London Stock Exchange. A cumulative ${rate}% weekly dividend on a £100 reference value, admitted to the Main Market on 14 October 2026.`,
  openGraph: {
    title: `MORE — The Smarter Web Company Preferred Shares Tracker`,
    description: `A bitcoin-treasury preferred listed in London: a cumulative ${rate}% dividend paid weekly in sterling. Track the price, effective yield and dividend history.`,
    type: 'website',
    url: 'https://www.digitalcredityield.com/more',
    images: [{ url: `/og?v=3&title=MORE+Preferred&sub=The+Smarter+Web+Company&rate=${rate}%25` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `MORE — The Smarter Web Company Preferred Shares Tracker`,
    description: `A cumulative ${rate}% weekly sterling dividend on the London Stock Exchange. Track the price, effective yield and dividend history.`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'MORE — The Smarter Web Company Cumulative Variable Rate Preferred Shares',
  description: `The Smarter Web Company's sterling preferred shares listed on the London Stock Exchange Main Market, paying a cumulative ${rate}% annual dividend (on a £100 reference value) distributed weekly.`,
  url: 'https://www.digitalcredityield.com/more',
  category: 'Preferred Stock',
  provider: {
    '@type': 'Organization',
    name: 'The Smarter Web Company PLC',
    url: 'https://www.smarterwebcompany.co.uk',
  },
  interestRate: ASSET_RATES.MORE,
};

export default function MOREPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AssetHub ticker="MORE" name="The Smarter Web Company Preferred Shares" />
    </>
  );
}
