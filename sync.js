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
import { getFirestore, doc, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

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
};
