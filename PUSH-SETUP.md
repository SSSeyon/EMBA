# Getting daily push notifications working

One-time setup, about five minutes. After it, every device where you have
tapped **Settings → Device notifications → Enable** gets a notification at
**07:00 Lagos time** each day listing everything due within 7 days — with the
app closed, phone in your pocket.

## How the pieces fit

| Piece | Where | Status |
|---|---|---|
| Receiving (service worker `push` handler) | `sw.js` | done, ships with the app |
| Registering a device | Settings → Device notifications | done, ships with the app |
| Subscription storage | Firestore `syncs/emba-tracker-push` | done, automatic |
| **Sending** (daily scheduled job) | GitHub Action in this repo | **needs the steps below** |

No Firebase paid plan, no Cloud Functions — the sender is a free scheduled
GitHub Action (`.github/workflows/push-reminders.yml` running
`scripts/send-push.mjs`).

## Steps

1. **Push this repository to GitHub** (it can be private; Actions still run).

2. **Add the two keys as repository secrets** — on GitHub:
   *Settings → Secrets and variables → Actions → New repository secret*

   | Name | Value |
   |---|---|
   | `VAPID_PUBLIC_KEY` | the public key from `PUSH-PRIVATE-KEY.txt` |
   | `VAPID_PRIVATE_KEY` | the private key from `PUSH-PRIVATE-KEY.txt` |

   Then delete `PUSH-PRIVATE-KEY.txt` from your disk if you like — the keys
   live in the secrets from now on. (The file is gitignored either way.)

3. **Enable the workflow** — GitHub sometimes needs a first manual run:
   *Actions tab → Daily deadline push → Run workflow*.
   The log ends with something like `Done: 2 sent, 0 failed, 6 tasks due`.

4. **Register your devices** — open the app on each device and tap
   **Settings → Device notifications → Enable**, then allow notifications
   when the browser asks. On Android this works best with the app installed
   to the home screen.

## Notes

- The keypair was generated for this app on 2026-07-18. If you ever want a
  fresh pair: `npx web-push generate-vapid-keys`, put the public key into
  `VAPID_PUBLIC_KEY` in `index.html`, update both secrets, and re-Enable on
  each device.
- The Action reads the same open Firestore documents the app uses; the API
  key in `send-push.mjs` is the public one that already ships in `sync.js`.
- No push arrives on a day when nothing is due within 7 days — silence means
  you're ahead, not that it broke. The Actions tab log always says which.
- iPhone: web push needs the app added to the home screen (iOS 16.4+).
