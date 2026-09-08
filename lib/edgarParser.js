const EDGAR_HEADERS = {
  'User-Agent': 'DigitalCreditYield robin.gillingham@hotmail.co.uk',
  'Accept-Encoding': 'gzip, deflate',
};

const COMPANIES = {
  STRC: { cik: '0001050446', ticker: 'STRC', keywords: ['STRC', 'Stretch Preferred'] },
  SATA: { cik: '0001920406', ticker: 'SATA', keywords: ['SATA'] },
  BMNP: { cik: '0001829311', ticker: 'BMNP', keywords: ['BMNP', 'Series A Preferred'] },
};

const SATA_PAR_VALUE = 100;

async function fetchEdgar(url) {
  const res = await fetch(url, { headers: EDGAR_HEADERS });
  if (!res.ok) throw new Error(`EDGAR ${res.status}: ${url}`);
  return res;
}

// Get list of 8-K filings filed after a given date
export async function getRecentFilings(ticker, afterDate) {
  const { cik } = COMPANIES[ticker];
  const url = `https://data.sec.gov/submissions/CIK${cik}.json`;
  const res = await fetchEdgar(url);
  const data = await res.json();

  const { form, filingDate, accessionNumber, primaryDocument } = data.filings.recent;
  const results = [];

  for (let i = 0; i < form.length; i++) {
    if (form[i] !== '8-K') continue;
    if (afterDate && filingDate[i] <= afterDate) break; // filings are newest-first
    results.push({
      date: filingDate[i],
      accession: accessionNumber[i],
      primaryDoc: primaryDocument[i],
      cik: cik.replace(/^0+/, ''),
    });
  }

  return results;
}

// Every document filed as part of this accession, primaryDoc first (the
// common case — cheapest, and where STRC/SATA's proceeds language usually
// is) then any exhibits (ex10-1.htm, ex99-1.htm, ...). Found 2026-09-08
// auditing why BMNP had never once auto-updated (its only entry was a
// one-off manual seed, see scripts/addBmnpMoneyFlow.mjs): the press
// release carrying a company's actual financial disclosure is very often
// filed as an *exhibit* to the 8-K, not in the 8-K body itself, and
// parseProceeds previously only ever looked at primaryDoc. Excludes the
// XBRL viewer's own per-fact R#.htm pages and the EDGAR index pages
// themselves, neither of which contain filing prose.
async function listFilingDocuments(cik, accDashes, primaryDoc) {
  try {
    const url = `https://www.sec.gov/Archives/edgar/data/${cik}/${accDashes}/index.json`;
    const res = await fetchEdgar(url);
    const data = await res.json();
    const names = data.directory.item
      .map((i) => i.name)
      .filter((name) => /\.htm$/i.test(name) && !/^R\d+\.htm$/i.test(name) && !/-index/i.test(name));
    const exhibits = names.filter((n) => n !== primaryDoc);
    return [primaryDoc, ...exhibits];
  } catch {
    return [primaryDoc];
  }
}

// Applies the ticker's keyword gate + all known proceeds patterns to one
// document's plain text. Returns the parsed $M value, or null if this
// document doesn't contain it (not an error — the caller tries the next
// document in the filing).
function matchProceeds(plain, ticker) {
  const { keywords } = COMPANIES[ticker];

  // Only process documents that mention the instrument
  if (!keywords.some(kw => plain.includes(kw))) return null;

  // Match patterns like "aggregate gross proceeds of approximately $1.18 billion"
  // or "net proceeds of approximately $225 million"
  const patterns = [
    /aggregate\s+gross\s+proceeds\s+of\s+approximately\s+\$([0-9,.]+)\s*(million|billion)/i,
    /gross\s+proceeds\s+of\s+approximately\s+\$([0-9,.]+)\s*(million|billion)/i,
    /net\s+proceeds\s+of\s+approximately\s+\$([0-9,.]+)\s*(million|billion)/i,
    /received\s+(?:aggregate\s+)?(?:gross\s+)?proceeds\s+of\s+approximately\s+\$([0-9,.]+)\s*(million|billion)/i,
    /\$([0-9,.]+)\s*(million|billion)\s+in\s+(?:aggregate\s+)?(?:gross\s+)?proceeds/i,
  ];

  for (const pattern of patterns) {
    const match = plain.match(pattern);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      const unit = match[2].toLowerCase();
      const valueMillion = unit === 'billion' ? amount * 1000 : amount;
      return Math.round(valueMillion);
    }
  }

  // Fallback: since ~Jun 2026, Strive's weekly 8-Ks stopped stating a dollar
  // proceeds figure and instead report a holdings table with a "SATA Stock"
  // row (shares outstanding: prior, current, change). Back the raise out of
  // the share-count change at SATA's $100 par value.
  if (ticker === 'SATA') {
    const shareMatch = plain.match(/SATA\s+Stock\s+([\d,]+)\s+([\d,]+)\s+([\d,]+|&#8212;|—)/i);
    if (shareMatch) {
      const changeToken = shareMatch[3];
      if (/^[\d,]+$/.test(changeToken)) {
        const shareDelta = parseInt(changeToken.replace(/,/g, ''), 10);
        if (shareDelta > 0) {
          const valueMillion = (shareDelta * SATA_PAR_VALUE) / 1_000_000;
          return Math.round(valueMillion * 10) / 10;
        }
      }
    }
  }

  return null;
}

// Downloads an 8-K's documents (body, then any exhibits) and extracts a
// proceeds amount in $M from whichever one has it.
export async function parseProceeds(ticker, filing) {
  const { cik, accession, primaryDoc } = filing;
  const accDashes = accession.replace(/-/g, '');
  const docs = await listFilingDocuments(cik, accDashes, primaryDoc);

  for (const doc of docs) {
    let text;
    try {
      const res = await fetchEdgar(`https://www.sec.gov/Archives/edgar/data/${cik}/${accDashes}/${doc}`);
      text = await res.text();
    } catch {
      continue;
    }
    const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const value = matchProceeds(plain, ticker);
    if (value !== null) return value;
  }

  return null;
}

// Format a filing date as a week label e.g. "Jun 2 '26"
export function weekLabel(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z');
  // Round to nearest Monday
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  const mon = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
  const date = d.getUTCDate();
  return `${mon} ${date}`;
}

export function weekDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z');
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}
