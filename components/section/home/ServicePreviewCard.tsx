'use client';

import type { ClientService } from '@/lib/constants/endpoints';
import {
  WhatWeCreateCard,
  type WhatWeCreateCardLayout,
  eyebrowForService,
} from './WhatWeCreateCard';

export type ServicePreviewCardProps = {
  service: ClientService;
  index: number;
  eyebrow?: string;
  layout?: WhatWeCreateCardLayout;
};

/** Homepage “What We Create” grid — same Figma card; layout defaults to standard. */
export const ServicePreviewCard = ({
  service,
  index,
  eyebrow,
  layout = 'standard',
}: ServicePreviewCardProps) => {
  return (
    <WhatWeCreateCard
      service={service}
      index={index}
      eyebrow={eyebrow ?? eyebrowForService(service)}
      layout={layout}
    />
  );
};

export { WhatWeCreateCard } from './WhatWeCreateCard';
export type { WhatWeCreateCardLayout, WhatWeCreateCardProps } from './WhatWeCreateCard';
