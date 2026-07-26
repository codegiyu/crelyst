/**
 * Crelyst public /about page CMS content (siteSettings.aboutPage slice).
 */

export const ABOUT_VALUE_ICON_KEYS = ['lightbulb', 'heart', 'target', 'shield'] as const;
export type AboutValueIconKey = (typeof ABOUT_VALUE_ICON_KEYS)[number];

export type AboutHeroContent = {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
};

/** Static about hero background — not CMS-managed. */
export const ABOUT_HERO_BACKGROUND_IMAGE = '/images/bg-hero-3.jpg';

export type AboutCountStat = {
  kind: 'count';
  target: number;
  label: string;
};

export type AboutStaticStat = {
  kind: 'static';
  value: string;
  label: string;
};

export type AboutStatItem = AboutCountStat | AboutStaticStat;

export type AboutStoryContent = {
  caption: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  imageUrl: string;
  imageAlt: string;
};

export type AboutValueItem = {
  iconKey: AboutValueIconKey;
  title: string;
  description: string;
};

export type AboutValuesContent = {
  caption: string;
  title: string;
  text: string;
  items: AboutValueItem[];
};

export type AboutCtaContent = {
  caption: string;
  title: string;
  description: string;
  buttonLabel: string;
};

export type AboutPageContent = {
  hero: AboutHeroContent;
  stats: AboutStatItem[];
  story: AboutStoryContent;
  values: AboutValuesContent;
  cta: AboutCtaContent;
};

export const DEFAULT_ABOUT_PAGE_CONTENT: AboutPageContent = {
  hero: {
    badge: 'About Us',
    titleLine1: 'Where Creativity Meets',
    titleLine2: 'Vision',
    description:
      "We're a creative design agency specializing in photography, branding, product design, packaging, and visual identity. We help brands express their unique personality through powerful visuals and storytelling.",
  },
  stats: [
    { kind: 'count', target: 150, label: 'Projects' },
    { kind: 'count', target: 50, label: 'Clients' },
    { kind: 'count', target: 5, label: 'Years' },
    { kind: 'static', value: '24/7', label: 'Support' },
  ],
  story: {
    caption: 'Our Story',
    title: 'The Crelyst Story',
    subtitle: 'Where creativity meets purpose',
    paragraphs: [
      'Crelyst was born from a simple belief: every brand has a unique story waiting to be told. We’re a full-service design and branding agency that specializes in bringing these stories to life through powerful visuals and compelling narratives.',
      'Our work spans photography, brand design, product design, packaging, and visual identity development. We don’t just create designs—we craft experiences that resonate with audiences and leave lasting impressions.',
      'We also believe in the power of collaboration. That’s why we work with talented freelance designers on select projects, sharing a percentage of each job. Together, we create work that pushes boundaries and sets new standards in creative excellence.',
    ],
    imageUrl: '/images/bg-section-5.jpg',
    imageAlt: 'Crelyst creative studio workspace',
  },
  values: {
    caption: 'Values',
    title: 'Our Values',
    text: 'The principles that guide everything we do',
    items: [
      {
        iconKey: 'lightbulb',
        title: 'Creative Vision',
        description:
          "We see design as storytelling. Every color, shape, and texture is chosen to express your brand's unique personality and connect with your audience on an emotional level.",
      },
      {
        iconKey: 'heart',
        title: 'Artistic Expression',
        description:
          'We believe in bold, expressive designs that break free from corporate templates. Our work is art-driven, memorable, and distinctly creative.',
      },
      {
        iconKey: 'target',
        title: 'Visual Storytelling',
        description:
          "Through photography, branding, and design, we help brands communicate their essence. We don't just make things look good—we make them speak.",
      },
      {
        iconKey: 'shield',
        title: 'Collaborative Spirit',
        description:
          "We partner with talented freelancers and work closely with clients to bring diverse perspectives together, creating work that's greater than the sum of its parts.",
      },
    ],
  },
  cta: {
    caption: 'Work with us',
    title: 'Ready to bring your story to life?',
    description:
      "You know who we are and how we work — tell us about your brand and goals, and we'll craft visuals that reflect your values with the same care you see across our team and work.",
    buttonLabel: 'Start Your Project',
  },
};
