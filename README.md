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
| `logos/` | One image per school, shown in front of its name. Any format — see `logos/README.md` |
| `README.md` | This file |

Everything except `logos/` sits flat in the repo root. Push the whole folder.

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

**There is nothing to turn on and nothing to enter.** Open the app on any
device and it syncs. No login, no sync code, no Sync button — every device
reads and writes the same Firestore document automatically on load.

Tick a task on your phone and it appears on your laptop within a second or
two. The header dot/text shows **Synced**, **Syncing…**, **Sync not set
up**, or **Sync error**.

**How it works under the hood:** there is no sign-in at all — the app talks
to Firestore unauthenticated, and every client uses the same fixed document
(`syncs/emba-tracker`). The whole `data` object is written on every save,
with an `updatedAt` timestamp; if two devices save close together, the most
recent write wins and the other simply gets overwritten next sync (fine for
a single-user tracker, not built for simultaneous multi-editor use).

Sync degrades gracefully: opening `index.html` straight from disk over
`file://` skips it entirely (browsers won't load ES modules from disk), and
the app runs localStorage-only with no errors.

**Security, stated plainly:** this database is deliberately open. The
Firestore rule is `allow read, write: if true` — no authentication, no
restrictions on which documents can be touched. Anyone who knows the project
ID can read or write it.

The Firebase config in `sync.js` is not a secret (configs are meant to be
public, and this one ships in a GitHub Pages site), so the project ID is
effectively public too. The document ID is the fixed string `emba-tracker`.
Nothing here is hidden and nothing is protected — that is the deliberate
tradeoff for having no setup step at all.

This is a personal admissions tracker, not sensitive records, and the choice
was made knowingly for simplicity. If that calculus ever changes, the
upgrades in order of effort are: (1) change `DOC_ID` in `sync.js` to a long
random string, which makes the document unguessable without adding any user
friction; (2) scope the rule to `match /syncs/{docId}` so only that
collection is reachable; (3) turn on Firebase Anonymous auth — invisible,
no login screen — and add `request.auth != null` to the rule.

### Setting up Sync

1. **Create a Firebase project** — [console.firebase.google.com](https://console.firebase.google.com) → Add project (the free Spark plan is enough).
2. **Add a Web app** to the project (</> icon on the project overview page). Copy the `firebaseConfig` object it gives you.
3. **Create a Firestore database** — Build → Firestore Database → Create database → production mode, any region.
4. **Set the security rule** — Firestore → Rules, replace the contents with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   Publish. This is an open database by choice — no authentication, no
   restrictions. See the security note above.
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

## Settings and appearance

Navigation is a **floating pill bar at the bottom of the screen** — the app
is built for a phone first, and the bottom of a tall screen is the only part
your thumb reaches comfortably. The bar sits detached from the screen edge
at every width (a little wider on desktop). Six tabs: Home, Schools, Steps,
Actions, Costs, Settings.

The look follows the SpendWise app's design language: serif type for
running text (Palatino — a system font, nothing to download), monospace
for numbers and metadata, warm paper surfaces in light mode, and soft
layered shadows under cards.

The **Settings** tab holds everything that isn't day-to-day tracking:

- **Light mode** — switches between the dark and light colour schemes.
- **Exchange rate** — naira per dollar, used across the whole app.
- **Calendar** — downloads an `.ics` of every deadline.
- **Backup** / **Restore** — save and reload your tracker as a JSON file.
- **Schools and logos** — switch a school in or out, and set its logo.

### Showing costs in naira

Every cost in `seed.js` is stored in **USD**. Set a rate in
**Settings → Exchange rate** and the naira equivalent appears in brackets
after every figure in the app — `$133,668 (₦221m)`.

Naira figures for a six-figure course run to nine digits, so anything over a
thousand is abbreviated (`₦221m`, `₦1.2bn`) to keep table columns readable.

**Leave the field empty and no naira is shown at all.** The app deliberately
ships without a default rate — a stale hardcoded rate silently producing
wrong numbers is worse than showing dollars only. It is a plain number you
update whenever you like; nothing fetches a live rate.

In the cost table, the "Tuition (local)" column stays in the school's own
currency (EUR, GBP, CHF). Its naira equivalent is the one shown beside the
USD figure in the next column, so the same amount isn't printed twice.

### Switching a school off

Ruled a school out? Flip its switch in **Settings → Schools and logos**. It
disappears from the Schools tab, the dashboard runway and counts, the cost
ranking, and the calendar export, and the totals renumber themselves
(`18 schools` becomes `17 schools`, "Applications sent" counts out of 17).

**Nothing is deleted.** The school stays in your data and stays visible in
the Settings list — greyed and struck through — so you can always switch it
back on, with every tick, note and edited deadline exactly as you left it.

One thing it does *not* touch: tasks in **My actions** that happen to
mention that school. Those are your own to-dos rather than part of the
school's record, so the app leaves them alone for you to delete if you want.

### School logos

Every school has an image in front of its name, set one of two ways:

- **Drop a file into the `logos/` folder** named after the school id
  (`oxford-said.png`, `lbs-emba.jpg`, and so on). `svg`, `png`, `webp`,
  `jpg`, `jpeg`, `avif` and `gif` all work — the app tries each extension
  and uses the first it finds, so you never have to convert a file. The one
  catch is that the extension must match the real format: a PNG named
  `.svg` won't display. A file in this folder is part of the app, so it
  shows on every device but has to be added to each deployment's copy.
- **Pick one in Settings → School logos → Choose.** That image is resized to
  128px, stored inside your tracker data, and syncs to your other devices
  automatically. A picked logo overrides the folder file; **Reset** removes
  it and falls back to the folder. Picked logos share the 1 MB sync budget
  with your data, so there's a per-image and total cap — if you hit it,
  reset one before adding another.

See `logos/README.md` for the full id list.

The header keeps only what you reach for constantly: the version badge (tap
to force a refresh), the sync dot, **Remind me**, and a ☾/☀ button that does
the same job as the Settings toggle.

**Dark is the default.** On first run the app follows your phone's own
light/dark setting; the moment you use either toggle, your choice is saved
to `localStorage` under `emba-theme` and it stops following the system.

Every colour is a CSS custom property defined once at the top of
`index.html`, in a `:root` block for dark and a `:root[data-theme="light"]`
block for light. **If you add a rule with a literal hex colour in it, you
will break one of the two themes** — add a variable instead.

A small inline script in `<head>` applies the saved theme before the first
paint, so a light-mode user never sees a dark flash on load.

## Installing to your home screen

Once deployed to Pages, the app is a Progressive Web App:

- **iPhone (Safari):** open the site → Share → **Add to Home Screen**
- **Android (Chrome):** open the site → menu → **Install app** (or the prompt)
- **Desktop (Chrome/Edge):** install icon in the address bar

Installed, it opens full-screen in your dark slate theme, and the service
worker caches the app files so it opens offline.

---

## About the deadlines

**Only 1 of the 18 deadlines is confirmed** — IMD Round 5, 15 September 2026,
and even that needs a check that the round feeds a 2027 start. Every intake
tracked here targets a session starting in 2027.

The other 17 are estimates. They came from entries in your research that said
"TBC", "confirm with admissions", or "rolling", turned into concrete dates so
the countdowns would have something to count to. Those dates could be wrong by
weeks.

The app is honest about this rather than hiding it: estimated dates render in
grey with a `~` prefix, confirmed ones are labelled green, and the dashboard
carries a banner stating the count.

**Cambridge Judge is still worth checking early.** The tracked date is an
estimated Round 1 for the September 2027 intake — confirm the real round
calendar with Judge admissions before relying on the countdown.

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
logos       : { <school id>: "data:image/png;base64,…" }  picked in Settings
excluded    : { <school id>: true }  schools switched off in Settings
fx          : { ngnPerUsd: 1650 | null }  naira rate, null = show USD only
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
