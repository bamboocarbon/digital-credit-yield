import Link from 'next/link';
import { ASSET_RATES, PAYMENT_FREQUENCY, BMNP_ENABLED, STRIVE_BTC_HOLDINGS, STRATEGY_BTC_HOLDINGS, BITMINE_ETH_HOLDINGS, DFDV_SOL_HOLDINGS, PAR_VALUE } from '@/lib/constants';

const TICKER_COLOUR = { STRC: '#4ade80', SATA: '#3b82f6', BMNP: '#fde047', CHAD: '#f472b6' };

const ROWS = [
  {
    label: 'Issuer',
    STRC: 'Strategy (Nasdaq: MSTR)',
    SATA: 'Strive (Nasdaq: ASST)',
    BMNP: 'Bitmine (NYSE: BMNR)',
    CHAD: 'DeFi Development Corp. (Nasdaq: DFDV)',
  },
  {
    label: 'Stated/par value',
    STRC: '$100',
    SATA: '$100',
    BMNP: '$100',
    CHAD: '$10',
  },
  {
    label: 'Annual dividend rate',
    STRC: `${ASSET_RATES.STRC.toFixed(2)}%`,
    SATA: `${ASSET_RATES.SATA.toFixed(2)}%`,
    BMNP: `${ASSET_RATES.BMNP.toFixed(2)}% (fixed)`,
    CHAD: `${ASSET_RATES.CHAD.toFixed(2)}%`,
  },
  {
    label: 'Payment frequency',
    STRC: `${PAYMENT_FREQUENCY.STRC.label} (${PAYMENT_FREQUENCY.STRC.perYear}/year)`,
    SATA: `${PAYMENT_FREQUENCY.SATA.label} (~${PAYMENT_FREQUENCY.SATA.perYear}/year)`,
    BMNP: `${PAYMENT_FREQUENCY.BMNP.label} (${PAYMENT_FREQUENCY.BMNP.perYear}/year)`,
    CHAD: `${PAYMENT_FREQUENCY.CHAD.label} (~${PAYMENT_FREQUENCY.CHAD.perYear}/year)`,
  },
  {
    label: 'Approx. per payment',
    STRC: '~$0.479/share',
    SATA: '~$0.052/share',
    BMNP: '~$0.183/share',
    CHAD: '~$0.0052/share',
  },
  {
    label: 'How the rate is set',
    STRC: 'Published 5-day VWAP framework, currently overridden — held flat since Jul 2026',
    SATA: 'Discretionary monthly review targeting a $99–$101 range',
    BMNP: 'Fixed at issue',
    CHAD: 'Discretionary review, managed toward a long-term price range',
  },
  {
    label: 'What backs it',
    STRC: `${STRATEGY_BTC_HOLDINGS}+ Bitcoin treasury`,
    SATA: `${STRIVE_BTC_HOLDINGS}+ Bitcoin plus an 18-month cash reserve`,
    BMNP: `${BITMINE_ETH_HOLDINGS}+ Ethereum treasury, staking income via the MAVAN validator network`,
    CHAD: `${DFDV_SOL_HOLDINGS}+ Solana treasury, funded by ongoing capital raises`,
  },
  {
    label: 'Position in capital structure',
    STRC: 'Below debt and STRF; above all other preferreds and common stock',
    SATA: 'Top of the stack — Strive is debt-free with one preferred series',
    BMNP: 'Above common stock; cumulative dividends',
    CHAD: 'Below company debt; above common stock; cumulative dividends',
  },
];

export default function CompareTable() {
  const tickers = BMNP_ENABLED ? ['STRC', 'SATA', 'BMNP', 'CHAD'] : ['STRC', 'SATA', 'CHAD'];

  return (
    <div className="mt-12 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-center">{tickers.join(' vs ')} at a Glance</h2>
      <p className="text-sm text-center mb-6" style={{ color: 'var(--text-muted)' }}>
        Different issuers, different structures — down to the par value itself: {tickers.map(t => `$${PAR_VALUE[t]} for ${t}`).join(', ')}.
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
        <Link href="/blog/strc-vs-sata" prefetch={false} style={{ color: 'var(--accent-gold)' }}>Read the in-depth STRC vs SATA comparison</Link>
        {BMNP_ENABLED && (
          <>
            {' '}or{' '}
            <Link href="/blog/bmnp-vs-strc-sata" prefetch={false} style={{ color: 'var(--accent-gold)' }}>how BMNP compares to both</Link>
          </>
        )}.
      </p>
    </div>
  );
}
