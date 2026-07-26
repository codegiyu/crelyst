import { describe, expect, it } from 'vitest';
import { transformContactInfoToFooterCards } from './contactInfo';
import type { ContactInfo } from '@/lib/types/site-settings';

const baseContact = (): ContactInfo => ({
  address: [],
  tel: [],
  email: [],
  whatsapp: '',
  locationUrl: '',
  mapsEmbedUrl: '',
  officeHours: {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  },
});

describe('transformContactInfoToFooterCards', () => {
  it('returns empty when contact info is missing', () => {
    expect(transformContactInfoToFooterCards(undefined)).toEqual([]);
  });

  it('includes address, phone, email, and WhatsApp when set', () => {
    const cards = transformContactInfoToFooterCards({
      ...baseContact(),
      address: ['Lagos, Nigeria'],
      locationUrl: 'https://maps.example.com',
      tel: ['+234 800 000 0000'],
      email: ['hello@crelyst.com.ng'],
      whatsapp: '+234 916 204 5977',
    });

    expect(cards).toHaveLength(4);
    expect(cards[0].texts[0].text).toBe('Lagos, Nigeria');
    expect(cards[0].href).toBe('https://maps.example.com');
    expect(cards[1].texts[0].link).toBe('tel:+2348000000000');
    expect(cards[2].texts[0].link).toBe('mailto:hello@crelyst.com.ng');
    expect(cards[3].texts[0].link).toBe('https://wa.me/2349162045977');
  });

  it('omits WhatsApp when digits are empty', () => {
    const cards = transformContactInfoToFooterCards({
      ...baseContact(),
      email: ['hello@crelyst.com.ng'],
      whatsapp: '   ',
    });

    expect(cards).toHaveLength(1);
    expect(cards[0].texts[0].link).toContain('mailto:');
  });
});
