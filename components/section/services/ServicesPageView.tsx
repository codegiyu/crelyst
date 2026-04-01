'use client';

import { ServicesHeroSection } from './ServicesHeroSection';
import { ServicesGridSection } from './ServicesGridSection';
import type { ClientService } from '@/lib/constants/endpoints';

export const ServicesPageView = ({ services }: { services: ClientService[] }) => {
  return (
    <>
      <ServicesHeroSection />
      <ServicesGridSection services={services} />
    </>
  );
};
