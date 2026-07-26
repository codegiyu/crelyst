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
