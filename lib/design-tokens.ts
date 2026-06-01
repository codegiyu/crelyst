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
  { name: 'Destructive', cssVar: '--destructive', hex: '#D92D20', hsl: '0 70% 50%' },
] as const;

export const designTypography = [
  {
    name: 'Sans (body / UI)',
    family: 'Montserrat',
    cssClass: 'font-sans',
    sample: 'Where Creativity Meets Vision',
  },
  {
    name: 'Serif (headings)',
    family: 'Poppins',
    cssClass: 'font-serif',
    sample: 'Our Creative Work',
  },
  {
    name: 'Display accent',
    family: 'Lobster',
    cssClass: 'font-lobster',
    sample: 'Crelyst',
  },
] as const;

export const designTypeScale = [
  {
    label: 'Hero H1',
    classes: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-sans leading-[1.1]',
  },
  { label: 'Page hero H1', classes: 'text-4xl md:text-5xl lg:text-6xl font-bold font-serif' },
  {
    label: 'Section H2',
    classes: 'text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-primary',
  },
  { label: 'Case study H2', classes: 'text-3xl md:text-5xl font-bold leading-tight font-serif' },
  {
    label: 'Body large',
    classes: 'text-base md:text-lg lg:text-xl text-foreground/90 leading-relaxed',
  },
  { label: 'Body', classes: 'text-base text-foreground leading-relaxed' },
  {
    label: 'Eyebrow label',
    classes: 'text-primary text-sm tracking-[0.3em] uppercase',
  },
] as const;

export const designSpacing = [
  { name: 'Section padding', utility: 'section-padding', note: 'py-16 md:py-24 lg:py-[6.5rem]' },
  {
    name: 'Container (regular)',
    utility: 'regular-container',
    note: 'max-w-7xl → 3xl:max-w-[1500px]',
  },
  { name: 'Container (custom)', utility: 'container-custom', note: 'max-w-7xl mx-auto px-4' },
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

export const styleguideNav = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'buttons', label: 'Buttons & CTAs' },
  { id: 'headings', label: 'Section headings' },
  { id: 'page-heroes', label: 'Page heroes' },
  { id: 'detail-heroes', label: 'Detail heroes' },
  { id: 'cards', label: 'Cards' },
  { id: 'homepage', label: 'Homepage (frozen)' },
  { id: 'layout', label: 'Layout' },
] as const;

export const styleguideSectionIds: readonly string[] = styleguideNav.map(section => section.id);
