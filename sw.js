/* EMBA 2027 Tracker — service worker
   ----------------------------------------------------------------
   Does two jobs:
   1. Offline app-shell caching, so the app opens with no connection.
      (Your DATA lives in localStorage, which is already offline —
      this covers the HTML/JS/icons only.)
   2. Holds a dormant push hook for later. See the note at the bottom.

   Bump CACHE_VERSION whenever you change index.html or seed.js, so
   returning devices fetch the new files instead of serving stale ones.
   ---------------------------------------------------------------- */

const CACHE_VERSION = 'emba-v1.7.0';

// App shell: local files that make up the tracker itself. These must all
// exist — addAll() is all-or-nothing, so one 404 here means no offline
// cache at all.
const SHELL = [
  './',
  './index.html',
  './seed.js',
  './sync.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png',
  './logos/_fallback.svg'
];

// School logos are deliberately NOT in SHELL. A logo can be any format —
// oxford-said.png, lbs-emba.webp — and the app finds it by asking for each
// extension in turn, so most of these requests are meant to 404. Listing
// them in SHELL would fail the whole install. Instead they are cached
// opportunistically: try each one, ignore every miss, and let the fetch
// handler below pick up whatever the app actually loads.
const LOGO_IDS = [
  'cambridge-emba', 'insead-gemba', 'imd-emba', 'oxford-said', 'lbs-emba',
  'trium', 'iese-gemba', 'booth-emba', 'cambridge-global', 'wharton-emba',
  'columbia-lbs', 'kellogg-emba', 'mit-sloan', 'hec-paris', 'escp-emba',
  'sda-bocconi', 'imperial-emba', 'manchester-gemba'
];
const LOGO_EXTS = ['svg', 'png', 'webp', 'jpg', 'jpeg', 'avif', 'gif'];

// Walk one school's extensions in series and stop at the first hit, so the
// common case is a single request per school rather than seven. Schools run
// in parallel with each other; firing all 126 combinations at once would
// hammer the server on every install.
function cacheSchoolLogo(cache, id) {
  return LOGO_EXTS.reduce(
    (chain, ext) => chain.then((done) => {
      if (done) return true;
      const url = './logos/' + id + '.' + ext;
      return fetch(url)
        .then((res) => (res.ok ? cache.put(url, res).then(() => true) : false))
        .catch(() => false);
    }),
    Promise.resolve(false)
  );
}

function cacheLogos(cache) {
  return Promise.all(LOGO_IDS.map((id) => cacheSchoolLogo(cache, id)));
}

// ---- Install: pre-cache the shell ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(SHELL).then(() => cacheLogos(cache)))
      .then(() => self.skipWaiting())
  );
});

// ---- Activate: drop old caches ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ---- Fetch strategy ----
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. Cross-origin (Google Fonts) — cache-first.
  //    These are version-pinned URLs, so cached copies are safe and fast.
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(req).then((hit) =>
        hit || fetch(req).then((res) => {
          if (res.ok && (res.type === 'basic' || res.type === 'cors')) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        }).catch(() => hit)
      )
    );
    return;
  }

  // 2. Same-origin app shell — network-first, fall back to cache offline.
  //    This means an online device always gets your latest deploy, while
  //    an offline device still opens from cache.
  //
  //    Only successful responses are stored. The logo probe deliberately
  //    asks for files that do not exist, and caching those 404s would keep
  //    serving them after you finally add the real image.
  event.respondWith(
    fetch(req).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() =>
      caches.match(req).then((hit) => hit || caches.match('./index.html'))
    )
  );
});

/* ----------------------------------------------------------------
   PUSH — currently dormant.

   The handlers below are what receive a push once you have the
   sending side in place. They will do nothing until you:

     1. Enable Firebase Cloud Messaging in your project
     2. Register this file with FCM and store a device token per user
     3. Deploy a scheduled Cloud Function (Blaze plan) that runs daily,
        finds tasks due within N days, and pushes to that token

   Only step 3 can wake this app when it is closed. Until it exists,
   use the in-app "Remind me" button (fires while a tab is open) and
   your phone calendar for the deadlines that actually matter.

   The code is inert but correct, so switching push on later is a
   focused job rather than a rewrite.
   ---------------------------------------------------------------- */

self.addEventListener('push', (event) => {
  let payload = { title: 'EMBA 2027', body: 'You have tasks due soon.' };
  try { if (event.data) payload = { ...payload, ...event.data.json() }; } catch (_) {}

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'emba-due',
      data: { url: './index.html' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './index.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const c of clients) {
        if ('focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
