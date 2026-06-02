/**
 * Read-only design token catalog for the internal styleguide.
 * Source of truth for runtime styling remains `app/globals.css`.
 * Values align with Crelyst Figma (desktop) + existing production theme.
 */

export const designColors = [
  { name: 'Background', cssVar: '--background', hex: '#121218', hsl: '240 10% 8%' },
  { name: 'Foreground', cssVar: '--foreground', hex: '#FAFAFA', hsl: '0 0% 98%' },
  { name: 'Primary (Crelyst Orange)', cssVar: '--primary', hex: '#F27B35', hsl: '20 87% 65%' },
  { name: 'Primary foreground', cssVar: '--primary-foreground', hex: '#FFFFFF', hsl: '0 0% 100%' },
  { name: 'Secondary', cssVar: '--secondary', hex: '#595959', hsl: '0 0% 35%' },
  { name: 'Accent', cssVar: '--accent', hex: '#E8E4DF', hsl: '30 15% 88%' },
  { name: 'Muted', cssVar: '--muted', hex: '#38342F', hsl: '30 8% 20%' },
  { name: 'Muted foreground', cssVar: '--muted-foreground', hex: '#C9C4BC', hsl: '30 10% 75%' },
  { name: 'Border', cssVar: '--border', hex: '#45403A', hsl: '30 8% 25%' },
  { name: 'Card', cssVar: '--card', hex: '#1C1C22', hsl: '240 8% 12%' },
  {
    name: 'Surface deep (section)',
    cssVar: '--surface-deep',
    hex: '#111113',
    hsl: '240 5% 7%',
  },
  { name: 'Stat card', cssVar: '--stat-card', hex: '#161618', hsl: '240 4% 9%' },
  { name: 'Destructive', cssVar: '--destructive', hex: '#D92D20', hsl: '0 70% 50%' },
] as const;

export const designTypography = [
  {
    name: 'Sans (body / UI)',
    family: 'Poppins',
    cssClass: 'font-sans',
    sample: 'Where creativity meets vision — body copy and interface text.',
  },
  {
    name: 'Heading (brand)',
    family: 'Montserrat',
    cssClass: 'font-heading',
    sample: 'Our Creative Work',
  },
  {
    name: 'Mono (UI / code)',
    family: 'JetBrains Mono',
    cssClass: 'font-mono',
    sample: 'GET-QUOTE-01',
    note: 'Admin and technical UI only',
  },
  {
    name: 'Display accent',
    family: 'Lobster',
    cssClass: 'font-lobster',
    sample: 'Codegiyu',
    note: 'Footer developer credit only',
  },
] as const;

export const designTypeScale = [
  {
    label: 'Hero H1',
    classes: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-[1.1]',
  },
  { label: 'Page hero H1', classes: 'text-4xl md:text-5xl lg:text-6xl font-bold font-heading' },
  {
    label: 'Section caption',
    classes: 'text-[11px] font-medium uppercase tracking-[0.28em] text-primary md:text-xs',
  },
  {
    label: 'Section H2',
    classes: 'text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground',
  },
  { label: 'Case study H2', classes: 'text-3xl md:text-5xl font-bold leading-tight font-heading' },
  {
    label: 'Body large',
    classes: 'text-base md:text-lg lg:text-xl text-foreground/90 leading-relaxed font-sans',
  },
  { label: 'Body', classes: 'text-base text-foreground leading-relaxed font-sans' },
  {
    label: 'Eyebrow label (cards)',
    classes: 'text-primary text-[11px] font-medium uppercase tracking-[0.28em] font-heading',
  },
] as const;

export const designSpacing = [
  { name: 'Section padding', utility: 'section-padding', note: 'py-16 md:py-24 lg:py-[6.5rem]' },
] as const;

/** Page shell + reading measure — see `app/globals.css` @theme width tokens */
export const designLayout = [
  {
    name: 'Shell (page gutter)',
    utility: 'regular-container',
    note: '1280px → 1360 (2xl) → 1440 (3xl) → 1536px (4xl) cap; monotonic padding through ultrawide',
  },
  {
    name: 'Prose',
    utility: 'content-prose / content-prose-center',
    note: '48rem — section blurbs, case study body',
  },
  {
    name: 'Lead',
    utility: 'content-lead / content-lead-center',
    note: '42rem — hero descriptions, short intros',
  },
  {
    name: 'Focus',
    utility: 'content-focus / content-focus-center',
    note: '64rem — centered hero blocks',
  },
  {
    name: 'Focus wide',
    utility: 'content-focus-wide / content-focus-wide-center',
    note: '56rem — hero subcopy, testimonial quotes',
  },
  {
    name: 'Card grid',
    utility: 'layout-grid-cards',
    note: '2/3-col portfolio grid; gap scales at 3xl/4xl',
  },
] as const;

export const designRadii = [
  { name: 'Base radius', token: '--radius', value: '0.75rem' },
  { name: 'Button / control', note: 'rounded-[6px] on buttons' },
  { name: 'Card (listing)', note: 'rounded-xl' },
  { name: 'Card (homepage preview)', note: 'rounded-2xl' },
] as const;

export const designShadows = [
  { name: 'Elegant', utility: 'shadow-elegant', note: 'Orange-tinted subtle elevation' },
  { name: 'Creative', utility: 'shadow-creative', note: 'Stronger orange glow on hover' },
] as const;

/** Card hover utilities — `app/globals.css` + styleguide Cards section */
export const designCardMotion = [
  {
    name: 'Card shell lift',
    utility: 'card-interactive',
    note: 'Apply on the card link (`group`). Lifts ~4px, primary border, shadow-elegant — 500ms ease-out.',
  },
  {
    name: 'Image Ken Burns (overlay cards)',
    utility: 'card-hover-media',
    note: 'Full-bleed preview / What We Create images. Scale 1.06 over 1.2s — avoid tiny fast zooms.',
  },
  {
    name: 'Image Ken Burns (listing)',
    utility: 'card-hover-media-subtle',
    note: 'Service & project listing thumbnails. Scale 1.04 over 900ms.',
  },
  {
    name: 'Text-on-image scrim',
    utility: 'card-overlay-scrim + card-overlay-scrim-deepen',
    note: 'Neutral bottom gradient; hover deepens scrim only — no primary tint or brightness filters.',
  },
] as const;

export const styleguideNav = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'buttons', label: 'Buttons & CTAs' },
  { id: 'headings', label: 'Section headings' },
  { id: 'page-heroes', label: 'Page heroes' },
  { id: 'detail-heroes', label: 'Detail heroes' },
  { id: 'cards', label: 'Cards' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'homepage', label: 'Homepage (frozen)' },
  { id: 'layout', label: 'Layout' },
] as const;

export const styleguideSectionIds: readonly string[] = styleguideNav.map(section => section.id);
