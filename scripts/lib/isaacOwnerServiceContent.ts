import type {
  IServicePackagePricing,
  IServicePricingFooter,
} from '@/app/_server/lib/types/constants';

export type IsaacServiceContentUpdate = {
  slug: string;
  /** Fields to merge onto an existing service document */
  mergeFields?: string[];
  payload: Record<string, unknown>;
};

const PACKAGING_PRICING: IServicePackagePricing[] = [
  {
    id: 'packaging_design',
    title: 'Scope of Packaging Design & Pricing',
    packages: [
      {
        id: 'label-design',
        title: 'Label Design',
        summary: 'For bottles, jars, pouches, cans, and containers.',
        priceRange: [100_000],
        benefits: [
          '2 Initial Concepts',
          'Up to 3 Revisions',
          'Print-Ready Files (AI, PDF, PNG)',
          'Mockup Presentation',
        ],
      },
      {
        id: 'single-packaging-design',
        title: 'Single Packaging Design',
        summary: 'For one product package (box, pouch, carton, sleeve, etc.).',
        priceRange: [200_000],
        benefits: [
          'Custom Packaging Layout',
          'Print-Ready Artwork',
          'Up to 3 Revisions',
          '3D Mockup Presentation',
          'Production-Ready Files',
        ],
      },
      {
        id: 'packaging-collection',
        title: 'Packaging Collection',
        summary: 'Perfect for brands with multiple flavors, sizes, or product lines.',
        priceRange: [500_000],
        benefits: [
          'Up to 5 Product Variants',
          'Consistent Packaging System',
          'Print-Ready Files',
          '3D Mockup Presentation',
          'Production-Ready Artwork',
        ],
      },
      {
        id: 'premium-packaging-package',
        title: 'Premium Packaging Package',
        summary:
          'From concept to shelf-ready packaging. Ideal for food & beverage, cosmetics, skincare, pharmaceuticals, and FMCG brands.',
        priceRange: [800_000],
        isFeatured: true,
        benefits: [
          'Packaging Strategy',
          'Label & Packaging Design',
          'Primary & Secondary Packaging',
          'Multiple Product Variants',
          'Premium 3D Mockup Presentation',
          'Print Production Support',
          'Production-Ready Files',
        ],
      },
    ],
  },
];

const BRAND_STRATEGY_SERVICE = {
  title: 'Brand Strategy',
  slug: 'brand-strategy',
  pageTitle: 'Brand strategy that gives your business clear direction',
  description:
    'We help startups and growing brands uncover their purpose, positioning, and messaging before design begins. From discovery sessions to comprehensive strategy documents, our brand strategy services create a strong foundation for memorable, scalable brands.',
  shortDescription: 'Discovery, positioning, and messaging strategy for purposeful brands',
  cardImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  bannerImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop',
  features: [
    'Brand Discovery',
    'Brand Positioning',
    'Brand Messaging',
    'Market & Competitor Analysis',
  ],
  packagePricing: [
    {
      id: 'brand_strategy',
      title: 'Scope of Brand Strategy & Pricing',
      packages: [
        {
          id: 'brand-discovery-session',
          title: 'Brand Discovery Session',
          summary: 'Perfect for startups and businesses looking for direction before branding.',
          priceRange: [100_000],
          benefits: [
            'Brand Audit',
            'Business & Market Analysis',
            'Target Audience Insights',
            'Competitor Review',
            'Strategy Summary Document',
          ],
        },
        {
          id: 'brand-positioning-strategy',
          title: 'Brand Positioning Strategy',
          summary: 'A clear roadmap for building a strong, competitive brand.',
          priceRange: [250_000],
          benefits: [
            'Brand Purpose',
            'Vision & Mission',
            'Core Values',
            'Brand Positioning',
            'Unique Value Proposition (UVP)',
            'Brand Personality',
          ],
        },
        {
          id: 'brand-messaging-strategy',
          title: 'Brand Messaging Strategy',
          summary: 'Designed to ensure consistent communication across all platforms.',
          priceRange: [350_000],
          benefits: [
            'Brand Story',
            'Messaging Framework',
            'Tone of Voice',
            'Brand Promise',
            'Tagline Development',
            'Key Communication Pillars',
          ],
        },
        {
          id: 'premium-brand-strategy-package',
          title: 'Premium Brand Strategy Package',
          summary:
            'Everything your business needs to build a purposeful, memorable, and scalable brand before design and marketing begin.',
          priceRange: [600_000],
          isFeatured: true,
          benefits: [
            'Brand Discovery Workshop',
            'Market & Competitor Analysis',
            'Target Audience Research',
            'Brand Positioning',
            'Brand Messaging Strategy',
            'Vision, Mission & Values',
            'Brand Personality',
            'Customer Journey Mapping',
            'Strategic Recommendations',
            'Comprehensive Brand Strategy Document',
          ],
        },
      ],
    },
  ] satisfies IServicePackagePricing[],
  tags: [
    'brand strategy',
    'brand positioning',
    'brand messaging',
    'brand discovery',
    'brand consulting',
  ],
  isActive: true,
  displayOrder: 5,
  seo: {
    metaTitle: 'Brand Strategy Services | Crelyst Creative Agency',
    metaDescription:
      'Brand discovery, positioning, and messaging strategy services. Build a purposeful brand foundation before design and marketing begin.',
    keywords: ['brand strategy', 'brand positioning', 'brand messaging', 'brand discovery'],
  },
};

