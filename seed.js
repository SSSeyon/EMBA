// Seed data for Seyon Hunga EMBA Admissions 2027 tracker.
// Written once on first launch. Never overwritten on redeploy.
// Classic script (no ES modules) so the app also works opened from file://.

const SEED_VERSION = 1;

const t = (id, label, due = null) => ({ id, label, due, done: false });

// Per-school task template. Cloned for each school.
const schoolTasks = (deadline) => [
  t('research', 'Research programme and confirm dates', null),
  t('waiver', 'Secure GMAT/GRE waiver', null),
  t('para', 'Write school-specific paragraph', null),
  t('essay', 'Adapt personal statement to essay prompt', null),
  t('recs', 'Brief recommenders', null),
  t('scholarship', 'Submit scholarship application', null),
  t('submit', 'Submit application', deadline),
];

const SCHOOLS = [
  {
    id: 'cambridge-emba',
    name: 'Cambridge Judge EMBA',
    geo: 'Europe',
    priority: 'HIGH',
    waiver: 'Amber',
    waiverNote: 'Post-interview waiver. 2:1 degree satisfies academic requirement.',
    tuitionLocal: 98100, ccy: 'GBP', tuitionUsd: 124587,
    totalUsd: 133668,
    duration: '20 months',
    start: 'Sep 2027',
    deadline: '2026-11-15',
    deadlineNote: 'R1 estimate for Sep 2027 start — verify with Judge',
    estimated: true,
    flag: 'This deadline is an estimate for the Sep 2027 intake, not a confirmed date. Contact Cambridge Judge admissions to confirm round dates.',
    scholarship: 'Up to 50% of fees. Apply simultaneously with programme application.',
    scholarshipTiming: 'Simultaneously with application',
  },
  {
    id: 'insead-gemba',
    name: 'INSEAD GEMBA',
    geo: 'Europe',
    priority: 'HIGH',
    waiver: 'Green',
    waiverNote: 'Own Executive Test — no GMAT/GRE needed.',
    tuitionLocal: 142150, ccy: 'EUR', tuitionUsd: 153522,
    totalUsd: 177552,
    duration: '14–17 months',
    start: 'Nov 2027',
    deadline: '2027-02-15',
    deadlineNote: 'R1 estimate for Nov 2027 intake — confirm with INSEAD',
    estimated: true,
    scholarship: '~60% of class receive awards. Average ~10% of tuition. Diversity Scholarship and Financial Fellowship.',
    scholarshipTiming: 'Post-admission (up to 2 awards)',
  },
  {
    id: 'imd-emba',
    name: 'IMD EMBA',
    geo: 'Europe',
    priority: 'HIGH',
    waiver: 'Amber',
    waiverNote: 'Waiver letter required. Strong CFA and seniority case.',
    tuitionLocal: 125000, ccy: 'CHF', tuitionUsd: 140000,
    totalUsd: 170000,
    duration: '15–18 months',
    // IMD publishes its two start dates even though it has no deadlines:
    // 20 September and 25 April. "Rolling" was true but useless — you
    // cannot count back six months from a word.
    start: 'Apr 2027 / Sep 2027',
    deadline: '2026-09-15',
    deadlineNote: 'Round 5 — confirm it feeds a 2027 start',
    scholarship: 'Merit-based scholarships. Contact IMD financial aid.',
    scholarshipTiming: 'Contact IMD financial aid',
  },
  {
    id: 'oxford-said',
    name: 'Oxford Saïd EMBA',
    geo: 'Europe',
    priority: 'HIGH',
    waiver: 'Amber',
    waiverNote: 'Post-interview waiver. Apply before interview stage.',
    tuitionLocal: 132420, ccy: 'GBP', tuitionUsd: 168173,
    totalUsd: 183268,
    duration: '22–24 months',
    start: 'Jan 2027 / Sep 2027',
    deadline: '2026-09-30',
    deadlineNote: 'Confirm R1 date with admissions',
    estimated: true,
    scholarship: "Director's Awards: up to 30% of fees. Strong fit given African finance background.",
    scholarshipTiming: 'At point of programme application',
  },
  {
    id: 'lbs-emba',
    name: 'LBS EMBA',
    geo: 'Europe',
    priority: 'HIGH',
    waiver: 'Amber',
    waiverNote: 'Waiver letter required. Strong CFA and seniority case.',
    tuitionLocal: 134950, ccy: 'GBP', tuitionUsd: 171387,
    totalUsd: 181533,
    duration: '17–22 months',
    // Two streams, and the difference is the whole decision: September is
    // in-person fortnightly, January is blended and roughly half the days.
    start: 'Jan 2027 / Sep 2027',
    deadline: '2026-09-30',
    deadlineNote: 'Confirm R1 date with admissions',
    estimated: true,
    scholarship: 'Merit scholarships for self-sponsored applicants.',
    scholarshipTiming: 'Post-offer',
  },
  {
    id: 'trium',
    name: 'TRIUM Global EMBA',
    geo: 'Global (NYU/LSE/HEC)',
    priority: 'HIGH',
    waiver: 'Amber',
    waiverNote: 'Waiver letter required. Strong CFA and seniority case.',
    tuitionLocal: 208080, ccy: 'USD', tuitionUsd: 208080,
    totalUsd: 223330,
    duration: '18 months',
    start: 'Sep 2027',
    deadline: '2026-09-30',
    deadlineNote: 'Confirm R1 date with admissions',
    estimated: true,
    scholarship: 'Contact financial aid. Diversity awards available.',
    scholarshipTiming: 'Contact financial aid',
  },
  {
    id: 'iese-gemba',
    name: 'IESE Global EMBA',
    geo: 'Europe',
    priority: 'HIGH',
    waiver: 'Amber',
    waiverNote: 'Waiver letter required. Strong CFA and seniority case.',
    tuitionLocal: 138000, ccy: 'EUR', tuitionUsd: 149040,
    totalUsd: 176180,
    duration: '17–18 months',
    start: 'Feb 2027',
    deadline: '2026-10-15',
    deadlineNote: 'Confirm R1 date',
    estimated: true,
    scholarship: 'Dedicated Financial Aid Office.',
    scholarshipTiming: 'Post-admission',
  },
  {
    id: 'booth-emba',
    name: 'Chicago Booth EMBA (London)',
    geo: 'US/Global',
    priority: 'HIGH',
    waiver: 'Green',
    waiverNote: 'No GMAT/GRE required.',
    tuitionLocal: 182500, ccy: 'USD', tuitionUsd: 182500,
    totalUsd: 187500,
    duration: '21–22 months',
    start: 'Sep 2027',
    deadline: '2026-10-15',
    deadlineNote: 'Confirm R1 date',
    estimated: true,
    scholarship: 'Limited information. Contact financial aid office.',
    scholarshipTiming: 'Contact financial aid',
  },
  {
    id: 'cambridge-global',
    name: 'Cambridge Global EMBA',
    geo: 'Europe',
    priority: 'HIGH',
    waiver: 'Amber',
    waiverNote: 'Post-interview waiver. 2:1 degree satisfies academic requirement.',
    tuitionLocal: 107400, ccy: 'GBP', tuitionUsd: 136398,
    totalUsd: 145479,
    duration: '20 months',
    start: 'Jan 2027',
    deadline: '2026-10-31',
    deadlineNote: 'Confirm R1 date',
    estimated: true,
    scholarship: 'Up to 50% of fees. Apply simultaneously with programme application.',
    scholarshipTiming: 'Simultaneously with application',
  },
  {
    id: 'wharton-emba',
    name: 'Wharton EMBA',
    geo: 'US/Global',
    priority: 'AMBER',
    waiver: 'Red',
    waiverNote: 'GMAT, GRE or EA mandatory. Sit the Executive Assessment.',
    tuitionLocal: 243000, ccy: 'USD', tuitionUsd: 243000,
    totalUsd: 253000,
    duration: '24 months',
    start: '~May 2027',
    deadline: '2026-11-30',
    deadlineNote: 'Confirm 2027 dates',
    estimated: true,
    scholarship: 'Merit-based. Contact Wharton financial aid.',
    scholarshipTiming: 'Contact financial aid',
  },
  {
    id: 'columbia-lbs',
    name: 'Columbia/LBS EMBA-Global',
    geo: 'US/Global',
    priority: 'AMBER',
    waiver: 'Amber',
    waiverNote: 'Waiver letter required. Strong CFA and seniority case.',
    tuitionLocal: 238800, ccy: 'USD', tuitionUsd: 238800,
    totalUsd: 249050,
    duration: '20 months',
    start: 'May 2027',
    deadline: '2026-11-30',
    deadlineNote: 'Confirm 2027 dates',
    estimated: true,
    scholarship: 'Merit scholarships available. Contact CBS/LBS financial aid.',
    scholarshipTiming: 'Contact financial aid',
  },
  {
    id: 'kellogg-emba',
    name: 'Kellogg EMBA',
    geo: 'US/Global',
    priority: 'AMBER',
    waiver: 'Green',
    waiverNote: 'No GMAT/GRE required.',
    tuitionLocal: 248472, ccy: 'USD', tuitionUsd: 248472,
    totalUsd: 253472,
    duration: '~22 months',
    start: 'Jan 2027 / Sep 2027',
    deadline: '2026-11-30',
    deadlineNote: 'Confirm 2027 dates',
    estimated: true,
    scholarship: 'Merit scholarships. Contact financial aid.',
    scholarshipTiming: 'Contact financial aid',
  },
  {
    id: 'mit-sloan',
    name: 'MIT Sloan Fellows',
    geo: 'US',
    priority: 'AMBER',
    waiver: 'Green',
    waiverNote: 'No GMAT/GRE required.',
    tuitionLocal: 161663, ccy: 'USD', tuitionUsd: 161663,
    totalUsd: 194413,
    duration: '12 months',
    start: '~Jul 2027',
    deadline: '2026-11-30',
    deadlineNote: 'Confirm 2027 dates',
    estimated: true,
    scholarship: 'Fellowship funding available. Contact admissions.',
    scholarshipTiming: 'Contact admissions',
  },
  {
    id: 'hec-paris',
    name: 'HEC Paris EMBA',
    geo: 'Europe',
    priority: 'STANDARD',
    waiver: 'Green',
    waiverNote: 'Own HEC admissions test accepted — no GMAT/GRE.',
    tuitionLocal: 110000, ccy: 'EUR', tuitionUsd: 118800,
    totalUsd: 128800,
    duration: '15–18 months',
    // HEC runs six intakes a year; these are the two Paris ones that fit a
    // 2027 start. Add the others in the start-window editor if you want
    // them — the rolling apply-by is generated per window.
    start: 'Mar 2027 / Sep 2027',
    deadline: '2026-12-31',
    deadlineNote: 'Rolling',
    estimated: true,
    scholarship: 'Merit awards available. Tuition figure is the least reliable data point — verify directly.',
    scholarshipTiming: 'Contact financial aid',
    flag: 'Verify tuition directly with HEC Paris.',
  },
  {
    id: 'escp-emba',
    name: 'ESCP EMBA',
    geo: 'Europe',
    priority: 'STANDARD',
    waiver: 'Green',
    waiverNote: 'Own ESCP admissions test accepted — no GMAT/GRE.',
    tuitionLocal: 93000, ccy: 'EUR', tuitionUsd: 100440,
    totalUsd: 108791,
    duration: '18–34 months',
    start: 'Jan 2027 / Sep 2027',
    deadline: '2026-12-31',
    deadlineNote: 'Rolling',
    estimated: true,
    scholarship: 'Merit awards available. Contact ESCP financial aid.',
    scholarshipTiming: 'Contact financial aid',
  },
  {
    id: 'sda-bocconi',
    name: 'SDA Bocconi EMBA',
    geo: 'Europe',
    priority: 'STANDARD',
    waiver: 'Green',
    waiverNote: 'Own SDA Bocconi admissions test accepted — no GMAT/GRE.',
    tuitionLocal: 62000, ccy: 'EUR', tuitionUsd: 66960,
    totalUsd: 74960,
    duration: '18 months',
    start: 'Late 2027',
    deadline: '2026-12-31',
    deadlineNote: 'Rolling',
    estimated: true,
    scholarship: 'Merit scholarships available. Contact financial aid.',
    scholarshipTiming: 'Contact financial aid',
  },
  {
    id: 'imperial-emba',
    name: 'Imperial College EMBA',
    geo: 'Europe',
    priority: 'STANDARD',
    waiver: 'Green',
    waiverNote: 'No GMAT/GRE required.',
    tuitionLocal: 84500, ccy: 'GBP', tuitionUsd: 107315,
    totalUsd: 119315,
    duration: '22–23 months',
    start: 'Sep/Oct 2027',
    deadline: '2026-12-31',
    deadlineNote: 'Rolling',
    estimated: true,
    scholarship: 'African Future Leader (£20k) and Black Future Leaders (up to 50% of fees).',
    scholarshipTiming: 'Verify EMBA eligibility first',
    flag: 'Confirm whether scholarships apply to the EMBA or only the Full-Time MBA.',
  },
  {
    id: 'manchester-gemba',
    name: 'Manchester Global EMBA',
    geo: 'Europe',
    priority: 'STANDARD',
    waiver: 'Green',
    waiverNote: 'Manchester Admissions Test accepted — no GMAT/GRE.',
    tuitionLocal: 34000, ccy: 'GBP', tuitionUsd: 43180,
    totalUsd: 48180,
    duration: '2 years',
    start: 'Jan 2027 / Jul 2027',
    deadline: '2026-12-31',
    deadlineNote: 'Rolling',
    estimated: true,
    scholarship: 'Partial scholarships available. Contact financial aid.',
    scholarshipTiming: 'Contact financial aid',
  },
];

