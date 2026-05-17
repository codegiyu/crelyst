import { describe, expect, it, vi } from 'vitest';
import { AppError } from './appError';
import { assertWebhookSecretConfigured } from './verifyWebhookSecret';

vi.mock('@/lib/config/environment', () => ({
  ENVIRONMENT: {
    WEBHOOK: { SECRET: 'test-webhook-secret' },
  },
}));

function mockRequest(headers: Record<string, string>) {
  return {
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
  } as never;
}

describe('assertWebhookSecretConfigured', () => {
  it('rejects when secret header is missing', () => {
    expect(() => assertWebhookSecretConfigured(mockRequest({}))).toThrow(AppError);
  });

  it('rejects when secret header does not match', () => {
    expect(() =>
      assertWebhookSecretConfigured(mockRequest({ 'x-webhook-secret': 'wrong' }))
    ).toThrow(AppError);
  });

  it('accepts matching x-webhook-secret header', () => {
    expect(() =>
      assertWebhookSecretConfigured(mockRequest({ 'x-webhook-secret': 'test-webhook-secret' }))
    ).not.toThrow();
  });

  it('accepts matching Authorization bearer token', () => {
    expect(() =>
      assertWebhookSecretConfigured(mockRequest({ authorization: 'Bearer test-webhook-secret' }))
    ).not.toThrow();
  });
});
