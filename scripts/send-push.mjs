/* EMBA 2027 Tracker — daily push sender.
   Runs inside the scheduled GitHub Action (.github/workflows/push-reminders.yml).

   What it does, in order:
     1. Reads the shared tracker document and the push-subscription document
        straight from Firestore's REST API. The project's rules are open by
        deliberate choice, so the public API key is all that's needed.
     2. Recomputes "due within 7 days" exactly the way the app itself does
        (excluded schools skipped, done tasks skipped, decided applications
        skipped).
     3. Sends one Web Push to every registered device. The service worker
        in sw.js turns it into the notification.

   Needs two environment variables (set as repo secrets):
     VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY — see PUSH-SETUP.md.               */

import webpush from 'web-push';

const PROJECT = 'emba-e9960';
const API_KEY = 'AIzaSyCr7Y5g_Rr3OZ4NQX3IoHGxszd6hgnZPGI'; // public, ships in sync.js
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/syncs/`;

/* Firestore's REST API wraps every value in a type marker; unwrap back to
   plain JSON. */
function dec(v) {
  if (v == null) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('mapValue' in v) {
    const o = {};
    for (const [k, x] of Object.entries(v.mapValue.fields || {})) o[k] = dec(x);
    return o;
  }
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(dec);
  return null;
}

async function getDoc(id) {
  const res = await fetch(`${BASE}${id}?key=${API_KEY}`);
  if (!res.ok) return null;
  const json = await res.json();
  const out = {};
  for (const [k, v] of Object.entries(json.fields || {})) out[k] = dec(v);
  return out;
}

/* Day maths in Lagos time (UTC+1, no DST), matching what the user sees. */
function daysTo(iso) {
  if (!iso) return null;
  const now = new Date(Date.now() + 3600_000);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const due = new Date(iso + 'T00:00:00Z').getTime();
  if (isNaN(due)) return null;
  return Math.round((due - today) / 86400_000);
}

const data = await getDoc('emba-tracker');
const pushDoc = await getDoc('emba-tracker-push');

const subs = pushDoc
  ? Object.entries(pushDoc).filter(([k]) => k.startsWith('sub_')).map(([, v]) => v)
  : [];

if (!data || !subs.length) {
  console.log(`Nothing to do: data=${!!data}, subscriptions=${subs.length}`);
  process.exit(0);
}

/* A decided application — accepted or rejected — has nothing left to chase. */
const CLOSED = ['accepted', 'rejected'];

const excluded = data.excluded || {};
const soon = [];
(data.schools || []).forEach((s) => {
  if (excluded[s.id]) return;
  if (CLOSED.includes(s.status)) return;
  (s.tasks || []).forEach((t) => {
    const n = daysTo(t.due);
    if (!t.done && n !== null && n <= 7) soon.push(`${s.name}: ${t.label}`);
  });
});
(data.actions || []).forEach((t) => {
  const n = daysTo(t.due);
  if (!t.done && n !== null && n <= 7) soon.push(t.label);
});

if (!soon.length) {
  console.log('Nothing due within 7 days — no push sent.');
  process.exit(0);
}

webpush.setVapidDetails(
  'mailto:ssseyon@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const payload = JSON.stringify({
  title: `${soon.length} EMBA task${soon.length > 1 ? 's' : ''} due within 7 days`,
  body: soon.slice(0, 3).join('\n') + (soon.length > 3 ? `\n…and ${soon.length - 3} more` : ''),
});

let sent = 0, failed = 0;
for (const sub of subs) {
  try {
    await webpush.sendNotification(sub, payload);
    sent++;
  } catch (e) {
    failed++;
    // 404/410 means the device unsubscribed or the browser was reset;
    // harmless — it just stops receiving. Anything else is worth seeing.
    console.log(`Push to one device failed (${e.statusCode || e.message})`);
  }
}
console.log(`Done: ${sent} sent, ${failed} failed, ${soon.length} tasks due.`);
