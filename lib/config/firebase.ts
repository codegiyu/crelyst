/**
 * Firebase client configuration
 * Used for client-side Firebase operations
 */

import { ENVIRONMENT } from '@/lib/config/environment';

const c = ENVIRONMENT.FIREBASE_CLIENT;

export const firebaseConfig = {
  apiKey: c.API_KEY,
  authDomain: c.AUTH_DOMAIN,
  projectId: c.PROJECT_ID,
  storageBucket: c.STORAGE_BUCKET,
  messagingSenderId: c.MESSAGING_SENDER_ID,
  appId: c.APP_ID,
  measurementId: c.MEASUREMENT_ID,
};
