'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ProjectWorkflow } from '@/lib/types/site-settings';

type ProjectWorkflowSectionProps = {
  workflow: ProjectWorkflow;
};

export const ProjectWorkflowSection = ({ workflow }: ProjectWorkflowSectionProps) => {
  const { siteLoading } = useSiteStore(state => state);
  const anim = (_delay = 0) => (siteLoading ? {} : ({ opacity: 1, y: 0 } as const));
  const steps = [...workflow.steps].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (steps.length === 0) return null;

  return (
    <SectionContainer background="muted">
      <SectionHeading
        caption="Workflow"
        title={workflow.title}
        text={workflow.subtitle}
        spacing="tight"
        className="mb-12"
      />

      <div className="content-prose-center mx-auto grid gap-0">
        {steps.map((step, index) => (
          <motion.div
            key={`${step.title}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={anim(index * 0.08)}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            viewport={{ once: true }}
            className="relative flex gap-6 pb-10 last:pb-0">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {String(index + 1).padStart(2, '0')}
              </div>
              {index < steps.length - 1 ? <div className="mt-2 flex-1 w-px bg-border" /> : null}
            </div>
            <div className="pt-1.5">
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
};
