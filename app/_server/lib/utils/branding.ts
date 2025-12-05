import { ENVIRONMENT } from '../config/environment';
import type { CompanyBranding } from '../types/companies';
import { COMPANY_KEYS, CompanyKey } from '../types/constants';

/**
 * Type guard to validate if a string is a valid company key
 */
export function validateCompany(company: string): company is CompanyKey {
  return COMPANY_KEYS.includes(company as CompanyKey);
}

/**
 * Get company branding configuration
 */
export function getCompanyBranding(company: CompanyKey): CompanyBranding {
  const branding = ENVIRONMENT.COMPANIES[company];

  if (!branding) {
    throw new Error(`Company branding not found for: ${company}`);
  }

  return branding;
}

/**
 * Get company color scheme
 */
export function getCompanyColors(company: CompanyKey): {
  primary: string;
  secondary: string;
} {
  const branding = getCompanyBranding(company);
  return {
    primary: branding.primaryColor,
    secondary: branding.secondaryColor,
  };
}

/**
 * Get email sender name for company
 */
export function getCompanySender(company: CompanyKey): string {
  const branding = getCompanyBranding(company);
  return `${branding.name} <${branding.email.from}>`;
}

/**
 * Get company email configuration
 */
export function getCompanyEmail(company: CompanyKey): {
  from: string;
  defaultTo: string;
  password: string;
  host: string;
  port: number;
} {
  const branding = getCompanyBranding(company);
  return branding.email;
}
