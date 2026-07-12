/**
 * Bold Brand Studio portfolio case study shape — field-for-field with
 * bold-brand-studio/src/data/projects.ts `Project` type.
 */

export interface SectionHeading {
  headingTextStart?: string;
  headingTextSpecial?: string;
  headingTextEnd?: string;
}

export interface Paragraph {
  heading?: string;
  inlineHeading?: string;
  text?: string;
  bullets?: string[];
  closing?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface ResultMetric {
  label: string;
  value: string;
}

export interface LogoDesign {
  breakdown: Paragraph[];
  gridImage: string;
}

/** Content fields mirrored from Bold Brand Studio's `Project` interface. */
export interface PortfolioCaseStudyContent {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  hero: string;
  industry: string;
  client: string;
  aboutClientHeading?: SectionHeading;
  aboutClient?: Paragraph[];
  services: string[];
  timeline: string;
  summary: Paragraph[];
  challengeHeading?: SectionHeading;
  challenge: Paragraph[];
  strategyHeading?: SectionHeading;
  strategy: Paragraph[];
  logoDesignHeading?: SectionHeading;
  logoDesign?: LogoDesign;
  visualIdentityHeading?: SectionHeading;
  identityImages: string[];
  applicationsHeading?: SectionHeading;
  applicationsImages?: string[];
  colorPalette: ColorSwatch[];
  typographyPrimary: string;
  typographySecondary: string;
  resultsHeading?: SectionHeading;
  results: ResultMetric[];
  keywords: string[];
  featured?: boolean;
}

export interface PortfolioCaseStudy extends PortfolioCaseStudyContent {
  isActive: boolean;
  displayOrder: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
