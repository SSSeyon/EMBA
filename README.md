# EMBA 2027 — Admissions Tracker

A single-page tracker for Seyon Hunga's Executive MBA applications. 18 schools,
148 tasks. No accounts, no server — your data lives in the browser's
localStorage, with one-click Backup / Restore to move it between devices.

Static site. No build step. Works opened straight from `index.html` on your
file system, or drop it in a repo and turn on GitHub Pages.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app — UI, storage, rendering |
| `seed.js` | Your 18 schools, 9 project steps, 8 personal actions, 13 funding routes |
| `sync.js` | Optional cross-device sync (Firebase). Inert until configured — see "Sync across devices" |
| `manifest.json` | Makes the app installable to your home screen |
| `sw.js` | Service worker — offline shell caching, dormant push hook |
| `icon-192.png`, `icon-512.png` | Home-screen icons (standard) |
| `icon-maskable-192.png`, `icon-maskable-512.png` | Android adaptive icons |
| `apple-touch-icon.png` | iOS home-screen icon |
| `favicon-32.png` | Browser tab icon |
| `README.md` | This file |

All files sit flat in the repo root. Push the whole folder.

---

## Running it

**Locally:** double-click `index.html`. That's it. (The service worker and
home-screen install only work over HTTP(S), but the tracker itself is fully
functional from `file://`.)

**On GitHub Pages:**

```bash
git init
git add .
git commit -m "EMBA tracker"
git remote add origin https://github.com/YOURNAME/emba-tracker.git
git push -u origin main
```

**Repo → Settings → Pages → Source: main / root → Save.**
Live at `https://YOURNAME.github.io/emba-tracker/` in about a minute.

> ⚠️ **A GitHub Pages site is public.** Anyone with the URL can open the app
> and see the seed data baked into `seed.js` — school list, deadlines, cost
> figures, your name. They can never see your *ticks* (those stay in each
> visitor's own browser), but if you'd rather the page itself not be
> discoverable, use a private repo with Pages enabled (needs GitHub Pro) or
> keep using it locally.

**After you change `index.html`, `seed.js`, or `sync.js` and redeploy:** bump
`CACHE_VERSION` in `sw.js` (e.g. `emba-v3` → `emba-v4`) so returning devices
fetch the new files instead of serving cached ones.

---

## How your data works

**First launch** writes the seed to localStorage — 18 schools with a 7-task
checklist each, 9 project steps, 8 personal actions, 13 funding routes. It
only seeds when no saved data exists, so redeploying never touches your
progress.

**Every tick, note, added task, or edited deadline** saves instantly to
localStorage in that browser.

**On later launches**, a quiet migration step adds anything new you've since
put in `seed.js` (a school, a step, an action, a funding route) without
touching what you've already ticked, typed, or edited. It compares by `id` /
`name`, so it only ever adds — it never overwrites an existing record.

**By default, data does not sync between devices or browsers.** `file://`,
your Pages URL, your phone, and your laptop each have their own separate copy
unless you turn on Sync (below). Two ways to move data manually:

- **Backup** — downloads `emba-tracker-backup-YYYY-MM-DD.json`
- **Restore** — loads a backup file, replacing what's in that browser

Take a backup occasionally anyway: clearing browser data (or Safari's
occasional eviction of unused site storage) wipes localStorage.

---

## Sync across devices

Sync is optional and off until you turn it on — it needs a free Firebase
project, which is not set up yet in this codebase (see "Setting up Sync"
below). Until then, the **Sync** button will just tell you it isn't
configured.

Once set up, there is still **no login screen** — instead:

1. Click **Sync** in the header on your first device.
2. Enter any private phrase as your **sync code** (e.g. `hunga-emba-2027`).
   Not a real password — just something the schools' admissions staff won't
   guess.
3. Click **Sync** on your other devices/browsers and enter the *same* code.

All devices with the same code read and write the same document in Firestore
in real time — tick a task on your phone, it appears on your laptop within a
second or two. The header dot/text shows **Synced**, **Syncing…**, **Sync
not set up**, or **Sync error**.

**How it works under the hood:** there is no sign-in at all — the app talks
to Firestore unauthenticated. Your sync code is SHA-256 hashed client-side
into a Firestore document ID — two devices with the same code land on the
same document. The whole `data` object is written on every save, with an
`updatedAt` timestamp; if two devices save close together, the most recent
write wins and the other simply gets overwritten next sync (fine for a
single-user tracker, not built for simultaneous multi-editor use).

**Security tradeoff, stated plainly:** a Firebase config (the values in
`sync.js`) is not a secret — it's normal for it to be visible in client-side
code, including on a public GitHub Pages site. What *is* sensitive is your
sync code, and here it is the **only** thing protecting your data. The
security rule below allows anyone on the internet to read and write any
document in the `syncs` collection, provided they can name its ID. Your
document's ID is the SHA-256 hash of your sync code, so in practice nobody
reaches it without knowing that code — but there is no second line of
defence behind it.

So: pick a long sync code, treat it like a password, and never publish it.
A short or dictionary-word code is genuinely weak under this rule in a way it
would not be behind a login. If you later want that second line of defence,
turn on Firebase Anonymous auth (invisible to you, no login screen) and
tighten the rule to also require `request.auth != null`.

### Setting up Sync

1. **Create a Firebase project** — [console.firebase.google.com](https://console.firebase.google.com) → Add project (the free Spark plan is enough).
2. **Add a Web app** to the project (</> icon on the project overview page). Copy the `firebaseConfig` object it gives you.
3. **Create a Firestore database** — Build → Firestore Database → Create database → production mode, any region.
4. **Set the security rule** — Firestore → Rules, replace the contents with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /syncs/{docId} {
         allow read, write: if docId.matches('^[0-9a-f]{64}$');
       }
     }
   }
   ```
   Publish. No sign-in is required by this rule — see the security tradeoff
   above. The `docId.matches(...)` condition confines access to the `syncs`
   collection and to well-formed SHA-256 document IDs, so nothing else in the
   database is reachable, but it does **not** authenticate the caller.
5. **Paste your config into `sync.js`** — open the file, replace the six
   `REPLACE_ME` values in `firebaseConfig` with what you copied in step 2.
6. Redeploy (or just reload if testing locally over `http://`, not `file://`
   — Firebase's SDK needs a real origin). Click **Sync**, pick a code, repeat
   on your other devices.

