/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { MapPin } from 'lucide-react';
import { GhostBtn } from '@/components/atoms/GhostBtn';

export const MapSection = () => {
  const { siteLoading } = useSiteStore(state => state);

  const { settings, fetchSettings } = useSiteSettingsStore(state => ({
    settings: state.settings,
    fetchSettings: state.actions.fetchSettings,
  }));

  useEffect(() => {
    fetchSettings('contactInfo');
  }, []);

  const contactInfo = settings?.contactInfo;
  const address = contactInfo?.address?.join(', ') || 'Our Location';
  const locationUrl = contactInfo?.locationUrl || 'https://maps.google.com';

  return (
    <SectionContainer className="py-0 md:py-0 lg:py-0">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={siteLoading ? {} : { opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative w-full h-[400px] md:h-[500px] bg-muted rounded-none overflow-hidden">
        {/* Placeholder for map - can be replaced with actual map integration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Our Location</h3>
            <p className="text-muted-foreground mb-4 max-w-md">{address}</p>
            <GhostBtn
              linkProps={{
                href: locationUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
              }}
              className="text-primary hover:text-primary-light font-medium">
              Open in Google Maps →
            </GhostBtn>
          </div>
        </div>

        {/* Decorative grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </motion.div>
    </SectionContainer>
  );
};
