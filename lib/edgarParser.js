const EDGAR_HEADERS = {
  'User-Agent': 'DigitalCreditYield robin.gillingham@hotmail.co.uk',
  'Accept-Encoding': 'gzip, deflate',
};

const COMPANIES = {
  STRC: { cik: '0001050446', ticker: 'STRC', keywords: ['STRC', 'Stretch Preferred'] },
  SATA: { cik: '0001920406', ticker: 'SATA', keywords: ['SATA'] },
  BMNP: { cik: '0001829311', ticker: 'BMNP', keywords: ['BMNP', 'Series A Preferred'] },
  CHAD: { cik: '0001805526', ticker: 'CHAD', keywords: ['CHAD', 'Series C Preferred'] },
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


// ── Strategy (STRK/STRF/STRD/STRC/STRE) weekly ATM + repurchase tables ─────────────────────────
// Strategy's weekly 8-K (body or ex99-1 press release) carries an "ATM Update" table — shares sold,
// notional, NET PROCEEDS, available — per series, and since Jul 2026 a "Repurchase Program Updates"
// table. The cell layout has changed several times (2025 tables had no notional column and wrote
// "$37.5 million"; 2026 tables split "$" and the number into separate cells), so this walks the
// flattened cell text row by row instead of using one regex. Verified against every 8-K Jan 2025 –
// Oct 2026 (see lib/strategyFlow.js). Returns { date, filed, net: {STRK..}, bb: {STRC..} } in $M, or
// null if the filing has no such table (dividend notices, "did not sell any shares" narrative weeks).
const STRATEGY_TICKERS = ['STRK', 'STRF', 'STRD', 'STRC', 'STRE'];
const MONTH_NAMES = 'January|February|March|April|May|June|July|August|September|October|November|December';
const STRATEGY_ROW = /^(STR[KFDCE]|MSTR|Common)\s+(ATM|Stock)\b/i;
const ENTITIES = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };

function flattenHtml(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/[\u00a0\u2009\u200a]/g, ' ')
    .split('\n')
    .map(x => x.trim())
    .filter(x => x && x !== '|');
}

function cellValue(y) {
  const t = y.trim();
  if (t === '-' || t === '—' || t === '–') return 0;
  const m = t.match(/^[$€]?\s*([\d,]+(?:\.\d+)?)\s*(million|billion)?(?:\s*\(\d\))?(?:\s+(?:STR[A-Z]|MSTR)\s*(?:Shares)?)?$/i);
  if (!m) return null;
  let v = parseFloat(m[1].replace(/,/g, ''));
  if (m[2] && m[2].toLowerCase() === 'billion') v *= 1000;
  return v;
}

function sectionOf(tokens, startRe, stopRe) {
  const s = tokens.findIndex(x => startRe.test(x));
  if (s < 0) return null;
  let e = tokens.findIndex((x, i) => i > s && stopRe.test(x));
  if (e < 0) e = tokens.length;
  return tokens.slice(s, e);
}

function tableRows(sec, n) {
  const rows = {};
  let k = 0;
  while (k < sec.length) {
    const m = sec[k].match(STRATEGY_ROW);
    if (m) {
      let key = m[1].toUpperCase();
      if (key === 'COMMON') key = 'MSTR';
      const vals = [];
      let j = k + 1;
      while (j < sec.length && vals.length < n) {
        const y = sec[j];
        if (STRATEGY_ROW.test(y) || y.startsWith('Total')) break;
        if (y === '$' || y === '€' || y === 'Shares' || /^\(\d\)$/.test(y)) { j++; continue; }
        const v = cellValue(y);
        if (v !== null) vals.push(v);
        j++;
      }
      if (!(key in rows)) rows[key] = vals;
      k = j;
      continue;
    }
    k++;
  }
  return rows;
}

function mondayOf(isoDate) {
  const d = new Date(isoDate + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

function reportingPeriod(tokens) {
  const txt = tokens.join(' ');
  const m = txt.match(new RegExp(`(?:During Period|between)\\s+(${MONTH_NAMES})\\s+(\\d+),?\\s+(\\d{4})\\s+(?:to|and)\\s+(${MONTH_NAMES})\\s+(\\d+),?\\s+(\\d{4})`));
  if (!m) return null;
  const iso = (mo, d, y) => new Date(`${mo} ${d}, ${y} 12:00:00 UTC`).toISOString().slice(0, 10);
  return { start: iso(m[1], m[2], m[3]), end: iso(m[4], m[5], m[6]) };
}

export async function parseStrategyWeek(filing) {
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
    const tokens = flattenHtml(text);
    const per = reportingPeriod(tokens);
    const atm = sectionOf(tokens, /^Net Proceeds/, /^(BTC Update|Repurchase Program|USD Reserve|Item 7\.01)/);
    const rep = sectionOf(tokens, /Shares Repurchased|Repurchase Program Update/, /^(USD Reserve|About|Strategy Inc \(Nasdaq)/);
    if (!per || (!atm && !rep)) continue;

    const hasNotional = tokens.some(x => x.includes('Notional'));
    const atmRows = atm ? tableRows(atm, hasNotional ? 4 : 3) : {};
    const repRows = rep ? tableRows(rep, 2) : {};
    const net = {};
    const bb = {};
    for (const k of STRATEGY_TICKERS) {
      const v = atmRows[k];
      if (v?.length) {
        const n = hasNotional ? v[2] : v[1];
        if (n > 0) net[k] = Math.round(n * 10) / 10;
      }
      const b = repRows[k];
      if (b?.length > 1 && b[1] > 0) bb[k] = Math.round(b[1] * 10) / 10;
    }
    return { date: mondayOf(per.start), filed: filing.date, net, ...(Object.keys(bb).length ? { bb } : {}) };
  }
  return null;
}