const STEPS = [
  {
    id: 'step1', num: '1', name: 'School shortlisting',
    detail: '18 schools selected. Esade removed at your request.',
    tasks: [{ ...t('s1a', 'Finalise shortlist', null), done: true }],
  },
  {
    id: 'step2', num: '2', name: 'GMAT/GRE waiver strategy',
    detail: 'All 18 schools categorised Green/Amber/Red. Wharton requires the Executive Assessment.',
    tasks: [{ ...t('s2a', 'Produce waiver strategy per school', null), done: true }],
  },
  {
    id: 'step3', num: '3', name: 'Funding and scholarship research',
    detail: '13 funding sources mapped across loans, school awards and external bodies.',
    tasks: [{ ...t('s3a', 'Complete funding research', null), done: true }],
  },
  {
    id: 'step4', num: '4', name: 'CV tailoring',
    detail: 'CV rewritten for EMBA admissions. Four items still outstanding before it is submission-ready.',
    tasks: [
      { ...t('s4a', 'Rewrite CV for EMBA admissions', null), done: true },
      t('s4b', 'Add LinkedIn URL', '2026-08-01'),
      t('s4c', 'Add board memberships and advisory roles', '2026-08-01'),
      t('s4d', 'Add professional association memberships', '2026-08-01'),
      t('s4e', 'Add team size at MBO Capital', '2026-08-01'),
    ],
  },
  {
    id: 'step5a', num: '5a', name: 'Master personal statement',
    detail: 'Six-section master statement plus adaptation guide for all 18 schools.',
    tasks: [{ ...t('s5aa', 'Write master personal statement', null), done: true }],
  },
  {
    id: 'step5b', num: '5b', name: 'Financial comparison workbook',
    detail: 'Five-sheet Excel workbook: costs, ranking, deadlines, FX, funding sources.',
    tasks: [
      { ...t('s5ba', 'Build Excel workbook', null), done: true },
      t('s5bb', 'Verify HEC Paris tuition directly', '2026-08-15'),
    ],
  },
  {
    id: 'step5c', num: '5c', name: 'School-specific paragraphs',
    detail: '100–150 words per school referencing faculty, clubs, alumni or curriculum.',
    tasks: [t('s5ca', 'Write paragraphs for all 18 schools', '2026-08-31')],
  },
  {
    id: 'step5d', num: '5d', name: 'School-specific essays',
    detail: 'Adapt the master statement to each prompt and word limit.',
    tasks: [t('s5da', 'Adapt essays per school prompt', '2026-09-10')],
  },
  {
    id: 'step6', num: '6', name: 'Interview preparation',
    detail: 'Common EMBA questions, school-specific formats, mock Q&A.',
    tasks: [t('s6a', 'Prepare interview material', '2026-10-31')],
  },
];

