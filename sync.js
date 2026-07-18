/* EMBA 2027 Tracker — optional cross-device sync
   ----------------------------------------------------------------
   ES module (only loads over http/https — harmless no-op on file://,
   since browsers refuse to load <script type="module"> from disk).

   How it works: still no accounts, no login screen. You pick a private
   "sync code" once (the header "Sync" button) and enter the *same* code
   on every device you want to share this tracker with. The code is
   SHA-256 hashed into a Firestore document ID, so two devices with the
   same code read and write the same document. Sign-in to Firebase itself
   is anonymous — there is no email/password, ever.

   SECURITY NOTE: anyone who has both your Firebase config (visible in
   this file once deployed — it's not a secret, Firebase configs are
   meant to be public) and your sync code could read/write that one
   document. Treat the sync code like a shared password, not a public
   detail. See README.md → "Sync across devices" for the Firestore
   security rule this relies on, and setup steps.

   Left with REPLACE_ME placeholders below, this file does nothing:
   EmbaSync.available() returns false and the app quietly stays
   localStorage-only.
   ---------------------------------------------------------------- */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';
import { getFirestore, doc, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'REPLACE_ME',
  authDomain: 'REPLACE_ME.firebaseapp.com',
  projectId: 'REPLACE_ME',
  storageBucket: 'REPLACE_ME.appspot.com',
  messagingSenderId: 'REPLACE_ME',
  appId: 'REPLACE_ME',
};

function configured() {
  return !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'REPLACE_ME';
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

let app, auth, db;
let initPromise = null;
let unsub = null;
let docId = null;

function ensureInit() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    if (!configured()) return false;
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    await new Promise((resolve) => {
      const off = onAuthStateChanged(auth, (user) => { if (user) { off(); resolve(); } });
      signInAnonymously(auth).catch((e) => { console.error('Sync sign-in failed', e); resolve(); });
    });
    return !!auth.currentUser;
  })();
  return initPromise;
}

window.EmbaSync = {
  available: configured,

  // onRemote(payload) fires whenever the shared document changes (including
  // our own writes echoing back). onStatus('connecting'|'synced'|'error'|'unconfigured').
  async connect(code, { onRemote, onStatus } = {}) {
    onStatus?.('connecting');
    const ok = await ensureInit();
    if (!ok) { onStatus?.('unconfigured'); return false; }
    docId = await sha256Hex('emba-tracker:' + code);
    if (unsub) unsub();
    unsub = onSnapshot(
      doc(db, 'syncs', docId),
      (snap) => { if (snap.exists()) onRemote?.(snap.data()); onStatus?.('synced'); },
      (err) => { console.error('Sync listen failed', err); onStatus?.('error'); }
    );
    return true;
  },

  disconnect() {
    if (unsub) { unsub(); unsub = null; }
    docId = null;
  },

  async push(payload) {
    if (!docId || !db) return;
    try {
      await setDoc(doc(db, 'syncs', docId), payload);
    } catch (e) {
      console.error('Sync push failed', e);
    }
  },
};
