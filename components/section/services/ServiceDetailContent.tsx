'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ClientService } from '@/lib/constants/endpoints';
import { Check } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';

interface ServiceDetailContentProps {
  service: ClientService;
}

export const ServiceDetailContent = ({ service }: ServiceDetailContentProps) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <SectionContainer>
      <div className="max-w-4xl mx-auto">
        {/* Main Image */}
        {service.image && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 rounded-2xl overflow-hidden aspect-video bg-muted">
            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="prose prose-lg max-w-none mb-12">
          <p className="text-muted-foreground text-lg leading-relaxed">{service.description}</p>
        </motion.div>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 font-serif">
              What&apos;s Included
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {service.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-border">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-serif">
            Ready to Get Started?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Let&apos;s discuss how we can help you achieve your goals with our{' '}
            {service.title.toLowerCase()} solutions.
          </p>
          <RegularBtn linkProps={{ href: '/contact' }} className="px-8">
            Contact Us Today
          </RegularBtn>
        </motion.div>
      </div>
    </SectionContainer>
  );
};