const ACTIONS = [
  t('a1', 'Apply to Cambridge Judge EMBA (Sep 2027 start)', '2026-11-15'),
  t('a2', 'Request recommenders — allow 6+ weeks', '2026-08-01'),
  t('a3', 'Register for the Executive Assessment (Wharton)', '2026-08-15'),
  t('a4', 'Add LinkedIn URL, board roles and memberships to CV', '2026-08-01'),
  t('a5', 'Verify HEC Paris tuition directly', '2026-08-15'),
  t('a6', 'Contact LBS, Oxford and TRIUM to confirm 2027 round deadlines', '2026-08-10'),
  t('a7', 'Contact Imperial re EMBA scholarship eligibility', '2026-08-10'),
  t('a8', 'Apply to Prodigy Finance and Lendwise on first offer', null),
];

const FUNDING = [
  { name: 'Prodigy Finance', type: 'Loan', detail: 'No collateral or co-signer. Covers Nigeria. No repayments while studying.', action: 'Apply on first offer letter' },
  { name: 'Lendwise', type: 'Loan', detail: 'UK-regulated, FCA. Fixed rates.', action: 'Apply on first offer letter' },
  { name: "Oxford Director's Awards", type: 'Scholarship', detail: 'Up to 30% of fees.', action: 'Apply at point of application' },
  { name: 'Cambridge Scholarships', type: 'Scholarship', detail: 'Up to 50% of fees.', action: 'Apply with programme application' },
  { name: 'INSEAD Diversity / Financial Fellowship', type: 'Scholarship', detail: '~60% of class receive awards.', action: 'Apply post-admission' },
  { name: 'Imperial African Future Leader', type: 'Scholarship', detail: '£20,000 award.', action: 'Confirm EMBA eligibility' },
  { name: 'Imperial Black Future Leaders', type: 'Scholarship', detail: 'Up to 50% of fees.', action: 'Confirm EMBA eligibility' },
  { name: 'LBS Merit Scholarships', type: 'Scholarship', detail: 'For self-sponsored applicants.', action: 'Apply post-offer' },
  { name: 'IESE Financial Aid', type: 'Scholarship', detail: 'Dedicated Financial Aid Office.', action: 'Apply post-admission' },
  { name: 'Tony Elumelu Foundation', type: 'External', detail: 'Pan-African leadership focus.', action: 'Research current cycle' },
  { name: 'AfDB Fellowships', type: 'External', detail: 'Supports African professionals.', action: 'Contact AfDB directly' },
  { name: 'Chevening Scholarships', type: 'External', detail: 'UK Government. UK schools only.', action: 'Confirm EMBA eligibility' },
  { name: 'Commonwealth Scholarship', type: 'External', detail: 'Nigerian citizens eligible.', action: 'Confirm EMBA eligibility' },
];

