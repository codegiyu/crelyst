/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ENVIRONMENT } from '@/lib/config/environment';

const pemDiagOnce = globalThis as typeof globalThis & { __crelystFirebasePemDiagLogged?: boolean };

/** Safe diagnostics for Coolify/Docker PEM issues — never log the full private key. */
function logFirebaseAdminPrivateKeyDiagnostics(): void {
  if (pemDiagOnce.__crelystFirebasePemDiagLogged) return;
  pemDiagOnce.__crelystFirebasePemDiagLogged = true;

  const fa = ENVIRONMENT.FIREBASE_ADMIN;
  const nk = fa.PRIVATE_KEY;
  console.log('nk', nk);
  const lines = nk ? nk.split('\n') : [];
  const firstLine = lines[0] ?? '(empty)';
  const lastLine = lines.length > 0 ? lines[lines.length - 1] : '(empty)';
  console.info('[Firebase Admin] PEM diagnostics (private key material is not logged):', {
    projectIdSet: Boolean(fa.PROJECT_ID),
    clientEmailSet: Boolean(fa.CLIENT_EMAIL),
    rawCharLength: fa.PRIVATE_KEY_RAW_CHAR_LENGTH,
    normalizedCharLength: nk?.length ?? 0,
    normalizedLineCount: lines.length,
    rawBackslashNSequenceCount: fa.PRIVATE_KEY_RAW_BACKSLASH_N_COUNT,
    normalizedNewlineCount: nk ? (nk.match(/\n/g) ?? []).length : 0,
    pemFirstLine: firstLine,
    pemSecondLine: lines[1] ?? '(empty)',
    pemLastLine: lastLine,
    pemLooksLikePkcs8:
      firstLine.includes('BEGIN PRIVATE KEY') && lastLine.includes('END PRIVATE KEY'),
  });
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
    const projectId = ENVIRONMENT.FIREBASE_ADMIN.PROJECT_ID;
    const clientEmail = ENVIRONMENT.FIREBASE_ADMIN.CLIENT_EMAIL;
    const privateKey = ENVIRONMENT.FIREBASE_ADMIN.PRIVATE_KEY;

    // logFirebaseAdminPrivateKeyDiagnostics();

    if (projectId && clientEmail && privateKey) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

      console.log('adminApp initialized');
      adminAuth = getAuth(adminApp);
      console.log('adminAuth initialized');
      adminDb = getFirestore(adminApp);
      console.log('adminDb initialized');
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
