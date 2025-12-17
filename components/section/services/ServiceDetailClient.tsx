/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ServiceDetailHero } from './ServiceDetailHero';
import { ServiceDetailContent } from './ServiceDetailContent';
import { useServicesStore } from '@/lib/store/useServicesStore';
import { ClientService } from '@/lib/constants/endpoints';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionContainer } from '@/components/general/SectionContainer';
import { notFound } from 'next/navigation';

interface ServiceDetailClientProps {
  slug: string;
}

export const ServiceDetailClient = ({ slug }: ServiceDetailClientProps) => {
  const { getServiceBySlug, servicesBySlug } = useServicesStore(state => ({
    getServiceBySlug: state.actions.getServiceBySlug,
    servicesBySlug: state.servicesBySlug,
  }));

  const [service, setService] = useState<ClientService | null>(servicesBySlug[slug] || null);
  const [isLoading, setIsLoading] = useState(!servicesBySlug[slug]);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (servicesBySlug[slug]) {
        setService(servicesBySlug[slug]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const fetchedService = await getServiceBySlug(slug);

      if (!fetchedService) {
        setNotFoundState(true);
      } else {
        setService(fetchedService);
      }
      setIsLoading(false);
    };

    fetchService();
  }, [slug, servicesBySlug]);

  if (notFoundState) {
    notFound();
  }

  if (isLoading) {
    return (
      <MainLayout transparentHeader>
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-5/6 mb-8" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </SectionContainer>
      </MainLayout>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <MainLayout transparentHeader>
      <ServiceDetailHero service={service} />
      <ServiceDetailContent service={service} />
    </MainLayout>
  );
};
