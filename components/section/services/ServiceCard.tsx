'use client';

import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ClientService } from '@/lib/constants/endpoints';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon, LucideIconName } from '@/components/general/DynamicIcon';

interface ServiceCardProps {
  service: ClientService;
  index: number;
}

export const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const { siteLoading } = useSiteStore(state => state);

  const imageSrc = service.cardImage || service.bannerImage || service.image || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}>
      <Link
        href={`/services/${service.slug}`}
        className="group card-interactive block h-full overflow-hidden rounded-xl border border-border bg-card">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={service.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="card-hover-media-subtle object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              {service.icon ? (
                <DynamicIcon
                  name={service.icon as LucideIconName}
                  props={{ className: 'w-16 h-16 text-primary/40' }}
                />
              ) : (
                <span className="text-4xl font-bold text-primary/30">
                  {service.title.charAt(0)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {service.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {service.shortDescription || service.description}
          </p>

          <div className="flex items-center text-primary font-medium text-sm">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
