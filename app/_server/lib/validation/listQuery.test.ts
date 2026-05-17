import { describe, expect, it } from 'vitest';
import { auditLogsListQuerySchema, formSubmissionsListQuerySchema } from './listQuery';

describe('formSubmissionsListQuerySchema', () => {
  it('accepts valid quote-request query', () => {
    const parsed = formSubmissionsListQuerySchema.parse({
      formType: 'quote-request',
      limit: '25',
    });
    expect(parsed.formType).toBe('quote-request');
    expect(parsed.limit).toBe(25);
    expect(parsed.cursor).toBeNull();
  });

  it('rejects invalid formType', () => {
    expect(() =>
      formSubmissionsListQuerySchema.parse({ formType: 'other', limit: '10' })
    ).toThrow();
  });

  it('rejects limit above 100', () => {
    expect(() =>
      formSubmissionsListQuerySchema.parse({ formType: 'work-with-us', limit: '500' })
    ).toThrow();
  });
});

describe('auditLogsListQuerySchema', () => {
  it('defaults limit to 50 when omitted', () => {
    const parsed = auditLogsListQuerySchema.parse({});
    expect(parsed.limit).toBe(50);
  });

  it('trims empty search query to undefined', () => {
    const parsed = auditLogsListQuerySchema.parse({ q: '   ' });
    expect(parsed.q).toBeUndefined();
  });
});
