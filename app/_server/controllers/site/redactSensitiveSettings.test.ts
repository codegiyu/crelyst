import { describe, expect, it } from 'vitest';
import type { ISiteSettings } from '../../lib/types/constants';
import { redactSensitiveSettings, redactSensitiveSliceValue } from './redactSensitiveSettings';

describe('redactSensitiveSliceValue', () => {
  it('strips sensitive email keys while keeping fromName', () => {
    const result = redactSensitiveSliceValue('email', {
      fromEmail: 'noreply@example.com',
      fromName: 'Crelyst',
      replyToEmail: 'hello@example.com',
    });

    expect(result).toEqual({ fromName: 'Crelyst' });
  });

  it('leaves non-sensitive slices unchanged', () => {
    const branding = { primaryBrandColor: '#ff0000', faviconUrl: '/favicon.ico' };
    expect(redactSensitiveSliceValue('branding', branding)).toEqual(branding);
  });
});

describe('redactSensitiveSettings', () => {
  it('redacts email slice in a full settings document', () => {
    const settings: Partial<ISiteSettings> = {
      _id: 'settings',
      email: {
        fromEmail: 'noreply@example.com',
        fromName: 'Crelyst',
        replyToEmail: 'hello@example.com',
      },
      branding: {
        primaryBrandColor: '#111111',
        secondaryBrandColor: '#222222',
        faviconUrl: '/favicon.ico',
      },
    };

    const result = redactSensitiveSettings(settings, 'all');

    expect(result.email).toEqual({ fromName: 'Crelyst' });
    expect(result.branding).toEqual(settings.branding);
  });

  it('redacts a single email slice response', () => {
    const settings = {
      email: {
        fromEmail: 'noreply@example.com',
        fromName: 'Crelyst',
        replyToEmail: 'hello@example.com',
      },
    };

    const result = redactSensitiveSettings(settings, 'email');

    expect(result).toEqual({ email: { fromName: 'Crelyst' } });
  });
});
