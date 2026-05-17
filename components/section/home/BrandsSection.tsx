'use client';

import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ClientBrand } from '@/lib/constants/endpoints';
import Image from 'next/image';

const BrandLogo = ({ brand }: { brand: ClientBrand }) => (
  <Image
    src={brand.logo}
    alt={brand.name}
    width={200}
    height={56}
    sizes="200px"
    className="h-10 md:h-14 w-auto object-contain"
  />
);

export const BrandsSection = ({ brands }: { brands: ClientBrand[] }) => {
  const { siteLoading } = useSiteStore(state => state);

  const activeBrands = brands
    .filter(b => b.isActive)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  if (activeBrands.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-black/75 overflow-hidden -mt-1">
      <div className="regular-container">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted by Leading Brands
        </motion.p>

        <div className="relative">
          {/* Gradient masks for infinite scroll effect */}
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black/30 to-transparent z-10 pointer-events-none" />

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
                  className="shrink-0 grayscale-0 hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                  {brand.websiteUrl ? (
                    <a
                      href={brand.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block">
                      <BrandLogo brand={brand} />
                    </a>
                  ) : (
                    <BrandLogo brand={brand} />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
