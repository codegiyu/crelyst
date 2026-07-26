import { Youtube as LucideYoutube } from 'lucide-react';
import type { SVGProps } from 'react';

/** IconComp-compatible YouTube mark for social buttons. */
const Youtube = (props: SVGProps<SVGSVGElement>) => {
  return <LucideYoutube {...props} />;
};

export default Youtube;
