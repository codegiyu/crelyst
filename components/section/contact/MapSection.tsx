'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';
import { isGoogleMapsEmbedUrl } from '@/lib/utils/googleMapsEmbed';

/**
 * Shown when no valid Google Maps embed URL is configured.
 * Use a path under `public/` (e.g. `/images/contact-map-fallback.jpg`) or any URL allowed in `next.config` `images.remotePatterns`.
 */
const CONTACT_MAP_FALLBACK_IMAGE_SRC =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop';

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
  const showMap = rawEmbed.length > 0 && isGoogleMapsEmbedUrl(rawEmbed);

  return (
    <SectionContainer className="py-0 md:py-0 lg:py-0">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={siteLoading ? {} : { opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative w-full h-[400px] md:h-[500px] rounded-none overflow-hidden bg-muted">
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
