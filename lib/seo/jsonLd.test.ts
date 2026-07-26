import { describe, expect, it } from 'vitest';
import {
  buildBreadcrumbJsonLd,
  buildCreativeWorkJsonLd,
  buildFaqPageJsonLd,
  buildOrganizationJsonLd,
} from './jsonLd';

describe('jsonLd builders', () => {
  it('builds Organization schema with contact and social links', () => {
    const schema = buildOrganizationJsonLd({
      origin: 'https://crelyst.com.ng',
      contactInfo: {
        address: ['Lagos, Nigeria'],
        tel: ['+2348000000000'],
        email: ['hello@crelyst.com.ng'],
        whatsapp: '',
        locationUrl: '',
        officeHours: {
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: null,
          sunday: null,
        },
      },
      socials: [{ platform: 'instagram', href: 'https://instagram.com/crelyst' }],
    });

    expect(schema['@type']).toBe('Organization');
    expect(schema.sameAs).toEqual(['https://instagram.com/crelyst']);
  });

  it('builds CreativeWork from project fields', () => {
    const schema = buildCreativeWorkJsonLd({
      title: 'Nextron',
      description: 'Brand identity case study',
      image: 'https://crelyst.com.ng/hero.png',
      slug: 'nextron',
      routePrefix: '/projects',
      origin: 'https://crelyst.com.ng',
    });

    expect(schema.url).toBe('https://crelyst.com.ng/projects/nextron');
  });

  it('builds FAQPage only when questions exist', () => {
    expect(buildFaqPageJsonLd([])).toBeNull();
    expect(
      buildFaqPageJsonLd([{ question: 'What do you offer?', answer: 'Branding services.' }])
    ).toMatchObject({
      '@type': 'FAQPage',
    });
  });

  it('builds breadcrumb positions in order', () => {
    const schema = buildBreadcrumbJsonLd(
      [
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
      ],
      'https://crelyst.com.ng'
    );

    expect(schema.itemListElement).toHaveLength(2);
    expect((schema.itemListElement as Array<{ position: number }>)[1].position).toBe(2);
  });
});
