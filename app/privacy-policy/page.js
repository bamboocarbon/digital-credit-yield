export const metadata = {
  alternates: { canonical: '/privacy-policy' },
  title: 'Privacy Policy — Digital Credit Yield',
};

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="text-sm leading-7 space-y-3" style={{ color: 'var(--text-muted)' }}>{children}</div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>Last updated: May 2026</p>

      <Section title="1. What Data We Collect">
        <p>We may collect the following data when you use Digital Credit Yield:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Page view data collected via Google Analytics (anonymised IP addresses, pages visited, session duration)</li>
          <li>Cookie consent preferences stored locally in your browser via your browser's local storage</li>
          <li>Calculator inputs (investment amounts, share counts, yield rates, time horizons) stored locally in your browser via your browser's local storage to preserve your settings between sessions — this data is never transmitted to our servers or any third party</li>
          <li>Contact form submissions (name, email address, message content) sent directly to our email address</li>
        </ul>
        <p>We do not collect financial data, account information, or payment details.</p>
      </Section>

      <Section title="2. How We Use Your Data">
        <p>Data collected is used solely to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Understand how visitors use the site (analytics) in order to improve it</li>
          <li>Respond to enquiries submitted via the contact form</li>
          <li>Serve relevant advertisements via Google AdSense (only with your consent)</li>
          <li>Preserve your calculator settings (Growth Projector, Differentiator, and Dividend History income calculator inputs) between visits for your convenience</li>
          <li>Build and maintain a long-term dividend payment history for STRC and SATA — when you visit a Dividend History page, our server may fetch the latest public dividend data from Yahoo Finance and store it on our server to grow this record over time. This process involves no personal data whatsoever; only publicly available market information is stored.</li>
        </ul>
        <p>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
      </Section>

      <Section title="3. Third-Party Services">
        <p>This site uses the following third-party services, each with their own privacy policies:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Google Analytics</strong> — website analytics. <a href="https://policies.google.com/privacy" className="underline" style={{ color: 'var(--accent-gold)' }} target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
          <li><strong>Google AdSense</strong> — advertising. Only loaded with your cookie consent.</li>
          <li><strong>Google Fonts</strong> — web fonts (DM Sans and Space Mono) loaded from Google's CDN. Google may log your IP address as part of the font request. <a href="https://policies.google.com/privacy" className="underline" style={{ color: 'var(--accent-gold)' }} target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
          <li><strong>TradingView (lightweight-charts)</strong> — open-source charting library used to render price and yield charts. Runs entirely client-side with no external requests to TradingView servers and no user data is collected or transmitted.</li>
          <li><strong>Yahoo Finance</strong> — live price and dividend data, fetched server-side (no user data shared).</li>
        </ul>
      </Section>

      <Section title="4. Cookie Policy">
        <p>We use cookies for the following purposes:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Essential cookies</strong>: your cookie consent preference is stored in your browser's local storage</li>
          <li><strong>Calculator preferences</strong>: Growth Projector and Differentiator inputs are stored in your browser's local storage for your convenience — these are not consent-dependent as no personal data is involved and nothing is transmitted externally</li>
          <li><strong>Analytics cookies</strong> (Google Analytics): only set if you accept cookies</li>
          <li><strong>Advertising cookies</strong> (Google AdSense): only set if you accept cookies</li>
        </ul>
        <p>You can withdraw consent at any time by clearing your browser's local storage for this site.</p>
      </Section>

      <Section title="5. Advertising">
        <p>
          We use Google AdSense to display advertisements on this site. Google and its partners use cookies to serve ads based on your prior visits to this site and other sites across the internet. This is known as interest-based or personalised advertising.
        </p>
        <p>
          Google's use of advertising cookies enables it and its partners to serve ads based on your browsing history. You can opt out of personalised advertising at any time using either of the following:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <a href="https://adssettings.google.com" className="underline" style={{ color: 'var(--accent-gold)' }} target="_blank" rel="noopener noreferrer">Google Ads Settings</a> — manage how Google uses your data for advertising
          </li>
          <li>
            <a href="https://optout.aboutads.info" className="underline" style={{ color: 'var(--accent-gold)' }} target="_blank" rel="noopener noreferrer">aboutads.info</a> — opt out of interest-based advertising from participating companies
          </li>
          <li>
            <a href="https://optout.networkadvertising.org" className="underline" style={{ color: 'var(--accent-gold)' }} target="_blank" rel="noopener noreferrer">Network Advertising Initiative opt-out</a>
          </li>
        </ul>
        <p>
          If you decline cookies via our cookie banner, Google AdSense will not be loaded and no advertising cookies will be set. For more information on how Google uses data from sites that use its services, see <a href="https://policies.google.com/technologies/partner-sites" className="underline" style={{ color: 'var(--accent-gold)' }} target="_blank" rel="noopener noreferrer">How Google uses information from sites or apps that use our services</a>.
        </p>
      </Section>

      <Section title="6. Your Rights (GDPR)">
        <p>If you are based in the UK or European Economic Area, you have the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Request correction or deletion of your data</li>
          <li>Object to or restrict processing of your data</li>
          <li>Withdraw consent at any time</li>
          <li>Lodge a complaint with the Information Commissioner's Office (ICO) if you believe your rights have been violated</li>
        </ul>
      </Section>

      <Section title="7. Contact">
        <p>For any privacy-related queries, please contact us at:{' '}
          <a href="mailto:contact@digitalcredityield.com" className="underline" style={{ color: 'var(--accent-gold)' }}>
            contact@digitalcredityield.com
          </a>
        </p>
      </Section>
    </div>
  );
}
