import { ADMIN_EMAILS } from '@/lib/constants/admin-emails';

// Services seed data for Crelyst - Creative Design Agency
export const SERVICES_DATA = [
  /* ───────────────── 1. Brand Design ───────────────── */
  {
    title: 'Brand Design',
    slug: 'brand-design',
    pageTitle: 'We craft brand identities that speak before you do',
    description:
      "At the heart of every successful brand is a clear and compelling identity. Through collaborative workshops and deep discovery sessions, we help you uncover your brand's unique voice, core values, and visual personality. From professional logo design to comprehensive brand systems and guidelines, we build identities that not only stand out but also connect meaningfully with your audience.",
    shortDescription: 'Complete brand identity design and visual storytelling',
    cardImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&h=1080&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=1200&h=800&fit=crop',
    ],
    features: [
      'Logo Design',
      'Brand Guidelines',
      'Visual Identity',
      'Brand Strategy',
      'Typography & Color Systems',
    ],
    expertise: {
      title: 'Define, differentiate & stand out',
      breakdown: [
        {
          title: 'We shape visual identities',
          services: [
            'Logo Design',
            'Typography & Color Systems',
            'Visual Identity Development',
            'Iconography & Brand Assets',
            'Email Signature Design',
            'Rebranding',
          ],
        },
        {
          title: 'We build meaningful brands',
          services: [
            'Brand Guidelines',
            'Brand Strategy & Positioning',
            'Naming & Tagline Creation',
            'Brand Personality Development',
            'Competitive & Market Analysis',
            'Brand Activation',
          ],
        },
        {
          title: 'We bring your brand to life',
          services: [
            'Signages',
            'Business Card & Stationery Design',
            'Metal Plate Engraving',
            'Pitch Decks & Templates',
            'Brand Audit & Refresh',
          ],
        },
      ],
      marqueeText: 'Define, differentiate & stand out.',
    },
    breakdownSummary: [
      'Professional logo design',
      'Brand naming & taglines',
      'Visual identity design',
      'Brand strategy & positioning',
      'Signages',
    ],
    whatMakesUsUnique: {
      title: 'Our long-term and qualitative vision',
      groups: [
        {
          title: 'Tailor-made',
          text: 'Because we are convinced that every project is unique, we automatically propose tailor-made solutions. We concentrate our energy into making a brand strategy that perfectly fits in with your business.',
        },
        {
          title: 'Rooted in strategy',
          text: 'Our branding process is built on research and insight, ensuring your identity is both meaningful and memorable. We help you define your "why" before shaping the "how".',
        },
        {
          title: 'Beyond the logo',
          text: "We don't just create logos — we craft cohesive visual identities that speak your brand's truth across every touchpoint, from fonts to first impressions.",
        },
        {
          title: 'Consistency is power',
          text: 'We create systems that keep your brand consistent, from pitch decks to packaging, making sure your audience always recognizes and remembers you.',
        },
      ],
    },
    packagePricing: [
      {
        id: 'branding',
        packages: [
          {
            id: 'basic',
            priceRange: [500000],
            benefits: [
              'Interview',
              'Logo Design',
              '2-3 Concepts',
              '2 Revisions',
              'Stationary Design',
              'Color Palette',
              'Brand Font Family & Font File',
              'Core Brand Guidelines',
              'Branding Questionnaire Interview',
              'Branding Summary',
              'Branding Workshop',
              'Values Statement',
              'Business Card Design',
              '1 Social Media Banner Design',
              'Presentation Template',
            ],
          },
          {
            id: 'premium',
            priceRange: [1000000],
            benefits: [
              'Interview',
              'Logo Design',
              '5-7 Concepts',
              '4 Revisions',
              'Stationary Design',
              'Color Palette',
              'Brand Font Family & Font File',
              'Core Brand Guidelines',
              'Branding Questionnaire Interview',
              'Branding Summary',
              'Branding Workshop',
              'Values Statement',
              'Business Card Design',
              '5 Social Media Banner Designs',
              'Presentation Template',
              '1 Website Design',
            ],
          },
          {
            id: 'classic',
            priceRange: [4000000],
            benefits: [
              'Interview',
              'Logo Design',
              '5-7 Concepts',
              '4 Revisions',
              'Stationary Design',
              'Color Palette',
              'Brand Font Family & Font File',
              'Core Brand Guidelines',
              'Branding Questionnaire Interview',
              'Branding Summary',
              'Branding Workshop',
              'Values Statement',
              'Business Card Design',
              '5 Social Media Banner Designs',
              'Presentation Template',
              '1 Website Design',
              'Logo Video Intro',
            ],
          },
        ],
      },
      {
        id: 'professional_logo_design',
        packages: [
          {
            id: 'basic',
            priceRange: [100000],
            benefits: [
              '1 Logo Review',
              'Font/Typography',
              'Color/Brand Pattern',
              'High Resolution PNG (Basic/Grayscale)',
              'High Resolution JPG (Basic/Grayscale)',
            ],
          },
          {
            id: 'premium',
            priceRange: [150000],
            benefits: [
              '2 Logo Reviews',
              'Font/Typography',
              'Color/Brand Pattern',
              'High Resolution PNG (Basic/Grayscale)',
              'High Resolution JPG (Basic/Grayscale)',
              'Basic Logo Mockup',
              'Letterhead & Business Card Design',
            ],
          },
          {
            id: 'classic',
            priceRange: [250000],
            benefits: [
              '3 Logo Reviews',
              'Font/Typography',
              'Color/Brand Pattern',
              'High Resolution PNG (Basic/Grayscale)',
              'High Resolution JPG (Basic/Grayscale)',
              'Basic Logo Mockup',
              'Letterhead & Business Card Design',
              '1 Social Media Design',
              'T-shirt Idea',
              'Rollup Banner Design',
            ],
          },
        ],
      },
    ],
    process: [
      {
        title: 'Discovery & Research',
        description:
          'We start by understanding your business, target audience, and market positioning through comprehensive research and stakeholder interviews.',
        order: 1,
      },
      {
        title: 'Strategy Development',
        description:
          'We develop a strategic brand foundation that defines your unique value proposition, brand personality, and positioning in the market.',
        order: 2,
      },
      {
        title: 'Concept Development',
        description:
          'Our creative team develops multiple design concepts that bring your brand strategy to life through visual exploration and iteration.',
        order: 3,
      },
      {
        title: 'Refinement & Finalization',
        description:
          'We refine the selected concept based on feedback, ensuring every element aligns with your brand strategy and resonates with your audience.',
        order: 4,
      },
      {
        title: 'Brand Guidelines & Delivery',
        description:
          'We create comprehensive brand guidelines and deliver all assets in various formats for both digital and print applications.',
        order: 5,
      },
    ],
    benefits: [
      'Increased brand recognition and recall',
      'Consistent brand experience across all touchpoints',
      'Professional image that builds trust',
      'Competitive differentiation in the market',
      'Foundation for long-term brand growth',
    ],
    faq: [
      {
        question: 'How long does a brand design project typically take?',
        answer:
          'Most brand design projects take between 6-8 weeks, depending on the scope and complexity. Simple logo projects can be completed in 4 weeks, while comprehensive brand systems may take up to 12 weeks.',
        order: 1,
      },
      {
        question: 'What deliverables are included in a brand design package?',
        answer:
          'A complete brand design package typically includes logo variations, brand guidelines document, color palette, typography system, iconography, and brand application examples.',
        order: 2,
      },
      {
        question: 'Can you work with our existing brand elements?',
        answer:
          'Yes! We can refresh and modernize existing brand elements while maintaining brand recognition, or we can create a completely new brand identity from scratch.',
        order: 3,
      },
      {
        question: 'Do you provide ongoing brand support?',
        answer:
          'Yes, we offer brand maintenance packages and can provide ongoing design support to ensure brand consistency as your business grows.',
        order: 4,
      },
    ],
    tags: ['branding', 'logo design', 'brand identity', 'visual identity', 'brand strategy'],
    isActive: true,
    displayOrder: 1,
    seo: {
      metaTitle: 'Brand Design Services | Crelyst Creative Agency',
      metaDescription:
        'Professional brand design services. Create compelling brand identities that resonate with your audience and establish a memorable visual presence.',
      keywords: [
        'brand design',
        'logo design',
        'brand identity',
        'visual identity',
        'branding',
        'creative agency',
      ],
    },
  },

  /* ───────────────── 2. Photography ───────────────── */
  {
    title: 'Photography',
    slug: 'photography',
    pageTitle: 'Every frame should tell a story worth remembering',
    description:
      'Capturing moments that tell your story. Our photography services include product photography, brand photography, event coverage, and creative editorial work. We bring your vision to life through stunning visuals that connect emotionally with your audience and elevate your brand across every channel.',
    shortDescription: 'Professional photography for brands, products, and events',
    cardImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop',
    bannerImage:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&h=1080&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&h=800&fit=crop',
    ],
    features: [
      'Product Photography',
      'Brand Photography',
      'Event Coverage',
      'Editorial Photography',
      'Post-Production Editing',
    ],
    expertise: {
      title: 'Capture, compose & captivate',
      breakdown: [
        {
          title: 'We photograph products',
          services: [
            'Product Photography',
            'E-commerce Shots',
            'Flat Lays',
            'Lifestyle Imagery',
            '360° Product Views',
          ],
        },
        {
          title: 'We tell brand stories',
          services: [
            'Brand Photography',
            'Team Portraits',
            'Workspace & Culture Shoots',
            'Behind-the-Scenes Content',
          ],
        },
        {
          title: 'We capture moments',
          services: [
            'Event Coverage',
            'Conference Photography',
            'Launch Events',
            'Corporate Gatherings',
            'Editorial Sessions',
          ],
        },
      ],
      marqueeText: 'Capture, compose & captivate.',
    },
    breakdownSummary: [
      'Product photography',
      'Brand photography',
      'Event coverage',
      'Editorial shoots',
      'Post-production editing',
    ],
    whatMakesUsUnique: {
      title: 'What sets our lens apart',
      groups: [
        {
          title: 'Story-first approach',
          text: "We don't just take pictures — we listen, research, and plan every shoot so that each frame carries meaning and moves your audience.",
        },
        {
          title: 'Obsessive attention to light',
          text: 'Lighting defines mood. We invest in precision lighting setups that transform ordinary subjects into compelling visual narratives.',
        },
        {
          title: 'Post-production mastery',
          text: 'Every image is meticulously retouched and color-graded to ensure a polished, cohesive look that aligns with your brand identity.',
        },
        {
          title: 'Rapid turnaround',
          text: 'We understand deadlines. Our streamlined workflow means you get publication-ready images fast, without sacrificing quality.',
        },
      ],
    },
    packagePricing: [
      {
        id: 'photography',
        packages: [
          {
            id: 'basic',
            priceRange: [150000, 300000],
            benefits: [
              'Up to 20 edited images',
              '1 shoot location',
              '2-hour session',
              'Basic retouching',
              'Digital delivery',
            ],
          },
          {
            id: 'premium',
            priceRange: [300000, 600000],
            benefits: [
              'Up to 50 edited images',
              '2 shoot locations',
              'Half-day session',
              'Advanced retouching',
              'Digital delivery',
              '5 Social-ready crops',
            ],
          },
          {
            id: 'classic',
            priceRange: [600000, 1500000],
            benefits: [
              'Unlimited edited images',
              'Multiple locations',
              'Full-day session',
              'Advanced retouching & compositing',
              'Digital + print-ready delivery',
              '10 Social-ready crops',
              'Behind-the-scenes reel',
            ],
          },
        ],
      },
    ],
    process: [
      {
        title: 'Creative Brief',
        description:
          'We discuss your vision, style preferences, and specific requirements to create a detailed creative brief for the shoot.',
        order: 1,
      },
      {
        title: 'Pre-Production Planning',
        description:
          'We handle all logistics including location scouting, prop sourcing, styling, and scheduling to ensure a smooth shoot day.',
        order: 2,
      },
      {
        title: 'Photography Session',
        description:
          'Our professional photographers capture your products, brand, or events using state-of-the-art equipment and lighting techniques.',
        order: 3,
      },
      {
        title: 'Post-Production',
        description:
          'We carefully edit and retouch images to ensure they meet your brand standards and are optimized for their intended use.',
        order: 4,
      },
      {
        title: 'Delivery & Usage Rights',
        description:
          'We deliver high-resolution images in your preferred formats along with usage rights documentation.',
        order: 5,
      },
    ],
    benefits: [
      'Professional quality images that elevate your brand',
      'Increased e-commerce conversion rates',
      'Consistent visual style across all marketing materials',
      'High-resolution images optimized for all platforms',
      'Expert lighting and composition for maximum impact',
    ],
    faq: [
      {
        question: 'What types of photography do you offer?',
        answer:
          'We offer product photography, brand photography, event coverage, lifestyle photography, and editorial work. We can also create custom photography packages tailored to your specific needs.',
        order: 1,
      },
      {
        question: 'Do you provide styling and props?',
        answer:
          'Yes, we can provide styling services and source props to enhance your photography. This can be included in your project quote.',
        order: 2,
      },
      {
        question: 'How many images will I receive?',
        answer:
          'The number of final images depends on your package and project scope. Typically, we deliver 20-50 edited images per shoot, but this can be customized.',
        order: 3,
      },
      {
        question: 'Can you shoot on location?',
        answer:
          'Absolutely! We can shoot at your location, our studio, or any location of your choice. Location fees may apply for certain venues.',
        order: 4,
      },
    ],
    tags: [
      'photography',
      'product photography',
      'brand photography',
      'event photography',
      'editorial',
    ],
    isActive: true,
    displayOrder: 2,
    seo: {
      metaTitle: 'Professional Photography Services | Crelyst',
      metaDescription:
        'Professional photography services for brands, products, and events. Capturing moments that tell your story through stunning visuals.',
      keywords: ['photography', 'product photography', 'brand photography', 'event photography'],
    },
  },

  /* ───────────────── 3. Product Design ───────────────── */
  {
    title: 'Product Design',
    slug: 'product-design',
    pageTitle: 'Designing digital products people genuinely love to use',
    description:
      'Designing products that users love. We combine aesthetics with functionality to create intuitive, beautiful, and user-centered product experiences. From concept to final design, we ensure your product stands out — driving adoption, retention, and delight at every interaction.',
    shortDescription: 'User-centered product design and development',
    cardImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop',
    bannerImage:
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1920&h=1080&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&h=800&fit=crop',
    ],
    features: [
      'User Research',
      'Wireframing & Prototyping',
      'UI/UX Design',
      'Design Systems',
      'User Testing',
    ],
    expertise: {
      title: 'Research, design & iterate',
      breakdown: [
        {
          title: 'We research & discover',
          services: [
            'User Research',
            'Competitive Analysis',
            'Persona Development',
            'Journey Mapping',
            'Heuristic Evaluation',
          ],
        },
        {
          title: 'We design & prototype',
          services: [
            'Wireframing',
            'Interactive Prototyping',
            'UI Design',
            'Responsive Design',
            'Micro-interactions & Motion',
          ],
        },
        {
          title: 'We systematise & scale',
          services: [
            'Design Systems',
            'Component Libraries',
            'Accessibility Auditing',
            'Developer Handoff',
            'Design QA',
          ],
        },
      ],
      marqueeText: 'Research, design & iterate.',
    },
    breakdownSummary: [
      'User research & testing',
      'Wireframing & prototyping',
      'UI/UX design',
      'Design systems',
      'Developer handoff',
    ],
    whatMakesUsUnique: {
      title: 'Why our product design hits differently',
      groups: [
        {
          title: 'User-obsessed',
          text: 'We start and end with the user. Every decision is backed by research, tested with real people, and iterated until it feels effortless.',
        },
        {
          title: 'Pixel-perfect craft',
          text: 'Details matter. Our interfaces are polished down to the last pixel, with intentional spacing, colour harmony, and motion design.',
        },
        {
          title: 'Design meets engineering',
          text: 'We design for real-world constraints. Our deliverables are developer-friendly, reducing back-and-forth and speeding up shipping.',
        },
        {
          title: 'Systems thinking',
          text: 'We build scalable design systems — not one-off screens — so your product stays consistent as it grows.',
        },
      ],
    },
    packagePricing: [
      {
        id: 'product_design',
        packages: [
          {
            id: 'basic',
            priceRange: [800000, 1500000],
            benefits: [
              'Up to 10 screens',
              'User flow mapping',
              'Low-fi wireframes',
              'Style guide',
              'Developer handoff',
            ],
          },
          {
            id: 'premium',
            priceRange: [1500000, 3000000],
            benefits: [
              'Up to 30 screens',
              'User research (5 interviews)',
              'Hi-fi wireframes & prototype',
              'Design system starter',
              'Developer handoff',
              '1 round of usability testing',
            ],
          },
          {
            id: 'classic',
            priceRange: [3000000, 8000000],
            benefits: [
              'Unlimited screens',
              'Full user research sprint',
              'Hi-fi wireframes & interactive prototype',
              'Complete design system',
              'Developer handoff',
              '2 rounds of usability testing',
              'Motion/micro-interaction specs',
            ],
          },
        ],
      },
    ],
    process: [
      {
        title: 'User Research & Discovery',
        description:
          'We conduct user interviews, surveys, and market research to understand user needs, pain points, and behaviors.',
        order: 1,
      },
      {
        title: 'Information Architecture',
        description:
          'We structure content and functionality in a logical, intuitive way that guides users to their goals efficiently.',
        order: 2,
      },
      {
        title: 'Wireframing & Prototyping',
        description:
          'We create low-fidelity wireframes and interactive prototypes to test concepts and gather early feedback.',
        order: 3,
      },
      {
        title: 'Visual Design',
        description:
          'We design beautiful, cohesive interfaces that align with your brand while prioritizing usability and accessibility.',
        order: 4,
      },
      {
        title: 'User Testing & Iteration',
        description:
          'We conduct usability testing and iterate based on real user feedback to ensure the best possible experience.',
        order: 5,
      },
      {
        title: 'Design System & Handoff',
        description:
          'We create comprehensive design systems and provide detailed specifications for seamless developer handoff.',
        order: 6,
      },
    ],
    benefits: [
      'Improved user satisfaction and engagement',
      'Higher conversion rates and reduced bounce rates',
      'Reduced development costs through better planning',
      'Scalable design systems for future growth',
      'Accessible designs that work for all users',
    ],
    faq: [
      {
        question: 'What is the difference between UI and UX design?',
        answer:
          'UX (User Experience) design focuses on the overall experience and usability of a product, while UI (User Interface) design focuses on the visual elements and aesthetics. We provide both services to create complete product experiences.',
        order: 1,
      },
      {
        question: 'Do you work with development teams?',
        answer:
          'Yes! We collaborate closely with development teams and provide detailed design specifications, design systems, and ongoing support throughout the development process.',
        order: 2,
      },
      {
        question: 'Can you redesign existing products?',
        answer:
          'Absolutely! We can refresh existing products, improve usability, modernize interfaces, or conduct complete redesigns based on your needs and goals.',
        order: 3,
      },
      {
        question: 'What deliverables do you provide?',
        answer:
          'We provide wireframes, prototypes, high-fidelity designs, design systems, user flows, design specifications, and assets ready for development.',
        order: 4,
      },
    ],
    tags: [
      'product design',
      'UI design',
      'UX design',
      'user experience',
      'interface design',
      'wireframing',
    ],
    isActive: true,
    displayOrder: 3,
    seo: {
      metaTitle: 'Product Design Services | UI/UX Design | Crelyst',
      metaDescription:
        'Professional product design services. Create intuitive, beautiful, and user-centered product experiences that users love.',
      keywords: ['product design', 'UI design', 'UX design', 'user experience', 'interface design'],
    },
  },

  /* ───────────────── 4. Packaging Design ───────────────── */
  {
    title: 'Packaging Design',
    slug: 'packaging-design',
    pageTitle: 'Packaging that sells before a single word is spoken',
    description:
      'Packaging that sells. We create eye-catching, functional packaging designs that protect your product while telling your brand story. From concept to production-ready files, we ensure your packaging stands out on the shelf and turns first-time buyers into loyal customers.',
    shortDescription: 'Creative packaging design that protects and sells',
    cardImage: 'https://images.unsplash.com/photo-1608315397376-4b0c0c0c5b5c?w=800&h=600&fit=crop',
    bannerImage:
      'https://images.unsplash.com/photo-1608315397376-4b0c0c0c5b5c?w=1920&h=1080&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1608315397376-4b0c0c0c5b5c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=800&fit=crop',
    ],
    features: [
      'Package Structure Design',
      'Label & Graphics Design',
      'Material Selection',
      'Production-Ready Files',
      'Brand Consistency',
    ],
    expertise: {
      title: 'Wrap, protect & wow',
      breakdown: [
        {
          title: 'We design the structure',
          services: [
            'Box & Carton Design',
            'Bottle & Container Design',
            'Pouch & Sachet Design',
            'Gift Packaging',
            'Eco-friendly Solutions',
          ],
        },
        {
          title: 'We craft the graphics',
          services: [
            'Label Design',
            'Surface Graphics',
            'Dieline Development',
            'Regulatory Compliance',
            'Barcode & QR Integration',
          ],
        },
        {
          title: 'We prepare for production',
          services: [
            'Print-ready Artwork',
            'Material Specification',
            'Vendor Liaison',
            'Prototype Review',
            'Production Supervision',
          ],
        },
      ],
      marqueeText: 'Wrap, protect & wow.',
    },
    breakdownSummary: [
      'Structural packaging design',
      'Label & graphics',
      'Sustainable materials',
      'Production-ready files',
      'Multi-SKU systems',
    ],
    whatMakesUsUnique: {
      title: 'Why our packaging stands out on any shelf',
      groups: [
        {
          title: 'Shelf-first thinking',
          text: 'We design with the point of purchase in mind — every colour, shape, and finish is chosen to grab attention in a crowded retail environment.',
        },
        {
          title: 'Sustainability built in',
          text: 'We prioritise eco-friendly materials and processes, helping your brand meet sustainability goals without compromising visual impact.',
        },
        {
          title: 'Production-ready precision',
          text: 'Our files arrive at the printer ready to go — proper bleeds, die-lines, colour separations, and material callouts included.',
        },
        {
          title: 'Brand-system cohesion',
          text: 'We ensure your packaging belongs to a family. Multi-SKU rollouts look unified yet distinct, reinforcing brand recall across your product line.',
        },
      ],
    },
    packagePricing: [
      {
        id: 'packaging_design',
        packages: [
          {
            id: 'basic',
            priceRange: [300000, 600000],
            benefits: [
              '1 SKU design',
              '2 concepts',
              '2 revisions',
              'Print-ready files',
              'Basic mockup',
            ],
          },
          {
            id: 'premium',
            priceRange: [600000, 1500000],
            benefits: [
              'Up to 3 SKU designs',
              '3 concepts each',
              '3 revisions',
              'Print-ready files',
              '3D mockups',
              'Material recommendation',
            ],
          },
          {
            id: 'classic',
            priceRange: [1500000, 3000000],
            benefits: [
              'Up to 6 SKU designs',
              '4 concepts each',
              'Unlimited revisions',
              'Print-ready files',
              '3D mockups',
              'Material & vendor liaison',
              'Production supervision',
            ],
          },
        ],
      },
    ],
    process: [
      {
        title: 'Product & Market Analysis',
        description:
          'We analyze your product, target market, and competitive landscape to understand positioning and design opportunities.',
        order: 1,
      },
      {
        title: 'Concept Development',
        description:
          'We develop multiple packaging concepts that balance aesthetics, functionality, and brand storytelling.',
        order: 2,
      },
      {
        title: 'Structural Design',
        description:
          'We design the physical structure of the package, considering protection, sustainability, and user experience.',
        order: 3,
      },
      {
        title: 'Graphic Design & Branding',
        description:
          'We create compelling graphics, labels, and brand elements that communicate your brand story effectively.',
        order: 4,
      },
      {
        title: 'Material & Production Consultation',
        description:
          'We recommend materials and provide production-ready files with specifications for manufacturing.',
        order: 5,
      },
    ],
    benefits: [
      'Increased shelf appeal and brand recognition',
      'Better product protection and functionality',
      'Sustainable packaging solutions',
      'Production-ready files for seamless manufacturing',
      'Cohesive brand experience across product line',
    ],
    faq: [
      {
        question: 'Do you work with sustainable packaging materials?',
        answer:
          'Yes! We specialize in sustainable packaging solutions and can recommend eco-friendly materials that align with your brand values and environmental goals.',
        order: 1,
      },
      {
        question: 'Can you help with production and manufacturing?',
        answer:
          'We provide production-ready files and specifications, and can recommend trusted manufacturing partners. We also offer production oversight services.',
        order: 2,
      },
      {
        question: 'What file formats do you provide?',
        answer:
          'We provide all necessary files including print-ready PDFs, vector files, 3D mockups, and specifications in formats required by your manufacturer.',
        order: 3,
      },
      {
        question: 'Can you design packaging for multiple product variants?',
        answer:
          'Absolutely! We can create cohesive packaging systems for entire product lines while maintaining brand consistency and allowing for product differentiation.',
        order: 4,
      },
    ],
    tags: [
      'packaging design',
      'package design',
      'label design',
      'product packaging',
      'sustainable packaging',
    ],
    isActive: true,
    displayOrder: 4,
    seo: {
      metaTitle: 'Packaging Design Services | Crelyst Creative Agency',
      metaDescription:
        'Professional packaging design services. Create eye-catching, functional packaging that protects your product and tells your brand story.',
      keywords: ['packaging design', 'package design', 'label design', 'product packaging'],
    },
  },

  /* ───────────────── 5. Visual Identity ───────────────── */
  {
    title: 'Visual Identity',
    slug: 'visual-identity',
    pageTitle: 'Visual systems that make your brand unmistakable',
    description:
      'Building cohesive visual systems that communicate your brand essence. We develop comprehensive visual identities including colour palettes, typography, iconography, and design systems that work across all touchpoints — digital, print, and environmental.',
    shortDescription: 'Comprehensive visual identity and design systems',
    cardImage: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=600&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=1920&h=1080&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
    ],
    features: [
      'Color Systems',
      'Typography Design',
      'Iconography',
      'Design Systems',
      'Brand Guidelines',
    ],
    expertise: {
      title: 'Systematise, unify & scale',
      breakdown: [
        {
          title: 'We define the visual language',
          services: [
            'Color Palette Definition',
            'Typography Selection',
            'Iconography Design',
            'Photography Direction',
            'Illustration Style',
          ],
        },
        {
          title: 'We build the system',
          services: [
            'Component Libraries',
            'Pattern Libraries',
            'Grid & Layout Systems',
            'Motion Guidelines',
            'Responsive Rules',
          ],
        },
        {
          title: 'We document everything',
          services: [
            'Brand Guidelines',
            "Usage Do's & Don'ts",
            'Digital Asset Libraries',
            'Team Training',
            'Ongoing System Updates',
          ],
        },
      ],
      marqueeText: 'Systematise, unify & scale.',
    },
    breakdownSummary: [
      'Colour & typography systems',
      'Iconography & illustration',
      'Component libraries',
      'Brand guidelines',
      'Design system documentation',
    ],
    whatMakesUsUnique: {
      title: 'Why our visual systems endure',
      groups: [
        {
          title: 'Systems over screens',
          text: 'We design reusable, scalable systems — not just pretty pages. Your visual identity stays consistent as your team and product grow.',
        },
        {
          title: 'Cross-platform harmony',
          text: 'From a billboard to a mobile app, our identities translate flawlessly. We test across media so nothing gets lost.',
        },
        {
          title: 'Living documentation',
          text: "Our brand guidelines aren't static PDFs — we build interactive, searchable docs your team will actually use.",
        },
        {
          title: 'Future-proof flexibility',
          text: 'We build in extensibility from day one, so your visual identity can evolve with new products, markets, and trends without starting over.',
        },
      ],
    },
    packagePricing: [
      {
        id: 'visual_identity',
        packages: [
          {
            id: 'basic',
            priceRange: [600000, 1200000],
            benefits: [
              'Color palette',
              'Typography system',
              'Basic iconography',
              'Core guidelines (PDF)',
              'Digital asset pack',
            ],
          },
          {
            id: 'premium',
            priceRange: [1200000, 2500000],
            benefits: [
              'Color palette',
              'Typography system',
              'Extended iconography',
              'Interactive brand guidelines',
              'Component library starter',
              'Social media templates',
            ],
          },
          {
            id: 'classic',
            priceRange: [2500000, 6000000],
            benefits: [
              'Color palette',
              'Typography system',
              'Custom iconography & illustration',
              'Interactive brand guidelines',
              'Full component library',
              'Motion guidelines',
              'Team training session',
            ],
          },
        ],
      },
    ],
    process: [
      {
        title: 'Brand Foundation Review',
        description:
          'We review your brand strategy, values, and positioning to ensure the visual identity accurately represents your brand essence.',
        order: 1,
      },
      {
        title: 'Visual System Development',
        description:
          'We develop comprehensive visual systems including color palettes, typography, iconography, and design patterns.',
        order: 2,
      },
      {
        title: 'Application Exploration',
        description:
          'We explore how the visual identity works across various applications including digital, print, and environmental design.',
        order: 3,
      },
      {
        title: 'Design System Creation',
        description:
          'We create a comprehensive design system with components, patterns, and guidelines for consistent implementation.',
        order: 4,
      },
      {
        title: 'Guidelines & Documentation',
        description:
          'We deliver detailed brand guidelines and documentation to ensure consistent application across all touchpoints.',
        order: 5,
      },
    ],
    benefits: [
      'Consistent brand experience across all channels',
      'Scalable design systems for growth',
      'Reduced design and development time',
      'Stronger brand recognition and recall',
      'Clear guidelines for internal and external teams',
    ],
    faq: [
      {
        question: 'What is included in a visual identity system?',
        answer:
          'A complete visual identity system includes color palettes, typography systems, iconography, design patterns, component libraries, and comprehensive brand guidelines for implementation.',
        order: 1,
      },
      {
        question: 'How is this different from brand design?',
        answer:
          'Visual identity focuses specifically on the visual elements and design systems, while brand design encompasses the broader brand strategy and identity. Visual identity is often part of a larger brand design project.',
        order: 2,
      },
      {
        question: 'Can you create design systems for digital products?',
        answer:
          'Yes! We create comprehensive design systems for web and mobile applications, including component libraries, style guides, and implementation guidelines for development teams.',
        order: 3,
      },
      {
        question: 'Do you provide ongoing support for design systems?',
        answer:
          'Yes, we offer maintenance and evolution services for design systems, including updates, new component development, and team training.',
        order: 4,
      },
    ],
    tags: [
      'visual identity',
      'design systems',
      'brand systems',
      'visual design',
      'brand guidelines',
    ],
    isActive: true,
    displayOrder: 5,
    seo: {
      metaTitle: 'Visual Identity Design | Brand Systems | Crelyst',
      metaDescription:
        'Professional visual identity design services. Build cohesive visual systems that communicate your brand essence across all touchpoints.',
      keywords: ['visual identity', 'design systems', 'brand systems', 'visual design'],
    },
  },
];

