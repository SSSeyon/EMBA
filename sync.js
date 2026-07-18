/* EMBA 2027 Tracker — optional cross-device sync
   ----------------------------------------------------------------
   ES module (only loads over http/https — harmless no-op on file://,
   since browsers refuse to load <script type="module"> from disk).

   How it works: nothing to set up, nothing to enter. Every device that
   opens this app reads and writes the same single Firestore document.
   No accounts, no login, no sync code — open it and it syncs.

   SECURITY NOTE: there is NO authentication and NO access control here,
   by deliberate choice. The Firestore rule this pairs with is
   `allow read, write: if true` (README.md → "Setting up Sync"), and the
   document ID below is a fixed, non-secret string. Anyone who knows the
   project ID — which is public, since the config below ships in the
   client — can read or overwrite this document. Nothing is hidden and
   nothing is protected. Fine for an admissions tracker; do not put
   anything sensitive in here.

   If firebaseConfig below is left on REPLACE_ME placeholders, this file
   does nothing: EmbaSync.available() returns false and the app quietly
   stays localStorage-only. It is now filled in for project emba-e9960.
   ---------------------------------------------------------------- */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCr7Y5g_Rr3OZ4NQX3IoHGxszd6hgnZPGI',
  authDomain: 'emba-e9960.firebaseapp.com',
  projectId: 'emba-e9960',
  storageBucket: 'emba-e9960.firebasestorage.app',
  messagingSenderId: '526804790379',
  appId: '1:526804790379:web:9eb24b55167643b866d52e',
};

// The one document every device shares. Not a secret, not derived from
// anything — just a fixed name.
const DOC_ID = 'emba-tracker';

function configured() {
  return !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'REPLACE_ME';
}

let app, db;
let initPromise = null;
let unsub = null;
let connected = false;

function ensureInit() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    if (!configured()) return false;
    try {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      return true;
    } catch (e) {
      console.error('Sync init failed', e);
      return false;
    }
  })();
  return initPromise;
}

window.EmbaSync = {
  available: configured,

  // onRemote(payload) fires whenever the shared document changes (including
  // our own writes echoing back). onStatus('connecting'|'synced'|'error'|'unconfigured').
  async connect({ onRemote, onStatus } = {}) {
    onStatus?.('connecting');
    const ok = await ensureInit();
    if (!ok) { onStatus?.('unconfigured'); return false; }
    if (unsub) unsub();
    unsub = onSnapshot(
      doc(db, 'syncs', DOC_ID),
      (snap) => { if (snap.exists()) onRemote?.(snap.data()); onStatus?.('synced'); },
      (err) => { console.error('Sync listen failed', err); onStatus?.('error'); }
    );
    connected = true;
    return true;
  },

  disconnect() {
    if (unsub) { unsub(); unsub = null; }
    connected = false;
  },

  async push(payload) {
    if (!connected || !db) return;
    try {
      await setDoc(doc(db, 'syncs', DOC_ID), payload);
    } catch (e) {
      console.error('Sync push failed', e);
    }
  },

  /* ---- Daily snapshots ----
     One snapshot document per weekday (…-snap-mon … -snap-sun), overwritten
     on a weekly cycle. Seven fixed slots means there is never anything to
     prune and the whole history costs at most 7 MB of Firestore. This is
     an undo for bad syncs and fat-fingered restores, not a security layer. */
  async snapshot(payload) {
    if (!connected || !db) return false;
    const day = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
    try {
      await setDoc(doc(db, 'syncs', DOC_ID + '-snap-' + day), payload);
      return true;
    } catch (e) {
      console.error('Snapshot failed', e);
      return false;
    }
  },

  async listSnapshots() {
    if (!db) return [];
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const out = [];
    for (const day of days) {
      try {
        const snap = await getDoc(doc(db, 'syncs', DOC_ID + '-snap-' + day));
        if (snap.exists()) {
          const v = snap.data();
          out.push({ day, updatedAt: v.updatedAt || 0 });
        }
      } catch (e) { /* a missing day is not an error */ }
    }
    return out.sort((a, b) => b.updatedAt - a.updatedAt);
  },

  async getSnapshot(day) {
    if (!db) return null;
    try {
      const snap = await getDoc(doc(db, 'syncs', DOC_ID + '-snap-' + day));
      return snap.exists() ? snap.data() : null;
    } catch (e) {
      console.error('Snapshot read failed', e);
      return null;
    }
  },

  /* ---- Push subscriptions ----
     Each device that enables notifications stores its PushSubscription in a
     side document, keyed by a hash of its endpoint so re-subscribing the
     same device overwrites rather than duplicates. The daily GitHub Action
     reads this document and sends to every subscription in it. */
  async savePushSub(sub) {
    if (!db) return false;
    try {
      let h = 0;
      for (let i = 0; i < sub.endpoint.length; i++) h = (h * 31 + sub.endpoint.charCodeAt(i)) >>> 0;
      await setDoc(doc(db, 'syncs', DOC_ID + '-push'),
        { ['sub_' + h.toString(36)]: sub, updatedAt: Date.now() },
        { merge: true });
      return true;
    } catch (e) {
      console.error('Saving push subscription failed', e);
      return false;
    }
  },
};
