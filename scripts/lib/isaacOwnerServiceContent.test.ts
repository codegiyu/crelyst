import { describe, expect, it } from 'vitest';
import {
  getIsaacServiceContentBySlug,
  ISAAC_PROJECT_WORKFLOW,
  ISAAC_SERVICE_CONTENT_UPDATES,
} from './isaacOwnerServiceContent';

describe('isaacOwnerServiceContent', () => {
  it('defines updates for packaging, brand strategy, and additional services', () => {
    expect(ISAAC_SERVICE_CONTENT_UPDATES.map(entry => entry.slug)).toEqual([
      'packaging-design',
      'brand-strategy',
      'additional-services',
    ]);
  });

  it('includes four packaging tiers', () => {
    const packaging = getIsaacServiceContentBySlug('packaging-design');
    const packages = (packaging?.payload.packagePricing as { packages: unknown[] }[])[0].packages;

    expect(packages).toHaveLength(4);
  });

  it('includes three additional service packages and a pricing footer', () => {
    const additional = getIsaacServiceContentBySlug('additional-services');
    const packages = (additional?.payload.packagePricing as { packages: unknown[] }[])[0].packages;

    expect(packages).toHaveLength(3);
    expect(additional?.payload.pricingFooter).toMatchObject({
      title: 'Custom Projects Are Welcome',
    });
  });

  it('defines a six-step project workflow', () => {
    expect(ISAAC_PROJECT_WORKFLOW.steps).toHaveLength(6);
    expect(ISAAC_PROJECT_WORKFLOW.subtitle).toBe('From brief to final delivery');
  });
});
