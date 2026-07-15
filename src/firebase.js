import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

function parseServiceAccount(raw) {
  const trimmed = raw.trim();

  // Allow base64-encoded JSON (handy on Railway)
  if (!trimmed.startsWith('{')) {
    try {
      return JSON.parse(Buffer.from(trimmed, 'base64').toString('utf8'));
    } catch {
      // fall through to normal JSON parse for a clearer error
    }
  }

  return JSON.parse(trimmed);
}

function loadServiceAccount() {
  // Cloud (Railway, etc.): paste JSON or base64 into this env var — no file needed
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    return parseServiceAccount(json);
  }

  // Local: path to serviceAccountKey.json
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (keyPath) {
    const absolute = resolve(keyPath);
    if (!existsSync(absolute)) {
      throw new Error(
        `Service account file not found at "${absolute}". ` +
          'On Railway, remove FIREBASE_SERVICE_ACCOUNT_PATH and set FIREBASE_SERVICE_ACCOUNT_JSON instead.'
      );
    }
    return JSON.parse(readFileSync(absolute, 'utf8'));
  }

  throw new Error(
    'Missing Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON (Railway) ' +
      'or FIREBASE_SERVICE_ACCOUNT_PATH (local).'
  );
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(loadServiceAccount()),
  });
}

export const db = getFirestore();
export const storesCollection = db.collection('stores');
