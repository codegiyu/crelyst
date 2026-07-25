/** Collections that use displayOrder + createdAt list queries (must have matching Firestore composites). */
export const ORDERED_COLLECTION_NAMES = [
  'brands',
  'services',
  'projects',
  'portfolioCaseStudies',
  'testimonials',
  'teamMembers',
] as const;

export type OrderedCollectionName = (typeof ORDERED_COLLECTION_NAMES)[number];
