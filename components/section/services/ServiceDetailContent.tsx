'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ClientService } from '@/lib/constants/endpoints';
import { Check, Clock, DollarSign, TrendingUp, HelpCircle } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ServiceDetailContentProps {
  service: ClientService;
}

export const ServiceDetailContent = ({ service }: ServiceDetailContentProps) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <>
      {/* Main Image - Full Width */}
      {service.image && (
        <SectionContainer customContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden aspect-video bg-muted">
            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          </motion.div>
        </SectionContainer>
      )}

      {/* Video - Full Width */}
      {service.videoUrl && (
        <SectionContainer customContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden aspect-video bg-muted relative">
            <iframe
              src={service.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${service.title} video`}
            />
          </motion.div>
        </SectionContainer>
      )}

      {/* Description */}
      <SectionContainer>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="prose prose-lg max-w-none">
          <p className="text-muted-foreground text-lg leading-relaxed">{service.description}</p>
        </motion.div>
      </SectionContainer>

      {/* Benefits */}
      {service.benefits && service.benefits.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 font-serif">
              Key Benefits
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {service.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-border">
                  <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </SectionContainer>
      )}

      {/* Features */}
      {service.features && service.features.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}>
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
        </SectionContainer>
      )}

      {/* Process */}
      {service.process && service.process.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 font-serif">
              Our Process
            </h2>
            <div className="space-y-6">
              {service.process
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 p-6 bg-muted/30 rounded-lg border-l-4 border-primary">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </SectionContainer>
      )}

      {/* Pricing & Duration */}
      {(service.pricing || service.duration) && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6">
            {service.pricing && (
              <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Pricing</h3>
                </div>
                {service.pricing.startingPrice && (
                  <p className="text-2xl font-bold text-foreground mb-2">
                    {service.pricing.currency || 'USD'}{' '}
                    {service.pricing.startingPrice.toLocaleString()}
                    {service.pricing.priceRange && (
                      <span className="text-lg font-normal text-muted-foreground">
                        {' '}
                        - {service.pricing.priceRange}
                      </span>
                    )}
                  </p>
                )}
                {service.pricing.priceRange && !service.pricing.startingPrice && (
                  <p className="text-xl font-semibold text-foreground mb-2">
                    {service.pricing.priceRange}
                  </p>
                )}
                {service.pricing.pricingModel && (
                  <p className="text-sm text-muted-foreground capitalize mb-2">
                    {service.pricing.pricingModel.replace('-', ' ')} pricing
                  </p>
                )}
                {service.pricing.notes && (
                  <p className="text-sm text-muted-foreground">{service.pricing.notes}</p>
                )}
              </div>
            )}
            {service.duration && (
              <div className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Timeline</h3>
                </div>
                {service.duration.typicalDuration && (
                  <p className="text-xl font-semibold text-foreground mb-2">
                    {service.duration.typicalDuration}
                  </p>
                )}
                {service.duration.minWeeks && service.duration.maxWeeks && (
                  <p className="text-sm text-muted-foreground">
                    Typically {service.duration.minWeeks} - {service.duration.maxWeeks} weeks
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </SectionContainer>
      )}

      {/* Additional Content Sections */}
      {service.additionalContent && service.additionalContent.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            viewport={{ once: true }}
            className="space-y-8">
            {service.additionalContent
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="prose prose-lg max-w-none">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-serif">
                    {section.title}
                  </h2>
                  <div
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        section.type === 'html' || section.type === 'markdown'
                          ? section.content
                          : section.content.replace(/\n/g, '<br />'),
                    }}
                  />
                </motion.div>
              ))}
          </motion.div>
        </SectionContainer>
      )}

      {/* FAQ */}
      {service.faq && service.faq.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {service.faq
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </motion.div>
        </SectionContainer>
      )}

      {/* Tags */}
      {service.tags && service.tags.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            viewport={{ once: true }}>
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </SectionContainer>
      )}

      {/* CTA */}
      <SectionContainer>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
      </SectionContainer>
    </>
  );
};
