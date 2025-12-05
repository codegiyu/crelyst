'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useServicesStore } from '@/lib/store/useServicesStore';
import { ClientService } from '@/lib/constants/endpoints';
import { DynamicIcon, LucideIconName } from '@/components/general/DynamicIcon';
import { ArrowRight, Layers } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { RegularBtn } from '@/components/atoms/RegularBtn';

const ServicePreviewCard = ({ service, index }: { service: ClientService; index: number }) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}>
      <Link
        href={`/services/${service.slug}`}
        className="group block p-6 md:p-8 h-full bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-500 relative overflow-hidden">
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          {/* Icon */}
          <div className="w-16 h-16 mb-6 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
            {service.icon ? (
              <DynamicIcon
                name={service.icon as LucideIconName}
                props={{
                  className:
                    'w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors',
                }}
              />
            ) : (
              <Layers className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
            )}
          </div>

          {/* Content */}
          <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
            {service.title}
          </h3>

          <p className="text-muted-foreground mb-4 line-clamp-2">
            {service.shortDescription || service.description}
          </p>

          {/* CTA */}
          <div className="flex items-center text-primary font-medium">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const ServicesPreviewSection = () => {
  const { siteLoading } = useSiteStore(state => state);
  const { services, isLoading } = useServicesStore(state => ({
    services: state.services,
    isLoading: state.isLoading,
  }));

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

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 md:p-8 rounded-2xl border border-border">
              <Skeleton className="w-16 h-16 rounded-xl mb-6" />
              <Skeleton className="h-7 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      ) : displayServices.length === 0 ? (
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
