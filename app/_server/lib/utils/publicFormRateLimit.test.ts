import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from './appError';
import { assertPublicFormRateLimit } from './publicFormRateLimit';

describe('assertPublicFormRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows submissions under the per-window cap', () => {
    for (let i = 0; i < 8; i++) {
      expect(() => assertPublicFormRateLimit('1.2.3.4', 'quote-request')).not.toThrow();
    }
  });

  it('throws 429 when the cap is exceeded', () => {
    for (let i = 0; i < 8; i++) {
      assertPublicFormRateLimit('9.9.9.9', 'work-with-us');
    }

    expect(() => assertPublicFormRateLimit('9.9.9.9', 'work-with-us')).toThrow(AppError);
    try {
      assertPublicFormRateLimit('9.9.9.9', 'work-with-us');
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect((e as AppError).statusCode).toBe(429);
    }
  });

  it('resets the bucket after the window elapses', () => {
    for (let i = 0; i < 8; i++) {
      assertPublicFormRateLimit('5.5.5.5', 'quote-request');
    }

    vi.advanceTimersByTime(61_000);

    expect(() => assertPublicFormRateLimit('5.5.5.5', 'quote-request')).not.toThrow();
  });
});
