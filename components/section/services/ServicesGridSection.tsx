'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ServiceCard } from './ServiceCard';
import type { ClientService } from '@/lib/constants/endpoints';

export const ServicesGridSection = ({ services }: { services: ClientService[] }) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <SectionContainer>
      {services.length === 0 ? (
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
