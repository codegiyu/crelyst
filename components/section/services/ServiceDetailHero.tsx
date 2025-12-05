'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ClientService } from '@/lib/constants/endpoints';
import { DynamicIcon, LucideIconName } from '@/components/general/DynamicIcon';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface ServiceDetailHeroProps {
  service: ClientService;
}

export const ServiceDetailHero = ({ service }: ServiceDetailHeroProps) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <SectionContainer className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-overlay pointer-events-none" />

      {/* Banner Image Overlay */}
      {service.bannerImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${service.bannerImage})` }}
        />
      )}

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={siteLoading ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          <Link
            href="/services"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Services
          </Link>
        </motion.div>

        <div className="text-center">
          {/* Icon */}
          {service.icon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={siteLoading ? {} : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <DynamicIcon
                name={service.icon as LucideIconName}
                props={{ className: 'w-10 h-10 text-primary' }}
              />
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-serif">
            {service.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {service.shortDescription || service.description}
          </motion.p>
        </div>
      </div>
    </SectionContainer>
  );
};
