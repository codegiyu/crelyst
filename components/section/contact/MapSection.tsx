'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';
import { isGoogleMapsEmbedUrl } from '@/lib/utils/googleMapsEmbed';

const CONTACT_MAP_FALLBACK_IMAGE_SRC = '/images/bg-hero-about.jpg';

function MapImageFallback() {
  return (
    <div className="absolute inset-0 bg-zinc-950" aria-hidden>
      <Image
        src={CONTACT_MAP_FALLBACK_IMAGE_SRC}
        alt="Map location placeholder"
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>
  );
}

export const MapSection = ({
  contactInfo,
}: {
  contactInfo?: ClientSiteSettings['contactInfo'];
}) => {
  const { siteLoading } = useSiteStore(state => state);
  const rawEmbed = contactInfo?.mapsEmbedUrl?.trim() ?? '';
  const locationUrl = contactInfo?.locationUrl?.trim() ?? '';
  const showMap = rawEmbed.length > 0 && isGoogleMapsEmbedUrl(rawEmbed);

  return (
    <SectionContainer className="bg-background pb-16 md:pb-20">
      {locationUrl ? (
        <div className="mb-4 flex justify-end">
          <a
            href={locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline">
            Get Directions
          </a>
        </div>
      ) : null}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="relative w-full h-[360px] md:h-[440px] rounded-2xl border border-white/3 overflow-hidden shadow-card bg-white/3">
        {showMap ? (
          <iframe
            src={rawEmbed}
            title="Business location on Google Maps"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <MapImageFallback />
        )}
      </motion.div>
    </SectionContainer>
  );
};
