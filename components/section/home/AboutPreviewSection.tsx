'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { Check, ArrowRight } from 'lucide-react';

const FEATURES = [
  'Expert team with 10+ years of experience',
  'Cutting-edge technologies and best practices',
  'Transparent communication throughout',
  'On-time delivery guaranteed',
  'Post-launch support and maintenance',
  'Scalable solutions for growth',
];

export const AboutPreviewSection = () => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <SectionContainer background="muted">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Image/Visual Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative order-2 lg:order-1">
          {/* Main visual container */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50" />

            {/* Main card */}
            <div className="relative bg-card rounded-2xl p-8 shadow-elegant">
              <div className="grid grid-cols-2 gap-4">
                {/* Stats cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-primary/10 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-1">150+</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-accent/10 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-accent mb-1">50+</div>
                  <div className="text-sm text-muted-foreground">Clients</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-secondary/20 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-secondary mb-1">10+</div>
                  <div className="text-sm text-muted-foreground">Years</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-muted rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-foreground mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </motion.div>
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-2xl -z-10"
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-6 w-20 h-20 bg-primary/20 rounded-full -z-10"
            />
          </div>
        </motion.div>

        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="order-1 lg:order-2">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Why Choose Us
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-serif">
            We Transform Vision into <span className="text-primary">Digital Success</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            With a passion for innovation and a commitment to excellence, we partner with businesses
            to create digital solutions that not only meet expectations but exceed them. Our
            collaborative approach ensures your vision comes to life exactly as you imagined.
          </p>

          {/* Features list */}
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: 20 }}
                whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>

          <RegularBtn
            linkProps={{ href: '/about' }}
            RightIcon={ArrowRight}
            rightIconProps={{ className: 'size-4 group-hover:translate-x-1 transition-transform' }}
            text="Learn More About Us"
            className="group"
          />
        </motion.div>
      </div>
    </SectionContainer>
  );
};
