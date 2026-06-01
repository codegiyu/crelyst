'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ClientService } from '@/lib/constants/endpoints';
import { Layers } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { ServicePreviewCard } from './ServicePreviewCard';

export const ServicesPreviewSection = ({ services }: { services: ClientService[] }) => {
  const { siteLoading } = useSiteStore(state => state);

  const displayServices = services
    .filter(s => s.isActive)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .slice(0, 6);

  return (
    <SectionContainer>
      <SectionHeading
        Icon={Layers}
        title="What We Create"
        text="From photography to packaging, we bring your brand's vision to life through powerful design and visual storytelling"
      />

      {displayServices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={siteLoading ? {} : { opacity: 1 }}
          className="text-center py-16">
          <p className="text-muted-foreground text-lg">Services coming soon.</p>
        </motion.div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayServices.map((service, index) => (
              <ServicePreviewCard key={service.slug} service={service} index={index} />
            ))}
          </div>

          {services.filter(s => s.isActive).length > 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12">
              <RegularBtn linkProps={{ href: '/services' }} variant="outline" className="px-8">
                View All Services
              </RegularBtn>
            </motion.div>
          )}
        </>
      )}
    </SectionContainer>
  );
};
