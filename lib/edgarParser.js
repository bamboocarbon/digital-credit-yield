const EDGAR_HEADERS = {
  'User-Agent': 'DigitalCreditYield robin.gillingham@hotmail.co.uk',
  'Accept-Encoding': 'gzip, deflate',
};

const COMPANIES = {
  STRC: { cik: '0001050446', ticker: 'STRC', keywords: ['STRC', 'Stretch Preferred'] },
  SATA: { cik: '0001920406', ticker: 'SATA', keywords: ['SATA'] },
};

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

// Download an 8-K exhibit and extract proceeds amount in $M
export async function parseProceeds(ticker, filing) {
  const { cik, accession, primaryDoc } = filing;
  const accDashes = accession.replace(/-/g, '');
  const url = `https://www.sec.gov/Archives/edgar/data/${cik}/${accDashes}/${primaryDoc}`;

  let text;
  try {
    const res = await fetchEdgar(url);
    text = await res.text();
  } catch {
    return null;
  }

  // Strip HTML tags for easier parsing
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const { keywords } = COMPANIES[ticker];

  // Only process 8-Ks that mention the instrument
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
