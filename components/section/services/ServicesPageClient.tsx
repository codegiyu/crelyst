/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ServicesHeroSection } from './ServicesHeroSection';
import { ServicesGridSection } from './ServicesGridSection';
import { useServicesStore } from '@/lib/store/useServicesStore';

export const ServicesPageClient = () => {
  const { fetchServices } = useServicesStore(state => state.actions);

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <MainLayout transparentHeader>
      <ServicesHeroSection />
      <ServicesGridSection />
    </MainLayout>
  );
};
