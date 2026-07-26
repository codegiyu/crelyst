import { describe, expect, it } from 'vitest';
import { partialMainSchema } from './main';

describe('partialMainSchema — Bold Brand Studio site content', () => {
  it('preserves about payload instead of stripping unknown keys', () => {
    const about = {
      eyebrow: 'About',
      headingLine1: 'Strategy First.',
      headingHighlight: 'Design Second.',
      paragraphs: ['Paragraph one'],
      imageUrl: 'https://static.crelyst.com.ng/bbs-site-content/content/about-portrait.jpg',
      imageAlt: 'Portrait',
      stats: [{ value: '50+', label: 'Brands Built' }],
    };

    const parsed = partialMainSchema.parse({ about });

    expect(parsed.about).toEqual(about);
  });

  it('preserves contact payload', () => {
    const contact = {
      eyebrow: 'Contact',
      headingPrefix: "Let's Build Something",
      headingHighlight: 'Bold.',
      description: 'Reach out.',
      email: 'hello@example.com',
      socials: [{ platform: 'instagram', href: 'https://instagram.com/example' }],
    };

    const parsed = partialMainSchema.parse({ contact });

    expect(parsed.contact).toEqual(contact);
  });

  it('preserves BBS seo fields beyond generic service seo keys', () => {
    const seo = {
      metaTitle: "Enemona Isaac's Design Portfolio",
      metaDescription: 'Portfolio description',
      siteName: 'Enemona Isaac',
      ogImageUrl: 'https://static.crelyst.com.ng/bbs-site-content/content/og-default.jpg',
      faviconUrl: 'https://static.crelyst.com.ng/bbs-site-content/content/favicon.png',
    };

    const parsed = partialMainSchema.parse({ seo });

    expect(parsed.seo).toEqual(seo);
  });

  it('preserves projectsListingSeo payload', () => {
    const projectsListingSeo = {
      metaTitle: 'Projects | Portfolio',
      metaDescription: 'Case studies',
      ogImageUrl: 'https://static.crelyst.com.ng/bbs-site-content/content/og-default.jpg',
      keywords: ['branding', 'design'],
    };

    const parsed = partialMainSchema.parse({ projectsListingSeo });

    expect(parsed.projectsListingSeo).toEqual(projectsListingSeo);
  });
});

describe('partialMainSchema — CMS payload gate (passthrough + known-field shapes)', () => {
  it('preserves portfolio case-study content keys that are not declared on mainSchema', () => {
    const payload = {
      title: 'Acme Rebrand',
      description: 'Full case study',
      category: 'Branding',
      image: 'https://static.crelyst.com.ng/x.jpg',
      hero: 'https://static.crelyst.com.ng/hero.jpg',
      client: 'Acme',
      industry: 'Fintech',
      slug: 'acme-rebrand',
      featured: true,
      services: ['Brand strategy'],
      timeline: '8 weeks',
      summary: [{ text: 'Summary' }],
      challenge: [{ text: 'Challenge' }],
      strategy: [{ text: 'Strategy' }],
      identityImages: ['https://static.crelyst.com.ng/id.jpg'],
      colorPalette: [{ name: 'Black', hex: '#000000' }],
      typographyPrimary: 'Inter',
      typographySecondary: 'Georgia',
      results: [{ label: 'Growth', value: '2x' }],
      keywords: ['brand'],
      isActive: true,
    };

    const parsed = partialMainSchema.parse(payload);

    expect(parsed).toMatchObject(payload);
  });

  it('preserves service extended CMS blobs', () => {
    const payload = {
      title: 'Brand Design',
      description: 'Service description',
      expertise: { heading: 'Expertise', items: ['Strategy'] },
      process: [{ title: 'Discover', description: 'Research' }],
      packagePricing: [{ name: 'Starter', price: '100' }],
      faq: [{ question: 'Q?', answer: 'A.' }],
      tags: ['branding'],
      slug: 'brand-design',
    };

    const parsed = partialMainSchema.parse(payload);

    expect(parsed).toMatchObject(payload);
  });

  it('preserves project caseStudy, heroImage, and tags (including null clear)', () => {
    const withCaseStudy = {
      title: 'Project',
      description: 'Desc',
      heroImage: 'https://static.crelyst.com.ng/hero.jpg',
      tags: ['web'],
      caseStudy: { overview: 'Overview text' },
    };
    const cleared = {
      title: 'Project',
      description: 'Desc',
      caseStudy: null,
    };

    expect(partialMainSchema.parse(withCaseStudy)).toMatchObject(withCaseStudy);
    expect(partialMainSchema.parse(cleared)).toMatchObject(cleared);
  });

  it('allows blank team member email (controller treats email as optional string)', () => {
    const parsed = partialMainSchema.parse({
      name: 'Ada Lovelace',
      role: 'Designer',
      email: '',
      bio: '',
      phone: '',
    });

    expect(parsed.email).toBe('');
  });

  it('allows settingsPayload socials value as an array of links', () => {
    const payload = {
      settingsPayload: [
        {
          name: 'socials',
          value: [{ platform: 'instagram', href: 'https://instagram.com/example' }],
        },
      ],
    };

    expect(partialMainSchema.parse(payload)).toEqual(payload);
  });

  it('preserves inbox mark-read payloads', () => {
    expect(partialMainSchema.parse({ isRead: true })).toEqual({ isRead: true });
    expect(partialMainSchema.parse({ formType: 'quote-request' })).toEqual({
      formType: 'quote-request',
    });
  });
});
