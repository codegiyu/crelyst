import { CompanyBrandingConfig } from '../types/companies';

interface IEnvironment {
  APP: {
    NAME: string;
    ENV?: string;
    APP_URL: string;
  };
  DB: {
    URL: string;
  };
  EMAIL: {
    FROM: string;
    PASSWORD: string;
    HOST: string;
    PORT: number;
    TO: string;
  };
  TOKEN_NAMES: {
    COOKIES: {
      ACCESS: string;
      REFRESH: string;
    };
  };
  JWT: {
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
  };
  COOKIE: {
    ACCESS_COOKIE_EXPIRES_IN: number;
    REFRESH_COOKIE_EXPIRES_IN: number;
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
  REDIS: {
    URL: string;
    CACHE_EXPIRY: number;
  };
  COMPANIES: CompanyBrandingConfig;
}

export const ENVIRONMENT: IEnvironment = {
  APP: {
    NAME: process.env.APP_NAME!,
    ENV: process.env.NODE_ENV,
    APP_URL: process.env.APP_URL ?? '',
  },
  DB: {
    URL: process.env.DB_URL!,
  },
  EMAIL: {
    FROM: process.env.FROM_EMAIL!,
    TO: process.env.TO_EMAIL!,
    PASSWORD: process.env.MAIL_PASSWORD!,
    HOST: process.env.MAIL_HOST!,
    PORT: parseInt(process.env.MAIL_PORT!),
  },
  TOKEN_NAMES: {
    COOKIES: {
      ACCESS: 'app-acc-token',
      REFRESH: 'app-ref-token',
    },
  },
  JWT: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN!,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN!,
  },
  COOKIE: {
    ACCESS_COOKIE_EXPIRES_IN: parseInt(process.env.ACCESS_COOKIE_EXPIRES_IN!),
    REFRESH_COOKIE_EXPIRES_IN: parseInt(process.env.REFRESH_COOKIE_EXPIRES_IN!),
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
  REDIS: {
    URL: process.env.REDIS_URL!,
    CACHE_EXPIRY: Number(process.env.CACHE_EXPIRY!),
  },
  COMPANIES: {
    crelyst: {
      name: 'Crelyst',
      logo: '/images/logo.png',
      fullLogo: '/images/full-logo.png',
      primaryUrl: process.env.APP_URL || 'https://crelyst.com',
      supportEmail: 'hello@crelyst.com',
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
        from: process.env.FROM_EMAIL || 'no-reply@crelyst.com',
        defaultTo: process.env.COMPANY_CRELYST_EMAIL_TO || process.env.TO_EMAIL || '',
        password: process.env.COMPANY_CRELYST_EMAIL_PASSWORD || process.env.MAIL_PASSWORD || '',
        host: process.env.COMPANY_CRELYST_EMAIL_HOST || process.env.MAIL_HOST || '',
        port: parseInt(process.env.COMPANY_CRELYST_EMAIL_PORT || process.env.MAIL_PORT || '465'),
      },
    },
  },
};
