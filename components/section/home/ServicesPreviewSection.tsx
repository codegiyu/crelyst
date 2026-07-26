'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ClientService } from '@/lib/constants/endpoints';
import { ArrowRight } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { ServicePreviewCard } from './ServicePreviewCard';
import { cn } from '@/lib/utils';

const HOME_SERVICES_PREVIEW_LIMIT = 4;

type ServicesRowProps = {
  row: ClientService[];
  rowIndex: number;
};

type ServicesRowItemProps = {
  service: ClientService;
  rowIndex: number;
  itemIndex: number;
  firstSpan: string;
  secondSpan: string;
};

const ServicesRowItem = ({
  service,
  rowIndex,
  itemIndex,
  firstSpan,
  secondSpan,
}: ServicesRowItemProps) => {
  const serviceIndex = rowIndex * 2 + itemIndex;
  const spanClass = itemIndex === 0 ? firstSpan : secondSpan;

  return (
    <div className={cn(spanClass)}>
      <ServicePreviewCard service={service} index={serviceIndex} />
    </div>
  );
};

const ServicesRow = ({ row, rowIndex }: ServicesRowProps) => {
  const isOddRow = rowIndex % 2 === 0;
  const isEvenRow = !isOddRow;
  const hasSingleItem = row.length === 1;
  const firstSpan = isOddRow ? 'lg:col-span-2' : 'lg:col-span-1';
  const secondSpan = isOddRow ? 'lg:col-span-1' : 'lg:col-span-2';

  if (hasSingleItem && isEvenRow) {
    const service = row[0]!;
    const serviceIndex = rowIndex * 2;

    return (
      <div key={`faux-slot-${service.slug}`} className="contents">
        <div aria-hidden className="hidden lg:block lg:col-span-1" />
        <div className={secondSpan}>
          <ServicePreviewCard service={service} index={serviceIndex} />
        </div>
      </div>
    );
  }

  return (
    <div key={`row-${rowIndex}`} className="contents">
      {row.map((service, itemIndex) => (
        <ServicesRowItem
          key={service.slug}
          service={service}
          rowIndex={rowIndex}
          itemIndex={itemIndex}
          firstSpan={firstSpan}
          secondSpan={secondSpan}
        />
      ))}
    </div>
  );
};

const ServicesGrid = ({ services }: { services: ClientService[] }) => {
  const serviceRows: ClientService[][] = [];

  for (let i = 0; i < services.length; i += 2) {
    serviceRows.push(services.slice(i, i + 2));
  }

  return (
    <div className="layout-grid-cards">
      {serviceRows.map((row, rowIndex) => (
        <ServicesRow key={`services-row-${rowIndex}`} row={row} rowIndex={rowIndex} />
      ))}
    </div>
  );
};

export const ServicesPreviewSection = ({ services }: { services: ClientService[] }) => {
  const { siteLoading } = useSiteStore(state => state);

  const activeServices = services
    .filter(s => s.isActive)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const displayServices = activeServices.slice(0, HOME_SERVICES_PREVIEW_LIMIT);
  const showSeeMore = activeServices.length > HOME_SERVICES_PREVIEW_LIMIT;

  return (
    <SectionContainer>
      <SectionHeading
        caption="Services"
        title="What We Create"
        text="From photography to packaging, we bring your brand's vision to life through powerful design and visual storytelling"
      />

      {displayServices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={siteLoading ? {} : { opacity: 1 }}
          className="text-center py-16">
          <p className="text-muted-foreground text-lg">Services coming soon.</p>
        </motion.div>
      ) : (
        <>
          <ServicesGrid services={displayServices} />

          {showSeeMore ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 text-center">
              <RegularBtn
                linkProps={{ href: '/services' }}
                variant="outline"
                RightIcon={ArrowRight}
                rightIconProps={{
                  className: 'size-4 group-hover:translate-x-1 transition-transform',
                }}
                text="See More Services"
                className="group px-8"
              />
            </motion.div>
          ) : null}
        </>
      )}
    </SectionContainer>
  );
};
