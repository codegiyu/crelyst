import { CompanyBrandingConfig } from '../types/companies';

interface IEnvironment {
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
    PORT: parseInt(process.env.MAIL_PORT!),
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
