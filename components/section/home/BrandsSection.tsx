'use client';

import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useBrandsStore } from '@/lib/store/useBrandsStore';
import { Skeleton } from '@/components/ui/skeleton';

export const BrandsSection = () => {
  const { siteLoading } = useSiteStore(state => state);
  const { brands, isLoading } = useBrandsStore(state => ({
    brands: state.brands,
    isLoading: state.isLoading,
  }));

  const activeBrands = brands
    .filter(b => b.isActive)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  if (!isLoading && activeBrands.length === 0) {
    return null; // Don't show section if no brands
  }

  return (
    <section className="py-12 md:py-16 bg-muted/30 border-y border-border overflow-hidden">
      <div className="regular-container">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted by Leading Brands
        </motion.p>

        {isLoading ? (
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Gradient masks for infinite scroll effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

            {/* Marquee container */}
            <div className="flex overflow-hidden">
              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="flex items-center gap-12 md:gap-16 shrink-0">
                {/* Double the brands for seamless loop */}
                {[...activeBrands, ...activeBrands].map((brand, index) => (
                  <div
                    key={`${brand._id}-${index}`}
                    className="shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                    {brand.websiteUrl ? (
                      <a
                        href={brand.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-8 md:h-10 w-auto max-w-[120px] object-contain"
                        />
                      </a>
                    ) : (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-8 md:h-10 w-auto max-w-[120px] object-contain"
                      />
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
