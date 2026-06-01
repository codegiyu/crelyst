/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ClientService } from '@/lib/constants/endpoints';
import { Check, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { PublicContactCTASection } from '@/components/section/shared';
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
  const anim = (delay = 0) => (siteLoading ? {} : ({ opacity: 1, y: 0 } as const));

  return (
    <>
      {/* ───── Description ───── */}
      <SectionContainer>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={anim()}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-muted-foreground md:text-xl">
          {service.description}
        </motion.p>
      </SectionContainer>

      {/* ───── Gallery ───── */}
      {service.gallery && service.gallery.length > 0 && (
        <SectionContainer customContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={anim()}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
            {service.gallery.map((src, i) => (
              <div
                key={i}
                className="group relative min-h-[240px] overflow-hidden rounded-2xl border border-border bg-muted sm:min-h-[280px] md:min-h-[320px] lg:min-h-[380px]">
                <Image
                  src={src}
                  alt={`${service.title} gallery ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </motion.div>
        </SectionContainer>
      )}

      {/* ───── Expertise Breakdown ───── */}
      {service.expertise && (
        <SectionContainer background="muted">
          <SectionHeading
            caption="Expertise"
            title={service.expertise.title}
            spacing="tight"
            className="mb-12"
          />

          <div className="grid gap-8 md:grid-cols-3">
            {service.expertise.breakdown.map((group, gi) => (
              <motion.div
                key={gi}
                initial={{ opacity: 0, y: 30 }}
                whileInView={anim()}
                transition={{ duration: 0.5, delay: gi * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <h3 className="mb-5 font-heading text-lg font-semibold text-foreground">
                  {group.title}
                </h3>
                <ul className="grid gap-3">
                  {group.services.map((s, si) => (
                    <li key={si} className="flex items-center gap-2 text-muted-foreground">
                      <ChevronRight className="h-4 w-4 flex-none text-primary" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* ───── Breakdown Summary Tags ───── */}
      {service.breakdownSummary && service.breakdownSummary.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={anim()}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3">
            {service.breakdownSummary.map((item, i) => (
              <span
                key={i}
                className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-medium text-primary">
                {item}
              </span>
            ))}
          </motion.div>
        </SectionContainer>
      )}

      {/* ───── What Makes Us Unique ───── */}
      {service.whatMakesUsUnique && (
        <SectionContainer background="muted">
          <SectionHeading
            caption="Differentiators"
            title={service.whatMakesUsUnique.title}
            spacing="tight"
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {service.whatMakesUsUnique.groups.map((group, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={anim()}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {group.title}
                  </h3>
                </div>
                <p className="leading-relaxed text-muted-foreground">{group.text}</p>
              </motion.div>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* ───── Process ───── */}
      {service.process && service.process.length > 0 && (
        <SectionContainer>
          <SectionHeading caption="Process" title="Our Process" spacing="tight" className="mb-12" />

          <div className="relative mx-auto max-w-3xl grid gap-0">
            {service.process
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={anim()}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="relative flex gap-6 pb-10 last:pb-0">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {i + 1}
                    </div>
                    {i < service.process!.length - 1 && (
                      <div className="mt-2 flex-1 w-px bg-border" />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </SectionContainer>
      )}

      {/* ───── Benefits ───── */}
      {service.benefits && service.benefits.length > 0 && (
        <SectionContainer background="muted">
          <SectionHeading
            caption="Benefits"
            title="Key Benefits"
            spacing="tight"
            className="mb-12"
          />

          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            {service.benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={anim()}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10 mt-0.5">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-foreground">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* ───── Package Pricing ───── */}
      {service.packagePricing && service.packagePricing.length > 0 && (
        <SectionContainer>
          <SectionHeading
            caption="Pricing"
            title="Packages & Pricing"
            spacing="tight"
            className="mb-12"
          />

          <div className="grid gap-16">
            {service.packagePricing.map(category => (
              <div key={category.id}>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={anim()}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="mb-8 text-center font-heading text-xl font-semibold capitalize text-foreground md:text-2xl">
                  {category.id.replace(/_/g, ' ')}
                </motion.h3>

                <div className="grid gap-6 md:grid-cols-3">
                  {category.packages.map((pkg, pi) => {
                    const isMiddle = pi === 1;
                    const priceLabel =
                      pkg.priceRange.length === 1
                        ? `${(pkg.priceRange[0] / 1000).toLocaleString()}k`
                        : `${(pkg.priceRange[0] / 1000).toLocaleString()}k – ${(pkg.priceRange[1] / 1000).toLocaleString()}k`;

                    return (
                      <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={anim()}
                        transition={{ duration: 0.5, delay: pi * 0.1 }}
                        viewport={{ once: true }}
                        className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 ${
                          isMiddle ? 'border-primary bg-primary/5' : 'border-border bg-card'
                        }`}>
                        {isMiddle && (
                          <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold uppercase text-primary-foreground">
                            Popular
                          </span>
                        )}
                        <p className="mb-1 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                          {pkg.id}
                        </p>
                        <p className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
                          &#8358;{priceLabel}
                        </p>
                        <ul className="grid gap-2.5">
                          {pkg.benefits.map((b, bi) => (
                            <li
                              key={bi}
                              className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* ───── FAQ ───── */}
      {service.faq && service.faq.length > 0 && (
        <SectionContainer background="muted">
          <SectionHeading
            caption="FAQ"
            title="Frequently Asked Questions"
            spacing="tight"
            className="mb-12"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={anim()}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {service.faq
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="leading-relaxed text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </motion.div>
        </SectionContainer>
      )}

      {/* ───── Tags ───── */}
      {service.tags && service.tags.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={anim()}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2">
            {service.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {tag}
              </span>
            ))}
          </motion.div>
        </SectionContainer>
      )}

      {/* ───── CTA ───── */}
      <PublicContactCTASection
        caption="Get Started"
        title="Ready to Get Started?"
        description={
          <>
            Let&apos;s discuss how we can help you achieve your goals with our{' '}
            {service.title.toLowerCase()} solutions.
          </>
        }
        buttonLabel="Contact Us Today"
        motionDelay={0.4}
      />
    </>
  );
};
