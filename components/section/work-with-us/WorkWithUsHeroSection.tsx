'use client';

import { PageHeroSection } from '@/components/general/PageHeroSection';
import { Users, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';

export const WorkWithUsHeroSection = () => {
  const { siteLoading } = useSiteStore(state => state);

  const customTitle = (
    <>
      Join Our{' '}
      <span className="text-white relative">
        Creative Network
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={siteLoading ? {} : { pathLength: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute -bottom-2 left-0 w-full"
          viewBox="0 0 200 12"
          fill="none">
          <motion.path
            d="M2 10C50 2 150 2 198 10"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </motion.svg>
      </span>
    </>
  );

  const badge = (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-white/20 backdrop-blur-sm rounded-full">
      <Users className="w-4 h-4" />
      <span>For Freelancers & Designers</span>
    </div>
  );

  const additionalContent = (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-white" />
        <span>Fair revenue sharing</span>
      </div>
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-white" />
        <span>Creative freedom</span>
      </div>
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-white" />
        <span>Collaborative environment</span>
      </div>
    </div>
  );

  return (
    <PageHeroSection
      bannerImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop"
      badge={badge}
      title={customTitle}
      description="We believe in the power of collaboration. We work with talented freelance designers on select projects, sharing a percentage of each job. If you're a creative designer looking to collaborate on exciting projects, we'd love to hear from you."
      additionalContent={additionalContent}
      titleFont="sans"
    />
  );
};