// Country each programme is based in. Used to group the country ranking and
// to label it on the card — a rank of 2 means nothing without "of what".
// Joint programmes are run across countries, so they sit outside that cut.
const COUNTRY = {
  'cambridge-emba': 'UK',     'insead-gemba': 'France', 'imd-emba': 'Switzerland',
  'oxford-said': 'UK',        'lbs-emba': 'UK',         'trium': '',
  'iese-gemba': 'Spain',      'booth-emba': 'US',       'cambridge-global': 'UK',
  'wharton-emba': 'US',       'columbia-lbs': '',       'kellogg-emba': 'US',
  'mit-sloan': 'US',          'hec-paris': 'France',    'escp-emba': 'France',
  'sda-bocconi': 'Italy',     'imperial-emba': 'UK',    'manchester-gemba': 'UK',
};

/* QS Executive MBA Rankings 2026 — the most recent edition, published
   29 April 2026. QS is used because it is the only ranking that publishes
   all three cuts this app sorts by: a global table, a Europe table, and a
   per-country order. (Times Higher Education does not rank EMBAs at all.)

   Only ranks read off a published source are filled in here. QS serves the
   full table from behind a bot check, so the tail of the list could not be
   read; those schools carry null and show as "—" until you type the number
   into the school card. A blank is honest — a guess would quietly poison
   every sort that uses it.

   country and europe are the positions within the global top 10, which is
   complete and verified, so they are exact for the schools listed.

   joint — QS ranks multi-school programmes in a separate joint-programmes
   table rather than the global one, so those carry a joint rank instead. */