Until step 5 is done, `sync.js` is inert on purpose — `EmbaSync.available()`
returns false and the app stays exactly as it is today.

**Firebase Authentication does not need to be enabled** for this setup, and
the app never calls it.

---

## Installing to your home screen

Once deployed to Pages, the app is a Progressive Web App:

- **iPhone (Safari):** open the site → Share → **Add to Home Screen**
- **Android (Chrome):** open the site → menu → **Install app** (or the prompt)
- **Desktop (Chrome/Edge):** install icon in the address bar

Installed, it opens full-screen in your dark slate theme, and the service
worker caches the app files so it opens offline.

---

## About the deadlines

**Only 2 of the 18 deadlines are confirmed** — INSEAD and IMD, both Round 1,
15 September 2026.

The other 16 are estimates. They came from entries in your research that said
"TBC", "confirm with admissions", or "rolling", turned into concrete dates so
the countdowns would have something to count to. Those dates could be wrong by
weeks.

The app is honest about this rather than hiding it: estimated dates render in
grey with a `~` prefix, confirmed ones are labelled green, and the dashboard
carries a banner stating the count.

**Cambridge Judge is the one to check first.** It is your URGENT school, the
intake starts September 2026, and the date in here is a guess. It may already
have closed.

---

## Reminders

Two mechanisms, deliberately different in reliability:

**Calendar export** — the **Calendar** button downloads `emba-deadlines.ics`:
one all-day event per unsubmitted school deadline (marked `[Estimated]` where
relevant) and every outstanding action with a due date. Import that file into
your phone's calendar app once, and it'll alert you the way a real calendar
alert does — no tab needs to stay open. Re-download and re-import after you
confirm a deadline or add tasks, since it's a snapshot, not a live feed.

**Remind me** button asks for notification permission and then fires a
browser notification for anything due within 7 days — on load, when you
return to the tab, and hourly. Once per day, tracked in `localStorage`.
**This only works while the page is open in a tab** — that is the honest
limit of a static site. Treat it as a bonus nudge, not your primary alarm;
the Calendar export is the pragmatic answer for anything you actually need
to not miss.

(`sw.js` still carries dormant push handlers if you ever wire up Firebase
Cloud Messaging for true closed-app push later — see the comment block at
the bottom of that file. Not needed for the Calendar export above.)

---

## Data model

One localStorage key, `emba-tracker-v1`, about 24 KB of JSON:

```
seedVersion : 1
createdAt   : ISO string
updatedAt   : epoch ms — bumped on every save, used to resolve Sync conflicts
schools[18] : { id, name, geo, priority, waiver, waiverNote,
                tuitionLocal, ccy, tuitionUsd, totalUsd,
                duration, start, deadline, deadlineNote, estimated,
                scholarship, scholarshipTiming, flag?, notes,
                tasks[7+] : { id, label, due, done, custom? } }
steps[9]    : { id, num, name, detail, tasks[] }
actions[8+] : { id, label, due, done, custom? }
funding[13] : { name, type, detail, action }
```

Tasks you add yourself in the app carry `"custom": true` and an id like
`custom-1737000000000` — that's how the app knows which ones show a delete
button and which ones are permanent (from `seed.js`).

The Backup file is exactly this object, pretty-printed — readable and
hand-editable.

---

## Editing your data

Most day-to-day edits don't need a text editor any more:

- **Confirm a deadline** — Schools tab → open the school → **edit** next to
  the deadline line → set the real date, tick "confirmed", Save. This also
  updates the "Submit application" task's due date to match.
- **Add a task** — "+ Add task" at the bottom of a school's checklist or the
  My actions tab. Custom tasks show a ✕ to delete them.
- **Notes per school** — free-text box at the bottom of each school's card.
  Saves when you click away from it.
- **Everything else** (tuition, waiver text, scholarship detail, adding a
  whole new school) — Backup, edit the JSON in any text editor, Restore. Or
  edit `seed.js` directly: on your *next* launch the quiet migration step
  will add anything new (by `id`/`name`) into your existing data without
  touching what you've already ticked or edited.
- **Start over** — DevTools → Application → Local Storage → delete the
  `emba-tracker-v1` key, reload. This wipes your ticks (and, if Sync is on,
  the next sync will push that wipe to your other devices too).
