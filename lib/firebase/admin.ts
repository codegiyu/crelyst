/**
 * Firebase Admin SDK initialization (server-side only)
 *
 * Next.js can load multiple server chunks, each with its own `firebase-admin` module
 * instance. `getApps()` only sees apps registered in that copy, so we cache the
 * initialized SDK on globalThis (same idea as Prisma in dev).
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import { resolve } from 'path';

try {
  dotenv.config({ path: resolve(process.cwd(), '.env') });
} catch {
  // dotenv config failed - environment variables must be set manually
}

/** PEM from env is often mangled: quoted values, literal `\n` instead of newlines (Docker/Coolify). */
function normalizePrivateKeyFromEnv(raw: string | undefined): string | undefined {
  if (raw == null || raw === '') return undefined;
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, '\n').trimEnd();
}

const globalForFirebase = globalThis as typeof globalThis & {
  __crelystFirebaseAdmin?: {
    adminApp?: App;
    adminAuth?: Auth;
    adminDb?: Firestore;
  };
};

let adminApp: App | undefined;
let adminAuth: Auth | undefined;
let adminDb: Firestore | undefined;

const cached = globalForFirebase.__crelystFirebaseAdmin;
if (cached?.adminDb && cached.adminAuth && cached.adminApp) {
  adminApp = cached.adminApp;
  adminAuth = cached.adminAuth;
  adminDb = cached.adminDb;
} else if (!getApps().length) {
  try {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = normalizePrivateKeyFromEnv(process.env.FIREBASE_ADMIN_PRIVATE_KEY);

    if (projectId && clientEmail && privateKey) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

      adminAuth = getAuth(adminApp);
      adminDb = getFirestore(adminApp);
      globalForFirebase.__crelystFirebaseAdmin = { adminApp, adminAuth, adminDb };
    } else {
      console.warn('Firebase Admin credentials not fully configured. Some features may not work.');
    }
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
  }
} else {
  const app = getApps()[0];
  adminApp = app;
  adminAuth = getAuth(app);
  adminDb = getFirestore(app);
  globalForFirebase.__crelystFirebaseAdmin = { adminApp, adminAuth, adminDb };
}

export { adminApp, adminAuth, adminDb };
