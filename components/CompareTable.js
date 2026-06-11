import Link from 'next/link';
import { ASSET_RATES, PAYMENT_FREQUENCY, BMNP_ENABLED, STRIVE_BTC_HOLDINGS } from '@/lib/constants';

const TICKER_COLOUR = { STRC: '#4ade80', SATA: '#3b82f6', BMNP: '#fde047' };

const ROWS = [
  {
    label: 'Issuer',
    STRC: 'Strategy (Nasdaq: MSTR)',
    SATA: 'Strive (Nasdaq: ASST)',
    BMNP: 'Bitmine (NYSE: BMNR)',
  },
  {
    label: 'Annual dividend rate',
    STRC: `${ASSET_RATES.STRC.toFixed(2)}%`,
    SATA: `${ASSET_RATES.SATA.toFixed(2)}%`,
    BMNP: `${ASSET_RATES.BMNP.toFixed(2)}% (fixed)`,
  },
  {
    label: 'Payment frequency',
    STRC: `${PAYMENT_FREQUENCY.STRC.label} (${PAYMENT_FREQUENCY.STRC.perYear}/year)`,
    SATA: `${PAYMENT_FREQUENCY.SATA.label} (~${PAYMENT_FREQUENCY.SATA.perYear}/year, from 16 June 2026)`,
    BMNP: `${PAYMENT_FREQUENCY.BMNP.label} (${PAYMENT_FREQUENCY.BMNP.perYear}/year)`,
  },
  {
    label: 'Approx. per payment',
    STRC: '~$0.479/share',
    SATA: '~$0.052/share',
    BMNP: '~$0.183/share',
  },
  {
    label: 'How the rate is set',
    STRC: 'Rules-based monthly review tied to a 5-day VWAP framework',
    SATA: 'Discretionary monthly review targeting a $99–$101 range',
    BMNP: 'Fixed at issue',
  },
  {
    label: 'What backs it',
    STRC: '800,000+ Bitcoin treasury',
    SATA: `${STRIVE_BTC_HOLDINGS}+ Bitcoin plus an 18-month cash reserve`,
    BMNP: 'Ethereum staking income via the MAVAN validator network',
  },
  {
    label: 'Position in capital structure',
    STRC: 'Below debt and STRF; above all other preferreds and common stock',
    SATA: 'Top of the stack — Strive is debt-free with one preferred series',
    BMNP: 'Above common stock; cumulative dividends',
  },
];

export default function CompareTable() {
  const tickers = BMNP_ENABLED ? ['STRC', 'SATA', 'BMNP'] : ['STRC', 'SATA'];

  return (
    <div className="mt-12 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-center">{tickers.join(' vs ')} at a Glance</h2>
      <p className="text-sm text-center mb-6" style={{ color: 'var(--text-muted)' }}>
        Same $100 par value, very different structures — here&rsquo;s how they differ.
      </p>
      <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm" style={{ background: 'var(--bg-card)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-muted)' }}></th>
              {tickers.map(t => (
                <th key={t} className="text-left px-4 py-3 text-base font-bold" style={{ color: TICKER_COLOUR[t] }}>{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.label} style={i < ROWS.length - 1 ? { borderBottom: '1px solid var(--border)' } : undefined}>
                <td className="px-4 py-3 font-medium align-top whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{row.label}</td>
                {tickers.map(t => (
                  <td key={t} className="px-4 py-3 align-top leading-6">{row[t]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-center mt-4" style={{ color: 'var(--text-muted)' }}>
        Want the full picture?{' '}
        <Link href="/blog/strc-vs-sata" style={{ color: 'var(--accent-gold)' }}>Read the in-depth STRC vs SATA comparison</Link>
        {BMNP_ENABLED && (
          <>
            {' '}or{' '}
            <Link href="/blog/bmnp-vs-strc-sata" style={{ color: 'var(--accent-gold)' }}>how BMNP compares to both</Link>
          </>
        )}.
      </p>
    </div>
  );
}
