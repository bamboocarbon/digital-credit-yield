// Plain-language "how this tool works" sections for the three calculator pages. Rendered in the page HTML
// (not inside the interactive widget) so the explanation is visible to readers and to crawlers.
import Link from 'next/link';
import { PAYMENT_FREQUENCY } from '@/lib/constants';

const Wrap = ({ title, children }) => (
  <section className="max-w-3xl mx-auto mt-10 p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    <div className="text-sm leading-7 space-y-3" style={{ color: 'var(--text-muted)' }}>{children}</div>
  </section>
);
const A = ({ href, children }) => <Link prefetch={false} href={href} style={{ color: 'var(--accent-gold)' }}>{children}</Link>;

export function ProjectorNotes({ ticker }) {
  return (
    <Wrap title="How the projector works">
      <p>
        I built this to answer one question: if I hold {ticker} and keep the dividends working, what does the income and the pot look
        like in a few years? You choose a starting amount (in money, or as a number of shares at the price you paid), a monthly
        contribution, a time horizon from one to twenty years and the share of each dividend you reinvest. The yield is filled in from the
        live rate and price, and you can switch between the announced annual rate and the effective yield, which measures the dividend
        against the price you actually pay rather than against par.
      </p>
      <p>
        The model steps forward one month at a time. Each month it works out the dividends the holding earns, adds the reinvested share
        back into the holding at the same price, and counts the rest as cash income, which is shown separately from the portfolio
        value. The monthly rate allows for how often the instrument really pays: STRC daily since 1 November 2026, SATA and CHAD every
        business day, BMNP and MORE weekly. The other tickers are modelled as monthly payers, a simplification that is slightly generous for the quarterly ones and slightly conservative for the daily ones.
      </p>
      <p>
        It is deliberately simple, and the simplicity is the main limitation. It assumes the yield and the price stay where they are today,
        so it never shows a falling share price or a cut dividend, and it ignores tax and dealing costs. The share price is the real risk
        with these instruments, and a projector can&apos;t forecast it. Treat the output as arithmetic on a stated assumption, not a forecast, and
        read <A href="/risks">the risks page</A> alongside it. For a walk-through of each input, see{' '}
        <A href="/blog/how-to-use-the-growth-projector">how to use the growth projector</A>.
      </p>
    </Wrap>
  );
}

export function VsTreasuriesNotes({ ticker }) {
  const more = ticker === 'MORE';
  return (
    <Wrap title={`How the ${more ? 'gilts' : 'Treasuries'} comparison works`}>
      <p>
        This runs the same investment through the same monthly model three more times, once at each benchmark rate, so you can see
        the income and the portfolio value side by side with {ticker}. Your amount, monthly contribution, time horizon and reinvestment
        share are applied identically to every line, so the only thing that differs is the yield.
      </p>
      <p>
        The benchmark rates are fixed assumptions that I set by hand in mid-October 2026, not live feeds.{' '}
        {more
          ? 'For the sterling comparison I use about 5.4% for UK gilts (roughly the ten-year yield), 4.5% for the best easy-access or cash ISA rates and 1.5% for an ordinary high-street account.'
          : 'For the dollar comparison I use about 5.2% for US Treasuries (roughly the ten-year yield), 4.2% for a high-yield savings account and 0.5% for an ordinary bank account.'}{' '}
        I review them from time to time, so check today&apos;s rates before you rely on the gap. The {ticker} side is live: it uses the current
        announced rate, or the effective yield at today&apos;s price if you choose that.
      </p>
      <p>
        A bigger number for {ticker} is not a free lunch. {more ? 'Gilts are backed by the UK government, ' : 'Treasuries are backed by the US government, '}
        they mature and return your principal, and savings accounts are typically covered by deposit protection. A perpetual preferred stock
        has none of that: the dividend is declared by a board, there is no maturity date, and the price can fall below what you paid. The
        extra yield is the market&apos;s payment for those risks, which is why <A href="/risks">the risks page</A> belongs next to this tool.
        For what the effective yield measures, see <A href="/blog/what-is-effective-yield">effective yield explained</A>.
      </p>
    </Wrap>
  );
}

export function DividendsNotes({ ticker }) {
  const freq = PAYMENT_FREQUENCY[ticker]?.label?.toLowerCase();
  return (
    <Wrap title="How to read the dividend history">
      <p>
        Each row is one payment. The <strong>record date</strong> is the day you must own the shares to qualify, and the <strong>payment
        date</strong> is when the cash arrives, anywhere from the next business day to about ten days later, depending on the issuer. Where an instrument pays daily or weekly there are a
        lot of rows, and the monthly chart adds them up so you can see the income per share month by month.{' '}
        {freq ? `${ticker} currently pays ${freq}.` : ''} Enter your holding size to see what each payment, and each month, is worth to you.
      </p>
      <p>
        The amounts come from the issuers&apos; own announcements and SEC filings, cross-checked against a market data feed. Some series I keep by
        hand because the feeds are unreliable for them: for example STRC&apos;s daily dividends are declared in whole cents in a table Strategy
        publishes about a month ahead, and BMNP&apos;s schedule comes straight from Bitmine&apos;s filings. Payments marked as announced but not yet
        paid are declarations, not guarantees. A board can still change its mind, and for the non-cumulative STRD a skipped payment is lost.
      </p>
      <p>
        If a figure here ever looks wrong, tell me through <A href="/contact">the contact page</A> and I will check it against the filing. For how often
        each instrument pays and why that matters less than people think, see <A href="/blog/monthly-vs-daily-dividends">does payment
        frequency matter?</A>
      </p>
    </Wrap>
  );
}