// Projects seed data (bold-brand-studio case studies)
export { PROJECTS_DATA } from './projectsSeedData';

// Testimonials seed data
export const TESTIMONIALS_DATA = [
  {
    clientName: 'Emma Rodriguez',
    clientRole: 'Founder & CEO',
    companyName: 'BrewCraft Roasters',
    companyLogo: 'https://via.placeholder.com/200x200/8B4513/FFFFFF?text=BrewCraft',
    clientImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    testimonial:
      "Crelyst transformed our brand completely. Their attention to detail and understanding of our vision was exceptional. The new brand identity perfectly captures our artisan coffee story, and we've seen a significant increase in customer engagement since the rebrand.",
    rating: 5,
    isFeatured: true,
    displayOrder: 1,
    projectId: null,
  },
  {
    clientName: 'Sophie Chen',
    clientRole: 'Marketing Director',
    companyName: 'Glow Essentials',
    companyLogo: 'https://via.placeholder.com/200x200/FFB6C1/FFFFFF?text=Glow',
    clientImage: 'https://randomuser.me/api/portraits/women/28.jpg',
    testimonial:
      'The product photography Crelyst created for us is absolutely stunning. Every image tells a story and showcases our products beautifully. Our e-commerce conversion rates increased by 60% after using their photography. Highly professional and creative team!',
    rating: 5,
    isFeatured: true,
    displayOrder: 2,
    projectId: null,
  },
  {
    clientName: 'Marcus Thompson',
    clientRole: 'Product Manager',
    companyName: 'StyleHub',
    companyLogo: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=StyleHub',
    clientImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    testimonial:
      "Working with Crelyst on our platform redesign was a game-changer. They understood our users' needs and created an experience that's both beautiful and functional. The 45% increase in conversions speaks for itself. Outstanding work!",
    rating: 5,
    isFeatured: true,
    displayOrder: 3,
    projectId: null,
  },
  {
    clientName: 'Isabella Martinez',
    clientRole: 'Brand Manager',
    companyName: 'NatureLeaf Teas',
    companyLogo: 'https://via.placeholder.com/200x200/228B22/FFFFFF?text=NatureLeaf',
    clientImage: 'https://randomuser.me/api/portraits/women/65.jpg',
    testimonial:
      'Crelyst created packaging that perfectly balances sustainability with premium aesthetics. Our customers love the eco-friendly design, and it has helped us stand out in a crowded market. The team was collaborative, creative, and delivered beyond our expectations.',
    rating: 5,
    isFeatured: true,
    displayOrder: 4,
    projectId: null,
  },
  {
    clientName: 'James Wilson',
    clientRole: 'Co-Founder',
    companyName: 'FinanceFlow',
    companyLogo: 'https://via.placeholder.com/200x200/1E90FF/FFFFFF?text=FinanceFlow',
    clientImage: 'https://randomuser.me/api/portraits/men/75.jpg',
    testimonial:
      'The visual identity system Crelyst developed for us is comprehensive and perfectly aligned with our tech-forward brand. The design guidelines they provided have made it easy for our team to maintain brand consistency across all touchpoints. Exceptional work!',
    rating: 5,
    isFeatured: false,
    displayOrder: 5,
    projectId: null,
  },
  {
    clientName: 'Olivia Brown',
    clientRole: 'Creative Director',
    companyName: 'Artisan Collective',
    companyLogo: 'https://via.placeholder.com/200x200/8B4513/FFFFFF?text=Artisan',
    clientImage: 'https://randomuser.me/api/portraits/women/12.jpg',
    testimonial:
      "Crelyst's creative approach and execution are top-notch. They took time to understand our brand values and translated them into a visual identity that truly represents who we are. The collaboration was smooth, and the results exceeded our expectations.",
    rating: 5,
    isFeatured: false,
    displayOrder: 6,
    projectId: null,
  },
];

