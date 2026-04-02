/**
 * Single place that reads process.env. Import `ENVIRONMENT` elsewhere instead of using process.env directly.
 */

import { resolve } from 'path';
import dotenv from 'dotenv';
import type { CompanyBrandingConfig } from '@/app/_server/lib/types/companies';

try {
  dotenv.config({ path: resolve(process.cwd(), '.env'), quiet: true });
} catch {
  // .env missing or unreadable — rely on the host environment (Coolify, Vercel, etc.)
}

function normalizePrivateKeyFromEnv(raw: string | undefined): string | undefined {
  if (raw == null || raw === '') return undefined;
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, '\n').trimEnd();
}

function parsePort(s: string | undefined, fallback: number): number {
  const n = parseInt(s ?? '', 10);
  return Number.isFinite(n) ? n : fallback;
}

const firebaseAdminPrivateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
const firebaseAdminPrivateKey = normalizePrivateKeyFromEnv(firebaseAdminPrivateKeyRaw);

export interface IEnvironment {
  RUNTIME: {
    NODE_ENV: string;
    IS_PRODUCTION: boolean;
    IS_DEVELOPMENT: boolean;
    PORT: string;
    VERCEL_URL: string | undefined;
  };
  PUBLIC: {
    APP_URL: string | undefined;
    R2_PUBLIC_URL: string | undefined;
  };
  IMAGES: {
    /** R2 base URL for next/image remotePatterns (server or NEXT_PUBLIC). */
    R2_PUBLIC_BASE_URL: string;
  };
  SEO: {
    LIVE_URL: string;
  };
  SEED: {
    FIRESTORE_ON_BOOT: string | undefined;
  };
  WEBHOOK: {
    SECRET: string | undefined;
  };
  FIREBASE_ADMIN: {
    PROJECT_ID: string | undefined;
    CLIENT_EMAIL: string | undefined;
    PRIVATE_KEY: string | undefined;
    PRIVATE_KEY_RAW_CHAR_LENGTH: number;
    PRIVATE_KEY_RAW_BACKSLASH_N_COUNT: number;
  };
  FIREBASE_CLIENT: {
    API_KEY: string | undefined;
    AUTH_DOMAIN: string | undefined;
    PROJECT_ID: string | undefined;
    STORAGE_BUCKET: string | undefined;
    MESSAGING_SENDER_ID: string | undefined;
    APP_ID: string | undefined;
    MEASUREMENT_ID: string | undefined;
  };
  APP: {
    NAME: string;
    ENV?: string;
    APP_URL: string;
  };
  EMAIL: {
    FROM: string;
    PASSWORD: string;
    HOST: string;
    PORT: number;
    TO: string;
  };
  R2: {
    ACCOUNT_ID: string;
    ACCESS_KEY_ID: string;
    SECRET_ACCESS_KEY: string;
    BUCKET_NAME: string;
    CDN_URL: string;
    PUBLIC_URL: string;
    FOLDER_PREFIX: string;
  };
  COMPANIES: CompanyBrandingConfig;
}

export const ENVIRONMENT: IEnvironment = {
  RUNTIME: {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    PORT: process.env.PORT ?? '3000',
    VERCEL_URL: process.env.VERCEL_URL,
  },
  PUBLIC: {
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
  },
  IMAGES: {
    R2_PUBLIC_BASE_URL: process.env.R2_PUBLIC_URL ?? process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? '',
  },
  SEO: {
    LIVE_URL: process.env.live_url || 'https://crelyst.com.ng',
  },
  SEED: {
    FIRESTORE_ON_BOOT: process.env.SEED_FIRESTORE_ON_BOOT,
  },
  WEBHOOK: {
    SECRET: process.env.WEBHOOK_SECRET?.trim(),
  },
  FIREBASE_ADMIN: {
    PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    PRIVATE_KEY: firebaseAdminPrivateKey,
    PRIVATE_KEY_RAW_CHAR_LENGTH: firebaseAdminPrivateKeyRaw?.length ?? 0,
    PRIVATE_KEY_RAW_BACKSLASH_N_COUNT: (firebaseAdminPrivateKeyRaw?.match(/\\n/g) ?? []).length,
  },
  FIREBASE_CLIENT: {
    API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
  APP: {
    NAME: process.env.APP_NAME!,
    ENV: process.env.NODE_ENV,
    APP_URL: process.env.APP_URL ?? '',
  },
  EMAIL: {
    FROM: process.env.FROM_EMAIL!,
    TO: process.env.TO_EMAIL!,
    PASSWORD: process.env.MAIL_PASSWORD!,
    HOST: process.env.MAIL_HOST!,
    PORT: parsePort(process.env.MAIL_PORT, 465),
  },
  R2: {
    ACCOUNT_ID: process.env.R2_ACCOUNT_ID || '',
    ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || '',
    SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || '',
    BUCKET_NAME: process.env.R2_BUCKET_NAME || '',
    CDN_URL: process.env.R2_CDN_URL || '',
    PUBLIC_URL: process.env.R2_PUBLIC_URL || '',
    FOLDER_PREFIX: process.env.R2_FOLDER_PREFIX || 'staging-files',
  },
  COMPANIES: {
    crelyst: {
      name: 'Crelyst',
      logo: 'https://static.crelyst.com.ng/logo.png',
      fullLogo: 'https://static.crelyst.com.ng/logo-full.png',
      primaryUrl: process.env.APP_URL || 'https://crelyst.com.ng',
      supportEmail: 'hello@crelyst.com.ng',
      primaryColor: '#F27B35',
      secondaryColor: '#404040',
      fontFamily: 'Montserrat',
      socialMedia: {
        x: process.env.SOCIAL_X || '',
        instagram: process.env.SOCIAL_INSTAGRAM || '',
        facebook: process.env.SOCIAL_FACEBOOK || '',
        tiktok: process.env.SOCIAL_TIKTOK || '',
        linkedin: process.env.SOCIAL_LINKEDIN || '',
      },
      email: {
        from: process.env.FROM_EMAIL || 'no-reply@crelyst.com.ng',
        defaultTo: process.env.COMPANY_CRELYST_EMAIL_TO || process.env.TO_EMAIL || '',
        password: process.env.COMPANY_CRELYST_EMAIL_PASSWORD || process.env.MAIL_PASSWORD || '',
        host: process.env.COMPANY_CRELYST_EMAIL_HOST || process.env.MAIL_HOST || '',
        port: parsePort(process.env.COMPANY_CRELYST_EMAIL_PORT || process.env.MAIL_PORT, 465),
      },
    },
  },
};
