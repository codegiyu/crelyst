'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { BookOpen } from 'lucide-react';

export const StorySection = () => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <SectionContainer background="muted">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Image/Visual Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative">
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <p className="text-lg font-medium text-foreground">Our Journey</p>
              </div>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-xl -z-10" />
        </motion.div>

        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}>
          <SectionHeading
            title="The Crelyst Story"
            text="Where creativity meets purpose"
            className="text-start mb-8"
          />

          <div className="grid gap-4 text-muted-foreground">
            <p>
              Crelyst was born from a simple belief: every brand has a unique story waiting to be
              told. We&apos;re a full-service design and branding agency that specializes in
              bringing these stories to life through powerful visuals and compelling narratives.
            </p>
            <p>
              Our work spans photography, brand design, product design, packaging, and visual
              identity development. We don&apos;t just create designs—we craft experiences that
              resonate with audiences and leave lasting impressions.
            </p>
            <p>
              We also believe in the power of collaboration. That&apos;s why we work with talented
              freelance designers on select projects, sharing a percentage of each job. Together, we
              create work that pushes boundaries and sets new standards in creative excellence.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionContainer>
  );
};