const QS_RANKS = {
  'oxford-said':      { global: 1,  country: 1, europe: 1 },
  'hec-paris':        { global: 2,  country: 1, europe: 2 },
  'mit-sloan':        { global: 3,  country: 1 },
  'iese-gemba':       { global: 4,  country: 1, europe: 3 },
  'kellogg-emba':     { global: 5,  country: 2 },   // tied 5th with Yale
  'lbs-emba':         { global: 7,  country: 2, europe: 4 },
  'wharton-emba':     { global: 8,  country: 4 },
  'insead-gemba':     { global: 9,  country: 2, europe: 5 },
  'booth-emba':       { global: 13, country: 6 },
  'cambridge-emba':   { global: 17, country: 4, europe: 10 },
  'imperial-emba':    { global: 19, country: 5, europe: 11 },
  'manchester-gemba': { global: 21, country: 6, europe: 12 },
  'escp-emba':        { global: 24, country: 5, europe: 14 },
  'imd-emba':         { global: 46, country: 2, europe: 21 },
  'trium':            { joint: 1 },
  'columbia-lbs':     { joint: 3 },
  // cambridge-global and sda-bocconi are deliberately absent. QS ranks one
  // programme per school, and Cambridge's entry is the Cambridge EMBA;
  // SDA Bocconi sits outside the published top 50. A blank is honest.
};

/* ---------------------------------------------------------------
   Calendar load — how often you are actually away, per intake
   ---------------------------------------------------------------
   The single most decision-relevant number that no ranking captures.
   Two intakes of the same programme can differ by a factor of two:
   LBS September is 21 campus days in year one, LBS January is 13,
   because September is in-person fortnightly and January is blended.
   Cambridge's two EMBAs differ by three times as much again — the
   Global EMBA asks for six travel periods in the whole degree, the
   Cambridge EMBA for eighteen.

   trips  — travel events per month, averaged over the programme.
            null means it is not a commuting programme at all.
   days   — days out of the office. Year one where a school quotes
            it that way, whole programme otherwise; `note` says which.
   where  — where you have to physically be.

   Read off each school's own site in August 2026. Schools restructure
   formats between intakes, so treat these as researched, not
   contractual, and correct them in the app as admissions confirms. */
const CADENCE = {
  'cambridge-emba': {
    '*': { trips: 1, days: 52, where: 'Cambridge',
      note: '16 Friday+Saturday weekends plus 4 week-long blocks across 5 terms — 18 travel events in all, roughly one a month' } },
  'cambridge-global': {
    '*': { trips: 0.3, days: 30, where: 'Cambridge + 2 overseas',
      note: 'Only 6 travel periods in the entire programme — 4 week-long blocks in Cambridge, 2 international — plus 11 online blocks. One Cambridge week ≈ three EMBA weekends' } },
  'oxford-said': {
    '*': { trips: 1, days: 85, where: 'Oxford',
      note: '16–18 one-week modules, Mon–Fri, every 4–6 weeks. Some module weeks include the weekend; electives and overseas modules usually do' } },
  'lbs-emba': {
    'Jan 2027': { trips: 1, days: 13, where: 'London',
      note: 'Blended stream — 80% in person, 20% self-paced online. ~13 campus days in year one' },
    'Sep 2027': { trips: 2, days: 21, where: 'London',
      note: 'In-person stream — 16 Fridays + Saturdays, every other week. ~21 campus days in year one' } },
  'insead-gemba': {
    '*': { trips: 1, days: 62, where: 'Fontainebleau',
      note: '12 weeks of class in modular blocks. 60–65 working days out of office on the standard track; the Flex option cuts it to ~39' } },
  'imd-emba': {
    '*': { trips: 0.5, days: 56, where: 'Lausanne + Singapore',
      note: '7–9 weeks out of office all in. Mastery stage is six 1-week modules over twelve months, plus 12–15 hrs/week of distance work' } },
  'trium': {
    '*': { trips: 0.33, days: 50, where: 'London, NY, Paris, Seoul, Nairobi, Dubai',
      note: 'Six modules, ~10 weeks in class over 18 months. Three modules are away (Seoul, Nairobi, Dubai) with lodging included' } },
  'iese-gemba': {
    '*': { trips: 0.5, days: 45, where: 'Barcelona, Madrid, Munich, NY',
      note: 'Modular and blended over 16 months — six core modules plus two electives, extending to Silicon Valley and Asia' } },
  'booth-emba': {
    '*': { trips: 0.75, days: 96, where: 'London + Chicago + Hong Kong',
      note: '16 class weeks (Mon–Sat) over 21 months — two non-consecutive weeks per quarter in London, plus 3 weeks in Chicago and 1 in Hong Kong' } },
  'wharton-emba': {
    '*': { trips: 2, days: 100, where: 'Philadelphia',
      note: 'Friday + Saturday every other weekend across six terms, some three-day weekends. Transatlantic every fortnight' } },
  'columbia-lbs': {
    '*': { trips: 1, days: 51, where: 'London + New York',
      note: 'Eight block weeks of 5–7 days, alternating London and New York, about one a month. 51 days across both campuses' } },
  'kellogg-emba': {
    '*': { trips: 2, days: 100, where: 'Evanston (or Miami)',
      note: 'Evanston meets twice a month, Friday + Saturday. Miami is once a month, Thursday afternoon to Sunday midday — pick Miami if you are flying' } },
  'mit-sloan': {
    '*': { trips: null, days: 250, where: 'Cambridge, Massachusetts',
      note: 'NOT a commuting programme. 12 months full-time and residential — you relocate to Massachusetts and stop working' } },
  'hec-paris': {
    '*': { trips: 2, days: 50, where: 'Paris',
      note: '~50 days out of office over 18 months. Two formats: every-other-week (Fri + Sat twice a month in Paris) or modular (5–10 day blocks every two months)' } },
  'escp-emba': {
    '*': { trips: 1, days: 40, where: 'Paris, London, Berlin, Madrid, Turin',
      note: '180 taught hours on a weekday or weekend track, plus 5 week-long international seminars. Core courses can be taken at any of three European campuses or online' } },
  'sda-bocconi': {
    '*': { trips: 1, days: 55, where: 'Milan',
      note: 'One week-long module (Mon–Sat) roughly every two months, with Friday+Saturday weekend modules in the months between' } },
  'imperial-emba': {
    '*': { trips: 1.5, days: 50, where: 'London',
      note: 'Choose two-week blocks (Mon+Tue, then Thu+Fri) or the weekend pattern (Thu afternoon to Sun morning). Online modules cut campus visits further' } },
  'manchester-gemba': {
    '*': { trips: 0.25, days: 36, where: 'Manchester (or Dubai, HK, Shanghai, Singapore)',
      note: 'Blended — face-to-face workshop residentials only three times a year, about 9 days per semester. Attend at your nearest global centre rather than Manchester' } },
};

