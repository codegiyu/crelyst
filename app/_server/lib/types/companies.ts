export interface CompanyBranding {
  name: string;
  logo: string; // URL for header logo
  fullLogo: string; // URL for footer full logo
  primaryUrl: string;
  socialMedia: {
    x?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
  };
  supportEmail: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  email: {
    from: string;
    defaultTo: string;
    password: string; // From .env
    host: string;
    port: number;
  };
}

export interface CompanyBrandingConfig {
  [key: string]: CompanyBranding;
}
