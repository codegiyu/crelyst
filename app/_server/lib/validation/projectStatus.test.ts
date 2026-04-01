import { describe, it, expect } from 'vitest';
import { PROJECT_STATUSES } from '../types/constants';
import { projectStatusSchema } from './projectStatus';

describe('projectStatusSchema', () => {
  it.each([...PROJECT_STATUSES])('accepts %s', status => {
    expect(projectStatusSchema.safeParse(status).success).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(projectStatusSchema.safeParse('not-a-status').success).toBe(false);
  });
});