/* Admissions pages, read in August 2026. These are what the deadline
   and cadence figures above came off, so the card can link you back to
   the source rather than making you search for it again. */
const ADMISSIONS_URL = {
  'cambridge-emba':   'https://www.jbs.cam.ac.uk/masters-degrees/executive-mba/apply/',
  'cambridge-global': 'https://www.jbs.cam.ac.uk/masters-degrees/global-executive-mba/',
  'oxford-said':      'https://www.sbs.ox.ac.uk/programmes/mbas/executive-mba/how-apply',
  'lbs-emba':         'https://www.london.edu/masters-degrees/executive-mba/apply',
  'insead-gemba':     'https://www.insead.edu/master-programmes/global-executive-mba/admissions',
  'imd-emba':         'https://www.imd.org/emba/admission/',
  'trium':            'https://www.triumemba.org/admissions/',
  'iese-gemba':       'https://www.iese.edu/global-executive-mba/admissions-fees/',
  'booth-emba':       'https://www.chicagobooth.edu/mba/executive/admissions/how-to-apply',
  'wharton-emba':     'https://executivemba.wharton.upenn.edu/application-timeline-deadlines/',
  'columbia-lbs':     'https://www.emba-global.com/admissions/how-to-apply',
  'kellogg-emba':     'https://www.kellogg.northwestern.edu/admissions/emba-admissions/emba-how-to-apply/',
  'mit-sloan':        'https://mitsloan.mit.edu/fellows/admissions',
  'hec-paris':        'https://www.hec.edu/en/mba-executive-mba/executive-mba/admissions/application-deadlines',
  'escp-emba':        'https://escp.eu/programmes/executive-mba',
  'sda-bocconi':      'https://www.sdabocconi.it/en/mba-executive-mba/executive-mba/admissions',
  'imperial-emba':    'https://www.imperial.ac.uk/business-school/programmes/executive-mba/admissions/key-dates-and-deadlines/',
  'manchester-gemba': 'https://www.alliancembs.manchester.ac.uk/study/mba/global-part-time-mba/how-to-apply/',
};

/* Published rounds, read off each school's own admissions page in
   August 2026. `win` names the start window a round feeds where the
   school scopes them that way; null means it applies to every window.

   Schools that genuinely have no rounds — IMD and HEC run rolling
   admissions — are absent rather than guessed at. */
