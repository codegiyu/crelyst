import {
  parsePhoneNumberWithError,
  isValidPhoneNumber,
  getCountryCallingCode,
  CountryCode,
} from 'libphonenumber-js';

export interface Country {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

/**
 * Converts ISO country code to flag emoji
 * @param countryCode - Two-letter ISO country code (e.g., 'NG', 'US')
 * @returns Flag emoji string
 */
function getCountryFlag(countryCode: string): string {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

// List of countries with their dial codes
export const COUNTRIES: Country[] = [
  { code: 'NG', dialCode: '+234', name: 'Nigeria', flag: getCountryFlag('NG') },
  { code: 'US', dialCode: '+1', name: 'United States', flag: getCountryFlag('US') },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', flag: getCountryFlag('GB') },
  { code: 'CA', dialCode: '+1', name: 'Canada', flag: getCountryFlag('CA') },
  { code: 'AU', dialCode: '+61', name: 'Australia', flag: getCountryFlag('AU') },
  { code: 'ZA', dialCode: '+27', name: 'South Africa', flag: getCountryFlag('ZA') },
  { code: 'KE', dialCode: '+254', name: 'Kenya', flag: getCountryFlag('KE') },
  { code: 'GH', dialCode: '+233', name: 'Ghana', flag: getCountryFlag('GH') },
  { code: 'TZ', dialCode: '+255', name: 'Tanzania', flag: getCountryFlag('TZ') },
  { code: 'UG', dialCode: '+256', name: 'Uganda', flag: getCountryFlag('UG') },
  { code: 'ET', dialCode: '+251', name: 'Ethiopia', flag: getCountryFlag('ET') },
  { code: 'EG', dialCode: '+20', name: 'Egypt', flag: getCountryFlag('EG') },
  { code: 'IN', dialCode: '+91', name: 'India', flag: getCountryFlag('IN') },
  { code: 'CN', dialCode: '+86', name: 'China', flag: getCountryFlag('CN') },
  { code: 'JP', dialCode: '+81', name: 'Japan', flag: getCountryFlag('JP') },
  { code: 'DE', dialCode: '+49', name: 'Germany', flag: getCountryFlag('DE') },
  { code: 'FR', dialCode: '+33', name: 'France', flag: getCountryFlag('FR') },
  { code: 'IT', dialCode: '+39', name: 'Italy', flag: getCountryFlag('IT') },
  { code: 'ES', dialCode: '+34', name: 'Spain', flag: getCountryFlag('ES') },
  { code: 'BR', dialCode: '+55', name: 'Brazil', flag: getCountryFlag('BR') },
  { code: 'MX', dialCode: '+52', name: 'Mexico', flag: getCountryFlag('MX') },
  { code: 'AR', dialCode: '+54', name: 'Argentina', flag: getCountryFlag('AR') },
  { code: 'RU', dialCode: '+7', name: 'Russia', flag: getCountryFlag('RU') },
  { code: 'KR', dialCode: '+82', name: 'South Korea', flag: getCountryFlag('KR') },
  { code: 'TR', dialCode: '+90', name: 'Turkey', flag: getCountryFlag('TR') },
  { code: 'SA', dialCode: '+966', name: 'Saudi Arabia', flag: getCountryFlag('SA') },
  { code: 'AE', dialCode: '+971', name: 'United Arab Emirates', flag: getCountryFlag('AE') },
  { code: 'SG', dialCode: '+65', name: 'Singapore', flag: getCountryFlag('SG') },
  { code: 'MY', dialCode: '+60', name: 'Malaysia', flag: getCountryFlag('MY') },
  { code: 'TH', dialCode: '+66', name: 'Thailand', flag: getCountryFlag('TH') },
  { code: 'ID', dialCode: '+62', name: 'Indonesia', flag: getCountryFlag('ID') },
  { code: 'PH', dialCode: '+63', name: 'Philippines', flag: getCountryFlag('PH') },
  { code: 'VN', dialCode: '+84', name: 'Vietnam', flag: getCountryFlag('VN') },
  { code: 'BD', dialCode: '+880', name: 'Bangladesh', flag: getCountryFlag('BD') },
  { code: 'PK', dialCode: '+92', name: 'Pakistan', flag: getCountryFlag('PK') },
  { code: 'IE', dialCode: '+353', name: 'Ireland', flag: getCountryFlag('IE') },
  { code: 'NL', dialCode: '+31', name: 'Netherlands', flag: getCountryFlag('NL') },
  { code: 'BE', dialCode: '+32', name: 'Belgium', flag: getCountryFlag('BE') },
  { code: 'SE', dialCode: '+46', name: 'Sweden', flag: getCountryFlag('SE') },
  { code: 'NO', dialCode: '+47', name: 'Norway', flag: getCountryFlag('NO') },
  { code: 'DK', dialCode: '+45', name: 'Denmark', flag: getCountryFlag('DK') },
  { code: 'FI', dialCode: '+358', name: 'Finland', flag: getCountryFlag('FI') },
  { code: 'AT', dialCode: '+43', name: 'Austria', flag: getCountryFlag('AT') },
  { code: 'CH', dialCode: '+41', name: 'Switzerland', flag: getCountryFlag('CH') },
  { code: 'PL', dialCode: '+48', name: 'Poland', flag: getCountryFlag('PL') },
  { code: 'PT', dialCode: '+351', name: 'Portugal', flag: getCountryFlag('PT') },
  { code: 'GR', dialCode: '+30', name: 'Greece', flag: getCountryFlag('GR') },
  { code: 'NZ', dialCode: '+64', name: 'New Zealand', flag: getCountryFlag('NZ') },
];

export const DEFAULT_COUNTRY = COUNTRIES.find(c => c.code === 'NG') || COUNTRIES[0];

const COUNTRIES_SORTED_BY_DIAL_LENGTH = [...COUNTRIES].sort((a, b) => {
  const aDigits = a.dialCode.replace(/\D/g, '').length;
  const bDigits = b.dialCode.replace(/\D/g, '').length;
  return bDigits - aDigits;
});

const COUNTRY_BY_CODE = new Map(COUNTRIES.map(country => [country.code, country]));
const COUNTRY_DIAL_DIGITS = new Map(
  COUNTRIES.map(country => [country.code, country.dialCode.replace(/\D/g, '')])
);

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRY_BY_CODE.get(code);
}

const getDialDigits = (country: Country) => COUNTRY_DIAL_DIGITS.get(country.code) ?? '';

/**
 * Cleans phone number input - removes all non-digit characters except spaces, hyphens, and brackets
 */
export function cleanPhoneInput(input: string): string {
  return input.replace(/[^\d\s\-()[\]]/g, '');
}

/**
 * Strips country code from phone number
 */
export function stripCountryCode(phoneNumber: string, countryCode: string): string {
  // Remove all non-digit characters for comparison
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  const codeDigits = countryCode.replace(/\D/g, '');

  // Check if the phone number starts with the country code
  if (digitsOnly.startsWith(codeDigits)) {
    // Remove the country code
    return digitsOnly.slice(codeDigits.length);
  }

  // Return the cleaned number without country code
  return digitsOnly;
}

/**
 * Formats the final phone value as +{countryCode}{cleanedNumber}
 */
export function formatPhoneValue(countryCode: string, phoneNumber: string): string {
  let cleaned = phoneNumber.replace(/\D/g, '');
  if (!cleaned) return '';

  if (countryCode === '+234' && cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  return `${countryCode}${cleaned}`;
}

/**
 * Finds the matching country from a phone number value
 * Prioritizes longer country codes first to avoid false matches
 */
export function findCountryFromPhoneNumber(phoneNumber: string): Country | null {
  const cleanedValue = phoneNumber.replace(/\D/g, '');

  const matchingCountry = COUNTRIES_SORTED_BY_DIAL_LENGTH.find(country => {
    const countryDigits = getDialDigits(country);
    return countryDigits ? cleanedValue.startsWith(countryDigits) : false;
  });

  return matchingCountry || null;
}

/**
 * Validates a phone number using libphonenumber-js
 * @param phoneNumber - The phone number to validate (should include country code, e.g., +2348140629487)
 * @param countryCode - Optional ISO country code (e.g., 'NG') for validation context
 * @returns true if the phone number is valid, false otherwise
 */
export function validatePhoneNumber(phoneNumber: string, countryCode?: CountryCode): boolean {
  if (!phoneNumber || !phoneNumber.trim()) {
    return false;
  }

  try {
    // If country code is provided, validate with that context
    if (countryCode) {
      return isValidPhoneNumber(phoneNumber, countryCode);
    }

    // Otherwise, try to parse and validate without country context
    return isValidPhoneNumber(phoneNumber);
  } catch {
    return false;
  }
}

/**
 * Parses a phone number and returns formatted information
 * @param phoneNumber - The phone number to parse
 * @param countryCode - Optional ISO country code for parsing context
 * @returns Parsed phone number object or null if invalid
 */
export function parsePhoneNumberWithValidation(phoneNumber: string, countryCode?: CountryCode) {
  if (!phoneNumber || !phoneNumber.trim()) {
    return null;
  }

  try {
    if (countryCode) {
      return parsePhoneNumberWithError(phoneNumber, countryCode);
    }
    return parsePhoneNumberWithError(phoneNumber);
  } catch {
    return null;
  }
}

/**
 * Gets the country calling code for a given country code
 */
export function getCountryCallingCodeForCountry(countryCode: CountryCode): string {
  try {
    return `+${getCountryCallingCode(countryCode)}`;
  } catch {
    return '';
  }
}
