import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');

function filePath(ticker) {
  return join(DATA_DIR, `dividends-${ticker}.json`);
}

export async function readDividends(ticker) {
  try {
    const raw = await readFile(filePath(ticker), 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writeDividends(ticker, entries) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(filePath(ticker), JSON.stringify(entries, null, 2));
}

export function mergeDividends(existing, incoming, ticker) {
  const result = [...existing];
  for (const entry of incoming) {
    // SATA pays daily, and the daily amount is constant for the whole calendar
    // month (monthly total ÷ business days that month) — so the gap+amount
    // heuristic below would treat nearly every day in the month as a duplicate
    // of an earlier one. Dedup SATA by exact date only.
    const isDuplicate = ticker === 'SATA'
      ? result.some(e => e.date === entry.date)
      // Treat as a duplicate only if both the date gap AND amount match — this way
      // biweekly payments (14 days apart but different amounts) are kept as separate
      // entries, while ex-dividend / payment-date pairs for the same distribution
      // (same amount, ~14 days apart) are correctly deduplicated.
      : result.some(e => {
          const gap = Math.abs(new Date(e.date) - new Date(entry.date)) / 86400000;
          return gap <= 20 && Math.abs(e.amount - entry.amount) < 0.0001;
        });
    if (!isDuplicate) result.push(entry);
  }
  return result.sort((a, b) => a.date.localeCompare(b.date));
}
