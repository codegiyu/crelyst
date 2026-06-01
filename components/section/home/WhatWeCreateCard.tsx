'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ClientService } from '@/lib/constants/endpoints';
import { cn } from '@/lib/utils';

export type WhatWeCreateCardLayout = 'wide' | 'standard';

export type WhatWeCreateCardProps = {
  service: ClientService;
  index: number;
  /** Small orange uppercase line above the title (Figma). */
  eyebrow: string;
  layout?: WhatWeCreateCardLayout;
};

/**
 * “What We Create” image card — Crelyst Landing Page (Desktop) / Figma.
 * Full-bleed photo, bottom gradient, orange eyebrow + white title.
 */
export function WhatWeCreateCard({
  service,
  index,
  eyebrow,
  layout = 'standard',
}: WhatWeCreateCardProps) {
  const { siteLoading } = useSiteStore(state => state);
  const imageUrl = service.cardImage || service.image || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn('h-full', layout === 'wide' ? 'min-h-[240px] md:min-h-[320px]' : 'min-h-[240px] md:min-h-[320px]')}>
      <Link
        href={`/services/${service.slug}`}
        className="group relative block h-full min-h-[inherit] overflow-hidden rounded-lg border border-white/10">
        <div className="absolute inset-0 bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes={
                layout === 'wide'
                  ? '(max-width: 768px) 100vw, 65vw'
                  : '(max-width: 768px) 100vw, 35vw'
              }
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/25 to-background" aria-hidden />
          )}
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent"
          aria-hidden
        />

        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.28em] text-primary md:mb-3 md:text-xs">
            {eyebrow}
          </p>
          <h3 className="font-sans text-2xl font-bold leading-[1.1] text-white md:text-3xl lg:text-4xl">
            {service.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

const SERVICE_EYEBROWS: Record<string, string> = {
  'brand-design': 'Crafted Experience',
  'product-design': 'Industrial Focus',
  photography: 'Visual Storytelling',
  'packaging-design': 'Packaging & Print',
  'visual-identity': 'Identity Systems',
};

export function eyebrowForService(service: ClientService): string {
  return SERVICE_EYEBROWS[service.slug] ?? 'What We Create';
}