// Brands seed data - Partner brands and clients
export const BRANDS_DATA = [
  {
    name: 'BrewCraft Roasters',
    logo: 'https://via.placeholder.com/200x200/8B4513/FFFFFF?text=BrewCraft',
    websiteUrl: 'https://brewcraft.example.com',
    isActive: true,
    displayOrder: 1,
  },
  {
    name: 'Glow Essentials',
    logo: 'https://via.placeholder.com/200x200/FFB6C1/FFFFFF?text=Glow',
    websiteUrl: 'https://glowessentials.example.com',
    isActive: true,
    displayOrder: 2,
  },
  {
    name: 'StyleHub',
    logo: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=StyleHub',
    websiteUrl: 'https://stylehub.example.com',
    isActive: true,
    displayOrder: 3,
  },
  {
    name: 'NatureLeaf Teas',
    logo: 'https://via.placeholder.com/200x200/228B22/FFFFFF?text=NatureLeaf',
    websiteUrl: 'https://natureleaf.example.com',
    isActive: true,
    displayOrder: 4,
  },
  {
    name: 'FinanceFlow',
    logo: 'https://via.placeholder.com/200x200/1E90FF/FFFFFF?text=FinanceFlow',
    websiteUrl: 'https://financeflow.example.com',
    isActive: true,
    displayOrder: 5,
  },
  {
    name: 'Artisan Collective',
    logo: 'https://via.placeholder.com/200x200/8B4513/FFFFFF?text=Artisan',
    websiteUrl: 'https://artisancollective.example.com',
    isActive: true,
    displayOrder: 6,
  },
  {
    name: 'Creative Studio',
    logo: 'https://via.placeholder.com/200x200/FF6347/FFFFFF?text=Creative',
    websiteUrl: 'https://creativestudio.example.com',
    isActive: true,
    displayOrder: 7,
  },
  {
    name: 'Design Lab',
    logo: 'https://via.placeholder.com/200x200/9370DB/FFFFFF?text=DesignLab',
    websiteUrl: 'https://designlab.example.com',
    isActive: true,
    displayOrder: 8,
  },
  {
    name: 'Visual Works',
    logo: 'https://via.placeholder.com/200x200/20B2AA/FFFFFF?text=Visual',
    websiteUrl: 'https://visualworks.example.com',
    isActive: true,
    displayOrder: 9,
  },
  {
    name: 'Brand Forge',
    logo: 'https://via.placeholder.com/200x200/FF4500/FFFFFF?text=BrandForge',
    websiteUrl: 'https://brandforge.example.com',
    isActive: true,
    displayOrder: 10,
  },
];

/** Team members seed data */
export const TEAM_MEMBERS_DATA = [
  {
    name: 'Jane Doe',
    role: 'Creative Director',
    bio: '',
    image: '',
    isActive: true,
    displayOrder: 1,
  },
  {
    name: 'John Smith',
    role: 'Lead Designer',
    bio: '',
    image: '',
    isActive: true,
    displayOrder: 2,
  },
];

/**
 * Admin seed data – one entry per admin (same order as ADMIN_EMAILS).
 * Used when seeding Firebase Auth users and Firestore admins collection.
 * Change default password after first login.
 */
export const ADMIN_SEED_DATA: Array<{
  email: string;
  password: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
}> = [
  {
    email: ADMIN_EMAILS[0],
    password: 'Password123!',
    displayName: 'Edward',
    firstName: 'Edward-Precious',
    lastName: 'Omegbu',
    photoURL: 'https://static.crelyst.com.ng/eddy.JPG',
  },
  {
    email: ADMIN_EMAILS[1],
    password: 'Password123!',
    displayName: 'Isaac',
    firstName: 'Isaac',
    lastName: 'Onoja',
    photoURL: 'https://static.crelyst.com.ng/isaac.jpg',
  },
];
