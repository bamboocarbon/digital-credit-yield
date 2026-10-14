// Pulls the primary-source filings the daily regulatory scan can't reach itself (its cloud sandbox's
// egress proxy blocks sec.gov and UK RNS hosts) and writes them into data/scan-feed/ as JSON, so the
// scan can read them straight from the cloned repo. Run by .github/workflows/scan-feed.yml ahead of the
// scan; safe to run by hand:  node scripts/scanFeed.mjs
//   data/scan-feed/sec.json      recent filings (8-K/10-Q/10-K/424B/FWP) for MSTR, ASST, BMNR, DFDV, with text
//   data/scan-feed/swc-rns.json  recent RNS announcements for The Smarter Web Company (MORE's issuer), full text
//   data/scan-feed/meta.json     when each part was fetched + any errors (the scan should flag a stale/failed feed)
import { mkdir, writeFile } from 'node:fs/promises';

const UA = 'Mozilla/5.0 (compatible; DCY-scan-feed; robin.gillingham@hotmail.co.uk)';
const OUT = new URL('../data/scan-feed/', import.meta.url);
const DAYS = 14;
const MAX_TEXT = 30000;
const since = new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 10);

const CIKS = { MSTR: '0001050446', ASST: '0001920406', BMNR: '0001829311', DFDV: '0001805526' };
const FORMS = new Set(['8-K', '10-Q', '10-K', '424B5', '424B2', 'FWP']);

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url, asJson = false) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: asJson ? 'application/json' : '*/*' } });
      if (res.ok) return asJson ? res.json() : res.text();
      if (res.status !== 429 && res.status < 500) throw new Error(`HTTP ${res.status}`);
    } catch (e) { if (i === 2) throw new Error(`${url}: ${e.message}`); }
    await sleep(1500 * (i + 1));
  }
  throw new Error(`${url}: failed after retries`);
}
const decode = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#8217;|&rsquo;/g, '’').replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"').replace(/&pound;/g, '£').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
const toText = html => decode(html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

async function secFeed() {
  const out = {}; const errors = [];
  for (const [name, cik] of Object.entries(CIKS)) {
    try {
      const sub = await get(`https://data.sec.gov/submissions/CIK${cik}.json`, true);
      const r = sub.filings.recent; const filings = [];
      for (let i = 0; i < r.form.length; i++) {
        if (r.filingDate[i] < since || !FORMS.has(r.form[i])) continue;
        const acc = r.accessionNumber[i]; const base = `https://www.sec.gov/Archives/edgar/data/${+cik}/${acc.replace(/-/g, '')}/`;
        const f = { form: r.form[i], date: r.filingDate[i], accession: acc, url: base + r.primaryDocument[i], docs: [] };
        if (r.form[i] === '8-K') {
          try {
            const idx = await get(base + 'index.json', true);
            const names = [r.primaryDocument[i], ...idx.directory.item.map(x => x.name).filter(n => /ex.?99.*\.htm$/i.test(n))];
            for (const n of [...new Set(names)].slice(0, 4)) {
              await sleep(150);
              f.docs.push({ name: n, url: base + n, text: toText(await get(base + n)).slice(0, MAX_TEXT) });
            }
          } catch (e) { errors.push(`${name} ${acc}: ${e.message}`); }
        }
        filings.push(f); await sleep(150);
      }
      out[name] = { cik, filings };
    } catch (e) { errors.push(`${name}: ${e.message}`); }
  }
  return { out, errors };
}

async function swcFeed() {
  const errors = []; const items = [];
  const page = await get('https://www.investegate.co.uk/company/SWC');
  const rows = [...page.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(m => m[1]);
  for (const row of rows) {
    const link = row.match(/href="(https:\/\/www\.investegate\.co\.uk\/announcement\/[^"]+)"/);
    const when = toText(row).match(/(\d{2} [A-Z][a-z]{2} \d{4}) (\d{2}:\d{2} [AP]M)/);
    if (!link || !when) continue;
    const date = new Date(`${when[1]} UTC`).toISOString().slice(0, 10);
    if (date < since) continue;
    items.push({ date, time: when[2], headline: toText(row).replace(when[0], '').replace(/^\s*(RNS|Reach|PRN|GNW)\s*/i, '').trim(), url: link[1] });
  }
  for (const it of items) {
    try {
      await sleep(300);
      const t = toText(await get(it.url));
      const i = t.indexOf('Disclaimer*');
      it.text = (i >= 0 ? t.slice(i) : t).slice(0, MAX_TEXT);
    } catch (e) { errors.push(`SWC ${it.url}: ${e.message}`); }
  }
  return { out: { issuer: 'The Smarter Web Company PLC (SWC)', source: 'investegate.co.uk', items }, errors };
}

await mkdir(OUT, { recursive: true });
const meta = { generatedAt: new Date().toISOString(), windowDays: DAYS, errors: [] };
for (const [file, fn, key] of [['sec.json', secFeed, 'sec'], ['swc-rns.json', swcFeed, 'swc']]) {
  try {
    const { out, errors } = await fn();
    await writeFile(new URL(file, OUT), JSON.stringify({ fetchedAt: new Date().toISOString(), ...out }, null, 1) + '\n');
    meta[key] = { ok: true, items: key === 'sec' ? Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.filings.length])) : out.items.length };
    meta.errors.push(...errors);
  } catch (e) { meta[key] = { ok: false }; meta.errors.push(`${file}: ${e.message}`); }
}
await writeFile(new URL('meta.json', OUT), JSON.stringify(meta, null, 1) + '\n');
console.log(JSON.stringify(meta));
if (!meta.sec?.ok && !meta.swc?.ok) process.exit(1);
