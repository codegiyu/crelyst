import type { WhatWeCreateCardLayout } from '@/components/section/home/WhatWeCreateCard';
import type { ClientProject, ClientService, ClientTestimonial } from '@/lib/constants/endpoints';

const IMG = 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop';
const BANNER = 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=1920&h=1080&fit=crop';

const now = '2025-01-01T00:00:00.000Z';

function baseProject(overrides: Partial<ClientProject>): ClientProject {
  return {
    _id: 'styleguide-project',
    title: 'Sample Project',
    slug: 'sample-project',
    description:
      'A sample project description for the internal styleguide. Used only for layout previews.',
    shortDescription: 'Short description for card and overlay previews.',
    featuredImage: IMG,
    cardImage: IMG,
    bannerImage: BANNER,
    heroImage: IMG,
    images: [IMG],
    technologies: ['Branding', 'Web Design', 'Photography'],
    category: 'Brand Identity',
    status: 'completed',
    isFeatured: true,
    isActive: true,
    displayOrder: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export const styleguideCaseStudyProject: ClientProject = baseProject({
  _id: 'styleguide-case-study',
  slug: 'styleguide-case-study',
  title: 'Pixelore Studio',
  caseStudy: {
    industry: 'Technology',
    services: ['Brand Design', 'Web Design'],
    engagementTimeline: '8 Weeks',
    summary: {
      paragraphs: [{ text: 'Summary paragraph for styleguide preview.' }],
    },
    challenge: {
      paragraphs: [{ text: 'Challenge paragraph for styleguide preview.' }],
    },
    strategy: {
      paragraphs: [{ text: 'Strategy paragraph for styleguide preview.' }],
    },
    visualIdentity: {
      identityImages: [IMG],
      colorPalette: [{ name: 'Primary', hex: '#F27B35' }],
      typographyPrimary: 'Montserrat',
      typographySecondary: 'Poppins',
    },
    results: {
      metrics: [{ label: 'Engagement', value: '+42%' }],
    },
    keywords: ['styleguide'],
  },
});

export const styleguideBannerProject: ClientProject = baseProject({
  _id: 'styleguide-banner',
  slug: 'styleguide-banner',
  title: 'Campaign Launch',
  caseStudy: undefined,
  bannerImage: BANNER,
});

export const styleguideListingProject: ClientProject = baseProject({
  _id: 'styleguide-listing',
  slug: 'styleguide-listing',
  title: 'Listing Card Sample',
  isFeatured: false,
  displayOrder: 1,
});

export const styleguidePreviewProjects: ClientProject[] = [
  baseProject({
    _id: 'sg-p1',
    slug: 'sg-featured',
    title: 'Featured Brand Refresh',
    isFeatured: true,
    displayOrder: 0,
    category: 'Branding',
  }),
  ...Array.from({ length: 5 }, (_, i) =>
    baseProject({
      _id: `sg-p${i + 2}`,
      slug: `sg-project-${i + 2}`,
      title: `Project ${i + 2}`,
      isFeatured: false,
      displayOrder: i + 1,
      category: i % 2 === 0 ? 'Packaging' : 'Web',
    })
  ),
];

function baseService(overrides: Partial<ClientService>): ClientService {
  return {
    _id: 'styleguide-service',
    title: 'Brand Design',
    slug: 'brand-design',
    description: 'Sample service description for the styleguide.',
    shortDescription: 'Complete brand identity design and visual storytelling',
    icon: 'Palette',
    cardImage: IMG,
    bannerImage: BANNER,
    gallery: [],
    features: ['Logo Design', 'Brand Guidelines'],
    isActive: true,
    displayOrder: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export const styleguideService: ClientService = baseService({
  _id: 'styleguide-service',
  pageTitle: 'We craft brand identities that speak before you do',
  description: 'Sample service description for the styleguide detail hero preview.',
});

/** Figma Landing Page — Desktop: “What We Create” (two-card row). */
export type StyleguideWhatWeCreateEntry = {
  service: ClientService;
  eyebrow: string;
  layout: WhatWeCreateCardLayout;
};

/** Shown on the styleguide when Firestore has no active testimonials yet. */
export const styleguideFallbackTestimonial: ClientTestimonial = {
  _id: 'styleguide-testimonial-fallback',
  clientName: 'Priya Natarajan',
  clientRole: 'Head of Brand',
  companyName: 'Lumen Studio',
  clientImage: 'https://randomuser.me/api/portraits/women/65.jpg',
  companyLogo: 'https://via.placeholder.com/80x80/2a2a2a/e8e8e8?text=LS',
  testimonial:
    'Exceptional attention to detail and a deep understanding of brand storytelling. The deliverables exceeded expectations and our team could not be happier.',
  rating: 4,
  isFeatured: true,
  isActive: true,
  displayOrder: 0,
  createdAt: '2023-03-15T11:00:00.000Z',
  updatedAt: now,
};

export const styleguideWhatWeCreateCards: StyleguideWhatWeCreateEntry[] = [
  {
    eyebrow: 'Crafted Experience',
    layout: 'wide',
    service: baseService({
      _id: 'sg-svc-brand',
      slug: 'brand-design',
      title: 'Brand Design',
      cardImage:
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop&q=80',
      displayOrder: 0,
    }),
  },
  {
    eyebrow: 'Industrial Focus',
    layout: 'standard',
    service: baseService({
      _id: 'sg-svc-product',
      slug: 'product-design',
      title: 'Product Design',
      cardImage:
        'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&h=1000&fit=crop&q=80',
      displayOrder: 1,
    }),
  },
];
