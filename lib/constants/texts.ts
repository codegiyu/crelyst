import { HeaderLinkProps } from '@/components/layout/Header';
import { ENVIRONMENT } from '@/lib/config/environment';

const liveUrl = ENVIRONMENT.SEO.LIVE_URL;

export const SEO_DETAILS = {
  title: {
    default: 'Crelyst - Creative Design Agency',
    template: '%s | Crelyst',
  },
  description:
    'Crelyst is a full-service design and branding agency specializing in photography, brand design, product design, packaging, and visual identity. Where ideas take shape and colors speak.',
  ogDesc:
    'Where Ideas Take Shape and Colors Speak. Creative design agency specializing in photography, branding, and visual identity.',
  metadataBase: new URL(liveUrl),
  alternates: {
    canonical: liveUrl,
  },
  image: `https://static.crelyst.com.ng/site-preview.png`,
  // icons: `${liveUrl}/favicon.png`,
  icons: `https://static.crelyst.com.ng/favicon.png`,
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
    },
  },
  authors: [{ name: 'Edward-Precious Omegbu', url: 'https://portfolio-codegiyu.vercel.app' }],
  keywords: [
    'Crelyst',
    'Design Agency',
    'Branding',
    'Photography',
    'Product Design',
    'Packaging Design',
    'Visual Identity',
    'Creative Agency',
  ],
  generator: 'Next.js',
  publisher: 'Crelyst',
  category: 'Design & Creative Services',
  classification: 'Creative design and branding agency',
};

export const CRELYST_TAGLINE = 'Where Ideas Take Shape and Colors Speak.';

export const NAV_LINKS: HeaderLinkProps[] = [
  // { text: 'Home', href: '/' },
  { text: 'About', href: '/about' },
  { text: 'Services', href: '/services' },
  { text: 'Projects', href: '/projects' },
  { text: 'Work With Us', href: '/work-with-us' },
  { text: 'Contact', href: '/contact' },
];