const ADDITIONAL_SERVICES_PRICING_FOOTER: IServicePricingFooter = {
  title: 'Custom Projects Are Welcome',
  description:
    'If your project doesn’t fit a standard package, reach out and we’ll create a custom solution tailored to your specific needs.',
  ctaLabel: 'Get in touch',
  ctaHref: '/contact',
};

const ADDITIONAL_SERVICES_SERVICE = {
  title: 'Additional Services',
  slug: 'additional-services',
  pageTitle: 'Additional design services for presentations, social, and print',
  description:
    'Beyond core branding and packaging, we deliver pitch decks, social media design systems, and professional print-ready materials that keep your brand consistent across every touchpoint.',
  shortDescription: 'Pitch decks, social media templates, and print design',
  cardImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
  bannerImage:
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1920&h=1080&fit=crop',
  features: ['Pitch Deck Design', 'Social Media Design', 'Print Design'],
  packagePricing: [
    {
      id: 'additional_services',
      title: 'Additional Services',
      packages: [
        {
          id: 'pitch-deck-presentation',
          title: 'Pitch Deck / Presentation',
          summary: 'Perfect for investor pitches, company profiles, and business proposals.',
          priceRange: [350_000],
          benefits: [
            'Custom Presentation Design',
            'Up to 20 Slides',
            'Brand-Aligned Layouts',
            'Infographics & Visual Assets',
            'Delivered in PowerPoint, PDF, or Figma',
          ],
        },
        {
          id: 'social-media-design',
          title: 'Social Media Design',
          summary: '10–15 professionally designed templates, ready to use.',
          priceRange: [150_000],
          benefits: [
            'Instagram Post Templates',
            'Carousel Designs',
            'Story Templates',
            'Highlight Covers',
            'Editable Files (where applicable)',
          ],
        },
        {
          id: 'print-design',
          title: 'Print Design',
          summary:
            'Professional print-ready designs for marketing and promotional materials. Print-ready files with premium layouts, tailored to your brand. Pricing varies based on size, quantity, and complexity.',
          priceRange: [200_000],
          benefits: [
            'Flyers',
            'Posters',
            'Brochures',
            'Roll-up Banners',
            'Billboards',
            'Business Cards',
            'Event & Promotional Materials',
          ],
        },
      ],
    },
  ] satisfies IServicePackagePricing[],
  pricingFooter: ADDITIONAL_SERVICES_PRICING_FOOTER,
  tags: ['pitch deck', 'social media design', 'print design', 'presentation design'],
  isActive: true,
  displayOrder: 6,
  seo: {
    metaTitle: 'Additional Design Services | Crelyst Creative Agency',
    metaDescription:
      'Pitch deck design, social media templates, and print-ready marketing materials tailored to your brand.',
    keywords: ['pitch deck design', 'social media design', 'print design'],
  },
};

export const ISAAC_SERVICE_CONTENT_UPDATES: IsaacServiceContentUpdate[] = [
  {
    slug: 'packaging-design',
    mergeFields: ['packagePricing'],
    payload: {
      packagePricing: PACKAGING_PRICING,
    },
  },
  {
    slug: 'brand-strategy',
    payload: BRAND_STRATEGY_SERVICE,
  },
  {
    slug: 'additional-services',
    payload: ADDITIONAL_SERVICES_SERVICE,
  },
];

export function getIsaacServiceContentBySlug(slug: string): IsaacServiceContentUpdate | undefined {
  return ISAAC_SERVICE_CONTENT_UPDATES.find(entry => entry.slug === slug);
}
