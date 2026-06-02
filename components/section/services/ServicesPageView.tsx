'use client';

import { PublicContactCTASection } from '@/components/section/shared/PublicContactCTASection';
import { ServicesHeroSection } from './ServicesHeroSection';
import { ServicesGridSection } from './ServicesGridSection';
import type { ClientService } from '@/lib/constants/endpoints';

export const ServicesPageView = ({ services }: { services: ClientService[] }) => {
  return (
    <>
      <ServicesHeroSection />
      <ServicesGridSection services={services} />
      <PublicContactCTASection
        caption="Get started"
        title="Not sure which service fits?"
        description="Share where you are today and where you want to go — we'll recommend the right mix of strategy, design, and delivery for your brand."
        buttonLabel="Contact Us"
        contactHref="/contact"
        motionDelay={0.2}
      />
    </>
  );
};
