/**
 * Case-study shape aligned with bold-brand-studio portfolio projects.
 * Stored nested on IProject as `caseStudy`; root fields hold slug, title, cardImage, etc.
 */

export interface SectionHeading {
  headingTextStart?: string;
  headingTextSpecial?: string;
  headingTextEnd?: string;
}

export interface CaseStudyParagraph {
  heading?: string;
  inlineHeading?: string;
  text?: string;
  bullets?: string[];
  closing?: string;
}

/** Prose blocks with an optional split heading line (optional section when omitted at parent). */
export interface CaseStudyParagraphSection {
  heading?: SectionHeading;
  paragraphs: CaseStudyParagraph[];
}

/** Logo breakdown + grid asset; optional section on the project. */
export interface CaseStudyLogoSection {
  heading?: SectionHeading;
  breakdown: CaseStudyParagraph[];
  gridImage: string;
}

export interface CaseStudyColorSwatch {
  name: string;
  hex: string;
}

/** Palette, type, and identity stills for the visual identity block. */
export interface CaseStudyVisualIdentitySection {
  heading?: SectionHeading;
  identityImages: string[];
  colorPalette: CaseStudyColorSwatch[];
  typographyPrimary: string;
  typographySecondary: string;
}

export interface CaseStudyApplicationsSection {
  heading?: SectionHeading;
  images: string[];
}

export interface CaseStudyResultMetric {
  label: string;
  value: string;
}

export interface CaseStudyResultsSection {
  heading?: SectionHeading;
  metrics: CaseStudyResultMetric[];
}

/** Nested content for brand / packaging case study pages */
export interface ProjectCaseStudy {
  industry: string;
  services: string[];
  /** Display timeline string, e.g. "6 Weeks" (distinct from IProject.timeline phases) */
  engagementTimeline: string;
  /** Optional; omit or leave paragraphs empty to hide */
  aboutClient?: CaseStudyParagraphSection;
  summary: CaseStudyParagraphSection;
  challenge: CaseStudyParagraphSection;
  strategy: CaseStudyParagraphSection;
  logoDesign?: CaseStudyLogoSection;
  visualIdentity: CaseStudyVisualIdentitySection;
  applications?: CaseStudyApplicationsSection;
  results: CaseStudyResultsSection;
  keywords: string[];
}
