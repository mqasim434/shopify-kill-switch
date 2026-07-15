import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadServiceAccount() {
  // Prefer file path — multiline JSON in .env breaks dotenv parsing
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (keyPath) {
    return JSON.parse(readFileSync(resolve(keyPath), 'utf8'));
  }

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    return JSON.parse(json);
  }

  throw new Error(
    'Set FIREBASE_SERVICE_ACCOUNT_PATH (recommended) or FIREBASE_SERVICE_ACCOUNT_JSON in .env'
  );
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(loadServiceAccount()),
  });
}

export const db = getFirestore();
export const storesCollection = db.collection('stores');
