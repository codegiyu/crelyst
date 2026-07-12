import { describe, it, expect } from 'vitest';
import { portfolioCaseStudyContentSchema } from './schema';

/**
 * TechXForge Global — first project from bold-brand-studio/src/data/projects.ts
 * with image import paths replaced by placeholder URLs (schema validates content shape only).
 */
export const techxforgeProjectFixture = {
  featured: true,
  slug: 'techxforge-global',
  title: 'TechXForge Global',
  category: 'Brand Identity',
  industry: 'Tech Community',
  client: 'TechXForge Global',
  aboutClientHeading: {
    headingTextStart: 'About ',
    headingTextSpecial: 'TechXForge Global',
  },
  aboutClient: [
    {
      text: 'TechXForge Global is a mentorship-driven technology community dedicated to transforming beginners into highly skilled, job-ready professionals. Positioned at the intersection of education, discipline, and real-world application, the brand bridges the gap between learning and mastery, serving as a forging ground where raw potential evolves into technical excellence.',
    },
  ],
  services: ['Brand Identity Design', 'Strategy'],
  timeline: '2 Weeks',
  description:
    'Brand identity design for a mentorship-driven tech community, focused on transformation, precision, and structured growth. The visual system reflects discipline, evolution, and collaboration while positioning the brand as a global hub for developing world-class tech professionals.',
  image: '/assets/techxforge.png',
  hero: '/assets/techxforge.png',
  summary: [
    {
      text: 'The TechXForge Global brand identity was designed to visually communicate transformation, discipline, and excellence. The goal was to create a bold and modern identity that represents growth through structured learning, mentorship, and real-world application, while appealing to ambitious individuals entering the tech industry.',
    },
  ],
  challengeHeading: {
    headingTextStart: 'Building a ',
    headingTextSpecial: 'Transformation-Driven Identity',
  },
  challenge: [
    {
      text: 'The challenge was to create a brand identity that clearly communicates growth, discipline, and technical excellence while differentiating TechXForge from generic learning platforms. The identity needed to feel aspirational, structured, and community-driven, appealing to beginners while maintaining credibility within the global tech space.',
    },
  ],
  strategy: [
    {
      text: 'The strategy focused on positioning TechXForge as a forging ground for talent rather than just a learning platform. The visual and brand system was built around transformation, precision, and continuous evolution—using bold design elements, structured compositions, and symbolic representation of growth, mastery, and collaboration.',
    },
  ],
  logoDesign: {
    breakdown: [
      {
        text: 'A forged “X” symbol that represents the transformation of individuals into world-class tech professionals through structured growth, precision training, and a strong collaborative community.',
      },
    ],
    gridImage: '/assets/project/techxforge/techlogo.png',
  },
  identityImages: [
    '/assets/project/techxforge/techxforge1.png',
    '/assets/project/techxforge/techxforge2.png',
    '/assets/project/techxforge/techxforge3.png',
    '/assets/project/techxforge/techxforge4.png',
  ],
  applicationsImages: [
    '/assets/project/techxforge/techxforge5.png',
    '/assets/project/techxforge/techxforge6.png',
    '/assets/project/techxforge/techxforge7.png',
    '/assets/project/techxforge/techxforge8.png',
  ],
  colorPalette: [
    { name: 'Electric Lime Green', hex: '#87E22D' },
    { name: 'Deep Forest Green', hex: '#0D2702' },
    { name: 'Pure Black', hex: '#000000' },
    { name: 'Clean White', hex: '#FEFEFE' },
  ],
  typographyPrimary: 'Aktiv Grotesk Geor',
  typographySecondary: '',
  results: [
    { label: 'Brand Clarity', value: 'Strong Positioning' },
    { label: 'Audience Alignment', value: 'High Engagement' },
    { label: 'Visual Consistency', value: 'Scalable System' },
    { label: 'Perceived Value', value: '+80%' },
  ],
  keywords: [
    'TechXForge Global',
    'Brand Identity',
    'Tech Community',
    'Mentorship Platform',
    'Technology Education',
    'Talent Development',
    'Visual Identity',
    'Startup Branding',
  ],
} as const;

describe('portfolioCaseStudyContentSchema', () => {
  it('validates TechXForge Global from bold-brand-studio projects.ts without modification', () => {
    const result = portfolioCaseStudyContentSchema.safeParse(techxforgeProjectFixture);
    expect(result.success).toBe(true);
  });

  it('rejects missing required slug', () => {
    const { slug: _slug, ...rest } = techxforgeProjectFixture;
    const result = portfolioCaseStudyContentSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});
