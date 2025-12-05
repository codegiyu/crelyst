import { Metadata } from 'next';
import { SEO_DETAILS } from '@/lib/constants/texts';

/**
 * Generates standardized page metadata with consistent formatting
 * @param title - Page title (will be suffixed with default template)
 * @param description - Page description
 * @param keywords - Page keywords (string or array, will be merged with base keywords)
 * @param options - Optional metadata overrides
 */
export function generatePageMetadata(
  title: string,
  description: string,
  keywords?: string | string[],
  options?: {
    titleTemplate?: string;
    image?: string;
    url?: string;
  }
): Metadata {
  const baseKeywords = SEO_DETAILS.keywords || [];
  const pageKeywords = Array.isArray(keywords) ? keywords : keywords ? keywords.split(',') : [];

  // Merge keywords and remove duplicates
  const mergedKeywords = Array.from(
    new Set([...pageKeywords, ...baseKeywords].map(k => k.trim()).filter(Boolean))
  );

  const titleTemplate = options?.titleTemplate || SEO_DETAILS.title.template;
  const fullTitle = {
    default: title,
    template: titleTemplate,
  };

  return {
    title: fullTitle,
    description: description.trim(),
    keywords: mergedKeywords.join(', '),
    ...(options?.image && {
      openGraph: {
        images: [{ url: options.image }],
      },
      twitter: {
        images: options.image,
      },
    }),
    ...(options?.url && {
      alternates: {
        canonical: options.url,
      },
    }),
  };
}
