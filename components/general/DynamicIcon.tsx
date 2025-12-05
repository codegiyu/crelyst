import { LucideIconComp } from '@/lib/types/general';
import * as LucideIcons from 'lucide-react';
import { SVGProps } from 'react';

export type LucideIconName = {
  [K in keyof typeof LucideIcons]: (typeof LucideIcons)[K] extends LucideIconComp ? K : never;
}[keyof typeof LucideIcons];

interface DynamicIconProps {
  name: LucideIconName;
  props: SVGProps<SVGSVGElement>;
}

export function DynamicIcon({ name, props }: DynamicIconProps) {
  const Icon = LucideIcons[name] || LucideIcons['AlertTriangle'];
  return <Icon {...props} />;
}

export { LucideIcons };