const ROUNDS = {
  'cambridge-emba': [
    { label: 'R1', date: '2026-11-10', win: 'Sep 2027' },
    { label: 'R2', date: '2027-01-19', win: 'Sep 2027' },
    { label: 'R3', date: '2027-03-02', win: 'Sep 2027' },
    { label: 'R4', date: '2027-04-15', win: 'Sep 2027' },
    { label: 'R5', date: '2027-06-08', win: 'Sep 2027' },
  ],
  'oxford-said': [
    { label: 'Stage 1', date: '2026-09-02', win: null },
    { label: 'Stage 2', date: '2026-10-05', win: null },
    { label: 'Stage 3', date: '2026-11-04', win: null },
    { label: 'Stage 4', date: '2027-01-06', win: null },
    { label: 'Stage 5', date: '2027-03-15', win: null },
  ],
  'insead-gemba': [
    { label: 'R1', date: '2027-02-23', win: null },
    { label: 'R2', date: '2027-04-27', win: null },
    { label: 'R3', date: '2027-06-29', win: null },
    { label: 'Final', date: '2027-09-07', win: null },
  ],
  'iese-gemba': [
    { label: 'R1', date: '2026-04-08', win: null }, { label: 'R2', date: '2026-05-12', win: null },
    { label: 'R3', date: '2026-06-09', win: null }, { label: 'R4', date: '2026-07-15', win: null },
    { label: 'R5', date: '2026-09-03', win: null }, { label: 'R6', date: '2026-10-07', win: null },
    { label: 'R7', date: '2026-11-04', win: null }, { label: 'R8', date: '2026-12-02', win: null },
  ],
  'wharton-emba': [
    { label: 'R1', date: '2026-10-19', win: null },
    { label: 'R2', date: '2027-01-19', win: null },
  ],
  'columbia-lbs': [
    { label: 'Late Fall',   date: '2026-10-14', win: null },
    { label: 'Early Spring', date: '2027-01-12', win: null },
    { label: 'Late Spring',  date: '2027-03-12', win: null },
  ],
  'kellogg-emba': [
    { label: 'D1', date: '2026-08-12', win: null },
    { label: 'D2 (last for Jan)', date: '2026-10-07', win: 'Jan 2027' },
    { label: 'D3', date: '2027-04-07', win: 'Sep 2027' },
    { label: 'D4 (last for Sep)', date: '2027-06-02', win: 'Sep 2027' },
  ],
  'imperial-emba': [
    { label: 'R1', date: '2026-02-24', win: 'Jan 2027' }, { label: 'R2', date: '2026-04-28', win: 'Jan 2027' },
    { label: 'R3', date: '2026-06-09', win: 'Jan 2027' }, { label: 'R4', date: '2026-07-14', win: 'Jan 2027' },
    { label: 'R5', date: '2026-09-08', win: 'Jan 2027' }, { label: 'R6', date: '2026-10-13', win: 'Jan 2027' },
  ],
  'sda-bocconi': [
    { label: 'Waiver R2',  date: '2026-09-30', win: null },
    { label: 'Early bird', date: '2026-11-10', win: null },
    { label: 'Waiver R3',  date: '2026-12-15', win: null },
    { label: 'Final',      date: '2027-02-10', win: null },
  ],
};

/* ---------------------------------------------------------------
   Where a round date came from
   ---------------------------------------------------------------
   Three kinds of date live in `rounds`, and conflating them is how a
   planning calendar quietly becomes fiction:

   published  — read off the school's own 2027-cycle page. Trust it.
   prior-year — the school has not published 2027 dates yet, so these
                are last cycle's dates moved on 364 days (52 weeks,
                which preserves the weekday — admissions deadlines sit
                on the same weekday year to year far more reliably
                than on the same date). Every one is flagged.
   rolling    — the school genuinely has no deadline. These are not
                deadlines at all but *apply-by* dates, derived from the
                lead time the school itself recommends.

   The app shows which of the three you are looking at, and every
   non-published date carries a ~ so it can never be mistaken for one
   the school actually gave you. --------------------------------- */

/* Rolling admissions. `lead` is the months before the intake starts
   that the school advises applying by — its own guidance where it
   gives any, otherwise the point in its previous cycle where the door
   actually shut. The app turns this into a real date per start
   window, because "rolling" is not something you can put in a diary. */
const ROLLING = {
  'imd-emba': { lead: 6,
    note: 'No deadline — assessed on a rolling basis. IMD advises starting the application at least six months before your intended start, and warns that classes fill in advance.' },
  'hec-paris': { lead: 3,
    note: 'Rolling, with a fresh intake most months. Each window opens about six weeks before it closes, and a decision follows three to four weeks later.' },
  'escp-emba': { lead: 3,
    note: 'Places allocated on a rolling basis, so early application matters more than any date. A reduced fee of €86,000 applied to the September 2026 intake if you applied before 17 August 2026.' },
  'manchester-gemba': { lead: 2,
    note: 'Rolling, with one hard final deadline roughly two months before the intake — it was 29 May 2026 for the July 2026 start.' },
  /* TRIUM is rolling in character but does publish deadlines, and last
     year's first one is already carried below. noteOnly keeps the
     explanation without generating a second date on top of it. */
  'trium': { lead: 10, noteOnly: true,
    note: 'Three on-time deadlines, but applications are reviewed on a rolling basis throughout and scholarships are awarded from the first deadline onwards — so the first date is the one that matters.' },
};

/* Last cycle's calendar, moved on 364 days. Used only where the school
   has not published 2027 dates. Sources are in the comment on each. */
