'use client';

import { PageHeroSection } from '@/components/general/PageHeroSection';

export const ContactHeroSection = () => {
  return (
    <PageHeroSection
      bannerImage="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1920&auto=format&fit=crop"
      badge="Get In Touch"
      title="Contact Us"
      description="Have a question or want to work together? We'd love to hear from you. Reach out and let's start a conversation."
      titleFont="serif"
      gradientColors={{
        from: 'from-secondary/5',
        via: 'via-background',
        to: 'to-primary/5',
      }}
    />
  );
};
