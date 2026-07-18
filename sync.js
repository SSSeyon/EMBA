/* EMBA 2027 Tracker — optional cross-device sync
   ----------------------------------------------------------------
   ES module (only loads over http/https — harmless no-op on file://,
   since browsers refuse to load <script type="module"> from disk).

   How it works: no accounts, no login screen, no sign-in of any kind.
   You pick a private "sync code" once (the header "Sync" button) and
   enter the *same* code on every device you want to share this tracker
   with. The code is SHA-256 hashed into a Firestore document ID, so two
   devices with the same code read and write the same document.

   SECURITY NOTE: there is NO authentication and NO access control here,
   by deliberate choice. The Firestore rule this pairs with is
   `allow read, write: if true` (README.md → "Setting up Sync"), i.e. the
   database is open to anyone who knows the project ID — and the config
   below is public by nature. What keeps your data obscure is only that
   the document ID is a SHA-256 hash of your sync code, so nobody
   stumbles onto it by accident. Nothing prevents a determined reader.
   Fine for an admissions tracker; do not store anything sensitive here.

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

function configured() {
  return !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'REPLACE_ME';
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

let app, db;
let initPromise = null;
let unsub = null;
let docId = null;

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
