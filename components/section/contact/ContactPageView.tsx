'use client';

import { ContactHeroSection } from './ContactHeroSection';
import { ContactFormSection } from './ContactFormSection';
import { ContactInfoSection } from './ContactInfoSection';
import { MapSection } from './MapSection';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';

export const ContactPageView = ({
  contactInfo,
  socials,
}: {
  contactInfo?: ClientSiteSettings['contactInfo'];
  socials?: ClientSiteSettings['socials'];
}) => {
  return (
    <>
      <ContactHeroSection />
      <div className="grid lg:grid-cols-5 gap-0">
        <div className="lg:col-span-3">
          <ContactFormSection />
        </div>
        <div className="lg:col-span-2">
          <ContactInfoSection contactInfo={contactInfo} socials={socials} />
        </div>
      </div>
      <MapSection contactInfo={contactInfo} />
    </>
  );
};
