'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { ContactHeroSection } from './ContactHeroSection';
import { ContactFormSection } from './ContactFormSection';
import { ContactInfoSection } from './ContactInfoSection';
import { MapSection } from './MapSection';

export const ContactPageClient = () => {
  return (
    <MainLayout>
      <ContactHeroSection />
      <div className="grid lg:grid-cols-5 gap-0">
        <div className="lg:col-span-3">
          <ContactFormSection />
        </div>
        <div className="lg:col-span-2">
          <ContactInfoSection />
        </div>
      </div>
      <MapSection />
    </MainLayout>
  );
};
