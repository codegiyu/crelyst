'use client';

import Image from 'next/image';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ArrowRight, Phone } from 'lucide-react';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';

const HOME_CTA_BACKGROUND = '/images/bg-section-6.jpg';

export const CTASection = ({
  contactInfo,
}: {
  contactInfo?: ClientSiteSettings['contactInfo'];
}) => {
  const { siteLoading } = useSiteStore(state => state);

  const phoneNumber = contactInfo?.tel?.[0] || '';
  const phoneLink = phoneNumber
    ? `tel:${phoneNumber.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '')}`
    : '#';

  return (
    <section className="relative isolate overflow-x-clip overflow-hidden py-24 md:py-32">
      <Image
        src={HOME_CTA_BACKGROUND}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority={false}
      />

      <div className="absolute inset-0 bg-black/55" aria-hidden />

      <SectionContainer className="relative z-10 py-0 md:py-0 lg:py-0">
        <div className="content-focus-wide mx-auto text-center md:mx-0 md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-10">
            <SectionHeading
              static
              whiteText
              caption="Let's Talk"
              title={
                <>
                  Ready to Transform Your <span className="text-accent">Digital Presence</span>?
                </>
              }
              text="Whether you have a specific project in mind or just want to explore possibilities, we're here to help. Get in touch and let's create something extraordinary together."
              align="start"
              spacing="none"
              className="max-md:text-center [&_h2]:text-3xl [&_h2]:sm:text-4xl [&_h2]:md:text-5xl [&_h2]:lg:text-6xl [&_p:first-child]:text-white/90 [&_p:last-of-type]:text-lg [&_p:last-of-type]:md:text-xl [&_p:last-of-type]:text-white/80 [&_p:last-of-type]:max-w-2xl max-md:[&_p:last-of-type]:mx-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4">
            <RegularBtn
              variant="secondary"
              linkProps={{ href: '/contact' }}
              className="px-8 py-4 text-lg group"
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
