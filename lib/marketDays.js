// NYSE full-closure holidays, 2026–2028.
// Source: nyse.com/markets/hours-calendars — extend before Jan 2029.
// Rules applied: Saturday holidays observed Friday (except New Year's Day,
// which is not observed when it falls on a Saturday); Sunday holidays observed Monday.
const NYSE_HOLIDAYS = new Set([
  // 2026
  '2026-01-01', // New Year's Day
  '2026-01-19', // Martin Luther King Jr. Day
  '2026-02-16', // Washington's Birthday
  '2026-04-03', // Good Friday
  '2026-05-25', // Memorial Day
  '2026-06-19', // Juneteenth
  '2026-07-03', // Independence Day (observed — Jul 4 is a Saturday)
  '2026-09-07', // Labor Day
  '2026-11-26', // Thanksgiving Day
  '2026-12-25', // Christmas Day
  // 2027
  '2027-01-01', // New Year's Day
  '2027-01-18', // Martin Luther King Jr. Day
  '2027-02-15', // Washington's Birthday
  '2027-03-26', // Good Friday
  '2027-05-31', // Memorial Day
  '2027-06-18', // Juneteenth (observed — Jun 19 is a Saturday)
  '2027-07-05', // Independence Day (observed — Jul 4 is a Sunday)
  '2027-09-06', // Labor Day
  '2027-11-25', // Thanksgiving Day
  '2027-12-24', // Christmas Day (observed — Dec 25 is a Saturday)
  // 2028
  '2028-01-17', // Martin Luther King Jr. Day (Jan 1 falls on a Saturday — not observed)
  '2028-02-21', // Washington's Birthday
  '2028-04-14', // Good Friday
  '2028-05-29', // Memorial Day
  '2028-06-19', // Juneteenth
  '2028-07-04', // Independence Day
  '2028-09-04', // Labor Day
  '2028-11-23', // Thanksgiving Day
  '2028-12-25', // Christmas Day
]);

// Is the NYSE open today? Evaluated in the exchange's own timezone so a
// late-UTC cron run doesn't roll over to the wrong date.
export function isNyseMarketDay(date = new Date()) {
  const ny = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
  }).formatToParts(date);
  const get = type => ny.find(p => p.type === type).value;
  const weekday = get('weekday');
  if (weekday === 'Sat' || weekday === 'Sun') return false;
  return !NYSE_HOLIDAYS.has(`${get('year')}-${get('month')}-${get('day')}`);
}
