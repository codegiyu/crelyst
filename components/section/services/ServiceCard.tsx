'use client';

import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ClientService } from '@/lib/constants/endpoints';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon, LucideIconName } from '@/components/general/DynamicIcon';

interface ServiceCardProps {
  service: ClientService;
  index: number;
}

export const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}>
      <Link
        href={`/services/${service.slug}`}
        className="group block p-6 h-full bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300">
        {/* Icon or Image */}
        <div className="w-14 h-14 mb-4 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors overflow-hidden">
          {service.cardImage ? (
            <img
              src={service.cardImage}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          ) : service.icon ? (
            <DynamicIcon
              name={service.icon as LucideIconName}
              props={{ className: 'w-7 h-7 text-primary' }}
            />
          ) : (
            <div className="w-7 h-7 rounded bg-primary/30" />
          )}
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {service.title}
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-2">
          {service.shortDescription || service.description}
        </p>

        {/* CTA */}
        <div className="flex items-center text-primary font-medium">
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
};