const PRIOR_YEAR_ROUNDS = {
  // Booth published Oct 27 2025 / Jan 12 2026 / Apr 13 2026 / Jun 8 2026.
  'booth-emba': [
    { label: 'R1', date: '2026-10-26', win: null },
    { label: 'R2', date: '2027-01-11', win: null },
    { label: 'R3', date: '2027-04-12', win: null },
    { label: 'R4 (final)', date: '2027-06-07', win: null },
  ],
  // LBS's final deadline for the September 2026 intake was 9 July 2026.
  // Earlier stages are not published, so only the one that is known.
  'lbs-emba': [
    { label: 'Final', date: '2027-07-08', win: 'Sep 2027' },
  ],
  // TRIUM's first deadline for the Class of 2028 was 2 November 2025.
  'trium': [
    { label: 'R1', date: '2026-11-01', win: null },
  ],
  // MIT Sloan Fellows ran R1 20 Oct 2025 / R2 26 Jan 2026 for June entry.
  'mit-sloan': [
    { label: 'R1', date: '2026-10-19', win: null },
    { label: 'R2', date: '2027-01-25', win: null },
  ],
  /* Cambridge has not published Global EMBA rounds, but it publishes the
     Cambridge EMBA's five and runs both to the same shape — R1 ten months
     out, then roughly 8, 6, 4.5 and 3 months before the start. Applied to
     the Global EMBA's January start that gives the five below. Derived
     from a sibling programme rather than from last year, so it is the
     softest set here; ring Judge before you plan around it. */
  'cambridge-global': [
    { label: 'R1', date: '2026-03-10', win: null },
    { label: 'R2', date: '2026-05-19', win: null },
    { label: 'R3', date: '2026-07-02', win: null },
    { label: 'R4', date: '2026-08-17', win: null },
    { label: 'R5', date: '2026-10-08', win: null },
  ],
};

const blankRank = () => ({ global: null, country: null, europe: null, joint: null });

/* First of the month named by a start window: "Sep 2027" → 2027-09-01.
   Windows the app cannot parse simply produce no rolling date, which is
   the right failure — a made-up one would be worse than none. */
const MONTH_NUM = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
function intakeStart(label) {
  const m = String(label || '').match(/([A-Za-z]{3})[a-z]*\s+(\d{4})/);
  const mo = m && MONTH_NUM[m[1].toLowerCase()];
  return m && mo != null ? new Date(Date.UTC(Number(m[2]), mo, 1)) : null;
}
function minusMonths(d, months) {
  const x = new Date(d.getTime());
  x.setUTCMonth(x.getUTCMonth() - months);
  return x.toISOString().slice(0, 10);
}

/* One apply-by date per start window for a rolling school. */
function rollingRounds(id, intakeLabels) {
  const r = ROLLING[id];
  if (!r || r.noteOnly) return [];
  return intakeLabels.map((label) => {
    const start = intakeStart(label);
    if (!start) return null;
    return { label: 'Apply by', date: minusMonths(start, r.lead), win: label, est: true, rolling: true };
  }).filter(Boolean);
}

/* published | prior-year | rolling — whichever best describes what the
   dates on this school actually are. */
function admissionsMode(id) {
  // Named for where the dates on the card actually came from, so the order
  // is strongest source first. TRIUM is the case that needs it: rolling in
  // character, but the dates you see are last year's.
  if (ROUNDS[id]) return 'published';
  if (PRIOR_YEAR_ROUNDS[id]) return 'prior-year';
  if (ROLLING[id]) return 'rolling';
  return 'unknown';
}

/* Published dates win. Rolling schools get their apply-by dates, and a
   rolling school that also publishes a round or two (TRIUM) gets both. */
function roundsFor(id, intakeLabels) {
  const out = (ROUNDS[id] || []).map((r) => ({ ...r }));
  if (!ROUNDS[id]) {
    (PRIOR_YEAR_ROUNDS[id] || []).forEach((r) => out.push({ ...r, est: true }));
  }
  rollingRounds(id, intakeLabels).forEach((r) => out.push(r));
  return out.sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

/* Cadence for one start window. A school with a single format uses the
   '*' entry; LBS is the case that needs per-window figures, and any
   school can grow them later by keying on the window's own label. */
function cadenceFor(id, label) {
  const c = CADENCE[id];
  if (!c) return null;
  return { ...(c[label] || c['*'] || null) };
}

function buildSeed() {
  return {
    seedVersion: SEED_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: Date.now(),
    schools: SCHOOLS.map((s) => ({
      ...s,
      notes: '',
      status: 'none',        // application pipeline stage
      url: ADMISSIONS_URL[s.id] || '',
      schDeadline: null,     // scholarship deadline where it differs
      docs: [],              // essays and other documents
      country: COUNTRY[s.id] || '',
      rank: { ...blankRank(), ...(QS_RANKS[s.id] || {}) },
      rounds: roundsFor(s.id, String(s.start).split(' / ').map((x) => x.trim())),
      admissions: admissionsMode(s.id),
      rollingNote: (ROLLING[s.id] || {}).note || '',

      // Start windows — programmes with two intakes get one entry per window,
      // each of which can be switched off in the school card. Cadence rides
      // on the window because that is where it actually differs.
      intakes: String(s.start).split(' / ').map((label) => ({
        label, on: true, deadline: null, cadence: cadenceFor(s.id, label),
      })),
      tasks: schoolTasks(s.deadline),
    })),
    steps: STEPS.map((s) => ({ ...s, tasks: s.tasks.map((x) => ({ ...x })) })),
    actions: ACTIONS.map((a) => ({ ...a })),
    funding: FUNDING.map((f) => ({ ...f })),
  };
}
