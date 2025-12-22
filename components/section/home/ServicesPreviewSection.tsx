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

  const imageUrl = service.cardImage || service.image;
  const description = service.shortDescription || service.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="aspect-[4/3]">
      <Link
        href={`/services/${service.slug}`}
        className="group block h-full w-full rounded-2xl overflow-hidden relative border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center">
              {service.icon ? (
                <DynamicIcon
                  name={service.icon as LucideIconName}
                  props={{
                    className: 'w-16 h-16 text-primary/40',
                  }}
                />
              ) : (
                <Layers className="w-16 h-16 text-primary/40" />
              )}
            </div>
          )}
          {/* Gradient Overlay - Darker on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/85 group-hover:via-black/60 group-hover:to-black/30 transition-all duration-500" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
          {/* Title - Always visible */}
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h3>

          {/* Description - Shows on hover */}
          <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
            <p className="text-white/90 text-base md:text-lg mb-4 pt-2 line-clamp-2">
              {description}
            </p>
          </div>

          {/* CTA - Shows on hover */}
          <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75 ease-out flex items-center text-primary font-medium">
            <span>Learn More</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
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
            <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden border border-border">
              <Skeleton className="w-full h-full" />
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
