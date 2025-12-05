'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useServicesStore } from '@/lib/store/useServicesStore';
import { ServiceCard } from './ServiceCard';
import { Skeleton } from '@/components/ui/skeleton';

export const ServicesGridSection = () => {
  const { siteLoading } = useSiteStore(state => state);
  const { services, isLoading } = useServicesStore(state => ({
    services: state.services,
    isLoading: state.isLoading,
  }));

  return (
    <SectionContainer>
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 rounded-xl border border-border">
              <Skeleton className="w-14 h-14 rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={siteLoading ? {} : { opacity: 1 }}
          className="text-center py-16">
          <p className="text-muted-foreground text-lg">No services available at the moment.</p>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services
            .filter(s => s.isActive)
            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
            .map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
        </div>
      )}
    </SectionContainer>
  );
};
