'use client';

import { useMemo } from 'react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { getAllProjectAndServiceImages } from '@/lib/utils/getAllProjectAndServiceImages';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import type { ClientProject, ClientService, ClientSiteSettings } from '@/lib/constants/endpoints';
import Image from 'next/image';

export const CTASection = ({
  contactInfo,
  projects,
  services,
}: {
  contactInfo?: ClientSiteSettings['contactInfo'];
  projects: ClientProject[];
  services: ClientService[];
}) => {
  const { siteLoading } = useSiteStore(state => state);

  const images = useMemo(
    () => getAllProjectAndServiceImages(projects, services),
    [projects, services]
  );

  const getMarqueeImages = (marqueeIndex: number) => {
    if (images.length === 0) return [];
    // Distribute images across three marquees
    const filtered = images.filter((_, index) => index % 3 === marqueeIndex);
    // If a marquee has no images, use all images to ensure visibility
    return filtered.length > 0 ? filtered : images;
  };

  const phoneNumber = contactInfo?.tel?.[0] || '';
  const phoneLink = phoneNumber
    ? `tel:${phoneNumber.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '')}`
    : '#';

  return (
    <section className="relative isolate overflow-x-clip py-24 md:py-32 overflow-hidden">
      {/* Three Vertical Marquees — clip + gentler X nudge on small viewports to avoid subpixel horizontal overflow */}
      {images.length > 0 && (
        <div className="absolute inset-0 z-0 flex items-center justify-end overflow-hidden overflow-x-clip pointer-events-none">
          <div className="flex h-[150%] w-[75%] min-w-[75%] translate-x-0 items-center justify-end gap-1 sm:gap-1 sm:translate-x-[4%] md:translate-x-[10%] md:gap-5">
            {[0, 1, 2].map(marqueeIndex => {
              const marqueeImages = getMarqueeImages(marqueeIndex);
              // Duplicate images for seamless infinite scroll (need at least 2 copies)
              const duplicatedImages = [
                ...marqueeImages,
                ...marqueeImages,
                ...marqueeImages,
                ...marqueeImages,
              ];
              const isReverse = marqueeIndex % 2 === 1; // Alternate directions (middle one reverses)

              // Calculate duration based on number of images to maintain constant visual speed
              // Base speed: 5 seconds per image (adjust this to change overall speed)
              // Since we animate through 50% (one full set), duration = original images * base speed
              const baseSpeedPerImage = 25; // seconds per image
              const calculatedDuration = Math.max(marqueeImages.length * baseSpeedPerImage, 20); // Minimum 20 seconds

              return (
                <div
                  key={`marquee-${marqueeIndex}`}
                  className="flex-1 h-full overflow-hidden"
                  style={{
                    transform: 'rotate(15deg)',
                    transformOrigin: 'center center',
                  }}>
                  <motion.div
                    animate={{
                      y: isReverse ? ['0%', '-50%'] : ['-50%', '0%'],
                    }}
                    transition={{
                      duration: calculatedDuration,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="flex flex-col gap-1 sm:gap-1 md:gap-1">
                    {duplicatedImages.map((image, index) => (
                      <div
                        key={`marquee-${marqueeIndex}-img-${index}`}
                        className="relative shrink-0 w-full aspect-[3/4] rounded-none overflow-hidden opacity-80 hover:opacity-90 transition-opacity">
                        <Image
                          src={image}
                          alt={`Marquee ${marqueeIndex} image ${index}`}
                          fill
                          sizes="25vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Background with gradient fade to right - darker primary mix for calmer harmony */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(to right,
            color-mix(in hsl, hsl(var(--primary)) 68%, black) 0%,
            color-mix(in hsl, hsl(var(--primary)) 62%, black) 32%,
            color-mix(in hsl, hsl(var(--primary)) 48%, black) 48%,
            hsl(var(--primary) / 0.22) 62%,
            transparent 100%)`,
        }}
      />

      {/* Pattern overlay */}
      {/* <div
        className="absolute inset-0 opacity-10 z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      /> */}

      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-white/10 blur-xl z-30"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 right-[15%] w-40 h-40 rounded-full bg-white/5 blur-2xl z-30"
      />

      <SectionContainer className="relative z-40 py-0 md:py-0 lg:py-0">
        <div className="max-w-4xl mx-auto md:mx-0 text-center md:text-left">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 rounded-full text-white/90 text-sm font-medium backdrop-blur-sm">
            <MessageCircle className="w-4 h-4" />
            Let&apos;s Start a Conversation
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-serif leading-tight">
            Ready to Transform Your <span className="text-accent">Digital Presence</span>?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto md:mx-0 mb-10">
            Whether you have a specific project in mind or just want to explore possibilities,
            we&apos;re here to help. Get in touch and let&apos;s create something extraordinary
            together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4">
            <RegularBtn
              linkProps={{ href: '/contact' }}
              className="px-8 py-6 text-lg bg-white text-primary hover:bg-white/90 group"
              RightIcon={ArrowRight}
              rightIconProps={{
                className: 'size-5 group-hover:translate-x-1 transition-transform',
              }}
              text="Start Your Project"
            />

            <GhostBtn
              linkProps={{ href: phoneLink }}
              size="none"
              className="flex items-center gap-3 px-6 py-3 text-white hover:text-accent transition-colors group">
              <span className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Phone className="w-5 h-5" />
              </span>
              <div className="text-left">
                <span className="block text-sm text-white/60">Call us now</span>
                <span className="font-medium">{phoneNumber || 'Phone number not available'}</span>
              </div>
            </GhostBtn>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Free Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>24-48h Response</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No Commitment Required</span>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
};
